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
            <h3 class="text-center text-sm font-bold mb-1">Prestamo # <strong>{{ $documento->id }}</strong></h3>
            <p style="font-size: 12px; font-weight: bold;">PRÉSTAMO DE CANASTILLAS / EMBASES</p>
        </div>

        {{-- <p class="text-center text-xs mb-1">
            {{ $empresa->razon_social ?? $empresa->nombre ?? 'La Empresa' }}
        </p> --}}

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>
         <!-- GARANTÍA -->
        <p class="text-xs mb-1">
            <strong>Garantía:</strong> Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>
        <p class="text-xs mb-1">
            <strong>Fecha Creacion:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}
            <br>
            {{-- <strong>ID préstamo:</strong> #{{ $documento->id }} --}}
        </p>

        <p class="text-xs mb-1">
            <strong>Fecha Límite devolución:</strong>
            {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
        </p>

        <!-- ESTADO DESTACADO -->
        <p class="text-center text-xs font-bold mb-1" style="padding: 3px; border: 1px solid #000;">
            <strong>{{ $estadoClass }}</strong>
        </p>
        @if($documento->venta)
            <p class="text-xs mb-1">
                <strong>Folio Venta:</strong> #{{ $documento->venta->id ?? 'N/D' }}
            </p>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        

        <p class="text-xs mb-1">
            <strong>Cliente:</strong>
            {{ $documento->cliente->nombre ?? 'Sin nombre' }}
            <br>
            <strong>Razon Social: </strong> {{ $documento->cliente->razon_social ?? 'N/D' }}
            <br>
            <strong>Cod.:</strong> {{ $documento->cliente->codigo_cliente ?? 'N/D' }}
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
                            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
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
                    @php
                        $cantTotalDevuelta = 0;
                        if($documento->devoluciones && count($documento->devoluciones) > 0) {
                            foreach($documento->devoluciones as $devolucion) {
                                $cantTotalDevuelta += $devolucion->detalles->sum('cantidad_devuelta');
                            }
                        }
                        $cantPrestadaTotal = $documento->cantidad_prestada ?? $documento->cantidad ?? 0;
                    @endphp
                    <tr style="border-bottom: 1px solid #ccc;">
                        <td style="text-align: left; padding: 2px;">{{ substr($documento->prestable->nombre ?? 'Prestable', 0, 12) }}</td>
                        <td style="text-align: center; padding: 2px;">{{ number_format($cantPrestadaTotal, 0) }}</td>
                        <td style="text-align: center; padding: 2px;">{{ number_format($cantTotalDevuelta, 0) }}</td>
                        <td style="text-align: center; padding: 2px; font-weight: bold;">{{ number_format($cantPrestadaTotal - $cantTotalDevuelta, 0) }}</td>
                    </tr>
                </tbody>
            </table>
        @endif

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

        <!-- RESUMEN DE DEVOLUCIONES -->
        @php
            $todasLasDevoluciones = [];
            if($documento->devoluciones && count($documento->devoluciones) > 0) {
                foreach($documento->devoluciones as $devolucion) {
                    foreach($devolucion->detalles as $detalleDevolucion) {
                        $todasLasDevoluciones[] = $detalleDevolucion;
                    }
                }
            }
        @endphp

        @if(count($todasLasDevoluciones) > 0)
            <p class="text-center text-xs font-bold mb-1"><strong>RESUMEN DEVOLUCIONES</strong></p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #000;">
                        <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">B</th>
                        {{-- <th style="text-align: center; padding: 2px; font-weight: bold;">P</th> --}}
                        <th style="text-align: center; padding: 2px; font-weight: bold;">T</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($todasLasDevoluciones as $dev)
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="text-align: left; padding: 2px;">{{ substr($dev->detallePrestamoCliente->prestable->nombre ?? 'N/D', 0, 10) }}</td>
                            <td style="text-align: center; padding: 2px; font-weight: bold;">{{ $dev->cantidad_devuelta ?? 0 }}</td>
                            {{-- <td style="text-align: center; padding: 2px;">{{ $dev->cantidad_dañada_parcial ?? 0 }}</td> --}}
                            <td style="text-align: center; padding: 2px;">{{ $dev->cantidad_dañada_total ?? 0 }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <p style="margin-top: 2px; text-align: center; font-size: 12px;">
                <strong>TIPO DE DAÑO: B=Bueno</strong> <strong>P=Parcial</strong> <strong>T=Total</strong>
            </p>
        @endif

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

        <p class="text-[10px] text-center" style="font-size: 12px;">
            El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado.
        </p>

        <p class="text-[10px] text-center mt-1" style="font-size: 12px;">
            Producto dañado o faltante será cobrado.
        </p>

        <!-- SEPARADOR FIRMAS -->
        <div style="border-top: 2px solid #000; margin: 6px 0;"></div>

        <!-- ESPACIO DE FIRMAS -->
        <div style="margin-top: 8px;">
            <div style="display: flex; gap: 8px; justify-content: space-between;">
                <!-- FIRMA CLIENTE -->
                <div style="text-align: center; flex: 1; font-size: 12px;">
                    <div style="border-bottom: 1px solid #000; height: 80px; margin-bottom: 2px;"></div>
                    <p style="margin: 0; font-weight: bold;">Firma Cliente</p>
                </div>

                <!-- FIRMA ENTREGA -->
                {{-- <div style="text-align: center; flex: 1; font-size: 10px;">
                    <div style="border-bottom: 1px solid #000; height: 80px; margin-bottom: 2px;"></div>
                    <p style="margin: 0; font-weight: bold;">Firma Entrega</p>
                </div> --}}
            </div>
        </div>
    </div>
@endsection
