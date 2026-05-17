<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Productos Vendidos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }
        .container {
            max-width: 100%;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 18px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 10px;
            color: #666;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 10px;
            flex-wrap: wrap;
        }
        .info-row span {
            margin-right: 20px;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            background-color: #f0f0f0;
            padding: 5px;
            border-left: 3px solid #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
        }
        table thead {
            background-color: #f0f0f0;
        }
        table th {
            border: 1px solid #999;
            padding: 5px;
            text-align: left;
            font-weight: bold;
        }
        table td {
            border: 1px solid #ddd;
            padding: 5px;
        }
        table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .number {
            text-align: right;
        }
        .totales {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 15px;
            font-size: 11px;
            font-weight: bold;
        }
        .totales td {
            width: 25%;
            background-color: #f0f0f0;
            padding: 8px;
            border: 1px solid #999;
            text-align: center;
            vertical-align: middle;
        }
        .total-label {
            color: #666;
            font-size: 8px;
            margin-bottom: 2px;
            line-height: 1.2;
            display: block;
        }
        .total-value {
            font-size: 12px;
            color: #333;
            font-weight: bold;
            display: block;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .empty-message {
            text-align: center;
            color: #999;
            padding: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Reporte de Productos Vendidos</h1>
            <p>Distribuidora Paucara</p>
        </div>

        <div class="info-row">
            @php
                $fechaParsed = \Carbon\Carbon::parse($fecha ?? now())->format('d/m/Y');
            @endphp
            <span><strong>Fecha:</strong> {{ $fechaParsed }}</span>
            <span><strong>Total de Productos:</strong> {{ count($productos ?? []) }}</span>
            <span><strong>Generado:</strong> {{ $fecha_generacion ?? now()->format('d/m/Y H:i') }}</span>
        </div>

        @php
            $totalCantidad = 0;
            $totalMonto = 0;
            if (is_array($productos) || $productos instanceof \Illuminate\Support\Collection) {
                foreach ($productos as $producto) {
                    $cantidad = isset($producto['cantidad_total']) ? (float)$producto['cantidad_total'] : (isset($producto->cantidad_total) ? (float)$producto->cantidad_total : 0);
                    $monto = isset($producto['subtotal']) ? (float)$producto['subtotal'] : (isset($producto->subtotal) ? (float)$producto->subtotal : 0);
                    $totalCantidad += $cantidad;
                    $totalMonto += $monto;
                }
            }
        @endphp

        <table class="totales">
            <tr>
                <td>
                    <span class="total-label">Cantidad de Productos</span>
                    <span class="total-value">{{ count($productos ?? []) }}</span>
                </td>
                <td>
                    <span class="total-label">Cantidad Total Vendida</span>
                    <span class="total-value">{{ number_format($totalCantidad, 2, ',', '.') }}</span>
                </td>
                <td>
                    <span class="total-label">Monto Total Vendido</span>
                    <span class="total-value">Bs. {{ number_format($totalMonto, 2, ',', '.') }}</span>
                </td>
                <td>
                    <span class="total-label">Precio Promedio</span>
                    <span class="total-value">Bs. {{ number_format($totalCantidad > 0 ? $totalMonto / $totalCantidad : 0, 2, ',', '.') }}</span>
                </td>
            </tr>
        </table>

        @if (count($productos ?? []) > 0)
            <div class="section-title">📋 Detalle de Productos Vendidos</div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th class="number">Stock Inicial</th>
                        <th class="number">Cantidad Vendida</th>
                        <th class="number">Stock Actual</th>
                        <th class="number">Precio Unitario</th>
                        <th class="number">Total Venta</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($productos as $producto)
                        @php
                            $nombre = is_array($producto) ? ($producto['nombre'] ?? 'N/A') : ($producto->nombre ?? 'N/A');
                            $sku = is_array($producto) ? ($producto['sku'] ?? '-') : ($producto->sku ?? '-');
                            $cantidadVendida = is_array($producto) ? ($producto['cantidad_total'] ?? 0) : ($producto->cantidad_total ?? 0);
                            $precioUnitario = is_array($producto) ? ($producto['precio_unitario'] ?? 0) : ($producto->precio_unitario ?? 0);
                            $totalVenta = is_array($producto) ? ($producto['subtotal'] ?? 0) : ($producto->subtotal ?? 0);
                            $stockInicial = is_array($producto) ? ($producto['stock_inicial'] ?? 0) : ($producto->stock_inicial ?? 0);
                            $stockActual = is_array($producto) ? ($producto['stock_actual'] ?? 0) : ($producto->stock_actual ?? 0);
                            $ventaIds = is_array($producto) ? ($producto['venta_ids'] ?? []) : ($producto->venta_ids ?? []);
                        @endphp
                        <tr>
                            <td>{{ $nombre }}</td>
                            <td>{{ $sku }}</td>
                            <td class="number">{{ number_format($stockInicial, 2, ',', '.') }}</td>
                            <td class="number">{{ number_format($cantidadVendida, 2, ',', '.') }}</td>
                            <td class="number">{{ number_format($stockActual, 2, ',', '.') }}</td>
                            <td class="number">Bs. {{ number_format($precioUnitario, 2, ',', '.') }}</td>
                            <td class="number">Bs. {{ number_format($totalVenta, 2, ',', '.') }}</td>
                        </tr>
                        @if (!empty($ventaIds))
                            <tr style="background-color: #f9f9f9;">
                                <td colspan="7">
                                    <strong>📋 Ventas:</strong> {{ implode(', ', $ventaIds) }}
                                </td>
                            </tr>
                        @endif
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty-message">
                ℹ️ No hay productos vendidos para mostrar en esta fecha
            </div>
        @endif

        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema Distribuidora Paucara</p>
        </div>
    </div>
</body>
</html>
