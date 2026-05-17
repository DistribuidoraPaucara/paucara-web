<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas por Período (58mm)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, sans-serif;
            width: 58mm;
            font-size: 8px;
            color: #000;
        }
        .container {
            padding: 3mm;
        }
        h1 {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 3px;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
        }
        .header-info {
            font-size: 7px;
            margin-bottom: 3px;
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
        }
        .item {
            margin-bottom: 4px;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 2px;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 8px;
        }
        .item-amount {
            text-align: right;
            font-weight: bold;
            font-size: 9px;
        }
        .footer {
            text-align: center;
            font-size: 7px;
            margin-top: 3px;
            border-top: 1px dashed #000;
            padding-top: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Rep. Ventas</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y H:i') }}
        </div>

        @forelse($datos as $item)
            <div class="item">
                <div class="item-header">
                    <span>{{ substr($item['periodo'], 0, 10) }}</span>
                    <span>{{ $item['total_ventas'] }}v</span>
                </div>
                <div class="item-amount">
                    {{ number_format($item['monto_total'], 2, '.', '') }}
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
