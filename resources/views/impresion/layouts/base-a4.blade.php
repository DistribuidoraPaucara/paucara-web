<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('titulo', 'Documento')</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        body {
            color: #333;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
        }

        .page {
            padding: 45px;
        }

        /* Header con información de empresa */
        .header {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 30px;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #4F81BD;
            padding-bottom: 10px;
            width: 100%;
        }

        /* Contenido del documento */
        .contenido-documento {
            width: 100%;
            box-sizing: border-box;
        }

        .header-logo {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
        }

        .header-logo img {
            max-width: 80px;
            max-height: 60px;
            object-fit: contain;
        }

        .header-empresa {
            flex: 1;
            text-align: left;
            font-size: 11px;
        }

        .header-empresa h1 {
            color: #4F81BD;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 13px;
        }

        .header-empresa p {
            margin: 3px 0;
            color: #666;
            line-height: 1.3;
        }

        /* Información del documento */
        .documento-info {
            background: #f5f5f5;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            border-left: 4px solid #4F81BD;
            font-size: 12px;
        }

        .documento-info-grid {
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }

        .documento-info-seccion {
            flex: 1;
        }

        .documento-info h2 {
            color: #4F81BD;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .documento-info p {
            margin: 3px 0;
        }

        .documento-info strong {
            color: #333;
        }

        /* Tablas de productos */
        table.tabla-productos {
            width: 100% !important;
            max-width: 100% !important;
            border-collapse: collapse;
            margin: 15px 0;
            box-sizing: border-box !important;
            font-size: 12px;
        }

        table.tabla-productos thead {
            background: #4F81BD;
            color: white;
        }

        table.tabla-productos thead th {
            padding: 8px 5px;
            text-align: left;
            font-weight: bold;
        }

        table.tabla-productos tbody td {
            padding: 6px 5px;
            border-bottom: 1px solid #ddd;
        }

        table.tabla-productos tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        table.tabla-productos tbody tr:hover {
            background-color: #f0f0f0;
        }

        /* Totales */
        .totales {
            margin-top: 20px;
            text-align: right;
        }

        .totales table {
            margin-left: auto;
            width: 300px;
            border-collapse: collapse;
        }

        .totales td {
            padding: 5px 10px;
        }

        .totales .subtotal-row td {
            border-top: 1px solid #ddd;
        }

        .totales .total-final {
            font-weight: bold;
            background: #f5f5f5;
            border-top: 2px solid #4F81BD;
        }


        /* Observaciones */
        .observaciones {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-left: 3px solid #4F81BD;
        }

        .observaciones strong {
            display: block;
            margin-bottom: 5px;
            color: #4F81BD;
        }

        /* Dirección de Entrega */
        .entrega-info {
            margin: 15px 0;
            padding: 10px;
            background: #e3f2fd;
            border-left: 4px solid #2196F3;
            border-radius: 4px;
        }

        .entrega-info strong {
            color: #2196F3;
            display: block;
            margin-bottom: 5px;
        }

        /* Estado Logístico */
        .estado-logistico {
            margin: 15px 0;
            padding: 10px;
            background: #f3e5f5;
            border-left: 4px solid #9c27b0;
            border-radius: 4px;
        }

        .estado-logistico strong {
            color: #9c27b0;
            display: block;
            margin-bottom: 5px;
        }

        /* Información de Pago */
        .informacion-pago {
            margin: 15px 0;
            padding: 10px;
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            border-radius: 4px;
        }

        .informacion-pago p {
            margin: 5px 0;
        }

        /* Cliente Info */

        .cliente-info p {
            margin: 3px 0;
        }

        /* QR Code */
        .qr-container {
            display: flex;
            justify-content: center;
            margin: 15px 0;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 4px;
        }

        .qr-box {
            text-align: center;
        }

        .qr-code {
            max-width: 80px;
            max-height: 80px;
            width: 100%;
            height: auto;
            border: 1px solid #4F81BD;
            padding: 3px;
            background: white;
        }

        .qr-label {
            margin-top: 3px;
            color: #666;
            font-weight: bold;
        }

        /* Términos y Condiciones */
        .terminos-condiciones {
            margin-top: 25px;
            padding: 12px;
            background: #f0f0f0;
            border-radius: 4px;
            page-break-inside: avoid;
        }

        .terminos-titulo {
            display: block;
            color: #333;
            margin-bottom: 8px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .terminos-contenido {
            line-height: 1.3;
            margin-bottom: 8px;
        }

        .terminos-contenido ul {
            margin: 5px 0;
            padding-left: 15px;
        }

        .terminos-contenido li {
            margin: 3px 0;
        }

        .terminos-contacto {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #ddd;
        }

        .terminos-contacto strong {
            display: block;
            margin-bottom: 3px;
        }

        .terminos-contacto p {
            margin: 2px 0;
        }

        /* Utilities */
        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .text-left {
            text-align: left;
        }

        .bold {
            font-weight: bold;
        }

    </style>
</head>
<body>
    <div class="page">
        {{-- Header con datos de empresa --}}
        <div class="header">
            <div class="header-logo">
                {{-- @if($empresa->logo_principal)
                    <img src="{{ $empresa->logo_principal }}" alt="{{ $empresa->nombre_comercial }}">
                @endif --}}
                @if(!empty($logo_principal_base64))
                    <img src="{{ $logo_principal_base64 }}" class="logo" alt="{{ $empresa->nombre_comercial }}" style="max-width: 80px; max-height: 60px; object-fit: contain;">
                @endif
            </div>
            <div class="header-empresa">
                <h1>{{ $empresa->nombre_comercial }}</h1>
                {{-- <p><strong>{{ $empresa->razon_social }}</strong></p> --}}
                <p>{{ $empresa->direccion }}</p>
                @if($empresa->telefono)
                <p>Cel: {{ $empresa->telefono }}</p>
                @endif
            </div>
        </div>

        {{-- Contenido específico de cada documento --}}
        <div class="contenido-documento">
            @yield('contenido')
        </div>
    </div>
</body>
</html>
