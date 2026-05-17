@extends('impresion.layouts.base-a4')

@section('titulo', 'Reporte de Productos Vendidos')

@section('contenido')
{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">REPORTE DE PRODUCTOS VENDIDOS</h2>
            <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y') }}</p>
            <p><strong>Fecha de generación:</strong> {{ now()->format("d/m/Y H:i") }}</p>
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Total de productos:</strong> {{ count($productosVendidos) }}</p>
            <p><strong>Total cantidad vendida:</strong> {{ number_format(collect($productosVendidos)->sum('cantidad_total'), 0) }}</p>
            <p><strong>Monto total:</strong> ${{ number_format(collect($productosVendidos)->sum('subtotal'), 2) }}</p>
        </div>
    </div>
</div>

{{-- Tabla de productos --}}
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 4%;">#</th>
            <th style="width: 25%;">Producto</th>
            <th style="width: 8%;">SKU</th>
            <th style="width: 8%;">Vendido</th>
            <th style="width: 10%;">Precio Unit.</th>
            <th style="width: 10%;">Subtotal</th>
            <th style="width: 8%;">Stock Inicial</th>
            <th style="width: 9%;">Stock Final</th>
        </tr>
    </thead>
    <tbody>
        @forelse($productosVendidos as $item)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>
                @php
                    $nombre = "-";
                    if (is_array($item) && isset($item["nombre"])) {
                        $nombre = $item["nombre"];
                    } elseif (is_object($item) && isset($item->nombre)) {
                        $nombre = $item->nombre;
                    }
                @endphp
                <strong>{{ $nombre }}</strong>
            </td>
            <td>
                @php
                    $sku = "-";
                    if (is_array($item) && isset($item["sku"])) {
                        $sku = $item["sku"];
                    } elseif (is_object($item) && isset($item->sku)) {
                        $sku = $item->sku;
                    }
                @endphp
                {{ $sku }}
            </td>
            <td style="text-align: right;">
                @php
                    $cantidad = 0;
                    if (is_array($item) && isset($item["cantidad_total"])) {
                        $cantidad = $item["cantidad_total"];
                    } elseif (is_object($item) && isset($item->cantidad_total)) {
                        $cantidad = $item->cantidad_total;
                    }
                @endphp
                <strong>{{ number_format($cantidad, 0) }}</strong>
            </td>
            <td style="text-align: right;">
                @php
                    $precio = 0;
                    if (is_array($item) && isset($item["precio_unitario"])) {
                        $precio = $item["precio_unitario"];
                    } elseif (is_object($item) && isset($item->precio_unitario)) {
                        $precio = $item->precio_unitario;
                    }
                @endphp
                ${{ number_format($precio, 2) }}
            </td>
            <td style="text-align: right;">
                @php
                    $subtotal = 0;
                    if (is_array($item) && isset($item["subtotal"])) {
                        $subtotal = $item["subtotal"];
                    } elseif (is_object($item) && isset($item->subtotal)) {
                        $subtotal = $item->subtotal;
                    }
                @endphp
                <strong>${{ number_format($subtotal, 2) }}</strong>
            </td>
            <td style="text-align: right;">
                @php
                    $stockInicial = 0;
                    if (is_array($item) && isset($item["stock_inicial"])) {
                        $stockInicial = $item["stock_inicial"];
                    } elseif (is_object($item) && isset($item->stock_inicial)) {
                        $stockInicial = $item->stock_inicial;
                    }
                @endphp
                {{ number_format($stockInicial, 0) }}
            </td>
            <td style="text-align: right;">
                @php
                    $stockActual = 0;
                    if (is_array($item) && isset($item["stock_actual"])) {
                        $stockActual = $item["stock_actual"];
                    } elseif (is_object($item) && isset($item->stock_actual)) {
                        $stockActual = $item->stock_actual;
                    }
                @endphp
                <strong>{{ number_format($stockActual, 0) }}</strong>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="8" style="text-align: center; padding: 20px;">
                No hay productos vendidos para mostrar
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- Resumen --}}
<div class="totales">
    <table>
        <tr class="total-final">
            <td><strong>TOTAL DE PRODUCTOS:</strong></td>
            <td class="text-right">
                <strong>{{ count($productosVendidos) }}</strong>
            </td>
        </tr>
        <tr class="total-final">
            <td><strong>CANTIDAD TOTAL VENDIDA:</strong></td>
            <td class="text-right">
                <strong>{{ number_format(collect($productosVendidos)->sum('cantidad_total'), 0) }}</strong>
            </td>
        </tr>
        <tr class="total-final">
            <td><strong>MONTO TOTAL:</strong></td>
            <td class="text-right">
                <strong>${{ number_format(collect($productosVendidos)->sum('subtotal'), 2) }}</strong>
            </td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #27ae60; background: #ecf0f1;">
    <strong>Nota Informativa:</strong>
    <p style="margin-top: 5px;">
        Este es un reporte de ventas aprobadas del día {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y') }}, agrupadas por producto.
        Generado el {{ now()->format("d/m/Y \\a \\l\\a\\s H:i") }}.
    </p>
</div>
@endsection
