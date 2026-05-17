<?php
namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\AnalisisAbc;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnalisisAbcController extends Controller
{
    public function index(Request $request)
    {
        $query = AnalisisAbc::with(['producto', 'almacen']);

        // Filtros
        $ano = $request->get('ano', date('Y'));
        $mes = $request->get('mes');

        $query->periodo($ano, $mes);

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        if ($request->filled('clasificacion_abc')) {
            $query->where('clasificacion_abc', $request->clasificacion_abc);
        }

        if ($request->filled('clasificacion_xyz')) {
            $query->where('clasificacion_xyz', $request->clasificacion_xyz);
        }

        if ($request->filled('buscar')) {
            $buscar = $request->buscar;
            $query->whereHas('producto', function ($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('codigo', 'like', "%{$buscar}%");
            });
        }

        // Ordenamiento
        $orderBy        = $request->get('order_by', 'ranking_ventas');
        $orderDirection = $request->get('order_direction', 'asc');

        $analisis = $query->orderBy($orderBy, $orderDirection)
            ->paginate(25)
            ->withQueryString();

        // Resumen estadístico
        $resumen = AnalisisAbc::obtenerResumen($request->almacen_id, $ano);

        return Inertia::render('Inventario/AnalisisABC/Index', [
            'analisis'  => $analisis,
            'resumen'   => $resumen,
            'filtros'   => $request->only(['ano', 'mes', 'almacen_id', 'clasificacion_abc', 'clasificacion_xyz', 'buscar', 'order_by', 'order_direction']),
            'almacenes' => Almacen::select('id', 'nombre')->get(),
        ]);
    }

    public function show(AnalisisAbc $analisisAbc)
    {
        $analisisAbc->load(['producto', 'almacen']);

        // Obtener histórico del producto
        $historico = AnalisisAbc::where('producto_id', $analisisAbc->producto_id)
            ->where('almacen_id', $analisisAbc->almacen_id)
            ->whereNull('periodo_mes') // Solo análisis anuales
            ->orderBy('periodo_ano', 'desc')
            ->limit(5)
            ->get();

        // Recomendaciones automáticas
        $recomendaciones = $analisisAbc->recomendaciones;

        return Inertia::render('Inventario/AnalisisABC/Show', [
            'analisis'        => $analisisAbc,
            'historico'       => $historico,
            'recomendaciones' => $recomendaciones,
        ]);
    }

    public function calcular(Request $request)
    {
        $request->validate([
            'almacen_id' => 'nullable|exists:almacenes,id',
            'ano'        => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'mes'        => 'nullable|integer|min:1|max:12',
        ]);

        $resultado = AnalisisAbc::calcularAnalisisABC(
            $request->almacen_id,
            $request->ano,
            $request->mes
        );

        if ($resultado) {
            $mensaje = 'Análisis ABC calculado exitosamente';
            if ($request->mes) {
                $mensaje .= " para {$request->mes}/{$request->ano}";
            } else {
                $mensaje .= " para el año {$request->ano}";
            }

            return back()->with('success', $mensaje);
        } else {
            return back()->withErrors(['general' => 'No se encontraron datos de ventas para el periodo seleccionado']);
        }
    }

    public function dashboard()
    {
        $anoActual = date('Y');

        // Resumen general
        $resumen = AnalisisAbc::obtenerResumen(null, $anoActual);

        // Top 10 productos clase A
        $productosClaseA = AnalisisAbc::clasificacionA()
            ->periodoActual()
            ->with(['producto'])
            ->orderBy('ranking_ventas')
            ->limit(10)
            ->get();

        // Productos con rotación baja (Clase A pero Z)
        $productosAtencionEspecial = AnalisisAbc::where('clasificacion_abc', 'A')
            ->where('clasificacion_xyz', 'Z')
            ->periodoActual()
            ->with(['producto', 'almacen'])
            ->orderBy('rotacion_inventario')
            ->limit(10)
            ->get();

        // Productos obsoletos
        $productosObsoletos = AnalisisAbc::obsoletos(180)
            ->periodoActual()
            ->with(['producto', 'almacen'])
            ->orderBy('ultima_venta')
            ->limit(15)
            ->get();

        // Distribución ABC-XYZ
        $distribucionABC = [
            'A' => AnalisisAbc::clasificacionA()->periodoActual()->count(),
            'B' => AnalisisAbc::clasificacionB()->periodoActual()->count(),
            'C' => AnalisisAbc::clasificacionC()->periodoActual()->count(),
        ];

        $distribucionXYZ = [
            'X' => AnalisisAbc::altaRotacion()->periodoActual()->count(),
            'Y' => AnalisisAbc::rotacionMedia()->periodoActual()->count(),
            'Z' => AnalisisAbc::bajaRotacion()->periodoActual()->count(),
        ];

        // Métricas por almacén
        $metricasPorAlmacen = AnalisisAbc::periodoActual()
            ->select('almacen_id',
                DB::raw('COUNT(*) as total_productos'),
                DB::raw('AVG(rotacion_inventario) as rotacion_promedio'),
                DB::raw('SUM(ventas_valor) as ventas_total'))
            ->groupBy('almacen_id')
            ->with(['almacen'])
            ->get();

        return Inertia::render('Inventario/AnalisisABC/Dashboard', [
            'resumen'                     => $resumen,
            'productos_clase_a'           => $productosClaseA,
            'productos_atencion_especial' => $productosAtencionEspecial,
            'productos_obsoletos'         => $productosObsoletos,
            'distribucion_abc'            => $distribucionABC,
            'distribucion_xyz'            => $distribucionXYZ,
            'metricas_por_almacen'        => $metricasPorAlmacen,
        ]);
    }

    public function reporteRotacion(Request $request)
    {
        $request->validate([
            'almacen_id'      => 'nullable|exists:almacenes,id',
            'clasificacion'   => 'nullable|in:A,B,C,AX,AY,AZ,BX,BY,BZ,CX,CY,CZ',
            'umbral_rotacion' => 'nullable|numeric|min:0',
        ]);

        $query = AnalisisAbc::periodoActual()->with(['producto', 'almacen']);

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        if ($request->filled('clasificacion')) {
            $clasificacion = $request->clasificacion;
            if (strlen($clasificacion) == 1) {
                $query->where('clasificacion_abc', $clasificacion);
            } else {
                $query->where('clasificacion_abc', substr($clasificacion, 0, 1))
                    ->where('clasificacion_xyz', substr($clasificacion, 1, 1));
            }
        }

        if ($request->filled('umbral_rotacion')) {
            $query->rotacionBaja($request->umbral_rotacion);
        }

        $productos = $query->orderBy('rotacion_inventario')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Inventario/AnalisisABC/ReporteRotacion', [
            'productos' => $productos,
            'filtros'   => $request->only(['almacen_id', 'clasificacion', 'umbral_rotacion']),
            'almacenes' => Almacen::select('id', 'nombre')->get(),
        ]);
    }

    public function reporteObsoletos(Request $request)
    {
        $diasSinVenta = $request->get('dias_sin_venta', 180);

        $query = AnalisisAbc::obsoletos($diasSinVenta)
            ->periodoActual()
            ->with(['producto', 'almacen']);

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        $productosObsoletos = $query->orderBy('ultima_venta')
            ->paginate(50)
            ->withQueryString();

        // Valor total del inventario obsoleto
        $valorTotal = $query->sum(DB::raw('stock_promedio * costo_promedio'));

        return Inertia::render('Inventario/AnalisisABC/ReporteObsoletos', [
            'productos_obsoletos'  => $productosObsoletos,
            'valor_total_obsoleto' => $valorTotal,
            'dias_sin_venta'       => $diasSinVenta,
            'filtros'              => $request->only(['almacen_id', 'dias_sin_venta']),
            'almacenes'            => Almacen::select('id', 'nombre')->get(),
        ]);
    }

    // API Methods
    public function apiCalcularAnalisis(Request $request)
    {
        $request->validate([
            'almacen_id' => 'nullable|exists:almacenes,id',
            'ano'        => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'mes'        => 'nullable|integer|min:1|max:12',
        ]);

        try {
            $resultado = AnalisisAbc::calcularAnalisisABC(
                $request->almacen_id,
                $request->ano,
                $request->mes
            );

            if ($resultado) {
                $resumen = AnalisisAbc::obtenerResumen($request->almacen_id, $request->ano);

                return response()->json([
                    'success' => true,
                    'message' => 'Análisis ABC calculado exitosamente',
                    'resumen' => $resumen,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron datos de ventas para el periodo seleccionado',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al calcular el análisis: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function apiRecomendaciones(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_id'  => 'nullable|exists:almacenes,id',
        ]);

        $query = AnalisisAbc::where('producto_id', $request->producto_id)
            ->periodoActual();

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        $analisis = $query->first();

        if (! $analisis) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró análisis ABC para este producto',
            ], 404);
        }

        return response()->json([
            'success'                    => true,
            'clasificacion_completa'     => $analisis->clasificacion_completa,
            'descripcion_clasificacion'  => $analisis->descripcion_clasificacion,
            'prioridad_gestion'          => $analisis->prioridad_gestion,
            'recomendaciones'            => $analisis->recomendaciones_automaticas,
            'requiere_atencion_especial' => $analisis->requiereAtencionEspecial(),
            'es_obsoleto'                => $analisis->esProductoObsoleto(),
            'rotacion_inventario'        => $analisis->rotacion_inventario,
            'dias_cobertura'             => $analisis->dias_cobertura,
            'ultima_venta'               => $analisis->ultima_venta,
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'formato'    => 'required|in:excel,csv',
            'almacen_id' => 'nullable|exists:almacenes,id',
            'ano'        => 'required|integer',
            'mes'        => 'nullable|integer|min:1|max:12',
        ]);

        $query = AnalisisAbc::periodo($request->ano, $request->mes)
            ->with(['producto', 'almacen']);

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        $analisis = $query->orderBy('ranking_ventas')->get();

        $datos = $analisis->map(function ($item) {
            return [
                'Ranking'                => $item->ranking_ventas,
                'Código'                 => $item->producto->codigo,
                'Producto'               => $item->producto->nombre,
                'Almacén'                => $item->almacen->nombre,
                'Clasificación ABC'      => $item->clasificacion_abc,
                'Clasificación XYZ'      => $item->clasificacion_xyz,
                'Clasificación Completa' => $item->clasificacion_completa,
                'Descripción'            => $item->descripcion_clasificacion,
                'Prioridad'              => $item->prioridad_gestion,
                'Ventas Cantidad'        => $item->ventas_cantidad,
                'Ventas Valor'           => $item->ventas_valor,
                'Stock Promedio'         => $item->stock_promedio,
                'Rotación'               => $item->rotacion_inventario,
                'Días Cobertura'         => $item->dias_cobertura,
                'Porcentaje Ventas'      => $item->porcentaje_ventas_valor . '%',
                'Última Venta'           => $item->ultima_venta?->format('Y-m-d'),
                'Recomendaciones'        => implode('; ', $item->recomendaciones_automaticas),
            ];
        });

        $nombreArchivo = "analisis_abc_{$request->ano}";
        if ($request->mes) {
            $nombreArchivo .= "_{$request->mes}";
        }
        if ($request->almacen_id) {
            $almacen        = Almacen::find($request->almacen_id);
            $nombreArchivo .= "_" . Str::slug($almacen->nombre);
        }

        // Aquí implementarías la exportación según el formato
        // Por simplicidad, devolvemos los datos JSON
        return response()->json([
            'success'        => true,
            'datos'          => $datos,
            'nombre_archivo' => $nombreArchivo,
        ]);
    }
}
