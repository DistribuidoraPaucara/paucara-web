<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Stock Actual - A4</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4 landscape;
            margin: 8mm 8mm 12mm 8mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 8px;
            line-height: 1.2;
            color: #333;
        }

        /* Header */
        .header {
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 2px solid #1976d2;
        }

        .header-left h1 {
            font-size: 14px;
            color: #1976d2;
            margin: 0;
            font-weight: bold;
        }

        .header-left p {
            font-size: 8px;
            color: #666;
            margin: 2px 0 0 0;
        }

        /* Información de filtros */
        .filtros-info {
            background: #f0f4f8;
            padding: 4px 6px;
            margin-bottom: 6px;
            border-left: 3px solid #1976d2;
            font-size: 7px;
        }

        .filtros-info strong {
            color: #1976d2;
        }

        /* Tabla */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
            font-size: 7px;
        }

        table thead tr {
            background-color: #1976d2;
            color: white;
        }

        table th {
            padding: 4px 3px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #1565c0;
        }

        table th.numero {
            text-align: right;
        }

        table td {
            padding: 3px 3px;
            border: 1px solid #ddd;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: normal;
            max-width: 100%;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        table tbody tr {
            vertical-align: top;
        }

        /* Alineación de números */
        td.numero, th.numero {
            text-align: right;
        }

        /* Estilos de valores */
        .cantidad {
            font-weight: bold;
        }

        .precio {
            color: #1976d2;
            font-weight: bold;
        }

        /* Resumen */
        .resumen {
            margin-top: 8px;
            padding: 6px;
            background: #f0f4f8;
            border-left: 3px solid #1976d2;
            font-size: 7px;
        }

        .resumen-row {
            margin-bottom: 3px;
        }

        .resumen-label {
            font-weight: bold;
            display: inline-block;
            width: 60%;
        }

        .resumen-valor {
            text-align: right;
            color: #1976d2;
            font-weight: bold;
            display: inline-block;
            width: 40%;
        }

        /* Footer */
        .footer {
            margin-top: 8px;
            padding-top: 4px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 7px;
            color: #999;
        }

        /* Mensaje vacío */
        .empty-state {
            text-align: center;
            padding: 20px;
            color: #999;
        }

        /* Estilos de datos */
        .sku {
            color: #666;
            font-size: 7px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <h1>Reporte de Stock Actual</h1>
            <p>Inventario disponible por producto y almacén</p>
        </div>
        <div class="header-right" style="text-align: right; font-size: 8px;">
            <div style="font-weight: bold; margin-bottom: 3px;">{{ $empresa }}</div>
            <div style="margin-bottom: 3px;">Usuario: {{ $usuario }}</div>
            <div>Generado: {{ $fecha_generacion }}</div>
        </div>
    </div>

    <!-- Contenido -->
    @if(!empty($datos) && count($datos) > 0)
        @php
            // Obtener todos los tipos de precios únicos
            $tiposPrecios = [];
            $camposEstandar = ['id_producto', 'nombre', 'sku', 'marca', 'categoria', 'unidad', 'proveedor', 'stock_total', 'almacen', 'codigos_barra'];

            foreach($datos as $item) {
                foreach($item as $key => $value) {
                    if(!in_array($key, $camposEstandar) && is_numeric($value)) {
                        $tiposPrecios[$key] = true;
                    }
                }
            }
            $tiposPrecios = array_keys($tiposPrecios);
            sort($tiposPrecios);
        @endphp

        <!-- Info de filtros -->
        <div class="filtros-info">
            <strong>Total de registros:</strong> {{ count($datos) }} |
            <strong>Stock total:</strong> {{ number_format(collect($datos)->sum('stock_total'), 2) }} unidades
        </div>

        <!-- Tabla de Stock -->
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>SKU</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                    <th>Unidad</th>
                    <th>Proveedor</th>
                    <th class="numero">Stock</th>
                    <th>Almacén</th>
                    <th>Códigos Barra</th>
                    @foreach($tiposPrecios as $tipo)
                        <th class="numero">{{ $tipo }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($datos as $item)
                    <tr>
                        <td>{{ $item['id_producto'] ?? 'N/A' }}</td>
                        <td>{{ substr($item['nombre'] ?? 'N/A', 0, 16) }}</td>
                        <td class="sku">{{ $item['sku'] ?? '-' }}</td>
                        <td>{{ substr($item['marca'] ?? 'N/A', 0, 10) }}</td>
                        <td>{{ substr($item['categoria'] ?? 'N/A', 0, 10) }}</td>
                        <td>{{ substr($item['unidad'] ?? 'N/A', 0, 8) }}</td>
                        <td>{{ substr($item['proveedor'] ?? 'N/A', 0, 10) }}</td>
                        <td class="numero cantidad">{{ number_format($item['stock_total'] ?? 0, 2) }}</td>
                        <td>{{ substr($item['almacen'] ?? 'N/A', 0, 8) }}</td>
                        <td style="font-size: 6px;">{{ substr($item['codigos_barra'] ?? '-', 0, 12) }}</td>
                        @foreach($tiposPrecios as $tipo)
                            <td class="numero precio">{{ number_format($item[$tipo] ?? 0, 2) }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Resumen -->
        <div class="resumen">
            <div class="resumen-row">
                <span class="resumen-label">Total de registros:</span>
                <span class="resumen-valor">{{ count($datos) }}</span>
            </div>
            <div class="resumen-row">
                <span class="resumen-label">Stock total:</span>
                <span class="resumen-valor">{{ number_format(collect($datos)->sum('stock_total'), 2) }} unidades</span>
            </div>
        </div>

    @else
        <!-- Estado vacío -->
        <div class="empty-state">
            <p style="font-size: 14px; margin-bottom: 10px;">📭</p>
            <p>No hay datos disponibles para este reporte</p>
            <p style="font-size: 8px; color: #ccc; margin-top: 5px;">Intenta ajustar los filtros de búsqueda</p>
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <div class="footer-left">
            <strong>Distribuidora</strong> - Sistema de Inventario
        </div>
        <div class="footer-center">
            Página <span style="float: right;">{{ now()->format('d/m/Y H:i') }}</span>
        </div>
        <div class="footer-right">
            Confidencial
        </div>
    </div>
</body>
</html>
