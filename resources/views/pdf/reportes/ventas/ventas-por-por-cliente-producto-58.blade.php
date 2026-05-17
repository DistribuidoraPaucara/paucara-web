<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte Ventas por Cliente y Producto (58mm)</title>
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
        .client-product {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 7px;
        }
        .product-name {
            font-size: 6px;
            margin: 1px 0;
        }
        .details {
            display: flex;
            justify-content: space-between;
            font-size: 6px;
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
        <h1>Rep. Cli/Prod</h1>
        <div class="header-info">
            {{ now()->format('d/m/Y') }}
        </div>

        @forelse($datos->take(10) as $item)
            <div class="item">
                <div class="client-product">
                    <span>{{ substr($item['cliente_nombre'], 0, 12) }}</span>
                    <span>{{ number_format($item['monto_total'], 0, '.', '') }}</span>
                </div>
                <div class="product-name">
                    {{ substr($item['producto_nombre'], 0, 15) }}
                </div>
                <div class="details">
                    <span>{{ $item['total_ventas'] }}v</span>
                    <span>{{ $item['cantidad_total'] }}</span>
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
