<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Compras</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 5px 0;
            font-size: 18px;
            color: #1a1a1a;
        }
        .header p {
            margin: 3px 0;
            font-size: 10px;
            color: #666;
        }
        .period {
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f0f0f0;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
            font-size: 10px;
        }
        td {
            padding: 6px 8px;
            border: 1px solid #ddd;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-top: 15px;
            margin-bottom: 10px;
            color: #1a1a1a;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 9px;
            color: #999;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        .value {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>REPORTE DE COMPRAS</h1>
        <p>{{ config('app.name') }}</p>
        <p>Período: {{ $fecha_desde }} al {{ $fecha_hasta }}</p>
    </div>

    <!-- Estadísticas Generales -->
    <div class="section-title">📊 ESTADÍSTICAS GENERALES</div>
    <table>
        <tr>
            <th>Total Compras</th>
            <th>Cantidad Compras</th>
            <th>Promedio</th>
            <th>Variación Mes Anterior</th>
        </tr>
        <tr>
            <td class="text-right value">Bs. {{ number_format($estadisticas['total_compras_periodo'], 2) }}</td>
            <td class="text-center">{{ (int)$estadisticas['cantidad_compras_periodo'] }}</td>
            <td class="text-right">Bs. {{ number_format($estadisticas['promedio_compra_periodo'], 2) }}</td>
            <td class="text-right">{{ number_format($estadisticas['variacion_mes_anterior'], 2) }}%</td>
        </tr>
    </table>

    <!-- Compras por Proveedor -->
    <div class="section-title">🏢 COMPRAS POR PROVEEDOR</div>
    <table>
        <tr>
            <th>Proveedor</th>
            <th class="text-right">Total</th>
            <th class="text-center">Cantidad</th>
            <th class="text-right">Promedio</th>
            <th class="text-right">%</th>
        </tr>
        @foreach($proveedores as $proveedor)
        <tr>
            <td>{{ $proveedor['proveedor']['nombre'] }}</td>
            <td class="text-right">Bs. {{ number_format($proveedor['total_compras'], 2) }}</td>
            <td class="text-center">{{ (int)$proveedor['cantidad_compras'] }}</td>
            <td class="text-right">Bs. {{ number_format($proveedor['promedio_compra'], 2) }}</td>
            <td class="text-right">{{ number_format($proveedor['porcentaje_total'], 2) }}%</td>
        </tr>
        @endforeach
    </table>

    <!-- Compras por Categoría -->
    <div class="section-title">📦 COMPRAS POR CATEGORÍA</div>
    <table>
        <tr>
            <th>Categoría</th>
            <th class="text-right">Total</th>
            <th class="text-center">Cantidad</th>
            <th class="text-right">%</th>
        </tr>
        @foreach($categorias as $categoria)
        <tr>
            <td>{{ $categoria['categoria'] }}</td>
            <td class="text-right">Bs. {{ number_format($categoria['total_compras'], 2) }}</td>
            <td class="text-center">{{ (int)$categoria['cantidad_compras'] }}</td>
            <td class="text-right">{{ number_format($categoria['porcentaje_total'], 2) }}%</td>
        </tr>
        @endforeach
    </table>

    <!-- Resumen por Período -->
    <div class="section-title">📈 RESUMEN POR PERÍODO</div>
    <table>
        <tr>
            <th>Período</th>
            <th class="text-right">Total</th>
            <th class="text-center">Cantidad</th>
            <th class="text-right">Promedio</th>
            <th class="text-right">Variación</th>
        </tr>
        @foreach($periodos as $periodo)
        <tr>
            <td>{{ $periodo['periodo'] }}</td>
            <td class="text-right">Bs. {{ number_format($periodo['total_compras'], 2) }}</td>
            <td class="text-center">{{ (int)$periodo['cantidad_compras'] }}</td>
            <td class="text-right">Bs. {{ number_format($periodo['promedio_compra'], 2) }}</td>
            <td class="text-right">{{ number_format($periodo['variacion_anterior'], 2) }}%</td>
        </tr>
        @endforeach
    </table>

    <!-- Footer -->
    <div class="footer">
        <p>Generado el {{ $fecha_generacion }}</p>
        <p>Este documento es confidencial</p>
    </div>
</body>
</html>
