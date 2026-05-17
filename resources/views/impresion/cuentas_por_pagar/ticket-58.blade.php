@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cuenta por Pagar #' . $documento->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo">CTA PAGAR N°{{ $documento->id }}</div>
<div style="text-align: center; margin: 3px 0; font-size: 10px;">
    <p style="margin: 1px 0;">{{ $documento->created_at->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL PROVEEDOR ==================== --}}
<div class="documento-info">
    <p><strong>Proveedor:</strong></p>
    <p style="margin: 2px 0; font-size: 11px;">{{ $documento->compra?->proveedor?->nombre ?? 'N/A' }}</p>
    @if($documento->compra?->proveedor?->ruc)
    <p><strong>RUC:</strong> {{ $documento->compra->proveedor->ruc }}</p>
    @endif
</div>

<div class="separador"></div>

{{-- ==================== MONTOS ==================== --}}
<div class="documento-info">
    <p><strong>Monto Orig.:</strong> Bs {{ number_format($documento->monto_original, 2) }}</p>
    @if($documento->monto_pagado && $documento->monto_pagado > 0)
    <p><strong>Pagado:</strong> Bs {{ number_format($documento->monto_pagado, 2) }}</p>
    @endif
</div>

<div class="separador-doble"></div>

{{-- ==================== SALDO PENDIENTE ==================== --}}
<div class="center bold" style="font-size: 12px;">
    <p style="margin: 3px 0; color: #000;">SALDO PENDIENTE</p>
    <p style="margin: 3px 0; font-size: 14px;">Bs {{ number_format($documento->saldo_pendiente, 2) }}</p>
</div>

<div class="separador-doble"></div>

{{-- ==================== FECHAS ==================== --}}
<div class="documento-info">
    <p><strong>Vencimiento:</strong> {{ $documento->fecha_vencimiento->format('d/m/Y') }}</p>
    <p><strong>Estado:</strong>
        @if($documento->estado === 'PAGADO')
            PAGADO
        @elseif($documento->estado === 'VENCIDO')
            VENCIDO
        @elseif($documento->estado === 'PARCIAL')
            PARCIAL
        @else
            PENDIENTE
        @endif
    </p>
</div>

<div class="separador"></div>

@endsection
