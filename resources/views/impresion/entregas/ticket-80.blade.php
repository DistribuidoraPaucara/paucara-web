@extends('impresion.layouts.base-ticket-simple')

@section('titulo', 'Entrega #' . $entrega->numero_entrega)

@section('contenido')
<div style="width: 100%;">

    <div class="documento-titulo" style="margin-bottom: 3px;">ENTREGA N° {{ $entrega->id }}</div>
    <div class="documento-numero" style="font-weight: bold;">{{ $entrega->numero_entrega }}</div>
    <div class="center" style="margin-bottom: 5px;">
        {{ $entrega->fecha_asignacion->format('d/m/Y H:i') }} | {{ $entrega->estado }}
    </div>

    <div class="separador mt-2 mb-2"></div>

    {{-- LISTA GENÉRICA AGRUPADA --}}
    @php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
    $estadisticas = $impresionService->obtenerEstadisticas($entrega);
    @endphp

    {{-- INFORMACIÓN DEL CHOFER Y VEHÍCULO --}}
    <p style="font-weight: bold; text-align: center; margin: 3px 0;">CHOFER Y VEHÍCULO</p>

    @if($entrega->chofer)
    <div style="margin: 2px 0;">
        <p style="margin: 2px 0;"><strong>Chofer:</strong> {{ $entrega->chofer?->name ?? $entrega->chofer?->nombre ?? 'S/N' }}</p>
        @if($entrega->chofer?->phone ?? false)
        <p style="margin: 2px 0;"><strong>Teléfono:</strong> {{ $entrega->chofer?->phone }}</p>
        @endif
    </div>
    @else
    <p style="margin: 2px 0; color: #999;">Sin chofer asignado</p>
    @endif

    @if($entrega->vehiculo)
    <div style="margin: 2px 0;">
        <p style="margin: 2px 0;"><strong>Placa:</strong> {{ $entrega->vehiculo?->placa }}</p>
        @if($entrega->vehiculo?->marca)
        <p style="margin: 2px 0;"><strong>Marca:</strong> {{ $entrega->vehiculo?->marca }}</p>
        @endif
        @if($entrega->vehiculo?->modelo)
        <p style="margin: 2px 0;"><strong>Modelo:</strong> {{ $entrega->vehiculo?->modelo }}</p>
        @endif
    </div>
    @else
    <p style="margin: 2px 0; color: #999;">Sin vehículo asignado</p>
    @endif

    {{-- ✅ NUEVO: ENTREGADOR --}}
    @if($entrega->entregador)
    <div style="margin: 3px 0; padding: 3px; border: 1px solid #999; border-radius: 3px; background-color: #f9f9f9;">
        <p style="margin: 2px 0;"><strong>Entregador:</strong> {{ $entrega->entregador?->name ?? $entrega->entregador?->nombre ?? 'S/N' }}</p>
        @if($entrega->entregador?->phone ?? false)
        <p style="margin: 2px 0;"><strong>Teléfono:</strong> {{ $entrega->entregador?->phone }}</p>
        @endif
    </div>
    @endif

    {{-- ✅ NUEVO: LOCALIDADES --}}
    @if($localidades && $localidades->count() > 0)
    <div style="margin: 3px 0; padding: 3px; border: 1px solid #999; border-radius: 3px; background-color: #f0f8ff;">
        <p style="margin: 2px 0; font-weight: bold;">Localidades:</p>
        <div style="margin: 2px 0;">
            @foreach($localidades as $localidad)
            <p style="margin: 1px 0; padding-left: 5px;">• {{ $localidad?->nombre }} @if($localidad?->codigo)({{ $localidad?->codigo }})@endif</p>
            @endforeach
        </div>
    </div>
    @endif

    {{-- INFORMACIÓN DE PESO --}}
    <div style="margin: 3px 0; padding: 3px; border: 1px solid #999; border-radius: 3px;">
        <p style="margin: 2px 0; text-align: center; font-weight: bold;">PESO DE LA ENTREGA</p>
        <p style="margin: 2px 0;"><strong>Peso Total:</strong> {{ number_format($entrega->peso_kg ?? 0, 2) }} kg</p>
        @if($entrega->vehiculo && $entrega->vehiculo?->capacidad_kg)
        <p style="margin: 2px 0;"><strong>Capacidad Vehículo:</strong> {{ number_format($entrega->vehiculo?->capacidad_kg, 1) }} kg</p>
        @php
        $pesoTotal = $entrega->peso_kg ?? 0;
        $capacidad = $entrega->vehiculo?->capacidad_kg ?? 0;
        $porcentajeUso = $capacidad > 0 ? ($pesoTotal / $capacidad) * 100 : 0;
        $colorEstado = $porcentajeUso > 100 ? '#0E0D0D' : ($porcentajeUso > 80 ? '#070707' : '#0B0C0B');
        @endphp
        <p style="margin: 2px 0; color: {{ $colorEstado }}; font-weight: bold;">
            Uso: {{ number_format($porcentajeUso, 1) }}%
            @if($porcentajeUso > 100)
            ⚠ EXCESO
            @elseif($porcentajeUso > 80)
            ⚡ ALTO
            @else
            ✓ OK
            @endif
        </p>
        @endif
    </div>

    <div class="separador"></div>

    {{-- LISTA GENÉRICA --}}

    <p style="font-weight: bold; text-align: center; margin: 3px 0; text-decoration: underline;">LISTA GENÉRICA</p>

    <table style="width: 100%; margin-bottom: 3px; border-collapse: collapse;">
        <tbody>
            @forelse($productosGenerico as $producto)
            <tr style="border-bottom: 1px dotted #999;">
                <td style="padding: 1px 0;">@if($producto['es_combo']) @endif{{ substr($producto['producto_nombre'], 0, 22) }}</td>
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
        <div style="text-align: right;">Total: {{ number_format($estadisticas['total_subtotal'], 2) }}</div>
        <div>{{ $estadisticas['total_items_unicos'] }} items | {{ $estadisticas['total_clientes'] }} clientes</div>
    </div>

    <div class="separador"></div>

    {{-- RESUMEN PARA CHOFER --}}
    <p style="font-weight: bold; text-align: center; margin: 3px 0;">RESUMEN CHOFER</p>

    <table style="width: 100%; border-collapse: collapse;">
        <tbody>
            @php $totalGeneral = 0; @endphp
            @foreach($entrega->ventas as $venta)
            @php $subtotalVenta = $venta->detalles->sum('subtotal'); $totalGeneral += $subtotalVenta; @endphp
            <tr style="border-bottom: 1px dotted #000;">
                <td style="padding: 2px 2px;">F.:{{ $venta->id }} | {{ substr($venta->cliente?->nombre ?? 'S/N', 0, 18) }}</td>
                <td style="padding: 2px 2px; text-align: center; font-size: 11px;">{{ substr($venta->tipoPago?->codigo ?? $venta->estado_pago, 0, 5) }}</td>
                <td style="padding: 2px 2px; text-align: right; font-weight: bold;">{{ number_format($subtotalVenta, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="border-top: 2px solid #000; margin-top: 3px; padding: 2px 0; text-align: right;">
        <p style="font-weight: bold; margin: 2px 0;">TOTAL: {{ number_format($totalGeneral, 2) }}</p>
    </div>

    <div class="separador"></div>

    {{-- ✅ NUEVA 2026-02-21: TIPO DE ENTREGA Y NOVEDADES --}}
    @if($resumen_pagos && isset($resumen_pagos['confirmaciones']) && count($resumen_pagos['confirmaciones']) > 0)
    <p style="font-weight: bold; text-align: center; margin: 3px 0;">📦 TIPO DE ENTREGA</p>

    @foreach($resumen_pagos['confirmaciones'] as $conf)
    <div style="margin: 3px 0; padding: 2px 3px; border: 1px solid #999; @if($conf['tuvo_problema']) background-color: #fff3e0; @endif">
        {{-- Venta ID y Tipo Entrega --}}
        <p style="margin: 1px 0; font-weight: bold;">F.:{{ $conf['venta_id'] }} | {{ $conf['tipo_entrega'] === 'COMPLETA' ? '✅ Completa' : '⚠️ Con Novedad' }}</p>

        {{-- Tipo Novedad si aplica --}}
        @if($conf['tipo_novedad'])
        <p style="margin: 1px 0; padding-left: 5px;">{{ $conf['tipo_novedad'] }}</p>
        @endif

        {{-- Productos devueltos si aplica --}}
        @if($conf['tipo_novedad'] === 'DEVOLUCION_PARCIAL' && $conf['productos_devueltos'] && count($conf['productos_devueltos']) > 0)
        <div style="margin: 2px 0; padding: 2px; background-color: #f5f5f5; border-left: 2px solid #ff9800;">
            <p style="margin: 1px 0; font-weight: bold; font-size: 10px;">Productos Devueltos:</p>
            @foreach($conf['productos_devueltos'] as $prod)
            <p style="margin: 0px 0; padding-left: 5px; font-size: 10px;">
                • {{ substr($prod['producto_nombre'] ?? 'N/A', 0, 20) }} x{{ $prod['cantidad'] ?? 0 }} = {{ number_format($prod['subtotal'] ?? 0, 2) }}
            </p>
            @endforeach
            <p style="margin: 1px 0; padding-left: 5px; font-weight: bold; font-size: 10px;">
                Total Dev: {{ number_format($conf['monto_devuelto'], 2) }}
            </p>
        </div>
        @endif
    </div>
    @endforeach

    <div class="separador"></div>
    @endif

    {{-- ✅ NUEVA 2026-02-12: RESUMEN DE PAGOS --}}
    @if($resumen_pagos)
    <p style="font-weight: bold; text-align: center; margin: 3px 0;">💳 RESUMEN DE PAGOS</p>

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

    {{-- Ventas sin pago --}}
    @if(count($resumen_pagos['sin_registrar']) > 0)
    <div style="margin: 3px 0; padding: 2px; border: 2px solid #111110; background-color: #fff3e0;">
        <p style="font-weight: bold; margin: 2px 0; color: #0C0C0C;">SIN PAGO ({{ count($resumen_pagos['sin_registrar']) }})</p>
        @foreach($resumen_pagos['sin_registrar'] as $venta)
        <p style="margin: 1px 0; color: #171616;">{{ $venta['venta_numero'] }}: {{ number_format($venta['monto'], 2) }}</p>
        @endforeach
    </div>
    @endif
    @endif

    

    <div class="separador"></div>

     {{-- ✅ FIRMAS DEL CLIENTE --}}
    <div style="margin-top: 130px !important;">
        <div style="margin-bottom: 35px !important; padding-bottom: 35px !important;">
            <div style="height: 0; border-bottom: 1px solid #000; margin-bottom: 5px !important;"></div>
            <p style="text-align: center; margin: 2px 0 !important;">Firma / Sello</p>
        </div>
    </div>

</div>

@endsection
