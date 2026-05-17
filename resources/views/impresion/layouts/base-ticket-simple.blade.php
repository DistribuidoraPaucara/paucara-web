<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('titulo', 'Ticket')</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            color: #000;
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

        /* ✅ Espacio en blanco para corte (10cm) */
        .espacio-corte {
            height: 10cm;
            margin-top: 10px;
            page-break-after: avoid;
        }

    </style>
</head>
<body>
    <div class="ticket">
        {{-- Contenido específico del documento (sin cabecera) --}}
        @yield('contenido')

        {{-- ✅ ESPACIO PARA CORTE - 5cm en blanco --}}
        <div class="espacio-corte"></div>
    </div>
</body>
</html>
