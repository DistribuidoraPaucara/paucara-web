@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Stock Valorizado')

@section('contenido')
<div class="separador-doble"></div>
<div class="center"><h2 style="margin: 0; font-size: 12px;">STOCK VALORIZADO</h2><p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y') }}</p></div>
<div class="separador-doble"></div>

@forelse($datos as $almacen)
<div style="border-bottom: 1px solid #000; padding: 3px; font-size: 8px; font-weight: bold;">{{ $almacen['almacen'] }}</div>
<table style="width: 100%; font-size: 7px; margin-bottom: 2px;">
    <tr>
        <td style="padding: 2px;">Prod: {{ $almacen['total_productos'] }}</td>
        <td style="padding: 2px; text-align: right;">V.Compra: {{ number_format($almacen['valor_compra_total'], 2) }}</td>
    </tr>
    <tr>
        <td style="padding: 2px;">Cant: {{ $almacen['cantidad_total'] }}</td>
        <td style="padding: 2px; text-align: right;">V.Venta: {{ number_format($almacen['valor_venta_total'], 2) }}</td>
    </tr>
    <tr style="border-top: 1px solid #000;">
        <td style="padding: 2px; font-weight: bold;">Margen:</td>
        <td style="padding: 2px; text-align: right; font-weight: bold;">{{ number_format($almacen['margen_bruto'], 2) }}</td>
    </tr>
</table>
@empty
<p style="font-size: 9px; text-align: center;">Sin datos</p>
@endforelse

<div class="separador-doble"></div>
<div style="font-size: 8px; text-align: center;"><p style="margin: 2px 0;">{{ config('app.name') }}</p></div>
@endsection
