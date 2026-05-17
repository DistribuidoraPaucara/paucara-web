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
            font-size: 10px;
            line-height: 1.3;
            width: 58mm;
            margin: 0 auto;
        }

        .ticket {
            page-break-after: always;
            padding: 5px;
            border-bottom: 2px dashed #000;
            margin-bottom: 5px;
        }

        .ticket:last-child {
            border-bottom: none;
        }

        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            font-size: 11px;
        }

        .info {
            font-size: 9px;
            margin-bottom: 5px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 1px 0;
        }

        .label {
            font-weight: bold;
            width: 45%;
        }

        .value {
            text-align: right;
            width: 55%;
            word-break: break-word;
            font-size: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin: 5px 0;
        }

        table thead {
            border-bottom: 1px solid #000;
        }

        table th {
            padding: 2px;
            text-align: left;
            font-weight: bold;
            font-size: 8px;
        }

        table td {
            padding: 2px;
            word-break: break-word;
        }

        .qty {
            text-align: center;
            width: 25%;
        }

        .price {
            text-align: right;
            width: 25%;
        }

        .totales {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 3px 0;
            margin: 5px 0;
            font-weight: bold;
            font-size: 9px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
        }

        .total-final {
            font-size: 11px;
            margin-top: 3px;
        }

        .footer {
            text-align: center;
            font-size: 8px;
            margin-top: 8px;
            padding-top: 3px;
            border-top: 1px solid #000;
        }

        @media print {
            body {
                width: 58mm;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    @foreach($proformas as $proforma)
    <div class="ticket">
        <div class="header">
            PROF. {{ $proforma->numero }}
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
                <span class="value">{{ substr($proforma->cliente?->nombre ?? 'N/A', 0, 15) }}</span>
            </div>
        </div>

        @if($proforma->detalles->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Prod.</th>
                    <th class="qty">Qty</th>
                    <th class="price">Precio</th>
                </tr>
            </thead>
            <tbody>
                @foreach($proforma->detalles->take(5) as $detalle)
                <tr>
                    <td>{{ substr($detalle->producto?->nombre ?? 'Producto', 0, 12) }}</td>
                    <td class="qty">{{ number_format($detalle->cantidad, 0) }}</td>
                    <td class="price">{{ number_format($detalle->precio_unitario, 1) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <div class="totales">
            <div class="total-row">
                <span>SUB:</span>
                <span>{{ number_format($proforma->subtotal, 1) }}</span>
            </div>
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>{{ number_format($proforma->total, 1) }}</span>
            </div>
        </div>

        <div class="footer">
            {{ now()->format('d/m H:i') }}
        </div>
    </div>
    @endforeach
</body>
</html>
