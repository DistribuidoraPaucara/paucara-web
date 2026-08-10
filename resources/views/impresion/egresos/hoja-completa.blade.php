@extends('impresion.layouts.base-a4')

@section('titulo', 'Egreso #' . $egreso->numero)

@section('contenido')

{{-- ==================== INFORMACIÓN DEL DOCUMENTO ==================== --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2>EGRESO DE CAJA #{{ $egreso->id }}</h2>
            <p><strong>Número:</strong> {{ $egreso->numero ?? 'S/N' }}</p>
            <p><strong>Fecha:</strong> {{ $egreso->fecha->format('d/m/Y H:i') }}</p>
            <p><strong>Usuario:</strong> {{ $egreso->usuario->name ?? 'Sin usuario' }}</p>
            @if($egreso->tipoOperacion)
            <p><strong>Tipo de Operación:</strong> {{ $egreso->tipoOperacion->nombre }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p style="color: #666; font-size: 12px;">
                Impreso: {{ now()->format('d/m/Y H:i') }}
            </p>
        </div>
    </div>
</div>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

{{-- ==================== DESCRIPCIÓN ==================== --}}
@if($egreso->descripcion)
<div style="margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #007bff;">
    <p><strong>Descripción:</strong></p>
    <p>{{ $egreso->descripcion }}</p>
</div>
@endif

{{-- ==================== DETALLES DEL EGRESO ==================== --}}
@if($egreso->detalles && $egreso->detalles->count() > 0)
<div style="margin: 20px 0;">
    <h3 style="margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 10px;">DETALLES DEL EGRESO</h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #333;">
                <th style="padding: 12px; text-align: left; font-weight: bold; width: 25%;">Concepto</th>
                <th style="padding: 12px; text-align: left; font-weight: bold; width: 20%;">Tipo de Operación</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; width: 18%;">💵 Efectivo</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; width: 18%;">🔄 Transferencia</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; width: 19%;">Monto Unitario</th>
            </tr>
        </thead>
        <tbody>
            @foreach($egreso->detalles as $detalle)
                @php
                    $montoUnitario = $detalle->monto_efectivo + $detalle->monto_transferencia;
                @endphp
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; text-align: left;">
                    <strong>{{ $detalle->concepto ?? '-' }}</strong>
                </td>
                <td style="padding: 12px; text-align: left;">
                    <span style="background-color: #e8f4f8; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
                        {{ $detalle->tipoOperacion->nombre ?? '-' }}
                    </span>
                </td>
                <td style="padding: 12px; text-align: right;">
                    @if($detalle->monto_efectivo > 0)
                        <span style="color: #27ae60; font-weight: bold;">Bs. {{ number_format($detalle->monto_efectivo, 2) }}</span>
                    @else
                        <span style="color: #bdc3c7;">Bs. 0.00</span>
                    @endif
                </td>
                <td style="padding: 12px; text-align: right;">
                    @if($detalle->monto_transferencia > 0)
                        <span style="color: #2980b9; font-weight: bold;">Bs. {{ number_format($detalle->monto_transferencia, 2) }}</span>
                    @else
                        <span style="color: #bdc3c7;">Bs. 0.00</span>
                    @endif
                </td>
                <td style="padding: 12px; text-align: right; font-weight: bold; background-color: #f0f8ff; border-radius: 3px;">
                    <span style="color: #c0504d; font-size: 13px;">Bs. {{ number_format($montoUnitario, 2) }}</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

{{-- ==================== RESUMEN DE PAGOS ==================== --}}
@php
    $totalEfectivo = $egreso->detalles->sum('monto_efectivo') ?? 0;
    $totalTransferencia = $egreso->detalles->sum('monto_transferencia') ?? 0;
    $totalGeneral = $totalEfectivo + $totalTransferencia;
@endphp

<div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border: 2px solid #007bff; border-radius: 5px;">
    <h3 style="margin-top: 0; margin-bottom: 15px;">RESUMEN DE PAGOS</h3>

    <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; width: 70%;"><strong>Total en Efectivo:</strong></td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">
                @if($totalEfectivo > 0)
                    Bs. {{ number_format($totalEfectivo, 2) }}
                @else
                    Bs. 0.00
                @endif
            </td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;"><strong>Total en Transferencia/QR:</strong></td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">
                @if($totalTransferencia > 0)
                    Bs. {{ number_format($totalTransferencia, 2) }}
                @else
                    Bs. 0.00
                @endif
            </td>
        </tr>
        <tr style="background-color: #007bff; color: white;">
            <td style="padding: 10px; font-weight: bold; font-size: 14px;">TOTAL GENERAL:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">
                Bs. {{ number_format($totalGeneral, 2) }}
            </td>
        </tr>
    </table>
</div>

{{-- ==================== OBSERVACIONES ==================== --}}
@if($egreso->observaciones)
<div style="margin: 20px 0; padding: 10px; background-color: #fff9e6; border-left: 4px solid #ffc107;">
    <p><strong>Observaciones:</strong></p>
    <p>{{ $egreso->observaciones }}</p>
</div>
@endif

<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

<div style="text-align: center; font-size: 12px; color: #666;">
    <p>Este documento fue generado automáticamente el {{ now()->format('d/m/Y H:i') }}</p>
</div>

@endsection
