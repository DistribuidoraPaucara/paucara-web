<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movimiento de Caja</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table tr {
            border-bottom: 1px solid #eee;
        }
        .info-table td {
            padding: 10px;
            font-size: 13px;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 30%;
            background-color: #f9f9f9;
        }
        .monto-section {
            background-color: #f5f5f5;
            border: 2px solid #333;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            border-radius: 5px;
        }
        .monto-label {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #666;
        }
        .monto-valor {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .monto-ingreso {
            color: #27ae60;
        }
        .monto-egreso {
            color: #e74c3c;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 11px;
            color: #999;
        }
        .caja-info {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .caja-info p {
            margin: 5px 0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>MOVIMIENTO DE CAJA</h1>
        <p>{{ $fecha_impresion->format('d de F de Y') }} a las {{ $fecha_impresion->format('H:i:s') }}</p>
    </div>

    <!-- Información de Caja -->
    <div class="caja-info">
        <p><strong>Caja:</strong> {{ $apertura->caja->nombre }}</p>
        <p><strong>Usuario:</strong> {{ $usuario->name }}</p>
        <p><strong>Apertura:</strong> {{ $apertura->fecha->format('d/m/Y H:i:s') }}</p>
    </div>

    <!-- Detalles del Movimiento -->
    <div class="section">
        <div class="section-title">DETALLES DEL MOVIMIENTO</div>
        <table class="info-table">
            <tr>
                <td>Fecha y Hora</td>
                <td>{{ $movimiento->fecha->format('d/m/Y H:i:s') }}</td>
            </tr>
            <tr>
                <td>Tipo de Operación</td>
                <td>{{ $movimiento->tipoOperacion->nombre }}</td>
            </tr>
            @if($movimiento->numero_documento)
            <tr>
                <td>Número de Documento</td>
                <td>{{ $movimiento->numero_documento }}</td>
            </tr>
            @endif
            @if($movimiento->observaciones)
            <tr>
                <td>Observación</td>
                <td>{{ $movimiento->observaciones }}</td>
            </tr>
            @endif
            @if($movimiento->tipoPago)
            <tr>
                <td>Tipo de Pago</td>
                <td>{{ $movimiento->tipoPago->nombre }}</td>
            </tr>
            @endif
            @if($movimiento->venta_id)
            <tr>
                <td>ID de Venta</td>
                <td>#{{ $movimiento->venta_id }}</td>
            </tr>
            @endif
            @if($movimiento->pago_id)
            <tr>
                <td>ID de Pago</td>
                <td>#{{ $movimiento->pago_id }}</td>
            </tr>
            @endif
            <tr>
                <td>ID de Movimiento</td>
                <td>#{{ $movimiento->id }}</td>
            </tr>
        </table>
    </div>

    <!-- Monto Destacado -->
    <div class="monto-section">
        <div class="monto-label">MONTO DEL MOVIMIENTO</div>
        <div class="monto-valor @if($movimiento->monto > 0) monto-ingreso @else monto-egreso @endif">
            @if($movimiento->monto > 0) + @endif{{ number_format(abs($movimiento->monto), 2) }} Bs.
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            @if($movimiento->monto > 0)
            <strong>INGRESO</strong>
            @else
            <strong>EGRESO</strong>
            @endif
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Documento impreso el {{ $fecha_impresion->format('d/m/Y') }} a las {{ $fecha_impresion->format('H:i:s') }}</p>
        <p>Sistema de Gestión - Distribuidora Paucara</p>
    </div>
</body>
</html>
