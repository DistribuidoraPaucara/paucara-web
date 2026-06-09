@extends('impresion.layouts.base-a4')

@section('contenido')
    @php
        $prestamo = $documento;
        $totalMontoCobraDaño = $prestamo->devoluciones->sum('monto_cobrado_daño_total');
        $totalMontoGarantia = $prestamo->devoluciones->sum('monto_garantia_devuelta_total');
        $totalExcedido = $prestamo->devoluciones->sum('monto_excedido_garantia');
    @endphp

    <div class="encabezado-documento">
        <div class="titulo-documento">
            <h1>📋 REGISTRO DE DEVOLUCIONES</h1>
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
        <h2>📌 INFORMACIÓN DEL PRÉSTAMO</h2>
        <table class="tabla-datos">
            <tr>
                <td style="width: 20%;"><strong>Préstamo #:</strong></td>
                <td style="width: 20%;">{{ $prestamo->id }}</td>
                <td style="width: 20%;"><strong>Fecha Préstamo:</strong></td>
                <td style="width: 40%;">{{ \Carbon\Carbon::parse($prestamo->fecha_prestamo)->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td><strong>Garantía:</strong></td>
                <td><strong>Bs {{ number_format($prestamo->monto_garantia, 2, ',', '.') }}</strong></td>
                <td><strong>Total Devoluciones:</strong></td>
                <td><strong>{{ count($prestamo->devoluciones) }}</strong></td>
            </tr>
            <tr>
                <td><strong>Almacén:</strong></td>
                <td>{{ $prestamo->almacen->nombre ?? 'N/D' }}</td>
                <td><strong>Vehículo:</strong></td>
                <td>{{ $prestamo->vehiculo->placa ?? 'N/D' }}</td>
            </tr>
        </table>
    </div>

    {{-- INFORMACIÓN DEL CLIENTE --}}
    <div class="seccion">
        <h2>👤 INFORMACIÓN DEL CLIENTE</h2>
        <table class="tabla-datos">
            <tr>
                <td style="width: 20%;"><strong>Cliente:</strong></td>
                <td style="width: 30%;">{{ $prestamo->cliente->nombre ?? $prestamo->cliente->razon_social }}</td>
                <td style="width: 20%;"><strong>Código:</strong></td>
                <td style="width: 30%;">{{ $prestamo->cliente->codigo_cliente ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Razón Social:</strong></td>
                <td>{{ $prestamo->cliente->razon_social ?? 'N/D' }}</td>
                <td><strong>Localidad:</strong></td>
                <td>{{ $prestamo->cliente->localidad->nombre ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Teléfono:</strong></td>
                <td colspan="3">{{ $prestamo->cliente->telefono ?? 'N/D' }}</td>
            </tr>
        </table>
    </div>

    {{-- TABLA CONSOLIDADA DE TODAS LAS DEVOLUCIONES --}}
    <div class="seccion">
        <h2>📦 DETALLE DE TODAS LAS DEVOLUCIONES</h2>
        <table class="tabla-detalle">
            <thead>
                <tr>
                    <th style="width: 10%; text-align: center;">Dev #</th>
                    <th style="width: 25%; text-align: left;">Prestable</th>
                    <th style="width: 10%; text-align: center;">Buenas</th>
                    <th style="width: 10%; text-align: center;">Dañadas</th>
                    <th style="width: 15%; text-align: right;">Monto Daño</th>
                    <th style="width: 15%; text-align: center;">Fecha</th>
                    <th style="width: 15%; text-align: center;">Observación</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($prestamo->devoluciones as $devolucion)
                    @foreach ($devolucion->detalles as $detalle)
                        <tr>
                            <td style="text-align: center; font-weight: bold; font-size: 9px;">{{ $devolucion->id }}</td>
                            <td>
                                <strong>{{ $detalle->detallePrestamoCliente?->prestable?->nombre ?? 'Prestable' }}</strong>
                                <br/>
                                <span style="font-size: 9px; color: #666;">{{ $detalle->detallePrestamoCliente?->prestable?->tipo ?? 'N/D' }}</span>
                            </td>
                            <td style="text-align: center; color: #10b981; font-weight: bold;">
                                {{ $detalle->cantidad_devuelta }}
                            </td>
                            <td style="text-align: center; color: #ef4444; font-weight: bold;">
                                {{ $detalle->cantidad_dañada_total }}
                            </td>
                            <td style="text-align: right; font-weight: bold; color: #0066cc;">
                                Bs {{ number_format($detalle->monto_cobrado_daño ?? 0, 2, ',', '.') }}
                            </td>
                            <td style="text-align: center; font-size: 9px;">
                                {{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}
                            </td>
                            <td style="text-align: center; font-size: 9px;">
                                @if(($detalle->monto_cobrado_daño ?? 0) > 0)
                                    <span style="color: #ef4444; font-weight: bold;">🚫 Daño</span>
                                @else
                                    <span style="color: #10b981;">✓ OK</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                @endforeach

                {{-- FILA DE TOTALES --}}
                <tr style="background-color: #e3f2fd; border-top: 2px solid #333; font-weight: bold;">
                    <td colspan="2" style="text-align: right;">TOTALES</td>
                    <td style="text-align: center;">
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
                    <td style="text-align: center;">
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
                    <td style="text-align: right; color: #0066cc;">
                        Bs {{ number_format($totalMontoCobraDaño, 2, ',', '.') }}
                    </td>
                    <td colspan="2"></td>
                </tr>
            </tbody>
        </table>
        <p style="font-size: 9px; color: #666; margin-top: 8px;">
            <strong>Leyenda:</strong> Buenas = En buen estado | Dañadas = Daño total | Monto Daño = Costo del daño
        </p>
    </div>

    {{-- RESUMEN FINANCIERO POR DEVOLUCIÓN --}}
    @if(count($prestamo->devoluciones) > 0)
        <div class="seccion">
            <h2>💰 RESUMEN FINANCIERO POR DEVOLUCIÓN</h2>
            <table class="tabla-datos" style="font-size: 10px;">
                <tr style="background-color: #f3f4f6; font-weight: bold;">
                    <td style="width: 12%;"><strong>Dev #</strong></td>
                    <td style="width: 15%;"><strong>Fecha</strong></td>
                    <td style="width: 18%; text-align: right;"><strong>Daño Cobrado</strong></td>
                    <td style="width: 18%; text-align: right;"><strong>Garantía Dev.</strong></td>
                    <td style="width: 18%; text-align: right;"><strong>Exceso</strong></td>
                    <td style="width: 19%; text-align: center;"><strong>Estado</strong></td>
                </tr>
                @foreach ($prestamo->devoluciones as $devolucion)
                    <tr>
                        <td style="text-align: center; font-weight: bold;">{{ $devolucion->id }}</td>
                        <td>{{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}</td>
                        <td style="text-align: right; color: #0066cc; font-weight: bold;">
                            Bs {{ number_format($devolucion->monto_cobrado_daño_total ?? 0, 2, ',', '.') }}
                        </td>
                        <td style="text-align: right; color: #059669; font-weight: bold;">
                            Bs {{ number_format($devolucion->monto_garantia_devuelta_total ?? 0, 2, ',', '.') }}
                        </td>
                        <td style="text-align: right; font-weight: bold;
                            @if(($devolucion->monto_excedido_garantia ?? 0) > 0) color: #d00; @endif">
                            @if(($devolucion->monto_excedido_garantia ?? 0) > 0)
                                🚫 Bs {{ number_format($devolucion->monto_excedido_garantia, 2, ',', '.') }}
                            @else
                                —
                            @endif
                        </td>
                        <td style="text-align: center;">
                            @if(($devolucion->monto_excedido_garantia ?? 0) > 0)
                                <span style="color: #d00; font-weight: bold;">Pendiente</span>
                            @else
                                <span style="color: #10b981; font-weight: bold;">✓ OK</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    {{-- RESUMEN FINANCIERO TOTAL --}}
    <div class="seccion">
        <h2>🎯 RESUMEN FINANCIERO TOTAL</h2>
        <table class="tabla-datos" style="border: 2px solid #333;">
            <tr style="background-color: #fff3cd;">
                <td style="width: 50%;"><strong>Garantía Original del Préstamo:</strong></td>
                <td style="text-align: right; font-weight: bold; font-size: 12px; color: #0066cc;">
                    Bs {{ number_format($prestamo->monto_garantia, 2, ',', '.') }}
                </td>
            </tr>
            <tr style="background-color: #ffe3e3;">
                <td><strong>TOTAL MONTO A COBRAR POR DAÑOS:</strong></td>
                <td style="text-align: right; font-weight: bold; font-size: 14px; color: #d00;">
                    Bs {{ number_format($totalMontoCobraDaño, 2, ',', '.') }}
                </td>
            </tr>
            <tr style="background-color: #e3f2fd;">
                <td><strong>Total Garantía Devuelta:</strong></td>
                <td style="text-align: right; font-weight: bold; color: #059669;">
                    Bs {{ number_format($totalMontoGarantia, 2, ',', '.') }}
                </td>
            </tr>
            @if($totalExcedido > 0)
                <tr style="background-color: #ffdddd; border-top: 2px solid #d00;">
                    <td><strong>🚫 EXCESO PENDIENTE DE COBRO AL CLIENTE:</strong></td>
                    <td style="text-align: right; font-weight: bold; font-size: 14px; color: #d00;">
                        Bs {{ number_format($totalExcedido, 2, ',', '.') }}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="font-size: 9px; color: #d00; padding: 8px;">
                        <strong>⚠️ Nota:</strong> El cliente debe pagar el monto de exceso ya que los daños registrados superan la garantía original del préstamo.
                    </td>
                </tr>
            @endif
        </table>
    </div>

    <div class="pie-documento">
        <p style="text-align: center; font-size: 11px; color: #666; margin-bottom: 5px;">
            Comprobante generado el {{ $fecha_impresion->format('d/m/Y H:i') }}
        </p>
        <p style="text-align: center; font-size: 10px; color: #999;">
            Este documento es un comprobante oficial de devolución de préstamo de canastillas/embases.
        </p>
    </div>

    <style>
        .encabezado-documento {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #333;
            padding-bottom: 10px;
        }

        .titulo-documento h1 {
            margin: 0;
            font-size: 20px;
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
            margin-bottom: 18px;
            page-break-inside: avoid;
        }

        .seccion h2 {
            font-size: 13px;
            font-weight: bold;
            color: #333;
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #333;
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

        .tabla-datos tr:hover {
            background-color: #f9f9f9;
        }

        .tabla-datos td {
            padding: 6px;
        }

        .tabla-detalle {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-bottom: 8px;
        }

        .tabla-detalle thead {
            background-color: #f3f4f6;
            font-weight: bold;
        }

        .tabla-detalle th {
            padding: 7px;
            border: 1px solid #ddd;
        }

        .tabla-detalle td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .tabla-detalle tbody tr:hover {
            background-color: #f9f9f9;
        }

        .pie-documento {
            margin-top: 25px;
            border-top: 1px solid #ccc;
            padding-top: 15px;
        }
    </style>
@endsection
