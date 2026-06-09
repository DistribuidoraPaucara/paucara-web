@extends('impresion.layouts.base-ticket')

@section('contenido')
    @php
        $devolucion = $devolucion_evento ?? $documento;
        $prestamo = $devolucion->prestamoEvento;
        $estadoClass = 'DEVUELTO';
        $estadoColor = '#070707';
    @endphp

    <div class="ticket" style="font-size: 12px; font-family: Arial, sans-serif;">
        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 4px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 2px 0;">DEVOLUCIÓN EVENTO #{{ $devolucion->id }}</h3>
            <p style="font-size: 10px; margin: 1px 0; color: #666;">Préstamo: {{ $prestamo->id }}</p>
        </div>

        <!-- ESTADO DESTACADO -->
        <p style="text-align: center; padding: 3px; border: 2px solid {{ $estadoColor }}; background: #f9f9f9; font-weight: bold; font-size: 11px; margin: 3px 0; color: {{ $estadoColor }};">
            {{ $estadoClass }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- INFORMACIÓN DEL EVENTO Y CLIENTE -->
        <p style="margin: 2px 0; font-size: 11px;">
            <strong>Evento:</strong> {{ $prestamo->nombre_evento ?? 'Sin nombre' }}
        </p>
        <p style="margin: 2px 0; font-size: 10px;">
            <strong>Cliente:</strong> {{ $prestamo->cliente?->nombre ?? $prestamo->cliente?->razon_social ?? 'N/D' }}
        </p>
        <p style="margin: 2px 0; font-size: 10px;">
            <strong>Almacén:</strong> {{ $prestamo->almacen?->nombre ?? 'N/D' }}
        </p>

        <!-- FECHAS -->
        <p style="margin: 2px 0; font-size: 9px;">
            <strong>Préstamo:</strong> {{ $prestamo->fecha_prestamo?->format('d/m/Y') ?? 'N/D' }}
            <br>
            <strong>Devolución:</strong> {{ $devolucion->fecha_devolucion?->format('d/m/Y') ?? 'N/D' }}
        </p>

        <!-- SEPARADOR -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- DETALLE DE LA DEVOLUCIÓN -->
        <p style="text-align: center; font-weight: bold; margin: 2px 0; font-size: 11px;">DETALLE DE DEVOLUCIÓN</p>

        @if($devolucion->detalles && count($devolucion->detalles) > 0)
            <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
                <thead>
                    <tr style="border-bottom: 1px solid #000; background: #f5f5f5;">
                        <th style="text-align: left; padding: 2px; font-weight: bold;">Prestable</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Prest.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Dev.</th>
                        <th style="text-align: center; padding: 2px; font-weight: bold;">Daño</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $totalPrestado = 0;
                        $totalDevuelto = 0;
                        $totalDaño = 0;
                    @endphp
                    @foreach($devolucion->detalles as $detalle)
                        @php
                            $prestado = $detalle->prestamoEventoDetalle?->cantidad ?? 0;
                            $devuelto = $detalle->cantidad_devuelta ?? 0;
                            $daño = ($detalle->cantidad_dañada_parcial ?? 0) + ($detalle->cantidad_dañada_total ?? 0);
                            $totalPrestado += $prestado;
                            $totalDevuelto += $devuelto;
                            $totalDaño += $daño;
                        @endphp
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="text-align: left; padding: 1px;">
                                <strong>{{ substr($detalle->prestamoEventoDetalle?->prestable?->nombre ?? 'Prestable', 0, 12) }}</strong>
                            </td>
                            <td style="text-align: center; padding: 1px; font-weight: bold;">{{ $prestado }}</td>
                            <td style="text-align: center; padding: 1px; color: #10b981; font-weight: bold;">{{ $devuelto }}</td>
                            <td style="text-align: center; padding: 1px; color: #ef4444; font-weight: bold;">{{ $daño }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- TOTALES -->
            <p style="font-size: 9px; text-align: center; margin: 2px 0; font-weight: bold;">
                TOTAL: Prest. {{ $totalPrestado }} | Dev. {{ $totalDevuelto }} | Daño {{ $totalDaño }}
            </p>
        @else
            <p style="font-size: 9px; text-align: center; color: #999;">Sin detalles registrados</p>
        @endif

        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- RESUMEN FINANCIERO -->
        <p style="font-size: 10px; text-align: center; margin: 2px 0;">
            <strong>💰 Monto a Cobrar:</strong>
            <br>
            Bs {{ number_format($devolucion->monto_cobrado_daño_total ?? 0, 2) }}
        </p>

        @if($devolucion->monto_garantia_devuelta_total > 0)
            <p style="font-size: 9px; text-align: center; margin: 2px 0;">
                <strong>Garantía Devuelta:</strong> Bs {{ number_format($devolucion->monto_garantia_devuelta_total ?? 0, 2) }}
            </p>
        @endif

        <!-- SEPARADOR FINAL -->
        <div style="border-top: 2px solid #000; margin: 3px 0;"></div>

        <!-- INFORMACIÓN IMPORTANTE -->
        <p style="font-size: 8px; text-align: center; line-height: 1.2; margin: 2px 0;">
            <strong>COMPROBANTE DE DEVOLUCIÓN</strong>
            <br>
            Verificar cantidad y condición de items
        </p>
        <p style="font-size: 7px; text-align: center; color: #666; margin: 2px 0;">
            {{ now()->format('d/m/Y H:i') }} | Paucara
        </p>

        <!-- SEPARADOR FIRMAS -->
        <div style="border-top: 2px solid #000; margin: 4px 0;"></div>

        @if($devolucion->observaciones)
            <p style="font-size: 8px; margin: 2px 0;">
                <strong>Obs:</strong> {{ substr($devolucion->observaciones, 0, 50) }}
            </p>
        @endif
    </div>
@endsection
