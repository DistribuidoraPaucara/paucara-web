@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Productos Bajo Mínimo')

@section('contenido')
<div class="separador"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 10px; font-weight: bold;">BAJO MÍNIMO</h2>
    <p style="margin: 2px 0; font-size: 7px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 7px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 2px; font-weight: bold; width: 15%;">Código</td>
        <td style="padding: 2px; font-weight: bold; width: 25%;">Producto</td>
        <td style="padding: 2px; font-weight: bold; width: 12%;">Almacén</td>
        <td style="padding: 2px; font-weight: bold; text-align: right; width: 12%;">Act</td>
        <td style="padding: 2px; font-weight: bold; text-align: right; width: 12%;">Min</td>
        <td style="padding: 2px; font-weight: bold; text-align: right; width: 12%;">Falta</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 1px; width: 15%;">{{ $item['codigo'] }}</td>
        <td style="padding: 1px; width: 25%;">{{ substr($item['nombre_producto'], 0, 15) }}</td>
        <td style="padding: 1px; width: 12%;">{{ substr($item['almacen'], 0, 8) }}</td>
        <td style="padding: 1px; text-align: right; width: 12%;">{{ $item['stock_actual'] }}</td>
        <td style="padding: 1px; text-align: right; width: 12%;">{{ $item['stock_minimo'] }}</td>
        <td style="padding: 1px; text-align: right; width: 12%; font-weight: bold;">{{ $item['falta'] }}</td>
    </tr>
</table>
@empty
<p style="font-size: 7px; text-align: center;">Sin stock bajo</p>
@endforelse

<div class="separador"></div>

<div style="font-size: 7px; text-align: center;">
    <p style="margin: 1px 0;">{{ config('app.name') }}</p>
</div>

@endsection
