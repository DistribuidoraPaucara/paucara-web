@extends('impresion.layouts.base-a4')

@section('titulo', 'Venta Ticket')

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
            <h2 style="color: #27ae60; font-size: 14px;">VENTAsss TICKET</h2>
            <p style="font-size: 8px;"><strong>Cliente:</strong> {{ $cliente }}</p>
            <p style="font-size: 8px;"><strong>Fecha:</strong> {{ $fecha }}</p>
            <p style="font-size: 8px;"><strong>Estado:</strong> {{ $estado }}</p>

            {{-- ✅ NUEVO: Mostrar Preventista solo si empresa.es_farmacia = false --}}
            @php
            // Obtener información del preventista desde la venta
            // Prioridad 1: Usuario creador de la proforma
            // Prioridad 2: Preventista directo (preventista_id)
            $preventista = null;
            if (is_array($venta)) {
                if (isset($venta['proforma']) && isset($venta['proforma']['usuario_creador'])) {
                    $preventista = $venta['proforma']['usuario_creador']['name'] ?? null;
                } elseif (isset($venta['preventista']) && isset($venta['preventista']['name'])) {
                    $preventista = $venta['preventista']['name'];
                }
            } elseif (is_object($venta)) {
                if ($venta->proforma && $venta->proforma->usuarioCreador) {
                    $preventista = $venta->proforma->usuarioCreador->name;
                } elseif ($venta->preventista) {
                    $preventista = $venta->preventista->name;
                }
            }

            // Obtener información de la empresa
            $es_farmacia = false;
            if (is_array($venta) && isset($venta['empresa']) && isset($venta['empresa']['es_farmacia'])) {
            $es_farmacia = (bool)$venta['empresa']['es_farmacia'];
            } elseif (is_object($venta) && $venta->empresa && isset($venta->empresa->es_farmacia)) {
            $es_farmacia = (bool)$venta->empresa->es_farmacia;
            }
            @endphp

            @if(!$es_farmacia && $preventista)
            <p style="font-size: 8px; margin-top: 4px; border-top: 1px solid #ddd; padding-top: 4px;">
                <strong>Preventista:</strong> {{ $preventista }}
            </p>
            @endif
        </div>
    </div>
</div>

{{-- Tabla de productos (compacta para ticket) --}}
<table class="tabla-productos" style="font-size: 8px;">
    <thead>
        <tr>
            <th style="width: 40%;">Producto</th>
            <th style="width: 20%;" class="text-right">Cant</th>
            <th style="width: 20%;" class="text-right">P.U.</th>
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
        <tr style="font-size: 7px;">
            <td>
                <strong>{{ $nombre }}</strong>
                @if($sku)
                <br><span style="font-size: 6px; color: #7f8c8d;">SKU: {{ $sku }}</span>
                @endif
            </td>
            <td class="text-right">{{ number_format($cantidad, 0) }}</td>
            <td class="text-right">Bs{{ number_format($precioUnitario, 2) }}</td>
            <td class="text-right"><strong>Bs{{ number_format($subtotalDetalle, 2) }}</strong></td>
        </tr>
        @empty
        <tr>
            <td colspan="4" style="text-align: center; padding: 10px; color: #7f8c8d; font-size: 7px;">
                Sin productos
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- Resumen de totales (con borde) --}}
<div style="margin-top: 10px; border: 1px solid #333; padding: 8px; text-align: right;">
    @if($descuento > 0)
    <p style="font-size: 8px; margin: 2px 0;">
        <strong>Desc:</strong> -Bs{{ number_format($descuento, 2) }}
    </p>
    @endif
    <p style="font-size: 10px; margin: 4px 0; font-weight: bold; color: #27ae60; border-top: 1px solid #333; padding-top: 4px;">
        TOTAL: Bs{{ number_format($total, 2) }}
    </p>

    {{-- ✅ NUEVO: Mostrar cambio si existe --}}
    @php
    $montoPagado = is_array($venta) && isset($venta['monto_pagado'])
        ? (float)$venta['monto_pagado']
        : (is_object($venta) && isset($venta->monto_pagado) ? (float)$venta->monto_pagado : $total);
    $vuelto = $montoPagado - $total;
    @endphp

    @if($vuelto > 0.01)
    <p style="font-size: 9px; margin: 6px 0; color: #2980b9; font-weight: bold; border-top: 1px solid #333; padding-top: 4px;">
        💵 Cambio: Bs{{ number_format($vuelto, 2) }}
    </p>
    @endif
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 8px; border-left-color: #27ae60; background: #f9f9f9; font-size: 7px; padding: 5px;">
    <p style="margin: 0; font-size: 7px;">
        Venta generada {{ now()->format('d/m/Y H:i') }}
    </p>
</div>

{{-- ✅ NUEVO: Sección de QR y FIRMA - Solo si empresa.es_farmacia = false --}}
@if(!$es_farmacia)
<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #333; text-align: center;">

    {{-- QR Code --}}
    <div style="margin-bottom: 10px;">
        <h4 style="font-size: 9px; margin: 5px 0;">Código QR</h4>
        @php
        // Generar QR para acceso público a la venta
        if (is_object($venta) && isset($venta->id)) {
        $ventaId = $venta->id;
        $qrUrl = route('ventas.public-show', ['venta' => $ventaId]);
        $qrGenerator = new \SimpleSoftwareIO\QrCode\Facades\QrCode();
        $qrImage = base64_encode($qrGenerator->format('png')->size(100)->generate($qrUrl));
        } else {
        $qrImage = null;
        }
        @endphp

        @if($qrImage)
        <img src="data:image/png;base64,{{ $qrImage }}" alt="QR Code" style="width: 60px; height: 60px;">
        @endif
    </div>

    {{-- Firma --}}
    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc;">
        <p style="font-size: 8px; margin: 5px 0;"><strong>Firma del Vendedor</strong></p>
        <div style="height: 30px; border: 1px solid #ccc; margin: 5px 0;"></div>
        <p style="font-size: 7px; margin: 3px 0;">_______________________</p>
    </div>

    {{-- Firma del Cliente --}}
    <div style="margin-top: 10px;">
        <p style="font-size: 8px; margin: 5px 0;"><strong>Firma del Cliente</strong></p>
        <div style="height: 30px; border: 1px solid #ccc; margin: 5px 0;"></div>
        <p style="font-size: 7px; margin: 3px 0;">_______________________</p>
    </div>

</div>
@endif

@endsection
