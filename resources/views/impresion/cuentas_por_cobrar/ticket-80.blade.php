@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cuenta por Cobrar #' . $documento->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo">CUENTA POR COBRAR #{{ $documento->id }}</div>
@if($documento->referencia_documento)
    <div class="documento-numero">Referencia: {{ $documento->referencia_documento ?? 'N/A' }}</div>
@endif
<div class="center" style="margin-top: 3px;">
    <p style="margin: 2px 0;"><strong>Creado:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL CLIENTE ==================== --}}
<div class="documento-info">
    <p><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</p>
    <!-- <p><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id }}</p> -->
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
    <p><strong>Venta:</strong> #{{ $documento->venta->id ?? 'N/A' }}</p>
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
    <p><strong>Monto Pagado:</strong> Bs {{ number_format($documento->monto_pagado, 2) }}</p>
</div>

{{-- ==================== DESGLOSE DE PAGO REALIZADO ==================== --}}
@if(isset($opciones['mostrar_desglose_reciente']) && $opciones['mostrar_desglose_reciente'])
    {{-- ✅ NUEVO (2026-07-24): Mostrar desglose del pago que se acaba de registrar --}}
    <div class="separador"></div>
    <div class="documento-titulo" style="font-size: 12px; color: #000; font-weight: bold;">PAGO REALIZADO</div>
    <div class="documento-info">
        @php
            $efectivo = $opciones['efectivo'] ?? 0;
            $transferencia = $opciones['transferencia'] ?? 0;
            $totalPagado = $efectivo + $transferencia;
        @endphp

        {{-- Mostrar Efectivo (incluso si es 0) --}}
        <p style="margin: 3px 0;">
            <strong>Efectivo:</strong> Bs {{ number_format($efectivo, 2) }}
        </p>

        {{-- Mostrar Transferencia (incluso si es 0) --}}
        <p style="margin: 3px 0;">
            <strong>Transferencia/QR:</strong> Bs {{ number_format($transferencia, 2) }}
        </p>

        {{-- Total Pagado --}}
        <p style="margin-top: 5px; border-top: 1px dashed #000; padding-top: 3px; font-weight: bold;">
            <strong>Total Pagado:</strong> Bs {{ number_format($totalPagado, 2) }}
        </p>
    </div>
@elseif($documento->pagos && $documento->pagos->count() > 0)
    {{-- Mostrar histórico de pagos si no hay desglose específico --}}
    <div class="separador"></div>
    <div class="documento-titulo" style="font-size: 10px;">ÚLTIMOS PAGOS</div>
    <div class="documento-info">
        @php
            $pagosPorTipo = $documento->pagos->groupBy(function($pago) {
                return $pago->tipoPago->codigo;
            });
            $totalPorTipo = [];
            foreach ($pagosPorTipo as $tipo => $pagos) {
                $totalPorTipo[$tipo] = $pagos->sum('monto');
            }
        @endphp

        @foreach($totalPorTipo as $tipo => $total)
            @php
                $icono = $tipo === 'EFECTIVO' ? '💵' : '🔄';
                $nombre = $tipo === 'EFECTIVO' ? 'Efectivo' : 'Transferencia/QR';
            @endphp
            <p><strong>{{ $icono }} {{ $nombre }}:</strong> Bs {{ number_format($total, 2) }}</p>
        @endforeach

        @php $totalPagos = array_sum($totalPorTipo); @endphp
        <p style="margin-top: 5px; border-top: 1px dashed #000; padding-top: 3px;">
            <strong>Total Pagado:</strong> Bs {{ number_format($totalPagos, 2) }}
        </p>
    </div>
@endif

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
