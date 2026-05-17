<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Carga - Ticket 58mm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            font-size: 7px;
            line-height: 1.1;
            color: #000;
            width: 58mm;
            padding: 1.5mm;
        }

        .header {
            text-align: center;
            margin-bottom: 2mm;
            border-bottom: 1px dashed #000;
            padding-bottom: 1.5mm;
        }

        .empresa {
            font-weight: bold;
            font-size: 8px;
            margin-bottom: 0.5mm;
        }

        .titulo {
            font-weight: bold;
            font-size: 7px;
        }

        .numero {
            font-size: 6px;
        }

        .info-grid {
            margin: 1.5mm 0;
            font-size: 6.5px;
        }

        .info-item {
            margin-bottom: 0.5mm;
            display: flex;
            flex-wrap: wrap;
            gap: 1mm;
        }

        .label {
            font-weight: bold;
            min-width: 18mm;
        }

        .value {
            flex: 1;
            word-break: break-word;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 6px;
            margin: 1.5mm 0;
        }

        table thead {
            background-color: #f0f0f0;
        }

        table th {
            padding: 0.75mm;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #000;
            font-size: 6px;
        }

        table td {
            padding: 0.75mm;
            border-bottom: 1px solid #ddd;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .col-item {
            max-width: 18mm;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .col-cant {
            text-align: center;
            width: 10mm;
        }

        .resumen {
            background-color: #f5f5f5;
            padding: 1.5mm;
            margin: 1.5mm 0;
            border: 1px solid #ddd;
            font-size: 6.5px;
        }

        .resumen-item {
            margin-bottom: 0.5mm;
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
            margin-top: 2mm;
            padding-top: 1.5mm;
            border-top: 1px dashed #000;
            font-size: 6px;
            color: #666;
        }

        .separador {
            border: none;
            border-bottom: 1px dashed #000;
            margin: 1.5mm 0;
        }

        @media print {
            body {
                margin: 0;
                padding: 1.5mm;
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
        <div class="empresa">{{ substr($empresa?->nombre ?? 'DIST', 0, 20) }}</div>
        <div class="titulo">REPORTE CARGA</div>
        <div class="numero">#{{ $documento->numero_reporte }}</div>
    </div>

    <!-- Información Básica - Compacta -->
    <div class="info-grid">
        <div class="info-item">
            <span class="label">Fecha:</span>
            <span class="value">{{ $documento->fecha_generacion?->format('d/m/y') ?? 'N/A' }}</span>
        </div>
        <div class="info-item">
            <span class="label">Cliente:</span>
            <span class="value">{{ Str::limit($documento->entrega?->venta?->cliente?->nombre ?? 'N/A', 20) }}</span>
        </div>
        <div class="info-item">
            <span class="label">Vehículo:</span>
            <span class="value">{{ $documento->vehiculo?->placa ?? 'N/A' }}</span>
        </div>
        <div class="info-item">
            <span class="label">Chofer:</span>
            <span class="value">{{ Str::limit($documento->entrega?->chofer?->nombre ?? 'N/A', 18) }}</span>
        </div>
    </div>

    <hr class="separador">

    <!-- Tabla de Productos - Ultra compacta -->
    <table>
        <thead>
            <tr>
                <th class="col-item">Producto</th>
                <th class="col-cant">Cant.</th>
            </tr>
        </thead>
        <tbody>
            @forelse($documento->detalles as $detalle)
                <tr>
                    <td class="col-item">{{ Str::limit($detalle->producto?->nombre ?? 'Producto', 20) }}</td>
                    <td class="col-cant">{{ $detalle->cantidad_solicitada }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="2" style="text-align: center;">Sin productos</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Resumen - Mínimo -->
    <div class="resumen">
        <div class="resumen-item">
            <span class="resumen-label">Items:</span>
            <span class="resumen-value">{{ count($documento->detalles) }}</span>
        </div>
        <div class="resumen-item">
            <span class="resumen-label">Peso:</span>
            <span class="resumen-value">{{ number_format($documento->peso_total_kg ?? 0, 1) }} kg</span>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        {{ $documento->created_at?->format('d/m/Y H:i') ?? date('d/m/Y H:i') }}
    </div>
</body>
</html>
