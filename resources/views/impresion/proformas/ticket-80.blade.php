@extends('impresion.layouts.base-ticket')
@section('titulo', 'Proforma #' . $documento->numero)

@section('contenido')

<div class="separador"></div>
{{-- Encabezado --}}
<div style="text-align: center; margin-bottom: 10px; font-size: 11px;">
    <h3 style="margin: 5px 0;">PROFORMA <br/> {{ $documento->numero }}</h3>
    <p>Folio: {{ $documento->id }}</p>
    <p style="margin: 3px 0;">{{ $documento->created_at->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- CLIENTE --}}
<div style="margin-bottom: 8px; font-size: 11px;">
    <p style="margin: 2px 0;"><strong>{{ $documento->cliente?->nombre ?? 'CLIENTE' }}</strong></p>
    @if($documento->cliente?->nit_ci)
        <p style="margin: 2px 0;">NIT/CI: {{ $documento->cliente->nit_ci }}</p>
    @endif
    @if($documento->cliente?->localidad)
        <p style="margin: 2px 0;"><strong>Localidad: </strong> {{ $documento->cliente->localidad->nombre }}</p>
    @endif
</div>

{{-- PREVENTISTA --}}
@if($documento->usuarioCreador)
<div style="margin-bottom: 8px; font-size: 11px;">
    <p style="margin: 2px 0;"><strong>Preventista:</strong> {{ $documento->usuarioCreador->name }}</p>
</div>
@endif

<hr style="margin: 10px 0; border: none; border-top: 1px solid #333;">

{{-- PRODUCTOS/ITEMS --}}
@include('impresion.ventas.partials._items', ['formato' => 'ticket-80'])

{{-- TOTALES --}}
<div style="margin: 10px 0; border-top: 2px solid #333; border-bottom: 1px solid #333; font-size: 11px;">
    @php
        $subtotal = $documento->subtotal ?? 0;
        $descuento = $documento->descuento ?? 0;
        $impuesto = $documento->impuesto ?? 0;
        $total = $documento->total ?? 0;
    @endphp
    @if($subtotal > 0)
    <div style="display: flex; justify-content: space-between; padding: 3px 0;">
        <span>Subtotal:</span>
        <span>{{ number_format($subtotal, 2) }}</span>
    </div>
    @endif
    @if($descuento > 0)
    <div style="display: flex; justify-content: space-between; padding: 3px 0;">
        <span>Descuento:</span>
        <span>-{{ number_format($descuento, 2) }}</span>
    </div>
    @endif
    <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: bold; border-top: 1px solid #333; margin-top: 3px;">
        <span>TOTAL:</span>
        <span>{{ number_format($total, 2) }}</span>
    </div>
</div>

{{-- INFORMACIÓN IMPORTANTE --}}
<div style="margin-top: 10px; font-size: 11px;">
    <p style="margin: 3px 0;">
        <strong>📅 Válida hasta:</strong><br>
        {{ $documento->fecha_vencimiento->format('d/m/Y') }}
        @if($documento->fecha_vencimiento < now())
            <span style="color: red; font-weight: bold;">⚠️ VENCIDA</span>
        @endif
    </p>

    @if($documento->fecha_entrega_solicitada)
    <p style="margin: 3px 0; margin-top: 5px; font-size: 11px;">
        <strong>🚚 Entrega solicitada:</strong><br>
        {{ $documento->fecha_entrega_solicitada->format('d/m/Y') }}
        @if($documento->hora_entrega_solicitada)
            ⏰ {{ $documento->hora_entrega_solicitada }}
        @endif
    </p>
    @endif
</div>

<div class="separador"></div>
@endsection
