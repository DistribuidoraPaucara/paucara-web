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
            font-family: {{ isset($fuente_config) ? $fuente_config['stack'] : "'Consolas', 'Courier New', 'Courier', monospace" }};
            font-size: 9px;
            line-height: 1.3;
            width: 80mm;
            padding: 2mm;
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
            margin: 8px 0;
        }

        .separador-doble {
            border-top: 2px solid #000;
            margin: 8px 0;
        }

        /* Tablas */
        table {
            width: 100%;
            border-collapse: collapse;
        }

        table td {
            padding: 1px 0;
            vertical-align: top;
        }

        /* Totales */
        .totales {
            margin-top: 10px;
            font-size: 9px;
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

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 7px;
            border-top: 1px dashed #000;
            padding-top: 5px;
        }

        /* Observaciones */
        .observaciones {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px dashed #000;
            font-size: 7px;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }

        /* Estilos para el selector de fuentes */
        @media screen {
            .font-selector {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 9999;
            }
            .font-selector label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                font-size: 12px;
                color: #333;
            }
            .font-selector select {
                width: 200px;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
            }
        }

        @yield('estilos-adicionales')
    </style>
</head>
<body>
    <!-- Selector de fuentes (solo en navegador) -->
    @if(request()->query('accion') === 'stream')
    <div class="font-selector">
        <label for="font-select">Fuente de letra:</label>
        <select id="font-select" onchange="cambiarFuente(this.value)">
            @forelse($fuentes_disponibles ?? [] as $key => $fuente)
            <option value="{{ $key }}" {{ ($fuente_config['nombre'] ?? '') === ($fuente['nombre'] ?? '') ? 'selected' : '' }}>
                {{ $fuente['nombre'] }}
            </option>
            @empty
            <option value="consolas" selected>Consolas (Por defecto)</option>
            @endforelse
        </select>
    </div>

    <script>
        function cambiarFuente(fuente) {
            const url = new URL(window.location);
            url.searchParams.set('fuente', fuente);
            window.location.href = url.toString();
        }
    </script>
    @endif
    <div class="ticket">
        @yield('contenido')
    </div>
</body>
</html>
