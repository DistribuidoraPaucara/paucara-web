@extends('impresion.layouts.base-a4')

@section('titulo', 'Venta Individual')

@section('contenido')

@php
    $venta = $ventas->first();

    if (!$venta) {
        echo '<p style="text-align: center; color: #e74c3c;">No hay datos de venta para mostrar</p>';
        return;
    }

    // Funciones helper para extraer datos
    function obtenerCliente($venta) {
        if (is_array($venta) && isset($venta['cliente'])) {
            $cli = $venta['cliente'];
            return is_array($cli) ? ($cli['nombre'] ?? '-') : (is_object($cli) ? ($cli->nombre ?? '-') : '-');
        }
        return is_object($venta) && isset($venta->cliente) ? ($venta->cliente->nombre ?? '-') : '-';
    }

    function obtenerFecha($venta) {
        $fecha = is_array($venta) && isset($venta['fecha'])
            ? $venta['fecha']
            : (is_object($venta) && isset($venta->fecha) ? $venta->fecha : null);
        if (!$fecha) return '-';
        return is_string($fecha) ? date('d/m/Y', strtotime($fecha)) : $fecha->format('d/m/Y');
    }

    function obtenerEstado($venta) {
        if (is_array($venta) && isset($venta['estado_documento'])) {
            $est = $venta['estado_documento'];
            return is_array($est) ? ($est['nombre'] ?? '-') : (is_object($est) ? ($est->nombre ?? '-') : '-');
        }
        return is_object($venta) && isset($venta->estadoDocumento) ? ($venta->estadoDocumento->nombre ?? '-') : '-';
    }

    function obtenerSubtotal($venta) {
        if (is_array($venta) && isset($venta['subtotal'])) {
            return (float)$venta['subtotal'];
        }
        return is_object($venta) && isset($venta->subtotal) ? (float)$venta->subtotal : 0;
    }

    function obtenerTotal($venta) {
        if (is_array($venta) && isset($venta['total'])) {
            return (float)$venta['total'];
        }
        return is_object($venta) && isset($venta->total) ? (float)$venta->total : 0;
    }

    function obtenerDescuento($venta) {
        if (is_array($venta) && isset($venta['descuento'])) {
            return (float)$venta['descuento'];
        }
        return is_object($venta) && isset($venta->descuento) ? (float)$venta->descuento : 0;
    }

    $cliente = obtenerCliente($venta);
    $fecha = obtenerFecha($venta);
    $estado = obtenerEstado($venta);
    $subtotal = obtenerSubtotal($venta);
    $total = obtenerTotal($venta);
    $descuento = obtenerDescuento($venta);
@endphp

{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #27ae60;">VENTA</h2>
            <p><strong>Cliente:</strong> {{ $cliente }}</p>
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
            $detalles = is_array($venta) && isset($venta['detalles'])
                ? $venta['detalles']
                : (is_object($venta) && isset($venta->detalles) ? $venta->detalles->toArray() : []);
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
                        <br><span style="font-size: 8px; color: #7f8c8d;">SKU: {{ $sku }}</span>
                    @endif
                </td>
                <td class="text-right">{{ number_format($cantidad, 2) }}</td>
                <td class="text-right">Bs{{ number_format($precioUnitario, 2) }}</td>
                <td class="text-right"><strong>Bs{{ number_format($subtotalDetalle, 2) }}</strong></td>
            </tr>
        @empty
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #7f8c8d;">
                    No hay productos en esta venta
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
        @if($descuento > 0)
        <tr class="subtotal-row">
            <td><strong>Descuento:</strong></td>
            <td class="text-right">-Bs{{ number_format($descuento, 2) }}</td>
        </tr>
        @endif
        <tr class="total-final">
            <td><strong>TOTAL:</strong></td>
            <td class="text-right">
                <strong style="color: #27ae60; font-size: 14px;">Bs{{ number_format($total, 2) }}</strong>
            </td>
        </tr>
        {{-- ✅ NUEVO: Mostrar cambio si existe --}}
        @php
        $montoPagado = is_array($venta) && isset($venta['monto_pagado'])
            ? (float)$venta['monto_pagado']
            : (is_object($venta) && isset($venta->monto_pagado) ? (float)$venta->monto_pagado : $total);
        $vuelto = $montoPagado - $total;
        @endphp
        @if($vuelto > 0.01)
        <tr class="subtotal-row" style="background-color: #e8f4f8; border-top: 2px solid #2980b9;">
            <td><strong>💵 Cambio:</strong></td>
            <td class="text-right"><strong style="color: #2980b9;">Bs{{ number_format($vuelto, 2) }}</strong></td>
        </tr>
        @endif
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #27ae60; background: #ecf0f1;">
    <strong>Información:</strong>
    <p style="margin-top: 5px; font-size: 8px;">
        Este es un comprobante de venta generado automáticamente el {{ now()->format('d/m/Y \\a \\l\\a\\s H:i') }}.
    </p>
</div>

@endsection
