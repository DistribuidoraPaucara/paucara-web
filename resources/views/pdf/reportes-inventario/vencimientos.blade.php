<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Vencimientos</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #d32f2f; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 18px; color: #d32f2f; margin-bottom: 5px; }
        .header .empresa { font-size: 12px; color: #666; }
        .header .fecha { font-size: 10px; color: #999; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 8px; text-align: left; border-bottom: 2px solid #d32f2f; font-size: 10px; color: #d32f2f; font-weight: bold; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        tbody tr:nth-child(even) { background: #fafafa; }
        .numero { text-align: right; }
        .vencido { color: #d32f2f; font-weight: bold; }
        .proximo { color: #f57c00; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 9px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <div class="empresa">{{ $empresa }}</div>
        <h1>⚠️ Reporte de Vencimientos</h1>
        <div class="fecha">Generado: {{ $fecha_generacion }}</div>
    </div>

    <div style="margin: 20px 0;">
        @if(!empty($datos) && count($datos) > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%">Producto</th>
                        <th style="width: 15%">Lote</th>
                        <th style="width: 15%">Fecha Vencimiento</th>
                        <th style="width: 10%; text-align: right">Cantidad</th>
                        <th style="width: 15%">Estado</th>
                        <th style="width: 10%; text-align: right">Días</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($datos as $item)
                        <tr>
                            <td>{{ $item['nombre'] ?? 'N/A' }}</td>
                            <td>{{ $item['lote'] ?? 'N/A' }}</td>
                            <td>{{ $item['fecha_vencimiento'] ?? 'N/A' }}</td>
                            <td class="numero">{{ $item['cantidad'] ?? 0 }}</td>
                            <td class="{{ $item['estado'] === 'VENCIDO' ? 'vencido' : 'proximo' }}">
                                {{ $item['estado'] ?? 'N/A' }}
                            </td>
                            <td class="numero">{{ $item['dias_restantes'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="text-align: center; color: #999;">No hay datos disponibles</p>
        @endif
    </div>

    <div class="footer">
        <p>⚠️ Revisa regularmente los productos próximos a vencer</p>
    </div>
</body>
</html>
