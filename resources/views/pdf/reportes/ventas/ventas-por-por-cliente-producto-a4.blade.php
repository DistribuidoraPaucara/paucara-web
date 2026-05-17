<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas por Cliente y Producto</title>
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
    <h1>Reporte de Ventas por Cliente y Producto</h1>

    <div class="header-info">
        <p><strong>Fecha de Generación:</strong> {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th class="number">Total Ventas</th>
                <th class="number">Cantidad Total</th>
                <th class="number">Monto Total</th>
                <th class="number">Última Venta</th>
            </tr>
        </thead>
        <tbody>
            @forelse($datos as $item)
                <tr>
                    <td>{{ $item['cliente_nombre'] }}</td>
                    <td>{{ $item['producto_nombre'] }}</td>
                    <td class="number">{{ $item['total_ventas'] }}</td>
                    <td class="number">{{ number_format($item['cantidad_total'], 2, '.', '') }}</td>
                    <td class="number">{{ number_format($item['monto_total'], 2, '.', '') }}</td>
                    <td class="number">{{ $item['ultima_venta'] }}</td>
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
