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
            padding: 40px;
            page-break-after: always;
        }

        .page-break {
            page-break-after: always;
            margin-bottom: 40px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 14px;
            color: #666;
        }

        .proforma {
            margin-bottom: 40px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 4px;
        }

        .proforma-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-block {
            font-size: 12px;
        }

        .info-block strong {
            display: inline-block;
            width: 100px;
            font-weight: 600;
        }

        .info-block p {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
        }

        table thead {
            background-color: #f0f0f0;
            border-bottom: 2px solid #333;
        }

        table th {
            padding: 10px;
            text-align: left;
            font-weight: 600;
        }

        table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        table tr:last-child td {
            border-bottom: none;
        }

        .totales {
            text-align: right;
            font-weight: 600;
            font-size: 13px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }

        @media print {
            body {
                background: white;
            }
            .container {
                padding: 20px;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    @if($proformas->isEmpty())
        <div class="container">
            <div class="header">
                <h1>{{ $titulo }}</h1>
            </div>
            <p style="text-align: center; color: #999;">No hay proformas para imprimir.</p>
        </div>
    @else
        @foreach($proformas as $proforma)
        <div class="container">
            <div class="header">
                <h1>PROFORMA</h1>
                <p>Reporte de Proformas del Sistema</p>
            </div>

            <div class="proforma">
                <div class="proforma-header">
                    <div class="info-block">
                        <p><strong>Número:</strong> {{ $proforma->numero }}</p>
                        <p><strong>ID:</strong> {{ $proforma->id }}</p>
                        <p><strong>Fecha:</strong> {{ $proforma->created_at->format('d/m/Y H:i') }}</p>
                        <p><strong>Vencimiento:</strong> {{ $proforma->fecha_vencimiento?->format('d/m/Y') ?? 'N/A' }}</p>
                    </div>
                    <div class="info-block">
                        <p><strong>Cliente:</strong> {{ $proforma->cliente?->nombre ?? 'N/A' }}</p>
                        <p><strong>Email:</strong> {{ $proforma->cliente?->email ?? 'N/A' }}</p>
                        <p><strong>Estado:</strong> <strong style="color: #0066cc;">{{ $proforma->estado }}</strong></p>
                        <p><strong>Usuario:</strong> {{ $proforma->usuarioCreador?->name ?? 'N/A' }}</p>
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
                    <p style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                        TOTAL: <strong>Bs. {{ number_format($proforma->total, 2) }}</strong>
                    </p>
                </div>
            </div>

            <div class="footer">
                <p>Reporte generado el {{ now()->format('d/m/Y H:i:s') }}</p>
            </div>
        </div>
        @if(!$loop->last)
        <div class="page-break"></div>
        @endif
        @endforeach
    @endif
</body>
</html>
