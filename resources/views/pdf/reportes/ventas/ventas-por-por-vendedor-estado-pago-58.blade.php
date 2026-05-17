<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte Ventas por Vendedor y Pago (58mm)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, sans-serif;
            width: 58mm;
            font-size: 7px;
            color: #000;
        }
        .container {
            padding: 3mm;
        }
        h1 {
            text-align: center;
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 3px;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
        }
        .header-info {
            font-size: 6px;
            margin-bottom: 3px;
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
        }
        .item {
            margin-bottom: 2px;
            padding-bottom: 1px;
            border-bottom: 1px dotted #ccc;
        }
        .vendor-status {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 7px;
        }
        .details {
            display: flex;
            justify-content: space-between;
            font-size: 6px;
            margin-top: 1px;
        }
        .footer {
            text-align: center;
            font-size: 6px;
            margin-top: 3px;
            border-top: 1px dashed #000;
            padding-top: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Rep. Vend</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y') }}
        </div>

        @forelse($datos as $item)
            <div class="item">
                <div class="vendor-status">
                    <span>{{ substr($item['vendedor_nombre'], 0, 10) }}</span>
                    <span>{{ substr($item['estado_pago'], 0, 3) }}</span>
                </div>
                <div class="details">
                    <span>{{ $item['total_ventas'] }}v</span>
                    <span>{{ number_format($item['monto_total'], 0, '.', '') }}</span>
                </div>
                <div class="details" style="font-size: 6px; color: #666;">
                    <span>P:{{ number_format($item['monto_pagado'], 0, '.', '') }}</span>
                    <span>D:{{ number_format($item['monto_pendiente'], 0, '.', '') }}</span>
                </div>
            </div>
        @empty
            <div style="text-align: center;">Sin datos</div>
        @endforelse

        <div class="footer">
            Paucara
        </div>
    </div>
</body>
</html>
