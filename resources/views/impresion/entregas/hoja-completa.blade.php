@extends('impresion.layouts.base-a4')

@section('titulo', 'Entrega #' . $entrega->numero_entrega)

@section('estilos-adicionales')
<style>
    /* Contenedores principales */
    .documento-info {
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
        width: 100%;
        box-sizing: border-box;
    }

    /* Encabezados */
    h2 {
        font-size: 14px;
        margin-bottom: 8px;
        margin-top: 0;
        margin-left: 0;
        margin-right: 0;
        width: 100%;
    }

    h3 {
        font-size: 12px;
        margin-bottom: 8px;
        margin-top: 15px;
        margin-left: 0;
        margin-right: 0;
        width: 100%;
        color: #4F81BD;
        border-bottom: 2px solid #4F81BD;
        padding-bottom: 4px;
    }

    /* Tablas */
    table {
        width: 100%;
        box-sizing: border-box;
    }

    /* Grid layout para información */
    div[style*="display: grid"] {
        width: 100%;
    }

    div[style*="display: flex"] {
        width: 100%;
    }

    /* Bloques de contenido */
    > div {
        width: 100%;
        box-sizing: border-box;
    }

    /* Párrafos */
    p {
        margin-left: 0;
        margin-right: 0;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    /* Totales */
    .totales {
        width: 100%;
    }

    .totales table {
        width: 100%;
        margin-left: 0;
    }

    /* Divisores */
    .separador {
        width: 100%;
        margin: 8px 0;
        border-top: 1px solid #ddd;
    }

    /* Notas y observaciones */
    p[style*="font-size: 9px; color: #666"] {
        width: 100%;
        box-sizing: border-box;
    }

    /* Información de venta */
    div[style*="margin-top: 15px; padding: 8px"] {
        width: 100%;
        box-sizing: border-box;
    }

    /* Grid de información */
    div[style*="display: grid; grid-template-columns"] {
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Tablas de totales */
    .totales {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    /* Asegurar que las tablas de productos ocupen 100% */
    table[style*="width: 100%"] {
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Contenedor de separadores */
    div[style*="margin: 15px 0; border-top"] {
        width: 100%;
        box-sizing: border-box;
    }

    /* Información de venta */
    div[style*="margin-top: 15px; padding: 8px; background: #fafafa"] {
        width: 100%;
        box-sizing: border-box;
    }

    /* Secciones principales */
    div {
        max-width: none !important;
        overflow: visible !important;
    }

    /* Optimización de table-layout */
    table {
        table-layout: auto;
    }

    /* Overflow y word-break */
    td, th {
        overflow: visible !important;
        word-break: break-word;
    }

    /* Márgenes adicionales */
    
</style>
@endsection

@section('contenido')

{{-- 1. INFORMACIÓN DE LA ENTREGA --}}
@include('impresion.entregas.partials._informacion-entrega')

{{-- 2. LISTA GENÉRICA DE PRODUCTOS AGRUPADA --}}
@php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
@endphp
@include('impresion.entregas.partials._lista-generica')

{{-- ✅ NUEVA 2026-02-21: TIPO DE ENTREGA Y NOVEDADES --}}
@if($resumen_pagos && isset($resumen_pagos['confirmaciones']) && count($resumen_pagos['confirmaciones']) > 0)
<div style="margin: 15px 0; padding: 10px; border-top: 2px solid #131313; padding-top: 10px;">
    <h3 style="margin-top: 0;">📦 Tipo de Entrega</h3>

    <table style="width: 100%; border-collapse: collapse;">
        <tbody>
            @foreach($resumen_pagos['confirmaciones'] as $conf)
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px; width: 25%; font-weight: bold;">F. {{ $conf['venta_id'] }}</td>
                <td style="padding: 8px; width: 35%;">{{ $conf['tipo_entrega'] === 'COMPLETA' ? '✅ Completa' : '⚠️ Con Novedad' }}</td>
                <td style="padding: 8px; width: 40%; text-align: right;">
                    @if($conf['tipo_novedad'])
                    <span style="background-color: #fff3e0; padding: 3px 8px; border-radius: 3px; font-size: 11px;">{{ $conf['tipo_novedad'] }}</span>
                    @endif
                </td>
            </tr>

            {{-- Productos devueltos si aplica --}}
            @if($conf['tipo_novedad'] === 'DEVOLUCION_PARCIAL' && $conf['productos_devueltos'] && count($conf['productos_devueltos']) > 0)
            <tr>
                <td colspan="3" style="padding: 8px; background-color: #f9f9f9;">
                    <p style="margin: 5px 0 8px 0; font-weight: bold; font-size: 11px; color: #ff9800;">📦 Productos Devueltos:</p>
                    <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                        <tbody>
                            @foreach($conf['productos_devueltos'] as $prod)
                            <tr style="border-bottom: 1px dotted #ccc;">
                                <td style="padding: 3px 5px; width: 50%;">{{ substr($prod['producto_nombre'] ?? 'N/A', 0, 30) }}</td>
                                <td style="padding: 3px 5px; text-align: center; width: 20%;">x{{ $prod['cantidad'] ?? 0 }}</td>
                                <td style="padding: 3px 5px; text-align: right; width: 30%;">Bs. {{ number_format($prod['subtotal'] ?? 0, 2) }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div style="text-align: right; padding: 5px 5px 0 5px; border-top: 1px solid #ccc; margin-top: 3px;">
                        <p style="margin: 0; font-weight: bold; font-size: 11px;">Total Devuelto: Bs. {{ number_format($conf['monto_devuelto'], 2) }}</p>
                    </div>
                </td>
            </tr>
            @endif
            @endforeach
        </tbody>
    </table>
</div>
@endif

{{-- ✅ NUEVA 2026-02-12: RESUMEN DE PAGOS --}}
@if($resumen_pagos)
<div style="margin: 15px 0; border-top: 2px solid #131313; padding-top: 10px;">
    <h3 style="margin-top: 0;">💳 Resumen de Pagos</h3>

    {{-- Totales principales en 3 columnas --}}
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div style="padding: 8px; background: #DFDADA; border: 1px solid #ccc; border-radius: 3px;">
            <p style="margin: 0 0 5px 0; color: #666;">Total Esperado</p>
            <p style="margin: 0; font-weight: bold; color: #121213;">Bs. {{ number_format($resumen_pagos['total_esperado'], 2) }}</p>
        </div>
        <div style="padding: 8px; background: #D0D5D0; border: 1px solid #161716; border-radius: 3px;">
            <p style="margin: 0 0 5px 0; color: #141514;">Total Recibido</p>
            <p style="margin: 0; font-weight: bold; color: #080908;">Bs. {{ number_format($resumen_pagos['total_recibido'], 2) }}</p>
        </div>
        <div style="padding: 8px; background: #BABAB4; border: 1px solid #151514; border-radius: 3px;">
            <p style="margin: 0 0 5px 0; color: #171616;">Falta por Recibir</p>
            <p style="margin: 0; font-weight: bold; color: #0F0E0E;">Bs. {{ number_format($resumen_pagos['diferencia'], 2) }}</p>
        </div>
    </div>

    {{-- Barra de progreso --}}
    <div style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 12px; font-weight: bold;">Progreso de Pago</span>
            <span style="font-size: 12px; font-weight: bold;">{{ $resumen_pagos['porcentaje_recibido'] }}%</span>
        </div>
        <div style="width: 100%; height: 20px; background-color: #e0e0e0; border-radius: 4px; overflow: hidden; border: 1px solid #999;">
            <div style="width: {{ min($resumen_pagos['porcentaje_recibido'], 100) }}%; height: 100%; background-color: #E9F3E9; transition: width 0.3s ease;"></div>
        </div>
    </div>

    {{-- Desglose por tipo de pago --}}
    @if(count($resumen_pagos['pagos']) > 0)
    <div style="margin: 10px 0;">
        <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">Desglose por Tipo de Pago:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                @foreach($resumen_pagos['pagos'] as $pago)
                <tr style="border-bottom: 1px dotted #ccc;">
                    {{-- ✅ ACTUALIZADO 2026-02-16: Usar código en lugar de nombre para evitar discrepancias --}}
                    <td style="padding: 5px; width: 70%;"><strong>{{ $pago['tipo_pago_codigo'] ?? $pago['tipo_pago'] }}</strong> ({{ $pago['cantidad_ventas'] }} venta{{ $pago['cantidad_ventas'] != 1 ? 's' : '' }})</td>
                    <td style="padding: 5px; text-align: right; font-weight: bold;">Bs. {{ number_format($pago['total'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Ventas sin pago registrado --}}
    @if(count($resumen_pagos['sin_registrar']) > 0)
    <div style="margin: 10px 0; padding: 8px; background: #fff3e0; border: 2px solid #131312; border-radius: 3px;">
        <p style="margin: 5px 0; font-size: 12px; font-weight: bold; color: #232222;">Ventas sin Pago Registrado ({{ count($resumen_pagos['sin_registrar']) }})</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tbody>
                @foreach($resumen_pagos['sin_registrar'] as $venta)
                <tr style="border-bottom: 1px dotted #0D0C0C;">
                    <td style="padding: 3px; color: #191818;">{{ $venta['venta_numero'] }}</td>
                    <td style="padding: 3px; text-align: right; font-weight: bold; color: #151413;">Bs. {{ number_format($venta['monto'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif
</div>
@endif

{{-- 3. COMPROBANTES DE VENTAS (al final para entrega al cliente) --}}
@include('impresion.entregas.partials._comprobantes-ventas')

@endsection
