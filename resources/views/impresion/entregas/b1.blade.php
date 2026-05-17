@extends('impresion.layouts.base-b1')

@section('titulo', 'Entrega #' . $entrega->numero_entrega)

@section('estilos-adicionales')
<style>
    /* ============================================
       AJUSTES ESPECÍFICOS PARA FORMATO B1
       707mm × 1000mm - Escala 1.5x de A4
       ============================================ */

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
        font-size: 22px !important;
        margin-bottom: 15px !important;
        margin-top: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100%;
        font-weight: bold;
    }

    h3 {
        font-size: 18px !important;
        margin-bottom: 15px !important;
        margin-top: 25px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100%;
        color: #4F81BD;
        border-bottom: 3px solid #4F81BD;
        padding-bottom: 8px !important;
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
        margin-left: 0 !important;
        margin-right: 0 !important;
        font-size: 12px !important;
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
        margin: 20px 0;
        border-top: 2px solid #ddd;
    }

    /* Información general - Aumentar tamaños */
    div[style*="font-size: 9px"] {
        font-size: 13px !important;
    }

    div[style*="font-size: 8px"] {
        font-size: 12px !important;
    }

    div[style*="font-size: 7px"] {
        font-size: 10px !important;
    }

    /* Strong text dentro de párrafos */
    strong {
        font-weight: bold;
    }

    /* Tabla de productos - Aumentar legibilidad */
    table thead th {
        font-size: 13px !important;
        padding: 8px 5px !important;
    }

    table tbody td {
        font-size: 12px !important;
        padding: 6px 5px !important;
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

    /* Información de encabezado de documento */
    h2[style*="color: #4F81BD"] {
        font-size: 22px !important;
        margin-bottom: 15px !important;
    }

    /* Márgenes adicionales */
    * {
        margin-right: 0 !important;
    }

    /* Márgenes de secciones */
    div[style*="margin-top: 15px"] {
        margin-top: 20px !important;
    }

    div[style*="margin-bottom: 20px"] {
        margin-bottom: 25px !important;
    }

    /* Espacios entre filas */
    tr[style*="border-bottom: 1px dotted"] {
        border-bottom: 1px dotted #ccc !important;
        height: 24px;
    }

    /* Padding en celdas de información */
    div[style*="padding: 6px"] {
        padding: 10px !important;
    }

    div[style*="padding: 8px"] {
        padding: 12px !important;
    }

    /* Observaciones */
    div[style*="border-left: 3px solid #4F81BD"] {
        padding: 12px !important;
        font-size: 12px !important;
        margin: 15px 0 !important;
        border-left-width: 4px !important;
    }

    /* Badges y estado */
    span[style*="display: inline-block"] {
        padding: 4px 8px !important;
        font-size: 11px !important;
    }

</style>
@endsection

@section('contenido')

{{-- 1. INFORMACIÓN DE LA ENTREGA (Versión optimizada para B1) --}}
@include('impresion.entregas.partials._informacion-entrega-b1')

{{-- 2. LISTA GENÉRICA DE PRODUCTOS AGRUPADA (Versión optimizada para B1) --}}
@php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
@endphp
@include('impresion.entregas.partials._lista-generica-b1')

{{-- 3. COMPROBANTES DE VENTAS (al final para entrega al cliente) --}}
@include('impresion.entregas.partials._comprobantes-ventas')

@endsection
