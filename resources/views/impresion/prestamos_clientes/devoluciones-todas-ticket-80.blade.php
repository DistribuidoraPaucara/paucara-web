@extends('impresion.layouts.base-ticket')

@section('contenido')
    @php
        $prestamo = $documento;
        $totalMontoDaño = $prestamo->devoluciones->sum('monto_cobrado_daño_total');
    @endphp

    <div class="ticket">
        <div style="text-align: center;">
            <h3 class="text-center text-sm font-bold mb-1">DEVOLUCIONES - Préstamo # <strong>{{ $prestamo->id }}</strong></h3>
            <p style="color: #666; margin: 2px 0;">
                {{ count($prestamo->devoluciones) }} devolución(es)
            </p>
        </div>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <p class="text-xs mb-1">
            <strong>Cliente:</strong>
            {{ $prestamo->cliente->nombre ?? 'Sin nombre' }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 1px solid #000; margin: 3px 0;"></div>

        <!-- TABLA DE DEVOLUCIONES -->
        @foreach ($prestamo->devoluciones as $devolucion)
            <div style="margin-bottom: 8px;">
                <p style="font-weight: bold; margin: 0 0 4px 0;">
                    {{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}
                </p>

                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                    <thead>
                        <tr>
                            <th style="padding: 2px; border: 1px solid #000; text-align: left;">Prestable</th>
                            <th style="padding: 2px; border: 1px solid #000; text-align: center; width: 18px;">B</th>
                            <th style="padding: 2px; border: 1px solid #000; text-align: center; width: 18px;">P</th>
                            <th style="padding: 2px; border: 1px solid #000; text-align: center; width: 18px;">T</th>
                            <th style="padding: 2px; border: 1px solid #000; text-align: center; width: 25px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($devolucion->detalles as $detalle)
                            @php
                                $totalDev = $detalle->cantidad_devuelta + $detalle->cantidad_dañada_parcial + $detalle->cantidad_dañada_total;
                                $nombrePrestable = substr($detalle->detallePrestamoCliente?->prestable?->nombre ?? 'N/D', 0, 15);
                            @endphp
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 2px; border: 1px solid #ddd;">{{ $nombrePrestable }}</td>
                                <td style="padding: 2px; border: 1px solid #ddd; text-align: center; font-weight: bold;">{{ $detalle->cantidad_devuelta }}</td>
                                <td style="padding: 2px; border: 1px solid #ddd; text-align: center; font-weight: bold;">{{ $detalle->cantidad_dañada_parcial }}</td>
                                <td style="padding: 2px; border: 1px solid #ddd; text-align: center; font-weight: bold;">{{ $detalle->cantidad_dañada_total }}</td>
                                <td style="padding: 2px; border: 1px solid #ddd; text-align: center; font-weight: bold;">{{ $totalDev }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <p style="margin: 2px 0 0 0;">
                    Monto: <strong>Bs {{ number_format($devolucion->monto_cobrado_daño_total, 2) }}</strong>
                </p>

                @if($devolucion->observaciones)
                    <p style="margin: 1px 0; padding: 1px;">
                        <strong>Obs:</strong> {{ substr($devolucion->observaciones, 0, 35) }}{{ strlen($devolucion->observaciones) > 35 ? '...' : '' }}
                    </p>
                @endif

                <div style="border-top: 1px solid #ddd; margin: 3px 0;"></div>
            </div>
        @endforeach

        <!-- TOTAL GENERAL A COBRAR -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
            <tr style="font-weight: bold;">
                <td style="padding: 3px;"><strong>TOTAL A COBRAR</strong></td>
                <td style="padding: 3px; text-align: right;"><strong>Bs {{ number_format($totalMontoDaño, 2) }}</strong></td>
            </tr>
        </table>

        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        <p class="text-[10px] text-center">
            <strong>Leyenda</strong><br>
            B=Bueno | P=Parcial | T=Total
        </p>

        <p class="text-[10px] text-center mt-1">
            {{ $fecha_impresion->format('d/m/Y H:i') }}
        </p>
    </div>
@endsection
