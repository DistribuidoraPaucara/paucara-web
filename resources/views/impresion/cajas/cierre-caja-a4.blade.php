@extends('impresion.layouts.base-a4')

@section('titulo', 'Cierre de Caja #' . $apertura->id)

@section('contenido')
<div style="padding: 20px;">
    <!-- Header -->
    <div style="border-bottom: 3px solid #000; margin-bottom: 20px; padding-bottom: 15px; text-align: center;">
        <h1 style="font-size: 26px; margin: 0 0 5px 0; font-weight: bold;">CIERRE DE CAJA</h1>
        <p style="font-size: 14px; color: #555; margin: 0;">Folio #{{ $cierre->id }}</p>
        <p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">{{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <!-- Información de la Caja -->
    <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; border-bottom: 2px solid #333; padding-bottom: 8px; margin: 0 0 12px 0; font-weight: bold;">INFORMACIÓN GENERAL</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tbody>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; width: 25%;"><strong>Caja:</strong></td>
                    <td style="padding: 8px; width: 25%;">{{ $apertura->caja->nombre }}</td>
                    <td style="padding: 8px; width: 25%;"><strong>Apertura:</strong></td>
                    <td style="padding: 8px; width: 25%;">#{{ $apertura->id }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Responsable:</strong></td>
                    <td style="padding: 8px;">{{ $usuario->name ?? 'N/A' }}</td>
                    <td style="padding: 8px;"><strong>Apertura Hora:</strong></td>
                    <td style="padding: 8px;">{{ $apertura->fecha->format('d/m/Y H:i') }}</td>
                </tr>
                @if($cierre)
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Cierre Hora:</strong></td>
                    <td style="padding: 8px;">{{ $cierre->created_at->format('d/m/Y H:i') }}</td>
                    <td style="padding: 8px;"><strong>Duración:</strong></td>
                    <td style="padding: 8px;">{{ $apertura->fecha->diffInHours($cierre->created_at) }} horas</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Rango de Ventas -->
    @if($rangoVentasIds['minId'] && $rangoVentasIds['maxId'] && $rangoVentasIds['totalVentas'] > 0)
    <div style="margin-bottom: 20px; padding: 8px; background-color: #f0f0f0; border-left: 3px solid #007bff;">
        <p style="margin: 0; font-size: 11px;">
            <strong>Rango de Ventas:</strong> {{ $rangoVentasIds['minId'] }} - {{ $rangoVentasIds['maxId'] }}
            (Total: {{ $rangoVentasIds['totalVentas'] }} ventas)
        </p>
    </div>
    @endif

    <!-- Ventas por Tipo de Pago -->
    @if($ventasPorTipoPagoCompleto && count($ventasPorTipoPagoCompleto) > 0)
    <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; border-bottom: 2px solid #333; padding-bottom: 8px; margin: 0 0 12px 0; font-weight: bold;">VENTAS POR TIPO DE PAGO</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <thead style="background-color: #f0f0f0; border-bottom: 2px solid #333;">
                <tr>
                    <th style="padding: 8px; text-align: left; border-right: 1px solid #ddd;">Tipo de Pago</th>
                    <th style="padding: 8px; text-align: center; border-right: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; text-align: right;">Total (Bs.)</th>
                </tr>
            </thead>
            <tbody>
                @php
                $totalVentasDesglose = 0;
                $totalCantidadDesglose = 0;
                @endphp
                @foreach($ventasPorTipoPagoCompleto as $tipo => $resumen)
                @php
                $totalVentasDesglose += $resumen['total'];
                $totalCantidadDesglose += $resumen['cantidad'];
                @endphp
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; text-align: left; border-right: 1px solid #ddd;">{{ $tipo }}</td>
                    <td style="padding: 8px; text-align: center; border-right: 1px solid #ddd;">{{ $resumen['cantidad'] }}</td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($resumen['total'], 2) }}</td>
                </tr>
                @endforeach

                @if($sumatorialVentasCredito && $sumatorialVentasCredito > 0)
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; text-align: left; border-right: 1px solid #ddd;">Crédito</td>
                    <td style="padding: 8px; text-align: center; border-right: 1px solid #ddd;">{{ $cantidadVentasCredito ?? 0 }}</td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($sumatorialVentasCredito, 2) }}</td>
                </tr>
                @php
                $totalVentasDesglose += $sumatorialVentasCredito;
                $totalCantidadDesglose += ($cantidadVentasCredito ?? 0);
                @endphp
                @endif

                <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; background-color: #e8f4f8; font-weight: bold;">
                    <td style="padding: 10px; text-align: left; border-right: 1px solid #ddd;">TOTAL VENTAS</td>
                    <td style="padding: 10px; text-align: center; border-right: 1px solid #ddd;">{{ $totalCantidadDesglose }}</td>
                    <td style="padding: 10px; text-align: right;">{{ number_format($totalVentasDesglose, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    @endif

    <!-- Devoluciones -->
    <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; border-bottom: 2px solid #333; padding-bottom: 8px; margin: 0 0 12px 0; font-weight: bold;">DEVOLUCIONES</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tbody>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; width: 50%;"><strong>Devoluciones Venta:</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($sumatorialVentasAnuladas, 2) }}</td>
                </tr>
                <tr style="border-bottom: 2px solid #000;">
                    <td style="padding: 8px;"><strong>Devoluciones Efectivo:</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($sumatorialVentasAnuladas, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Movimientos de Efectivo -->
    <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; border-bottom: 2px solid #333; padding-bottom: 8px; margin: 0 0 12px 0; font-weight: bold;">MOVIMIENTOS DE EFECTIVO</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tbody>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; width: 50%;"><strong>+ Pagos CXC (Efectivo):</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($montoPagosCreditos ?? 0, 2) }}</td>
                </tr>
                <tr style="border-bottom: 2px solid #000; background-color: #ffe6e6; font-weight: bold;">
                    <td style="padding: 8px;"><strong>- TOTAL EGRESOS:</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($totalEgresos ?? 0, 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd; font-size: 10px; padding-left: 20px;">
                    <td style="padding: 4px 8px 4px 20px;">Gastos:</td>
                    <td style="padding: 4px 8px; text-align: right;">{{ number_format($sumatorialGastos ?? 0, 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd; font-size: 10px;">
                    <td style="padding: 4px 8px 4px 20px;">Pagos Sueldo:</td>
                    <td style="padding: 4px 8px; text-align: right;">{{ number_format($sumatorialPagosSueldo ?? 0, 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd; font-size: 10px;">
                    <td style="padding: 4px 8px 4px 20px;">Anticipos:</td>
                    <td style="padding: 4px 8px; text-align: right;">{{ number_format($sumatorialAnticipos ?? 0, 2) }}</td>
                </tr>
                @if(($sumatorialCompras ?? 0) > 0)
                <tr style="border-bottom: 1px solid #ddd; font-size: 10px; color: #d9534f; font-weight: bold;">
                    <td style="padding: 4px 8px 4px 20px;">Compras a Proveedores:</td>
                    <td style="padding: 4px 8px; text-align: right;">{{ number_format($sumatorialCompras, 2) }}</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Resumen Financiero -->
    <div style="margin-bottom: 25px; padding: 15px; background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 5px;">
        <h3 style="font-size: 13px; border-bottom: 2px solid #ffc107; padding-bottom: 8px; margin: 0 0 12px 0; font-weight: bold;">RESUMEN FINANCIERO</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tbody>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Monto de Apertura:</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($apertura->monto_apertura, 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Total Ventas:</strong></td>
                    <td style="padding: 8px; text-align: right;">{{ number_format(($sumatorialVentas ?? 0) + ($sumatorialVentasCredito ?? 0), 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Efectivo Esperado:</strong></td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">{{ number_format(($sumatorialVentasEfectivo ?? 0) + ($montoPagosCreditos ?? 0) - ($totalEgresos ?? 0), 2) }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;"><strong>Efectivo Contado:</strong></td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">{{ number_format($cierre->monto_real, 2) }}</td>
                </tr>
                <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; background-color: {{ $cierre->diferencia == 0 ? '#d4edda' : '#f8d7da' }};">
                    <td style="padding: 10px; font-weight: bold;">DIFERENCIA:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 12px; color: {{ $cierre->diferencia == 0 ? '#155724' : '#721c24' }};">
                        {{ $cierre->diferencia == 0 ? '✓ 0.00' : number_format($cierre->diferencia, 2) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Observaciones -->
    @if($cierre->observaciones)
    <div style="margin-bottom: 20px; padding: 10px; background-color: #f0f0f0; border-left: 3px solid #666;">
        <strong style="font-size: 11px;">Observaciones:</strong>
        <p style="font-size: 10px; margin: 5px 0 0 0; color: #555;">{{ $cierre->observaciones }}</p>
    </div>
    @endif

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #888;">
        <p style="margin: 5px 0;">
            <strong>Moneda:</strong> BOB (Boliviano) |
            <strong>Documento:</strong> Cierre de Caja Individual
        </p>
        <p style="margin: 5px 0;">
            Generado: {{ now()->format('d/m/Y H:i:s') }} |
            Usuario: {{ is_string($usuario) ? $usuario : $usuario->name }}
        </p>
        <p style="margin: 10px 0 0 0; font-style: italic;">
            Este documento constituye un registro oficial de auditoría del cierre de caja.
        </p>
    </div>
</div>

<style>
    body { font-family: Arial, sans-serif; }
    table { width: 100%; }
</style>
@endsection
