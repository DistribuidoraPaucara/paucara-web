<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $titulo }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }

        .container {
            max-width: 100%;
            margin: 0;
            padding: 20px;
        }

        .documento-info {
            margin-bottom: 20px;
        }

        .documento-info table {
            width: 100%;
            border-collapse: collapse;
        }

        .documento-info-seccion {
            padding: 10px;
        }

        .documento-info-seccion h2 {
            font-size: 18px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .documento-info-seccion p {
            font-size: 11px;
            margin: 4px 0;
        }

        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 10px;
        }

        .tabla-productos thead {
            background-color: #3498db;
            color: white;
        }

        .tabla-productos th {
            padding: 8px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #3498db;
        }

        .tabla-productos td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }

        .tabla-productos tbody tr:hover {
            background-color: #f9f9f9;
        }

        .tabla-productos tbody tr:last-child td {
            border-bottom: 1px solid #333;
        }

        .total-container {
            margin-top: 20px;
            text-align: right;
            font-size: 11px;
        }

        .total-container p {
            margin: 4px 0;
        }

        .total-container strong {
            font-size: 12px;
        }

        @media print {
            body {
                background: white;
            }
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- Información del documento --}}
        <div class="documento-info">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div class="documento-info-seccion">
                                <h2 style="color: #3498db;">REPORTE DE PROFORMAS</h2>
                                <p><strong>Fecha de generación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
                                <p><strong>Total de proformas:</strong> {{ $proformas->count() }}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {{-- Tabla de proformas --}}
        <table class="tabla-productos">
            <thead>
                <tr>
                    <th style="width: 8%;">ID</th>
                    <th style="width: 10%;">Número</th>
                    <th style="width: 12%;">Fecha</th>
                    <th style="width: 18%;">Cliente</th>
                    <th style="width: 12%;">Total</th>
                    <th style="width: 12%;">Estado</th>
                    <th style="width: 15%;">Usuario</th>
                    <th style="width: 13%;">Vencimiento</th>
                </tr>
            </thead>
            <tbody>
                @forelse($proformas as $proforma)
                <tr>
                    <td><strong>{{ $proforma->id }}</strong></td>
                    <td>{{ $proforma->numero }}</td>
                    <td>{{ $proforma->created_at->format('d/m/Y') }}</td>
                    <td><strong>{{ $proforma->cliente->nombre ?? 'N/A' }}</strong></td>
                    <td style="text-align: right;">Bs. {{ number_format($proforma->total, 2) }}</td>
                    <td>{{ $proforma->estado }}</td>
                    <td>{{ $proforma->usuarioCreador->name ?? 'N/A' }}</td>
                    <td>{{ $proforma->fecha_vencimiento ? $proforma->fecha_vencimiento->format('d/m/Y') : 'N/A' }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" style="text-align: center; padding: 20px;">No hay proformas para mostrar</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        {{-- Totales --}}
        <div class="total-container">
            <p><strong>Suma Total:</strong> Bs. {{ number_format($proformas->sum('total'), 2) }}</p>
            <p><strong>Cantidad:</strong> {{ $proformas->count() }} proformas</p>
        </div>
    </div>
</body>
</html>
