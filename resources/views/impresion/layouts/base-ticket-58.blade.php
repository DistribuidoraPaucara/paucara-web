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
            font-family: 'Courier New', 'Courier', monospace;
            font-size: 8px;
            line-height: 1.2;
            width: 58mm;
            padding: 1mm;
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
            margin: 5px 0;
        }

        .separador-doble {
            border-top: 2px solid #000;
            margin: 5px 0;
        }

        /* Tablas */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7px;
        }

        table td {
            padding: 0.5px 0;
            vertical-align: top;
        }

        /* Totales */
        .totales {
            margin-top: 8px;
            font-size: 8px;
        }

        .totales table td {
            padding: 1px 0;
        }

        .totales .total-final {
            font-weight: bold;
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1px solid #000;
        }

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 6px;
            border-top: 1px dashed #000;
            padding-top: 3px;
        }

        /* Observaciones */
        .observaciones {
            margin-top: 5px;
            padding-top: 3px;
            border-top: 1px dashed #000;
            font-size: 6px;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }

        @yield('estilos-adicionales')
    </style>
</head>
<body>
    <div class="ticket">
        @yield('contenido')
    </div>
</body>
</html>
