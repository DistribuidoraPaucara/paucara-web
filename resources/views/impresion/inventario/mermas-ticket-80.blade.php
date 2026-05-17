@extends('impresion.layouts.base-thermal-80')

@section('contenido')

<div style="text-align: center; font-weight: bold; margin-bottom: 5px;">
    MERMA DE INVENTARIO
</div>

<div style="font-size: 11px; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px;">
    <div style="display: flex; justify-content: space-between;">
        <span><strong>Folio:</strong> {{ $merma['numero'] ?? 'N/A' }}</span>
        <span><strong>Estado:</strong> {{ ucfirst($merma['estado'] ?? 'PENDIENTE') }}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
        <span><strong>Almacén:</strong> {{ substr($merma['almacen']['nombre'] ?? 'N/A', 0, 15) }}</span>
        <span><strong>Tipo:</strong> {{ substr($merma['tipo_merma'] ?? 'N/A', 0, 10) }}</span>
    </div>
    <div>
        <span><strong>Creador:</strong> {{ substr($merma['usuario']['name'] ?? 'Sistema', 0, 20) }}</span>
    </div>
    <div style="font-size: 9px;">
        <strong>Fecha:</strong> {{ is_string($merma['fecha']) ? \Carbon\Carbon::parse($merma['fecha'])->format('d/m/Y H:i') : $merma['fecha']->format('d/m/Y H:i') }}
    </div>
</div>

{{-- Tabla de productos --}}
<table style="width: 100%; font-size: 10px; border-collapse: collapse;">
    <thead>
        <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align: left; padding: 2px;">PRODUCTO</th>
            <th style="text-align: center; padding: 2px;">SKU</th>
            <th style="text-align: right; padding: 2px;">QTD</th>
            <th style="text-align: right; padding: 2px;">COSTO</th>
        </tr>
    </thead>
    <tbody>
        @forelse($merma['detalles'] ?? [] as $detalle)
        <tr style="border-bottom: 1px dotted #ccc;">
            <td style="padding: 2px; width: 45%;">
                <strong style="font-size: 9px;">{{ substr($detalle['producto']['nombre'] ?? 'Producto', 0, 20) }}</strong>
            </td>
            <td style="padding: 2px; font-family: monospace; font-size: 8px; text-align: center;">
                {{ substr($detalle['producto']['sku'] ?? 'N/A', 0, 12) }}
            </td>
            <td style="padding: 2px; text-align: right;">{{ abs($detalle['cantidad'] ?? 0) }}</td>
            <td style="padding: 2px; text-align: right; font-weight: bold;">
                {{ number_format($detalle['costo_total'] ?? 0, 2) }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="4" style="text-align: center; padding: 10px; color: #999;">
                Sin productos
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

<div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px; margin-top: 5px; font-weight: bold; text-align: right;">
    <div style="font-size: 11px;">
        COSTO TOTAL: Bs. {{ number_format($merma['total_costo'] ?? 0, 2) }}
    </div>
    <div style="font-size: 9px;">
        Cantidad: {{ $merma['total_cantidad'] ?? 0 }} | Productos: {{ $merma['total_productos'] ?? 0 }}
    </div>
</div>

@if(!empty($merma['motivo']))
<div style="font-size: 9px; margin-top: 5px;">
    <strong>Motivo:</strong> {{ substr($merma['motivo'], 0, 50) }}
</div>
@endif

<div style="text-align: center; font-size: 8px; margin-top: 10px; color: #666;">
    {{ config('app.name') }}
    <br>
    Impreso: {{ now()->format('d/m/Y H:i') }}
</div>

@endsection
