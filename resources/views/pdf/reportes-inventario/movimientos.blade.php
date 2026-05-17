<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Movimientos</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #7b1fa2; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 18px; color: #7b1fa2; margin-bottom: 5px; }
        .header .empresa { font-size: 12px; color: #666; }
        .header .fecha { font-size: 10px; color: #999; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 9px; }
        th { background: #f5f5f5; padding: 6px; text-align: left; border-bottom: 2px solid #7b1fa2; font-size: 9px; color: #7b1fa2; font-weight: bold; }
        td { padding: 6px; border-bottom: 1px solid #eee; }
        tbody tr:nth-child(even) { background: #fafafa; }
        .numero { text-align: right; }
        .entrada { color: #388e3c; font-weight: bold; }
        .salida { color: #d32f2f; font-weight: bold; }
        .ajuste { color: #1976d2; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 8px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <div class="empresa">{{ $empresa }}</div>
        <h1>📋 Reporte de Movimientos</h1>
        <div class="fecha">Generado: {{ $fecha_generacion }}</div>
    </div>

    <div style="margin: 20px 0;">
        @if(!empty($datos) && count($datos) > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 12%">Fecha</th>
                        <th style="width: 20%">Producto</th>
                        <th style="width: 12%">Tipo</th>
                        <th style="width: 10%; text-align: right">Cantidad</th>
                        <th style="width: 15%">Almacén</th>
                        <th style="width: 20%">Referencia</th>
                        <th style="width: 11%">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($datos as $item)
                        <tr>
                            <td>{{ $item['fecha'] ?? 'N/A' }}</td>
                            <td>{{ substr($item['nombre'] ?? 'N/A', 0, 20) }}</td>
                            <td>
                                <span class="{{ $item['tipo'] === 'ENTRADA' ? 'entrada' : ($item['tipo'] === 'SALIDA' ? 'salida' : 'ajuste') }}">
                                    {{ substr($item['tipo'] ?? 'N/A', 0, 3) }}
                                </span>
                            </td>
                            <td class="numero">{{ number_format($item['cantidad'] ?? 0, 0) }}</td>
                            <td>{{ substr($item['almacen'] ?? 'N/A', 0, 12) }}</td>
                            <td style="font-size: 8px;">{{ substr($item['referencia'] ?? '-', 0, 15) }}</td>
                            <td>{{ substr($item['usuario'] ?? '-', 0, 8) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="text-align: center; color: #999;">No hay movimientos registrados</p>
        @endif
    </div>

    <div class="footer">
        <p>Historial de movimientos de inventario</p>
    </div>
</body>
</html>
