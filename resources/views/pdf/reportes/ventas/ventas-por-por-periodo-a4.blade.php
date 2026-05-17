<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas por Período</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        h1 {
            text-align: center;
            color: #0099CC;
            border-bottom: 3px solid #0099CC;
            padding-bottom: 10px;
        }
        .header-info {
            margin-bottom: 20px;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #0099CC;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #999;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #ddd;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-row {
            background-color: #e6f2ff;
            font-weight: bold;
        }
        .number {
            text-align: right;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <h1>Reporte de Ventas por Período</h1>

    <div class="header-info">
        <p><strong>Fecha de Generación:</strong> {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Período</th>
                <th class="number">Total Ventas</th>
                <th class="number">Monto Total</th>
                <th class="number">Descuentos</th>
                <th class="number">Ticket Promedio</th>
                <th class="number">Clientes Únicos</th>
            </tr>
        </thead>
        <tbody>
            @forelse($datos as $item)
                <tr>
                    <td>{{ $item['periodo'] }}</td>
                    <td class="number">{{ $item['total_ventas'] }}</td>
                    <td class="number">{{ number_format($item['monto_total'], 2, '.', '') }}</td>
                    <td class="number">{{ number_format($item['descuentos_totales'], 2, '.', '') }}</td>
                    <td class="number">{{ number_format($item['ticket_promedio'], 2, '.', '') }}</td>
                    <td class="number">{{ $item['clientes_unicos'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">No hay datos disponibles</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Este reporte ha sido generado automáticamente por el sistema.</p>
    </div>
</body>
</html>
