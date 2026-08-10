@extends('impresion.layouts.base-ticket')

@section('titulo', 'Egreso #' . $egreso->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL EGRESO ==================== --}}
<div class="documento-titulo">EGRESO DE CAJA N°{{ $egreso->id }}</div>
<div class="documento-numero">Folio: #{{ $egreso->id ?? 'S/N' }}</div>
<div class="center" style="margin-top: 3px;">
    <p style="margin: 2px 0;"><strong>Fecha:</strong> {{ $egreso->fecha->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Usuario:</strong> {{ $egreso->usuario->name ?? 'Sin usuario' }}</p>
    <!-- @if($egreso->tipoOperacion)
    <p style="margin: 2px 0;"><strong>Tipo:</strong> {{ $egreso->tipoOperacion->nombre }}</p>
    @endif -->
</div>

<div class="separador"></div>

{{-- ==================== DESCRIPCIÓN ==================== --}}
@if($egreso->descripcion)
<div class="documento-info" style="margin-top: 4px; padding-top: 4px;">
    <p style="margin: 2px 0;"><strong>Descripción:</strong> {{ $egreso->descripcion }}</p>
</div>

<div class="separador"></div>
@endif

{{-- ==================== DETALLES DEL EGRESO ==================== --}}
@if($egreso->detalles && $egreso->detalles->count() > 0)
<div class="documento-info">
    <p style="margin: 2px 0; font-weight: bold;">DETALLES DE EGRESOS</p>

    @foreach($egreso->detalles as $detalle)
        @php
            $montoUnitario = $detalle->monto_efectivo + $detalle->monto_transferencia;
        @endphp
    <div style="margin: 5px 0; padding: 3px; border: 1px solid #ddd; border-radius: 3px; background-color: #fafafa;">
        @if($detalle->concepto)
        <p style="margin: 2px 0;"><strong>{{ $detalle->concepto }}</strong></p>
        @endif
        @if($detalle->tipoOperacion)
        <p style="margin: 2px 0; background-color: #e8f4f8; padding: 2px 4px; display: inline-block; border-radius: 2px;">{{ $detalle->tipoOperacion->nombre }}</p>
        @endif

        <table style="width: 100%; margin-top: 3px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 2px 0; width: 33%;"><strong>Efectivo:</strong> Bs {{ number_format($detalle->monto_efectivo, 2) }}</td>
                <td style="padding: 2px 0; width: 33%;"><strong>QR:</strong> Bs {{ number_format($detalle->monto_transferencia, 2) }}</td>
                <td style="padding: 2px 0; width: 34%; text-align: right;"><strong>Subt.:</strong> Bs {{ number_format($montoUnitario, 2) }}</td>
            </tr>
        </table>
    </div>
    @endforeach
</div>

<div class="separador"></div>
@endif

{{-- ==================== RESUMEN DE PAGOS ==================== --}}
@php
    $totalEfectivo = $egreso->detalles->sum('monto_efectivo') ?? 0;
    $totalTransferencia = $egreso->detalles->sum('monto_transferencia') ?? 0;
    $totalGeneral = $totalEfectivo + $totalTransferencia;
@endphp

<div class="centro" style="font-weight: bold;">
    <!-- @if($totalEfectivo > 0)
    <p style="margin: 2px 0;">Efectivo: Bs {{ number_format($totalEfectivo, 2) }}</p>
    @endif
    @if($totalTransferencia > 0)
    <p style="margin: 2px 0;">Transferencia: Bs {{ number_format($totalTransferencia, 2) }}</p>
    @endif -->
    <p style="margin: 3px 0; border-top: 2px solid #000; padding-top: 2px; text-align: right;">
        <strong>TOTAL: Bs {{ number_format($totalGeneral, 2) }}</strong>
    </p>
</div>

<div class="separador"></div>

{{-- ==================== OBSERVACIONES ==================== --}}
@if($egreso->observaciones)
<div class="documento-info" style="font-size:11px;">
    <p style="margin: 2px 0; font-weight: bold;">OBSERVACIONES:</p>
    <p style="margin: 2px 0; line-height: 1.2;">{{ $egreso->observaciones }}</p>
</div>

<div class="separador"></div>
@endif


@endsection
