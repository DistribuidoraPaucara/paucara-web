@extends('impresion.layouts.base-a4')

@section('titulo', 'Compra Individual')

@section('contenido')

@php
    $compra = $compras->first();

    if (!$compra) {
        echo '<p style="text-align: center; color: #e74c3c;">No hay datos de compra para mostrar</p>';
        return;
    }

    // Funciones helper para extraer datos
    function obtenerProveedor($compra) {
        if (is_array($compra) && isset($compra['proveedor'])) {
            $prov = $compra['proveedor'];
            return is_array($prov) ? ($prov['nombre'] ?? '-') : (is_object($prov) ? ($prov->nombre ?? '-') : '-');
        }
        return is_object($compra) && isset($compra->proveedor) ? ($compra->proveedor->nombre ?? '-') : '-';
    }

    function obtenerFecha($compra) {
        $fecha = is_array($compra) && isset($compra['fecha'])
            ? $compra['fecha']
            : (is_object($compra) && isset($compra->fecha) ? $compra->fecha : null);
        if (!$fecha) return '-';
        return is_string($fecha) ? date('d/m/Y', strtotime($fecha)) : $fecha->format('d/m/Y');
    }

    function obtenerEstado($compra) {
        if (is_array($compra) && isset($compra['estado_documento'])) {
            $est = $compra['estado_documento'];
            return is_array($est) ? ($est['nombre'] ?? '-') : (is_object($est) ? ($est->nombre ?? '-') : '-');
        }
        return is_object($compra) && isset($compra->estadoDocumento) ? ($compra->estadoDocumento->nombre ?? '-') : '-';
    }

    function obtenerSubtotal($compra) {
        if (is_array($compra) && isset($compra['subtotal'])) {
            return (float)$compra['subtotal'];
        }
        return is_object($compra) && isset($compra->subtotal) ? (float)$compra->subtotal : 0;
    }

    function obtenerTotal($compra) {
        if (is_array($compra) && isset($compra['total'])) {
            return (float)$compra['total'];
        }
        return is_object($compra) && isset($compra->total) ? (float)$compra->total : 0;
    }

    $proveedor = obtenerProveedor($compra);
    $fecha = obtenerFecha($compra);
    $estado = obtenerEstado($compra);
    $subtotal = obtenerSubtotal($compra);
    $total = obtenerTotal($compra);
@endphp

{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">COMPRA</h2>
            <p><strong>Proveedor:</strong> {{ $proveedor }}</p>
            <p><strong>Fecha:</strong> {{ $fecha }}</p>
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Estado:</strong> {{ $estado }}</p>
            <p><strong>Monto Total:</strong> <span style="color: #27ae60; font-size: 14px; font-weight: bold;">Bs{{ number_format($total, 2) }}</span></p>
        </div>
    </div>
</div>

{{-- Tabla de productos --}}
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 40%;">Producto</th>
            <th style="width: 15%;" class="text-right">Cantidad</th>
            <th style="width: 20%;" class="text-right">P. Unitario</th>
            <th style="width: 20%;" class="text-right">Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @php
            $detalles = is_array($compra) && isset($compra['detalles'])
                ? $compra['detalles']
                : (is_object($compra) && isset($compra->detalles) ? $compra->detalles->toArray() : []);
        @endphp

        @forelse($detalles as $index => $detalle)
            @php
                $prod = is_array($detalle) ? ($detalle['producto'] ?? null) : (is_object($detalle) ? ($detalle->producto ?? null) : null);
                $nombre = '-';
                $sku = '-';

                if ($prod) {
                    $nombre = is_array($prod) ? ($prod['nombre'] ?? '-') : (is_object($prod) ? ($prod->nombre ?? '-') : '-');
                    $sku = is_array($prod) ? ($prod['sku'] ?? '') : (is_object($prod) ? ($prod->sku ?? '') : '');
                }

                $cantidad = is_array($detalle) ? ($detalle['cantidad'] ?? 0) : (is_object($detalle) ? ($detalle->cantidad ?? 0) : 0);
                $precioUnitario = is_array($detalle) ? ($detalle['precio_unitario'] ?? 0) : (is_object($detalle) ? ($detalle->precio_unitario ?? 0) : 0);
                $subtotalDetalle = $cantidad * $precioUnitario;
            @endphp
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $nombre }}</strong>
                    @if($sku)
                        <br><span style="Color: #7f8c8d;">SKU: {{ $sku }}</span>
                    @endif
                </td>
                <td class="text-right">{{ number_format($cantidad, 2) }}</td>
                <td class="text-right">Bs{{ number_format($precioUnitario, 2) }}</td>
                <td class="text-right"><strong>Bs{{ number_format($subtotalDetalle, 2) }}</strong></td>
            </tr>
        @empty
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #7f8c8d;">
                    No hay productos en esta compra
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

{{-- Resumen de totales --}}
<div class="totales">
    <table>
        <tr class="subtotal-row">
            <td><strong>Subtotal:</strong></td>
            <td class="text-right">Bs{{ number_format($subtotal, 2) }}</td>
        </tr>
        <tr class="total-final">
            <td><strong>TOTAL:</strong></td>
            <td class="text-right">
                <strong style="color: #27ae60; font-size: 14px;">Bs{{ number_format($total, 2) }}</strong>
            </td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #3498db; background: #ecf0f1;">
    <strong>Información:</strong>
    <p style="margin-top: 5px;">
        Este es un comprobante de compra generado automáticamente el {{ now()->format('d/m/Y \a \l\a\s H:i') }}.
    </p>
</div>

@endsection
