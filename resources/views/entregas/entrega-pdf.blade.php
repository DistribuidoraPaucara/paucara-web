<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $entrega->numero_entrega }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            color: #000;
            font-size: 12px;
            line-height: 1.5;
            padding: 10px;
            background: white;
        }

        .container {
            max-width: 100%;
        }

        /* Encabezado */
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
        }

        .logo-container {
            margin-bottom: 10px;
        }

        .logo-container img {
            max-width: 120px;
            max-height: 60px;
            object-fit: contain;
        }

        .header h1 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 11px;
            margin: 3px 0;
        }

        .numero-entrega {
            font-size: 13px;
            font-weight: bold;
            margin-top: 5px;
        }

        /* Separadores */
        .separator {
            border: none;
            border-top: 1px solid #000;
            margin: 10px 0;
            height: 0;
        }

        .separator-dashed {
            border: none;
            border-top: 1px dashed #000;
            margin: 10px 0;
            height: 0;
        }

        /* Información principal */
        .info-block {
            margin-bottom: 12px;
            padding: 8px 0;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding: 4px 0;
            line-height: 1.4;
        }

        .info-label {
            font-weight: bold;
            text-transform: uppercase;
            flex: 0 0 40%;
        }

        .info-value {
            text-align: right;
            flex: 1;
            padding-left: 10px;
        }

        /* Sección de ventas */
        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 12px;
            margin-bottom: 8px;
            padding: 6px 0;
            border-bottom: 1px solid #000;
        }

        .venta-block {
            margin-bottom: 15px;
            padding: 8px 0;
            border-bottom: 1px dashed #000;
            page-break-inside: avoid;
        }

        .venta-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .venta-client {
            font-size: 10px;
            margin-bottom: 4px;
            padding: 4px 0;
        }

        /* Tabla de productos */
        .products-table {
            width: 100%;
            font-size: 10px;
            margin: 6px 0;
            border-collapse: collapse;
        }

        .products-table th {
            border-bottom: 1px solid #000;
            padding: 4px 2px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
        }

        .products-table td {
            padding: 3px 2px;
            border: none;
        }

        .products-table tr.total {
            border-top: 1px solid #000;
            font-weight: bold;
            font-size: 11px;
        }

        .col-product {
            width: 40%;
            text-align: left;
        }

        .col-qty {
            width: 12%;
            text-align: center;
        }

        .col-price {
            width: 15%;
            text-align: right;
        }

        .col-total {
            width: 15%;
            text-align: right;
        }

        .col-weight {
            width: 15%;
            text-align: right;
        }

        /* Dirección */
        .address-block {
            font-size: 10px;
            margin-top: 6px;
            padding: 6px;
            background: white;
            border: 1px solid #000;
        }

        .address-label {
            font-weight: bold;
            margin-bottom: 2px;
        }

        /* Footer */
        .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #000;
            text-align: center;
            font-size: 9px;
        }

        .footer p {
            margin: 3px 0;
        }

        /* Resumen */
        .summary {
            margin: 12px 0;
            padding: 8px;
            border: 1px solid #000;
            font-size: 11px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px dashed #000;
        }

        .summary-row:last-child {
            border-bottom: none;
        }

        .summary-label {
            font-weight: bold;
        }

        .summary-value {
            text-align: right;
        }

        @media print {
            body {
                margin: 0;
                padding: 5px;
            }

            .venta-block {
                page-break-inside: avoid;
            }
        }

    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            {{-- Logo comentado: requiere extensión GD de PHP --}}
            {{-- @if ($logo)
                <div class="logo-container">
                    <img src="{{ $logo }}" alt="Logo">
        </div>
        @endif --}}
        <h1>{{ $empresa }}</h1>
        <p>REMISIÓN DE ENTREGAsss</p>
        <div class="numero-entrega">{{ $entrega->numero_entrega }}</div>
        <p style="font-size: 10px;">{{ $fecha_generacion }}</p>
    </div>

    <hr class="separator">

    <!-- Información Principal -->
    <div class="info-block">
        <div class="info-row">
            <span class="info-label">ESTADO:</span>
            <span class="info-value">{{ $entrega->estado }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">PESO:</span>
            <span class="info-value">{{ number_format($entrega->peso_kg ?? 0, 2) }} kg</span>
        </div>

        @if ($entrega->vehiculo)
        <div class="info-row">
            <span class="info-label">VEHÍCULO:</span>
            <span class="info-value">{{ $entrega->vehiculo->placa }}</span>
        </div>
        @endif

        @if ($entrega->chofer)
        <div class="info-row">
            <span class="info-label">CHOFER:</span>
            <span class="info-value">{{ $entrega->chofer->nombre ?? 'N/A' }}</span>
        </div>
        @endif

        @if ($entrega->localidad)
        <div class="info-row">
            <span class="info-label">LOCALIDAD:</span>
            <span class="info-value">{{ $entrega->localidad->nombre }}</span>
        </div>
        @endif
    </div>

    <hr class="separator">

    <!-- Ventas -->
    @if ($entrega->ventas && $entrega->ventas->count() > 0)
    <div class="section-title">DETALLES DE VENTAS</div>

    @foreach ($entrega->ventas as $venta)
    <div class="venta-block">
        <div class="venta-title">
            Venta #{{ $venta->numero }} (ID: {{ $venta->id }})
        </div>

        @if ($venta->cliente)
        <div class="venta-client">
            <strong>Cliente:</strong> {{ $venta->cliente->nombre }}
        </div>
        @endif

        @if ($venta->detalles && $venta->detalles->count() > 0)
        <table class="products-table">
            <thead>
                <tr>
                    <th class="col-product">PRODUCTO</th>
                    <th class="col-qty">CAN</th>
                    <th class="col-price">UNIT</th>
                    <th class="col-total">TOTAL</th>
                    <th class="col-weight">PESO</th>
                </tr>
            </thead>
            <tbody>
                @php $totalVenta = 0; $pesoVenta = 0; @endphp
                @foreach ($venta->detalles as $detalle)
                @php
                $subtotal = (float)$detalle->cantidad * (float)$detalle->precio_unitario;
                $totalVenta += $subtotal;
                $pesoDetalle = ((float)$detalle->producto?->peso ?? 0) * (float)$detalle->cantidad;
                $pesoVenta += $pesoDetalle;
                @endphp
                <tr>
                    <td class="col-product">{{ $detalle->producto?->nombre ?? 'S/N' }}</td>
                    <td class="col-qty">{{ $detalle->cantidad }}</td>
                    <td class="col-price">{{ number_format($detalle->precio_unitario, 2) }}</td>
                    <td class="col-total">{{ number_format($subtotal, 2) }}</td>
                    <td class="col-weight">{{ number_format($pesoDetalle, 2) }}</td>
                </tr>
                @endforeach
                <tr class="total">
                    <td colspan="3" style="text-align: right;">TOTAL:</td>
                    <td class="col-total">{{ number_format($totalVenta, 2) }}</td>
                    <td class="col-weight">{{ number_format($pesoVenta, 2) }} kg</td>
                </tr>
            </tbody>
        </table>
        @else
        <p style="font-size: 10px; color: #666;">Sin productos</p>
        @endif

        @if ($venta->direccion_entrega)
        <div class="address-block">
            <div class="address-label">DIRECCIÓN DE ENTREGA:</div>
            <div>{{ $venta->direccion_entrega }}</div>
        </div>
        @endif
    </div>
    @endforeach

    <!-- Resumen Total -->
    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">TOTAL VENTAS:</span>
            <span class="summary-value">{{ $entrega->ventas->count() }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">PESO TOTAL:</span>
            <span class="summary-value">{{ number_format($entrega->peso_kg ?? 0, 2) }} kg</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">MONTO TOTAL:</span>
            <span class="summary-value">
                @php
                $montoTotal = 0;
                foreach ($entrega->ventas as $v) {
                foreach ($v->detalles as $d) {
                $montoTotal += (float)$d->cantidad * (float)$d->precio_unitario;
                }
                }
                @endphp
                {{ number_format($montoTotal, 2) }}
            </span>
        </div>
    </div>
    @else
    <p style="text-align: center; padding: 20px; font-size: 11px;">Sin ventas asociadas</p>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>{{ $empresa }}</p>
        <p>Generado: {{ $fecha_generacion }}</p>
        <p>Sistema de Gestión Logística</p>
    </div>
    </div>
</body>
</html>
