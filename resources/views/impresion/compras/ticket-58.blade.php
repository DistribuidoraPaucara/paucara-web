@extends('impresion.layouts.base-ticket')

@section('titulo', 'Reporte de Compras - Ticket 58mm')

@section('estilos-adicionales')
<style>
    /* Estilos más compactos para 58mm */
    body {
        font-size: 7px;
    }
    .empresa-nombre {
        font-size: 10px;
    }
    .documento-titulo {
        font-size: 9px;
    }
    table.items {
        font-size: 5px;
    }
    .totales {
        font-size: 7px;
    }
    .totales .total-final {
        font-size: 8px;
    }
</style>
@endsection

@section('contenido')

@forelse($compras as $documento)

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO (compacta) ==================== --}}
<div class="documento-titulo">COMPRA</div>
<div class="center bold">
    @php
        echo is_object($documento) ? ($documento->numero ?? '-') : (is_array($documento) ? ($documento['numero'] ?? '-') : '-');
    @endphp
</div>
<div class="center" style="font-size: 6px;">
    @php
        $fecha = null;
        if (is_object($documento) && isset($documento->fecha)) {
            $fecha = $documento->fecha;
        } elseif (is_array($documento) && isset($documento['fecha'])) {
            $fecha = $documento['fecha'];
        }
        if ($fecha) {
            echo is_string($fecha) ? date('d/m/Y', strtotime($fecha)) : $fecha->format('d/m/Y');
        }
    @endphp
</div>

<div class="separador"></div>

{{-- ==================== PROVEEDOR (muy compacto) ==================== --}}
<div style="font-size: 6px;">
    <p><strong>
        @php
            $proveedorNombre = '-';
            if (is_object($documento) && isset($documento->proveedor)) {
                $proveedorNombre = $documento->proveedor->nombre ?? '-';
            } elseif (is_array($documento) && isset($documento['proveedor'])) {
                $prov = $documento['proveedor'];
                $proveedorNombre = is_array($prov) ? ($prov['nombre'] ?? '-') : (is_object($prov) ? ($prov->nombre ?? '-') : '-');
            }
            echo $proveedorNombre;
        @endphp
    </strong></p>
    @php
        $nit = null;
        if (is_object($documento) && isset($documento->proveedor)) {
            $nit = $documento->proveedor->nit ?? null;
        } elseif (is_array($documento) && isset($documento['proveedor'])) {
            $prov = $documento['proveedor'];
            $nit = is_array($prov) ? ($prov['nit'] ?? null) : (is_object($prov) ? ($prov->nit ?? null) : null);
        }
    @endphp
    @if($nit)
        <p>{{ $nit }}</p>
    @endif
</div>

<div class="separador-simple"></div>

{{-- ==================== MONTO DESTACADO (compacto) ==================== --}}
<div style="text-align: center; margin: 4px 0; padding: 4px 0; border: 1px solid #27ae60;">
    @php
        $total = 0;
        if (is_object($documento)) {
            $total = $documento->total ?? 0;
        } elseif (is_array($documento)) {
            $total = $documento['total'] ?? 0;
        }
        $simbolo = 'Bs';
        if (is_object($documento) && isset($documento->moneda)) {
            $simbolo = $documento->moneda->simbolo ?? 'Bs';
        } elseif (is_array($documento) && isset($documento['moneda'])) {
            $moneda = $documento['moneda'];
            $simbolo = is_array($moneda) ? ($moneda['simbolo'] ?? 'Bs') : (is_object($moneda) ? ($moneda->simbolo ?? 'Bs') : 'Bs');
        }
    @endphp
    <div style="font-size: 10px; color: #27ae60; font-weight: bold;">
        {{ $simbolo }} {{ number_format($total, 2) }}
    </div>
</div>

{{-- ==================== ITEMS (compactos) ==================== --}}
<table class="items" style="width: 100%; margin: 4px 0;">
    <thead>
        <tr style="border-bottom: 1px solid #ddd;">
            <th style="width: 50%; text-align: left;">Producto</th>
            <th style="width: 20%; text-align: right;">Cant.</th>
            <th style="width: 30%; text-align: right;">Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @php
            $detalles = [];
            if (is_object($documento) && isset($documento->detalles)) {
                $detalles = is_array($documento->detalles) ? $documento->detalles : $documento->detalles->toArray();
            } elseif (is_array($documento) && isset($documento['detalles'])) {
                $detalles = $documento['detalles'];
            }
        @endphp
        @forelse($detalles as $detalle)
        <tr>
            <td style="padding: 2px 0;">
                @php
                    $producto = is_array($detalle) ? ($detalle['producto'] ?? null) : (is_object($detalle) ? ($detalle->producto ?? null) : null);
                    $nombre = '-';
                    if ($producto) {
                        if (is_object($producto)) {
                            $nombre = $producto->nombre ?? '-';
                        } else {
                            $nombre = $producto['nombre'] ?? '-';
                        }
                    }
                @endphp
                {{ Str::limit($nombre, 15) }}
            </td>
            <td style="text-align: right; padding: 2px 0;">
                @php
                    $cantidad = is_array($detalle) ? ($detalle['cantidad'] ?? 0) : (is_object($detalle) ? ($detalle->cantidad ?? 0) : 0);
                    echo number_format($cantidad, 0);
                @endphp
            </td>
            <td style="text-align: right; padding: 2px 0;">
                @php
                    $precioUnit = is_array($detalle) ? ($detalle['precio_unitario'] ?? 0) : (is_object($detalle) ? ($detalle->precio_unitario ?? 0) : 0);
                    $subtotal = $cantidad * $precioUnit;
                    echo number_format($subtotal, 2);
                @endphp
            </td>
        </tr>
        @empty
        @endforelse
    </tbody>
</table>

{{-- ==================== INFORMACIÓN DE PAGO (compacta) ==================== --}}
<div style="font-size: 6px; text-align: center; margin-top: 4px;">
    @php
        $tipoPago = '-';
        if (is_object($documento) && isset($documento->tipoPago)) {
            $tipoPago = $documento->tipoPago->nombre ?? '-';
        } elseif (is_array($documento) && isset($documento['tipoPago'])) {
            $tp = $documento['tipoPago'];
            $tipoPago = is_array($tp) ? ($tp['nombre'] ?? '-') : (is_object($tp) ? ($tp->nombre ?? '-') : '-');
        }
    @endphp
    <p><strong>{{ $tipoPago }}</strong></p>
</div>

<div class="separador-simple"></div>

@empty
<div style="text-align: center; padding: 20px; font-size: 8px;">
    No hay compras para mostrar
</div>
@endforelse

{{-- ==================== CONTACTO COMPACTO (al final, una sola vez) ==================== --}}
<div class="center" style="font-size: 5px; margin-top: 8px;">
    @if($empresa->telefono)
        T: {{ $empresa->telefono }}
    @endif
    <br>✓ Registrado
</div>

@endsection
