<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Venta de Prestables {{ $documento->numero_venta }}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }

        .header p {
            margin: 5px 0;
            color: #666;
        }

        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .info-block {
            width: 48%;
        }

        .info-block h3 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        .info-block p {
            margin: 3px 0;
            font-size: 11px;
        }

        .label {
            font-weight: bold;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table thead {
            background-color: #f0f0f0;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
        }

        table th {
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
        }

        table td {
            padding: 8px 10px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
        }

        table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totals-section {
            margin-top: 20px;
            float: right;
            width: 200px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
        }

        .total-row.grand-total {
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
            padding: 10px 0;
        }

        .observaciones {
            clear: both;
            margin-top: 30px;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 3px solid #007bff;
        }

        .observaciones h4 {
            margin-top: 0;
            font-size: 12px;
            color: #333;
        }

        .observaciones p {
            margin: 5px 0;
            font-size: 11px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
        }

        .status-confirmada {
            background-color: #d4edda;
            color: #155724;
        }

        .status-borrador {
            background-color: #fff3cd;
            color: #856404;
        }

        .status-cancelada {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>🛒 VENTA DE PRESTABLES</h1>
        <p><strong>{{ config('app.name') }}</strong></p>
    </div>

    <!-- Información General -->
    <div class="info-section">
        <div class="info-block">
            <h3>Información de la Venta</h3>
            <p><span class="label">Número:</span> {{ $documento->numero_venta }}</p>
            <p><span class="label">Fecha:</span> {{ $documento->fecha_venta->format('d/m/Y H:i') }}</p>
            <p><span class="label">Estado:</span>
                <span class="status-badge status-{{ strtolower($documento->estado) }}">
                    {{ $documento->estado }}
                </span>
            </p>
            @if($documento->estado === 'CONFIRMADA')
                <p><span class="label">Confirmada:</span> {{ $documento->fecha_confirmacion?->format('d/m/Y H:i') }}</p>
            @endif
        </div>

        <div class="info-block">
            <h3>Información Comercial</h3>
            @if($documento->cliente)
                <p><span class="label">Cliente:</span> {{ $documento->cliente->nombre }}</p>
            @else
                <p><span class="label">Cliente:</span> (Sin cliente)</p>
            @endif
            <p><span class="label">Usuario:</span> {{ $documento->usuario->name }}</p>
        </div>
    </div>

    <!-- Tabla de Detalles -->
    <table>
        <thead>
            <tr>
                <th>Prestable</th>
                <th class="text-center">Almacén</th>
                <th class="text-center">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($documento->detalles as $detalle)
                <tr>
                    <td>
                        <strong>{{ $detalle->prestable->nombre }}</strong><br>
                        <small>{{ $detalle->prestable->codigo }}</small>
                    </td>
                    <td class="text-center">{{ $detalle->almacen->nombre }}</td>
                    <td class="text-center">{{ $detalle->cantidad }}</td>
                    <td class="text-right">${{ number_format($detalle->precio_unitario, 2) }}</td>
                    <td class="text-right"><strong>${{ number_format($detalle->subtotal, 2) }}</strong></td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Sin detalles</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Totales -->
    <div class="totals-section">
        <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span>${{ number_format($documento->total, 2) }}</span>
        </div>
    </div>

    <!-- Observaciones -->
    @if($documento->observaciones)
        <div class="observaciones">
            <h4>Observaciones:</h4>
            <p>{{ $documento->observaciones }}</p>
        </div>
    @endif

    @if($documento->estado === 'CANCELADA' && $documento->motivo_cancelacion)
        <div class="observaciones" style="border-left-color: #dc3545;">
            <h4>Motivo de Cancelación:</h4>
            <p>{{ $documento->motivo_cancelacion }}</p>
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>Documento generado el {{ now()->format('d/m/Y H:i:s') }}</p>
        <p>{{ config('app.name') }} - Sistema de Gestión de Préstamos</p>
    </div>
</body>
</html>
