@extends('impresion.layouts.base-ticket')

@section('titulo', 'Movimientos de Caja')

@section('contenido')

<div class="center" style="margin-bottom: 8px;">
    <h2 style="margin: 0; font-weight: bold;">MOVIMIENTOS DE CAJA</h2>
    <p style="margin: 2px 0; font-size: 12px;">{{ $fecha_impresion->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Información de la apertura -->
<div style="margin-bottom: 5px;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="width: 50%; padding: 1px;"><strong>Caja:</strong> {{ $apertura->caja->nombre }}</td>
            <td style="width: 50%; padding: 1px;"><strong>Usuario:</strong> {{ $usuario->name }}</td>
        </tr>
        <tr>
            <td style="width: 50%; padding: 1px;"><strong>Apertura:</strong> {{ $apertura->fecha->format('d/m H:i') }}</td>
            <td style="width: 50%; padding: 1px;"><strong>Monto Inicial:</strong> {{ number_format($apertura->monto_apertura, 2) }}</td>
        </tr>
    </table>
</div>

<div class="separador"></div>

<!-- Tabla de movimientos -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
    <thead>
        <tr style="border-bottom: 1px dashed #000;">
            <th style="padding: 1px; text-align: left; width: 20%;">Hora | Tipo | Descripcion | Monto</th>
        </tr>
    </thead>
    <tbody>
        @forelse($movimientos as $movimiento)
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 1px;">
                <p>
                    {{ $movimiento->fecha->format('H:i') }} - <strong style="font-weight: bold;">{{ Str::limit($movimiento->tipoOperacion->nombre, 10) }}</strong>
                </p>
                <p>
                    {{ Str::limit($movimiento->observaciones) }}
                </p>
                <p style="font-weight: bold;">
                    @if($movimiento->monto > 0) + @endif
                    {{ number_format(abs($movimiento->monto), 2) }}
                </p>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="4" style="padding: 5px; text-align: center; color: #999;">Sin movimientos</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="separador-doble"></div>

<!-- Resumen de totales -->
<table style="width: 100%; border-collapse: collapse; text-align: right;">
    <tr>
        <td style="padding: 1px; text-align: left;"><strong>M. Inicial:</strong></td>
        <td style="padding: 1px; width: 40%; font-weight: bold;">{{ number_format($apertura->monto_apertura, 2) }} Bs</td>
    </tr>
    <tr>
        <td style="padding: 1px; text-align: left;"><strong>Ingresos:</strong></td>
        <td style="padding: 1px; width: 40%; color: #0D0E0D; font-weight: bold;">+{{ number_format($totalIngresos, 2) }}</td>
    </tr>
    <tr>
        <td style="padding: 1px; text-align: left;"><strong>Egresos:</strong></td>
        <td style="padding: 1px; width: 40%; color: #0E0D0D; font-weight: bold;">-{{ number_format($totalEgresos, 2) }}</td>
    </tr>
    <tr>
        <td style="padding: 1px; text-align: left;"><strong>Neto:</strong></td>
        <td style="padding: 1px; width: 40%; color: {{ ($totalIngresos - $totalEgresos) >= 0 ? '#080808' : '#0E0D0D' }}; font-weight: bold;">{{ number_format($totalIngresos - $totalEgresos, 2) }}</td>
    </tr>
    <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
        <td style="padding: 2px; text-align: left;"><strong>Total Día:</strong></td>
        <td style="padding: 2px; width: 40%; font-weight: bold;">{{ number_format($totalDia, 2) }} Bs</td>
    </tr>
    <tr>
        <td style="padding: 1px; text-align: left;">Transacciones:</td>
        <td style="padding: 1px; width: 40%;">{{ $movimientos->count() }}</td>
    </tr>
</table>

<div class="separador-doble"></div>

{{-- Resumen por Tipo de Operación (compacto) --}}
@php
$operacionesAgrupadas = $movimientos->groupBy(function($item) {
return $item->tipoOperacion->nombre;
});
@endphp

@if($operacionesAgrupadas->count() > 1)
<div style= margin-bottom: 5px;">
    <p style="margin: 1px 0; font-weight: bold; text-align: center;">Resumen por Tipo de Operación</p>
    <table style="width: 100%; border-collapse: collapse;">
        @foreach($operacionesAgrupadas as $tipo => $movs)
        <tr style="border-bottom: 1px dashed #ddd;">
            <td style="padding: 1px; width: 60%;">{{ Str::limit($tipo, 18) }}</td>
            <td style="padding: 1px; text-align: right; width: 40%; font-weight: bold; color: {{ $movs->sum('monto') >= 0 ? '#0A0A0A' : '#0F0F0F' }}">
                {{ number_format($movs->sum('monto'), 2) }}
            </td>
        </tr>
        @endforeach
    </table>
</div>
@endif

<div class="separador"></div>

<div style="text-align: center; color: #666; margin">
    <p style="margin: 2px 0;">{{ $empresa->nombre_comercial ?? 'Distribuidora Paucara' }}</p>
    <p style="margin: 2px 0;">{{ $fecha_impresion->format('d/m/Y H:i:s') }}</p>
</div>

@endsection
