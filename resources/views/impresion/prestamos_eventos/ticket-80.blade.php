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
    @endphp

    <div class="ticket" style="font-size: 13px;">
        <div style="text-align: center;">
            <h3 class="text-center text-sm font-bold mb-1">Prestamo Evento # <strong>{{ $documento->id }}</strong></h3>
            <p style="font-size: 12px; font-weight: bold;">PRÉSTAMO PARA EVENTO</p>
        </div>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
        <!-- GARANTÍA -->
        <p class="text-xs mb-1">
            <strong>Garantía:</strong> Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>
        <p class="text-xs mb-1">
            <strong>Fecha Préstamo:</strong> {{ optional($documento->fecha_prestamo)->format('d/m/Y') }}
            <br>
            <strong>Fecha Devolución Esperada:</strong> {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
        </p>

        <!-- ESTADO DESTACADO -->
        <p class="text-center text-xs font-bold mb-1" style="padding: 3px; border: 1px solid #000;">
            <strong>{{ $estadoClass }}</strong>
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <!-- EVENTO -->
        <p class="text-xs mb-1">
            <strong>Evento:</strong>
            {{ $documento->nombre_evento ?? 'Sin nombre' }}
            <br>
            <strong>Encargado:</strong> {{ $documento->encargado_evento ?? 'N/D' }}
            <br>
            <strong>Dirección:</strong> {{ $documento->direccion_evento ?? 'N/D' }}
            <br>
            <strong>Tel 1:</strong> {{ $documento->telefono_uno ?? 'N/D' }}
            @if($documento->telefono_dos)
                <br>
                <strong>Tel 2:</strong> {{ $documento->telefono_dos }}
            @endif
        </p>

        @if($documento->vehiculo_asignado)
            <p class="text-xs mb-1">
                <strong>Vehículo:</strong> {{ $documento->vehiculo_asignado }}
            </p>
        @endif

        @if($documento->chofer)
            <p class="text-xs mb-1">
                <strong>Chofer:</strong>
                {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
            </p>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

        <p class="text-center text-xs font-bold mb-1"><strong>DETALLE DEL PRÉSTAMO</strong></p>

        @if($documento->detalles && count($documento->detalles) > 0)
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #000;">
                        <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Prest</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Dev</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Pend</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
                            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                        @endphp
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="text-align: left; padding: 2px;">{{ substr($detalle->prestable->nombre ?? 'Prestable', 0, 12) }}</td>
                            <td style="text-align: center; padding: 2px;">{{ number_format($cantidadPrestada, 0) }}</td>
                            <td style="text-align: center; padding: 2px;">{{ number_format($cantidadDevuelta, 0) }}</td>
                            <td style="text-align: center; padding: 2px; font-weight: bold;">{{ number_format($cantidadPendiente, 0) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="font-size: 8px; text-align: center;">Sin detalles registrados</p>
        @endif

        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <p class="text-[10px] text-center font-bold mb-1">
            Gracias por su preferencia
        </p>
    </div>
@endsection
