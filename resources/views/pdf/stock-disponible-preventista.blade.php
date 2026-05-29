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
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 32px;
            color: #333;
            line-height: 1.1;
        }

        .container {
            max-width: 100%;
            padding: 5px;
        }

        .header {
            text-align: center;
            margin-bottom: 6px;
            border-bottom: 1px solid #003366;
            padding-bottom: 4px;
        }

        .header h1 {
            font-size: 32px;
            margin-bottom: 1px;
            color: #003366;
            font-weight: bold;
        }

        .header p {
            font-size: 32px;
            color: #666;
            margin: 0;
        }

        .info-row {
            font-size: 32px;
            color: #666;
            margin-top: 1px;
        }

        .info-row span {
            display: inline;
            margin-right: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
            font-size: 32px;
        }

        thead {
            background-color: #003366;
            color: white;
            font-weight: bold;
        }

        th {
            padding: 3px 3px;
            text-align: left;
            border: 1px solid #999;
            font-size: 32px;
        }

        th.text-right {
            text-align: right;
            padding-right: 3px;
        }

        td {
            padding: 6px 6px !important;
            border: 1px solid #999;
            font-size: 32px;
        }

        td.text-right {
            text-align: right;
            padding-right: 6px !important;
        }

        /* Override padding para todas las celdas */
        tbody td {
            padding: 6px 6px !important;
        }

        tbody td.precio-venta,
        tbody td.precio-descuento,
        tbody td.precio-especial {
            padding: 6px 6px !important;
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
            font-size: 32px;
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
            padding: 2px 4px;
            border-radius: 2px;
            text-align: center;
            font-size: 32px;
        }

        .precio-null {
            color: #999;
            font-style: italic;
        }

        /* Filas con rango de precios - color diferenciado */
        tr.con-rangos {
            background-color: #fff9e6 !important;
        }

        tr.con-rangos td {
            background-color: #fff9e6 !important;
        }

        .rangos-row {
            background-color: #fff9e6 !important;
            border-top: 1px solid #ddd !important;
        }

        .rangos-cell {
            padding: 2px 3px !important;
            font-size: 12px;
            color: #C45E3F;
        }

        .rangos-titulo {
            font-weight: bold;
            color: #003366;
            font-size: 12px;
            margin-bottom: 1px;
            display: block;
        }

        .precio-principal {
            display: block;
            font-weight: bold;
            margin-bottom: 2px;
            padding-bottom: 1px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .rangos-contenedor {
            font-size: 11px;
            margin-top: 2px;
            margin-bottom: 2px;
            padding: 2px 3px;
            border: 1px solid #eee;
            border-radius: 3px;
        }

        .rango-item {
            font-size: 11px;
            padding: 0px;
            line-height: 1;
        }

        .rango-cantidad {
            color: #666;
            font-size: 32px;
            display: inline-block;
            min-width: 35px;
        }

        .rango-precio {
            color: #003366;
            font-weight: 600;
            text-align: right;
            display: inline-block;
            min-width: 40px;
            font-size: 32px;
        }

        .footer {
            margin-top: 4px;
            padding-top: 3px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 32px;
            color: #999;
        }

        .summary {
            background-color: #f0f0f0;
            padding: 3px;
            margin: 4px 0;
            border-radius: 2px;
            text-align: right;
            font-weight: bold;
            font-size: 32px;
            border-left: 3px solid #003366;
        }

        .empty-state {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 32px;
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
                <span>Total: <strong>{{ $total_productos }}</strong></span>
            </div>
        </div>

        <!-- Tabla de Stock -->
        @if(count($filas) > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 4%;">N°</th>
                    <th style="width: @if($incluir_stock ?? false) 28% @else 28% @endif;">Nombre del Producto</th>
                    <th style="width: @if($incluir_stock ?? false) 15% @else 20% @endif;">Precio Venta</th>
                    <th style="width: @if($incluir_stock ?? false) 15% @else 20% @endif;">Precio Descuento</th>
                    <th style="width: @if($incluir_stock ?? false) 15% @else 20% @endif;">Precio Especial</th>
                    @if($incluir_stock ?? false)
                    <th style="width: 15%; text-align: center;">Stock</th>
                    @endif
                </tr>
            </thead>
            <tbody>
                @php
                $numero = 1;
                @endphp
                @foreach($filas as $fila)
                @php
                $tieneRangos = (count($fila['rangos_venta'] ?? []) > 0) ||
                (count($fila['rangos_descuento'] ?? []) > 0) ||
                (count($fila['rangos_especial'] ?? []) > 0);
                @endphp
                <tr @if($tieneRangos) class="con-rangos" @endif>
                    <td>{{ $numero }}</td>
                    <td class="nombre">{{ $fila['nombre'] }}</td>

                    {{-- CELDA PRECIO VENTA CON RANGOS --}}
                    <td class="precio-venta">
                        @if($fila['precio_venta'])
                        <span class="precio-principal">Bs <strong style="font-size: 36px;">{{ number_format($fila['precio_venta'], 2) }}</strong></span>
                        @php $rangosVenta = $fila['rangos_venta'] ?? []; @endphp
                        @if(count($rangosVenta) > 0)
                        <div class="rangos-contenedor">
                            @foreach($rangosVenta as $rv)
                            <div style="font-size: 28px;">Rango: <strong style="font-size: 36px;">{{ $rv['rango_texto'] }} </strong> unidad</div>
                            @endforeach
                        </div>
                        @endif
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>

                    {{-- CELDA PRECIO DESCUENTO CON RANGOS --}}
                    <td class="precio-descuento">
                        @if($fila['precio_descuento'])
                        <span class="precio-principal">Bs <strong style="font-size: 36px;">{{ number_format($fila['precio_descuento'], 2) }}</strong></span>
                        @php $rangosDesc = $fila['rangos_descuento'] ?? []; @endphp
                        @if(count($rangosDesc) > 0)
                        <div class="rangos-contenedor">
                            @foreach($rangosDesc as $rd)
                            <div style="font-size: 28px;">Rango: <strong style="font-size: 36px;">{{ $rd['rango_texto'] }} </strong> unidad</div>
                            @endforeach
                        </div>
                        @endif
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>

                    {{-- CELDA PRECIO ESPECIAL CON RANGOS --}}
                    <td class="precio-especial">
                        @if($fila['precio_especial'])
                        <span class="precio-principal">Bs <strong style="font-size: 36px;">{{ number_format($fila['precio_especial'], 2) }}</strong></span>
                        @php $rangosEsp = $fila['rangos_especial'] ?? []; @endphp
                        @if(count($rangosEsp) > 0)
                        <div class="rangos-contenedor">
                            @foreach($rangosEsp as $re)
                            <div style="font-size: 28px;">Rango: <strong style="font-size: 36px;">{{ $re['rango_texto'] }} </strong> unidad</div>
                            @endforeach
                        </div>
                        @endif
                        @else
                        <span class="precio-null">-</span>
                        @endif
                    </td>

                    @if($incluir_stock ?? false)
                    <td class="stock-disponible">
                        <strong style="font-size: 36px;"></strong>{{ number_format($fila['stock_disponible'], 2) }}</strong>
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
            ✓ Listado de {{ $total_productos }} productos
        </div>

        @else
        <div class="empty-state">
            <p>⚠️ No hay productos con stock.</p>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Generado automáticamente. Solo muestra productos con cantidad > 0.</p>
        </div>
    </div>
</body>
</html>
