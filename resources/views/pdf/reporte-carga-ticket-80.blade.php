<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Carga - Ticket 80mm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 1.2;
            color: #000;
            width: 80mm;
            padding: 2mm;
        }

        .header {
            text-align: center;
            margin-bottom: 3mm;
            border-bottom: 1px dashed #000;
            padding-bottom: 2mm;
        }

        .empresa {
            font-weight: bold;
            font-size: 9px;
            margin-bottom: 1mm;
        }

        .titulo {
            font-weight: bold;
            font-size: 8px;
        }

        .numero {
            font-size: 7px;
        }

        .info-grid {
            margin: 2mm 0;
        }

        .info-item {
            margin-bottom: 1mm;
            display: flex;
            flex-wrap: wrap;
            gap: 2mm;
        }

        .label {
            font-weight: bold;
            min-width: 30mm;
        }

        .value {
            flex: 1;
            word-break: break-word;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7px;
            margin: 2mm 0;
        }

        table thead {
            background-color: #f0f0f0;
        }

        table th {
            padding: 1mm;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #000;
            font-size: 7px;
        }

        table td {
            padding: 1mm;
            border-bottom: 1px solid #ddd;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .col-item {
            max-width: 25mm;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .col-cant {
            text-align: center;
            width: 12mm;
        }

        .col-check {
            text-align: center;
            width: 8mm;
        }

        .resumen {
            background-color: #f5f5f5;
            padding: 2mm;
            margin: 2mm 0;
            border: 1px solid #ddd;
            font-size: 8px;
        }

        .resumen-item {
            margin-bottom: 1mm;
            display: flex;
            justify-content: space-between;
        }

        .resumen-label {
            font-weight: bold;
        }

        .resumen-value {
            font-weight: bold;
        }

        .footer {
            text-align: center;
            margin-top: 3mm;
            padding-top: 2mm;
            border-top: 1px dashed #000;
            font-size: 7px;
            color: #666;
        }

        .separador {
            border: none;
            border-bottom: 1px dashed #000;
            margin: 2mm 0;
        }

        @media print {
            body {
                margin: 0;
                padding: 2mm;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="empresa">{{ $empresa?->nombre ?? 'DISTRIBUIDORA' }}</div>
        <div class="titulo">REPORTE DE CARGA</div>
        <div class="numero">#{{ $documento->numero_reporte }}</div>
    </div>

    <!-- Información Básica -->
    <div class="info-grid">
        <div class="info-item">
            <span class="label">Fecha:</span>
            <span class="value">{{ $documento->fecha_generacion?->format('d/m/Y H:i') ?? 'N/A' }}</span>
        </div>
        <div class="info-item">
            <span class="label">Entrega:</span>
            <span class="value">#{{ $documento->entrega?->id ?? 'N/A' }}</span>
        </div>
        <div class="info-item">
            <span class="label">Cliente:</span>
            <span class="value">{{ Str::limit($documento->entrega?->venta?->cliente?->nombre ?? 'N/A', 30) }}</span>
        </div>
        <div class="info-item">
            <span class="label">Vehículo:</span>
            <span class="value">{{ $documento->vehiculo?->placa ?? 'N/A' }}</span>
        </div>
        <div class="info-item">
            <span class="label">Chofer:</span>
            <span class="value">{{ Str::limit($documento->entrega?->chofer?->nombre ?? 'N/A', 25) }}</span>
        </div>
    </div>

    <hr class="separador">

    <!-- Tabla de Productos -->
    <table>
        <thead>
            <tr>
                <th class="col-item">Producto</th>
                <th class="col-cant">Cant.</th>
                <th class="col-check">✓</th>
            </tr>
        </thead>
        <tbody>
            @forelse($documento->detalles as $detalle)
                <tr>
                    <td class="col-item">{{ Str::limit($detalle->producto?->nombre ?? 'Producto desconocido', 25) }}</td>
                    <td class="col-cant">{{ $detalle->cantidad_solicitada }}</td>
                    <td class="col-check">☐</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" style="text-align: center;">Sin productos</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Resumen -->
    <div class="resumen">
        <div class="resumen-item">
            <span class="resumen-label">Total Items:</span>
            <span class="resumen-value">{{ count($documento->detalles) }}</span>
        </div>
        <div class="resumen-item">
            <span class="resumen-label">Peso Total:</span>
            <span class="resumen-value">{{ number_format($documento->peso_total_kg ?? 0, 2) }} kg</span>
        </div>
        @if($documento->volumen_total_m3)
            <div class="resumen-item">
                <span class="resumen-label">Volumen:</span>
                <span class="resumen-value">{{ number_format($documento->volumen_total_m3, 2) }} m³</span>
            </div>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <div>{{ $documento->created_at?->format('d/m/Y H:i:s') ?? date('d/m/Y H:i:s') }}</div>
        <div style="margin-top: 1mm; font-size: 6px;">Documento generado automáticamente</div>
    </div>
</body>
</html>
