<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte Ventas por Cliente y Producto (80mm)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, sans-serif;
            width: 80mm;
            font-size: 8px;
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
            font-size: 8px;
        }
        .client-product {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
        }
        .details {
            display: flex;
            justify-content: space-between;
            font-size: 7px;
            margin-top: 1px;
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
        <h1>Rep. Cli/Prod</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y H:i') }}
        </div>

        @forelse($datos->take(15) as $item)
            <div class="item">
                <div class="client-product">
                    <span>{{ substr($item['cliente_nombre'], 0, 15) }}</span>
                    <span>{{ number_format($item['monto_total'], 0, '.', '') }}</span>
                </div>
                <div style="font-size: 7px;">
                    {{ substr($item['producto_nombre'], 0, 20) }}
                </div>
                <div class="details">
                    <span>{{ $item['total_ventas'] }}v</span>
                    <span>{{ number_format($item['cantidad_total'], 1, '.', '') }}</span>
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
