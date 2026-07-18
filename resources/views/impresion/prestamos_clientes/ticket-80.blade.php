@extends('impresion.layouts.base-ticket')
@section('titulo', 'Prestamo Clientes Folio #' . $documento->id)
@section('contenido')
@php
// Determinar estado global del préstamo
$estado = $documento->estado;
if ($estado === 'COMPLETAMENTE_DEVUELTO') {
    $estadoClass = 'DEVUELTO';
} elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
    $estadoClass = 'PARCIAL';
}elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
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
     <!-- SEPARADOR -->
    <div style="border-top: 1px solid #000; margin: 4px 0;"></div>
    <div style="text-align: center;">
        <h3 class="text-center text-sm font-bold mb-1"><strong>Prestamos Clientes</strong></h3>
        <p class="text-center text-sm font-bold mb-1"><strong>Folio: #{{ $documento->id }}</strong></p>
        @if($documento->venta)
        <p class="text-xs mb-1">
            <strong>Folio Venta: #{{ $documento->venta->id ?? 'N/D' }}</strong>
        </p>
        @endif
        <strong>{{ $documento->estado }}</strong><br>
    </div>

    <!-- SEPARADOR -->
    <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
    <!-- INFORMACIÓN BÁSICA -->
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 4px;">
        <tr>
            <td style="width: 33%; padding: 2px 4px 2px 0; vertical-align: top;">
                <strong>Fecha:</strong><br>
                {{ optional($documento->created_at)->format('d/m/Y') }}
            </td>
            <td style="width: 33%; padding: 2px 4px 2px 4px; vertical-align: top; text-align: center;">
                <strong>Creado por:</strong><br>
                {{ $documento->creador?->name ?? $documento->creador?->nombre ?? 'N/D' }}
            </td>
            <td style="width: 34%; padding: 2px 0 2px 4px; vertical-align: top; text-align: right;">
                <strong>Devolución:</strong><br>
                {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
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
    
    <p style="padding: 2px 4px 2px 0; vertical-align: top;">
        <strong>{{ $documento->cliente->nombre ?? 'Sin nombre' }}</strong>
    </p>

    <!-- INFORMACIÓN DEL CLIENTE -->
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 2px 0;">
        <tr>
            <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top;">
                <strong>Tel. 1:</strong><br>
                {{ $documento->cliente->telefono ?? 'N/D' }}
            </td>
            <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top; text-align: right;">
                <strong>Tel. 2:</strong><br>
                {{ $documento->cliente->telefono_dos ?? $documento->cliente->telefono2 ?? 'N/D' }}
            </td>
        </tr>
    </table>

    <!-- INFORMACIÓN DE UBICACIÓN DEL PRÉSTAMO -->
    @if($documento->ubicacion)
    @php
    $ubicacion = $documento->ubicacion;
    @endphp
    <div style="padding-left: 4px; margin: 3px 0; font-size: 12px; background: #f9f9f9; padding: 3px;">
        <!-- <p style="margin: 1px 0; font-weight: bold;">Ubicación del Préstamo:</p> -->
        @if($ubicacion->direccion)
        <p style="margin: 1px 0; font-size: 12px;">
            <strong>Dirección:</strong> {{ $ubicacion->direccion ?? $ubicacion->direccion ?? 'N/D' }}
        </p>
        @endif
        @if($ubicacion->localidad)
        <p style="margin: 1px 0; font-size: 12px;">
            <strong>Localidad:</strong> {{ $ubicacion->localidad->nombre ?? 'N/D' }}
        </p>
        @endif
    </div>
    @endif
    <!-- INFORMACIÓN DE ALMACÉN Y VEHÍCULO -->
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 4px;">
        <tr>
            <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top;">
                @if($documento->chofer)
                <strong>Chofer:</strong><br>
                {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                @endif
            </td>
            <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top; text-align: right;">
                @if($documento->vehiculo)
                <strong>Vehículo:</strong><br>
                {{ $documento->vehiculo->placa ?? 'N/D' }}
                @endif
            </td>
        </tr>
    </table>

    <!-- SEPARADOR -->
    <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

    <!-- DETALLE DEL PRÉSTAMO -->
    <p class="text-center text-xs font-bold mb-1"><strong>DETALLE DEL PRÉSTAMO</strong></p>

    @if($documento->detalles && count($documento->detalles) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
            <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left; padding: 2px; font-weight: bold; font-size: 12px;">Prestable</th>
                <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 12px;">Prestado</th>
                <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 12px;">Dev</th>
                <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 12px;">Dañ</th>
                <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 12px;">Pend</th>
            </tr>
        </thead>
        <tbody>
            @foreach($documento->detalles as $detalle)
            @php
            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
            $cantidadDanada = $detalle->devolucionDetalles->sum('cantidad_dañada_total') ?? 0;
            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta - $cantidadDanada;
            @endphp
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="text-align: left; padding: 2px; font-size: 12px;">{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 12) }}</td>
                <td style="text-align: center; padding: 2px; font-size: 12px;">{{ number_format($cantidadPrestada, 0) }}</td>
                <td style="text-align: center; padding: 2px; font-size: 12px;">{{ number_format($cantidadDevuelta, 0) }}</td>
                <td style="text-align: center; padding: 2px; font-size: 12px; @if($cantidadDanada > 0) font-weight: bold; color: rgb(5, 5, 5); @endif">{{ number_format($cantidadDanada, 0) }}</td>
                <td style="text-align: center; padding: 2px; font-weight: bold; font-size: 12px;">{{ number_format($cantidadPendiente, 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
    <!-- LEYENDA DE SÍMBOLOS -->
    <p style="margin-top: 3px; text-align: center; font-size: 12px;">
        <strong>Dev=Devuelto | Dañ=Dañado | Pend=Pendiente</strong>
    </p>

    @if(!empty($documento->observaciones))
    <p class="text-xs mb-1">
        <strong>Obs.:</strong> {{ $documento->observaciones }}
    </p>
    @endif

    <!-- SEPARADOR FINAL -->
    <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

    <p class="text-[10px] text-center font-bold mb-1">
        <strong>IMPORTANTE</strong>
    </p>

    <p class="text-[10px] text-center" style="font-size: 11px;">
        El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado.
    </p>

    <p class="text-[10px] text-center mt-1" style="font-size: 11px;">
        Producto dañado o faltante será cobrado según tarifa vigente.
    </p>
    <!-- SEPARADOR FIRMAS -->
    <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
    <!-- INFORMACIÓN IMPORTANTE -->
    <p style="font-size: 12px; text-align: center; line-height: 1.2; margin: 2px 0;">
        <strong>RECUERDE DEVOLVER EN LA FECHA INDICADA</strong>
        <br>
        Garantía retenida hasta devolución completa
    </p>
    <p style="font-size: 11px; text-align: center; color: #666; margin: 2px 0;">
        {{ now()->format('d/m/Y H:i') }} | Sistema de Préstamos
    </p>


    <!-- SEPARADOR FIRMAS -->
    <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

    <!-- ESPACIO DE FIRMAS -->
    <div style="margin-top: 6px;">
        <div style="display: flex; gap: 8px; justify-content: space-between;">
            <div style="text-align: center; flex: 1; font-size: 11px;">
                <div style="border-bottom: 1px solid #000; height: 50px; margin-bottom: 2px;"></div>
                <p style="margin: 0; font-weight: bold;">Firma Cliente</p>
            </div>
        </div>
    </div>
</div>
@endsection