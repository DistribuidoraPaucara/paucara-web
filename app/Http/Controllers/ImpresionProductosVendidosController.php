<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImpresionProductosVendidosController extends Controller
{
    /**
     * Imprime reporte de productos vendidos
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function imprimir(Request $request)
    {
        try {
            $formato = $request->input('formato', 'A4');
            $accion = $request->input('accion', 'stream');

            // Obtener datos de la sesión
            $productosVendidos = session('productos_vendidos_impresion', []);
            $fecha = session('productos_vendidos_fecha', now()->toDateString());

            // Obtener datos de la empresa
            $empresa = Empresa::first();

            Log::info('📦 [ImpresionProductosVendidosController] Imprimiendo productos vendidos', [
                'formato' => $formato,
                'accion' => $accion,
                'cantidad_productos' => count($productosVendidos),
                'fecha' => $fecha,
            ]);

            // Seleccionar vista según formato
            $vista = match($formato) {
                'TICKET_80' => 'impresion.productos-vendidos.ticket-80',
                'A4', 'HOJA_COMPLETA' => 'impresion.productos-vendidos.hoja-completa',
                default => 'impresion.productos-vendidos.hoja-completa',
            };

            // Renderizar vista
            $html = view($vista, [
                'productosVendidos' => $productosVendidos,
                'fecha' => $fecha,
                'empresa' => $empresa,
            ])->render();

            // Generar PDF
            $pdf = Pdf::loadHTML($html);

            // Configurar papel según formato
            if ($formato === 'TICKET_80') {
                $pdf->setPaper([0, 0, 226.77, 999], 'portrait'); // 80mm = 226.77pt
            } else {
                $pdf->setPaper('A4', 'portrait');
            }

            // Ejecutar acción
            if ($accion === 'download') {
                return $pdf->download("productos-vendidos-{$fecha}.pdf");
            } else {
                return $pdf->stream("productos-vendidos-{$fecha}.pdf");
            }

        } catch (\Exception $e) {
            Log::error('❌ Error imprimiendo productos vendidos:', ['error' => $e->getMessage()]);
            return response()->view('errors.500', ['error' => $e->getMessage()], 500);
        } finally {
            // Limpiar sesión después de imprimir
            session()->forget(['productos_vendidos_impresion', 'productos_vendidos_fecha']);
        }
    }
}
