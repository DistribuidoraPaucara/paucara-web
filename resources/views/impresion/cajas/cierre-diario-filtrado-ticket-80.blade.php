@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre Diario - Reporte Filtrado')

@section('contenido')
<div class="separador"></div>

<div class="documento-titulo" style="font-size: 11px;">CIERRE DIARIO</div>
<div class="documento-numero" style="font-size: 10px;">Reporte Filtrado</div>
<div class="center" style="font-size: 8px; margin-top: 3px;">
    {{ $cierre->fecha->format('d/m/Y H:i:s') }}
</div>

<div class="separador"></div>

<div class="documento-info" style="font-size: 9px;">
    <p><strong>Ejecutado por:</strong> {{ $cierre->usuario->name }}</p>
    <p><strong>Caja:</strong> {{ $cierre->caja->nombre }}</p>
</div>

<div class="separador-doble"></div>

@if(!empty($filtros_aplicados['tipos']) || !empty($filtros_aplicados['busqueda']) || $filtros_aplicados['monto_min'] || $filtros_aplicados['monto_max'])
<div class="documento-info" style="font-size: 8px;">
    <strong>Filtros Aplicados:</strong>
    @if(!empty($filtros_aplicados['tipos']))
        <p style="margin: 2px 0;">Tipos: {{ implode(', ', $filtros_aplicados['tipos']) }}</p>
    @endif
    @if(!empty($filtros_aplicados['busqueda']))
        <p style="margin: 2px 0;">Documento: "{{ $filtros_aplicados['busqueda'] }}"</p>
    @endif
    @if($filtros_aplicados['monto_min'])
        <p style="margin: 2px 0;">Mín: Bs. {{ number_format($filtros_aplicados['monto_min'], 2) }}</p>
    @endif
    @if($filtros_aplicados['monto_max'])
        <p style="margin: 2px 0;">Máx: Bs. {{ number_format($filtros_aplicados['monto_max'], 2) }}</p>
    @endif
</div>
<div class="separador"></div>
@endif

<div class="totales">
    <table style="width: 100%; font-size: 9px;">
        <tr style="border-bottom: 1px solid #000;">
            <td style="width: 50%;"><strong>Movimientos:</strong></td>
            <td class="right" style="width: 50%;"><strong>{{ $movimientos_count }}</strong></td>
        </tr>
        <tr style="height: 2px;"></tr>
        <tr>
            <td><strong>Ingresos:</strong></td>
            <td class="right"><strong>{{ number_format($total_ingresos, 2) }}</strong></td>
        </tr>
        <tr style="height: 1px;"></tr>
        <tr>
            <td><strong>Egresos:</strong></td>
            <td class="right"><strong>{{ number_format($total_egresos, 2) }}</strong></td>
        </tr>
        <tr style="height: 2px;"></tr>
        <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
            <td><strong>Total Neto:</strong></td>
            <td class="right"><strong>{{ number_format($total_neto, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador-doble"></div>

<div class="center" style="font-size: 10px; font-weight: bold;">
    @if($total_neto >= 0)
        <div style="color: green;">✓ POSITIVO</div>
    @else
        <div style="color: red;">✗ NEGATIVO</div>
    @endif
    <div style="font-size: 11px; margin-top: 3px;">Bs. {{ number_format($total_neto, 2) }}</div>
</div>

<div class="separador"></div>

<div class="documento-info" style="font-size: 8px;">
    <p><strong>Cierre #:</strong> {{ $cierre->id }}</p>
    <p><strong>Fecha Apertura:</strong> {{ $cierre->apertura->fecha->format('d/m/Y H:i') }}</p>
    <p><strong>Fecha Cierre:</strong> {{ $cierre->fecha->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

<div class="center" style="font-size: 8px;">
    <p>BOB - Reporte Filtrado</p>
    <p style="margin-top: 2px; font-size: 7px;">{{ now()->format('d/m/Y H:i:s') }}</p>
</div>

<div class="separador"></div>

@endsection
