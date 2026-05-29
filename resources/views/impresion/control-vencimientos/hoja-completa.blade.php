@extends('impresion.layouts.base-a4')

@section('titulo', 'Control de Vencimientos')

@section('contenido')
{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">CONTROL DE VENCIMIENTOS</h2>
            <p><strong>Fecha de generación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            @if($almacenFiltro)
            <p><strong>Almacén:</strong> {{ $almacenFiltro }}</p>
            @endif
            @if($estadoFiltro)
            <p><strong>Estado:</strong>
                @if($estadoFiltro === 'vencido')
                    Vencido
                @elseif($estadoFiltro === 'critico')
                    Crítico (≤ 7 días)
                @elseif($estadoFiltro === 'urgente')
                    Urgente (8-15 días)
                @elseif($estadoFiltro === 'atencion')
                    Atención (16-30 días)
                @elseif($estadoFiltro === 'vigente')
                    Vigente (+30 días)
                @endif
            </p>
            @endif
            @if($busquedaFiltro)
            <p><strong>Búsqueda:</strong> {{ $busquedaFiltro }}</p>
            @endif
            @if($soloConStock)
            <p><strong>Filtro:</strong> Solo productos con stock</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Total de registros:</strong> {{ count($productos) }}</p>
            <p><strong>Stock total:</strong> {{ number_format($productos->sum('stock_actual'), 2) }} unidades</p>
        </div>
    </div>
</div>

{{-- Tabla de control de vencimientos --}}
<table class="tabla-productos mt-2">
    <thead>
        <tr>
            <th style="width: 2%;">ID</th>
            <th style="width: 20%;">Producto</th>
            <th style="width: 7%;">SKU</th>
            <th style="width: 10%;">Categoría</th>
            <th style="width: 8%;">Almacén</th>
            <th style="width: 6%;">Lote</th>
            <th style="width: 6%;">Stock</th>
            <th style="width: 6%;">Dispo</th>
            <th style="width: 6%;">Reser</th>
            <th style="width: 8%;">Fecha Vto</th>
            <th style="width: 5%;">Días</th>
            <th style="width: 8%;">Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($productos as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td><strong>{{ $item['producto']['nombre'] }}</strong></td>
            <td style="font-family: monospace; font-size: 10px;">{{ $item['producto']['sku'] }}</td>
            <td>{{ $item['producto']['categoria']['nombre'] }}</td>
            <td>{{ $item['almacen']['nombre'] }}</td>
            <td style="text-align: center;">{{ $item['lote'] ?? '-' }}</td>
            <td style="text-align: right;"><strong>{{ number_format($item['stock_actual'], 2) }}</strong></td>
            <td style="text-align: right;">{{ number_format($item['cantidad_disponible'] ?? 0, 2) }}</td>
            <td style="text-align: right;">{{ number_format($item['cantidad_reservada'] ?? 0, 2) }}</td>
            <td style="text-align: center;">
                {{ \Carbon\Carbon::parse($item['fecha_vencimiento'])->format('d/m/Y') }}
            </td>
            <td style="text-align: center;">
                <strong>{{ intval($item['dias_para_vencer']) }}</strong>
            </td>
            <td style="text-align: center;">
                @if($item['estado_vencimiento'] === 'vencido')
                    <span style="background: #dc3545; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">VENCIDO</span>
                @elseif($item['estado_vencimiento'] === 'critico')
                    <span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">CRÍTICO</span>
                @elseif($item['estado_vencimiento'] === 'urgente')
                    <span style="background: #e67e22; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">URGENTE</span>
                @elseif($item['estado_vencimiento'] === 'atencion')
                    <span style="background: #f39c12; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">ATENCIÓN</span>
                @elseif($item['estado_vencimiento'] === 'vigente')
                    <span style="background: #27ae60; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">VIGENTE</span>
                @endif
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

{{-- Estadísticas por estado --}}
<div class="totales" style="font-size: 11px; margin-top: 20px;">
    <h3 style="color: #3498db; margin-bottom: 10px;">RESUMEN POR ESTADO</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Vencido</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ $productos->where('estado_vencimiento', 'vencido')->count() }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; width: 60%;"></td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Crítico (≤ 7 días)</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ $productos->where('estado_vencimiento', 'critico')->count() }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Urgente (8-15 días)</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ $productos->where('estado_vencimiento', 'urgente')->count() }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Atención (16-30 días)</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ $productos->where('estado_vencimiento', 'atencion')->count() }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Vigente (+30 días)</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ $productos->where('estado_vencimiento', 'vigente')->count() }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        <tr style="border-top: 3px solid #3498db; background: #d5e8f7;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>TOTAL GENERAL</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">
                <strong>{{ count($productos) }}</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
    </table>
</div>

{{-- Resumen de stock --}}
<div class="totales" style="font-size: 11px; margin-top: 15px;">
    <table>
        <tr class="total-final">
            <td><strong>STOCK TOTAL:</strong></td>
            <td class="text-right">{{ number_format($productos->sum('stock_actual'), 2) }} unidades</td>
        </tr>
        <tr class="subtotal-row">
            <td><strong>DISPONIBLE:</strong></td>
            <td class="text-right">{{ number_format($productos->sum('cantidad_disponible'), 2) }} unidades</td>
        </tr>
        <tr class="subtotal-row">
            <td><strong>RESERVADO:</strong></td>
            <td class="text-right">{{ number_format($productos->sum('cantidad_reservada'), 2) }} unidades</td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #3498db; background: #ecf0f1;">
    <strong>Nota Informativa:</strong>
    <p style="margin-top: 5px; font-size: 8px;">
        Este es un reporte de control de vencimientos del inventario de productos.
        Generado el {{ now()->format('d/m/Y \a \l\a\s H:i') }}.
    </p>
</div>
@endsection
