@extends('impresion.layouts.base-a4')

@section('titulo', 'Movimientos de Caja #' . $apertura->id)

@section('contenido')

<h2 style="text-align: center; font-size: 16px; color: #4F81BD; margin-bottom: 5px; font-weight: bold;">REPORTE DE MOVIMIENTOS DE CAJA</h2>
<p style="text-align: center; font-size: 9px; color: #666; margin-bottom: 15px;">{{ $fecha_impresion->format('d/m/Y H:i:s') }}</p>

<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <p><strong>Caja:</strong> {{ $apertura->caja->nombre }}</p>
            <p><strong>Ubicación:</strong> {{ $apertura->caja->ubicacion }}</p>
            <p><strong>Responsable:</strong> {{ $usuario->name }}</p>
        </div>
        <div class="documento-info-seccion">
            <p><strong>Apertura:</strong> {{ $apertura->fecha->format('d/m/Y H:i') }}</p>
            @if($apertura->cierre)
            <p><strong>Cierre:</strong> {{ $apertura->cierre->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Estado:</strong> <span style="color: #27ae60; font-weight: bold;">Cerrada</span></p>
            @else
            <p><strong>Estado:</strong> <span style="color: #e74c3c; font-weight: bold;">Abierta</span></p>
            @endif
        </div>
    </div>
</div>

<div class="separador"></div>

{{-- Resumen de totales --}}
<div class="resumen-totales" style="margin-bottom: 20px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Monto Inicial</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{ number_format($apertura->monto_apertura, 2) }} Bs</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Ingresos</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #27ae60;">+{{ number_format($totalIngresos, 2) }} Bs</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Egresos</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #e74c3c;">-{{ number_format($totalEgresos, 2) }} Bs</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Saldo Esperado</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">{{ number_format($apertura->monto_apertura + $totalIngresos - $totalEgresos, 2) }} Bs</td>
        </tr>
    </table>
</div>

<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 12%;">Fecha/Hora</th>
            <th style="width: 15%;">Tipo</th>
            <th style="width: 35%;">Descripción</th>
            <th style="width: 15%;">Referencia</th>
            <th style="width: 23%; text-align: right;">Monto</th>
        </tr>
    </thead>
    <tbody>
        @forelse($movimientos as $movimiento)
        <tr style="@if($movimiento->monto > 0) border-left: 3px solid #27ae60; @else border-left: 3px solid #e74c3c; @endif">
            <td>{{ $movimiento->fecha->format('d/m H:i') }}</td>
            <td>
                <span style="display: inline-block; padding: 2px 6px; background-color: #4F81BD; color: white; border-radius: 2px; font-size: 8px; font-weight: bold;">
                    {{ Str::limit($movimiento->tipoOperacion->nombre, 12) }}
                </span>
            </td>
            <td>{{ Str::limit($movimiento->observaciones, 45) }}</td>
            <td>{{ $movimiento->numero_documento ?? '-' }}</td>
            <td style="text-align: right; font-weight: bold; @if($movimiento->monto > 0) color: #27ae60; @else color: #e74c3c; @endif">
                @if($movimiento->monto > 0) + @endif
                {{ number_format(abs($movimiento->monto), 2) }} Bs
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="5" style="text-align: center; padding: 15px; color: #999;">
                Sin movimientos registrados
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

<div style="margin-top: 25px;"></div>

{{-- Resumen por tipo --}}
@if($movimientosAgrupados->count() > 1)
<h3 style="font-size: 11px; font-weight: bold; color: #4F81BD; margin-bottom: 10px; border-bottom: 1px solid #4F81BD; padding-bottom: 5px;">Resumen por Tipo de Movimiento</h3>

<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 50%; text-align: left;">Tipo</th>
            <th style="width: 25%; text-align: center;">Cantidad</th>
            <th style="width: 25%; text-align: right;">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($movimientosAgrupados as $tipo => $movs)
        <tr>
            <td style="font-weight: bold;">{{ $tipo }}</td>
            <td style="text-align: center;">{{ $movs->count() }}</td>
            <td style="text-align: right; font-weight: bold; @if($movs->sum('monto') > 0) color: #27ae60; @else color: #e74c3c; @endif">
                {{ number_format($movs->sum('monto'), 2) }} Bs
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

<div style="margin-top: 15px;"></div>
@endif

{{-- Totales finales --}}
<div class="totales" style="margin-top: 30px;">
    <table>
        <tr>
            <td style="text-align: left;">Monto Inicial:</td>
            <td style="text-align: right; font-weight: bold;">{{ number_format($apertura->monto_apertura, 2) }} Bs</td>
        </tr>
        <tr>
            <td style="text-align: left;">Total Ingresos:</td>
            <td style="text-align: right; color: #27ae60; font-weight: bold;">+{{ number_format($totalIngresos, 2) }} Bs</td>
        </tr>
        <tr>
            <td style="text-align: left;">Total Egresos:</td>
            <td style="text-align: right; color: #e74c3c; font-weight: bold;">-{{ number_format($totalEgresos, 2) }} Bs</td>
        </tr>
        <tr class="subtotal-row">
            <td style="text-align: left; font-weight: bold;">Total Neto (Ingresos - Egresos):</td>
            <td style="text-align: right; color: {{ ($totalIngresos - $totalEgresos) >= 0 ? '#27ae60' : '#e74c3c' }}; font-weight: bold; font-size: 11px;">{{ number_format($totalIngresos - $totalEgresos, 2) }} Bs</td>
        </tr>
        <tr class="subtotal-row">
            <td style="text-align: left; font-weight: bold;">Saldo Neto del Día:</td>
            <td style="text-align: right; color: #4F81BD; font-weight: bold; font-size: 11px;">{{ number_format($totalDia, 2) }} Bs</td>
        </tr>
        <tr class="total-final">
            <td style="text-align: left;">TOTAL DE MOVIMIENTOS:</td>
            <td style="text-align: right;">{{ $movimientos->count() }} transacciones</td>
        </tr>
    </table>
</div>

{{-- Resumen por Tipo de Pago --}}
@php
    $movimientosAgrupadosPago = $movimientos->groupBy(function($item) {
        return $item->tipoPago ? $item->tipoPago->nombre : 'Sin tipo de pago';
    });
@endphp

@if($movimientosAgrupadosPago->count() > 0)
<h3 style="font-size: 11px; font-weight: bold; color: #4F81BD; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #4F81BD; padding-bottom: 5px;">Resumen por Tipo de Pago</h3>

<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 50%; text-align: left;">Tipo de Pago</th>
            <th style="width: 25%; text-align: center;">Cantidad</th>
            <th style="width: 25%; text-align: right;">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($movimientosAgrupadosPago as $tipo => $movs)
        <tr>
            <td style="font-weight: bold;">{{ $tipo }}</td>
            <td style="text-align: center;">{{ $movs->count() }}</td>
            <td style="text-align: right; font-weight: bold; color: {{ $movs->sum('monto') >= 0 ? '#27ae60' : '#e74c3c' }}">
                {{ number_format(abs($movs->sum('monto')), 2) }} Bs
            </td>
        </tr>
        @endforeach
        <tr style="border-top: 2px solid #4F81BD; background-color: #f0f0f0; font-weight: bold;">
            <td>TOTAL POR TIPO DE PAGO</td>
            <td style="text-align: center;">{{ $movimientos->count() }}</td>
            <td style="text-align: right;">{{ number_format($totalIngresos - $totalEgresos, 2) }} Bs</td>
        </tr>
    </tbody>
</table>
@endif

{{-- Resumen por Tipo de Operación --}}
@php
    $operacionesAgrupadas = $movimientos->groupBy(function($item) {
        return $item->tipoOperacion->nombre;
    });
@endphp

@if($operacionesAgrupadas->count() > 0)
<h3 style="font-size: 11px; font-weight: bold; color: #4F81BD; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #4F81BD; padding-bottom: 5px;">Resumen por Tipo de Operación</h3>

<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 50%; text-align: left;">Tipo de Operación</th>
            <th style="width: 25%; text-align: center;">Cantidad</th>
            <th style="width: 25%; text-align: right;">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($operacionesAgrupadas as $tipo => $movs)
        <tr>
            <td style="font-weight: bold;">{{ $tipo }}</td>
            <td style="text-align: center;">{{ $movs->count() }}</td>
            <td style="text-align: right; font-weight: bold; color: {{ $movs->sum('monto') >= 0 ? '#27ae60' : '#e74c3c' }}">
                {{ number_format($movs->sum('monto'), 2) }} Bs
            </td>
        </tr>
        @endforeach
        <tr style="border-top: 2px solid #4F81BD; background-color: #f0f0f0; font-weight: bold;">
            <td>TOTAL OPERACIONES</td>
            <td style="text-align: center;">{{ $movimientos->count() }}</td>
            <td style="text-align: right;">{{ number_format($totalIngresos - $totalEgresos, 2) }} Bs</td>
        </tr>
    </tbody>
</table>
@endif

<div style="margin-top: 30px; padding-top: 15px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #ddd;">
    <p>Este es un reporte de movimientos de caja generado automáticamente por el sistema.</p>
</div>

@endsection
