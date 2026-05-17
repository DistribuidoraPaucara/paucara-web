@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte Movimientos')

@section('contenido')
<div class="separador-doble"></div>

<div class="center">
    <h2 style="margin: 0; font-size: 12px; font-weight: bold;">REPORTE DE MOVIMIENTOS</h2>
    <p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador-doble"></div>

<!-- Encabezados -->
<table style="width: 100%; font-size: 8px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #000;">
        <td style="padding: 3px; font-weight: bold; width: 18%;">Fecha</td>
        <td style="padding: 3px; font-weight: bold; width: 15%;">Almacén</td>
        <td style="padding: 3px; font-weight: bold; width: 15%;">Código</td>
        <td style="padding: 3px; font-weight: bold; width: 18%;">Producto</td>
        <td style="padding: 3px; font-weight: bold; width: 12%;">Tipo</td>
        <td style="padding: 3px; font-weight: bold; text-align: right; width: 10%;">Cant</td>
    </tr>
</table>

<div class="separador"></div>

<!-- Filas de datos -->
@forelse($datos as $item)
<table style="width: 100%; font-size: 7px; margin-bottom: 1px;">
    <tr>
        <td style="padding: 2px; width: 18%; font-size: 7px;">{{ substr($item['fecha'], 0, 16) }}</td>
        <td style="padding: 2px; width: 15%; font-size: 7px;">{{ substr($item['almacen'], 0, 12) }}</td>
        <td style="padding: 2px; width: 15%; font-size: 7px;">{{ $item['codigo_producto'] }}</td>
        <td style="padding: 2px; width: 18%; font-size: 7px;">{{ substr($item['nombre_producto'], 0, 14) }}</td>
        <td style="padding: 2px; width: 12%; font-size: 7px;">{{ substr($item['tipo_movimiento'], 0, 10) }}</td>
        <td style="padding: 2px; text-align: right; width: 10%; font-size: 7px;">{{ $item['cantidad'] }}</td>
    </tr>
</table>
@empty
<p style="font-size: 9px; text-align: center; color: #666;">No hay datos para mostrar</p>
@endforelse

<div class="separador-doble"></div>

<div style="font-size: 8px; text-align: center;">
    <p style="margin: 2px 0;">Reporte de movimientos de inventario</p>
    <p style="margin: 2px 0;">{{ config('app.name') }}</p>
</div>

@endsection
