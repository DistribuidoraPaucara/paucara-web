@extends('impresion.layouts.base-ticket')

@section('titulo', 'Stock Valorizado')

@section('contenido')
<div class="separador"></div>
<div class="center"><h2 style="margin: 0; font-size: 10px;">VALORIZADO</h2><p style="margin: 1px 0; font-size: 7px;">{{ now()->format('d/m/Y') }}</p></div>
<div class="separador"></div>

@forelse($datos as $almacen)
<div style="border-bottom: 1px solid #000; padding: 2px; font-size: 7px; font-weight: bold;">{{ substr($almacen['almacen'], 0, 20) }}</div>
<table style="width: 100%; font-size: 6px;">
    <tr><td>Prod: {{ $almacen['total_productos'] }}</td><td style="text-align: right;">Compra: {{ number_format($almacen['valor_compra_total'], 2) }}</td></tr>
    <tr><td>Cant: {{ $almacen['cantidad_total'] }}</td><td style="text-align: right;">Venta: {{ number_format($almacen['valor_venta_total'], 2) }}</td></tr>
</table>
@empty
<p style="font-size: 7px; text-align: center;">Sin datos</p>
@endforelse

<div class="separador"></div>
<div style="font-size: 7px; text-align: center;"><p style="margin: 1px 0;">{{ config('app.name') }}</p></div>
@endsection
