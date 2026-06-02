{{-- Información de Confirmación de Entrega --}}
@if($documento->confirmaciones && $documento->confirmaciones->count() > 0)
    @php
        $confirmacion = $documento->confirmaciones->first();
    @endphp

    <div style="margin-top: 30px; page-break-before: auto;">
        <div style="border-top: 3px solid #007bff; padding-top: 15px; margin-bottom: 15px;">
            <h2 style="color: #007bff; margin: 0 0 15px 0;">📦 CONFIRMACIÓN DE ENTREGA</h2>
        </div>

        {{-- Estado General --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; background-color: #e3f2fd;">
                <strong>Tipo Entrega</strong>
                <p style="margin: 5px 0 0 0; font-size: 12px;">
                    {{ $confirmacion->tipo_entrega === 'COMPLETA' ? '✅ Completa' : '⚠️ Con Novedad' }}
                </p>
            </div>

            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; background-color: {{ $confirmacion->tuvo_problema ? '#ffebee' : '#e8f5e9' }};">
                <strong>Problemas</strong>
                <p style="margin: 5px 0 0 0; font-size: 12px;">
                    {{ $confirmacion->tuvo_problema ? '❌ Sí' : '✅ No' }}
                </p>
            </div>

            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; background-color: {{ $confirmacion->tienda_abierta ? '#e8f5e9' : '#fff3e0' }};">
                <strong>Tienda</strong>
                <p style="margin: 5px 0 0 0; font-size: 12px;">
                    {{ $confirmacion->tienda_abierta ? '🟢 Abierta' : '🔴 Cerrada' }}
                </p>
            </div>

            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; background-color: {{ $confirmacion->cliente_presente ? '#e8f5e9' : '#ffebee' }};">
                <strong>Cliente</strong>
                <p style="margin: 5px 0 0 0; font-size: 12px;">
                    {{ $confirmacion->cliente_presente ? '👤 Presente' : '👻 Ausente' }}
                </p>
            </div>
        </div>

        {{-- Información de Pago --}}
        <div style="border: 1px solid #81c784; background-color: #f1f8e9; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
            <h3 style="color: #558b2f; margin: 0 0 10px 0; font-size: 13px;">💰 INFORMACIÓN DE PAGO</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;">
                <div>
                    <strong style="font-size: 11px;">Estado</strong>
                    <p style="margin: 3px 0 0 0; font-size: 12px;">
                        @if($confirmacion->estado_pago === 'PAGADO')
                            ✅ Pagado Completamente
                        @elseif($confirmacion->estado_pago === 'PARCIAL')
                            ⚠️ Pago Parcial
                        @elseif($confirmacion->estado_pago === 'CREDITO')
                            💳 Crédito Total
                        @else
                            ❌ No Pagado
                        @endif
                    </p>
                </div>

                <div>
                    <strong style="font-size: 11px;">Dinero Recibido</strong>
                    <p style="margin: 3px 0 0 0; font-size: 12px; font-weight: bold; color: #558b2f;">
                        {{ $documento->moneda->simbolo ?? '$' }} {{ number_format($confirmacion->total_dinero_recibido ?? 0, 2, ',', '.') }}
                    </p>
                </div>

                <div>
                    <strong style="font-size: 11px;">Monto Pendiente</strong>
                    <p style="margin: 3px 0 0 0; font-size: 12px; font-weight: bold;">
                        {{ $documento->moneda->simbolo ?? '$' }} {{ number_format($confirmacion->monto_pendiente ?? 0, 2, ',', '.') }}
                    </p>
                </div>

                @if($confirmacion->tipoPago)
                    <div>
                        <strong style="font-size: 11px;">Tipo de Pago</strong>
                        <p style="margin: 3px 0 0 0; font-size: 12px;">{{ $confirmacion->tipoPago->nombre }}</p>
                    </div>
                @endif
            </div>
        </div>

        {{-- Desglose de Pagos --}}
        @if($confirmacion->desglose_pagos && count($confirmacion->desglose_pagos) > 0)
            <div style="margin-bottom: 15px;">
                <h3 style="color: #6a1b9a; margin: 0 0 10px 0; font-size: 13px;">📊 DESGLOSE DE PAGOS</h3>

                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                        <tr style="background-color: #f3e5f5; border-bottom: 2px solid #6a1b9a;">
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Tipo de Pago</th>
                            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($confirmacion->desglose_pagos as $pago)
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px; border: 1px solid #ddd;">{{ $pago['tipo_pago_nombre'] ?? 'Desconocido' }}</td>
                                <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                                    {{ $documento->moneda->simbolo ?? '$' }} {{ number_format($pago['monto'] ?? 0, 2, ',', '.') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        {{-- Devoluciones Parciales --}}
        @if($confirmacion->productos_devueltos && count($confirmacion->productos_devueltos) > 0)
            <div style="margin-bottom: 15px; page-break-inside: avoid;">
                <h3 style="color: #e65100; margin: 0 0 10px 0; font-size: 13px;">🔄 PRODUCTOS DEVUELTOS ({{ count($confirmacion->productos_devueltos) }})</h3>

                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                        <tr style="background-color: #ffe0b2; border-bottom: 2px solid #e65100;">
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Producto</th>
                            <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $totalDevuelto = 0; @endphp
                        @foreach($confirmacion->productos_devueltos as $producto)
                            @php $totalDevuelto += $producto['subtotal'] ?? 0; @endphp
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px; border: 1px solid #ddd;">{{ $producto['producto_nombre'] ?? 'Producto desconocido' }}</td>
                                <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{ $producto['cantidad'] ?? 0 }}</td>
                                <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                                    {{ $documento->moneda->simbolo ?? '$' }} {{ number_format($producto['subtotal'] ?? 0, 2, ',', '.') }}
                                </td>
                            </tr>
                        @endforeach
                        <tr style="background-color: #fff8f5; border-top: 2px solid #e65100; font-weight: bold;">
                            <td colspan="2" style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total Devuelto:</td>
                            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">
                                {{ $documento->moneda->simbolo ?? '$' }} {{ number_format($totalDevuelto, 2, ',', '.') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        @endif

        {{-- Observaciones de Entrega --}}
        @if($confirmacion->observaciones_logistica)
            <div style="border-left: 4px solid #757575; padding-left: 12px; margin-bottom: 15px; background-color: #f5f5f5; padding: 12px;">
                <h3 style="color: #424242; margin: 0 0 8px 0; font-size: 13px;">📝 OBSERVACIONES</h3>
                <p style="margin: 0; font-size: 11px; white-space: pre-wrap; line-height: 1.5;">{{ $confirmacion->observaciones_logistica }}</p>
            </div>
        @endif

        

        {{-- Información de Confirmación --}}
        <div style="border: 1px solid #ccc; padding: 12px; background-color: #fafafa; font-size: 11px;">
            <h3 style="margin: 0 0 8px 0; color: #424242; font-size: 12px;">ℹ️ INFORMACIÓN DE CONFIRMACIÓN</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                @if($confirmacion->confirmadobPor)
                    <div>
                        <strong>Confirmado por:</strong>
                        <p style="margin: 3px 0 0 0;">{{ $confirmacion->confirmadobPor->name }}</p>
                    </div>
                @endif

                @if($confirmacion->confirmado_en)
                    <div>
                        <strong>Fecha de Confirmación:</strong>
                        <p style="margin: 3px 0 0 0;">{{ \Carbon\Carbon::parse($confirmacion->confirmado_en)->format('d/m/Y H:i:s') }}</p>
                    </div>
                @endif
            </div>
        </div>
    </div>

@endif
