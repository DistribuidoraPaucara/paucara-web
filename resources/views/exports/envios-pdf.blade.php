<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Envíos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #4F81BD;
        }

        .header h1 {
            font-size: 18px;
            color: #4F81BD;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 9px;
            color: #666;
        }

        .filtros {
            background: #f5f5f5;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }

        .filtros h3 {
            font-size: 11px;
            margin-bottom: 5px;
            color: #4F81BD;
        }

        .filtros p {
            font-size: 9px;
            margin: 2px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table thead {
            background: #4F81BD;
            color: white;
        }

        table thead th {
            padding: 8px 5px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
        }

        table tbody td {
            padding: 6px 5px;
            border-bottom: 1px solid #ddd;
            font-size: 9px;
        }

        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }

        .badge-programado {
            background: #E3F2FD;
            color: #1976D2;
        }

        .badge-preparacion {
            background: #FFF3E0;
            color: #F57C00;
        }

        .badge-ruta {
            background: #F3E5F5;
            color: #7B1FA2;
        }

        .badge-entregado {
            background: #E8F5E9;
            color: #388E3C;
        }

        .badge-cancelado {
            background: #FFEBEE;
            color: #D32F2F;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 5px;
        }

        .summary {
            background: #f5f5f5;
            padding: 10px;
            margin-top: 15px;
            border-radius: 4px;
        }

        .summary h3 {
            font-size: 11px;
            margin-bottom: 8px;
            color: #4F81BD;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .summary-item {
            background: white;
            padding: 8px;
            border-radius: 3px;
            text-align: center;
        }

        .summary-item .label {
            font-size: 8px;
            color: #666;
            margin-bottom: 3px;
        }

        .summary-item .value {
            font-size: 14px;
            font-weight: bold;
            color: #4F81BD;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📦 Reporte de Envíos</h1>
        <p>Generado el {{ $fecha_generacion->format('d/m/Y H:i:s') }}</p>
    </div>

    @if(count($filtros) > 0)
    <div class="filtros">
        <h3>Filtros Aplicados:</h3>
        @if(isset($filtros['estado']))
            <p><strong>Estado:</strong> {{ $filtros['estado'] }}</p>
        @endif
        @if(isset($filtros['fecha_desde']))
            <p><strong>Desde:</strong> {{ $filtros['fecha_desde'] }}</p>
        @endif
        @if(isset($filtros['fecha_hasta']))
            <p><strong>Hasta:</strong> {{ $filtros['fecha_hasta'] }}</p>
        @endif
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>N° Envío</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Chofer</th>
                <th>F. Programada</th>
                <th>F. Entrega</th>
                <th>Dirección</th>
            </tr>
        </thead>
        <tbody>
            @foreach($envios as $envio)
            <tr>
                <td>{{ $envio->numero_envio }}</td>
                <td>
                    @php
                        $badgeClass = match($envio->estado) {
                            'PROGRAMADO' => 'badge-programado',
                            'EN_PREPARACION' => 'badge-preparacion',
                            'EN_RUTA' => 'badge-ruta',
                            'ENTREGADO' => 'badge-entregado',
                            'CANCELADO' => 'badge-cancelado',
                            default => 'badge-programado'
                        };
                    @endphp
                    <span class="badge {{ $badgeClass }}">
                        {{ str_replace('_', ' ', $envio->estado) }}
                    </span>
                </td>
                <td>{{ $envio->venta->cliente->nombre ?? '-' }}</td>
                <td>{{ $envio->vehiculo->placa ?? '-' }}</td>
                <td>{{ $envio->chofer->name ?? '-' }}</td>
                <td>{{ $envio->fecha_programada ? $envio->fecha_programada->format('d/m/Y H:i') : '-' }}</td>
                <td>{{ $envio->fecha_entrega ? $envio->fecha_entrega->format('d/m/Y H:i') : '-' }}</td>
                <td>{{ \Str::limit($envio->direccion_entrega ?? '-', 30) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <h3>Resumen del Reporte</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Total Envíos</div>
                <div class="value">{{ $envios->count() }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Entregados</div>
                <div class="value">{{ $envios->where('estado', 'ENTREGADO')->count() }}</div>
            </div>
            <div class="summary-item">
                <div class="label">En Ruta</div>
                <div class="value">{{ $envios->where('estado', 'EN_RUTA')->count() }}</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Sistema de Gestión de Envíos - Página 1 de 1</p>
    </div>
</body>
</html>
