<?php
namespace App\Http\Controllers;

use App\Models\LoteVencimiento;
use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoteVencimientoController extends Controller
{
    public function index(Request $request)
    {
        $query = LoteVencimiento::with(['detalleCompra.compra.proveedor', 'detalleCompra.producto'])
            ->when($request->estado, function ($q) use ($request) {
                $q->where('estado_vencimiento', $request->estado);
            })
            ->when($request->dias_vencimiento, function ($q) use ($request) {
                $diasVencimiento = (int) $request->dias_vencimiento;
                $fechaLimite     = now()->addDays($diasVencimiento);
                $q->where('fecha_vencimiento', '<=', $fechaLimite);
            })
            ->when($request->proveedor, function ($q) use ($request) {
                $q->whereHas('detalleCompra.compra.proveedor', function ($provQ) use ($request) {
                    $provQ->where('nombre', 'LIKE', "%{$request->proveedor}%");
                });
            })
            ->when($request->producto, function ($q) use ($request) {
                $q->whereHas('detalleCompra.producto', function ($prodQ) use ($request) {
                    $prodQ->where('nombre', 'LIKE', "%{$request->producto}%");
                });
            });

        // Sorting
        $sortField = $request->get('sort', 'fecha_vencimiento');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortField, $sortOrder);

        $lotes = $query->paginate(15)->withQueryString();

        // Estadísticas
        $estadisticas = [
            'total_lotes_activos'    => LoteVencimiento::where('estado_vencimiento', 'ACTIVO')->count(),
            'lotes_vencidos'         => LoteVencimiento::where('fecha_vencimiento', '<', now())
                ->where('estado_vencimiento', 'ACTIVO')->count(),
            'lotes_por_vencer'       => LoteVencimiento::where('fecha_vencimiento', '<=', now()->addDays(30))
                ->where('fecha_vencimiento', '>=', now())
                ->where('estado_vencimiento', 'ACTIVO')->count(),
            'valor_total_inventario' => LoteVencimiento::join('detalle_compras', 'lotes_vencimientos.detalle_compra_id', '=', 'detalle_compras.id')
                ->where('estado_vencimiento', 'ACTIVO')
                ->sum(DB::raw('cantidad_actual * detalle_compras.precio_unitario')),
        ];

        return Inertia::render('compras/lotes-vencimientos/index', [
            'lotes'        => $lotes,
            'filtros'      => $request->only(['estado', 'dias_vencimiento', 'proveedor', 'producto']),
            'estadisticas' => $estadisticas,
            'productos'    => \App\Models\Producto::select('id', 'nombre')->orderBy('nombre')->get(),
            'proveedores'  => \App\Models\Proveedor::select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    public function actualizarEstado(Request $request, LoteVencimiento $lote)
    {
        $request->validate([
            'estado' => 'required|in:ACTIVO,VENCIDO,DESCARTADO,VENDIDO',
        ]);

        $lote->update([
            'estado' => $request->estado,
        ]);

        return back()->with('success', 'Estado del lote actualizado correctamente.');
    }

    public function actualizarCantidad(Request $request, LoteVencimiento $lote)
    {
        $request->validate([
            'cantidad_disponible' => 'required|numeric|min:0|max:' . $lote->cantidad_inicial,
        ]);

        $lote->update([
            'cantidad_disponible' => $request->cantidad_disponible,
        ]);

        // Si la cantidad llega a 0, marcar como vendido
        if ($request->cantidad_disponible == 0) {
            $lote->update(['estado' => 'VENDIDO']);
        }

        return back()->with('success', 'Cantidad del lote actualizada correctamente.');
    }

    public function export(Request $request)
    {
        $query = LoteVencimiento::with(['detalleCompra.compra.proveedor', 'detalleCompra.producto'])
            ->when($request->estado, function ($q) use ($request) {
                $q->where('estado_vencimiento', $request->estado);
            })
            ->when($request->dias_vencimiento, function ($q) use ($request) {
                $diasVencimiento = (int) $request->dias_vencimiento;
                $fechaLimite     = now()->addDays($diasVencimiento);
                $q->where('fecha_vencimiento', '<=', $fechaLimite);
            });

        $lotes = $query->get();

        // Aquí implementarías la exportación a Excel
        // Por ahora retornamos los datos como JSON para testing
        return response()->json($lotes);
    }
}
