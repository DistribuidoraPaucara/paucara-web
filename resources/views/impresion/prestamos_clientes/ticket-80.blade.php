@extends('impresion.layouts.base-ticket')

@section('contenido')
    @php
        // Determinar estado global del préstamo
        $estado = $documento->estado;
        if ($estado === 'COMPLETAMENTE_DEVUELTO') {
            $estadoClass = 'Estado: DEVUELTO';
        } elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
            $estadoClass = 'Estado: PARCIAL';
        } else {
            $estadoClass = 'Estado: ACTIVO';
        }

        // Calcular totales de devoluciones
        $totalDanoCobrado = 0;
        $totalGarantiaDevuelta = 0;
        $totalExcedido = 0;
        if($documento->devoluciones && count($documento->devoluciones) > 0) {
            foreach($documento->devoluciones as $devolucion) {
                $totalDanoCobrado += $devolucion->monto_cobrado_daño_total ?? 0;
                $totalGarantiaDevuelta += $devolucion->monto_garantia_devuelta_total ?? 0;
                $totalExcedido += $devolucion->monto_excedido_garantia ?? 0;
            }
        }
    @endphp

    <div class="ticket" style="font-size: 13px;">
        <div style="text-align: center;">
            <h3 class="text-center text-sm font-bold mb-1">Préstamo # <strong>{{ $documento->id }}</strong></h3>
            <p style="font-size: 12px; font-weight: bold;">PRÉSTAMO DE CANASTILLAS / EMBASES</p>
        </div>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <!-- INFORMACIÓN BÁSICA -->
        <p class="text-xs mb-1">
            <strong>Fecha:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}
            <br>
            <strong>Límite devolución:</strong> {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
        </p>

        <!-- GARANTÍA DESTACADA -->
        <p class="text-center text-xs font-bold mb-1" style="padding: 3px; border: 1px solid #000; background: #f0f0f0;">
            <strong>{{ $estadoClass }}</strong><br>
            Garantía: Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
        </p>

        @if($documento->venta)
            <p class="text-xs mb-1">
                <strong>Folio Venta:</strong> #{{ $documento->venta->id ?? 'N/D' }}
            </p>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <!-- INFORMACIÓN DE ALMACÉN Y VEHÍCULO -->
        <p class="text-xs mb-1">
            @if($documento->almacen)
                <strong>Almacén:</strong> {{ $documento->almacen->nombre ?? 'N/D' }}
                <br>
            @endif
            @if($documento->vehiculo)
                <strong>Vehículo:</strong> {{ $documento->vehiculo->placa ?? 'N/D' }}
                <br>
            @endif
        </p>

        <!-- INFORMACIÓN DEL CLIENTE -->
        <p class="text-xs mb-1">
            <strong>Cliente:</strong> {{ $documento->cliente->nombre ?? 'Sin nombre' }}
            <br>
            <strong>Razón Social:</strong> {{ $documento->cliente->razon_social ?? 'N/D' }}
            <br>
            <strong>Código:</strong> {{ $documento->cliente->codigo_cliente ?? 'N/D' }}
            @if($documento->cliente->localidad)
                <br>
                <strong>Localidad:</strong> {{ $documento->cliente->localidad->nombre ?? 'N/D' }}
            @endif
            @if($documento->cliente->telefono)
                <br>
                <strong>Tel.:</strong> {{ $documento->cliente->telefono }}
            @endif
        </p>

        @if($documento->chofer)
            <p class="text-xs mb-1">
                <strong>Chofer:</strong> {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
            </p>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

        <!-- DETALLE DEL PRÉSTAMO -->
        <p class="text-center text-xs font-bold mb-1"><strong>DETALLE DEL PRÉSTAMO</strong></p>

        @if($documento->detalles && count($documento->detalles) > 0)
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #000;">
                        <th style="text-align: left; padding: 2px; font-weight: bold; font-size: 11px;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 11px;">Prest</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 11px;">Dev</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold; font-size: 11px;">Pend</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
                            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                        @endphp
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="text-align: left; padding: 2px; font-size: 11px;">{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 12) }}</td>
                            <td style="text-align: center; padding: 2px; font-size: 11px;">{{ number_format($cantidadPrestada, 0) }}</td>
                            <td style="text-align: center; padding: 2px; font-size: 11px;">{{ number_format($cantidadDevuelta, 0) }}</td>
                            <td style="text-align: center; padding: 2px; font-weight: bold; font-size: 11px;">{{ number_format($cantidadPendiente, 0) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

        <!-- RESUMEN DE DEVOLUCIONES CON MONTOS -->
        @if($documento->devoluciones && count($documento->devoluciones) > 0)
            <p class="text-center text-xs font-bold mb-1"><strong>📋 HISTORIAL DEVOLUCIONES</strong></p>

            @foreach($documento->devoluciones as $index => $devolucion)
                <p class="text-xs mb-1" style="text-align: center; background: #f5f5f5; padding: 2px;">
                    <strong>Dev. #{{ $devolucion->id }}</strong> - {{ optional($devolucion->fecha_devolucion)->format('d/m/Y') }}
                </p>

                <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 3px;">
                    <thead>
                        <tr style="border-bottom: 1px solid #000;">
                            <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                            <th style="text-align: center; padding: 2px; font-weight: bold;">B</th>
                            <th style="text-align: center; padding: 2px; font-weight: bold;">D</th>
                            <th style="text-align: right; padding: 2px; font-weight: bold;">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($devolucion->detalles as $det)
                            <tr style="border-bottom: 1px solid #ccc;">
                                <td style="text-align: left; padding: 2px;">{{ substr($det->detallePrestamoCliente->prestable->nombre ?? 'N/D', 0, 10) }}</td>
                                <td style="text-align: center; padding: 2px;">{{ $det->cantidad_devuelta ?? 0 }}</td>
                                <td style="text-align: center; padding: 2px;">{{ $det->cantidad_dañada_total ?? 0 }}</td>
                                <td style="text-align: right; padding: 2px;">{{ number_format($det->monto_cobrado_daño ?? 0, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- RESUMEN FINANCIERO DE LA DEVOLUCIÓN -->
                <div style="border-left: 2px solid #000; padding-left: 4px; margin-bottom: 3px; font-size: 11px;">
                    <p style="margin: 1px 0;">
                        <strong>Daño Cobrado:</strong> Bs {{ number_format($devolucion->monto_cobrado_daño_total ?? 0, 2) }}
                    </p>
                    <p style="margin: 1px 0;">
                        <strong>Garantía Devuelta:</strong> Bs {{ number_format($devolucion->monto_garantia_devuelta_total ?? 0, 2) }}
                    </p>
                    @if(($devolucion->monto_excedido_garantia ?? 0) > 0)
                        <p style="margin: 1px 0; font-weight: bold; color: #d00;">
                            🚫 <strong>EXCESO A COBRAR:</strong> Bs {{ number_format($devolucion->monto_excedido_garantia ?? 0, 2) }}
                        </p>
                    @endif
                </div>
            @endforeach

            <!-- TOTALES GENERALES -->
            <div style="border-top: 2px solid #000; margin: 3px 0; padding-top: 3px;">
                <p class="text-xs font-bold mb-1" style="text-align: center; background: #f0f0f0; padding: 2px;">
                    <strong>TOTALES DEVOLUCIONES</strong>
                </p>
                <p style="margin: 1px 0; font-size: 11px;">
                    <strong>Total Daño Cobrado:</strong> Bs {{ number_format($totalDanoCobrado, 2) }}
                </p>
                <p style="margin: 1px 0; font-size: 11px;">
                    <strong>Total Garantía Devuelta:</strong> Bs {{ number_format($totalGarantiaDevuelta, 2) }}
                </p>
                @if($totalExcedido > 0)
                    <p style="margin: 1px 0; font-size: 11px; font-weight: bold; color: #d00;">
                        🚫 <strong>TOTAL EXCESO PENDIENTE:</strong> Bs {{ number_format($totalExcedido, 2) }}
                    </p>
                @endif
            </div>
        @endif

        <!-- LEYENDA DE SÍMBOLOS -->
        <p style="margin-top: 3px; text-align: center; font-size: 10px;">
            <strong>B=Bueno | D=Dañado</strong>
        </p>

        @if(!empty($documento->observaciones))
            <p class="text-xs mb-1">
                <strong>Obs.:</strong> {{ $documento->observaciones }}
            </p>
        @endif

        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <p class="text-[10px] text-center font-bold mb-1">
            <strong>IMPORTANTE</strong>
        </p>

        <p class="text-[10px] text-center" style="font-size: 11px;">
            El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado.
        </p>

        <p class="text-[10px] text-center mt-1" style="font-size: 11px;">
            Producto dañado o faltante será cobrado según tarifa vigente.
        </p>

        <!-- SEPARADOR FIRMAS -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <!-- ESPACIO DE FIRMAS -->
        <div style="margin-top: 6px;">
            <div style="display: flex; gap: 8px; justify-content: space-between;">
                <div style="text-align: center; flex: 1; font-size: 11px;">
                    <div style="border-bottom: 1px solid #000; height: 50px; margin-bottom: 2px;"></div>
                    <p style="margin: 0; font-weight: bold;">Firma Cliente</p>
                </div>
            </div>
        </div>
    </div>
@endsection
