<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas por Período (80mm)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, sans-serif;
            width: 80mm;
            font-size: 9px;
            color: #000;
        }
        .container {
            padding: 5mm;
        }
        h1 {
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 5px;
            border-bottom: 1px dashed #000;
            padding-bottom: 3px;
        }
        .header-info {
            font-size: 8px;
            margin-bottom: 5px;
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 3px;
        }
        table {
            width: 100%;
            font-size: 8px;
            margin-top: 3px;
        }
        th {
            text-align: left;
            border-bottom: 1px solid #000;
            padding: 2px 0;
            font-weight: bold;
        }
        td {
            padding: 2px 0;
            border-bottom: 1px dotted #ccc;
        }
        .label {
            font-weight: bold;
            width: 40%;
        }
        .value {
            text-align: right;
            width: 60%;
        }
        .footer {
            text-align: center;
            font-size: 7px;
            margin-top: 5px;
            border-top: 1px dashed #000;
            padding-top: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte Ventas</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y H:i') }}
        </div>

        <table>
            <thead>
                <tr>
                    <th colspan="2">Período</th>
                </tr>
            </thead>
            <tbody>
                @forelse($datos as $item)
                    <tr>
                        <td class="label">{{ substr($item['periodo'], 0, 10) }}</td>
                        <td class="value">{{ $item['total_ventas'] }} v.</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 1px 0;">
                            <strong>{{ number_format($item['monto_total'], 2, '.', '') }}</strong>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2" style="text-align: center;">Sin datos</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer">
            Sistema de Reportes
        </div>
    </div>
</body>
</html>
