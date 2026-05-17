<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Models\ReservaProforma;
use App\Models\Proforma;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservaProformaController extends Controller
{
    /**
     * Listar reservas con filtros y estadísticas
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 50);
        $filtroTipo = $request->input('tipo', null); // 'inconsistentes', 'proximas_expirar', null
        $filtroEstado = $request->input('estado', null); // 'ACTIVA', 'EXPIRADA', null
        $busqueda = $request->input('busqueda', null);
        $page = $request->input('page', 1);

        $query = ReservaProforma::with([
            'proforma.cliente',
            'proforma.estadoLogistica',
            'stockProducto.producto',
            'stockProducto.almacen'
        ]);

        // Filtro por tipo
        if ($filtroTipo === 'inconsistentes') {
            $query->where('estado', 'ACTIVA')
                ->whereHas('proforma.estadoLogistica', function ($q) {
                    $q->whereIn('nombre', ['CONVERTIDA', 'RECHAZADA', 'VENCIDA']);
                });
        } elseif ($filtroTipo === 'proximas_expirar') {
            $query->where('estado', 'ACTIVA')
                ->where('fecha_expiracion', '<=', now()->addDay())
                ->where('fecha_expiracion', '>', now());
        }

        // Filtro por estado de reserva
        if ($filtroEstado) {
            $query->where('estado', $filtroEstado);
        }

        // Búsqueda por producto (SKU o nombre)
        if ($busqueda) {
            $query->whereHas('stockProducto.producto', function ($q) use ($busqueda) {
                $q->where('sku', 'ilike', "%{$busqueda}%")
                  ->orWhere('nombre', 'ilike', "%{$busqueda}%");
            });
        }

        // Ordenamiento
        $orderBy = $request->input('order_by', 'fecha_expiracion');
        $orderDir = $request->input('order_dir', 'asc');
        $query->orderBy($orderBy, $orderDir);

        $reservas = $query->paginate($perPage);

        // Estadísticas
        $stats = [
            'total_activas' => ReservaProforma::where('estado', 'ACTIVA')->count(),
            'inconsistentes' => ReservaProforma::where('estado', 'ACTIVA')
                ->whereHas('proforma.estadoLogistica', function ($q) {
                    $q->whereIn('nombre', ['CONVERTIDA', 'RECHAZADA', 'VENCIDA']);
                })
                ->count(),
            'proximas_expirar' => ReservaProforma::where('estado', 'ACTIVA')
                ->where('fecha_expiracion', '<=', now()->addDay())
                ->where('fecha_expiracion', '>', now())
                ->count(),
            'stock_bloqueado' => ReservaProforma::where('estado', 'ACTIVA')
                ->sum('cantidad_reservada'),
        ];

        return Inertia::render('Inventario/Reservas/Index', [
            'reservas' => $reservas,
            'stats' => $stats,
            'filtros' => [
                'tipo' => $filtroTipo,
                'estado' => $filtroEstado,
                'busqueda' => $busqueda,
                'page' => $page,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Liberar una reserva específica
     */
    public function liberar(int $id)
    {
        try {
            $reserva = ReservaProforma::findOrFail($id);

            if ($reserva->estado !== 'ACTIVA') {
                return back()->with('error', 'Solo se pueden liberar reservas activas');
            }

            DB::transaction(function () use ($reserva) {
                $reserva->liberar();

                Log::info('Reserva liberada manualmente', [
                    'reserva_id' => $reserva->id,
                    'usuario_id' => auth()->id(),
                    'cantidad' => $reserva->cantidad_reservada,
                    'proforma_id' => $reserva->proforma_id,
                ]);
            });

            return back()->with('success', 'Reserva liberada correctamente');
        } catch (\Exception $e) {
            Log::error('Error liberando reserva', [
                'reserva_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Error al liberar la reserva: ' . $e->getMessage());
        }
    }

    /**
     * Liberar múltiples reservas
     */
    public function liberarMasivo(Request $request)
    {
        $validated = $request->validate([
            'reserva_ids' => 'required|array|min:1',
            'reserva_ids.*' => 'integer|exists:reservas_proforma,id',
        ]);

        try {
            $reservas = ReservaProforma::whereIn('id', $validated['reserva_ids'])
                ->where('estado', 'ACTIVA')
                ->get();

            if ($reservas->isEmpty()) {
                return back()->with('error', 'No se encontraron reservas activas para liberar');
            }

            $cantidadLiberada = 0;

            DB::transaction(function () use ($reservas, &$cantidadLiberada) {
                foreach ($reservas as $reserva) {
                    $cantidadLiberada += $reserva->cantidad_reservada;
                    $reserva->liberar();
                }

                Log::info('Reservas liberadas en lote', [
                    'usuario_id' => auth()->id(),
                    'cantidad_reservas' => count($reservas),
                    'cantidad_stock' => $cantidadLiberada,
                    'ids' => $reservas->pluck('id')->toArray(),
                ]);
            });

            return back()->with('success', "Se liberaron {$reservas->count()} reservas ({$cantidadLiberada} unidades)");
        } catch (\Exception $e) {
            Log::error('Error liberando reservas en lote', [
                'error' => $e->getMessage(),
                'count' => count($validated['reserva_ids']),
            ]);

            return back()->with('error', 'Error al liberar reservas: ' . $e->getMessage());
        }
    }

    /**
     * Extender fecha de expiración (+7 días)
     */
    public function extender(int $id)
    {
        try {
            $reserva = ReservaProforma::findOrFail($id);

            if ($reserva->estado !== 'ACTIVA') {
                return back()->with('error', 'Solo se pueden extender reservas activas');
            }

            $fechaAnterior = $reserva->fecha_expiracion;
            $reserva->fecha_expiracion = $reserva->fecha_expiracion->addDays(7);
            $reserva->save();

            Log::info('Reserva extendida', [
                'reserva_id' => $reserva->id,
                'usuario_id' => auth()->id(),
                'fecha_anterior' => $fechaAnterior,
                'fecha_nueva' => $reserva->fecha_expiracion,
                'proforma_id' => $reserva->proforma_id,
            ]);

            return back()->with('success', 'Reserva extendida 7 días adicionales');
        } catch (\Exception $e) {
            Log::error('Error extendiendo reserva', [
                'reserva_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Error al extender la reserva: ' . $e->getMessage());
        }
    }
}
