@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Movimientos')

@section('contenido')
<div class="separador"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 10px; font-weight: bold;">MOVIMIENTOS</h2>
    <p style="margin: 2px 0; font-size: 7px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 7px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 2px; font-weight: bold; width: 20%;">Fecha</td>
        <td style="padding: 2px; font-weight: bold; width: 18%;">Almacén</td>
        <td style="padding: 2px; font-weight: bold; width: 14%;">Cód</td>
        <td style="padding: 2px; font-weight: bold; width: 24%;">Producto</td>
        <td style="padding: 2px; font-weight: bold; text-align: right; width: 12%;">Cant</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 1px; width: 20%;">{{ substr($item['fecha'], 0, 10) }}</td>
        <td style="padding: 1px; width: 18%;">{{ substr($item['almacen'], 0, 10) }}</td>
        <td style="padding: 1px; width: 14%;">{{ $item['codigo_producto'] }}</td>
        <td style="padding: 1px; width: 24%;">{{ substr($item['nombre_producto'], 0, 15) }}</td>
        <td style="padding: 1px; text-align: right; width: 12%;">{{ $item['cantidad'] }}</td>
    </tr>
</table>
@empty
<p style="font-size: 7px; text-align: center;">Sin datos</p>
@endforelse

<div class="separador"></div>

<div style="font-size: 7px; text-align: center;">
    <p style="margin: 1px 0;">{{ config('app.name') }}</p>
</div>

@endsection
