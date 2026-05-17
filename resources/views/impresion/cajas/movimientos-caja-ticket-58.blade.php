@extends('impresion.layouts.base-ticket')

@section('titulo', 'Movimientos de Caja')

@section('contenido')

<div class="center" style="margin-bottom: 6px;">
    <h2 style="margin: 0; font-size: 10px; font-weight: bold;">MOVIMIENTOS</h2>
    <p style="margin: 1px 0; font-size: 7px;">{{ $fecha_impresion->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Información compacta -->
<div style="font-size: 6px; margin-bottom: 4px;">
    <p style="margin: 0px; padding: 0px;"><strong>{{ $apertura->caja->nombre }}</strong></p>
    <p style="margin: 0px; padding: 0px;">{{ $usuario->name }}</p>
    <p style="margin: 0px; padding: 0px;">Monto.I: {{ number_format($apertura->monto_apertura, 2) }}</p>
</div>

<div class="separador"></div>

<!-- Tabla compacta de movimientos -->
<table style="width: 100%; font-size: 6px; border-collapse: collapse; margin-bottom: 4px;">
    <tbody>
        @forelse($movimientos as $movimiento)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 50%;">{{ $movimiento->fecha->format('H:i') }} {{ Str::limit($movimiento->observaciones) }}</td>
            <td style="padding: 1px; text-align: right; width: 50%; @if($movimiento->monto > 0) color: #27ae60; @else color: #e74c3c; @endif font-weight: bold;">
                @if($movimiento->monto > 0) +@endif{{ number_format(abs($movimiento->monto), 2) }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="2" style="padding: 3px; text-align: center; font-size: 7px; color: #999;">Sin movimientos</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="separador"></div>

<!-- Resumen ultra compacto -->
<table style="width: 100%; font-size: 7px; border-collapse: collapse; text-align: right;">
    <tr>
        <td style="padding: 0px; text-align: left; width: 50%;"><strong>+</strong></td>
        <td style="padding: 0px; width: 50%; color: #27ae60; font-weight: bold;">{{ number_format($totalIngresos, 2) }}</td>
    </tr>
    <tr>
        <td style="padding: 0px; text-align: left; width: 50%;"><strong>-</strong></td>
        <td style="padding: 0px; width: 50%; color: #e74c3c; font-weight: bold;">{{ number_format($totalEgresos, 2) }}</td>
    </tr>
    <tr style="border-top: 1px solid #000;">
        <td style="padding: 1px; text-align: left; width: 50%; font-weight: bold;">TOTAL:</td>
        <td style="padding: 1px; width: 50%; font-weight: bold;">{{ number_format($totalDia, 2) }}</td>
    </tr>
</table>

<div class="separador"></div>

<div style="font-size: 6px; text-align: center; color: #666;">
    <p style="margin: 1px 0;">{{ $fecha_impresion->format('d/m/Y H:i') }}</p>
</div>

@endsection
