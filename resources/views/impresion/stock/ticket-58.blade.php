@extends('impresion.layouts.base-ticket-58')

@section('titulo', 'Listado de Stock')

@section('contenido')
<div style="text-align: center; margin-bottom: 8px;">
    <h2 style="font-size: 12px; margin: 3px 0; color: #3498db;">STOCK</h2>
    <p style="font-size: 8px; margin: 1px 0;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div style="border-top: 1px dashed #000; padding-top: 3px; margin-bottom: 3px;">
    <table style="width: 100%; font-size: 6px;">
        <tr>
            <td>Registros:</td>
            <td style="text-align: right;">{{ count($stock) }}</td>
        </tr>
        <tr>
            <td>Total Cantidad:</td>
            <td style="text-align: right;">{{ number_format($stock->sum('cantidad'), 2) }}</td>
        </tr>
        <tr>
            <td>Valor Total:</td>
            <td style="text-align: right;">Bs{{ number_format($stock->sum(function($item) { return ($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0); }), 2) }}</td>
        </tr>
    </table>
</div>

<div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 2px 0; font-size: 6px;">
    @foreach($stock as $item)
    <div style="margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 3px;">
        <p style="margin: 0; font-weight: bold; font-size: 6px;">{{ substr($item['producto_nombre'], 0, 20) }}</p>
        <div style="display: flex; justify-content: space-between; margin: 1px 0;">
            <span>{{ $item['almacen_nombre'] }}</span>
            <span style="font-weight: bold;">{{ number_format($item['cantidad'], 2) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 5px;">
            <span>Dispo: {{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</span>
            <span>Reser: {{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</span>
        </div>
        <div style="text-align: right; font-weight: bold; font-size: 5px;">
            V: Bs{{ number_format(($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0), 2) }}
        </div>
    </div>
    @endforeach
</div>

<div style="text-align: center; font-size: 6px; margin-top: 5px;">Referencia</div>
@endsection
