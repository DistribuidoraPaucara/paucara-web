@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Stock Actual')

@section('contenido')
<div class="separador-doble"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 12px; font-weight: bold;">REPORTE DE STOCK ACTUAL</h2>
    <p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 8px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 3px; font-weight: bold; width: 18%;">Almacén</td>
        <td style="padding: 3px; font-weight: bold; width: 12%;">Producto</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Total</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Dispo</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Reser</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 15%;">Valor</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 15%;">V.Total</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 2px; width: 18%;">{{ substr($item['almacen'] ?? '', 0, 12) }}</td>
        <td style="padding: 2px; width: 12%;">{{ substr($item['nombre_producto'] ?? '', 0, 10) }}</td>
        <td style="padding: 2px; text-align: right; width: 10%;">{{ number_format($item['cantidad'] ?? 0, 2) }}</td>
        <td style="padding: 2px; text-align: right; width: 10%;">{{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</td>
        <td style="padding: 2px; text-align: right; width: 10%;">{{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</td>
        <td style="padding: 2px; text-align: right; width: 15%;">{{ number_format($item['precio_venta'] ?? 0, 2) }}</td>
        <td style="padding: 2px; text-align: right; width: 15%;">{{ number_format(($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0), 2) }}</td>
    </tr>
</table>
@empty
<p style="font-size: 9px; text-align: center; color: #666;">No hay datos para mostrar</p>
@endforelse

<div class="separador-doble"></div>

<div style="font-size: 8px; text-align: center;">
    <p style="margin: 2px 0;">Reporte generado automáticamente</p>
    <p style="margin: 2px 0;">{{ config('app.name') }}</p>
</div>

@endsection
