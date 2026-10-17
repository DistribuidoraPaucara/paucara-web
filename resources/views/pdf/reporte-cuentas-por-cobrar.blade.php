<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Cuentas por Cobrar</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; color: #111827; }
        h1 { font-size: 16px; margin: 0 0 4px 0; }
        .subtitulo { font-size: 10px; color: #6b7280; margin-bottom: 10px; }
        .filtros { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .filtros td { padding: 3px 6px; border: 1px solid #e5e7eb; background: #f9fafb; }
        .filtros td.etiqueta { width: 15%; font-weight: bold; color: #374151; }
        table.listado { width: 100%; border-collapse: collapse; }
        table.listado th { background: #f3f4f6; border: 1px solid #d1d5db; padding: 5px 4px; text-align: left; font-size: 9px; text-transform: uppercase; }
        table.listado td { border: 1px solid #e5e7eb; padding: 4px; vertical-align: top; }
        .num { text-align: right; white-space: nowrap; }
        .centro { text-align: center; }
        .vencido { color: #b91c1c; font-weight: bold; }
        .totales td { background: #f3f4f6; font-weight: bold; border-top: 2px solid #374151; }
        .vacio { text-align: center; padding: 20px; color: #6b7280; }
        tr.fila-principal td { background: #dbeafe; font-weight: bold; border: 1px solid #93c5fd; padding: 5px 4px; }
        td.subfila { background: #f8fafc; padding: 3px 10px 8px 22px; border: 1px solid #e5e7eb; border-top: none; }
        table.detalle { width: 100%; border-collapse: collapse; font-size: 9px; }
        table.detalle th { background: #e5e7eb; border: 1px solid #d1d5db; padding: 3px 4px; text-align: left; }
        table.detalle td { border: 1px solid #e5e7eb; padding: 3px 4px; }
    </style>
</head>
<body>
    <h1>Reporte de Cuentas por Cobrar</h1>
    <div class="subtitulo">Generado el {{ $fecha_generacion }} &middot; {{ $cuentas->count() }} cuenta(s)</div>

    <table class="filtros">
        @foreach ($filtrosAplicados as $etiqueta => $valor)
            <tr>
                <td class="etiqueta">{{ $etiqueta }}</td>
                <td>{{ $valor }}</td>
            </tr>
        @endforeach
    </table>

    <table class="listado">
        <thead>
            <tr>
                <th class="centro">Folio</th>
                <th class="centro">Venta</th>
                <th>Cliente</th>
                <th class="num">Monto original</th>
                <th class="num">Saldo</th>
                <th class="centro">Creación</th>
                <th class="centro">Vencimiento</th>
                <th class="centro">Días vencido</th>
                <th class="centro">Estado</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($cuentas as $cuenta)
                @php
                    $estado = strtoupper($cuenta->estado ?? '');
                    $mostrarDias = ! in_array($estado, ['PAGADO', 'ANULADO']);
                @endphp
                <tr class="fila-principal">
                    <td class="centro">#{{ $cuenta->id }}</td>
                    <td class="centro">
                        {{ $cuenta->venta ? '#' . $cuenta->venta->id : '—' }}
                        @if ($cuenta->referencia_documento)
                            <br>{{ $cuenta->referencia_documento }}
                        @endif
                    </td>
                    <td>{{ $cuenta->cliente?->nombre ?? $cuenta->venta?->cliente?->nombre ?? 'Sin cliente' }}</td>
                    <td class="num">{{ number_format($cuenta->monto_original, 2, '.', ',') }}</td>
                    <td class="num">{{ number_format($cuenta->saldo_pendiente, 2, '.', ',') }}</td>
                    <td class="centro">{{ optional($cuenta->created_at)->format('d/m/Y') }}</td>
                    <td class="centro">{{ \Carbon\Carbon::parse($cuenta->fecha_vencimiento)->format('d/m/Y') }}</td>
                    <td class="centro {{ $mostrarDias && $cuenta->dias_vencido > 0 ? 'vencido' : '' }}">
                        {{ $mostrarDias ? $cuenta->dias_vencido : '—' }}
                    </td>
                    <td class="centro">{{ $estado }}</td>
                </tr>
                @if ($cuenta->venta && $cuenta->venta->detalles->isNotEmpty())
                    <tr>
                        <td colspan="9" class="subfila">
                            <table class="detalle">
                                <thead>
                                    <tr>
                                        <th class="centro">Cant.</th>
                                        <th>SKU</th>
                                        <th>Producto</th>
                                        <th class="num">P. unitario</th>
                                        <th class="num">Descuento</th>
                                        <th class="num">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($cuenta->venta->detalles as $detalle)
                                        <tr>
                                            <td class="centro">{{ rtrim(rtrim(number_format($detalle->cantidad, 3, '.', ''), '0'), '.') }}</td>
                                            <td>{{ $detalle->producto?->sku ?? '—' }}</td>
                                            <td>{{ $detalle->producto?->nombre ?? 'Producto eliminado' }}</td>
                                            <td class="num">{{ number_format($detalle->precio_unitario, 2, '.', ',') }}</td>
                                            <td class="num">{{ number_format($detalle->descuento, 2, '.', ',') }}</td>
                                            <td class="num">{{ number_format($detalle->subtotal, 2, '.', ',') }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif
            @empty
                <tr>
                    <td colspan="9" class="vacio">No hay cuentas con los filtros aplicados.</td>
                </tr>
            @endforelse
        </tbody>
        @if ($cuentas->isNotEmpty())
            <tfoot>
                <tr class="totales">
                    <td colspan="3" class="num">Totales</td>
                    <td class="num">{{ number_format($totalMonto, 2, '.', ',') }}</td>
                    <td class="num">{{ number_format($totalSaldo, 2, '.', ',') }}</td>
                    <td colspan="4"></td>
                </tr>
            </tfoot>
        @endif
    </table>
</body>
</html>
