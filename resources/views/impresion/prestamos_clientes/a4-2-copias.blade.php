<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Préstamo Cliente #{{ $documento->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: white;
            padding: 0;
        }
        .page {
            width: 29.7cm;
            height: 21cm;
            background: white;
            page-break-after: always;
            padding: 0;
        }
        .copia {
            width: 47%;
            padding: 10px;
            box-sizing: border-box;
            border-right: 2px dashed #999;
            font-size: 11px;
            line-height: 1.3;
            overflow: hidden;
            float: left;
            margin-right: 1%;
        }
        .copia:last-child {
            border-right: none;
            float: right;
            margin-right: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 6px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }
        .header h3 {
            font-size: 12px;
            font-weight: bold;
            margin: 1px 0;
        }
        .header p {
            font-size: 9px;
            font-weight: bold;
            margin: 0;
        }
        .section-title {
            font-size: 9px;
            font-weight: bold;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 2px;
            margin: 3px 0;
            text-align: center;
        }
        .info-row {
            font-size: 9px;
            margin: 1px 0;
            line-height: 1.2;
        }
        .info-row strong {
            font-weight: bold;
        }
        .estado-box {
            text-align: center;
            border: 1px solid #000;
            padding: 2px;
            margin: 2px 0;
            font-weight: bold;
            font-size: 9px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2px 0;
            font-size: 8px;
        }
        table thead tr {
            border-bottom: 1px solid #000;
            background: #f5f5f5;
        }
        table th {
            padding: 1px;
            text-align: left;
            font-weight: bold;
        }
        table td {
            padding: 1px;
            border-bottom: 1px solid #ccc;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .firmas {
            margin-top: 4px;
            display: flex;
            gap: 6px;
            font-size: 8px;
        }
        .firma-box {
            flex: 1;
            text-align: center;
        }
        .firma-linea {
            border-bottom: 1px solid #000;
            height: 35px;
            margin-bottom: 1px;
        }
        .observaciones {
            font-size: 8px;
            margin: 2px 0;
            line-height: 1.2;
        }
    </style>
</head>
<body>
    @php
        // Determinar estado global del préstamo
        $estado = $documento->estado;
        if ($estado === 'COMPLETAMENTE_DEVUELTO') {
            $estadoClass = 'Estado: DEVUELTO ✓';
        } elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
            $estadoClass = 'Estado: PARCIAL ⚠';
        } else {
            $estadoClass = 'Estado: ACTIVO 📦';
        }
    @endphp

    <div class="page">
        <!-- COPIA 1 -->
        <div class="copia">
            <!-- Header -->
            <div class="header">
                <h3>Préstamo # <strong>{{ $documento->id }}</strong></h3>
                <p>PRÉSTAMO DE CANASTILLAS / EMBASES</p>
            </div>

            <!-- Garantía -->
            <div class="info-row">
                <strong>Garantía:</strong> Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
            </div>

            <!-- Fechas -->
            <div class="info-row">
                <strong>Fecha Creación:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}
            </div>
            <div class="info-row">
                <strong>Fecha Límite devolución:</strong> {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
            </div>

            <!-- Estado -->
            <div class="estado-box">{{ $estadoClass }}</div>

            @if($documento->venta)
                <div class="info-row">
                    <strong>Folio Venta:</strong> #{{ $documento->venta->id ?? 'N/D' }}
                </div>
            @endif

            <!-- Cliente -->
            <div class="section-title">CLIENTE</div>
            <div class="info-row">
                <strong>Nombre:</strong> {{ $documento->cliente->nombre ?? 'Sin nombre' }}
            </div>
            <div class="info-row">
                <strong>Razón Social:</strong> {{ $documento->cliente->razon_social ?? 'N/D' }}
            </div>
            <div class="info-row">
                <strong>Código:</strong> {{ $documento->cliente->codigo_cliente ?? 'N/D' }}
            </div>
            @if($documento->cliente->localidad)
                <div class="info-row">
                    <strong>Localidad:</strong> {{ $documento->cliente->localidad->nombre ?? 'N/D' }}
                </div>
            @endif
            @if($documento->cliente->telefono)
                <div class="info-row">
                    <strong>Tel.:</strong> {{ $documento->cliente->telefono }}
                </div>
            @endif

            @if($documento->chofer)
                <div class="info-row">
                    <strong>Chofer:</strong> {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                </div>
            @endif

            <!-- Detalle del Préstamo -->
            <div class="section-title">DETALLE DEL PRÉSTAMO</div>
            @if($documento->detalles && count($documento->detalles) > 0)
                <table>
                    <thead>
                        <tr>
                            <th>Prestable</th>
                            <th class="text-right">Prest</th>
                            <th class="text-right">Dev</th>
                            <th class="text-right">Pend</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($documento->detalles as $detalle)
                            @php
                                $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                                $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
                                $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                            @endphp
                            <tr>
                                <td>{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 15) }}</td>
                                <td class="text-right">{{ number_format($cantidadPrestada, 0) }}</td>
                                <td class="text-right">{{ number_format($cantidadDevuelta, 0) }}</td>
                                <td class="text-right"><strong>{{ number_format($cantidadPendiente, 0) }}</strong></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <table>
                    <thead>
                        <tr>
                            <th>Prestable</th>
                            <th class="text-right">Prest</th>
                            <th class="text-right">Dev</th>
                            <th class="text-right">Pend</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ substr($documento->prestable->nombre ?? 'Prestable', 0, 15) }}</td>
                            <td class="text-right">{{ number_format($documento->cantidad_prestada ?? $documento->cantidad ?? 0, 0) }}</td>
                            <td class="text-right">{{ number_format($documento->devoluciones->sum('cantidad_devuelta') ?? 0, 0) }}</td>
                            <td class="text-right"><strong>{{ number_format(($documento->cantidad_prestada ?? $documento->cantidad ?? 0) - ($documento->devoluciones->sum('cantidad_devuelta') ?? 0), 0) }}</strong></td>
                        </tr>
                    </tbody>
                </table>
            @endif

            @if(!empty($documento->observaciones))
                <div class="observaciones">
                    <strong>Obs.:</strong> {{ $documento->observaciones }}
                </div>
            @endif

            <!-- Avisos -->
            <div class="section-title" style="margin-top: 4px; font-size: 10px;">IMPORTANTE</div>
            <div class="info-row" style="font-size: 9px; text-align: center;">
                El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado. Producto dañado o faltante será cobrado.
            </div>

            <!-- Firmas -->
            <div class="firmas">
                <div class="firma-box">
                    <div class="firma-linea"></div>
                    <strong>Firma Cliente</strong>
                </div>
            </div>
        </div>

        <!-- COPIA 2 (Idéntica) -->
        <div class="copia">
            <!-- Header -->
            <div class="header">
                <h3>Préstamo # <strong>{{ $documento->id }}</strong></h3>
                <p>PRÉSTAMO DE CANASTILLAS / EMBASES</p>
            </div>

            <!-- Garantía -->
            <div class="info-row">
                <strong>Garantía:</strong> Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
            </div>

            <!-- Fechas -->
            <div class="info-row">
                <strong>Fecha Creación:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}
            </div>
            <div class="info-row">
                <strong>Fecha Límite devolución:</strong> {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
            </div>

            <!-- Estado -->
            <div class="estado-box">{{ $estadoClass }}</div>

            @if($documento->venta)
                <div class="info-row">
                    <strong>Folio Venta:</strong> #{{ $documento->venta->id ?? 'N/D' }}
                </div>
            @endif

            <!-- Cliente -->
            <div class="section-title">CLIENTE</div>
            <div class="info-row">
                <strong>Nombre:</strong> {{ $documento->cliente->nombre ?? 'Sin nombre' }}
            </div>
            <div class="info-row">
                <strong>Razón Social:</strong> {{ $documento->cliente->razon_social ?? 'N/D' }}
            </div>
            <div class="info-row">
                <strong>Código:</strong> {{ $documento->cliente->codigo_cliente ?? 'N/D' }}
            </div>
            @if($documento->cliente->localidad)
                <div class="info-row">
                    <strong>Localidad:</strong> {{ $documento->cliente->localidad->nombre ?? 'N/D' }}
                </div>
            @endif
            @if($documento->cliente->telefono)
                <div class="info-row">
                    <strong>Tel.:</strong> {{ $documento->cliente->telefono }}
                </div>
            @endif

            @if($documento->chofer)
                <div class="info-row">
                    <strong>Chofer:</strong> {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                </div>
            @endif

            <!-- Detalle del Préstamo -->
            <div class="section-title">DETALLE DEL PRÉSTAMO</div>
            @if($documento->detalles && count($documento->detalles) > 0)
                <table>
                    <thead>
                        <tr>
                            <th>Prestable</th>
                            <th class="text-right">Prest</th>
                            <th class="text-right">Dev</th>
                            <th class="text-right">Pend</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($documento->detalles as $detalle)
                            @php
                                $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                                $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
                                $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                            @endphp
                            <tr>
                                <td>{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 15) }}</td>
                                <td class="text-right">{{ number_format($cantidadPrestada, 0) }}</td>
                                <td class="text-right">{{ number_format($cantidadDevuelta, 0) }}</td>
                                <td class="text-right"><strong>{{ number_format($cantidadPendiente, 0) }}</strong></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <table>
                    <thead>
                        <tr>
                            <th>Prestable</th>
                            <th class="text-right">Prest</th>
                            <th class="text-right">Dev</th>
                            <th class="text-right">Pend</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ substr($documento->prestable->nombre ?? 'Prestable', 0, 15) }}</td>
                            <td class="text-right">{{ number_format($documento->cantidad_prestada ?? $documento->cantidad ?? 0, 0) }}</td>
                            <td class="text-right">{{ number_format($documento->devoluciones->sum('cantidad_devuelta') ?? 0, 0) }}</td>
                            <td class="text-right"><strong>{{ number_format(($documento->cantidad_prestada ?? $documento->cantidad ?? 0) - ($documento->devoluciones->sum('cantidad_devuelta') ?? 0), 0) }}</strong></td>
                        </tr>
                    </tbody>
                </table>
            @endif

            @if(!empty($documento->observaciones))
                <div class="observaciones">
                    <strong>Obs.:</strong> {{ $documento->observaciones }}
                </div>
            @endif

            <!-- Avisos -->
            <div class="section-title" style="margin-top: 4px; font-size: 10px;">IMPORTANTE</div>
            <div class="info-row" style="font-size: 9px; text-align: center;">
                El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado. Producto dañado o faltante será cobrado.
            </div>

            <!-- Firmas -->
            <div class="firmas">
                <div class="firma-box">
                    <div class="firma-linea"></div>
                    <strong>Firma Cliente</strong>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
