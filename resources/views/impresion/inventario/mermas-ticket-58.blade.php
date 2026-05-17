@extends('impresion.layouts.base-thermal-58')

@section('contenido')

<div style="text-align: center; font-weight: bold; margin-bottom: 3px; font-size: 12px;">
    MERMA
</div>

<div style="font-size: 9px; border-bottom: 1px dashed #000; padding-bottom: 3px; margin-bottom: 3px;">
    <div><strong>Folio:</strong> {{ $merma['numero'] ?? 'N/A' }}</div>
    <div><strong>Estado:</strong> {{ ucfirst($merma['estado'] ?? 'PENDIENTE') }}</div>
    <div><strong>Almacén:</strong> {{ substr($merma['almacen']['nombre'] ?? 'N/A', 0, 18) }}</div>
    <div><strong>Tipo:</strong> {{ substr($merma['tipo_merma'] ?? 'N/A', 0, 15) }}</div>
    <div style="font-size: 8px; margin-top: 2px;">
        {{ is_string($merma['fecha']) ? \Carbon\Carbon::parse($merma['fecha'])->format('d/m/Y H:i') : $merma['fecha']->format('d/m/Y H:i') }}
    </div>
</div>

{{-- Tabla de productos compacta --}}
<table style="width: 100%; font-size: 8px; border-collapse: collapse;">
    <thead>
        <tr style="border-bottom: 1px dashed #000; font-size: 7px;">
            <th style="text-align: left; padding: 1px;">PRODUCTO</th>
            <th style="text-align: center; padding: 1px;">QTD</th>
            <th style="text-align: right; padding: 1px;">COSTO</th>
        </tr>
    </thead>
    <tbody>
        @forelse($merma['detalles'] ?? [] as $detalle)
        <tr style="border-bottom: 1px dotted #ddd;">
            <td style="padding: 1px; width: 60%;">
                <div style="font-size: 7px;">{{ substr($detalle['producto']['nombre'] ?? 'Prod', 0, 18) }}</div>
                <div style="font-size: 6px; color: #999;">{{ substr($detalle['producto']['sku'] ?? 'N/A', 0, 15) }}</div>
            </td>
            <td style="padding: 1px; text-align: center; font-size: 8px;">{{ abs($detalle['cantidad'] ?? 0) }}</td>
            <td style="padding: 1px; text-align: right; font-size: 8px;">
                {{ number_format($detalle['costo_total'] ?? 0, 2) }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="3" style="text-align: center; padding: 5px; font-size: 7px; color: #999;">
                Sin productos
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

<div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 3px; margin-top: 3px; text-align: right; font-size: 9px; font-weight: bold;">
    <div>TOTAL: Bs. {{ number_format($merma['total_costo'] ?? 0, 2) }}</div>
    <div style="font-size: 7px;">
        {{ $merma['total_cantidad'] ?? 0 }} uds | {{ $merma['total_productos'] ?? 0 }} prods
    </div>
</div>

@if(!empty($merma['motivo']))
<div style="font-size: 7px; margin-top: 3px;">
    <strong>Motivo:</strong> {{ substr($merma['motivo'], 0, 35) }}
</div>
@endif

<div style="text-align: center; font-size: 6px; margin-top: 5px; color: #666;">
    {{ config('app.name') }}
    <br>
    {{ now()->format('d/m/Y H:i') }}
</div>

@endsection
