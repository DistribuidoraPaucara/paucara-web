@extends('impresion.layouts.base-ticket')

@section('titulo', 'Entrega #' . $entrega->numero_entrega)

@section('contenido')
<div style="width: 100%; box-sizing: border-box;">
    {{-- Logo --}}

    <div class="documento-titulo" style="font-size: 8px; margin-bottom: 2px;">ENTREGA</div>
    <div class="documento-numero" style="font-size: 10px; font-weight: bold;">#{{ $entrega->numero_entrega }}</div>
    <div class="center" style="font-size: 5px; margin-bottom: 3px;">
        {{ $entrega->fecha_asignacion->format('d/m/Y H:i') }} | {{ $entrega->estado }}
    </div>

    <div class="separador"></div>

    {{-- LISTA GENÉRICA COMPACTA --}}
    @php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
    $estadisticas = $impresionService->obtenerEstadisticas($entrega);
    @endphp

    <p style="font-size: 6px; font-weight: bold; text-align: center; margin: 2px 0; text-decoration: underline;">LISTA GENÉRICA</p>

    <table style="width: 100%; font-size: 5px; margin-bottom: 2px; border-collapse: collapse;">
        <tbody>
            @forelse($productosGenerico as $producto)
            <tr style="border-bottom: 1px dotted #999;">
                <td style="padding: 0.5px 0;">@if($producto['es_combo']) 📦 @endif{{ substr($producto['producto_nombre'], 0, 18) }}</td>
                <td style="padding: 0.5px 0; text-align: center; width: 12%;">{{ number_format($producto['cantidad_total'], 1) }}</td>
                <td style="padding: 0.5px 0; text-align: right; width: 18%; font-weight: bold;">{{ number_format($producto['subtotal_total'], 2) }}</td>
            </tr>
            {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
            @if($producto['es_combo'] && !empty($producto['componentes']))
                @foreach($producto['componentes'] as $componente)
                <tr style="border-bottom: 1px dotted #ccc;">
                    <td style="padding: 0.5px 0; padding-left: 3px; font-size: 4px;">└─ {{ substr($componente['producto_nombre'], 0, 16) }}</td>
                    <td style="padding: 0.5px 0; text-align: center; width: 12%; font-size: 4px;">{{ number_format($componente['cantidad'], 1) }}</td>
                    <td style="padding: 0.5px 0; text-align: right; width: 18%;"></td>
                </tr>
                @endforeach
            @endif
            @empty
            <tr>
                <td colspan="3" style="text-align: center; padding: 2px; font-size: 4px; color: #999;">Sin productos</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div style="border-top: 1px dashed #000; padding: 1px 0; margin-bottom: 3px; font-size: 5px;">
        <div style="text-align: right; font-weight: bold;">Total: {{ number_format($estadisticas['total_subtotal'], 2) }}</div>
        <div style="font-size: 4px; color: #666;">{{ $estadisticas['total_productos'] }} items | {{ $estadisticas['total_clientes'] }} clientes</div>
    </div>

    <div class="separador"></div>

    {{-- ✅ NUEVA 2026-02-12: RESUMEN DE PAGOS (Compacto) --}}
    @if($resumen_pagos)
    <p style="font-size: 6px; font-weight: bold; text-align: center; margin: 1px 0;">💳 PAGOS</p>

    {{-- Totales principales --}}
    <table style="width: 100%; font-size: 4px; border-collapse: collapse; margin-bottom: 1px;">
        <tbody>
            <tr style="border: 0.5px solid #999;">
                <td style="padding: 0.5px;">Esperado:</td>
                <td style="padding: 0.5px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['total_esperado'], 2) }}</td>
            </tr>
            <tr style="border: 0.5px solid #999; background-color: #f5f5f5;">
                <td style="padding: 0.5px;">Recibido:</td>
                <td style="padding: 0.5px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['total_recibido'], 2) }}</td>
            </tr>
            <tr style="border: 0.5px solid #999;">
                <td style="padding: 0.5px;">Falta:</td>
                <td style="padding: 0.5px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['diferencia'], 2) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Progreso compacto --}}
    <div style="margin: 1px 0; padding: 0.5px; border: 0.5px solid #999; font-size: 4px;">
        <div style="width: 100%; height: 3px; background-color: #e0e0e0; overflow: hidden;">
            <div style="width: {{ min($resumen_pagos['porcentaje_recibido'], 100) }}%; height: 100%; background-color: #4CAF50;"></div>
        </div>
        <div style="text-align: right; margin-top: 0.5px;">{{ $resumen_pagos['porcentaje_recibido'] }}%</div>
    </div>

    {{-- Desglose compacto --}}
    @if(count($resumen_pagos['pagos']) > 0)
    <div style="margin: 1px 0; font-size: 4px;">
        @foreach($resumen_pagos['pagos'] as $pago)
        {{-- ✅ ACTUALIZADO 2026-02-16: Usar código en lugar de nombre para evitar discrepancias --}}
        <div style="padding: 0.5px;">{{ substr($pago['tipo_pago_codigo'] ?? $pago['tipo_pago'], 0, 12) }}: {{ number_format($pago['total'], 2) }}</div>
        @endforeach
    </div>
    @endif

    {{-- Alerta ventas sin pago --}}
    @if(count($resumen_pagos['sin_registrar']) > 0)
    <div style="margin: 1px 0; padding: 0.5px; border: 1px solid #ff9800; background-color: #fff3e0; font-size: 4px; color: #ff6f00;">
        <strong>⚠ {{ count($resumen_pagos['sin_registrar']) }} SIN PAGO</strong>
    </div>
    @endif
    @endif

    <div class="separador"></div>

    {{-- RESUMEN PARA CHOFER --}}
    <p style="font-size: 6px; font-weight: bold; text-align: center; margin: 2px 0;">RESUMEN CHOFER</p>

    <table style="width: 100%; font-size: 5px; border-collapse: collapse;">
        <tbody>
            @php $totalGeneral = 0; @endphp
            @foreach($entrega->ventas as $venta)
            @php $subtotalVenta = $venta->detalles->sum('subtotal'); $totalGeneral += $subtotalVenta; @endphp
            <tr style="border-bottom: 1px dotted #000;">
                <td style="padding: 1px;">#{{ $venta->numero }}</td>
                <td style="padding: 1px; text-align: right; font-weight: bold;">{{ number_format($subtotalVenta, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="border-top: 2px solid #000; margin-top: 2px; padding: 1px 0; text-align: right;">
        <p style="font-size: 6px; font-weight: bold; margin: 1px 0;">TOTAL: {{ number_format($totalGeneral, 2) }}</p>
        <p style="font-size: 5px; margin: 0.5px 0;">
            {{ $entrega->chofer?->name ?? $entrega->chofer?->nombre ?? 'S/A' }}
            {{ $entrega->entregador ? '| ' . ($entrega->entregador?->name ?? 'S/A') : '' }}
            | {{ $entrega->vehiculo?->placa ?? 'S/A' }}
        </p>
    </div>
</div>

@endsection
