<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Movimientos</title>
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
            <h1>📦 Reporte de Movimientos de Inventario</h1>
            <p>Distribuidora Paucara</p>
        </div>

        <div class="info-row">
            <span><strong>Total de Movimientos:</strong> {{ count($movimientos ?? []) }}</span>
            <span><strong>Generado:</strong> {{ $fecha_generacion ?? now()->format('d/m/Y H:i') }}</span>
        </div>

        @if (count($movimientos ?? []) > 0)
            <div class="section-title">📋 Detalle de Movimientos</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Almacén</th>
                        <th>Tipo</th>
                        <th class="number">Cantidad</th>
                        <th>Usuario</th>
                        <th>Documento</th>
                        <th>Fecha</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($movimientos as $movimiento)
                        @php
                            // Handle both array and object data structures
                            $id = is_array($movimiento) ? ($movimiento['id'] ?? '') : ($movimiento->id ?? '');

                            // Product name - can be nested in stockProducto
                            if (is_array($movimiento)) {
                                $productName = $movimiento['stockProducto']['producto']['nombre'] ?? 'N/A';
                                $almacenName = $movimiento['stockProducto']['almacen']['nombre'] ?? 'N/A';
                            } else {
                                $productName = $movimiento->stockProducto?->producto?->nombre ?? 'N/A';
                                $almacenName = $movimiento->stockProducto?->almacen?->nombre ?? 'N/A';
                            }

                            // Type
                            $tipo = 'N/A';
                            if (is_array($movimiento)) {
                                if (!empty($movimiento['tipo'])) {
                                    $tipo = $movimiento['tipo'];
                                } elseif (!empty($movimiento['tipoAjusteInventario'])) {
                                    $tipo = is_array($movimiento['tipoAjusteInventario'])
                                        ? ($movimiento['tipoAjusteInventario']['label'] ?? 'N/A')
                                        : $movimiento['tipoAjusteInventario']->label;
                                }
                            } else {
                                $tipo = $movimiento->tipo ?? ($movimiento->tipoAjusteInventario?->label ?? 'N/A');
                            }

                            // Quantity
                            $cantidad = is_array($movimiento) ? ($movimiento['cantidad'] ?? 0) : ($movimiento->cantidad ?? 0);

                            // User
                            if (is_array($movimiento)) {
                                $usuario = is_array($movimiento['user'] ?? null)
                                    ? ($movimiento['user']['name'] ?? 'N/A')
                                    : ($movimiento['user']->name ?? 'N/A');
                            } else {
                                $usuario = $movimiento->user?->name ?? 'N/A';
                            }

                            // Document
                            $documento = is_array($movimiento)
                                ? ($movimiento['numero_documento'] ?? 'N/A')
                                : ($movimiento->numero_documento ?? 'N/A');

                            // Date
                            if (is_array($movimiento)) {
                                $fecha = $movimiento['created_at'] ?? null;
                                if ($fecha && is_string($fecha)) {
                                    $fecha = \Carbon\Carbon::parse($fecha)->format('d/m/Y H:i');
                                } else {
                                    $fecha = 'N/A';
                                }
                            } else {
                                $fecha = $movimiento->created_at?->format('d/m/Y H:i') ?? 'N/A';
                            }

                            // Observations
                            $observaciones = is_array($movimiento)
                                ? ($movimiento['observaciones'] ?? '')
                                : ($movimiento->observaciones ?? '');
                        @endphp
                        <tr>
                            <td>{{ $id }}</td>
                            <td>{{ $productName }}</td>
                            <td>{{ $almacenName }}</td>
                            <td>{{ $tipo }}</td>
                            <td class="number">{{ number_format($cantidad, 2, ',', '.') }}</td>
                            <td>{{ $usuario }}</td>
                            <td>{{ $documento }}</td>
                            <td>{{ $fecha }}</td>
                            <td>{{ mb_substr($observaciones, 0, 30) }}{{ strlen($observaciones) > 30 ? '...' : '' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty-message">
                ℹ️ No hay movimientos para mostrar con los filtros aplicados
            </div>
        @endif

        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema Distribuidora Paucara</p>
        </div>
    </div>
</body>
</html>
