@extends('impresion.layouts.base-ticket')

@section('titulo', 'Pago - ' . $cliente['nombre'])

@section('contenido')
<div class="separador"></div>

{{-- Título --}}
<div class="documento-titulo">
    COMPROBANTE
</div>
<div class="document-numero">{{ $cliente['codigo_cliente'] }}</div>
<div class="center" style="font-size: 5px; margin-top: 2px;">
    {{ $fecha_impresion->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

{{-- Monto destacado --}}
<div style="text-align: center; padding: 5px 0;">
    <p style="font-size: 6px; margin: 0;">MONTO</p>
    <p style="font-size: 16px; margin: 2px 0; font-weight: bold; color: #27ae60;">{{ $pago['moneda']['simbolo'] }} {{ number_format($pago['monto'], 2) }}</p>
</div>

<div class="separador"></div>

{{-- Cliente y tipo de pago --}}
<div style="font-size: 6px;">
    <p style="margin: 1px 0;"><strong>{{ substr($cliente['nombre'], 0, 25) }}</strong></p>
    <p style="margin: 1px 0;">{{ $pago['tipo_pago'] }}</p>
</div>

<div class="separador"></div>

{{-- Referencias abreviadas --}}
@php
    $refs = [];
    if ($pago['numero_recibo']) $refs[] = 'R: ' . $pago['numero_recibo'];
    if ($pago['numero_transferencia']) $refs[] = 'T: ' . substr($pago['numero_transferencia'], 0, 10);
    if ($pago['numero_cheque']) $refs[] = 'Ch: ' . $pago['numero_cheque'];
@endphp

@if(count($refs) > 0)
<div style="font-size: 5px;">
    @foreach($refs as $ref)
    <p style="margin: 1px 0;">{{ $ref }}</p>
    @endforeach
</div>

<div class="separador"></div>
@endif

{{-- Saldos en tabla simple --}}
@if($cuenta)
<div style="font-size: 5px;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 1px;">Anterior:</td>
            <td style="text-align: right; padding: 1px;">{{ $pago['moneda']['simbolo'] }} {{ number_format($cuenta['saldo_anterior'], 0) }}</td>
        </tr>
        <tr style="color: #27ae60;">
            <td style="padding: 1px;"><strong>Pago:</strong></td>
            <td style="text-align: right; padding: 1px;"><strong>({{ $pago['moneda']['simbolo'] }} {{ number_format($pago['monto'], 0) }})</strong></td>
        </tr>
        <tr style="border-top: 1px solid #999;">
            <td style="padding: 1px;"><strong>Nuevo:</strong></td>
            <td style="text-align: right; padding: 1px;"><strong>{{ $pago['moneda']['simbolo'] }} {{ number_format($cuenta['saldo_pendiente'], 0) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador"></div>
@endif

{{-- Estado --}}
<div class="center" style="font-size: 5px; font-weight: bold;">
    @if($cuenta && $cuenta['saldo_pendiente'] == 0)
        ✓ PAGADO
    @elseif($cuenta && $cuenta['saldo_pendiente'] < $cuenta['monto_original'])
        ⚬ PARCIAL
    @else
        ⏳ PAGO
    @endif
</div>

<div style="text-align: center; font-size: 4px; color: #666; margin-top: 3px;">
    <p style="margin: 1px 0;">{{ now()->format('d/m/y H:i') }}</p>
</div>

@endsection
