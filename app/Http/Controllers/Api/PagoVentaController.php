<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Services\PagoVentaService;
use Illuminate\Http\Request;

class PagoVentaController extends Controller
{
    protected $pagoVentaService;

    public function __construct(PagoVentaService $pagoVentaService)
    {
        $this->pagoVentaService = $pagoVentaService;
    }

    public function registrarPagos(Request $request, Venta $venta)
    {
        $validado = $request->validate([
            'pagos' => 'required|array|min:1',
            'pagos.*.tipo_pago_id' => 'required|exists:tipos_pago,id',
            'pagos.*.monto' => 'required|numeric|min:0.01',
            'pagos.*.referencia' => 'nullable|string|max:255',
            'pagos.*.fecha_pago' => 'nullable|date_format:Y-m-d H:i:s',
            'pagos.*.comprobante' => 'nullable|string',
            'pagos.*.observaciones' => 'nullable|string',
        ]);

        try {
            $resultado = $this->pagoVentaService->registrarPagos($venta, $validado['pagos']);

            return response()->json([
                'success' => true,
                'message' => 'Pagos registrados exitosamente',
                'data' => $resultado,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function obtenerResumen(Venta $venta)
    {
        $resumen = $this->pagoVentaService->obtenerResumenPagos($venta);

        return response()->json([
            'success' => true,
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'total_venta' => $venta->total,
            'monto_pagado' => $venta->monto_pagado,
            'monto_pendiente' => $venta->monto_pendiente,
            'pagos_por_tipo' => $resumen,
        ]);
    }

    public function obtenerDetalle(Venta $venta)
    {
        $pagos = $venta->detallesPagoVenta()
            ->with('tipoPago')
            ->get()
            ->map(function ($pago) {
                return [
                    'id' => $pago->id,
                    'tipo_pago' => $pago->tipoPago->nombre,
                    'tipo_pago_codigo' => $pago->tipoPago->codigo,
                    'monto' => $pago->monto,
                    'referencia' => $pago->referencia,
                    'fecha_pago' => $pago->fecha_pago,
                    'comprobante' => $pago->comprobante,
                    'observaciones' => $pago->observaciones,
                    'icono' => $pago->tipoPago->getIcon(),
                ];
            });

        return response()->json([
            'success' => true,
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'total_venta' => $venta->total,
            'monto_pagado' => $venta->monto_pagado,
            'monto_pendiente' => $venta->monto_pendiente,
            'pagos' => $pagos,
        ]);
    }

    public function reporteCaja(Request $request)
    {
        $validado = $request->validate([
            'fecha_desde' => 'required|date_format:Y-m-d',
            'fecha_hasta' => 'required|date_format:Y-m-d',
        ]);

        $reporte = $this->pagoVentaService->obtenerReporteCaja(
            $validado['fecha_desde'],
            $validado['fecha_hasta']
        );

        return response()->json([
            'success' => true,
            'data' => $reporte,
        ]);
    }
}
