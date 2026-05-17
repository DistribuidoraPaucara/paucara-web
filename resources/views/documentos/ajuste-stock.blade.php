<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajuste de Stock</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background: white;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 28px;
            color: #1e40af;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 12px;
            color: #666;
        }

        .empresa-info {
            text-align: center;
            font-size: 11px;
            color: #666;
            margin-bottom: 30px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1e40af;
            border-left: 4px solid #2563eb;
            padding-left: 12px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
        }

        .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 500;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table thead {
            background: #f3f4f6;
            border-bottom: 2px solid #2563eb;
        }

        .table th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #1e40af;
            text-transform: uppercase;
        }

        .table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
        }

        .table tbody tr:nth-child(odd) {
            background: #f9fafb;
        }

        .table-center {
            text-align: center;
        }

        .table-right {
            text-align: right;
        }

        .value-before {
            color: #dc2626;
            font-weight: 500;
        }

        .value-after {
            color: #16a34a;
            font-weight: 600;
        }

        .change-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
        }

        .change-positive {
            background: #dcfce7;
            color: #166534;
        }

        .change-negative {
            background: #fee2e2;
            color: #991b1b;
        }

        .motivo-section {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .motivo-label {
            font-size: 11px;
            color: #92400e;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .motivo-value {
            font-size: 13px;
            color: #78350f;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #999;
        }

        .signature-area {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .signature-line {
            border-top: 1px solid #333;
            padding-top: 5px;
            text-align: center;
            font-size: 11px;
        }

        .status-bar {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }

        .status-item {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }

        .status-emoji {
            font-size: 20px;
            margin-bottom: 5px;
        }

        .status-name {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .status-value {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .total-section {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
            margin-top: 20px;
        }

        .total-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            opacity: 0.9;
            margin-bottom: 5px;
        }

        .total-value {
            font-size: 28px;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>AJUSTE DE STOCK</h1>
            <p>Documento de Control de Inventario</p>
        </div>

        <div class="empresa-info">
            <p><strong>{{ $empresa }}</strong></p>
            <p>Fecha: <strong>{{ $fecha }}</strong></p>
        </div>

        <!-- Información General -->
        <div class="section">
            <div class="section-title">Información del Prestable</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Código</div>
                    <div class="info-value">{{ $prestable_codigo }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nombre</div>
                    <div class="info-value">{{ $prestable_nombre }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Almacén</div>
                    <div class="info-value">{{ $almacen }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Usuario</div>
                    <div class="info-value">{{ $usuario }}</div>
                </div>
            </div>
        </div>

        <!-- Estados de Stock -->
        <div class="section">
            <div class="section-title">Estados de Stock</div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th class="table-center">Antes</th>
                        <th class="table-center">Después</th>
                        <th class="table-center">Cambio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Disponible</td>
                        <td class="table-center value-before">{{ $valores_antes['disponible'] }}</td>
                        <td class="table-center value-after">{{ $valores_despues['disponible'] }}</td>
                        <td class="table-center">
                            @php
                                $cambio = $valores_despues['disponible'] - $valores_antes['disponible'];
                                $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                $signo = $cambio >= 0 ? '+' : '';
                            @endphp
                            <span class="change-badge {{ $clase }}">
                                {{ $signo }}{{ $cambio }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Préstamo Cliente</td>
                        <td class="table-center value-before">{{ $valores_antes['prestamo_cliente'] }}</td>
                        <td class="table-center value-after">{{ $valores_despues['prestamo_cliente'] }}</td>
                        <td class="table-center">
                            @php
                                $cambio = $valores_despues['prestamo_cliente'] - $valores_antes['prestamo_cliente'];
                                $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                $signo = $cambio >= 0 ? '+' : '';
                            @endphp
                            <span class="change-badge {{ $clase }}">
                                {{ $signo }}{{ $cambio }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Préstamo Proveedor</td>
                        <td class="table-center value-before">{{ $valores_antes['prestamo_proveedor'] }}</td>
                        <td class="table-center value-after">{{ $valores_despues['prestamo_proveedor'] }}</td>
                        <td class="table-center">
                            @php
                                $cambio = $valores_despues['prestamo_proveedor'] - $valores_antes['prestamo_proveedor'];
                                $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                $signo = $cambio >= 0 ? '+' : '';
                            @endphp
                            <span class="change-badge {{ $clase }}">
                                {{ $signo }}{{ $cambio }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Vendida</td>
                        <td class="table-center value-before">{{ $valores_antes['vendida'] }}</td>
                        <td class="table-center value-after">{{ $valores_despues['vendida'] }}</td>
                        <td class="table-center">
                            @php
                                $cambio = $valores_despues['vendida'] - $valores_antes['vendida'];
                                $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                $signo = $cambio >= 0 ? '+' : '';
                            @endphp
                            <span class="change-badge {{ $clase }}">
                                {{ $signo }}{{ $cambio }}
                            </span>
                        </td>
                    </tr>
                    <tr style="border-top: 2px solid #2563eb; font-weight: 600;">
                        <td>TOTAL</td>
                        <td class="table-center">
                            {{ $valores_antes['disponible'] + $valores_antes['prestamo_cliente'] + $valores_antes['prestamo_proveedor'] + $valores_antes['vendida'] }}
                        </td>
                        <td class="table-center">
                            {{ $valores_despues['disponible'] + $valores_despues['prestamo_cliente'] + $valores_despues['prestamo_proveedor'] + $valores_despues['vendida'] }}
                        </td>
                        <td class="table-center">
                            @php
                                $totalAntes = $valores_antes['disponible'] + $valores_antes['prestamo_cliente'] + $valores_antes['prestamo_proveedor'] + $valores_antes['vendida'];
                                $totalDespues = $valores_despues['disponible'] + $valores_despues['prestamo_cliente'] + $valores_despues['prestamo_proveedor'] + $valores_despues['vendida'];
                                $cambioTotal = $totalDespues - $totalAntes;
                                $clase = $cambioTotal >= 0 ? 'change-positive' : 'change-negative';
                                $signo = $cambioTotal >= 0 ? '+' : '';
                            @endphp
                            <span class="change-badge {{ $clase }}">
                                {{ $signo }}{{ $cambioTotal }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 🔗 Embase Relacionado (si se actualizó) -->
        @if(isset($embase))
            <div class="section">
                <div class="section-title">🔖 Embase Relacionado (Actualizado)</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Código</div>
                        <div class="info-value">{{ $embase['codigo'] }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Nombre</div>
                        <div class="info-value">{{ $embase['nombre'] }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Multiplicador</div>
                        <div class="info-value">× {{ $embase['multiplicador'] }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Almacén</div>
                        <div class="info-value">{{ $almacen }}</div>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th class="table-center">Antes</th>
                            <th class="table-center">Después</th>
                            <th class="table-center">Cambio</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Disponible</td>
                            <td class="table-center value-before">{{ $embase['valores_antes']['disponible'] }}</td>
                            <td class="table-center value-after">{{ $embase['valores_despues']['disponible'] }}</td>
                            <td class="table-center">
                                @php
                                    $cambio = $embase['valores_despues']['disponible'] - $embase['valores_antes']['disponible'];
                                    $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                    $signo = $cambio >= 0 ? '+' : '';
                                @endphp
                                <span class="change-badge {{ $clase }}">
                                    {{ $signo }}{{ $cambio }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Préstamo Cliente</td>
                            <td class="table-center value-before">{{ $embase['valores_antes']['prestamo_cliente'] }}</td>
                            <td class="table-center value-after">{{ $embase['valores_despues']['prestamo_cliente'] }}</td>
                            <td class="table-center">
                                @php
                                    $cambio = $embase['valores_despues']['prestamo_cliente'] - $embase['valores_antes']['prestamo_cliente'];
                                    $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                    $signo = $cambio >= 0 ? '+' : '';
                                @endphp
                                <span class="change-badge {{ $clase }}">
                                    {{ $signo }}{{ $cambio }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Préstamo Proveedor</td>
                            <td class="table-center value-before">{{ $embase['valores_antes']['prestamo_proveedor'] }}</td>
                            <td class="table-center value-after">{{ $embase['valores_despues']['prestamo_proveedor'] }}</td>
                            <td class="table-center">
                                @php
                                    $cambio = $embase['valores_despues']['prestamo_proveedor'] - $embase['valores_antes']['prestamo_proveedor'];
                                    $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                    $signo = $cambio >= 0 ? '+' : '';
                                @endphp
                                <span class="change-badge {{ $clase }}">
                                    {{ $signo }}{{ $cambio }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Vendida</td>
                            <td class="table-center value-before">{{ $embase['valores_antes']['vendida'] }}</td>
                            <td class="table-center value-after">{{ $embase['valores_despues']['vendida'] }}</td>
                            <td class="table-center">
                                @php
                                    $cambio = $embase['valores_despues']['vendida'] - $embase['valores_antes']['vendida'];
                                    $clase = $cambio >= 0 ? 'change-positive' : 'change-negative';
                                    $signo = $cambio >= 0 ? '+' : '';
                                @endphp
                                <span class="change-badge {{ $clase }}">
                                    {{ $signo }}{{ $cambio }}
                                </span>
                            </td>
                        </tr>
                        <tr style="border-top: 2px solid #2563eb; font-weight: 600;">
                            <td>TOTAL</td>
                            <td class="table-center">
                                {{ $embase['valores_antes']['disponible'] + $embase['valores_antes']['prestamo_cliente'] + $embase['valores_antes']['prestamo_proveedor'] + $embase['valores_antes']['vendida'] }}
                            </td>
                            <td class="table-center">
                                {{ $embase['valores_despues']['disponible'] + $embase['valores_despues']['prestamo_cliente'] + $embase['valores_despues']['prestamo_proveedor'] + $embase['valores_despues']['vendida'] }}
                            </td>
                            <td class="table-center">
                                @php
                                    $totalAntes = $embase['valores_antes']['disponible'] + $embase['valores_antes']['prestamo_cliente'] + $embase['valores_antes']['prestamo_proveedor'] + $embase['valores_antes']['vendida'];
                                    $totalDespues = $embase['valores_despues']['disponible'] + $embase['valores_despues']['prestamo_cliente'] + $embase['valores_despues']['prestamo_proveedor'] + $embase['valores_despues']['vendida'];
                                    $cambioTotal = $totalDespues - $totalAntes;
                                    $clase = $cambioTotal >= 0 ? 'change-positive' : 'change-negative';
                                    $signo = $cambioTotal >= 0 ? '+' : '';
                                @endphp
                                <span class="change-badge {{ $clase }}">
                                    {{ $signo }}{{ $cambioTotal }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        @endif

        <!-- Motivo y Comentarios -->
        @if($motivo)
            <div class="motivo-section">
                <div class="motivo-label">Motivo del Ajuste</div>
                <div class="motivo-value">{{ $motivo }}</div>
            </div>
        @endif

        @if($comentarios)
            <div class="motivo-section" style="background: #e0e7ff; border-left-color: #4f46e5;">
                <div class="motivo-label" style="color: #312e81;">Comentarios Adicionales</div>
                <div class="motivo-value" style="color: #3730a3;">{{ $comentarios }}</div>
            </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Este documento fue generado automáticamente por el sistema de gestión de inventario.</p>
            <p>Fecha y hora de generación: {{ now()->format('d/m/Y H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
