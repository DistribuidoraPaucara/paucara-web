<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Venta de Prestables {{ $documento->numero_venta }}</title>
    <style>
        @page {
            size: 80mm auto;
            margin: 5mm;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
            font-size: 10px;
            width: 80mm;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }

        .header h1 {
            margin: 0;
            font-size: 14px;
            color: #333;
        }

        .header p {
            margin: 3px 0;
            color: #666;
            font-size: 9px;
        }

        .info-section {
            display: block;
            margin-bottom: 10px;
        }

        .info-block {
            width: 100%;
            margin-bottom: 8px;
        }

        .info-block h3 {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 3px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
        }

        .info-block p {
            margin: 2px 0;
            font-size: 8px;
            line-height: 1.2;
        }

        .label {
            font-weight: bold;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 8px;
        }

        table thead {
            background-color: #f0f0f0;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
        }

        table th {
            padding: 3px 5px;
            text-align: left;
            font-weight: bold;
            font-size: 8px;
        }

        table td {
            padding: 3px 5px;
            border-bottom: 1px solid #ddd;
            font-size: 8px;
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
            margin-top: 10px;
            text-align: right;
            width: 100%;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px solid #ddd;
            font-size: 9px;
        }

        .total-row.grand-total {
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            font-weight: bold;
            font-size: 10px;
            margin-top: 5px;
            padding: 5px 0;
        }

        .observaciones {
            margin-top: 10px;
            padding: 5px;
            background-color: #f9f9f9;
            border-left: 2px solid #007bff;
            font-size: 8px;
        }

        .observaciones h4 {
            margin-top: 0;
            margin-bottom: 3px;
            font-size: 8px;
            color: #333;
        }

        .observaciones p {
            margin: 2px 0;
            font-size: 8px;
            line-height: 1.2;
        }

        .footer {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 7px;
            color: #666;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 2px;
            font-weight: bold;
            font-size: 8px;
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
        <h1>🛒 VENTA PRESTABLES</h1>
        <p><strong>{{ config('app.name') }}</strong></p>
    </div>

    <!-- Información General -->
    <div class="info-section">
        <div class="info-block">
            <h3>Información de la Venta</h3>
            <p><span class="label">Número:</span> {{ $documento->id }}</p>
            <p><span class="label">Fecha:</span> {{ $documento->fecha_venta->format('d/m/Y H:i') }}</p>
            <p><span class="label">Estado:</span>
                <span class="status-badge status-{{ strtolower($documento->estado) }}">
                    {{ $documento->estado }}
                </span>
            </p>
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
                <th class="text-center">Cant</th>
                <th class="text-right">Precio</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($documento->detalles as $detalle)
                <tr>
                    <td>
                        <strong>{{ $detalle->prestable->nombre }}</strong>
                    </td>
                    <td class="text-center">{{ $detalle->cantidad }}</td>
                    <td class="text-right">${{ number_format($detalle->precio_unitario, 2) }}</td>
                    <td class="text-right"><strong>${{ number_format($detalle->subtotal, 2) }}</strong></td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="text-center">Sin detalles</td>
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
            <h4>Obs:</h4>
            <p>{{ $documento->observaciones }}</p>
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>{{ now()->format('d/m/Y H:i:s') }}</p>
        <p>{{ config('app.name') }}</p>
    </div>
</body>
</html>
