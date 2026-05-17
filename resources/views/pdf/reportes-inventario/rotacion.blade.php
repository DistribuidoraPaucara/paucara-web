<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Rotación</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1976d2; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 18px; color: #1976d2; margin-bottom: 5px; }
        .header .empresa { font-size: 12px; color: #666; }
        .header .fecha { font-size: 10px; color: #999; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 8px; text-align: left; border-bottom: 2px solid #1976d2; font-size: 10px; color: #1976d2; font-weight: bold; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        tbody tr:nth-child(even) { background: #fafafa; }
        .numero { text-align: right; }
        .alto { color: #388e3c; font-weight: bold; }
        .medio { color: #f57c00; }
        .bajo { color: #d32f2f; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 9px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <div class="empresa">{{ $empresa }}</div>
        <h1>📊 Reporte de Rotación</h1>
        <div class="fecha">Generado: {{ $fecha_generacion }}</div>
    </div>

    <div style="margin: 20px 0;">
        @if(!empty($datos) && count($datos) > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%">Producto</th>
                        <th style="width: 12%; text-align: right">Entrada</th>
                        <th style="width: 12%; text-align: right">Salida</th>
                        <th style="width: 12%; text-align: right">Rotación</th>
                        <th style="width: 15%">Clasificación</th>
                        <th style="width: 15%; text-align: right">Velocidad</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($datos as $item)
                        <tr>
                            <td>{{ $item['nombre'] ?? 'N/A' }}</td>
                            <td class="numero">{{ number_format($item['entrada'] ?? 0, 0) }}</td>
                            <td class="numero">{{ number_format($item['salida'] ?? 0, 0) }}</td>
                            <td class="numero">{{ number_format($item['rotacion'] ?? 0, 1) }}</td>
                            <td>
                                <span class="{{ $item['clasificacion'] === 'ALTO' ? 'alto' : ($item['clasificacion'] === 'MEDIO' ? 'medio' : 'bajo') }}">
                                    {{ $item['clasificacion'] ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="numero">{{ $item['velocidad'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="text-align: center; color: #999;">No hay datos disponibles</p>
        @endif
    </div>

    <div class="footer">
        <p>Análisis de rotación de inventario</p>
    </div>
</body>
</html>
