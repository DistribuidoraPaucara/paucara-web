@extends('impresion.layouts.base-ticket-simple')

@section('titulo', 'Entrega #' . $entrega->id)

@section('contenido')
<div class="ticket" style="font-size: 12px; font-family: Arial, sans-serif;">

    <div class="documento-titulo" style="margin-bottom: 3px; font-size: 15px;">ENTREGA #{{ $entrega->id }}</div>
    <!-- <div class="documento-numero" style="font-weight: bold;">{{ $entrega->numero_entrega }}</div> -->
    <div class="center">
        <strong>{{ $entrega->fecha_asignacion->format('d/m/Y H:i') }} | {{ $entrega->estado }}</strong>
    </div>

    <div class="separador"></div>

    {{-- LISTA GENÉRICA AGRUPADA --}}
    @php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
    $estadisticas = $impresionService->obtenerEstadisticas($entrega);
    @endphp

    {{-- INFORMACIÓN DEL CHOFER Y VEHÍCULO --}}
    <!-- <p style="font-weight: bold; text-align: center; margin: 3px 0;">CHOFER Y VEHÍCULO</p> -->
    <table style="width: 100%; font-size: 13px;">
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
                <!-- @if($entrega->peso_kg)
                    <div style="margin: 0.5px 0;"><strong>Peso:</strong> {{ number_format($entrega->peso_kg, 2) }} kg</div>
                @endif -->
            </td>
        </tr>
    </table>

    {{-- ✅ NUEVO: LOCALIDADES --}}
    @if($localidades && $localidades->count() > 0)
    <div style="margin: 3px 0; padding: 3px; border: 1px solid #999; border-radius: 3px; background-color: #f0f8ff; font-size: 12px;">
        <p style="margin: 2px 0; font-weight: bold;">Localidades:</p>
        <div style="margin: 0 px;">
            @foreach($localidades as $localidad)
            <p style="margin: 1px 0; padding-left: 5px;">• {{ $localidad?->nombre }} @if($localidad?->codigo)({{ $localidad?->codigo }})@endif</p>
            @endforeach
        </div>
    </div>
    @endif

    {{-- INFORMACIÓN DE PESO --}}
    <div style="margin: 3px 0; padding: 3px; border: 1px solid #999; border-radius: 3px; font-size: 12px;">
        <p style="margin: 2px 0; text-align: center; font-weight: bold;">PESO DE LA ENTREGA</p>
        <!-- <p style="margin: 2px 0;"><strong>Peso Total:</strong> {{ number_format($entrega->peso_kg ?? 0, 2) }} kg</p> -->
        @if($entrega->vehiculo && $entrega->vehiculo?->capacidad_kg)
        @php
        $pesoTotal = $entrega->peso_kg ?? 0;
        $capacidad = $entrega->vehiculo?->capacidad_kg ?? 0;
        $porcentajeUso = $capacidad > 0 ? ($pesoTotal / $capacidad) * 100 : 0;
        $colorEstado = $porcentajeUso > 100 ? '#0E0D0D' : ($porcentajeUso > 80 ? '#070707' : '#0B0C0B');
        @endphp
        <div style="margin: 2px 0;"><strong>Cap. Vehículo:</strong> {{ number_format($entrega->vehiculo?->capacidad_kg, 1) }} kg / <strong>P. Entrega: </strong> {{ number_format($entrega->peso_kg ?? 0, 2) }} kg
            <small style="margin: 2px 0; color: {{ $colorEstado }}; font-weight: bold;">
                Uso: {{ number_format($porcentajeUso, 1) }}%
                @if($porcentajeUso > 100)
                    EXCESO
                @elseif($porcentajeUso > 80)
                    ALTO
                @else
                    OK
                @endif
            </small>
        </div>
        @endif
    </div>

    <!-- <div class="separador"></div> -->

    {{-- LISTA GENÉRICA --}}

    <p style="font-weight: bold; text-align: center; margin: 3px 0; text-decoration: underline;">LISTA GENÉRICA</p>

    <table style="width: 100%; margin-bottom: 3px; border-collapse: collapse; font-size: 13px;">
        <thead>
            <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left; padding: 1px 0;">Producto</th>
                <th style="text-align: center; width: 15%; padding: 1px 0;">Cant.</th>
                <th style="text-align: right; width: 20%; padding: 1px 0;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($productosGenerico as $producto)
                <tr style="border-bottom: 1px dotted #999;">
                    <td style="padding: 1px 0;">{{ substr($producto['producto_nombre'], 0, 22) }}</td>
                    <td style="padding: 1px 0; text-align: center; width: 15%;"> {{ number_format($producto['cantidad_total'], 1) }}</td>
                    <td style="padding: 1px 0; text-align: right; width: 20%; font-size: 12px; font-weight: bold;">{{ number_format($producto['subtotal_total'], 2) }}</td>
                </tr>
                {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
            @if($producto['es_combo'] && !empty($producto['componentes']))
                @foreach($producto['componentes'] as $componente)
                <tr style="border-bottom: 1px dotted #ccc;">
                    <td style="padding: 1px 0; padding-left: 8px; font-size: 11px;">{{ substr($componente['producto_nombre'], 0, 20) }}</td>
                    <td style="padding: 1px 0; text-align: center; width: 15%; font-size: 11px;">{{ number_format($componente['cantidad'], 1) }}</td>
                    <td style="padding: 1px 0; text-align: right; width: 20%;"></td>
                </tr>
                @endforeach
            @endif
            @empty
                <tr>
                    <td colspan="3" style="text-align: center; padding: 4px; color: #999;">Sin productos</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div style="border-top: 1px dashed #000; padding: 2px 0; margin-bottom: 5px;">
        <div style="text-align: right;"><strong>Total: {{ number_format($estadisticas['total_subtotal'], 2) }}</strong> </div>
        <div>{{ $estadisticas['total_items_unicos'] }} items | {{ (int)$estadisticas['total_cantidad'] }} cantidades | {{ $estadisticas['total_clientes'] }} clientes</div>
    </div>

    <div class="separador"></div>

    {{-- RESUMEN PARA CHOFER (UNIFICADO) --}}
    <p style="font-weight: bold; text-align: center; margin: 3px 0;">RESUMEN CHOFER</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 3px;">
        <thead>
            <tr style="border-bottom: 2px solid #000;">
                <th style="text-align: left; padding: 2px; font-size: 10px; font-weight: bold; width: 8%;">Folio</th>
                <th style="text-align: left; padding: 2px; font-size: 10px; font-weight: bold; width: 18%;">Cliente</th>
                <th style="text-align: center; padding: 2px; font-size: 10px; font-weight: bold; width: 12%;">T. Pago</th>
                <th style="text-align: left; padding: 2px; font-size: 10px; font-weight: bold; width: 14%;">Estado</th>
                <th style="text-align: right; padding: 2px; font-size: 10px; font-weight: bold; width: 12%;">Monto</th>
            </tr>
        </thead>
        <tbody>
            @php $totalGeneral = 0; @endphp
            @foreach($entrega->ventas as $venta)
                @php
                    $subtotalVenta = $venta->detalles->sum('subtotal');
                    $totalGeneral += $subtotalVenta;
                    // Buscar confirmación de esta venta en resumen_pagos
                    $confirmacionVenta = null;
                    if($resumen_pagos && isset($resumen_pagos['confirmaciones'])) {
                    $confirmacionVenta = collect($resumen_pagos['confirmaciones'])->firstWhere('venta_id', $venta->id);
                    }
                    // Obtener estado logístico: primero desde confirmación, si no desde la venta directamente
                    $estadoLogistico = $confirmacionVenta['estado_logistico'] ?? $venta->estado_logistico ?? 'N/A';
                @endphp
                <tr style="border-bottom: 1px dotted #999; @if($confirmacionVenta && $confirmacionVenta['tuvo_problema']) background-color: #fff3e0; @endif">
                    <td style="padding: 2px; font-size: 12px; width: 8%;">#{{ $venta->id }}</td>
                    <td style="padding: 2px; font-size: 12px; width: 18%;">{{ substr($venta->cliente?->nombre ?? 'S/N', 0, 10) }}</td>
                    <td style="padding: 2px; font-size: 12px; text-align: center; width: 12%;">{{ substr($venta->tipoPago?->codigo ?? $venta->estado_pago ?? 'S/N', 0, 3) }}</td>
                    <td style="padding: 2px; font-size: 12px; width: 14%;">{{ substr($estadoLogistico, 0, 10) }}</td>
                    <td style="padding: 2px; font-size: 12px; text-align: right; width: 12%; font-weight: bold;">{{ number_format($subtotalVenta, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="border-top: 2px solid #000; margin-top: 3px; padding: 2px 0; text-align: right;">
        <p style="font-weight: bold; margin: 2px 0;">TOTAL: {{ number_format($totalGeneral, 2) }}</p>
    </div>

    {{-- ✅ NUEVA 2026-02-12: RESUMEN DE PAGOS --}}
    @if($resumen_pagos)
        <p style="font-weight: bold; text-align: center; margin: 0 px;">RESUMEN DE PAGOS</p>

        {{-- Totales principales --}}
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 3px;">
            <tbody>
                <tr style="border: 1px solid #999;">
                    <td style="padding: 2px; width: 50%;"><strong>Total Esperado:</strong></td>
                    <td style="padding: 2px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['total_esperado'], 2) }}</td>
                </tr>
                <tr style="border: 1px solid #999; background-color: #f0f0f0;">
                    <td style="padding: 2px; width: 50%;"><strong>Recibido:</strong></td>
                    <td style="padding: 2px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['total_recibido'], 2) }}</td>
                </tr>
                <tr style="border: 1px solid #999;">
                    <td style="padding: 2px; width: 50%;"><strong>Falta:</strong></td>
                    <td style="padding: 2px; text-align: right; font-weight: bold;">{{ number_format($resumen_pagos['diferencia'], 2) }}</td>
                </tr>
            </tbody>
        </table>

        {{-- Barra de progreso --}}
        <div style="margin: 2px 0; padding: 2px; border: 1px solid #999;">
            <div style="margin: 2px 0;">
                <span style="font-weight: bold;">{{ $resumen_pagos['porcentaje_recibido'] }}%</span>
            </div>
            <div style="width: 100%; height: 6px; background-color: #e0e0e0; border-radius: 2px; overflow: hidden;">
                <div style="width: {{ min($resumen_pagos['porcentaje_recibido'], 100) }}%; height: 100%; background-color: #434A43;"></div>
            </div>
        </div>

        {{-- Desglose por tipo de pago --}}
        @if(count($resumen_pagos['pagos']) > 0)
            <div style="margin: 3px 0; padding: 2px; border: 1px solid #999;">
                <p style="font-weight: bold; margin: 2px 0;">Desglose:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        @foreach($resumen_pagos['pagos'] as $pago)
                        <tr style="border-bottom: 1px dotted #999;">
                            {{-- ✅ ACTUALIZADO 2026-02-16: Usar código en lugar de nombre para evitar discrepancias --}}
                            <td style="padding: 1px 2px;">{{ substr($pago['tipo_pago_codigo'] ?? $pago['tipo_pago'], 0, 15) }}</td>
                            <td style="padding: 1px 2px; text-align: right; font-weight: bold;">{{ number_format($pago['total'], 2) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    @endif



    <!-- <div class="separador"></div> -->

    {{-- ✅ FIRMAS DEL CLIENTE --}}
    <div style="margin-bottom: 15px !important; margin-top: 55px !important;">
        <div style="height: 0; border-bottom: 1px solid #000; margin-bottom: 5px !important;"></div>
        <p style="text-align: center; margin: 2px 0 !important;">Firma / Sello</p>
    </div>

</div>

@endsection