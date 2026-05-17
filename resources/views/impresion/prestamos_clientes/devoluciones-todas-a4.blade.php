@extends('impresion.layouts.base-a4')

@section('contenido')
    @php
        $prestamo = $documento;
        $totalMontoCobraDaño = $prestamo->devoluciones->sum('monto_cobrado_daño_total');
        $totalMontoGarantia = $prestamo->devoluciones->sum('monto_garantia_devuelta_total');
    @endphp

    <div class="encabezado-documento">
        <div class="titulo-documento">
            <h1>REGISTRO DE DEVOLUCIONES</h1>
            <p class="subtitulo">Préstamo #{{ $prestamo->id }}</p>
        </div>
    </div>

    @if($empresa)
        <div class="info-empresa">
            <p><strong>{{ $empresa->razon_social }}</strong></p>
            <p>{{ $empresa->direccion ?? '' }}</p>
            <p>{{ $empresa->telefono ?? '' }}</p>
        </div>
    @endif

    {{-- INFORMACIÓN GENERAL --}}
    <div class="seccion">
        <h2>INFORMACIÓN GENERAL</h2>
        <table class="tabla-datos">
            <tr>
                <td style="width: 25%;"><strong>Préstamo #:</strong></td>
                <td style="width: 25%;">{{ $prestamo->id }}</td>
                <td style="width: 25%;"><strong>Cliente:</strong></td>
                <td style="width: 25%;">{{ $prestamo->cliente->nombre ?? $prestamo->cliente->razon_social }}</td>
            </tr>
            <tr>
                <td><strong>Fecha Préstamo:</strong></td>
                <td>{{ \Carbon\Carbon::parse($prestamo->fecha_prestamo)->format('d/m/Y') }}</td>
                <td><strong>Total Devoluciones:</strong></td>
                <td><strong>{{ count($prestamo->devoluciones) }}</strong></td>
            </tr>
        </table>
    </div>

    {{-- TABLA CONSOLIDADA DE TODAS LAS DEVOLUCIONES --}}
    <div class="seccion">
        <h2>DETALLE DE TODAS LAS DEVOLUCIONES</h2>
        <table class="tabla-detalle">
            <thead>
                <tr>
                    <th style="width: 15%; text-align: left;">Devolución</th>
                    <th style="width: 20%; text-align: left;">Prestable</th>
                    <th style="width: 12%; text-align: center;">Buenas</th>
                    <th style="width: 12%; text-align: center;">Parcial</th>
                    <th style="width: 12%; text-align: center;">Total</th>
                    <th style="width: 14%; text-align: center;">Total Dev.</th>
                    <th style="width: 15%; text-align: center;">Fecha</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($prestamo->devoluciones as $devolucion)
                    @foreach ($devolucion->detalles as $detalle)
                        @php
                            $totalDev = $detalle->cantidad_devuelta + $detalle->cantidad_dañada_parcial + $detalle->cantidad_dañada_total;
                        @endphp
                        <tr>
                            <td style="text-align: center; font-weight: bold; font-size: 10px;">{{ $devolucion->id }}</td>
                            <td>
                                <strong>{{ $detalle->detallePrestamoCliente?->prestable?->nombre ?? 'Prestable' }}</strong>
                                <br/>
                                <span style="font-size: 9px; color: #666;">{{ $detalle->detallePrestamoCliente?->prestable?->tipo ?? 'N/D' }}</span>
                            </td>
                            <td style="text-align: center; color: #10b981; font-weight: bold;">
                                {{ $detalle->cantidad_devuelta }}
                            </td>
                            <td style="text-align: center; color: #f59e0b; font-weight: bold;">
                                {{ $detalle->cantidad_dañada_parcial }}
                            </td>
                            <td style="text-align: center; color: #ef4444; font-weight: bold;">
                                {{ $detalle->cantidad_dañada_total }}
                            </td>
                            <td style="text-align: center; background-color: #f3f4f6; font-weight: bold;">
                                {{ $totalDev }}
                            </td>
                            <td style="text-align: center; font-size: 10px;">
                                {{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}
                            </td>
                        </tr>
                    @endforeach
                @endforeach

                {{-- FILA DE TOTALES --}}
                <tr style="background-color: #e3f2fd; border-top: 2px solid #333;">
                    <td colspan="2" style="text-align: right; font-weight: bold;">TOTALES</td>
                    <td style="text-align: center; font-weight: bold;">
                        @php
                            $totalBuenas = 0;
                            foreach ($prestamo->devoluciones as $dev) {
                                foreach ($dev->detalles as $det) {
                                    $totalBuenas += $det->cantidad_devuelta;
                                }
                            }
                        @endphp
                        {{ $totalBuenas }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        @php
                            $totalParcial = 0;
                            foreach ($prestamo->devoluciones as $dev) {
                                foreach ($dev->detalles as $det) {
                                    $totalParcial += $det->cantidad_dañada_parcial;
                                }
                            }
                        @endphp
                        {{ $totalParcial }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        @php
                            $totalDaño = 0;
                            foreach ($prestamo->devoluciones as $dev) {
                                foreach ($dev->detalles as $det) {
                                    $totalDaño += $det->cantidad_dañada_total;
                                }
                            }
                        @endphp
                        {{ $totalDaño }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        @php
                            $totalDevueltoGral = $totalBuenas + $totalParcial + $totalDaño;
                        @endphp
                        {{ $totalDevueltoGral }}
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <p style="font-size: 9px; color: #666; margin-top: 8px;">
            <strong>Leyenda:</strong> Buenas = En buen estado | Parcial = Daño parcial | Total = Daño total | Total Dev. = Total devuelto
        </p>
    </div>

    {{-- RESUMEN FINANCIERO POR DEVOLUCIÓN --}}
    @if(count($prestamo->devoluciones) > 1)
        <div class="seccion">
            <h2>RESUMEN POR EVENTO DE DEVOLUCIÓN</h2>
            <table class="tabla-datos" style="font-size: 10px;">
                <tr>
                    <td style="width: 30%;"><strong>Devolución #</strong></td>
                    <td style="width: 30%;"><strong>Fecha</strong></td>
                    <td style="width: 20%;"><strong>Monto por Daño</strong></td>
                    <td style="width: 20%;"><strong>Garantía Dev.</strong></td>
                </tr>
                @foreach ($prestamo->devoluciones as $devolucion)
                    <tr>
                        <td>{{ $devolucion->id }}</td>
                        <td>{{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}</td>
                        <td style="text-align: right; color: #0066cc; font-weight: bold;">
                            Bs {{ number_format($devolucion->monto_cobrado_daño_total, 2, ',', '.') }}
                        </td>
                        <td style="text-align: right; color: #059669;">
                            Bs {{ number_format($devolucion->monto_garantia_devuelta_total, 2, ',', '.') }}
                        </td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    {{-- RESUMEN FINANCIERO TOTAL --}}
    <div class="seccion">
        <h2>RESUMEN FINANCIERO TOTAL</h2>
        <table class="tabla-datos">
            <tr style="background-color: #fff3cd;">
                <td style="width: 60%;"><strong>TOTAL MONTO A COBRAR POR DAÑOS:</strong></td>
                <td style="text-align: right; font-weight: bold; font-size: 14px; color: #0066cc;">
                    Bs {{ number_format($totalMontoCobraDaño, 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td><strong>Total Garantía Devuelta:</strong></td>
                <td style="text-align: right; font-weight: bold; color: #059669;">
                    Bs {{ number_format($totalMontoGarantia, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>

    <div class="pie-documento" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 20px;">
        <p style="text-align: center; font-size: 11px; color: #666;">
            Comprobante generado el {{ $fecha_impresion->format('d/m/Y H:i') }}
        </p>
        <p style="text-align: center; font-size: 10px; color: #999;">
            Este documento es un comprobante de devolución de préstamo.
        </p>
    </div>

    <style>
        .encabezado-documento {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .titulo-documento h1 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .subtitulo {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #666;
        }

        .info-empresa {
            text-align: center;
            margin-bottom: 15px;
            font-size: 11px;
            color: #666;
        }

        .info-empresa p {
            margin: 2px 0;
        }

        .seccion {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }

        .seccion h2 {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin: 0 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #ddd;
        }

        .tabla-datos {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 8px;
        }

        .tabla-datos tr {
            border-bottom: 1px solid #eee;
        }

        .tabla-datos td {
            padding: 5px;
        }

        .tabla-detalle {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 8px;
        }

        .tabla-detalle thead {
            background-color: #f3f4f6;
            font-weight: bold;
        }

        .tabla-detalle th {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .tabla-detalle td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .pie-documento {
            margin-top: 20px;
        }
    </style>
@endsection
