@extends('impresion.layouts.base-ticket')

@section('titulo', 'Proforma #' . $documento->numero)

@section('contenido')
<div class="separador"></div>

{{-- Info documento --}}
<div class="center bold" style="font-size: 10px;">PROFORMA</div>
<div class="center">#{{ $documento->numero }}</div>
<div class="center" style="margin-top: 3px;">{{ $documento->fecha->format('d/m/Y H:i') }}</div>

<div class="separador"></div>

{{-- Info cliente --}}
<div><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</div>
@if($documento->cliente->nit)
<div><strong>NIT/CI:</strong> {{ $documento->cliente->nit }}</div>
@endif

<div class="separador"></div>

{{-- Estado y validez --}}
<div class="center" style="font-size: 7px;">
    <div><strong>Estado:</strong> {{ $documento->estado }}</div>
    @if($documento->fecha_vencimiento)
    <div><strong>Válida hasta:</strong> {{ $documento->fecha_vencimiento->format('d/m/Y') }}</div>
    @endif
</div>

<div class="separador"></div>

{{-- Items --}}
<table class="items">
    @foreach($documento->detalles as $detalle)
    <tr>
        <td colspan="3"><strong>{{ $detalle->producto->nombre }}</strong></td>
    </tr>
    <tr>
        <td style="width: 40%;">{{ number_format($detalle->cantidad, 2) }} x {{ number_format($detalle->precio_unitario, 2) }}</td>
        <td style="width: 20%;"></td>
        <td style="width: 40%; text-align: right;"><strong>{{ number_format($detalle->subtotal, 2) }}</strong></td>
    </tr>
    @endforeach
</table>

<div class="separador-doble"></div>

{{-- Totales --}}
<div class="totales">
    <table style="width: 100%;">
        <tr>
            <td>Subtotal:</td>
            <td class="right">{{ number_format($documento->subtotal, 2) }}</td>
        </tr>
        @if($documento->descuento > 0)
        <tr>
            <td>Descuento:</td>
            <td class="right">-{{ number_format($documento->descuento, 2) }}</td>
        </tr>
        @endif
        @if($documento->impuesto > 0)
        <tr>
            <td>Impuesto:</td>
            <td class="right">{{ number_format($documento->impuesto, 2) }}</td>
        </tr>
        @endif
        <tr class="total-final">
            <td><strong>TOTAL:</strong></td>
            <td class="right"><strong>{{ number_format($documento->total, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador-doble"></div>

<div class="center" style="font-size: 7px;">
    <div><strong>Moneda:</strong> {{ $documento->moneda->codigo ?? 'BOB' }}</div>
</div>

@if($documento->observaciones)
<div class="separador"></div>
<div style="font-size: 7px;">
    <strong>Obs:</strong> {{ Str::limit($documento->observaciones, 100) }}
</div>
@endif

<div class="separador"></div>

<div class="center" style="font-size: 6px; margin-top: 10px;">
    <div>Esta es una cotización, no constituye factura</div>
    <div>Precios y disponibilidad sujetos a cambio</div>
</div>
@endsection
