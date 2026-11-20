<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DispositivoTokenFcm;
use App\Models\Notification;
use App\Models\NotificacionEnvio;
use App\Models\User;
use App\Services\Notifications\NotificationPresenter;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Panel administrativo de notificaciones (admin / manager).
 *
 * "Evento" = todas las filas de `notifications` creadas por un mismo hecho
 * (una proforma actualizada → N destinatarios). Se agrupa por `grupo_id`; las
 * filas anteriores a esa columna se agrupan por tipo + entidad + segundo.
 *
 * "Leída" = read_at con valor. Las archivadas (read = true, read_at = NULL)
 * vienen del archivado inicial y no cuentan como leídas.
 */
class NotificacionesAdminController extends Controller
{
    /** Clave de agrupación por evento (SQL, PostgreSQL). Columnas sin prefijo a propósito. */
    private const CLAVE_EVENTO = "COALESCE(grupo_id::text, type || '|' || COALESCE(proforma_id, 0) || '|' || COALESCE(venta_id, 0) || '|' || to_char(date_trunc('second', created_at), 'YYYYMMDDHH24MISS'))";

    public function index(): Response
    {
        return Inertia::render('admin/notificaciones/index');
    }

    /**
     * Indicadores del rango: emitidas, eventos, % leídas, push y dispositivos.
     */
    public function resumen(Request $request): JsonResponse
    {
        [$desde, $hasta] = $this->rango($request);

        $base = Notification::whereBetween('created_at', [$desde, $hasta]);

        $totales = (clone $base)->selectRaw(
            'count(*) as emitidas, count(read_at) as leidas, ' .
            'count(*) filter (where read = true and read_at is null) as archivadas, ' .
            'count(distinct ' . self::CLAVE_EVENTO . ') as eventos'
        )->first();

        $porTipo = (clone $base)
            ->selectRaw('type, count(*) as emitidas, count(read_at) as leidas')
            ->groupBy('type')->orderByDesc('emitidas')->limit(10)->get()
            ->map(fn ($r) => [
                'type'      => $r->type,
                'categoria' => NotificationPresenter::categoria($r->type),
                'emitidas'  => (int) $r->emitidas,
                'leidas'    => (int) $r->leidas,
            ]);

        $push = NotificacionEnvio::whereBetween('created_at', [$desde, $hasta])
            ->selectRaw("count(*) filter (where estado = 'enviado') as enviados, count(*) filter (where estado = 'fallido') as fallidos")
            ->first();

        $emitidas = (int) $totales->emitidas;

        return response()->json([
            'desde'       => $desde->toDateString(),
            'hasta'       => $hasta->toDateString(),
            'emitidas'    => $emitidas,
            'eventos'     => (int) $totales->eventos,
            'leidas'      => (int) $totales->leidas,
            'archivadas'  => (int) $totales->archivadas,
            'pct_leidas'  => $emitidas > 0 ? round($totales->leidas * 100 / $emitidas, 1) : 0,
            'push'        => [
                'enviados' => (int) $push->enviados,
                'fallidos' => (int) $push->fallidos,
            ],
            'dispositivos' => [
                'activos'  => DispositivoTokenFcm::where('activo', true)->whereNotNull('user_id')->count(),
                'usuarios' => DispositivoTokenFcm::where('activo', true)->whereNotNull('user_id')->distinct('user_id')->count('user_id'),
            ],
            'por_tipo'    => $porTipo,
        ]);
    }

    /**
     * Eventos agrupados (paginado). Filtros: desde, hasta, categoria, tipo, rol, usuario_id.
     * Con rol/usuario, los conteos se limitan a esos destinatarios.
     */
    public function eventos(Request $request): JsonResponse
    {
        $request->validate([
            'categoria'  => 'nullable|in:' . implode(',', NotificationPresenter::CATEGORIAS),
            'tipo'       => 'nullable|string|max:100',
            'rol'        => 'nullable|string|max:60',
            'usuario_id' => 'nullable|integer',
            'page'       => 'nullable|integer|min:1',
            'per_page'   => 'nullable|integer|min:5|max:100',
        ]);

        [$desde, $hasta] = $this->rango($request);
        $porPagina = (int) $request->input('per_page', 25);
        $pagina    = (int) $request->input('page', 1);

        $query = DB::table('notifications')->whereBetween('created_at', [$desde, $hasta]);
        $this->aplicarFiltrosDestinatarios($query, $request);

        $agrupado = $query->selectRaw(
            self::CLAVE_EVENTO . ' as clave, min(type) as type, min(id) as muestra_id, ' .
            'min(created_at) as fecha, count(*) as destinatarios, count(read_at) as leidas'
        )->groupByRaw(self::CLAVE_EVENTO);

        $total = DB::query()->fromSub($agrupado, 'e')->count();

        $filas = DB::query()->fromSub($agrupado, 'e')
            ->orderByDesc('fecha')
            ->offset(($pagina - 1) * $porPagina)
            ->limit($porPagina)
            ->get();

        // Texto del evento a partir de una fila de muestra
        $muestras = Notification::whereIn('id', $filas->pluck('muestra_id'))->get()->keyBy('id');

        $data = $filas->map(function ($f) use ($muestras) {
            $p = isset($muestras[$f->muestra_id]) ? NotificationPresenter::present($muestras[$f->muestra_id]) : null;

            return [
                'clave'         => $f->clave,
                'type'          => $f->type,
                'categoria'     => NotificationPresenter::categoria($f->type),
                'titulo'        => $p['titulo'] ?? $f->type,
                'mensaje'       => $p['mensaje'] ?? '',
                'url'           => $p['url'] ?? null,
                'fecha'         => Carbon::parse($f->fecha)->toIso8601String(),
                'destinatarios' => (int) $f->destinatarios,
                'leidas'        => (int) $f->leidas,
            ];
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $pagina,
                'last_page'    => max(1, (int) ceil($total / $porPagina)),
                'total'        => $total,
            ],
        ]);
    }

    /**
     * Destinatarios de un evento: quién lo recibió, quién lo leyó y cuándo.
     */
    public function destinatarios(Request $request): JsonResponse
    {
        $request->validate(['clave' => 'required|string|max:300']);
        $clave = $request->input('clave');

        $query = Notification::query()->with(['user:id,name', 'user.roles:id,name']);

        if (preg_match('/^[0-9a-f-]{36}$/i', $clave)) {
            $query->where('grupo_id', $clave);
        } else {
            // type|proforma_id|venta_id|YYYYMMDDHHMMSS  (filas anteriores a grupo_id)
            $partes = explode('|', $clave);
            if (count($partes) !== 4) {
                return response()->json(['message' => 'Clave de evento inválida'], 422);
            }
            [$type, $proformaId, $ventaId, $segundo] = $partes;
            $inicio = Carbon::createFromFormat('YmdHis', $segundo);

            $query->whereNull('grupo_id')
                ->where('type', $type)
                ->whereRaw('COALESCE(proforma_id, 0) = ?', [(int) $proformaId])
                ->whereRaw('COALESCE(venta_id, 0) = ?', [(int) $ventaId])
                ->where('created_at', '>=', $inicio)
                ->where('created_at', '<', $inicio->copy()->addSecond());
        }

        $this->aplicarFiltrosDestinatarios($query, $request);

        $filas = $query->orderByRaw('read_at IS NULL, read_at')->limit(500)->get();

        return response()->json([
            'data' => $filas->map(fn ($n) => [
                'user_id'   => $n->user_id,
                'nombre'    => $n->user?->name ?? "Usuario #{$n->user_id}",
                'roles'     => $n->user?->roles->pluck('name')->values() ?? [],
                'estado'    => $n->read_at ? 'leida' : ($n->read ? 'archivada' : 'no_leida'),
                'read_at'   => $n->read_at?->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Historial de envíos push. Filtros: desde, hasta, estado, tipo, usuario_id.
     */
    public function envios(Request $request): JsonResponse
    {
        $request->validate([
            'estado'     => 'nullable|in:enviado,fallido',
            'tipo'       => 'nullable|string|max:100',
            'usuario_id' => 'nullable|integer',
            'per_page'   => 'nullable|integer|min:5|max:100',
        ]);
        [$desde, $hasta] = $this->rango($request);

        $page = NotificacionEnvio::with('user:id,name')
            ->whereBetween('created_at', [$desde, $hasta])
            ->when($request->input('estado'), fn ($q, $v) => $q->where('estado', $v))
            ->when($request->input('tipo'), fn ($q, $v) => $q->where('tipo', $v))
            ->when($request->input('usuario_id'), fn ($q, $v) => $q->where('user_id', $v))
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 25));

        return response()->json([
            'data' => collect($page->items())->map(fn ($e) => [
                'id'            => $e->id,
                'fecha'         => $e->created_at?->toIso8601String(),
                'tipo'          => $e->tipo,
                'titulo'        => $e->titulo,
                'usuario'       => $e->user?->name ?? ($e->user_id ? "Usuario #{$e->user_id}" : 'Sin usuario'),
                'dispositivo'   => $e->token_sufijo ? '…' . $e->token_sufijo : null,
                'estado'        => $e->estado,
                'error_codigo'  => $e->error_codigo,
                'error_detalle' => $e->error_detalle,
            ]),
            'meta' => $this->metaPaginacion($page),
        ]);
    }

    /**
     * Dispositivos FCM registrados. Filtros: buscar (usuario o dispositivo), activo.
     */
    public function dispositivos(Request $request): JsonResponse
    {
        $request->validate([
            'buscar'   => 'nullable|string|max:100',
            'activo'   => 'nullable|in:0,1',
            'per_page' => 'nullable|integer|min:5|max:100',
        ]);

        $page = DispositivoTokenFcm::with(['usuario:id,name', 'usuario.roles:id,name'])
            ->when($request->filled('activo'), fn ($q) => $q->where('activo', $request->boolean('activo')))
            ->when($request->input('buscar'), function ($q, $buscar) {
                $q->where(function ($w) use ($buscar) {
                    $w->where('device_name', 'ilike', "%{$buscar}%")
                        ->orWhereHas('usuario', fn ($u) => $u->where('name', 'ilike', "%{$buscar}%"));
                });
            })
            ->orderByDesc('ultimo_sync')
            ->paginate((int) $request->input('per_page', 25));

        return response()->json([
            'data' => collect($page->items())->map(fn ($d) => [
                'id'          => $d->id,
                'usuario'     => $d->usuario?->name ?? 'Sin usuario',
                'roles'       => $d->usuario?->roles->pluck('name')->values() ?? [],
                'plataforma'  => $d->platform,
                'dispositivo' => $d->device_name,
                'app_version' => $d->app_version,
                'token'       => '…' . substr((string) $d->token_fcm, -12),
                'activo'      => (bool) $d->activo,
                'ultimo_sync' => $d->ultimo_sync?->toIso8601String(),
            ]),
            'meta' => $this->metaPaginacion($page),
        ]);
    }

    /** Búsqueda de usuarios para el filtro. */
    public function usuarios(Request $request): JsonResponse
    {
        $q = trim((string) $request->input('q', ''));

        return response()->json(
            User::where('activo', true)
                ->when($q !== '', fn ($w) => $w->where('name', 'ilike', "%{$q}%"))
                ->orderBy('name')->limit(20)->get(['id', 'name'])
        );
    }

    // ─────────────────────────────────────────────────────────────

    /** @return array{0: Carbon, 1: Carbon} Rango del filtro (por defecto: hoy). */
    private function rango(Request $request): array
    {
        $request->validate([
            'desde' => 'nullable|date',
            'hasta' => 'nullable|date|after_or_equal:desde',
        ]);

        $desde = $request->filled('desde') ? Carbon::parse($request->input('desde'))->startOfDay() : today();
        $hasta = $request->filled('hasta') ? Carbon::parse($request->input('hasta'))->endOfDay() : today()->endOfDay();

        return [$desde, $hasta];
    }

    /**
     * Filtros que recortan filas de `notifications` (categoría, tipo, rol, usuario).
     *
     * @param  \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder  $query
     */
    private function aplicarFiltrosDestinatarios($query, Request $request): void
    {
        if ($categoria = $request->input('categoria')) {
            NotificationPresenter::aplicarCategoria($query, $categoria);
        }
        if ($tipo = $request->input('tipo')) {
            $query->where('type', $tipo);
        }
        if ($usuarioId = $request->input('usuario_id')) {
            $query->where('user_id', (int) $usuarioId);
        }
        if ($rol = $request->input('rol')) {
            $query->whereIn('user_id', function ($sub) use ($rol) {
                $sub->select('mhr.model_id')
                    ->from('model_has_roles as mhr')
                    ->join('roles as r', 'r.id', '=', 'mhr.role_id')
                    ->where('mhr.model_type', User::class)
                    ->where('r.name', $rol);
            });
        }
    }

    private function metaPaginacion($page): array
    {
        return [
            'current_page' => $page->currentPage(),
            'last_page'    => $page->lastPage(),
            'total'        => $page->total(),
        ];
    }
}
