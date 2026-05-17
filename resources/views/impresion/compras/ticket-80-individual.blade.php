@extends('impresion.layouts.base-ticket')

@section('titulo', 'Compra Individual - Ticket 80mm')

@section('contenido')

@php
    $compra = $compras->first();
    if (!$compra) {
        echo '<p style="text-align: center;">No hay datos de compra para mostrar</p>';
        return;
    }
@endphp

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo">COMPRA</div>
<div class="documento-numero"># {{ $compra->id }}</div>
<div class="center" style="margin-top: 3px;">
    @php
        $fecha = is_object($compra) && isset($compra->fecha)
            ? $compra->fecha
            : (is_array($compra) && isset($compra['fecha']) ? $compra['fecha'] : null);
        if ($fecha) {
            echo is_string($fecha) ? date('d/m/Y H:i', strtotime($fecha)) : $fecha->format('d/m/Y H:i');
        }
    @endphp
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL PROVEEDOR ==================== --}}
<div class="documento-info">
    @php
        $proveedorNombre = '-';
        if (is_object($compra) && isset($compra->proveedor)) {
            $proveedorNombre = $compra->proveedor->nombre ?? '-';
        } elseif (is_array($compra) && isset($compra['proveedor'])) {
            $prov = $compra['proveedor'];
            $proveedorNombre = is_array($prov) ? ($prov['nombre'] ?? '-') : (is_object($prov) ? ($prov->nombre ?? '-') : '-');
        }
    @endphp
    <p><strong>{{ $proveedorNombre }}</strong></p>

    @php
        $nit = null;
        if (is_object($compra) && isset($compra->proveedor)) {
            $nit = $compra->proveedor->nit ?? null;
        } elseif (is_array($compra) && isset($compra['proveedor'])) {
            $prov = $compra['proveedor'];
            $nit = is_array($prov) ? ($prov['nit'] ?? null) : (is_object($prov) ? ($prov->nit ?? null) : null);
        }
    @endphp
    @if($nit)
    <p style="font-size: 10px;">NIT: {{ $nit }}</p>
    @endif
</div>

<div class="separador"></div>

{{-- ==================== ITEMS (tabla compacta) ==================== --}}
<table class="items" style="width: 100%; font-size: 10px;">
    <thead>
        <tr>
            <th style="width: 50%; text-align: left;">Producto</th>
            <th style="width: 20%; text-align: right;">Cant.</th>
            <th style="width: 30%; text-align: right;">Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @php
            $detalles = is_object($compra) && isset($compra->detalles)
                ? (is_array($compra->detalles) ? $compra->detalles : $compra->detalles->toArray())
                : (is_array($compra) && isset($compra['detalles']) ? $compra['detalles'] : []);
        @endphp
        @forelse($detalles as $detalle)
        <tr>
            <td>
                @php
                    $producto = is_array($detalle) ? ($detalle['producto'] ?? null) : (is_object($detalle) ? ($detalle->producto ?? null) : null);
                    $nombre = '-';
                    if ($producto) {
                        $nombre = is_object($producto) ? ($producto->nombre ?? '-') : (is_array($producto) ? ($producto['nombre'] ?? '-') : '-');
                    }
                @endphp
                <strong style="font-size: 9px;">{{ $nombre }}</strong>
            </td>
            <td style="text-align: right; font-size: 9px;">
                @php
                    $cantidad = is_array($detalle) ? ($detalle['cantidad'] ?? 0) : (is_object($detalle) ? ($detalle->cantidad ?? 0) : 0);
                    echo number_format($cantidad, 0);
                @endphp
            </td>
            <td style="text-align: right; font-size: 9px;">
                @php
                    $precioUnit = is_array($detalle) ? ($detalle['precio_unitario'] ?? 0) : (is_object($detalle) ? ($detalle->precio_unitario ?? 0) : 0);
                    $subtotal = $cantidad * $precioUnit;
                    echo number_format($subtotal, 2);
                @endphp
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="3" style="text-align: center; font-size: 9px;">Sin productos</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="separador-doble"></div>

{{-- ==================== MONTO DESTACADO ==================== --}}
<div style="text-align: center; margin: 5px 0; padding: 5px 0; border: 2px solid #000;">
    @php
        $total = is_object($compra) ? ($compra->total ?? 0) : (is_array($compra) ? ($compra['total'] ?? 0) : 0);
    @endphp
    <div style="color: #000; font-weight: bold; font-size: 12px;">
        TOTAL: Bs{{ number_format($total, 2) }}
    </div>
</div>

<div class="separador"></div>

{{-- ==================== INFORMACIÓN DE ESTADO ==================== --}}
@php
    $estado = '-';
    if (is_object($compra) && isset($compra->estadoDocumento)) {
        $estado = $compra->estadoDocumento->nombre ?? '-';
    } elseif (is_array($compra) && isset($compra['estado_documento'])) {
        $est = $compra['estado_documento'];
        $estado = is_array($est) ? ($est['nombre'] ?? '-') : (is_object($est) ? ($est->nombre ?? '-') : '-');
    }
@endphp
<p style="text-align: center; font-size: 9px;"><strong>Estado:</strong> {{ $estado }}</p>

<div class="separador"></div>

@endsection
