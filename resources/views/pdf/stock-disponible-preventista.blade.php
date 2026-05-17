<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Disponible</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #333;
            line-height: 1.3;
        }

        .container {
            max-width: 100%;
            padding: 15px;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #003366;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 16px;
            margin-bottom: 3px;
            color: #003366;
            font-weight: bold;
        }

        .header p {
            font-size: 12px;
            color: #666;
            margin: 1px 0;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: #666;
            margin-top: 2px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        thead {
            background-color: #003366;
            color: white;
            font-weight: bold;
        }

        th {
            padding: 6px;
            text-align: left;
            border: 1px solid #999;
            font-size: 16px;
        }

        th.text-right {
            text-align: right;
            padding-right: 8px;
        }

        td {
            padding: 5px 6px;
            border: 1px solid #ddd;
            font-size: 16px;
        }

        td.text-right {
            text-align: right;
            padding-right: 8px;
        }

        tbody tr:nth-child(even) {
            background-color: #f5f5f5;
        }

        tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        .nombre {
            font-weight: 600;
            color: #1a1a1a;
        }

        .sku {
            color: #666;
            font-family: monospace;
            font-size: 16px;
        }

        .precio-venta {
            font-weight: bold;
            color: #003366;
        }

        .precio-descuento {
            color: #27ae60;
        }

        .precio-especial {
            color: #e74c3c;
        }

        .stock-disponible {
            font-weight: bold;
            color: #2980b9;
            background-color: #f0f8ff;
            padding: 5px 8px;
            border-radius: 3px;
            text-align: center;
        }

        .precio-null {
            color: #999;
            font-style: italic;
        }

        .footer {
            margin-top: 15px;
            padding-top: 8px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 14px;
            color: #999;
        }

        .summary {
            background-color: #f0f0f0;
            padding: 8px;
            margin: 10px 0;
            border-radius: 3px;
            text-align: right;
            font-weight: bold;
            font-size: 14px;
            border-left: 4px solid #003366;
        }

        .empty-state {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 14px;
        }

        .page-break {
            page-break-after: always;
        }

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
            <h1>LISTADO DE STOCK DISPONIBLE</h1>
            <p>{{ $empresa }}</p>
            <div class="info-row">
                <span>Generado: {{ $fecha_generacion }}</span>
                <span>Total de Productos: <strong>{{ $total_productos }}</strong></span>
            </div>
        </div>

        <!-- Tabla de Stock -->
        @if(count($filas) > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">N°</th>
                    <th style="width: @if($incluir_stock ?? false) 25% @else 30% @endif;">Nombre del Producto</th>
                    {{-- <th style="width: 10%;">SKU</th> --}}
                    <th style="width: @if($incluir_stock ?? false) 11% @else 13% @endif; text-align: right;">Precio Venta</th>
                    <th style="width: @if($incluir_stock ?? false) 11% @else 13% @endif; text-align: right;">Precio Descuento</th>
                    <th style="width: @if($incluir_stock ?? false) 11% @else 13% @endif; text-align: right;">Precio Especial</th>
                    @if($incluir_stock ?? false)
                    <th style="width: 12%; text-align: center;">Stock</th>
                    @endif
                </tr>
            </thead>
            <tbody>
                @php
                $numero = 1;
                @endphp
                @foreach($filas as $fila)
                <tr>
                    <td>{{ $numero }}</td>
                    <td class="nombre">{{ $fila['nombre'] }}</td>
                    {{-- <td class="sku">{{ $fila['sku'] }}</td> --}}
                    <td class="text-right precio-venta">
                        @if($fila['precio_venta'])
                        Bs {{ number_format($fila['precio_venta'], 2) }}
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>
                    <td class="text-right precio-descuento">
                        @if($fila['precio_descuento'])
                        Bs {{ number_format($fila['precio_descuento'], 2) }}
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>
                    <td class="text-right precio-especial">
                        @if($fila['precio_especial'])
                        Bs {{ number_format($fila['precio_especial'], 2) }}
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>
                    @if($incluir_stock ?? false)
                    <td class="stock-disponible">
                        {{ number_format($fila['stock_disponible'], 2) }}
                    </td>
                    @endif
                </tr>
                @php
                $numero++;
                @endphp
                @endforeach
            </tbody>
        </table>

        <!-- Resumen -->
        <div class="summary">
            ✓ Listado de {{ $total_productos }} productos con stock disponible (cantidad > 0)
        </div>

        @else
        <div class="empty-state">
            <p>⚠️ No hay productos con stock disponible en este momento.</p>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema.</p>
            <p>Solo muestra productos con cantidad disponible mayor a 0.</p>
        </div>
    </div>
</body>
</html>
