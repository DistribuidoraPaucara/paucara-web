<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Compras</title>
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
            <h1>🛒 Reporte de Compras</h1>
            <p>Distribuidora Paucara</p>
        </div>

        <div class="info-row">
            <span><strong>Total de Compras:</strong> {{ count($compras ?? []) }}</span>
            <span><strong>Generado:</strong> {{ $fecha_generacion ?? now()->format('d/m/Y H:i') }}</span>
        </div>

        @php
            $totalMonto = 0;
            if (is_array($compras) || $compras instanceof \Illuminate\Support\Collection) {
                foreach ($compras as $compra) {
                    $totalMonto += isset($compra['total']) ? (float)$compra['total'] : (isset($compra->total) ? (float)$compra->total : 0);
                }
            }
        @endphp

        <table class="totales">
            <tr>
                <td colspan="4">
                    <span class="total-label">Monto Total de Compras</span>
                    <span class="total-value">Bs. {{ number_format($totalMonto, 2, ',', '.') }}</span>
                </td>
            </tr>
        </table>

        @if (count($compras ?? []) > 0)
            <div class="section-title">📋 Detalle de Compras</div>
            <table>
                <thead>
                    <tr>
                        <th>Compra #</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th class="number">Subtotal</th>
                        <th class="number">Impuesto</th>
                        <th class="number">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($compras as $compra)
                        <tr>
                            <td>
                                @if (is_array($compra))
                                    {{ $compra['numero'] ?? $compra['id'] ?? 'N/A' }}
                                @else
                                    {{ $compra->numero ?? $compra->id ?? 'N/A' }}
                                @endif
                            </td>
                            <td>
                                @if (is_array($compra))
                                    @if (is_array($compra['proveedor'] ?? null))
                                        {{ $compra['proveedor']['nombre'] ?? 'N/A' }}
                                    @elseif (isset($compra['proveedor']) && is_object($compra['proveedor']))
                                        {{ $compra['proveedor']->nombre ?? 'N/A' }}
                                    @else
                                        N/A
                                    @endif
                                @else
                                    {{ $compra->proveedor?->nombre ?? 'N/A' }}
                                @endif
                            </td>
                            <td>
                                @if (is_array($compra))
                                    @php
                                        $fecha = $compra['created_at'] ?? ($compra['fecha'] ?? null);
                                        if ($fecha && is_string($fecha)) {
                                            echo \Carbon\Carbon::parse($fecha)->format('d/m/Y');
                                        } elseif ($fecha && is_object($fecha)) {
                                            echo $fecha->format('d/m/Y');
                                        } else {
                                            echo 'N/A';
                                        }
                                    @endphp
                                @else
                                    {{ $compra->created_at?->format('d/m/Y') ?? 'N/A' }}
                                @endif
                            </td>
                            <td>
                                @if (is_array($compra))
                                    @if (is_array($compra['estado'] ?? null))
                                        {{ $compra['estado']['nombre'] ?? 'N/A' }}
                                    @elseif (isset($compra['estado']) && is_object($compra['estado']))
                                        {{ $compra['estado']->nombre ?? 'N/A' }}
                                    @else
                                        {{ $compra['estado'] ?? 'N/A' }}
                                    @endif
                                @else
                                    {{ $compra->estado?->nombre ?? $compra->estado ?? 'N/A' }}
                                @endif
                            </td>
                            <td class="number">
                                Bs. {{ number_format(is_array($compra) ? ($compra['subtotal'] ?? 0) : ($compra->subtotal ?? 0), 2, ',', '.') }}
                            </td>
                            <td class="number">
                                Bs. {{ number_format(is_array($compra) ? ($compra['impuesto'] ?? 0) : ($compra->impuesto ?? 0), 2, ',', '.') }}
                            </td>
                            <td class="number">
                                Bs. {{ number_format(is_array($compra) ? ($compra['total'] ?? 0) : ($compra->total ?? 0), 2, ',', '.') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty-message">
                ℹ️ No hay compras para mostrar con los filtros aplicados
            </div>
        @endif

        <div class="footer">
            <p>Este reporte fue generado automáticamente por el sistema Distribuidora Paucara</p>
        </div>
    </div>
</body>
</html>
