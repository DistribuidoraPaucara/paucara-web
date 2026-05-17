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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 12px;
            color: #666;
        }

        .proformas-list {
            margin-bottom: 20px;
        }

        .proforma-item {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            page-break-inside: avoid;
        }

        .proforma-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 11px;
        }

        .info-block strong {
            display: inline-block;
            width: 80px;
            font-weight: 600;
        }

        .info-block p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10px;
        }

        table thead {
            background-color: #f0f0f0;
            border-bottom: 2px solid #333;
        }

        table th {
            padding: 8px;
            text-align: left;
            font-weight: 600;
        }

        table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .totales {
            text-align: right;
            font-weight: 600;
            font-size: 11px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }

        .footer {
            text-align: center;
            font-size: 11px;
            color: #666;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
        }

        @media print {
            body {
                background: white;
            }
            .container {
                padding: 10px;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $titulo }}</h1>
            <p>Listado de Proformas Filtradas</p>
        </div>

        @if($proformas->isEmpty())
            <p style="text-align: center; color: #999;">No hay proformas para imprimir.</p>
        @else
            <div class="proformas-list">
                @foreach($proformas as $proforma)
                <div class="proforma-item">
                    <div class="proforma-header">
                        <div class="info-block">
                            <p><strong>Número:</strong> {{ $proforma->numero }}</p>
                            <p><strong>ID:</strong> {{ $proforma->id }}</p>
                            <p><strong>Fecha:</strong> {{ $proforma->created_at->format('d/m/Y H:i') }}</p>
                        </div>
                        <div class="info-block">
                            <p><strong>Cliente:</strong> {{ $proforma->cliente?->nombre ?? 'N/A' }}</p>
                            <p><strong>Email:</strong> {{ $proforma->cliente?->email ?? 'N/A' }}</p>
                            <p><strong>Estado:</strong> {{ $proforma->estado }}</p>
                        </div>
                    </div>

                    @if($proforma->detalles->isNotEmpty())
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 50%;">Producto</th>
                                <th style="width: 15%; text-align: center;">Cantidad</th>
                                <th style="width: 15%; text-align: right;">Precio</th>
                                <th style="width: 20%; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($proforma->detalles as $detalle)
                            <tr>
                                <td>{{ $detalle->producto?->nombre ?? 'Producto eliminado' }}</td>
                                <td style="text-align: center;">{{ number_format($detalle->cantidad, 2) }}</td>
                                <td style="text-align: right;">Bs. {{ number_format($detalle->precio_unitario, 2) }}</td>
                                <td style="text-align: right;">Bs. {{ number_format($detalle->subtotal, 2) }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @endif

                    <div class="totales">
                        <p>Subtotal: Bs. {{ number_format($proforma->subtotal, 2) }}</p>
                        @if($proforma->descuento > 0)
                        <p>Descuento: -Bs. {{ number_format($proforma->descuento, 2) }}</p>
                        @endif
                        <p style="border-top: 1px solid #ddd; padding-top: 5px; margin-top: 5px;">
                            TOTAL: Bs. {{ number_format($proforma->total, 2) }}
                        </p>
                    </div>
                </div>
                @endforeach
            </div>
        @endif

        <div class="footer">
            <p>Reporte generado el {{ now()->format('d/m/Y H:i:s') }}</p>
            <p>Total de proformas: {{ $proformas->count() }}</p>
        </div>
    </div>
</body>
</html>
