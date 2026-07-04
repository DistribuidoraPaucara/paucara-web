@extends('impresion.layouts.base-ticket')
@section('titulo', 'Prestamo Eventos Folio #' . $documento->id)
@section('contenido')
    @php
        // Determinar estado global del préstamo
        $estado = $documento->estado;
        if ($estado === 'COMPLETAMENTE_DEVUELTO') {
            $estadoClass = 'DEVUELTO';
            $estadoColor = '#070707';
        } elseif ($estado === 'PARCIALMENTE_DEVUELTO') {
            $estadoClass = 'PARCIAL';
            $estadoColor = '#070707';
        } else {
            $estadoClass = 'ACTIVO';
            $estadoColor = '#070707';
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

        // Calcular totales
        $totalPrestado = 0;
        $totalDevuelto = 0;
        $totalPendiente = 0;
        foreach ($documento->detalles ?? [] as $detalle) {
            $prest = $detalle->cantidad_prestada ?? 0;
            $dev = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
            $totalPrestado += $prest;
            $totalDevuelto += $dev;
            $totalPendiente += ($prest - $dev);
        }
    @endphp

    <div class="ticket" style="font-size: 12px; font-family: Arial, sans-serif;">
        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 4px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 2px 0;">PRÉSTAMO EVENTO #{{ $documento->id }}</h3>
        </div>

        <!-- ESTADO DESTACADO -->
        <p style="text-align: center; padding: 3px; font-weight: bold; font-size: 12px; margin: 3px 0;">
            {{ $documento->estado }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>
        <!-- FECHAS Y GARANTÍA -->
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 3px 0; line-height: 1.3;">
            <tr>
                <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top;">
                    <strong>Préstamo:</strong><br>
                    {{ $documento->fecha_prestamo->format('d/m/Y') }}
                </td>
                <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top; text-align: right;">
                    <strong>Devolución:</strong><br>
                    {{ $documento->fecha_esperada_devolucion?->format('d/m/Y') ?? 'N/D' }}
                </td>
            </tr>
        </table>
        
        <!-- GARANTÍA DESTACADA -->
        <div class="text-center text-xs font-bold mb-1">
            <p style="padding: 3px; text-align: center;"><strong>Garantía: Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}</strong></p>
            @if($documento->devoluciones && count($documento->devoluciones) > 0)
                <p style="margin: 1px 0; font-size: 12px;">
                    <strong>Monto Daño Cobrado:</strong> Bs {{ number_format($totalDanoCobrado, 2) }}
                </p>
                @if($totalExcedido > 0)
                    <p style="margin: 1px 0; font-size: 12px; font-weight: bold; color: rgb(11, 11, 11);">
                        <strong>TOTAL EXCESO PENDIENTE:</strong> Bs {{ number_format($totalExcedido, 2) }}
                    </p>
                @endif
            @endif
        </div>

        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- INFORMACIÓN DEL EVENTO -->
        <p style="margin: 2px 0; font-size: 12px;">
            <strong>{{ $documento->nombre_evento ?? 'Sin nombre' }}</strong> 
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 2px 0;">
            <tr>
                <td style="width: 34%; padding: 2px 4px 2px 0; vertical-align: top;">
                    <strong>Encargado:</strong><br>
                    {{ $documento->encargado_evento ?? 'N/D' }}
                </td>
                <td style="width: 33%; padding: 2px 2px; vertical-align: top; text-align: center;">
                    <strong>Tel. 1:</strong><br>
                    {{ $documento->telefono_uno ?? 'N/D' }}
                </td>
                <td style="width: 33%; padding: 2px 0 2px 4px; vertical-align: top; text-align: right;">
                    <strong>Tel. 2:</strong><br>
                    {{ $documento->telefono_dos ?? 'N/D' }}
                </td>
            </tr>
        </table>

        <!-- UBICACIÓN DEL PRÉSTAMO -->
        @if($documento->ubicacion)
            @php
                $ubicacion = $documento->ubicacion;
            @endphp
            <div style="padding-left: 4px; margin: 2px 0; font-size: 12px; padding: 2px;">
                @if($ubicacion->direccion)
                    <p style="margin: 1px 0; font-size: 12px;">
                        <strong>Dir:</strong> {{ substr($ubicacion->direccion, 0, 35) }}
                    </p>
                @endif
                @if($ubicacion->localidad)
                    <p style="margin: 1px 0; font-size: 12px;">
                        <strong>Localidad:</strong> {{ $ubicacion->localidad->nombre ?? 'N/D' }}
                    </p>
                @endif
            </div>
        @endif

        <!-- LOGÍSTICA -->
        @if($documento->vehiculo_asignado || $documento->chofer)
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 2px 0;">
                <tr>
                    <td style="width: 50%; padding: 2px 0 2px 4px; vertical-align: top;">
                        @if($documento->chofer)
                            <strong>Chofer:</strong><br>
                            {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                        @endif
                    </td>
                    <td style="width: 50%; padding: 2px 4px 2px 0; vertical-align: top;  text-align: right;">
                        @if($documento->vehiculo_asignado)
                            <strong>Vehículo:</strong><br>
                            {{ $documento->vehiculo_asignado }}
                        @endif
                    </td>
                    
                </tr>
            </table>
        @endif

        <!-- ALMACÉN Y VENTAS -->
        <div style="font-size: 12px;">
            @if($documento->ventas && count($documento->ventas) > 0)
                <p style="margin: 1px 0;"><strong>Ventas Folio:</strong>
                    @foreach($documento->ventas as $venta)
                        {{ $venta->id }}@if(!$loop->last), @endif
                    @endforeach
                </p>
            @endif
        </div>
        <!-- CREADOR DEL PRÉSTAMO -->
        @if($documento->creador)
            <p style="margin: 2px 0; font-size: 12px;">
                <strong>Creado por:</strong> {{ $documento->creador->name ?? $documento->creador->nombre ?? 'N/D' }}
            </p>
        @endif

        

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- DETALLE DEL PRÉSTAMO -->
        <p style="text-align: center; font-weight: bold; margin: 2px 0; font-size: 12px;">DETALLE DEL PRÉSTAMO</p>

        @if($documento->detalles && count($documento->detalles) > 0)
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="border-bottom: 1px solid #000; background: #f5f5f5;">
                        <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Prest.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Dev.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Dañ</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Pend.</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
                            $cantidadDanada = $detalle->devolucionDetalles->sum('cantidad_dañada_total') ?? 0;
                            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta - $cantidadDanada;
                        @endphp
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="text-align: left; padding: 1px;">
                                <strong>{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 16) }}</strong>
                                <!-- <br> -->
                                <!-- <span style="font-size: 8px; color: #666;">{{ $detalle->prestable->codigo ?? 'N/D' }}</span> -->
                            </td>
                            <td style="text-align: center; padding: 1px; font-weight: bold;">{{ $cantidadPrestada }}</td>
                            <td style="text-align: center; padding: 1px;">{{ $cantidadDevuelta }}</td>
                            <td style="text-align: center; padding: 1px; @if($cantidadDanada > 0) font-weight: bold; color: #c41e3a; @endif">{{ $cantidadDanada }}</td>
                            <td style="text-align: center; padding: 1px; font-weight: bold;">
                                {{ $cantidadPendiente }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="font-size: 9px; text-align: center; color: #999;">Sin detalles registrados</p>
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
        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <!-- INFORMACIÓN IMPORTANTE -->
        <p style="font-size: 12px; text-align: center; line-height: 1.2; margin: 2px 0;">
            <strong>RECUERDE DEVOLVER EN LA FECHA INDICADA</strong>
            <br>
            Garantía retenida hasta devolución completa
        </p>
        <p style="font-size: 11px; text-align: center; color: #666; margin: 2px 0;">
            {{ now()->format('d/m/Y H:i') }} | Sistema de Préstamos
        </p>
        <!-- SEPARADOR FIRMAS -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
    </div>
@endsection
