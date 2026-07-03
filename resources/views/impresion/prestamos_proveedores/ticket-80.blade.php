@extends('impresion.layouts.base-ticket')
@section('titulo', 'Prestamo Proveedores Folio #' . $documento->id)
@section('contenido')
@php
// Determinar estado global del préstamo
$estado = $documento->estado;
if ($estado === 'COMPLETAMENTE_DEVUELTO') {
$estadoClass = 'DEVUELTO';
} elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
$estadoClass = 'PARCIAL';
} else {
$estadoClass = 'ACTIVO';
}

// Calcular totales de devoluciones
$totalDanoCobrado = 0;
$totalGarantiaDevuelta = 0;
$totalExcedido = 0;
if($documento->devoluciones && count($documento->devoluciones) > 0) {
foreach($documento->devoluciones as $devolucion) {
$totalDanoCobrado += $devolucion->monto_cobrado_daño_total ?? 0;
$totalGarantiaDevuelta += $devolucion->monto_garantia_devuelta_total ?? 0;
$totalExcedido += $devolucion->monto_excedido_garantia ?? 0;
}
}
@endphp

<div class="ticket" style="font-size: 12px; font-family: Arial, sans-serif;">
    <div style="text-align: center;">
        <p style="font-size: 11px; font-weight: bold;">PRÉSTAMO DE CANASTILLAS / EMBASES</p>
        <h3 class="text-center text-sm font-bold mb-1">Préstamo Proveedor # <strong>{{ $documento->id }}</strong></h3>
        @if($documento->compra)
        <p class="text-xs mb-1">
            <strong>Folio Compra:</strong> #{{ $documento->compra->id ?? 'N/D' }}
        </p>
        @endif
    </div>
    <!-- SEPARADOR -->
    <div style="border-top: 2px solid #000; margin: 3px 0;"></div>
    <!-- ESTADO DESTACADO -->
    <p style="text-align: center; padding: 3px; font-weight: bold; font-size: 12px; margin: 3px 0;">
        {{ $estadoClass }}
    </p>
    <!-- FECHAS Y GARANTÍA -->
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 3px 0; line-height: 1.3;">
        <tr>
            <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top;">
                <strong>Préstamo:</strong><br>
                {{ $documento->fecha_prestamo->format('d/m/Y') }}
            </td>
            <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top; text-align: right;">
                <strong>Devolución:</strong><br>
                {{ $documento->fecha_esperada_devolucion?->format('d/m/Y') ?? 'N/D' }}
            </td>
        </tr>
    </table>

    <!-- GARANTÍA DESTACADA -->
    <div class="text-center text-xs font-bold mb-1">
        <p style="padding: 3px; text-align: center;"><strong>Garantía: Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}</strong></p>
        @if($documento->devoluciones && count($documento->devoluciones) > 0)
        <p style="margin: 1px 0; font-size: 12px;">
            <strong>Monto Daño Cobrado:</strong> Bs {{ number_format($totalDanoCobrado, 2) }}
        </p>
        @if($totalExcedido > 0)
        <p style="margin: 1px 0; font-size: 12px; font-weight: bold; color: rgb(11, 11, 11);">
            <strong>TOTAL EXCESO PENDIENTE:</strong> Bs {{ number_format($totalExcedido, 2) }}
        </p>
        @endif
        @endif
    </div>


    <!-- SEPARADOR -->
    <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

    <p style="text-align: center; padding: 3px; font-weight: bold; font-size: 12px; margin: 3px 0;">
        <strong>{{ $documento->proveedor->nombre ?? 'Sin nombre' }}</strong>
    </p>
    @if($documento->proveedor->telefono)
    <p style="margin: 1px 0; font-size: 12px;"><strong>Tel.:</strong> {{ $documento->proveedor->telefono }}</p>
    @endif

    <!-- LOGÍSTICA -->
    @if($documento->vehiculo_asignado || $documento->chofer)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 2px 0;">
        <tr>
            <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top;">
                @if($documento->chofer)
                <strong>Chofer:</strong><br>
                {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                @endif
            </td>
            <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top;  text-align: right;">
                @if($documento->vehiculo_asignado)
                <strong>Vehículo:</strong><br>
                {{ $documento->vehiculo_asignado }}
                @endif
            </td>

        </tr>
    </table>
    @endif

    <!-- SEPARADOR -->
    <div style="border-top: 1px solid #000; margin: 3px 0;"></div>
    <br />

    <p class="text-center text-xs font-bold mb-1"><strong>DETALLE DEL PRÉSTAMO</strong></p>

    @if($documento->detalles && count($documento->detalles) > 0)
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                <th style="text-align: center; padding: 2px; font-weight: bold;">Recib</th>
                <th style="text-align: center; padding: 2px; font-weight: bold;">Dev</th>
                <th style="text-align: center; padding: 2px; font-weight: bold;">Dañ</th>
                <th style="text-align: center; padding: 2px; font-weight: bold;">Pend</th>
            </tr>
        </thead>
        <tbody>
            @foreach($documento->detalles as $detalle)
            @php
            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
            $cantidadDaniada = ($detalle->devolucionDetalles->sum('cantidad_dañada_parcial') ?? 0) + ($detalle->devolucionDetalles->sum('cantidad_dañada_total') ?? 0);
            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
            @endphp
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="text-align: left; padding: 2px;">{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 12) }}</td>
                <td style="text-align: center; padding: 2px;">{{ number_format($cantidadPrestada, 0) }}</td>
                <td style="text-align: center; padding: 2px;">{{ number_format($cantidadDevuelta, 0) }}</td>
                <td style="text-align: center; padding: 2px;">{{ number_format($cantidadDaniada, 0) }}</td>
                <td style="text-align: center; padding: 2px; font-weight: bold;">{{ number_format($cantidadPendiente, 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p class="text-xs text-center">Sin detalles registrados</p>
    @endif

    <!-- SEPARADOR -->
    <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

    @if(!empty($documento->observaciones))
    <p class="text-xs mb-1">
        <strong>Obs.:</strong> {{ $documento->observaciones }}
    </p>
    <!-- SEPARADOR FIRMAS -->
    <div style="border-top: 2px solid #000; margin: 6px 0;"></div>
    @endif

    <!-- ESPACIO DE FIRMAS -->
    <div style="margin-top: 8px;">
        <div style="display: flex; gap: 8px; justify-content: space-between;">
            <!-- FIRMA PROVEEDOR -->
            <div style="text-align: center; flex: 1; font-size: 12px;">
                <div style="border-bottom: 1px solid #000; height: 80px; margin-bottom: 2px;"></div>
                <p style="margin: 0; font-weight: bold;">Firma Proveedor</p>
            </div>
        </div>
    </div>
</div>
@endsection