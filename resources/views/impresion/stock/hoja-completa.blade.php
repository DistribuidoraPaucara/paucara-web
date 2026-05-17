@extends('impresion.layouts.base-a4')

@section('titulo', 'Listado de Stock')

@section('contenido')
{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">LISTADO DE STOCK</h2>
            <p><strong>Fecha de generación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            @if($almacenFiltro)
            <p><strong>Almacén:</strong> {{ $almacenFiltro }}</p>
            @endif
            @if($busquedaFiltro)
            <p><strong>Búsqueda:</strong> {{ $busquedaFiltro }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Total de registros:</strong> {{ count($stock) }}</p>
            <p><strong>Stock total:</strong> {{ number_format($stock->sum('cantidad'), 2) }} unidades</p>
        </div>
    </div>
</div>

{{-- Tabla de stock --}}
<table class="tabla-productos mt-2">
    <thead>
        <tr>
            <th style="width: 2%;">ID</th>
            <th style="width: 25%;">Producto</th>
            {{-- <th style="width: 8%;">Código</th> --}}
            <th style="width: 8%;">SKU</th>
            <th style="width: 12%;">Almacén</th>
            <th style="width: 9%;">Total</th>
            <th style="width: 9%;">Dispo</th>
            <th style="width: 9%;">Reser</th>
            <th style="width: 9%;">Valor Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($stock as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>
                <strong>{{ $item['producto_nombre'] }}</strong>
            </td>
            {{-- <td>{{ $item['producto_codigo'] }}</td> --}}
            <td>{{ $item['producto_sku'] }}</td>
            <td>{{ $item['almacen_nombre'] }}</td>
            <td><strong>{{ number_format($item['cantidad'], 2) }}</strong></td>
            <td>{{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</td>
            <td>{{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</td>
            <td><strong>Bs{{ number_format(($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0), 2) }}</strong></td>
        </tr>
        @endforeach
    </tbody>
</table>

{{-- Resumen --}}
<div class="totales" style="font-size: 12px;">
    <table>
        <tr class="total-final">
            <td><strong>TOTAL DE REGISTROS:</strong></td>
            <td class="text-right">
                <strong>{{ count($stock) }}</strong>
            </td>
        </tr>
        <tr class="subtotal-row">
            <td><strong>STOCK TOTAL:</strong></td>
            <td class="text-right">{{ number_format($stock->sum('cantidad'), 2) }} unidades</td>
        </tr>
        <tr class="subtotal-row">
            <td><strong>DISPONIBLE:</strong></td>
            <td class="text-right">{{ number_format($stock->sum('cantidad_disponible'), 2) }} unidades</td>
        </tr>
        <tr class="subtotal-row">
            <td><strong>RESERVADO:</strong></td>
            <td class="text-right">{{ number_format($stock->sum('cantidad_reservada'), 2) }} unidades</td>
        </tr>
        <tr class="total-final">
            <td><strong>VALOR TOTAL INVENTARIO:</strong></td>
            <td class="text-right">
                <strong>Bs{{ number_format($stock->sum(function($item) { return ($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0); }), 2) }}</strong>
            </td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #3498db; background: #ecf0f1;">
    <strong>Nota Informativa:</strong>
    <p style="margin-top: 5px; font-size: 8px;">
        Este es un listado de referencia del inventario de stock de productos.
        Generado el {{ now()->format('d/m/Y \a \l\a\s H:i') }}.
    </p>
</div>
@endsection
