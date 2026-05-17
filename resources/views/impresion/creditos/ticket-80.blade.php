@extends('impresion.layouts.base-ticket')

@section('titulo', 'Crédito Cliente - ' . $cliente['nombre'])

@section('contenido')
<div class="separador"></div>

{{-- Titulo --}}
<div class="documento-titulo">
    @if($es_cuenta_individual)
        COMPROBANTE DE CRÉDITO
    @else
        REPORTE DE CRÉDITO
    @endif
</div>
<div class="center" style="font-size: 7px; margin-top: 3px;">
    {{ now()->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

{{-- Info Cliente --}}
<div class="documento-info">
    <p><strong>{{ $cliente['nombre'] }}</strong></p>
    @if($cliente['nit'])
    <p style="font-size: 8px;">NIT/CI: {{ $cliente['nit'] }}</p>
    @endif
    <p style="font-size: 8px;">Código: {{ $cliente['codigo_cliente'] }}</p>
</div>

<div class="separador"></div>

{{-- Resumen de Crédito --}}
<div style="font-size: 8px; margin: 5px 0;">
    <p><strong>CRÉDITO</strong></p>
    <table style="width: 100%; font-size: 7px;">
        <tr>
            <td>Límite:</td>
            <td style="text-align: right;">Bs. {{ number_format($credito['limite_credito'], 2) }}</td>
        </tr>
        <tr>
            <td>Utilizado:</td>
            <td style="text-align: right;">Bs. {{ number_format($credito['saldo_utilizado'], 2) }}</td>
        </tr>
        <tr>
            <td>Disponible:</td>
            <td style="text-align: right; color: #27ae60;"><strong>Bs. {{ number_format($credito['saldo_disponible'], 2) }}</strong></td>
        </tr>
        <tr>
            <td>Utilización:</td>
            <td style="text-align: right;">{{ number_format($credito['porcentaje_utilizacion'], 1) }}%</td>
        </tr>
    </table>
</div>

<div class="separador"></div>

{{-- Cuentas Pendientes --}}
<div style="font-size: 8px;">
    <p><strong>CUENTAS PENDIENTES ({{ $cuentas_pendientes['total'] }})</strong></p>
    <table style="width: 100%; font-size: 7px;">
        <tr>
            <td>Pendientes:</td>
            <td style="text-align: right;">{{ $cuentas_pendientes['total'] }}</td>
        </tr>
        <tr>
            <td>Vencidas:</td>
            <td style="text-align: right; color: #e74c3c;">{{ $cuentas_pendientes['cuentas_vencidas'] }}</td>
        </tr>
        <tr>
            <td>Monto Total:</td>
            <td style="text-align: right;"><strong>Bs. {{ number_format($cuentas_pendientes['monto_total'], 2) }}</strong></td>
        </tr>
        @if($cuentas_pendientes['dias_maximo_vencido'] > 0)
        <tr>
            <td>Vencido por:</td>
            <td style="text-align: right; color: #e74c3c;"><strong>{{ $cuentas_pendientes['dias_maximo_vencido'] }}d</strong></td>
        </tr>
        @endif
    </table>
</div>

<div class="separador-doble"></div>

{{-- Últimas Cuentas --}}
<div style="font-size: 7px;">
    <p><strong>ÚLTIMAS CUENTAS</strong></p>
    @forelse($todas_las_cuentas->take(5) as $cuenta)
    <div style="margin-bottom: 8px; border-bottom: 1px dotted #999; padding-bottom: 5px;">
        <p style="margin: 2px 0; font-weight: bold;">#{{ $cuenta['numero_venta'] ?? $cuenta['venta_id'] }}</p>
        <table style="width: 100%; font-size: 6px;">
            <tr>
                <td>Fecha:</td>
                <td style="text-align: right;">{{ \Carbon\Carbon::parse($cuenta['fecha_venta'])->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td>Monto:</td>
                <td style="text-align: right;">Bs. {{ number_format($cuenta['monto_original'], 2) }}</td>
            </tr>
            <tr>
                <td>Pagado:</td>
                <td style="text-align: right; color: #27ae60;">Bs. {{ number_format($cuenta['monto_original'] - $cuenta['saldo_pendiente'], 2) }}</td>
            </tr>
            <tr>
                <td>Saldo:</td>
                <td style="text-align: right; font-weight: bold;">Bs. {{ number_format($cuenta['saldo_pendiente'], 2) }}</td>
            </tr>
            @if($cuenta['saldo_pendiente'] > 0)
            <tr>
                <td>Vence:</td>
                <td style="text-align: right;">{{ \Carbon\Carbon::parse($cuenta['fecha_vencimiento'])->format('d/m/Y') }}</td>
            </tr>
            @endif
        </table>
    </div>
    @empty
    <p style="text-align: center; color: #999;">Sin cuentas pendientes</p>
    @endforelse
</div>

<div class="separador"></div>

{{-- Observaciones --}}
@if($cuentas_pendientes['cuentas_vencidas'] > 0)
<div style="font-size: 6px; text-align: center; color: #e74c3c; font-weight: bold;">
    ⚠️ {{ $cuentas_pendientes['cuentas_vencidas'] }} CUENTA(S) VENCIDA(S)
</div>
@else
<div style="font-size: 6px; text-align: center; color: #27ae60; font-weight: bold;">
    ✓ CUENTAS AL DÍA
</div>
@endif

@endsection
