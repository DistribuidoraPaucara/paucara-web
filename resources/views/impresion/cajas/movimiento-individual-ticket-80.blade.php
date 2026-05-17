@extends('impresion.layouts.base-ticket')

@section('titulo', 'Movimiento de Caja')

@section('contenido')

<div class="center" style="margin-bottom: 8px;">
    <h2 style="margin: 0; font-size: 12px; font-weight: bold;">MOVIMIENTO DE CAJA</h2>
    <p style="margin: 2px 0;">{{ $fecha_impresion->format('d/m/Y H:i:s') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Información de Caja -->
<div style="margin-bottom: 6px;">
    <p style="margin: 2px 0; padding: 0px;"><strong>CAJA: {{ $apertura->caja->nombre }}</strong></p>
    <p style="margin: 2px 0; padding: 0px;">USUARIO: {{ $usuario->name }}</p>
    <p style="margin: 2px 0; padding: 0px;">APERTURA: {{ $apertura->fecha->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Detalles del Movimiento -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
    <tbody>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Fecha/Hora</td>
            <td style="padding: 3px; width: 65%; text-align: right;">{{ $movimiento->fecha->format('d/m/Y H:i:s') }}</td>
        </tr>
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Tipo Operación</td>
            <td style="padding: 3px; width: 65%; text-align: right;">{{ $movimiento->tipoOperacion->codigo }}</td>
        </tr>
        @if($movimiento->numero_documento)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Documento</td>
            <td style="padding: 3px; width: 65%; text-align: right;">{{ $movimiento->numero_documento }}</td>
        </tr>
        @endif
        
        @if($movimiento->tipoPago)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Tipo de Pago</td>
            <td style="padding: 3px; width: 65%; text-align: right;">{{ $movimiento->tipoPago->nombre }}</td>
        </tr>
        @endif
        @if($movimiento->venta_id)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Venta ID</td>
            <td style="padding: 3px; width: 65%; text-align: right;">#{{ $movimiento->venta_id }}</td>
        </tr>
        @endif
        @if($movimiento->pago_id)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 3px; width: 35%; font-weight: bold;">Pago ID</td>
            <td style="padding: 3px; width: 65%; text-align: right;">#{{ $movimiento->pago_id }}</td>
        </tr>
        @endif
    </tbody>
</table>

<div class="separador-doble"></div>

<!-- Monto Destacado -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
    <tr style="background-color: #f5f5f5; border: 2px solid #000;">
        <td style="padding: 4px; text-align: center; width: 100%; font-weight: bold;">
            <span>
                MONTO: @if($movimiento->monto > 0) + @endif{{ number_format(abs($movimiento->monto), 2) }} Bs.
            </span>
        </td>
    </tr>
</table>

<!-- Observaciones -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
    <tr style="background-color: #f5f5f5; border: 2px solid #000;">
        <td style="padding: 4px; text-align: center; width: 100%; font-weight: bold;">
            <span>
                OBSERVACIONES: {{ $movimiento->observaciones }}
            </span>
        </td>
    </tr>
</table>

<div class="separador"></div>

<div style="text-align: center; color: #999; margin-top: 6px;">
    <p style="margin: 2px 0;">Impreso: {{ $fecha_impresion->format('d/m/Y H:i:s') }}</p>
    <p style="margin: 2px 0;">ID Movimiento: {{ $movimiento->id }}</p>
</div>

@endsection
