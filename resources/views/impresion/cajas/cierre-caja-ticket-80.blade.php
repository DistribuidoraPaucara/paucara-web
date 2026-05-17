@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre de Caja #' . $apertura->id)

@section('contenido')
<div class="separador mb-2"></div>

{{-- ✅ TÍTULO PRINCIPAL --}}
<div class="bold center">CIERRE DE CAJA</div>
<div class="center">Cierre Caja Folio #{{ $cierre->id }}</div>
<div class="center" style="margin-top: 1px;">
    {{ now()->format('d/m/Y H:i') }}
</div>
<div class="separador"></div>
{{-- ✅ RANGO DE VENTAS --}}
@if($rangoVentasIds['minId'] && $rangoVentasIds['maxId'] && $rangoVentasIds['totalVentas'] > 0)
<div style="margin-bottom: 2px;">
    <small>Ventas: {{ $rangoVentasIds['minId'] }} - {{ $rangoVentasIds['maxId'] }}</small>
</div>
<div class="separador"></div>
@endif

<div class="separador"></div>

{{-- ✅ INFORMACIÓN DE LA CAJA --}}
<table style="width: 100%; border-collapse: collapse;">
    <tbody>
        <tr>
            <td style="text-align: left; padding: 1px 0; font-weight: bold;">Caja:</td>
            <td style="text-align: right; padding: 1px 0;">{{ $apertura->caja->nombre }}</td>
        </tr>
        <tr>
            <td style="text-align: left; padding: 1px 0; font-weight: bold;">Apertura:</td>
            <td style="text-align: right; padding: 1px 0;">#{{ $apertura->id }}</td>
        </tr>
        <tr>
            <td style="text-align: left; padding: 1px 0; font-weight: bold;">Responsable:</td>
            <td style="text-align: right; padding: 1px 0;">{{ substr($usuario->name, 0, 20) }}</td>
        </tr>
        <tr>
            <td style="text-align: left; padding: 1px 0; font-weight: bold;">Apertura:</td>
            <td style="text-align: right; padding: 1px 0;">{{ $apertura->fecha->format('d/m H:i') }}</td>
        </tr>
        @if($cierre)
        <tr>
            <td style="text-align: left; padding: 1px 0; font-weight: bold;">Cierre:</td>
            <td style="text-align: right; padding: 1px 0;">{{ $cierre->created_at->format('d/m H:i') }}</td>
        </tr>
        @endif
    </tbody>
</table>

<div class="separador"></div>



{{-- ✅ VENTAS APROBADAS POR TIPO DE PAGO (INCLUYENDO CEROS) --}}
@if($ventasPorTipoPagoCompleto && count($ventasPorTipoPagoCompleto) > 0)
<div class="center" style="margin-bottom: 2px; font-weight: bold;">
    VENTAS
</div>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
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
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="text-align: left; padding: 1px 0;">{{ substr($tipo, 0, 12) }}</td>
            <td style="text-align: center; padding: 1px 0;">{{ $resumen['cantidad'] }}</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($resumen['total'], 2) }}</td>
        </tr>
        @endforeach
        @php
        // Agregar ventas a crédito al total
        $cantidadCreditos = $cantidadVentasCredito ?? 0;
        if($sumatorialVentasCredito && $sumatorialVentasCredito > 0) {
        $totalVentasDesglose += $sumatorialVentasCredito;
        $totalCantidadDesglose += $cantidadCreditos;
        }
        @endphp
        @if($sumatorialVentasCredito && $sumatorialVentasCredito > 0)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="text-align: left; padding: 1px 0;">Crédito</td>
            <td style="text-align: center; padding: 1px 0;">{{ $cantidadCreditos }}</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($sumatorialVentasCredito, 2) }}</td>
        </tr>
        @endif
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold; background: #f0f0f0;">
            <td style="text-align: left; padding: 1px 0;">TOTAL VENTAS</td>
            <td style="text-align: center; padding: 1px 0;">{{ $totalCantidadDesglose }}</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($totalVentasDesglose, 2) }}</td>
        </tr>
    </tbody>
</table>

<div class="separador"></div>
@endif


{{-- ✅ TOTAL PAGOS DE CRÉDITO RECIBIDOS (SIMPLIFICADO) --}}

<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
    <tbody>
        <tr style="border-top: 1px solid #000;">
            <td style="text-align: left; padding: 1px 0;">CXC Efectivo</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($montoPagosCreditos, 2) }}</td>
        </tr>
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
            <td style="text-align: left; padding: 1px 0;">CXC Otros</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($montoPagosCreditos, 2) }}</td>
        </tr>
    </tbody>
</table>

<div class="separador"></div>


{{-- ✅ VENTAS ANULADAS (OPCIÓN 3) --}}
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
    <tbody>
        <tr>
            <td style="text-align: left; padding: 1px 0;">Devoluciones Venta:</td>
            <td style="text-align: right; padding: 1px 0;">
                {{ number_format($sumatorialVentasAnuladas, 2) }}
            </td>
        </tr>
        <tr>
            <td style="text-align: left; padding: 1px 0;">Devoluciones Efectivo:</td>
            <td style="text-align: right; padding: 1px 0;">
                {{ number_format($sumatorialVentasAnuladas, 2) }}
            </td>
        </tr>

    </tbody>
</table>

<div class="separador"></div>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px; border-bottom: 1px solid #000;">
    <tbody>
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
            <td style="text-align: left; padding: 1px 0;">Ventas Total Factura:</td>
            <td style="text-align: right; padding: 1px 0;">0</td>
        </tr>
        <tr style="border-top: 1px solid #000 font-weight: bold;">
            <td style="text-align: left; padding: 1px 0;">Ventas Total Sin Factura:</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($totalVentasDesglose, 2) }}</td>
        </tr>

    </tbody>
</table>

<div class="separador"></div>


<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
    <tbody>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="text-align: left; padding: 1px 0;">+ CXC Efectivo</td>
            <td style="text-align: right; padding: 1px 0;">+{{ number_format($montoPagosCreditos ?? 0, 2) }}</td>
        </tr>

        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold; background: #ffe6e6;">
            <td style="text-align: left; padding: 1px 0;">- TOTAL EGRESOS:</td>
            <td style="text-align: right; padding: 1px 0;">-{{ number_format($totalEgresos ?? 0, 2) }}</td>
        </tr>
    </tbody>
</table>

<div class="separador"></div>



{{-- ✅ RESUMEN FINANCIERO --}}

<table style="width: 100%; border-collapse: collapse;">
    <tbody>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="text-align: left; padding: 1px 0; ">Apertura:</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($apertura->monto_apertura, 2) }}</td>
        </tr>
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold;">
            <td style="text-align: left; padding: 1px 0; ">Eftvo Esperado Caja:</td>
            <td style="text-align: right; padding: 1px 0; ">{{ number_format(($apertura->monto_apertura ?? 0) + ($sumatorialVentasEfectivo ?? 0) + ($montoPagosCreditos ?? 0) + ($sumatorialServicio ?? 0) - ($totalEgresos ?? 0), 2) }}</td>
        </tr>
        <tr style="border-bottom: 1px solid #000; font-weight: bold;">
            <td style="text-align: left; padding: 1px 0; ">Eftvo Neto Caja:</td>
            <td style="text-align: right; padding: 1px 0; ">{{ number_format($cierre->monto_real, 2) }}</td>
        </tr>
        <tr style="border-bottom: 1px solid #000; font-weight: bold;">
            <td style="text-align: left; padding: 1px 0; ">Diferencia:</td>
            <td style="text-align: right; padding: 1px 0; ">
                {{ number_format($cierre->diferencia, 2) }}
            </td>
        </tr>

    </tbody>
</table>

<div class="separador"></div>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2px; border-bottom: 1px solid #000;">
    <tbody>
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold; background: #f0f0f0;">

            <td style="text-align: left; padding: 1px 0;">Ventas Totales:</td>
            <td style="text-align: right; padding: 1px 0;">{{ number_format($totalVentasDesglose, 2) }}</td>
        </tr>

    </tbody>
</table>

<div class="separador"></div>


{{-- ✅ OBSERVACIONES --}}
@if($cierre->observaciones)
<div style="">
    <strong>Obs:</strong><br>
    {{ Str::limit($cierre->observaciones, 120) }}
</div>

<div class="separador"></div>
@endif

{{-- ✅ MONEDA Y USUARIO --}}
<div class="center" style="">
    <strong>Moneda: BOB</strong>
</div>

<div class="separador"></div>

<div class="center" style="margin-top: 2px; ">
    <div>{{ is_string($usuario) ? $usuario : $usuario->name }}</div>
</div>
@endsection
