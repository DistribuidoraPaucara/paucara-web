@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Productos Bajo Mínimo')

@section('contenido')
<div class="separador-doble"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 12px; font-weight: bold;">PRODUCTOS BAJO MÍNIMO</h2>
    <p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 8px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 3px; font-weight: bold; width: 12%;">Código</td>
        <td style="padding: 3px; font-weight: bold; width: 20%;">Producto</td>
        <td style="padding: 3px; font-weight: bold; width: 15%;">Almacén</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Actual</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Min</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Falta</td>
        <td style="padding: 3px; font-weight: bold; width: 13%;">Categ</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 7px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 2px; width: 12%;">{{ $item['codigo'] }}</td>
        <td style="padding: 2px; width: 20%;">{{ substr($item['nombre_producto'], 0, 16) }}</td>
        <td style="padding: 2px; width: 15%;">{{ substr($item['almacen'], 0, 12) }}</td>
        <td style="padding: 2px; text-align: right; width: 10%;">{{ $item['stock_actual'] }}</td>
        <td style="padding: 2px; text-align: right; width: 10%;">{{ $item['stock_minimo'] }}</td>
        <td style="padding: 2px; text-align: right; width: 10%; font-weight: bold; color: #CC0000;">{{ $item['falta'] }}</td>
        <td style="padding: 2px; width: 13%;">{{ substr($item['categoria'], 0, 10) }}</td>
    </tr>
</table>
@empty
<p style="font-size: 9px; text-align: center; color: #666;">No hay productos bajo mínimo</p>
@endforelse

<div class="separador-doble"></div>

<div style="font-size: 8px; text-align: center;">
    <p style="margin: 2px 0;">¡Requiere reabastecimiento!</p>
    <p style="margin: 2px 0;">{{ config('app.name') }}</p>
</div>

@endsection
