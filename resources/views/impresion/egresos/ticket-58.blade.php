@extends('impresion.layouts.base-ticket')

@section('titulo', 'Egreso #' . $egreso->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL EGRESO ==================== --}}
<div class="documento-titulo" style="font-size:11px;">EGRESO #{{ $egreso->id }}</div>
<div class="documento-numero" style="font-size:10px;">{{ $egreso->numero ?? 'S/N' }}</div>
<div class="center" style="margin-top: 2px; font-size:10px">
    <p style="margin: 1px 0;"><strong>Fecha:</strong> {{ $egreso->fecha->format('d/m/Y H:i') }}</p>
    <p style="margin: 1px 0;"><strong>Usuario:</strong> {{ $egreso->usuario->name ?? 'Sin usuario' }}</p>
    @if($egreso->tipoOperacion)
    <p style="margin: 1px 0;"><strong>Tipo:</strong> {{ $egreso->tipoOperacion->nombre }}</p>
    @endif
</div>

<div class="separador"></div>

{{-- ==================== DESCRIPCIÓN ==================== --}}
@if($egreso->descripcion)
<div class="documento-info" style="font-size:10px;">
    <p style="margin: 1px 0;"><strong>Descripción:</strong></p>
    <p style="margin: 1px 0; line-height: 1.2; font-size: 9px;">{{ $egreso->descripcion }}</p>
</div>

<div class="separador"></div>
@endif

{{-- ==================== DETALLES DEL EGRESO ==================== --}}
@if($egreso->detalles && $egreso->detalles->count() > 0)
<div class="documento-info" style="font-size:9px;">
    <p style="margin: 1px 0; font-weight: bold;">DETALLES</p>

    @foreach($egreso->detalles as $detalle)
        @php
            $montoUnitario = $detalle->monto_efectivo + $detalle->monto_transferencia;
        @endphp
    <div style="margin: 3px 0; padding: 2px; border: 1px solid #ddd; border-radius: 2px; background-color: #fafafa;">
        @if($detalle->concepto)
        <p style="margin: 1px 0; font-weight: bold; font-size: 8px;">{{ $detalle->concepto }}</p>
        @endif
        @if($detalle->tipoOperacion)
        <p style="margin: 1px 0; font-size: 7px; background-color: #e8f4f8; padding: 1px 2px; display: inline-block; border-radius: 1px;">{{ $detalle->tipoOperacion->nombre }}</p>
        @endif

        <table style="width: 100%; margin-top: 1px; font-size: 8px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 1px 0;"><strong>💵 Efec:</strong></td>
                <td style="text-align: right; padding: 1px 0;">Bs {{ number_format($detalle->monto_efectivo, 2) }}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 1px 0;"><strong>🔄 Transf:</strong></td>
                <td style="text-align: right; padding: 1px 0;">Bs {{ number_format($detalle->monto_transferencia, 2) }}</td>
            </tr>
            <tr style="background-color: #f0f8ff; font-weight: bold;">
                <td style="padding: 1px 0;"><strong>Unit:</strong></td>
                <td style="text-align: right; padding: 1px 0;">Bs {{ number_format($montoUnitario, 2) }}</td>
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

<div class="centro" style="font-size:10px; font-weight: bold;">
    @if($totalEfectivo > 0)
    <p style="margin: 1px 0;">💵 Efectivo: Bs {{ number_format($totalEfectivo, 2) }}</p>
    @endif
    @if($totalTransferencia > 0)
    <p style="margin: 1px 0;">🔄 Transf: Bs {{ number_format($totalTransferencia, 2) }}</p>
    @endif
    <p style="margin: 2px 0; border-top: 2px solid #000; padding-top: 1px;">
        <strong>TOTAL: Bs {{ number_format($totalGeneral, 2) }}</strong>
    </p>
</div>

<div class="separador"></div>

{{-- ==================== OBSERVACIONES ==================== --}}
@if($egreso->observaciones)
<div class="documento-info" style="font-size:9px;">
    <p style="margin: 1px 0; font-weight: bold;">OBS:</p>
    <p style="margin: 1px 0; line-height: 1.1; font-size: 8px;">{{ $egreso->observaciones }}</p>
</div>

<div class="separador"></div>
@endif

<div class="center" style="font-size:8px; margin-top: 5px;">
    <p style="margin: 1px 0;">Impreso: {{ now()->format('d/m/Y H:i') }}</p>
</div>

@endsection
