@extends('impresion.layouts.base-ticket')
@section('titulo', 'Vencimientos')
@section('contenido')
<div class="separador"></div>
<div class="center"><h2 style="margin: 0; font-size: 10px;">VENCIMIENTOS</h2><p style="margin: 1px 0; font-size: 7px;">{{ now()->format('d/m/Y') }}</p></div>
<div class="separador"></div>
@forelse($datos as $item)
<table style="width: 100%; font-size: 6px; margin-bottom: 1px;"><tr><td style="padding: 1px;">{{ $item['codigo'] }} - {{ substr($item['nombre_producto'], 0, 15) }}</td></tr><tr><td style="padding: 1px; font-size: 5px;">Vence: {{ $item['fecha_vencimiento'] }} | Estado: {{ $item['estado'] }}</td></tr></table>
@empty
<p style="font-size: 6px; text-align: center;">Sin datos</p>
@endforelse
<div class="separador"></div>
<div style="font-size: 6px; text-align: center;"><p style="margin: 1px 0;">{{ config('app.name') }}</p></div>
@endsection
