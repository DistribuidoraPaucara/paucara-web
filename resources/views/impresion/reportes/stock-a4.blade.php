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
            font-size: 10px;
            color: #333;
            line-height: 1.2;
        }

        .container {
            max-width: 100%;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 16px;
            margin-bottom: 5px;
            color: #000;
        }

        .header p {
            font-size: 9px;
            color: #666;
            margin: 2px 0;
        }

        .filtros-info {
            background: #f0f0f0;
            padding: 8px 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            font-size: 9px;
            border-left: 4px solid #0066cc;
        }

        .filtros-info strong {
            color: #0066cc;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        thead {
            background-color: #003366;
            color: white;
            font-weight: bold;
        }

        th {
            padding: 8px;
            text-align: left;
            border: 1px solid #999;
            font-size: 9px;
        }

        td {
            padding: 6px 8px;
            border: 1px solid #ddd;
            font-size: 9px;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tbody tr:hover {
            background-color: #f0f0f0;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }

        .badge-almacen {
            background-color: #e3f2fd;
            color: #1565c0;
        }

        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #000;
            text-align: center;
            font-size: 8px;
            color: #666;
        }

        .summary {
            background-color: #f0f0f0;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
            text-align: right;
            font-weight: bold;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .page-break {
            page-break-after: always;
        }

        /* Para múltiples páginas */
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .page-break {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📦 REPORTE DE STOCK DE PRODUCTOS</h1>
            <p>{{ config('app.name') }}</p>
            <p>Generado: {{ now()->format('d/m/Y H:i:s') }}</p>
        </div>

        <!-- Información de Filtros -->
        @if(!empty($filtros['busqueda']) || !empty($filtros['almacen_id']) || $filtros['rango_stock'] !== 'todos' || $filtros['solo_con_stock'])
        <div class="filtros-info">
            <strong>✓ Filtros aplicados:</strong>
            @if(!empty($filtros['busqueda']))
            <br>• Búsqueda: <strong>{{ $filtros['busqueda'] }}</strong>
            @endif
            @if(!empty($filtros['almacen_id']))
            <br>• Almacén ID: <strong>{{ $filtros['almacen_id'] }}</strong>
            @endif
            @if($filtros['rango_stock'] !== 'todos')
            <br>• Rango de Stock: <strong>{{ ucfirst(str_replace('_', ' ', $filtros['rango_stock'])) }}</strong>
            @endif
            @if($filtros['solo_con_stock'])
            <br>• Solo productos con stock: <strong>Sí (≥ 1)</strong>
            @endif
        </div>
        @endif

        <!-- Tabla de Stock -->
        @if(count($datos) > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 20%;">Almacén</th>
                    <th style="width: 25%;">Producto</th>
                    <th style="width: 8%;">SKU</th>
                    <th style="width: 10%; text-align: right;">Stock Total</th>
                    <th style="width: 10%; text-align: right;">Disponible</th>
                    <th style="width: 10%; text-align: right;">Reservado</th>
                    <th style="width: 12%; text-align: right;">Precio Unit.</th>
                    <th style="width: 12%; text-align: right;">Valor Total</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $totalValor = 0;
                    $totalCantidad = 0;
                @endphp
                @foreach($datos as $item)
                @php
                    $valorItem = ($item['cantidad'] ?? 0) * ($item['precio_venta'] ?? 0);
                    $totalValor += $valorItem;
                    $totalCantidad += ($item['cantidad'] ?? 0);
                @endphp
                <tr>
                    <td>
                        <span class="badge badge-almacen">{{ $item['almacen'] ?? '-' }}</span>
                    </td>
                    <td>
                        <strong>{{ $item['nombre_producto'] ?? '-' }}</strong>
                        @if(!empty($item['codigo_barras']))
                        <br><small style="color: #999;">Código: {{ $item['codigo_barras'] }}</small>
                        @endif
                    </td>
                    <td>{{ $item['sku'] ?? '-' }}</td>
                    <td class="text-right">
                        <strong>{{ number_format($item['cantidad'] ?? 0, 2) }}</strong>
                    </td>
                    <td class="text-right" style="color: #27ae60;">
                        {{ number_format($item['cantidad_disponible'] ?? 0, 2) }}
                    </td>
                    <td class="text-right" style="color: #f39c12;">
                        {{ number_format($item['cantidad_reservada'] ?? 0, 2) }}
                    </td>
                    <td class="text-right">
                        Bs {{ number_format($item['precio_venta'] ?? 0, 2) }}
                    </td>
                    <td class="text-right">
                        <strong>Bs {{ number_format($valorItem, 2) }}</strong>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Resumen -->
        <div class="summary">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>📊 Total de Registros: <strong>{{ count($datos) }}</strong></span>
                <span>📦 Cantidad Total: <strong>{{ number_format($totalCantidad, 2) }}</strong></span>
                <span>💰 Valor Total: <strong>Bs {{ number_format($totalValor, 2) }}</strong></span>
            </div>
        </div>

        @else
        <div class="empty-state">
            <p>⚠️ No hay registros que coincidan con los filtros seleccionados.</p>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema de inventario.</p>
            <p>Para más información o reportes adicionales, contacte al administrador del sistema.</p>
        </div>
    </div>
</body>
</html>
