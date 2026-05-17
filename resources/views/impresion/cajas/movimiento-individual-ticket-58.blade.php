@extends('impresion.layouts.base-ticket')

@section('titulo', 'Movimiento de Caja')

@section('contenido')

<div class="center" style="margin-bottom: 6px;">
    <h2 style="margin: 0; font-size: 10px; font-weight: bold;">MOVIMIENTO</h2>
    <p style="margin: 1px 0; font-size: 7px;">{{ $fecha_impresion->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Información de Caja -->
<div style="font-size: 6px; margin-bottom: 4px;">
    <p style="margin: 0px; padding: 0px;"><strong>{{ $apertura->caja->nombre }}</strong></p>
    <p style="margin: 0px; padding: 0px;">{{ $usuario->name }}</p>
    <p style="margin: 0px; padding: 0px;">Apertura: {{ $apertura->fecha->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

<!-- Detalles del Movimiento -->
<table style="width: 100%; font-size: 6px; border-collapse: collapse; margin-bottom: 4px;">
    <tbody>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Fecha/Hora</td>
            <td style="padding: 1px; width: 60%; text-align: right; font-weight: bold;">{{ $movimiento->fecha->format('d/m/Y H:i') }}</td>
        </tr>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Tipo</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ $movimiento->tipoOperacion->nombre }}</td>
        </tr>
        @if($movimiento->numero_documento)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Documento</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ $movimiento->numero_documento }}</td>
        </tr>
        @endif
        @if($movimiento->observaciones)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Obs.</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ Str::limit($movimiento->observaciones, 25) }}</td>
        </tr>
        @endif
        @if($movimiento->tipoPago)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Tipo Pago</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ $movimiento->tipoPago->nombre }}</td>
        </tr>
        @endif
        @if($movimiento->venta_id)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Venta ID</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ $movimiento->venta_id }}</td>
        </tr>
        @endif
        @if($movimiento->pago_id)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 1px; width: 40%;">Pago ID</td>
            <td style="padding: 1px; width: 60%; text-align: right;">{{ $movimiento->pago_id }}</td>
        </tr>
        @endif
    </tbody>
</table>

<div class="separador"></div>

<!-- Monto -->
<table style="width: 100%; font-size: 8px; border-collapse: collapse;">
    <tr style="background-color: #f5f5f5; border-top: 1px solid #000; border-bottom: 1px solid #000;">
        <td style="padding: 2px; text-align: left; width: 50%; font-weight: bold;">MONTO:</td>
        <td style="padding: 2px; text-align: right; width: 50%; font-weight: bold; @if($movimiento->monto > 0) color: #27ae60; @else color: #e74c3c; @endif">
            @if($movimiento->monto > 0) +@endif{{ number_format(abs($movimiento->monto), 2) }}
        </td>
    </tr>
</table>

<div class="separador"></div>

<div style="font-size: 6px; text-align: center; color: #666;">
    <p style="margin: 1px 0;">{{ $fecha_impresion->format('d/m/Y H:i') }}</p>
    <p style="margin: 1px 0; font-size: 5px;">ID: {{ $movimiento->id }}</p>
</div>

@endsection
