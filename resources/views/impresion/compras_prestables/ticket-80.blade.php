@extends('impresion.layouts.base-ticket')

@section('titulo', 'Compra Prestables #' . $documento->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo" style="font-size:12px;">COMPRA PRESTABLES Folio°{{ $documento->id }}</div>
<div class="center" style="margin-top: 3px; font-size:11px">
    <p style="margin: 2px 0;"><strong>Fecha:</strong> {{ $documento->fecha_compra->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL PROVEEDOR ==================== --}}
<div class="documento-info" style="font-size:12px;">
    @if($documento->proveedor)
    <p><strong>Proveedor:</strong> {{ $documento->proveedor->nombre }}</p>
    @if($documento->proveedor->razon_social)
    <p><strong>Razon Social:</strong> {{ $documento->proveedor->razon_social }}</p>
    @endif
    @if($documento->proveedor->nit)
    <p><strong>NIT/CI:</strong> {{ $documento->proveedor->nit }}</p>
    @endif
    @else
    <p><strong>Proveedor:</strong> (Sin proveedor)</p>
    @endif
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            @if($documento->usuario)
            <td style="width: 100%; padding: 2px 5px;"><strong>Usuario:</strong> {{ $documento->usuario->name }}</td>
            @endif
        </tr>
    </table>
</div>

<div class="separador"></div>

{{-- ==================== TABLA DE ITEMS ==================== --}}
<table class="items">
    <thead>
        <tr style="border-bottom: 1px solid #000;">
            <th style="text-align: left; padding: 2px 0; font-size: 11px;"><strong>Prestable</strong></th>
            <th style="text-align: center; padding: 2px 0; font-size: 11px;"><strong>Cant</strong></th>
            <th style="text-align: right; padding: 2px 0; font-size: 11px;"><strong>Precio</strong></th>
            <th style="text-align: right; padding: 2px 0; font-size: 11px;"><strong>Total</strong></th>
        </tr>
    </thead>
    <tbody>
        @forelse($documento->detalles as $detalle)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="text-align: left; padding: 2px 0; font-size: 11px;">
                {{ $detalle->prestable->nombre }}
            </td>
            <td style="text-align: center; padding: 2px 0; font-size: 11px;">
                {{ $detalle->cantidad }}
            </td>
            <td style="text-align: right; padding: 2px 0; font-size: 11px;">
                {{ number_format($detalle->precio_unitario, 2) }}
            </td>
            <td style="text-align: right; padding: 2px 0; font-size: 11px;">
                {{ number_format($detalle->subtotal, 2) }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="4" style="text-align: center; padding: 10px 0; font-size: 11px;">Sin detalles</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="separador-doble"></div>

{{-- ==================== TOTALES ==================== --}}
<table style="width: 100%; border-collapse: collapse;">
    <tr>
        <td style="text-align: right; padding: 3px 0; font-size: 12px; font-weight: bold;">TOTAL:</td>
        <td></td>
        <td></td>
        <td style="text-align: right; padding: 3px 5px; font-size: 12px; font-weight: bold;">
            {{ number_format($documento->total, 2) }}
        </td>
    </tr>
</table>

<div class="separador"></div>

{{-- ==================== OBSERVACIONES ==================== --}}
@if($documento->observaciones)
<div style="font-size: 10px; margin: 5px 0;">
    <p><strong>Obs:</strong> {{ $documento->observaciones }}</p>
</div>
<div class="separador"></div>
@endif

{{-- ==================== FOOTER ==================== --}}
{{-- <div class="center" style="font-size: 10px; margin-top: 5px;">
    <p style="margin: 2px 0;">{{ config('app.name') }}</p>
    <p style="margin: 2px 0;">Compra de prestables</p>
</div> --}}

@endsection
