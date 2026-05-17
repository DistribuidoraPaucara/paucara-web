<?php

namespace App\Http\Controllers;

use App\Models\AuditoriaCaja;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controller: AuditoriaCajaController
 *
 * Responsabilidades:
 * ✅ Mostrar logs de auditoría de cajas
 * ✅ Filtrar por usuario, fecha, acción
 * ✅ Detectar actividad sospechosa
 * ✅ Generar reportes de auditoría
 *
 * Rutas:
 * - GET /admin/cajas/auditoria - Listar todos los intentos
 * - GET /admin/cajas/auditoria/{id} - Ver detalle de intento
 * - GET /admin/cajas/auditoria/alertas - Ver intentos fallidos
 */
class AuditoriaCajaController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:admin.auditoria')->only(['index', 'alertas', 'show', 'estadisticas']);
    }

    /**
     * Listar todos los intentos de auditoría
     *
     * GET /admin/cajas/auditoria
     */
    public function index(Request $request)
    {
        // Validar filtros
        $filtros = $request->validate([
            'usuario_id' => ['nullable', 'exists:users,id'],
            'accion' => ['nullable', 'string', 'in:INTENTO_SIN_CAJA,OPERACION_EXITOSA,CAJA_ABIERTA,CAJA_CERRADA,ERROR_SISTEMA'],
            'exitosa' => ['nullable', 'boolean'],
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'ip_address' => ['nullable', 'ip'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:100'],
            'sort_by' => ['nullable', 'string', 'in:fecha_intento,user_id,accion,exitosa'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
        ]);

        $query = AuditoriaCaja::with(['usuario', 'caja'])->recientes();

        // Aplicar filtros
        if (!empty($filtros['usuario_id'])) {
            $query->porUsuario($filtros['usuario_id']);
        }

        if (!empty($filtros['accion'])) {
            $query->porAccion($filtros['accion']);
        }

        if (($filtros['exitosa'] ?? null) !== null) {
            $query->where('exitosa', $filtros['exitosa']);
        }

        if (!empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha_intento', '>=', $filtros['fecha_desde']);
        }

        if (!empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha_intento', '<=', $filtros['fecha_hasta']);
        }

        if (!empty($filtros['ip_address'])) {
            $query->where('ip_address', $filtros['ip_address']);
        }

        // Ordenamiento
        $sortBy = $filtros['sort_by'] ?? 'fecha_intento';
        $sortDir = $filtros['sort_dir'] ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        // Paginación
        $perPage = $filtros['per_page'] ?? 50;
        $registrosPaginados = $query->paginate($perPage);

        // Mapear datos al formato esperado por React
        $registros = $registrosPaginados->getCollection()->map(function ($auditoria) {
            return [
                'id' => $auditoria->id,
                'user_id' => $auditoria->user_id,
                'usuario' => $auditoria->usuario->name,
                'tipo_evento' => $auditoria->accion,
                'descripcion' => $auditoria->obtenerDescripcionAccion(),
                'observaciones' => $auditoria->detalle_operacion ?? [],
                'mensaje_error' => $auditoria->mensaje_error,
                'ip_address' => $auditoria->ip_address,
                'user_agent' => $auditoria->user_agent,
                'severidad' => $this->obtenerSeveridad($auditoria->accion, $auditoria->exitosa),
                'created_at' => $auditoria->fecha_intento,
            ];
        })->toArray();

        // Estadísticas de auditoría
        $estadisticas = [
            'total_eventos' => AuditoriaCaja::count(),
            'eventos_sospechosos' => AuditoriaCaja::fallidos()->where('fecha_intento', '>=', now()->subDay())->count(),
            'usuarios_con_intentos' => AuditoriaCaja::distinct('user_id')->count(),
            'evento_mas_comun' => AuditoriaCaja::selectRaw('accion, COUNT(*) as total')
                ->groupBy('accion')
                ->orderByDesc('total')
                ->first()?->accion ?? 'N/A',
        ];

        // Alertas activas
        $alertas = AuditoriaCaja::selectRaw('user_id, accion, COUNT(*) as cantidad, MAX(fecha_intento) as fecha')
            ->where('fecha_intento', '>=', now()->subHour())
            ->fallidos()
            ->groupBy(['user_id', 'accion'])
            ->havingRaw('COUNT(*) >= 3')
            ->with('usuario')
            ->get()
            ->map(function ($alerta) {
                return [
                    'id' => $alerta->id ?? rand(),
                    'usuario' => $alerta->usuario->name,
                    'tipo' => $alerta->accion,
                    'mensaje' => "Múltiples intentos fallidos de: {$alerta->accion}",
                    'cantidad_intentos' => $alerta->cantidad,
                    'fecha' => $alerta->fecha,
                ];
            });

        return Inertia::render('Cajas/Auditoria', [
            'registros' => $registros,
            'alertas' => $alertas,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Obtener severidad basada en acción y éxito
     */
    private function obtenerSeveridad($accion, $exitosa)
    {
        if ($exitosa) return 'bajo';

        return match ($accion) {
            'INTENTO_SIN_CAJA' => 'alto',
            'ERROR_SISTEMA' => 'crítico',
            'ACCESO_DENEGADO' => 'medio',
            default => 'bajo',
        };
    }

    /**
     * Ver detalles de un intento específico
     *
     * GET /admin/cajas/auditoria/{id}
     */
    public function show(int $id)
    {
        $auditoria = AuditoriaCaja::with(['usuario', 'caja', 'aperturaCaja'])->findOrFail($id);

        return Inertia::render('admin/cajas/auditoria/show', [
            'auditoria' => $auditoria,
        ]);
    }

    /**
     * Mostrar intentos sospechosos (múltiples fallos)
     *
     * GET /admin/cajas/auditoria/alertas
     */
    public function alertas()
    {
        // Obtener usuarios con múltiples intentos fallidos en última hora
        $usuariosConAlertas = AuditoriaCaja::selectRaw('user_id, COUNT(*) as total_intentos')
            ->fallidos()
            ->where('fecha_intento', '>=', now()->subHour())
            ->groupBy('user_id')
            ->having('total_intentos', '>=', 3)
            ->with('usuario')
            ->get();

        // Últimos intentos fallidos
        $ultimosIntentossFallidos = AuditoriaCaja::fallidos()
            ->with(['usuario', 'caja'])
            ->recientes()
            ->limit(100)
            ->get();

        // Estadísticas
        $estadisticas = [
            'intentos_hoy' => AuditoriaCaja::whereDate('fecha_intento', today())->count(),
            'intentos_fallidos_hoy' => AuditoriaCaja::fallidos()->whereDate('fecha_intento', today())->count(),
            'usuarios_activos_hoy' => AuditoriaCaja::whereDate('fecha_intento', today())->distinct('user_id')->count(),
            'intentos_ultima_hora' => AuditoriaCaja::where('fecha_intento', '>=', now()->subHour())->count(),
        ];

        return Inertia::render('admin/cajas/auditoria/alertas', [
            'usuarios_con_alertas' => $usuariosConAlertas,
            'ultimos_intentos_fallidos' => $ultimosIntentossFallidos,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Obtener estadísticas de auditoría
     *
     * GET /api/admin/cajas/auditoria/estadisticas
     */
    public function estadisticas(Request $request)
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
        ]);

        $desde = $filtros['fecha_desde'] ? \Carbon\Carbon::parse($filtros['fecha_desde']) : now()->subDays(7);
        $hasta = $filtros['fecha_hasta'] ? \Carbon\Carbon::parse($filtros['fecha_hasta']) : now();

        // Estadísticas por acción
        $porAccion = AuditoriaCaja::selectRaw('accion, COUNT(*) as total, SUM(CASE WHEN exitosa = 1 THEN 1 ELSE 0 END) as exitosos')
            ->whereBetween('fecha_intento', [$desde, $hasta])
            ->groupBy('accion')
            ->get();

        // Intentos sin caja por usuario
        $intentosSinCajaPorUsuario = AuditoriaCaja::selectRaw('user_id, COUNT(*) as total')
            ->intentosSinCaja()
            ->whereBetween('fecha_intento', [$desde, $hasta])
            ->with('usuario')
            ->groupBy('user_id')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // Tendencia diaria
        $tendenciaDiaria = AuditoriaCaja::selectRaw('DATE(fecha_intento) as fecha, COUNT(*) as total, SUM(CASE WHEN exitosa = 1 THEN 1 ELSE 0 END) as exitosos, SUM(CASE WHEN exitosa = 0 THEN 1 ELSE 0 END) as fallidos')
            ->whereBetween('fecha_intento', [$desde, $hasta])
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return response()->json([
            'por_accion' => $porAccion,
            'intentos_sin_caja_por_usuario' => $intentosSinCajaPorUsuario,
            'tendencia_diaria' => $tendenciaDiaria,
            'rango' => [
                'desde' => $desde->format('Y-m-d'),
                'hasta' => $hasta->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Descargar reporteCSV de auditoría
     *
     * GET /admin/cajas/auditoria/exportar
     */
    public function exportar(Request $request)
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'usuario_id' => ['nullable', 'exists:users,id'],
        ]);

        $query = AuditoriaCaja::with('usuario');

        if (!empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha_intento', '>=', $filtros['fecha_desde']);
        }

        if (!empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha_intento', '<=', $filtros['fecha_hasta']);
        }

        if (!empty($filtros['usuario_id'])) {
            $query->where('user_id', $filtros['usuario_id']);
        }

        $auditorias = $query->recientes()->get();

        // Generar CSV
        $csv = "Fecha,Usuario,Email,Acción,Operación,Tipo,Exitosa,IP,Navegador\n";

        foreach ($auditorias as $auditoria) {
            $csv .= sprintf(
                '"%s","%s","%s","%s","%s","%s","%s","%s","%s"' . "\n",
                $auditoria->fecha_intento->format('Y-m-d H:i:s'),
                $auditoria->usuario?->name ?? 'N/A',
                $auditoria->usuario?->email ?? 'N/A',
                $auditoria->obtenerDescripcionAccion(),
                $auditoria->operacion_intentada,
                $auditoria->operacion_tipo ?? 'N/A',
                $auditoria->exitosa ? 'Sí' : 'No',
                $auditoria->ip_address,
                $auditoria->navegador ?? 'N/A'
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=auditoria-cajas-' . now()->format('Y-m-d') . '.csv');
    }
}
