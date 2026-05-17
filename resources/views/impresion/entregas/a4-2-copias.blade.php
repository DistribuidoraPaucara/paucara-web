<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrega #{{ $entrega->numero_entrega }}</title>
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
            width: 49%;
            padding: 2px;
            box-sizing: border-box;
            border-right: 2px dashed #999;
            font-size: 12px;
            line-height: 1.15;
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
            margin-bottom: 3px;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }
        .header h3 {
            font-size: 12px;
            font-weight: bold;
            margin: 0.5px 0;
        }
        .header p {
            font-size: 11px;
            font-weight: bold;
            margin: 0;
        }
        .section-title {
            font-size: 11px;
            font-weight: bold;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 1px;
            margin: 1px 0;
            text-align: center;
        }
        .info-row {
            font-size: 11px;
            margin: 0.5px 0;
            line-height: 1.1;
        }
        .info-row strong {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1px 0;
            font-size: 11px;
        }
        table thead tr {
            border-bottom: 1px solid #000;
            background: #f5f5f5;
        }
        table th {
            padding: 0.5px;
            text-align: left;
            font-weight: bold;
        }
        table td {
            padding: 0.5px;
            border-bottom: 1px solid #ccc;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .resumen-box {
            border: 1px solid #000;
            padding: 1px;
            margin: 1px 0;
            font-size: 11px;
        }
        .separador {
            border-top: 1px dashed #999;
            margin: 1px 0;
        }
        .firmas {
            margin-top: 1px;
            font-size: 11px;
        }
        .firma-linea {
            border-bottom: 1px solid #000;
            height: 20px;
            margin-bottom: 1px;
        }
    </style>
</head>
<body>
    @php
        $impresionService = app(\App\Services\ImpresionEntregaService::class);
        $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
        $estadisticas = $impresionService->obtenerEstadisticas($entrega);
    @endphp

    <div class="page">
        <!-- COPIA 1 -->
        <div class="copia">
            <!-- Header -->
            <div class="header">
                <h3>ENTREGA N° {{ $entrega->id }}</h3>
                <p>{{ $entrega->numero_entrega }} | {{ $entrega->fecha_asignacion->format('d/m/Y H:i') }}</p>
            </div>

            <!-- Chofer y Vehículo -->
            <div class="section-title">CHOFER Y VEHÍCULO</div>
            <table style="width: 100%; font-size: 11px;">
                <tr>
                    <td style="width: 50%; padding: 0.5px; vertical-align: top;">
                        @if($entrega->chofer)
                            <div style="margin: 0.5px 0;"><strong>Chofer:</strong> {{ substr($entrega->chofer?->name ?? $entrega->chofer?->nombre ?? 'S/N', 0, 12) }}</div>
                            @if($entrega->chofer?->phone)
                                <div style="margin: 0.5px 0; font-size: 10px;">{{ $entrega->chofer?->phone }}</div>
                            @endif
                        @else
                            <div style="margin: 0.5px 0; color: #999;">Sin chofer</div>
                        @endif
                        @if($entrega->vehiculo)
                            <div style="margin: 0.5px 0;"><strong>Placa:</strong> {{ $entrega->vehiculo?->placa }} | {{ substr($entrega->vehiculo?->marca, 0, 12) }} </div>
                        @endif
                    </td>
                    <td style="width: 50%; padding: 0.5px; vertical-align: top;">
                        @if($entrega->entregador)
                            <div style="margin: 0.5px 0;"><strong>Entregador:</strong> {{ substr($entrega->entregador?->name ?? $entrega->entregador?->nombre ?? 'S/N', 0, 12) }}</div>
                        @endif
                        @if($entrega->peso_kg)
                            <div style="margin: 0.5px 0;"><strong>Peso:</strong> {{ number_format($entrega->peso_kg, 2) }} kg</div>
                        @endif
                    </td>
                </tr>
            </table>

            <!-- Localidades -->
            @if($localidades && $localidades->count() > 0)
                <div class="info-row">
                    <strong>Localidades:</strong>
                    @foreach($localidades as $loc)
                        {{ $loc?->nombre }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </div>
            @endif

            

            <!-- Lista Genérica -->
            <div class="section-title">LISTA GENÉRICA</div>
            <table>
                <thead>
                    <tr>
                        <th class="text-center" style="width: 20px;">#</th>
                        <th>Producto</th>
                        <th class="text-right">Cant</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($productosGenerico as $producto)
                        <tr>
                            <td class="text-center" style="font-size: 10px;">{{ $loop->iteration }}</td>
                            <td>@if($producto['es_combo']) 📦 @endif{{ substr($producto['producto_nombre'], 0, 18) }}</td>
                            <td class="text-right">{{ number_format($producto['cantidad_total'], 1) }}</td>
                            <td class="text-right">{{ number_format($producto['subtotal_total'], 2) }}</td>
                        </tr>
                        {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
                        @if($producto['es_combo'] && !empty($producto['componentes']))
                            @foreach($producto['componentes'] as $componente)
                            <tr style="font-size: 10px; background-color: #f9f9f9;">
                                <td></td>
                                <td style="padding-left: 15px;">└─ {{ substr($componente['producto_nombre'], 0, 20) }}</td>
                                <td class="text-right">{{ number_format($componente['cantidad'], 1) }}</td>
                                <td></td>
                            </tr>
                            @endforeach
                        @endif
                    @empty
                        <tr>
                            <td colspan="4" class="text-center">Sin productos</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            <!-- Resumen Lista -->
            <div style="border-top: 1px dashed #000; padding: 1px 0; margin: 1px 0; font-size: 10px;">
                <div style="text-align: right; font-weight: bold;">Total: {{ number_format($estadisticas['total_subtotal'], 2) }}</div>
                <div>{{ $estadisticas['total_items_unicos'] }} items | {{ $estadisticas['total_clientes'] }} clientes</div>
            </div>

            <!-- Resumen Chofer -->
            @php
                $confirmacionesPorVenta = collect($resumen_pagos['confirmaciones'] ?? [])->keyBy('venta_id')->toArray();
            @endphp
            <div class="section-title">LISTA VENTAS / RESUMEN CHOFER</div>
            <table>
                <thead>
                    <tr>
                        <th class="text-center">Folio</th>
                        <th>Cliente</th>
                        <th class="text-center" style="font-size: 9px;">Est./Nov</th>
                        <th class="text-center" style="font-size: 9px;">Pago</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($entrega->ventas as $venta)
                        @php
                            $conf = $confirmacionesPorVenta[$venta->id] ?? null;
                            $estado = $conf['tipo_entrega'] ?? 'COMPLETA';
                            $tipoNovedad = $conf['tipo_novedad'] ?? null;
                        @endphp
                        <tr>
                            <td class="text-center">{{ $venta->id }}</td>
                            <td style="font-size: 11px;">{{ substr($venta->cliente?->nombre ?? 'S/N', 0, 11) }}</td>
                            <td class="text-center" style="font-size: 9px;">
                                {{ $estado === 'COMPLETA' ? 'OK' : 'NOV' }}
                                @if($tipoNovedad)
                                    <br><span style="font-size: 8px;">{{ substr($tipoNovedad, 0, 8) }}</span>
                                @endif
                            </td>
                            <td class="text-center" style="font-size: 9px;">{{ substr($venta->tipoPago?->codigo ?? $venta->estado_pago, 0, 4) }}</td>
                            <td class="text-right">{{ number_format($venta->total, 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center">Sin ventas</td>
                        </tr>
                    @endforelse
                    <tr style="font-weight: bold; border-top: 1px solid #000;">
                        <td colspan="4" class="text-right">TOTAL:</td>
                        <td class="text-right">{{ number_format($entrega->ventas->sum('total'), 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Tipo de Entrega -->
            @php
                $confirmaciones = $resumen_pagos['confirmaciones'] ?? [];
            @endphp
            {{-- @if(!empty($confirmaciones))
                <div class="section-title">TIPO ENTREGA</div>
                @foreach($confirmaciones as $conf)
                    <div style="margin: 1px 0; padding: 1px; border: 1px solid #999; font-size: 10px; @if($conf['tuvo_problema']) background-color: #fff3e0; @endif">
                        <p style="margin: 0.5px 0; font-weight: bold;">F.:{{ $conf['venta_id'] }} | {{ $conf['tipo_entrega'] === 'COMPLETA' ? 'OK' : 'NOV' }}</p>
                        @if($conf['tipo_novedad'])
                            <p style="margin: 0.5px 0; padding-left: 3px;">{{ $conf['tipo_novedad'] }}</p>
                        @endif
                        @if($conf['tipo_novedad'] === 'DEVOLUCION_PARCIAL' && $conf['productos_devueltos'] && count($conf['productos_devueltos']) > 0)
                            <div style="margin: 1px 0; padding: 1px; background-color: #f5f5f5; border-left: 2px solid #ff9800; font-size: 9px;">
                                <p style="margin: 0.5px 0; font-weight: bold;">Devueltos:</p>
                                @foreach($conf['productos_devueltos'] as $prod)
                                    <p style="margin: 0; padding-left: 3px;">• {{ substr($prod['producto_nombre'] ?? 'N/A', 0, 12) }} x{{ $prod['cantidad'] ?? 0 }}</p>
                                @endforeach
                            </div>
                        @endif
                    </div>
                @endforeach
            @endif --}}

            <!-- Resumen de Pagos (Unificado) -->
            @if($resumen_pagos)
                <div class="section-title">RESUMEN DE PAGOS</div>

                <!-- Desglose por tipo de pago -->
                @if(isset($resumen_pagos['pagos']) && count($resumen_pagos['pagos']) > 0)
                    <table style="margin: 1px 0;">
                        <tbody>
                            @foreach($resumen_pagos['pagos'] as $pago)
                                <tr style="font-size: 10px;">
                                    <td>{{ $pago['tipo_pago_codigo'] ?? 'Otro' }}</td>
                                    <td class="text-right">{{ number_format($pago['total'], 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div style="border-top: 1px dashed #999; margin: 1px 0;"></div>
                @endif

                <!-- Totales principales -->
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Total Esperado:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['total_esperado'], 2) }}</td>
                        </tr>
                        <tr style="background-color: #f0f0f0;">
                            <td><strong>Recibido:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['total_recibido'], 2) }}</td>
                        </tr>
                        <tr>
                            <td><strong>Falta:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['diferencia'], 2) }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Barra de Progreso -->
                {{-- @php
                    $porcentaje = $resumen_pagos['porcentaje_recibido'] ?? 0;
                @endphp
                <div class="info-row" style="margin: 1px 0; font-size: 10px;">
                    <strong>Recaudación: {{ number_format($porcentaje, 0) }}%</strong>
                </div>
                <div style="width: 100%; height: 6px; background: #eee; border: 1px solid #ccc; overflow: hidden; margin: 1px 0;">
                    <div style="height: 100%; width: {{ $porcentaje }}%; background: {{ $porcentaje >= 100 ? '#4CAF50' : ($porcentaje >= 50 ? '#FFC107' : '#F44336') }};"></div>
                </div> --}}

                <!-- Sin Pago -->
                @if(count($resumen_pagos['sin_registrar']) > 0)
                    <div class="resumen-box" style="background-color: #fff3e0; margin-top: 1px;">
                        <strong style="font-size: 11px;">SIN PAGO ({{ count($resumen_pagos['sin_registrar']) }})</strong>
                        @foreach($resumen_pagos['sin_registrar'] as $venta)
                            <div style="font-size: 10px;">{{ $venta['venta_numero'] }}: {{ number_format($venta['monto'], 2) }}</div>
                        @endforeach
                    </div>
                @endif
            @endif

            <!-- Firmas -->
            <div class="firmas">
                <div class="firma-linea"></div>
                <div class="text-center"><strong>Firma Chofer</strong></div>
            </div>
        </div>

        <!-- COPIA 2 (Idéntica) -->
        <div class="copia">
            <!-- Header -->
            <div class="header">
                <h3>ENTREGA N° {{ $entrega->id }}</h3>
                <p>{{ $entrega->numero_entrega }} | {{ $entrega->fecha_asignacion->format('d/m/Y H:i') }}</p>
            </div>

            <!-- Chofer y Vehículo -->
            <div class="section-title">CHOFER Y VEHÍCULO</div>
            <table style="width: 100%; font-size: 11px;">
                <tr>
                    <td style="width: 50%; padding: 0.5px; vertical-align: top;">
                        @if($entrega->chofer)
                            <div style="margin: 0.5px 0;"><strong>Chofer:</strong> {{ substr($entrega->chofer?->name ?? $entrega->chofer?->nombre ?? 'S/N', 0, 12) }}</div>
                            @if($entrega->chofer?->phone)
                                <div style="margin: 0.5px 0; font-size: 10px;">{{ $entrega->chofer?->phone }}</div>
                            @endif
                        @else
                            <div style="margin: 0.5px 0; color: #999;">Sin chofer</div>
                        @endif
                        @if($entrega->vehiculo)
                            <div style="margin: 0.5px 0;"><strong>Placa:</strong> {{ $entrega->vehiculo?->placa }} | {{ substr($entrega->vehiculo?->marca, 0, 12) }}</div>
                        @endif
                    </td>
                    <td style="width: 50%; padding: 0.5px; vertical-align: top;">
                        @if($entrega->entregador)
                            <div style="margin: 0.5px 0;"><strong>Entregador:</strong> {{ substr($entrega->entregador?->name ?? $entrega->entregador?->nombre ?? 'S/N', 0, 12) }}</div>
                        @endif
                        @if($entrega->peso_kg)
                            <div style="margin: 0.5px 0;"><strong>Peso:</strong> {{ number_format($entrega->peso_kg, 2) }} kg</div>
                        @endif
                    </td>
                </tr>
            </table>

            <!-- Localidades -->
            @if($localidades && $localidades->count() > 0)
                <div class="info-row">
                    <strong>Localidades:</strong>
                    @foreach($localidades as $loc)
                        {{ $loc?->nombre }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </div>
            @endif

            <!-- Lista Genérica -->
            <div class="section-title">LISTA GENÉRICA</div>
            <table>
                <thead>
                    <tr>
                        <th class="text-center" style="width: 20px;">#</th>
                        <th>Producto</th>
                        <th class="text-right">Cant</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($productosGenerico as $producto)
                        <tr>
                            <td class="text-center" style="font-size: 10px;">{{ $loop->iteration }}</td>
                            <td>@if($producto['es_combo']) 📦 @endif{{ substr($producto['producto_nombre'], 0, 18) }}</td>
                            <td class="text-right">{{ number_format($producto['cantidad_total'], 1) }}</td>
                            <td class="text-right">{{ number_format($producto['subtotal_total'], 2) }}</td>
                        </tr>
                        {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
                        @if($producto['es_combo'] && !empty($producto['componentes']))
                            @foreach($producto['componentes'] as $componente)
                            <tr style="font-size: 10px; background-color: #f9f9f9;">
                                <td></td>
                                <td style="padding-left: 15px;">└─ {{ substr($componente['producto_nombre'], 0, 20) }}</td>
                                <td class="text-right">{{ number_format($componente['cantidad'], 1) }}</td>
                                <td></td>
                            </tr>
                            @endforeach
                        @endif
                    @empty
                        <tr>
                            <td colspan="4" class="text-center">Sin productos</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            <!-- Resumen Lista -->
            <div style="border-top: 1px dashed #000; padding: 1px 0; margin: 1px 0; font-size: 10px;">
                <div style="text-align: right; font-weight: bold;">Total: {{ number_format($estadisticas['total_subtotal'], 2) }}</div>
                <div>{{ $estadisticas['total_items_unicos'] }} items | {{ $estadisticas['total_clientes'] }} clientes</div>
            </div>

            <!-- Resumen Chofer -->
            @php
                $confirmacionesPorVenta = collect($resumen_pagos['confirmaciones'] ?? [])->keyBy('venta_id')->toArray();
            @endphp
            <div class="section-title">LISTA VENTAS / RESUMEN CHOFER</div>
            <table>
                <thead>
                    <tr>
                        <th class="text-center">Folio</th>
                        <th>Cliente</th>
                        <th class="text-center" style="font-size: 9px;">Est./Nov</th>
                        <th class="text-center" style="font-size: 9px;">Pago</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($entrega->ventas as $venta)
                        @php
                            $conf = $confirmacionesPorVenta[$venta->id] ?? null;
                            $estado = $conf['tipo_entrega'] ?? 'COMPLETA';
                            $tipoNovedad = $conf['tipo_novedad'] ?? null;
                        @endphp
                        <tr>
                            <td class="text-center">{{ $venta->id }}</td>
                            <td style="font-size: 11px;">{{ substr($venta->cliente?->nombre ?? 'S/N', 0, 11) }}</td>
                            <td class="text-center" style="font-size: 9px;">
                                {{ $estado === 'COMPLETA' ? 'OK' : 'NOV' }}
                                @if($tipoNovedad)
                                    <br><span style="font-size: 8px;">{{ substr($tipoNovedad, 0, 8) }}</span>
                                @endif
                            </td>
                            <td class="text-center" style="font-size: 9px;">{{ substr($venta->tipoPago?->codigo ?? $venta->estado_pago, 0, 4) }}</td>
                            <td class="text-right">{{ number_format($venta->total, 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center">Sin ventas</td>
                        </tr>
                    @endforelse
                    <tr style="font-weight: bold; border-top: 1px solid #000;">
                        <td colspan="4" class="text-right">TOTAL:</td>
                        <td class="text-right">{{ number_format($entrega->ventas->sum('total'), 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Tipo de Entrega -->
            @php
                $confirmaciones = $resumen_pagos['confirmaciones'] ?? [];
            @endphp
            {{-- @if(!empty($confirmaciones))
                <div class="section-title">TIPO ENTREGA</div>
                @foreach($confirmaciones as $conf)
                    <div style="margin: 1px 0; padding: 1px; border: 1px solid #999; font-size: 10px; @if($conf['tuvo_problema']) background-color: #fff3e0; @endif">
                        <p style="margin: 0.5px 0; font-weight: bold;">F.:{{ $conf['venta_id'] }} | {{ $conf['tipo_entrega'] === 'COMPLETA' ? 'OK' : 'NOV' }}</p>
                        @if($conf['tipo_novedad'])
                            <p style="margin: 0.5px 0; padding-left: 3px;">{{ $conf['tipo_novedad'] }}</p>
                        @endif
                        @if($conf['tipo_novedad'] === 'DEVOLUCION_PARCIAL' && $conf['productos_devueltos'] && count($conf['productos_devueltos']) > 0)
                            <div style="margin: 1px 0; padding: 1px; background-color: #f5f5f5; border-left: 2px solid #ff9800; font-size: 9px;">
                                <p style="margin: 0.5px 0; font-weight: bold;">Devueltos:</p>
                                @foreach($conf['productos_devueltos'] as $prod)
                                    <p style="margin: 0; padding-left: 3px;">• {{ substr($prod['producto_nombre'] ?? 'N/A', 0, 12) }} x{{ $prod['cantidad'] ?? 0 }}</p>
                                @endforeach
                            </div>
                        @endif
                    </div>
                @endforeach
            @endif --}}

            <!-- Resumen de Pagos (Unificado) -->
            @if($resumen_pagos)
                <div class="section-title">RESUMEN DE PAGOS</div>

                <!-- Desglose por tipo de pago -->
                @if(isset($resumen_pagos['pagos']) && count($resumen_pagos['pagos']) > 0)
                    <table style="margin: 1px 0;">
                        <tbody>
                            @foreach($resumen_pagos['pagos'] as $pago)
                                <tr style="font-size: 10px;">
                                    <td>{{ $pago['tipo_pago_codigo'] ?? 'Otro' }}</td>
                                    <td class="text-right">{{ number_format($pago['total'], 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div style="border-top: 1px dashed #999; margin: 1px 0;"></div>
                @endif

                <!-- Totales principales -->
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Total Esperado:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['total_esperado'], 2) }}</td>
                        </tr>
                        <tr style="background-color: #f0f0f0;">
                            <td><strong>Recibido:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['total_recibido'], 2) }}</td>
                        </tr>
                        <tr>
                            <td><strong>Falta:</strong></td>
                            <td class="text-right">{{ number_format($resumen_pagos['diferencia'], 2) }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Barra de Progreso -->
                {{-- @php
                    $porcentaje = $resumen_pagos['porcentaje_recibido'] ?? 0;
                @endphp
                <div class="info-row" style="margin: 1px 0; font-size: 10px;">
                    <strong>Recaudación: {{ number_format($porcentaje, 0) }}%</strong>
                </div>
                <div style="width: 100%; height: 6px; background: #eee; border: 1px solid #ccc; overflow: hidden; margin: 1px 0;">
                    <div style="height: 100%; width: {{ $porcentaje }}%; background: {{ $porcentaje >= 100 ? '#4CAF50' : ($porcentaje >= 50 ? '#FFC107' : '#F44336') }};"></div>
                </div> --}}

                <!-- Sin Pago -->
                @if(count($resumen_pagos['sin_registrar']) > 0)
                    <div class="resumen-box" style="background-color: #fff3e0; margin-top: 1px;">
                        <strong style="font-size: 11px;">SIN PAGO ({{ count($resumen_pagos['sin_registrar']) }})</strong>
                        @foreach($resumen_pagos['sin_registrar'] as $venta)
                            <div style="font-size: 10px;">{{ $venta['venta_numero'] }}: {{ number_format($venta['monto'], 2) }}</div>
                        @endforeach
                    </div>
                @endif
            @endif

            <!-- Firmas -->
            <div class="firmas">
                <div class="firma-linea"></div>
                <div class="text-center"><strong>Firma Chofer</strong></div>
            </div>
        </div>
    </div>
</body>
</html>
