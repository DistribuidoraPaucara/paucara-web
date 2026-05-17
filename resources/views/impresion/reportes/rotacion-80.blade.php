@extends('impresion.layouts.base-ticket')
@section('titulo', 'Rotación Inventario')
@section('contenido')
<div class="separador-doble"></div>
<div class="center"><h2 style="margin: 0; font-size: 12px;">ROTACIÓN INVENTARIO</h2><p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y') }}</p></div>
<div class="separador-doble"></div>
<table style="width: 100%; font-size: 7px;">
    <tr style="border-bottom: 1px solid #000;"><td style="padding: 2px; font-weight: bold; width: 15%;">Código</td><td style="padding: 2px; font-weight: bold; width: 22%;">Producto</td><td style="padding: 2px; font-weight: bold; text-align: right; width: 15%;">Movimientos</td><td style="padding: 2px; font-weight: bold; text-align: right; width: 15%;">Cantidad</td><td style="padding: 2px; font-weight: bold; width: 20%;">Clasificación</td></tr>
</table>
<div class="separador"></div>
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;">
    <tr><td style="padding: 1px; width: 15%;">{{ $item['codigo'] }}</td><td style="padding: 1px; width: 22%;">{{ substr($item['nombre_producto'], 0, 16) }}</td><td style="padding: 1px; text-align: right; width: 15%;">{{ $item['total_movimientos'] }}</td><td style="padding: 1px; text-align: right; width: 15%;">{{ $item['cantidad_total_movida'] }}</td><td style="padding: 1px; width: 20%;">{{ substr($item['rotacion_clasificacion'], 0, 12) }}</td></tr>
</table>
@empty
<p style="font-size: 8px; text-align: center;">Sin datos</p>
@endforelse
<div class="separador-doble"></div>
<div style="font-size: 7px; text-align: center;"><p style="margin: 2px 0;">{{ config('app.name') }}</p></div>
@endsection
