@extends('impresion.layouts.base-ticket-80')

@section('titulo', 'Listado de Stock')

@section('contenido')
<div style="text-align: center; margin-bottom: 10px;">
    <h2 style="font-size: 14px; margin: 5px 0; color: #3498db;">LISTADO DE STOCK</h2>
    <p style="font-size: 9px; margin: 2px 0;">{{ now()->format('d/m/Y H:i') }}</p>
</div>

<div style="border-top: 1px dashed #000; padding-top: 5px; margin-bottom: 5px;">
    <table style="width: 100%; font-size: 8px;">
        @if($almacenFiltro)
        <tr>
            <td style="font-weight: bold;">Almacén:</td>
            <td style="text-align: right;">{{ $almacenFiltro }}</td>
        </tr>
        @endif
        <tr>
            <td style="font-weight: bold;">Registros:</td>
            <td style="text-align: right;">{{ count($stock) }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Stock Total:</td>
            <td style="text-align: right;">{{ number_format($stock->sum('cantidad'), 2) }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Disponible:</td>
            <td style="text-align: right;">{{ number_format($stock->sum('cantidad_disponible'), 2) }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Reservado:</td>
            <td style="text-align: right;">{{ number_format($stock->sum('cantidad_reservada'), 2) }}</td>
        </tr>
        <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td>Valor Total:</td>
            <td style="text-align: right;">Bs{{ number_format($stock->sum(function($item) { return ($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0); }), 2) }}</td>
        </tr>
    </table>
</div>

<div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 3px 0;">
    @foreach($stock as $item)
    <div style="margin-bottom: 8px; font-size: 8px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
        <p style="margin: 0; font-weight: bold;">{{ substr($item['producto_nombre'], 0, 35) }}</p>
        <p style="margin: 2px 0; font-size: 7px;">{{ $item['producto_codigo'] }} - {{ $item['producto_sku'] }}</p>
        <div style="display: flex; justify-content: space-between; margin-top: 2px;">
            <span>{{ $item['almacen_nombre'] }}</span>
            <span style="font-weight: bold;">{{ number_format($item['cantidad'], 2) }} un.</span>
        </div>
        <table style="width: 100%; font-size: 7px; margin-top: 2px;">
            <tr>
                <td>Disponible:</td>
                <td style="text-align: right;">{{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td>Reservado:</td>
                <td style="text-align: right;">{{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 1px solid #ccc;">
                <td>Valor Total:</td>
                <td style="text-align: right;">Bs{{ number_format(($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0), 2) }}</td>
            </tr>
        </table>
    </div>
    @endforeach
</div>

<div style="text-align: center; font-size: 7px; margin-top: 8px; padding-top: 5px; border-top: 1px dashed #000;">
    <p>Documento de referencia</p>
</div>
@endsection
