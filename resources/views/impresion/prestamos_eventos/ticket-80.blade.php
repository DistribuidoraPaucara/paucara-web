@extends('impresion.layouts.base-ticket')

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
            <p style="font-size: 10px; margin: 1px 0; color: #666;">Ref: EVT-{{ str_pad($documento->id, 5, '0', STR_PAD_LEFT) }}</p>
        </div>

        <!-- ESTADO DESTACADO -->
        <p style="text-align: center; padding: 3px; border: 2px solid {{ $estadoColor }}; background: #f9f9f9; font-weight: bold; font-size: 11px; margin: 3px 0; color: {{ $estadoColor }};">
            {{ $estadoClass }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- INFORMACIÓN DEL EVENTO -->
        <p style="margin: 2px 0; font-size: 11px;">
            <strong>Evento:</strong> {{ $documento->nombre_evento ?? 'Sin nombre' }}
        </p>
        <p style="margin: 2px 0; font-size: 10px;">
            <strong>Encargado:</strong> {{ $documento->encargado_evento ?? 'N/D' }}
            @if($documento->telefono_uno)
                | {{ $documento->telefono_uno }}
            @endif
        </p>
        <p style="margin: 2px 0; font-size: 10px;">
            <strong>Dirección:</strong> {{ substr($documento->direccion_evento ?? 'N/D', 0, 40) }}
        </p>

        <!-- LOGÍSTICA -->
        @if($documento->vehiculo_asignado || $documento->chofer)
            <p style="margin: 2px 0; font-size: 10px;">
                @if($documento->vehiculo_asignado)
                    <strong>Vehículo:</strong> {{ $documento->vehiculo_asignado }}
                @endif
                @if($documento->chofer)
                    <br>
                    <strong>Chofer:</strong> {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                @endif
            </p>
        @endif

        <!-- ALMACÉN Y VENTAS -->
        <div style="font-size: 10px;">
            @if($documento->almacen)
                <p style="margin: 1px 0;"><strong>Almacén:</strong> {{ $documento->almacen->nombre }}</p>
            @endif
            @if($documento->ventas && count($documento->ventas) > 0)
                <p style="margin: 1px 0;"><strong>Ventas Folio:</strong>
                    @foreach($documento->ventas as $venta)
                        {{ $venta->id }}@if(!$loop->last), @endif
                    @endforeach
                </p>
            @endif
        </div>

        <!-- FECHAS Y GARANTÍA -->
        <p style="margin: 3px 0; font-size: 10px; line-height: 1.3;">
            <strong>Préstamo:</strong> {{ $documento->fecha_prestamo->format('d/m/Y') }}
            <br>
            <strong>Devolución:</strong> {{ $documento->fecha_esperada_devolucion?->format('d/m/Y') ?? 'N/D' }}
            <br>
            <strong>Garantía:</strong> Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- DETALLE DEL PRÉSTAMO -->
        <p style="text-align: center; font-weight: bold; margin: 2px 0; font-size: 11px;">DETALLE DEL PRÉSTAMO</p>

        @if($documento->detalles && count($documento->detalles) > 0)
            <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
                <thead>
                    <tr style="border-bottom: 1px solid #000; background: #f5f5f5;">
                        <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Prest.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Dev.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Pend.</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
                            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                        @endphp
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="text-align: left; padding: 1px;">
                                <strong>{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 16) }}</strong>
                                <br>
                                <span style="font-size: 8px; color: #666;">{{ $detalle->prestable->codigo ?? 'N/D' }}</span>
                            </td>
                            <td style="text-align: center; padding: 1px; font-weight: bold;">{{ $cantidadPrestada }}</td>
                            <td style="text-align: center; padding: 1px;">{{ $cantidadDevuelta }}</td>
                            <td style="text-align: center; padding: 1px; font-weight: bold; background: {{ $cantidadPendiente > 0 ? '#fff3cd' : '#d4edda' }};">
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
        <p style="font-size: 9px; text-align: center; line-height: 1.2; margin: 2px 0;">
            <strong>RECUERDE DEVOLVER EN LA FECHA INDICADA</strong>
            <br>
            Garantía retenida hasta devolución completa
        </p>
        <p style="font-size: 8px; text-align: center; color: #666; margin: 2px 0;">
            {{ now()->format('d/m/Y H:i') }} | Sistema de Préstamos
        </p>
        <!-- SEPARADOR FIRMAS -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
    </div>
@endsection
