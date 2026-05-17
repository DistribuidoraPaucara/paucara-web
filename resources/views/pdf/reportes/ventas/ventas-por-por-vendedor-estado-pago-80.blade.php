<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte Ventas por Vendedor y Pago (80mm)</title>
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
        .item {
            margin-bottom: 3px;
            padding-bottom: 2px;
            border-bottom: 1px dotted #ccc;
        }
        .vendor-status {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
        }
        .details {
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            margin-top: 1px;
        }
        .amount {
            text-align: right;
            font-weight: bold;
            font-size: 9px;
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
        <h1>Rep. Vend/Pago</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y H:i') }}
        </div>

        @forelse($datos as $item)
            <div class="item">
                <div class="vendor-status">
                    <span>{{ substr($item['vendedor_nombre'], 0, 15) }}</span>
                    <span>{{ $item['estado_pago'] }}</span>
                </div>
                <div class="details">
                    <span>Ventas: {{ $item['total_ventas'] }}</span>
                    <span>{{ number_format($item['monto_total'], 0, '.', '') }}</span>
                </div>
                <div class="details">
                    <span>Pagado: {{ number_format($item['monto_pagado'], 0, '.', '') }}</span>
                    <span>Pend: {{ number_format($item['monto_pendiente'], 0, '.', '') }}</span>
                </div>
            </div>
        @empty
            <div style="text-align: center;">Sin datos</div>
        @endforelse

        <div class="footer">
            Sistema Paucara
        </div>
    </div>
</body>
</html>
