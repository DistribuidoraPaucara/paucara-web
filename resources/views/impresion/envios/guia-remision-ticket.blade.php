@extends('impresion.layouts.base-ticket')

@section('titulo', 'Guía #' . $documento->numero_envio)

@section('contenido')
<div class="separador"></div>

{{-- Info del documento --}}
<div class="documento-titulo">GUÍA DE REMISIÓN</div>
<div class="documento-numero">#{{ $documento->numero_envio }}</div>
<div class="center" style="margin-top: 3px; font-size: 7px;">
    {{ $documento->fecha_programada ? $documento->fecha_programada->format('d/m/Y H:i') : 'N/A' }}
</div>

<div class="separador"></div>

{{-- Info de entrega --}}
<div class="documento-info">
    <p><strong>DESTINO:</strong></p>
    <p>{{ $documento->venta->cliente->nombre ?? 'N/A' }}</p>
    <p style="font-size: 6px;">{{ Str::limit($documento->direccion_entrega ?? 'Sin dirección', 40) }}</p>
    @if($documento->venta && $documento->venta->cliente->telefono)
        <p style="font-size: 6px;">Tel: {{ $documento->venta->cliente->telefono }}</p>
    @endif
</div>

<div class="separador-simple"></div>

<div class="documento-info">
    <p><strong>TRANSPORTE:</strong></p>
    <p style="font-size: 7px;">{{ $documento->vehiculo->placa ?? 'N/A' }}</p>
    <p style="font-size: 7px;">Chofer: {{ $documento->chofer->name ?? 'N/A' }}</p>
</div>

<div class="separador"></div>

{{-- Items --}}
<div class="center bold" style="font-size: 7px; margin-bottom: 3px;">PRODUCTOS A ENTREGAR</div>
<table class="items">
    @if($documento->venta && $documento->venta->detalles)
        @foreach($documento->venta->detalles as $detalle)
        <tr>
            <td style="width: 70%;" class="item-nombre">
                {{ Str::limit($detalle->producto->nombre, 25) }}
            </td>
            <td style="width: 30%; text-align: right;">
                <strong>x{{ number_format($detalle->cantidad, 0) }}</strong>
            </td>
        </tr>
        @if($detalle->producto->codigo)
        <tr>
            <td colspan="2" class="item-detalle">Cód: {{ $detalle->producto->codigo }}</td>
        </tr>
        @endif
        <tr><td colspan="2" style="height: 2px;"></td></tr>
        @endforeach
    @endif
</table>

<div class="separador-doble"></div>

{{-- Estado --}}
<div class="center bold" style="font-size: 8px;">
    Estado: {{ str_replace('_', ' ', $documento->estado) }}
</div>

@if($documento->venta)
<div class="center" style="font-size: 6px; margin-top: 2px;">
    Venta: #{{ $documento->venta->numero }}
</div>
@endif

{{-- Espacio para firma --}}
<div class="separador"></div>
<div style="margin-top: 15px;">
    <div class="center" style="font-size: 6px; margin-bottom: 20px;">
        FIRMA RECIBIDO
    </div>
    <div style="border-top: 1px solid #000; margin: 0 10px;"></div>
    <div class="center" style="font-size: 6px; margin-top: 3px;">
        Nombre y CI
    </div>
</div>

{{-- Observaciones --}}
@if($documento->observaciones)
<div class="observaciones">
    <strong>Obs:</strong>
    {{ Str::limit($documento->observaciones, 80) }}
</div>
@endif
@endsection
