@extends('impresion.layouts.base-a4')

@section('titulo', 'Guía de Remisión #' . $documento->numero_envio)

@section('contenido')
{{-- Información del envío --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #e67e22;">GUÍA DE REMISIÓN #{{ $documento->numero_envio }}</h2>
            <p><strong>Fecha Programada:</strong> {{ $documento->fecha_programada ? $documento->fecha_programada->format('d/m/Y H:i') : 'N/A' }}</p>
            <p><strong>Estado:</strong>
                <span style="padding: 2px 6px; border-radius: 3px;
                    @if($documento->estado === 'PROGRAMADO') background: #d1ecf1; color: #0c5460;
                    @elseif($documento->estado === 'EN_PREPARACION') background: #fff3cd; color: #856404;
                    @elseif($documento->estado === 'EN_RUTA') background: #d4edda; color: #155724;
                    @elseif($documento->estado === 'ENTREGADO') background: #c3e6cb; color: #155724;
                    @else background: #f8d7da; color: #721c24;
                    @endif">
                    {{ str_replace('_', ' ', $documento->estado) }}
                </span>
            </p>
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            @if($documento->venta)
                <p><strong>Venta Asociada:</strong> #{{ $documento->venta->numero }}</p>
                <p><strong>Fecha Venta:</strong> {{ $documento->venta->fecha->format('d/m/Y') }}</p>
            @endif
        </div>
    </div>
</div>

{{-- Información de entrega --}}
<div style="background: #fff3e0; padding: 10px; margin: 15px 0; border-left: 4px solid #e67e22;">
    <h3 style="font-size: 12px; color: #e67e22; margin-bottom: 8px;">Información de Entrega</h3>
    <div style="display: flex; gap: 20px;">
        <div style="flex: 1;">
            <p style="font-size: 9px; margin: 2px 0;"><strong>Cliente:</strong> {{ $documento->venta->cliente->nombre ?? 'N/A' }}</p>
            <p style="font-size: 9px; margin: 2px 0;"><strong>Dirección:</strong> {{ $documento->direccion_entrega ?? 'N/A' }}</p>
            @if($documento->venta && $documento->venta->cliente->telefono)
                <p style="font-size: 9px; margin: 2px 0;"><strong>Teléfono:</strong> {{ $documento->venta->cliente->telefono }}</p>
            @endif
        </div>
        <div style="flex: 1;">
            <p style="font-size: 9px; margin: 2px 0;"><strong>Vehículo:</strong> {{ $documento->vehiculo->placa ?? 'N/A' }} - {{ $documento->vehiculo->modelo ?? '' }}</p>
            <p style="font-size: 9px; margin: 2px 0;"><strong>Chofer:</strong> {{ $documento->chofer->name ?? 'N/A' }}</p>
            @if($documento->fecha_entrega)
                <p style="font-size: 9px; margin: 2px 0;"><strong>Fecha Entrega:</strong> {{ $documento->fecha_entrega->format('d/m/Y H:i') }}</p>
            @endif
        </div>
    </div>
</div>

{{-- Tabla de productos --}}
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 50%;">Producto</th>
            <th style="width: 15%;">Cantidad</th>
            <th style="width: 30%;">Observaciones</th>
        </tr>
    </thead>
    <tbody>
        @if($documento->venta && $documento->venta->detalles)
            @foreach($documento->venta->detalles as $index => $detalle)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $detalle->producto->nombre }}</strong>
                    @if($detalle->producto->codigo)
                        <br><small style="color: #666;">Código: {{ $detalle->producto->codigo }}</small>
                    @endif
                </td>
                <td><strong>{{ number_format($detalle->cantidad, 2) }}</strong></td>
                <td style="border: 1px solid #ddd; background: #f9f9f9;"></td>
            </tr>
            @endforeach
        @endif
    </tbody>
</table>

{{-- Firmas --}}
<div style="margin-top: 40px; display: flex; justify-content: space-between; gap: 40px;">
    <div style="flex: 1; text-align: center;">
        <div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 50px;">
            <p style="font-size: 9px; font-weight: bold;">ENTREGADO POR</p>
            <p style="font-size: 8px;">{{ $documento->chofer->name ?? '____________________' }}</p>
        </div>
    </div>
    <div style="flex: 1; text-align: center;">
        <div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 50px;">
            <p style="font-size: 9px; font-weight: bold;">RECIBIDO POR</p>
            <p style="font-size: 8px;">Nombre: ____________________</p>
            <p style="font-size: 8px;">CI: ____________________</p>
        </div>
    </div>
</div>

{{-- Observaciones del envío --}}
@if($documento->observaciones)
<div class="observaciones" style="margin-top: 20px;">
    <strong>Observaciones del Envío:</strong>
    {{ $documento->observaciones }}
</div>
@endif
@endsection
