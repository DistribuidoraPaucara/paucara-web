<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Carga</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 210mm;
            height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 10px;
            color: #666;
        }

        .reporte-numero {
            text-align: right;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            background-color: #f0f0f0;
            padding: 5px 8px;
            font-weight: bold;
            border-left: 3px solid #333;
            margin-bottom: 8px;
            font-size: 11px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-weight: bold;
            font-size: 10px;
            color: #555;
            margin-bottom: 2px;
        }

        .info-value {
            font-size: 11px;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 10px;
        }

        table thead {
            background-color: #e0e0e0;
        }

        table th {
            padding: 6px 4px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #999;
            font-size: 9px;
        }

        table td {
            padding: 6px 4px;
            border: 1px solid #ddd;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .resumen {
            background-color: #f5f5f5;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
        }

        .resumen-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            margin-top: 8px;
        }

        .resumen-item {
            text-align: center;
        }

        .resumen-label {
            font-size: 9px;
            color: #666;
            margin-bottom: 2px;
        }

        .resumen-value {
            font-size: 13px;
            font-weight: bold;
            color: #000;
        }

        .footer {
            position: absolute;
            bottom: 15mm;
            width: calc(210mm - 30mm);
            border-top: 1px solid #ddd;
            padding-top: 10px;
            font-size: 9px;
            color: #666;
            text-align: center;
        }

        .firmas {
            margin-top: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
        }

        .firma-box {
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 5px;
            font-size: 9px;
        }

        .observaciones {
            background-color: #fffbea;
            border: 1px solid #ffd700;
            padding: 8px;
            margin: 10px 0;
            font-size: 10px;
            border-radius: 3px;
        }

        @media print {
            .no-print {
                display: none;
            }

            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Encabezado -->
        <div class="header">
            <h1>📋 REPORTE DE CARGA</h1>
            <p>Documento administrativo para control de carga de productos</p>
        </div>

        <div class="reporte-numero">
            Reporte #{{ $documento->numero_reporte }}
        </div>

        <!-- Información General -->
        <div class="section">
            <div class="section-title">INFORMACIÓN GENERAL</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Fecha de Generación:</span>
                    <span class="info-value">{{ $documento->fecha_generacion?->format('d/m/Y H:i') ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Generado por:</span>
                    <span class="info-value">{{ $documento->generador?->name ?? 'Sistema' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estado:</span>
                    <span class="info-value"><strong>{{ $documento->estado }}</strong></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Entrega:</span>
                    <span class="info-value">#{{ $documento->entrega->numero ?? $documento->entrega_id }}</span>
                </div>
            </div>
        </div>

        <!-- Información de Entrega -->
        <div class="section">
            <div class="section-title">INFORMACIÓN DE ENTREGA</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Cliente:</span>
                    <span class="info-value">{{ $documento->entrega?->venta?->cliente?->nombre ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Venta:</span>
                    <span class="info-value">#{{ $documento->entrega?->venta?->numero ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Vehículo:</span>
                    <span class="info-value">
                        <strong>{{ $documento->vehiculo?->placa ?? 'N/A' }}</strong>
                        ({{ $documento->vehiculo?->marca ?? '' }} {{ $documento->vehiculo?->modelo ?? '' }})
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Chofer:</span>
                    <span class="info-value">{{ $documento->entrega?->chofer?->nombre ?? 'N/A' }}</span>
                </div>
            </div>
        </div>

        <!-- Detalle de Productos -->
        <div class="section">
            <div class="section-title">DETALLE DE PRODUCTOS A CARGAR</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">Item</th>
                        <th style="width: 40%;">Producto</th>
                        <th style="width: 15%;" class="text-center">Cantidad</th>
                        <th style="width: 15%;" class="text-center">Cargada</th>
                        <th style="width: 15%;" class="text-center">Diferencia</th>
                        <th style="width: 10%;" class="text-center">✓</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($documento->detalles as $index => $detalle)
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td>{{ $detalle->producto?->nombre ?? 'Producto desconocido' }}</td>
                            <td class="text-center"><strong>{{ $detalle->cantidad_solicitada }}</strong></td>
                            <td class="text-center">_______</td>
                            <td class="text-center">_______</td>
                            <td class="text-center">☐</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center">No hay productos en este reporte</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Resumen de Carga -->
        <div class="section">
            <div class="section-title">RESUMEN DE CARGA</div>
            <div class="resumen">
                <div class="resumen-grid">
                    <div class="resumen-item">
                        <div class="resumen-label">Total Productos</div>
                        <div class="resumen-value">{{ count($documento->detalles) }}</div>
                    </div>
                    <div class="resumen-item">
                        <div class="resumen-label">Peso Total (kg)</div>
                        <div class="resumen-value">{{ number_format($documento->peso_total_kg ?? 0, 2) }}</div>
                    </div>
                    <div class="resumen-item">
                        <div class="resumen-label">Volumen (m³)</div>
                        <div class="resumen-value">{{ number_format($documento->volumen_total_m3 ?? 0, 2) }}</div>
                    </div>
                    <div class="resumen-item">
                        <div class="resumen-label">% Cargado</div>
                        <div class="resumen-value">{{ $documento->porcentaje_cargado ?? 0 }}%</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Observaciones -->
        @if($documento->descripcion)
            <div class="observaciones">
                <strong>📝 Observaciones:</strong><br>
                {{ $documento->descripcion }}
            </div>
        @endif

        <!-- Firmas -->
        <div class="firmas">
            <div class="firma-box">
                <span>Generado por</span>
            </div>
            <div class="firma-box">
                <span>Responsable de Carga</span>
            </div>
            <div class="firma-box">
                <span>Chofer</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Documento generado automáticamente | {{ $documento->created_at?->format('d/m/Y H:i:s') ?? date('d/m/Y H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
