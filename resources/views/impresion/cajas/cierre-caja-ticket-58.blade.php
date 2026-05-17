@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre de Caja #' . $apertura->id)

@section('contenido')
<div class="separador"></div>

{{-- Título --}}
<div class="center bold" style="font-size: 10px;">CIERRE DE CAJA</div>
<div class="center">#{{ $apertura->id }}</div>
<div class="center" style="margin-top: 3px; font-size: 7px;">
    {{ now()->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

{{-- Información de la caja --}}
<div style="font-size: 7px;">
    <div><strong>Caja:</strong> {{ $apertura->caja->nombre }}</div>
    <div><strong>Responsable:</strong> {{ $usuario->name }}</div>
</div>

<div class="separador"></div>

{{-- Período --}}
<div style="font-size: 6px;">
    <div><strong>Apertura:</strong> {{ $apertura->fecha->format('d/m/Y H:i') }}</div>
    @if($cierre)
    <div><strong>Cierre:</strong> {{ $cierre->created_at->format('d/m/Y H:i') }}</div>
    @endif
</div>

<div class="separador"></div>

{{-- Resumen financiero --}}
<div class="totales">
    <table style="width: 100%; font-size: 7px;">
        <tr>
            <td>Apertura:</td>
            <td class="right"><strong>{{ number_format($apertura->monto_apertura, 2) }}</strong></td>
        </tr>
        <tr>
            <td>Ingresos:</td>
            <td class="right">{{ number_format($totalIngresos, 2) }}</td>
        </tr>
        <tr>
            <td>Egresos:</td>
            <td class="right">-{{ number_format($totalEgresos, 2) }}</td>
        </tr>
        <tr class="total-final">
            <td><strong>Esperado:</strong></td>
            <td class="right"><strong>{{ number_format(($sumatorialVentasEfectivo ?? 0) + ($montoPagosCreditos ?? 0) - ($totalEgresos ?? 0), 2) }}</strong></td>
        </tr>
        <tr style="border-top: 1px solid #000;">
            <td><strong>Contado:</strong></td>
            <td class="right"><strong>{{ number_format($cierre->monto_real, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador"></div>

{{-- Diferencia --}}
<div class="center" style="font-size: 8px; font-weight: bold;">
    @if($cierre->diferencia == 0)
    <div style="color: #000;">✓ DIFERENCIA: 0.00</div>
    @elseif($cierre->diferencia > 0)
    <div style="color: #000;">↑ SOBRANTE: {{ number_format($cierre->diferencia, 2) }}</div>
    @else
    <div style="color: #000;">↓ FALTANTE: {{ number_format(abs($cierre->diferencia), 2) }}</div>
    @endif
</div>

<div class="separador"></div>

{{-- Rango de Ventas por IDs --}}
@if($rangoVentasIds['minId'] && $rangoVentasIds['maxId'] && $rangoVentasIds['totalVentas'] > 0)
<div style="font-size: 6px; text-align: center;">
    <strong>RANGO VENTAS (IDs)</strong>
    <div style="margin-top: 1px; font-size: 5px;">
        #{{ $rangoVentasIds['minId'] }} → #{{ $rangoVentasIds['maxId'] }} ({{ $rangoVentasIds['totalVentas'] }} vtas)
    </div>
</div>

<div class="separador"></div>
@endif

{{-- Rango de Fechas --}}
<div style="font-size: 6px; text-align: center;">
    <strong>RANGO DE FECHAS</strong>
    @if($primeraVenta)
    <div style="margin-top: 1px; font-size: 5px;">V: {{ $primeraVenta->format('d/m H:i') }} - {{ $ultimaVenta->format('H:i') }}</div>
    @else
    <div style="margin-top: 1px; font-size: 5px; color: #999;">Sin ventas</div>
    @endif
    @if($primerMovimiento)
    <div style="font-size: 5px;">M: {{ $primerMovimiento->format('d/m H:i') }} - {{ $ultimoMovimiento->format('H:i') }}</div>
    @endif
</div>

<div class="separador"></div>

{{-- Resumen por Tipos de Pago --}}
<div style="font-size: 6px; text-align: center;">
    <strong>MOV. POR TIPO PAGO</strong>
    @php
    $totalPagos = 0;
    $totalCantidadPagos = 0;
    @endphp
    @foreach($ventasPorTipoPago as $tipoPago => $resumen)
    @php
    $totalPagos += $resumen['total'];
    $totalCantidadPagos += $resumen['cantidad'];
    @endphp
    <div style="font-size: 5px; margin-top: 1px;">
        {{ substr($tipoPago, 0, 8) }}: {{ $resumen['cantidad'] }} - {{ number_format($resumen['total'], 2) }}
    </div>
    @endforeach

    {{-- Sumatoria Total --}}
    <div style="border-top: 1px solid #000; margin-top: 1px; padding-top: 1px; font-size: 5px; font-weight: bold;">
        TOTAL: {{ $totalCantidadPagos }} - {{ number_format($totalPagos, 2) }}
    </div>
</div>

<div class="separador"></div>

{{-- Resumen por Tipos de Operación --}}
@if($movimientosAgrupados->count() > 0)
<div style="font-size: 6px; text-align: center;">
    <strong>MOV. POR TIPO</strong>
    @php
    $totalMovimientos = 0;
    $totalCantidadMovs = 0;
    @endphp
    @foreach($movimientosAgrupados as $tipoOp => $movs)
    @php
        $total = $movs->sum('monto');
        $cantidad = $movs->count();
        $totalMovimientos += $total;
        $totalCantidadMovs += $cantidad;
    @endphp
    <div style="font-size: 5px; margin-top: 1px;">
        {{ substr($tipoOp, 0, 10) }}: {{ $cantidad }} - {{ number_format(abs($total), 2) }}
    </div>
    @endforeach

    {{-- Sumatoria Total --}}
    <div style="border-top: 1px solid #000; margin-top: 1px; padding-top: 1px; font-size: 5px; font-weight: bold;">
        TOTAL: {{ $totalCantidadMovs }} - {{ number_format(abs($totalMovimientos), 2) }}
    </div>
</div>

<div class="separador"></div>
@endif

@if($cierre->observaciones)
<div style="font-size: 6px;">
    <strong>Obs:</strong><br>
    {{ Str::limit($cierre->observaciones, 100) }}
</div>

<div class="separador"></div>
@endif

{{-- Moneda --}}
<div class="center" style="font-size: 6px;">
    <strong>Moneda: BOB</strong>
</div>

<div class="separador"></div>

<div class="center" style="font-size: 5px; margin-top: 3px;">
    <div>{{ is_string($usuario) ? $usuario : $usuario->name }}</div>
</div>

@endsection
