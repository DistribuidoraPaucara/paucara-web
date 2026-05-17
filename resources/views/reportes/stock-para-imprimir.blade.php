<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Stock</title>
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
            <h1>📦 Reporte de Stock</h1>
            <p>Distribuidora Paucara</p>
        </div>

        <div class="info-row">
            <span><strong>Total de Artículos:</strong> {{ count($stock ?? []) }}</span>
            @if ($almacen_filtro)
                <span><strong>Almacén:</strong> {{ $almacen_filtro }}</span>
            @endif
            @if ($busqueda_filtro)
                <span><strong>Búsqueda:</strong> {{ $busqueda_filtro }}</span>
            @endif
            <span><strong>Generado:</strong> {{ $fecha_generacion ?? now()->format('d/m/Y H:i') }}</span>
        </div>

        @if (count($stock ?? []) > 0)
            <div class="section-title">📋 Detalle de Stock</div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th>Almacén</th>
                        <th class="number">Cantidad</th>
                        <th class="number">Disponible</th>
                        <th class="number">Reservado</th>
                        <th class="number">Precio Unitario</th>
                        <th class="number">Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    @php $totalValor = 0; @endphp
                    @foreach ($stock as $item)
                        @php
                            $cantidad = is_array($item) ? ($item['cantidad'] ?? 0) : ($item->cantidad ?? 0);
                            $disponible = is_array($item) ? ($item['cantidad_disponible'] ?? 0) : ($item->cantidad_disponible ?? 0);
                            $precioUnitario = is_array($item) ? ($item['precio_unitario'] ?? 0) : ($item->precio_unitario ?? 0);
                            $valorTotal = $cantidad * $precioUnitario;
                            $totalValor += $valorTotal;
                            $reservado = $cantidad - $disponible;
                        @endphp
                        <tr>
                            <td>
                                @if (is_array($item))
                                    {{ $item['producto_nombre'] ?? $item['nombre'] ?? 'N/A' }}
                                @else
                                    {{ $item->producto?->nombre ?? $item->nombre ?? 'N/A' }}
                                @endif
                            </td>
                            <td>
                                @if (is_array($item))
                                    {{ $item['producto_sku'] ?? $item['sku'] ?? 'N/A' }}
                                @else
                                    {{ $item->producto?->sku ?? $item->sku ?? 'N/A' }}
                                @endif
                            </td>
                            <td>
                                @if (is_array($item))
                                    {{ $item['almacen_nombre'] ?? 'N/A' }}
                                @else
                                    {{ $item->almacen?->nombre ?? 'N/A' }}
                                @endif
                            </td>
                            <td class="number">{{ number_format($cantidad, 2, ',', '.') }}</td>
                            <td class="number">{{ number_format($disponible, 2, ',', '.') }}</td>
                            <td class="number">{{ number_format($reservado, 2, ',', '.') }}</td>
                            <td class="number">Bs. {{ number_format($precioUnitario, 2, ',', '.') }}</td>
                            <td class="number">Bs. {{ number_format($valorTotal, 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                    <tr style="background-color: #f0f0f0; font-weight: bold;">
                        <td colspan="7" style="text-align: right;">VALOR TOTAL DEL STOCK:</td>
                        <td class="number">Bs. {{ number_format($totalValor, 2, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>
        @else
            <div class="empty-message">
                ℹ️ No hay stock para mostrar con los filtros aplicados
            </div>
        @endif

        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema Distribuidora Paucara</p>
        </div>
    </div>
</body>
</html>
