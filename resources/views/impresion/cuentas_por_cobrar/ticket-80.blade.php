@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cuenta por Cobrar #' . $documento->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo">CUENTA POR COBRAR N°{{ $documento->id }}</div>
<div class="documento-numero">Referencia: {{ $documento->referencia_documento ?? 'N/A' }}</div>
<div class="center" style="margin-top: 3px;">
    <p style="margin: 2px 0;"><strong>Creado:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL CLIENTE ==================== --}}
<div class="documento-info">
    <p><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</p>
    <p><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id }}</p>
    @if($documento->cliente->nit)
    <p><strong>NIT/CI:</strong> {{ $documento->cliente->nit }}</p>
    @endif
    @if($documento->cliente->telefono)
    <p><strong>Teléfono:</strong> {{ $documento->cliente->telefono }}</p>
    @endif
</div>

<div class="separador"></div>

{{-- ==================== DETALLES DE LA CUENTA ==================== --}}
<div class="documento-info">
    @if($documento->venta_id)
    <p><strong>Venta:</strong> {{ $documento->venta->numero ?? 'N/A' }}</p>
    @endif

    <p><strong>Tipo:</strong> {{ $documento->tipo ?? 'NORMAL' }}</p>

    <p><strong>Estado:</strong>
        @if($documento->estado === 'PAGADA')
            PAGADA
        @elseif($documento->estado === 'PENDIENTE')
            PENDIENTE
        @elseif($documento->estado === 'VENCIDA')
            VENCIDA
        @elseif($documento->estado === 'PARCIAL')
            PARCIAL
        @else
            {{ strtoupper($documento->estado) }}
        @endif
    </p>
</div>

<div class="separador"></div>

{{-- ==================== MONTOS ==================== --}}
<div class="documento-info">
    <p><strong>Monto Original:</strong> Bs {{ number_format($documento->monto_original, 2) }}</p>
    <p><strong>Monto Total:</strong> Bs {{ number_format($documento->monto_total, 2) }}</p>
    <p><strong>Monto Pagado:</strong> Bs {{ number_format($documento->monto_pagado, 2) }}</p>
</div>

<div class="separador-doble"></div>

{{-- ==================== SALDO PENDIENTE ==================== --}}
<div class="center bold">
    <p style="margin: 5px 0; color: #000;">SALDO PENDIENTE</p>
    <p style="margin: 5px 0;">Bs {{ number_format($documento->saldo_pendiente, 2) }}</p>
</div>

<div class="separador-doble"></div>

{{-- ==================== FECHAS ==================== --}}
<div class="documento-info">
    <p><strong>Vencimiento:</strong> {{ $documento->fecha_vencimiento->format('d/m/Y') }}</p>
    @if($documento->dias_vencido && $documento->dias_vencido > 0)
    <p><strong style="color: red;">Vencido:</strong> <span style="color: red;">{{ $documento->dias_vencido }} días</span></p>
    @endif
</div>

<div class="separador"></div>

{{-- ==================== OBSERVACIONES ==================== --}}
@if($documento->observaciones)
<div class="observaciones">
    <strong>Obs:</strong>
    {{ Str::limit($documento->observaciones, 100) }}
</div>
@endif

<div class="separador"></div>

{{-- ==================== INFORMACIÓN DEL USUARIO ==================== --}}
@if($documento->usuario)
<div class="documento-info">
    <p><strong>Registrado por:</strong> {{ $documento->usuario->name }}</p>
</div>
@endif

<div class="separador"></div>

@endsection
