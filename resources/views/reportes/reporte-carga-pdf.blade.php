<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $reporte->numero_reporte }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            color: #333;
            font-size: 11px;
        }

        .header {
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 16px;
            margin: 0;
        }

        .header .empresa {
            text-align: right;
        }

        .header .empresa h2 {
            font-size: 14px;
            margin: 0;
            font-weight: bold;
        }

        .info-reporte {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-item label {
            font-weight: bold;
            font-size: 10px;
            color: #666;
            margin-bottom: 3px;
        }

        .info-item value {
            font-size: 12px;
            color: #333;
        }

        .table-container {
            margin: 15px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table thead {
            background-color: #333;
            color: white;
            font-weight: bold;
        }

        table th,
        table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }

        table th {
            font-weight: bold;
            font-size: 10px;
        }

        table td {
            font-size: 10px;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9px;
            color: #666;
        }

        .estado-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 9px;
        }

        .estado-pendiente {
            background-color: #fef3c7;
            color: #92400e;
        }

        .estado-confirmado {
            background-color: #bfdbfe;
            color: #1e40af;
        }

        .estado-entregado {
            background-color: #bbf7d0;
            color: #065f46;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            padding: 8px;
            background-color: #e5e7eb;
            border-left: 4px solid #333;
        }

        .entregas-list {
            margin-top: 10px;
        }

        .entrega-item {
            padding: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 5px;
            background-color: #fafafa;
            border-radius: 3px;
        }

        .entrega-numero {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 3px;
        }

        .entrega-cliente {
            font-size: 10px;
            color: #666;
            margin-bottom: 2px;
        }

        .entrega-detalles {
            font-size: 9px;
            color: #999;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }

            .header,
            .info-reporte,
            table {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div>
            <h1>REPORTE DE CARGA</h1>
            <p style="font-size: 10px; margin-top: 2px;">{{ $fecha_generacion }}</p>
        </div>
        <div class="empresa">
            <h2>{{ $empresa }}</h2>
            <p style="font-size: 9px; margin-top: 2px;">Documento: {{ $reporte->numero_reporte }}</p>
        </div>
    </div>

    <!-- Información del Reporte -->
    <div class="info-reporte">
        <div class="info-item">
            <label>NÚMERO REPORTE</label>
            <value>{{ $reporte->numero_reporte }}</value>
        </div>

        <div class="info-item">
            <label>ESTADO</label>
            <div>
                <span class="estado-badge estado-{{ strtolower($reporte->estado) }}">
                    {{ $reporte->estado }}
                </span>
            </div>
        </div>

        <div class="info-item">
            <label>VEHÍCULO</label>
            <value>
                @if ($reporte->vehiculo)
                    {{ $reporte->vehiculo->placa }} ({{ $reporte->vehiculo->marca }})
                @else
                    N/A
                @endif
            </value>
        </div>

        <div class="info-item">
            <label>PESO TOTAL</label>
            <value>{{ number_format($reporte->peso_total_kg, 2) }} kg</value>
        </div>

        <div class="info-item">
            <label>CANTIDAD ENTREGAS</label>
            <value>{{ $reporte->entregas?->count() ?? 1 }}</value>
        </div>

        <div class="info-item">
            <label>DESCRIPCIÓN</label>
            <value>{{ $reporte->descripcion ?? 'N/A' }}</value>
        </div>
    </div>

    <!-- Detalles de Productos -->
    @if ($reporte->detalles && $reporte->detalles->count() > 0)
        <div class="table-container">
            <div class="section-title">PRODUCTOS A CARGAR</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%;">PRODUCTO</th>
                        <th style="width: 15%;">SOLICITADO</th>
                        <th style="width: 15%;">CARGADO</th>
                        <th style="width: 15%;">PESO (KG)</th>
                        <th style="width: 10%;">VERIFICADO</th>
                        <th style="width: 15%;">NOTAS</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($reporte->detalles as $detalle)
                        <tr>
                            <td>
                                {{ $detalle->producto?->nombre ?? 'Producto sin nombre' }}
                                <br />
                                <small style="color: #999;">(ID: {{ $detalle->producto_id }})</small>
                            </td>
                            <td>{{ $detalle->cantidad_solicitada }}</td>
                            <td>{{ $detalle->cantidad_cargada }}</td>
                            <td>{{ number_format($detalle->peso_kg ?? 0, 2) }}</td>
                            <td style="text-align: center;">
                                {{ $detalle->verificado ? '✓' : '-' }}
                            </td>
                            <td>{{ $detalle->notas ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <!-- Entregas Asociadas (si modo detallado) -->
    @if ((isset($detallado) ? $detallado : false) && $reporte->entregas && $reporte->entregas->count() > 0)
        <div class="entregas-list">
            <div class="section-title">ENTREGAS INCLUIDAS EN ESTE REPORTE</div>
            @foreach ($reporte->entregas as $entrega)
                <div class="entrega-item">
                    <div class="entrega-numero">
                        #{{ $loop->iteration }} - Entrega #{{ $entrega->numero_entrega }}
                    </div>
                    <div class="entrega-cliente">
                        <strong>Cliente:</strong>
                        @if ($entrega->ventas && $entrega->ventas->count() > 0)
                            {{ $entrega->ventas->first()?->cliente?->nombre ?? 'Sin cliente' }}
                        @else
                            Sin cliente
                        @endif
                    </div>
                    @if ($entrega->ventas && $entrega->ventas->count() > 0)
                        <div class="entrega-detalles">
                            <strong>Productos:</strong>
                            @php
                                $totalProductos = 0;
                                foreach ($entrega->ventas as $venta) {
                                    $totalProductos += $venta->detalles?->count() ?? 0;
                                }
                            @endphp
                            {{ $totalProductos }} artículos
                            | <strong>Peso:</strong> {{ number_format($entrega->peso_kg ?? 0, 2) }} kg
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>Este documento fue generado automáticamente el {{ $fecha_generacion }}</p>
        <p style="margin-top: 5px; border-top: 1px solid #ddd; padding-top: 5px;">
            {{ $empresa }} - Reporte de Carga Automático
        </p>
    </div>
</body>
</html>
