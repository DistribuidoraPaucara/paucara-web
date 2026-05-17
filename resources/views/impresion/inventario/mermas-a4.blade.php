@extends('impresion.layouts.base-a4')

@section('titulo', 'Mermas de Inventario')

@section('contenido')

{{-- Información del documento (resumen general) --}}
<table style="width: 100%; font-size: 12px;">
    <tr>
        <td style="width: 50%; vertical-align: top;">
            <h3>DETALLE DE MERMA</h3>
            <p><strong>Folio:</strong> {{ $merma['id'] ?? 'N/A' }} | <strong>Numero:</strong> {{ $merma['numero'] ?? 'N/A' }}</p>
            <p><strong>Estado:</strong>
                <span style="padding: 2px 6px; border-radius: 3px; background-color: #e3f2fd; color: #1565c0; font-size: 11px; font-weight: bold;">
                    {{ ucfirst($merma['estado'] ?? 'PENDIENTE') }}
                </span>
            </p>
            <p><strong>Almacén:</strong> {{ $merma['almacen']['nombre'] ?? 'N/A' }}</p>
            <p><strong>Tipo de Merma:</strong> {{ $merma['tipo_merma'] ?? 'N/A' }}</p>
            <p><strong>Creador:</strong> {{ $merma['usuario']['name'] ?? 'Sistema' }}</p>
            <p><strong>Fecha Registro:</strong>
                {{ is_string($merma['fecha']) ? \Carbon\Carbon::parse($merma['fecha'])->format('d/m/Y H:i') : $merma['fecha']->format('d/m/Y H:i') }}
            </p>
            <p><strong>Generado:</strong> {{ now()->format('d/m/Y H:i') }}</p>
        </td>
        <td style="width: 50%; vertical-align: top;">
            <h3>TOTALES</h3>
            <p><strong>Cantidad Total Perdida:</strong> {{ $merma['total_cantidad'] ?? 0 }} unidades</p>
            <p><strong>Productos Afectados:</strong> {{ $merma['total_productos'] ?? 0 }}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>Costo Total Perdido:</strong></p>
            <p style="font-size: 16px; color: #d9534f; font-weight: bold; margin: 3px 0;">
                Bs. {{ number_format($merma['total_costo'] ?? 0, 2) }}
            </p>
            <p style="margin: 5px 0; font-size: 11px; color: #666;"><strong>Registros:</strong> {{ count($merma['detalles'] ?? []) }}</p>
        </td>
    </tr>
</table>

{{-- Observación y Motivo --}}
@if(!empty($merma['motivo']) || !empty($merma['observaciones']))
    <div style="border-top: 1px solid #bdc3c7; margin-top: 15px; padding-top: 10px;">
        @if(!empty($merma['motivo']))
            <p style="margin: 3px 0; font-size: 12px;"><strong>Motivo:</strong></p>
            <p style="margin: 3px 0 10px 0; font-size: 11px; color: #666;">{{ $merma['motivo'] }}</p>
        @endif
        @if(!empty($merma['observaciones']))
            <p style="margin: 3px 0; font-size: 12px;"><strong>Observaciones:</strong></p>
            <p style="margin: 3px 0; font-size: 11px; color: #666;">{{ $merma['observaciones'] }}</p>
        @endif
    </div>
@endif

{{-- Tabla de mermas detallada --}}
<table class="tabla-productos" style="width: 100%; margin-top: 15px; font-size: 11px; border-collapse: collapse;">
    <thead>
        <tr style="border-bottom: 2px solid #333;">
            <th style="width: 4%; padding: 8px; text-align: left; border: 1px solid #ddd;">#</th>
            <th style="width: 30%; padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
            <th style="width: 10%; padding: 8px; text-align: center; border: 1px solid #ddd;">SKU</th>
            <th style="width: 8%; padding: 8px; text-align: center; border: 1px solid #ddd;">Cantidad</th>
            <th style="width: 12%; padding: 8px; text-align: right; border: 1px solid #ddd;">Precio Unit.</th>
            <th style="width: 14%; padding: 8px; text-align: right; border: 1px solid #ddd;">Costo Total</th>
            <th style="width: 12%; padding: 8px; text-align: center; border: 1px solid #ddd;">Lote</th>
        </tr>
    </thead>
    <tbody>
        @forelse($merma['detalles'] ?? [] as $index => $detalle)
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: center;">{{ $index + 1 }}</td>
            <td style="padding: 6px 8px; border: 1px solid #eee;">
                <strong>{{ $detalle['producto']['nombre'] ?? 'Producto desconocido' }}</strong>
            </td>
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: center;">
                <small style="color: #666; font-family: monospace;">{{ $detalle['producto']['sku'] ?? 'SIN-SKU' }}</small>
            </td>
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: center;">
                <span style="color: #d9534f; font-weight: bold;">-{{ abs($detalle['cantidad'] ?? 0) }}</span> uds
            </td>
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: right;">
                Bs. {{ number_format($detalle['costo_unitario'] ?? 0, 2) }}
            </td>
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: right; font-weight: bold; color: #d9534f;">
                Bs. {{ number_format($detalle['costo_total'] ?? 0, 2) }}
            </td>
            <td style="padding: 6px 8px; border: 1px solid #eee; text-align: center; font-size: 9px; color: #666;">
                {{ $detalle['lote'] ?? '-' }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="7" style="padding: 20px; text-align: center; color: #999; border: 1px solid #eee;">
                No hay productos registrados en esta merma
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- Resumen final de costos --}}
<div style="margin-top: 15px; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #d9534f; border-radius: 3px;">
    <table style="width: 100%; font-size: 12px;">
        <tr>
            <td style="width: 50%;">
                <p style="margin: 5px 0;"><strong>Cantidad Total Perdida:</strong> {{ $merma['total_cantidad'] ?? 0 }} unidades</p>
            </td>
            <td style="width: 50%; text-align: right;">
                <p style="margin: 5px 0; font-weight: bold; color: #d9534f; font-size: 14px;">
                    Valor Total: Bs. {{ number_format($merma['total_costo'] ?? 0, 2) }}
                </p>
            </td>
        </tr>
    </table>
</div>

{{-- Pie de página con detalles --}}
<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 10px; color: #666;">
    <table style="width: 100%;">
        <tr>
            <td style="width: 33%;">
                <p style="margin: 3px 0;"><strong>Usuario:</strong> {{ auth()->user()->name ?? 'Sistema' }}</p>
            </td>
            <td style="width: 33%;">
                <p style="margin: 3px 0;"><strong>Empresa:</strong> {{ config('app.name') }}</p>
            </td>
            <td style="width: 34%; text-align: right;">
                <p style="margin: 3px 0;"><strong>Impreso:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            </td>
        </tr>
    </table>
</div>
@endsection
