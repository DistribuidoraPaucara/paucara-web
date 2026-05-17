@extends('impresion.layouts.base-ticket')

@section('titulo', 'Productos Vendidos')

@section('contenido')
@forelse($productosVendidos as $documento)
<div style="page-break-after: always; padding: 5px; font-size: 8px;">
    <div style="text-align: center; margin-bottom: 3px;">
        <h3 style="margin: 2px 0; font-size: 10px;">PRODUCTOS VENDIDOS</h3>
        <p style="margin: 1px 0;">{{ \Carbon\Carbon::parse($fecha)->format('d/m/Y') }}</p>
        <p style="margin: 1px 0; font-size: 7px;">{{ now()->format("H:i") }}</p>
    </div>

    <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 2px 0; margin: 2px 0;">
        <table style="width: 100%; font-size: 8px;">
            <thead>
                <tr style="border-bottom: 1px solid #000;">
                    <th style="text-align: left; padding: 1px;">PRODUCTO</th>
                    <th style="text-align: center; padding: 1px;">V.</th>
                    <th style="text-align: right; padding: 1px;">I.</th>
                    <th style="text-align: right; padding: 1px;">F.</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $nombre = "-";
                    if (is_array($documento) && isset($documento["nombre"])) {
                        $nombre = $documento["nombre"];
                    } elseif (is_object($documento) && isset($documento->nombre)) {
                        $nombre = $documento->nombre;
                    }

                    $cantidad = 0;
                    if (is_array($documento) && isset($documento["cantidad_total"])) {
                        $cantidad = $documento["cantidad_total"];
                    } elseif (is_object($documento) && isset($documento->cantidad_total)) {
                        $cantidad = $documento->cantidad_total;
                    }

                    $stockInicial = 0;
                    if (is_array($documento) && isset($documento["stock_inicial"])) {
                        $stockInicial = $documento["stock_inicial"];
                    } elseif (is_object($documento) && isset($documento->stock_inicial)) {
                        $stockInicial = $documento->stock_inicial;
                    }

                    $stockActual = 0;
                    if (is_array($documento) && isset($documento["stock_actual"])) {
                        $stockActual = $documento["stock_actual"];
                    } elseif (is_object($documento) && isset($documento->stock_actual)) {
                        $stockActual = $documento->stock_actual;
                    }
                @endphp
                <tr>
                    <td style="text-align: left; padding: 1px;">{{ substr($nombre, 0, 15) }}</td>
                    <td style="text-align: center; padding: 1px;">{{ $cantidad }}</td>
                    <td style="text-align: right; padding: 1px;">{{ $stockInicial }}</td>
                    <td style="text-align: right; padding: 1px;">{{ $stockActual }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@empty
<div style="text-align: center; padding: 20px;">
    No hay productos vendidos para mostrar
</div>
@endforelse

<div style="text-align: center; margin-top: 5px; font-size: 7px; padding: 5px; border-top: 1px solid #000;">
    <p style="margin: 1px 0;">Total Productos: {{ count($productosVendidos) }}</p>
    <p style="margin: 1px 0;">Total Cantidad: {{ number_format(collect($productosVendidos)->sum('cantidad_total'), 0) }}</p>
    <p style="margin: 1px 0;"><strong>Total Monto: ${{ number_format(collect($productosVendidos)->sum('subtotal'), 2) }}</strong></p>
    <p style="margin: 2px 0 1px 0;">{{ now()->format("d/m/Y H:i") }}</p>
</div>
@endsection
