@extends('impresion.layouts.base-ticket')
@section('titulo', 'Sin Movimiento')
@section('contenido')
<div class="separador-doble"></div>
<div class="center"><h2 style="margin: 0; font-size: 12px;">SIN MOVIMIENTO</h2><p style="margin: 2px 0; font-size: 9px;">{{ now()->format('d/m/Y') }}</p></div>
<div class="separador-doble"></div>
<table style="width: 100%; font-size: 7px;">
    <tr style="border-bottom: 1px solid #000;"><td style="padding: 2px; font-weight: bold; width: 15%;">Código</td><td style="padding: 2px; font-weight: bold; width: 25%;">Producto</td><td style="padding: 2px; font-weight: bold; width: 15%;">Almacén</td><td style="padding: 2px; font-weight: bold; text-align: right; width: 15%;">Valor</td><td style="padding: 2px; font-weight: bold; width: 15%;">Días</td></tr>
</table>
<div class="separador"></div>
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;">
    <tr><td style="padding: 1px; width: 15%;">{{ $item['codigo'] }}</td><td style="padding: 1px; width: 25%;">{{ substr($item['nombre_producto'], 0, 15) }}</td><td style="padding: 1px; width: 15%;">{{ substr($item['almacen'], 0, 10) }}</td><td style="padding: 1px; text-align: right; width: 15%;">{{ number_format($item['valor_inmobilizado'], 2) }}</td><td style="padding: 1px; width: 15%;">{{ $item['dias_sin_movimiento'] }}</td></tr>
</table>
@empty
<p style="font-size: 8px; text-align: center;">Sin datos</p>
@endforelse
<div class="separador-doble"></div>
<div style="font-size: 7px; text-align: center;"><p style="margin: 2px 0;">{{ config('app.name') }}</p></div>
@endsection
