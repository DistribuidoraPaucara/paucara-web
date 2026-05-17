<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas por Vendedor y Estado de Pago</title>
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
            font-size: 10px;
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
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .number {
            text-align: right;
        }
        .status-pagada {
            background-color: #c8e6c9;
        }
        .status-pendiente {
            background-color: #ffcccc;
        }
        .status-parcial {
            background-color: #fff9c4;
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
    <h1>Reporte de Ventas por Vendedor y Estado de Pago</h1>

    <div class="header-info">
        <p><strong>Fecha de Generación:</strong> {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Vendedor</th>
                <th>Estado de Pago</th>
                <th class="number">Total Ventas</th>
                <th class="number">Monto Total</th>
                <th class="number">Monto Pagado</th>
                <th class="number">Monto Pendiente</th>
            </tr>
        </thead>
        <tbody>
            @forelse($datos as $item)
                <tr class="status-{{ strtolower($item['estado_pago']) }}">
                    <td>{{ $item['vendedor_nombre'] }}</td>
                    <td>{{ $item['estado_pago'] }}</td>
                    <td class="number">{{ $item['total_ventas'] }}</td>
                    <td class="number">{{ number_format($item['monto_total'], 2, '.', '') }}</td>
                    <td class="number">{{ number_format($item['monto_pagado'], 2, '.', '') }}</td>
                    <td class="number">{{ number_format($item['monto_pendiente'], 2, '.', '') }}</td>
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
