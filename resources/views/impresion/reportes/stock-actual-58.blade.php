@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Stock Actual')

@section('contenido')
<div class="separador"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 10px; font-weight: bold;">STOCK ACTUAL</h2>
    <p style="margin: 2px 0; font-size: 7px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 6px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 1px; font-weight: bold; width: 15%;">Almacén</td>
        <td style="padding: 1px; font-weight: bold; width: 12%;">Producto</td>
        <td style="padding: 1px; font-weight: bold; text-align: right; width: 10%;">Total</td>
        <td style="padding: 1px; font-weight: bold; text-align: right; width: 10%;">Dispo</td>
        <td style="padding: 1px; font-weight: bold; text-align: right; width: 10%;">Reser</td>
        <td style="padding: 1px; font-weight: bold; text-align: right; width: 18%;">Valor</td>
        <td style="padding: 1px; font-weight: bold; text-align: right; width: 15%;">V.Total</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 5px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 1px; width: 15%;">{{ substr($item['almacen'] ?? '', 0, 10) }}</td>
        <td style="padding: 1px; width: 12%;">{{ substr($item['nombre_producto'] ?? '', 0, 10) }}</td>
        <td style="padding: 1px; text-align: right; width: 10%;">{{ number_format($item['cantidad'] ?? 0, 2) }}</td>
        <td style="padding: 1px; text-align: right; width: 10%;">{{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</td>
        <td style="padding: 1px; text-align: right; width: 10%;">{{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</td>
        <td style="padding: 1px; text-align: right; width: 18%;">{{ number_format($item['precio_venta'] ?? 0, 2) }}</td>
        <td style="padding: 1px; text-align: right; width: 15%;">{{ number_format(($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0), 2) }}</td>
    </tr>
</table>
@empty
<p style="font-size: 7px; text-align: center; color: #666;">Sin datos</p>
@endforelse

<div class="separador"></div>

<div style="font-size: 7px; text-align: center;">
    <p style="margin: 1px 0;">{{ config('app.name') }}</p>
</div>

@endsection
