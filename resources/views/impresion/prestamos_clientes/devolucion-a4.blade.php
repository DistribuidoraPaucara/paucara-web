@extends('impresion.layouts.base-a4')

@section('contenido')
    @php
        $devolucion = $devolucion_cliente ?? $documento;
    @endphp

    <div class="encabezado-documento">
        <div class="titulo-documento">
            <h1>COMPROBANTE DE DEVOLUCIÓN</h1>
            <p class="subtitulo">Devolución de Préstamo #{{ $devolucion->id }}</p>
        </div>
    </div>

    @if($empresa)
        <div class="info-empresa">
            <p><strong>{{ $empresa->razon_social }}</strong></p>
            <p>{{ $empresa->direccion ?? '' }}</p>
            <p>{{ $empresa->telefono ?? '' }}</p>
        </div>
    @endif

    {{-- INFORMACIÓN DE LA CABECERA DE DEVOLUCIÓN --}}
    <div class="seccion">
        <h2>INFORMACIÓN GENERAL</h2>
        <table class="tabla-datos">
            <tr>
                <td style="width: 25%;"><strong>Devolución #:</strong></td>
                <td style="width: 25%;">{{ $devolucion->id }}</td>
                <td style="width: 25%;"><strong>Préstamo #:</strong></td>
                <td style="width: 25%;">{{ $devolucion->prestamo_cliente_id }}</td>
            </tr>
            <tr>
                <td><strong>Fecha Devolución:</strong></td>
                <td>{{ \Carbon\Carbon::parse($devolucion->fecha_devolucion)->format('d/m/Y') }}</td>
                <td><strong>Cliente:</strong></td>
                <td>
                    @if($devolucion->prestamo && $devolucion->prestamo->cliente)
                        {{ $devolucion->prestamo->cliente->nombre ?? $devolucion->prestamo->cliente->razon_social }}
                    @else
                        N/D
                    @endif
                </td>
            </tr>
        </table>
    </div>

    {{-- TABLA CONSOLIDADA DE DETALLES --}}
    <div class="seccion">
        <h2>DETALLES DE DEVOLUCIÓN</h2>
        <table class="tabla-detalle">
            <thead>
                <tr>
                    <th style="width: 35%; text-align: left;">Prestable</th>
                    <th style="width: 13%; text-align: center;">Buenas</th>
                    <th style="width: 13%; text-align: center;">Parcial</th>
                    <th style="width: 13%; text-align: center;">Total</th>
                    <th style="width: 13%; text-align: center;">Total Dev.</th>
                    <th style="width: 13%; text-align: center;">Garantía Dev.</th>
                </tr>
            </thead>
            <tbody>
                @php $totalGarantia = 0; @endphp
                @foreach($devolucion->detalles as $detalle)
                    @php
                        $totalDevuelto = $detalle->cantidad_devuelta + $detalle->cantidad_dañada_parcial + $detalle->cantidad_dañada_total;
                        $totalGarantia += $detalle->monto_garantia_devuelta;
                    @endphp
                    <tr>
                        <td style="text-align: left;">
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
                            {{ $totalDevuelto }}
                        </td>
                        <td style="text-align: center; color: #059669; font-weight: bold;">
                            Bs {{ number_format($detalle->monto_garantia_devuelta, 2, ',', '.') }}
                        </td>
                    </tr>
                @endforeach

                {{-- FILA DE TOTALES --}}
                <tr style="background-color: #e3f2fd; border-top: 2px solid #333;">
                    <td style="text-align: right; font-weight: bold;">TOTALES</td>
                    <td style="text-align: center; font-weight: bold;">
                        {{ $devolucion->detalles->sum('cantidad_devuelta') }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        {{ $devolucion->detalles->sum('cantidad_dañada_parcial') }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        {{ $devolucion->detalles->sum('cantidad_dañada_total') }}
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                        {{ $devolucion->detalles->sum(function($d) { return $d->cantidad_devuelta + $d->cantidad_dañada_parcial + $d->cantidad_dañada_total; }) }}
                    </td>
                    <td style="text-align: center; font-weight: bold; color: #059669;">
                        Bs {{ number_format($totalGarantia, 2, ',', '.') }}
                    </td>
                </tr>
            </tbody>
        </table>
        <p style="font-size: 9px; color: #666; margin-top: 8px;">
            <strong>Leyenda:</strong> Buenas = En buen estado | Parcial = Daño parcial | Total = Daño total (No recuperable) | Total Dev. = Total devuelto
        </p>
    </div>

    {{-- RESUMEN DE MONTOS --}}
    <div class="seccion">
        <h2>RESUMEN FINANCIERO</h2>
        <table class="tabla-datos">
            <tr style="background-color: #fff3cd;">
                <td style="width: 60%;"><strong>MONTO A COBRAR POR DAÑOS:</strong></td>
                <td style="text-align: right; font-weight: bold; font-size: 14px; color: #0066cc;">
                    Bs {{ number_format($devolucion->monto_cobrado_daño_total, 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td><strong>Garantía Total Devuelta:</strong></td>
                <td style="text-align: right; font-weight: bold; color: #059669;">
                    Bs {{ number_format($devolucion->monto_garantia_devuelta_total, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>

    @if($devolucion->observaciones)
        <div class="seccion">
            <h2>OBSERVACIONES</h2>
            <div class="caja-observaciones">
                <p>{{ $devolucion->observaciones }}</p>
            </div>
        </div>
    @endif

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

        .caja-observaciones {
            background-color: #f9fafb;
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 10px;
            border-radius: 4px;
        }

        .pie-documento {
            margin-top: 20px;
        }
    </style>
@endsection
