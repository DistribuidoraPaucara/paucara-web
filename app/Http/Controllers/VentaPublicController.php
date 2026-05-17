<?php

namespace App\Http\Controllers;

use App\Models\VentaAccessToken;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class VentaPublicController extends Controller
{
    /**
     * Mostrar preview público de la venta
     */
    public function show(Request $request, $token)
    {
        // Obtener venta por token
        $venta = VentaAccessToken::getVentaByToken($token);

        if (!$venta) {
            return response()->view('errors.404', [], 404);
        }

        // Cargar relaciones necesarias
        $venta->load([
            'cliente',
            'usuario',
            'detalles.producto',
            'moneda',
            'estadoDocumento',
            'estadoLogistica',
            'accessToken',
        ]);

        // ✅ CORREGIDO: No depender de auth()->user() para acceso público
        $empresa = $venta->cliente->empresa ?? \App\Models\Empresa::principal();
        $documento = $venta;
        $formato = $request->query('formato', 'a4');
        $fecha_impresion = now();
        $usuario = $venta->usuario;

        // Seleccionar vista según formato
        $viewMap = [
            'A4' => 'impresion.ventas.hoja-completa',
            'TICKET_80' => 'impresion.ventas.ticket-80',
            'TICKET_58' => 'impresion.ventas.ticket-58',
            'a4' => 'impresion.ventas.hoja-completa',
            'ticket-80' => 'impresion.ventas.ticket-80',
            'ticket-58' => 'impresion.ventas.ticket-58',
        ];

        $view = $viewMap[$formato] ?? 'impresion.ventas.hoja-completa';

        // Retornar PDF
        return Pdf::loadView($view, compact('documento', 'empresa', 'fecha_impresion', 'usuario'))
            ->download("Venta-{$documento->numero}.pdf");
    }

    /**
     * Vista HTML para preview (sin descargar PDF)
     */
    public function preview(Request $request, $token)
    {
        // Obtener venta por token
        $venta = VentaAccessToken::getVentaByToken($token);

        if (!$venta) {
            return response()->view('errors.404', [], 404);
        }

        // Cargar relaciones necesarias
        $venta->load([
            'cliente',
            'usuario',
            'detalles.producto',
            'moneda',
            'estadoDocumento',
            'estadoLogistica',
            'accessToken',
        ]);

        // ✅ CORREGIDO: No depender de auth()->user() para acceso público
        $empresa = $venta->cliente->empresa ?? \App\Models\Empresa::principal();
        $documento = $venta;
        $formato = $request->query('formato', 'a4');
        $fecha_impresion = now();
        $usuario = $venta->usuario;

        // Seleccionar vista según formato
        $viewMap = [
            'A4' => 'impresion.ventas.hoja-completa',
            'TICKET_80' => 'impresion.ventas.ticket-80',
            'TICKET_58' => 'impresion.ventas.ticket-58',
            'a4' => 'impresion.ventas.hoja-completa',
            'ticket-80' => 'impresion.ventas.ticket-80',
            'ticket-58' => 'impresion.ventas.ticket-58',
        ];

        $view = $viewMap[$formato] ?? 'impresion.ventas.hoja-completa';

        // Retornar HTML
        return view($view, compact('documento', 'empresa', 'fecha_impresion', 'usuario'));
    }
}
