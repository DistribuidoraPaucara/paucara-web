@extends('impresion.layouts.base-ticket')

@section('titulo', 'Ticket #' . $documento->numero)

@section('estilos-adicionales')
<style>
    /* Estilos más compactos para 58mm */
    body {
        font-size: 7px;
    }
    .empresa-nombre {
        font-size: 10px;
    }
    .documento-titulo {
        font-size: 9px;
    }
    table.items {
        font-size: 6px;
    }
    .totales {
        font-size: 7px;
    }
    .totales .total-final {
        font-size: 9px;
    }
</style>
@endsection

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO (compacta) ==================== --}}
<div class="documento-titulo">{{ $documento->tipoDocumento->nombre ?? 'VENTA' }}</div>
<div class="center bold">#{{ $documento->numero }}</div>
<div class="center" style="font-size: 6px;">{{ $documento->fecha->format('d/m/Y H:i') }}</div>

<div class="separador"></div>

{{-- ==================== CLIENTE (muy compacto) ==================== --}}
<div style="font-size: 6px;">
    <p><strong>{{ $documento->cliente->nombre }}</strong></p>
    @if($documento->cliente->nit)
        <p>{{ $documento->cliente->nit }}</p>
    @endif
</div>

<div class="separador-simple"></div>

{{-- ==================== ITEMS (compactos) ==================== --}}
@include('impresion.ventas.partials._items', ['formato' => 'ticket-58'])

<div class="separador-doble"></div>

{{-- ==================== TOTALES (compactos) ==================== --}}
@include('impresion.ventas.partials._totales')

<div class="separador"></div>

{{-- ==================== MÉTODO DE PAGO ==================== --}}
<div class="center bold" style="font-size: 7px;">
    {{ $documento->politica_pago ?? 'CONTRA_ENTREGA' }}
</div>

{{-- ==================== ESTADO DE PAGO ==================== --}}
@if($documento->estado_pago === 'PAGADA')
    <div class="center" style="font-size: 7px; margin-top: 3px; color: green;">
        ✓ PAGADA
    </div>
@elseif($documento->estado_pago === 'PARCIAL' || $documento->estado_pago === 'PENDIENTE')
    <div class="center" style="font-size: 6px; margin-top: 3px;">
        {{ $documento->estado_pago }}
    </div>
@endif

<div class="separador"></div>

{{-- ==================== QR CODE (compacto) ==================== --}}
<div class="center" style="font-size: 6px;">
    @include('impresion.ventas.partials._qr')
</div>

<div class="separador-simple"></div>

{{-- ==================== CONTACTO COMPACTO ==================== --}}
<div class="center" style="font-size: 5px;">
    @if($empresa->telefono)
        T: {{ $empresa->telefono }}
    @endif
    <br>¡Gracias!
</div>

@endsection
