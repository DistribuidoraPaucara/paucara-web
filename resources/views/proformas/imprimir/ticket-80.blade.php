<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $titulo }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            width: 80mm;
            margin: 0 auto;
        }

        .ticket {
            page-break-after: always;
            padding: 10px;
            border-bottom: 2px dashed #000;
            margin-bottom: 10px;
        }

        .ticket:last-child {
            border-bottom: none;
        }

        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }

        .info {
            font-size: 11px;
            margin-bottom: 8px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
        }

        .label {
            font-weight: bold;
            width: 40%;
        }

        .value {
            text-align: right;
            width: 60%;
            word-break: break-word;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin: 8px 0;
        }

        table thead {
            border-bottom: 1px solid #000;
        }

        table th {
            padding: 3px;
            text-align: left;
            font-weight: bold;
        }

        table td {
            padding: 3px;
            word-break: break-word;
        }

        .qty {
            text-align: center;
            width: 20%;
        }

        .price {
            text-align: right;
            width: 30%;
        }

        .subtotal {
            text-align: right;
            width: 30%;
        }

        .totales {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 5px 0;
            margin: 8px 0;
            font-weight: bold;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 11px;
        }

        .total-final {
            font-size: 13px;
            margin-top: 5px;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 10px;
            padding-top: 5px;
            border-top: 1px solid #000;
        }

        @media print {
            body {
                width: 80mm;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    @foreach($proformas as $proforma)
    <div class="ticket">
        <div class="header">
            PROFORMA {{ $proforma->numero }}
        </div>

        <div class="info">
            <div class="info-row">
                <span class="label">ID:</span>
                <span class="value">{{ $proforma->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Fecha:</span>
                <span class="value">{{ $proforma->created_at->format('d/m/Y') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Cliente:</span>
                <span class="value">{{ $proforma->cliente?->nombre ?? 'N/A' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Estado:</span>
                <span class="value">{{ $proforma->estado }}</span>
            </div>
        </div>

        @if($proforma->detalles->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Producto</th>
                    <th class="qty">Qty</th>
                    <th class="price">Precio</th>
                </tr>
            </thead>
            <tbody>
                @foreach($proforma->detalles as $detalle)
                <tr>
                    <td>{{ substr($detalle->producto?->nombre ?? 'Producto', 0, 20) }}</td>
                    <td class="qty">{{ number_format($detalle->cantidad, 0) }}</td>
                    <td class="price">{{ number_format($detalle->precio_unitario, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <div class="totales" style="font-size: 11px;">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ number_format($proforma->subtotal, 2) }}</span>
            </div>
            @if($proforma->descuento > 0)
            <div class="total-row">
                <span>Descuento:</span>
                <span>-{{ number_format($proforma->descuento, 2) }}</span>
            </div>
            @endif
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>{{ number_format($proforma->total, 2) }}</span>
            </div>
        </div>

        <div class="footer">
            {{ now()->format('d/m/Y H:i') }}
        </div>
    </div>
    @endforeach
</body>
</html>
