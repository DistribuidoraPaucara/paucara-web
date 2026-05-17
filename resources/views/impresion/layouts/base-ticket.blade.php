<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('titulo', 'Ticket')</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0 !important;
            padding: 0 !important;
        }

        body {
            color: #000;
            margin: 0 !important;
            padding: 0 !important;
        }

        .ticket {
            width: 100%;
        }

        /* Utilidades de texto */
        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .left {
            text-align: left;
        }

        .bold {
            font-weight: bold;
        }

        /* Header del ticket */
        .header {
            text-align: center;
            margin-bottom: 1px;
            /*padding: 0;*/
            /*border-bottom: 1px dashed #000;*/
        }

        .logo {
            /*max-width: 120px;
            max-height: 80px;
            margin: 0 auto 2px;
            display: block;*/
            object-fit: contain;
        }

        .empresa-nombre {
            font-weight: bold;
            margin: 1px 0;
        }

        .empresa-info {
            margin: 0;
            font-size: 12px;
            font-weight: 600;
        }

        /* Separadores */
        .separador {
            border-top: 1px dashed #000;
            margin: 3px 0;
            padding: 0;
            padding-top: 8px;
            padding-bottom: 8px;
        }

        .separador-doble {
            border-top: 2px solid #000;
            margin: 3px 0;
            padding: 0;
        }

        .separador-simple {
            border-top: 1px solid #000;
            margin: 2px 0;
            padding: 0;
        }

        /* Tablas de items */
        table.items {
            width: 100%;
            margin: 5px 0;
            border-collapse: collapse;
        }

        table.items td {
            padding: 2px 0;
            vertical-align: top;
        }

        table.items .item-nombre {
            font-weight: bold;
        }

        table.items .item-detalle {
            color: #333;
        }

        /* Totales */
        .totales {
            margin-top: 10px;
        }

        .totales table {
            width: 100%;
        }

        .totales table td {
            padding: 2px 0;
        }

        .totales .total-final {
            font-weight: bold;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid #000;
        }

        /* Información del documento */
        .documento-info {
            margin: 5px 0;
        }

        .documento-info p {
            margin: 2px 0;
        }

        .documento-titulo {
            font-weight: bold;
            text-align: center;
            margin: 5px 0;
        }

        .documento-numero {
            text-align: center;
            font-weight: bold;
            margin: 2px 0;
        }

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 15px;
            border-top: 1px dashed #000;
            padding-top: 5px;
        }

        .footer p {
            margin: 2px 0;
        }

        /* Observaciones */
        .observaciones {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px dashed #000;
        }

        .observaciones strong {
            display: block;
            margin-bottom: 3px;
        }

        /* QR Code para Tickets */
        .qr-container {
            display: flex;
            justify-content: center;
            margin: 8px 0;
            padding: 5px;
            background: #f9f9f9;
        }

        .qr-box {
            text-align: center;
        }

        .qr-code {
            max-width: 120px;
            max-height: 120px;
            width: 100%;
            height: auto;
            border: 1px solid #000;
            padding: 2px;
            background: white;
        }

        .qr-label {
            margin-top: 2px;
            color: #333;
        }

        /* ✅ Espacio en blanco para corte (5cm) */
        .espacio-corte {
            height: 5cm;
            margin-top: 25px !important;
            page-break-after: avoid;
        }

        /* ✅ FIRMAS - Permitir espacios */
        .firmas-container {
            margin-top: 12px !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
        }

        .firmas-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 !important;
            padding: 0 !important;
        }

        .firmas-container td {
            padding: 0 5px !important;
            border-top: 1px solid #000 !important;
            text-align: center;
            height: auto;
            margin: 0 !important;
            padding-top: 18px !important;
        }

        .firmas-container p {
            margin: 3px 0 0 0 !important;
            padding: 0 !important;
            font-size: 9px;
        }

    </style>
</head>
<body>
    <div class="ticket">
        {{-- Header compacto --}}
        <div class="header">
            @if(!empty($logo_principal_base64))
            <img src="{{ $logo_principal_base64 }}" class="logo" alt="{{ $empresa->nombre_comercial }}" style="max-width: 280px; max-height: 100px; object-fit: contain;">
            @endif
            <div class="empresa-nombre">{{ $empresa->nombre_comercial }}</div>
            <div class="empresa-info">{{ $empresa->direccion }}</div>
            @if($empresa->telefono)
            <div class="empresa-info">Celular: {{ $empresa->telefono }}</div>
            @endif
            @if(!$empresa->es_farmacia)
            <div class="empresa-info">Preventista: 71655177</div>
            @endif
        </div>
    </div>

    {{-- Contenido específico del documento --}}
    @yield('contenido')

    {{-- ✅ FIRMAS DEL CLIENTE - Solo para distribuidores (no farmacias) --}}
    @if(!$empresa->es_farmacia)
    <div style="margin-top: 80px !important;">
        <div style="margin-bottom: 35px !important; padding-bottom: 35px !important; font-size: 12px;">
            <div style="height: 0; border-bottom: 1px solid #000; margin-bottom: 5px !important;"></div>
            <p style="text-align: center; margin: 2px 0 !important;">Firma / Sello</p>
        </div>
    </div>

    {{-- ✅ ESPACIO PARA CORTE - 5cm en blanco --}}
    <div class="espacio-corte"></div>
    @endif
    </div>
</body>
</html>
