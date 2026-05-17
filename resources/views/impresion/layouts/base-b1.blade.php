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

        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        .page {
            width: 400mm;
            min-height: 300mm;
            padding: 10mm;
            box-sizing: border-box;
            background: white;
            margin: 0 auto;
        }

        /* Header con información de empresa */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #4F81BD;
            padding-bottom: 15px;
        }

        .header-logo {
            flex: 0 0 auto;
        }

        .header-logo img {
            max-width: 200px;
            max-height: 100px;
            object-fit: contain;
        }

        .header-empresa {
            flex: 1;
            text-align: right;
            padding-left: 30px;
        }

        .header-empresa h1 {
            font-size: 28px;
            color: #4F81BD;
            margin-bottom: 8px;
            font-weight: bold;
        }

        .header-empresa p {
            font-size: 11px;
            margin: 3px 0;
            color: #555;
        }

        /* Información del documento */
        .documento-info {
            background: #f5f5f5;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            border-left: 6px solid #4F81BD;
        }

        .documento-info-grid {
            display: flex;
            justify-content: space-between;
            gap: 30px;
        }

        .documento-info-seccion {
            flex: 1;
        }

        .documento-info h2 {
            font-size: 18px;
            color: #4F81BD;
            margin-bottom: 12px;
            font-weight: bold;
        }

        .documento-info p {
            font-size: 11px;
            margin: 4px 0;
        }

        .documento-info strong {
            color: #333;
        }

        /* Tablas de productos */
        table.tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table.tabla-productos thead {
            background: #4F81BD;
            color: white;
        }

        table.tabla-productos thead th {
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
        }

        table.tabla-productos tbody td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
        }

        table.tabla-productos tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        table.tabla-productos tbody tr:hover {
            background-color: #f0f0f0;
        }

        /* Totales */
        .totales {
            margin-top: 30px;
            text-align: right;
        }

        .totales table {
            margin-left: auto;
            width: 400px;
            border-collapse: collapse;
        }

        .totales td {
            padding: 8px 15px;
            font-size: 12px;
        }

        .totales .subtotal-row td {
            border-top: 1px solid #ddd;
        }

        .totales .total-final {
            font-size: 16px;
            font-weight: bold;
            background: #f5f5f5;
            border-top: 3px solid #4F81BD;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 20mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 8px;
        }

        .footer p {
            margin: 3px 0;
        }

        /* Observaciones */
        .observaciones {
            margin-top: 25px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #4F81BD;
            font-size: 11px;
        }

        .observaciones strong {
            display: block;
            margin-bottom: 8px;
            color: #4F81BD;
            font-size: 12px;
        }

        /* Dirección de Entrega */
        .entrega-info {
            margin: 20px 0;
            padding: 15px;
            background: #e3f2fd;
            border-left: 5px solid #2196F3;
            border-radius: 4px;
            font-size: 11px;
        }

        .entrega-info strong {
            color: #2196F3;
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
        }

        /* Estado Logístico */
        .estado-logistico {
            margin: 20px 0;
            padding: 15px;
            background: #f3e5f5;
            border-left: 5px solid #9c27b0;
            border-radius: 4px;
            font-size: 11px;
        }

        .estado-logistico strong {
            color: #9c27b0;
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
        }

        /* Información de Pago */
        .informacion-pago {
            margin: 20px 0;
            padding: 15px;
            background: #fff3e0;
            border-left: 5px solid #ff9800;
            border-radius: 4px;
            font-size: 11px;
        }

        .informacion-pago p {
            margin: 6px 0;
        }

        /* Cliente Info */
        .cliente-info {
            font-size: 11px;
        }

        .cliente-info p {
            margin: 4px 0;
        }

        /* QR Code */
        .qr-container {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
        }

        .qr-box {
            text-align: center;
        }

        .qr-code {
            max-width: 120px;
            max-height: 120px;
            width: 100%;
            height: auto;
            border: 1px solid #4F81BD;
            padding: 5px;
            background: white;
        }

        .qr-label {
            font-size: 10px;
            margin-top: 5px;
            color: #666;
            font-weight: bold;
        }

        /* Términos y Condiciones */
        .terminos-condiciones {
            margin-top: 30px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 10px;
            page-break-inside: avoid;
        }

        .terminos-titulo {
            display: block;
            color: #333;
            font-size: 11px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 8px;
            font-weight: bold;
        }

        .terminos-contenido {
            line-height: 1.4;
            margin-bottom: 10px;
        }

        .terminos-contenido ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        .terminos-contenido li {
            margin: 4px 0;
            font-size: 10px;
        }

        .terminos-contacto {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 10px;
        }

        .terminos-contacto strong {
            display: block;
            margin-bottom: 4px;
        }

        .terminos-contacto p {
            margin: 3px 0;
            font-size: 10px;
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

        @yield('estilos-adicionales')

    </style>
</head>
<body>
    <div class="page">
        {{-- Header con datos de empresa --}}
        <div class="header" style="padding-left: 30px; padding-right: 30px;">
            <div class="header-logo">
                @if($empresa->logo_principal)
                <img src="{{ $empresa->logo_principal }}" alt="{{ $empresa->nombre_comercial }}">
                @endif
            </div>
            <div class="header-empresa">
                <h1>{{ $empresa->nombre_comercial }}</h1>
                <p><strong>{{ $empresa->razon_social }}</strong></p>
                <p>{{ $empresa->direccion }}</p>
                <p>{{ $empresa->ciudad }} - {{ $empresa->pais }}</p>
                @if($empresa->telefono)
                <p>Tel: {{ $empresa->telefono }}</p>
                @endif
                @if($empresa->email)
                <p>Email: {{ $empresa->email }}</p>
                @endif
            </div>
        </div>

        {{-- Contenido específico de cada documento --}}
        <div style="padding-left: 30px; padding-right: 30px;">
            @yield('contenido')
        </div>

        {{-- Footer --}}
        <div class="footer" style="padding-left: 30px; padding-right: 30px;">
            @if($empresa->logo_footer)
            <div style="margin-bottom: 10px;">
                <img src="{{ $empresa->logo_footer }}" alt="Logo Footer" style="max-width: 100px; max-height: 40px; object-fit: contain;">
            </div>
            @elseif($empresa->logo_principal)
            <div style="margin-bottom: 10px;">
                <img src="{{ $empresa->logo_principal }}" alt="Logo Footer" style="max-width: 100px; max-height: 40px; object-fit: contain;">
            </div>
            @endif
            @if($empresa->mensaje_footer)
            <p>{{ $empresa->mensaje_footer }}</p>
            @endif
            @if($empresa->mensaje_legal)
            <p style="font-size: 9px; margin-top: 5px;">{{ $empresa->mensaje_legal }}</p>
            @endif
            <p style="margin-top: 5px;">
                Impreso: {{ $fecha_impresion->format('d/m/Y H:i:s') }}
                @if($usuario)
                | Usuario: {{ is_string($usuario) ? $usuario : (isset($usuario->name) ? $usuario->name : 'Sistema') }}
                @endif
            </p>
        </div>
    </div>
</body>
</html>
