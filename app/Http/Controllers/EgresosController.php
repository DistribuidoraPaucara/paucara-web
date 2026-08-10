<?php

namespace App\Http\Controllers;

use App\Models\Egreso;
use App\Models\Empresa;
use App\Models\TipoOperacionCaja;
use App\Models\TipoPago;
use App\Models\User;
use App\Services\ImpresionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class EgresosController extends Controller
{
    /**
     * Mostrar listado de egresos con filtros
     */
    public function index(Request $request)
    {
        $query = Egreso::with(['tipoOperacion', 'estadoDocumento', 'usuario']);

        // Filtro por Número o ID
        if ($request->filled('numero')) {
            $numero = $request->input('numero');
            $query->where('numero', 'ilike', "%{$numero}%")
                  ->orWhere('id', (int) $numero);
        }

        // Filtro por Tipo de Operación
        if ($request->filled('tipo_operacion_id')) {
            $query->where('tipo_operacion_caja_id', $request->input('tipo_operacion_id'));
        }

        // Filtro por Usuario
        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->input('usuario_id'));
        }

        $egresos = $query->orderBy('fecha', 'desc')->paginate(15);

        // Obtener opciones para filtros
        $tipos_operacion = TipoOperacionCaja::where('activo', true)->get();
        $usuarios = User::where('activo', true)->get();

        return Inertia::render('Egresos/Index', [
            'egresos' => $egresos,
            'tipos_operacion' => $tipos_operacion,
            'usuarios' => $usuarios,
        ]);
    }

    /**
     * Mostrar formulario para crear egreso
     */
    public function create()
    {
        $tipos_operacion = TipoOperacionCaja::where('activo', true)->get();
        $tipos_pago = TipoPago::where('activo', true)->get();

        return Inertia::render('Egresos/Create', [
            'tipos_operacion' => $tipos_operacion,
            'tipos_pago' => $tipos_pago,
        ]);
    }

    /**
     * Mostrar detalle de un egreso
     */
    public function show(Egreso $egreso)
    {
        $egreso->load([
            'tipoOperacion',
            'estadoDocumento',
            'usuario',
            'detalles.tipoOperacion',
            'detallesPago.tipoPago'
        ]);

        return Inertia::render('Egresos/Show', [
            'egreso' => $egreso,
        ]);
    }

    /**
     * Imprimir egreso en PDF
     *
     * @param Egreso $egreso
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function imprimir(Egreso $egreso, Request $request)
    {
        Log::info('🖨️ [EgresosController::imprimir] Método llamado', [
            'egreso_id' => $egreso->id,
            'user_id'   => auth()->id(),
            'formato'   => $request->input('formato'),
            'accion'    => $request->input('accion'),
        ]);

        $formato = $request->input('formato', 'A4');      // A4, TICKET_80, TICKET_58
        $accion  = $request->input('accion', 'download'); // download | stream

        try {
            // ✅ Usar ImpresionService para generar PDF
            $impresionService = app(ImpresionService::class);
            $pdf = $impresionService->imprimirEgreso($egreso, $formato);

            $nombreArchivo = "egreso_{$egreso->numero}_{$formato}.pdf";

            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error generando PDF de egreso', [
                'egreso_id' => $egreso->id,
                'error'     => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar PDF: ' . $e->getMessage(),
            ], 500);
        }
    }
}
