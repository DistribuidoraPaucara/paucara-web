@extends('impresion.layouts.base-ticket')

@section('titulo', 'Crédito - ' . $cliente['nombre'])

@section('contenido')
<div class="separador"></div>

{{-- Titulo --}}
<div class="documento-titulo">
    @if($es_cuenta_individual)
        COMPROBANTE
    @else
        CRÉDITO
    @endif
</div>
<div class="documento-numero">{{ $cliente['nombre'] }}</div>
<div class="center" style="font-size: 6px; margin-top: 2px;">
    {{ now()->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

{{-- Código Cliente --}}
<div class="center" style="font-size: 7px;">
    @if($cliente['nit'])
    NIT/CI: {{ $cliente['nit'] }}<br>
    @endif
    Cód: {{ $cliente['codigo_cliente'] }}
</div>

<div class="separador"></div>

{{-- Crédito Resumen --}}
<div style="font-size: 6px;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 2px;">Límite:</td>
            <td style="text-align: right; padding: 2px;"><strong>Bs. {{ number_format($credito['limite_credito'], 2) }}</strong></td>
        </tr>
        <tr>
            <td style="padding: 2px;">Usado:</td>
            <td style="text-align: right; padding: 2px;">Bs. {{ number_format($credito['saldo_utilizado'], 2) }}</td>
        </tr>
        <tr>
            <td style="padding: 2px;">Disponible:</td>
            <td style="text-align: right; padding: 2px; color: #27ae60;"><strong>Bs. {{ number_format($credito['saldo_disponible'], 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador"></div>

{{-- Cuentas Pendientes --}}
<div style="font-size: 6px;">
    <p style="margin: 3px 0; font-weight: bold;">CUENTAS:</p>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 1px;">Pendientes:</td>
            <td style="text-align: right; padding: 1px;"><strong>{{ $cuentas_pendientes['total'] }}</strong></td>
        </tr>
        @if($cuentas_pendientes['cuentas_vencidas'] > 0)
        <tr>
            <td style="padding: 1px;">Vencidas:</td>
            <td style="text-align: right; padding: 1px; color: #e74c3c;"><strong>{{ $cuentas_pendientes['cuentas_vencidas'] }}</strong></td>
        </tr>
        <tr>
            <td style="padding: 1px;">Vencido:</td>
            <td style="text-align: right; padding: 1px; color: #e74c3c;"><strong>{{ $cuentas_pendientes['dias_maximo_vencido'] }}d</strong></td>
        </tr>
        @endif
        <tr style="border-top: 1px solid #ccc;">
            <td style="padding: 1px;"><strong>Total Adeudo:</strong></td>
            <td style="text-align: right; padding: 1px;"><strong>Bs. {{ number_format($cuentas_pendientes['monto_total'], 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador"></div>

{{-- Últimas 3 Cuentas --}}
<div style="font-size: 5px;">
    @forelse($todas_las_cuentas->take(3) as $cuenta)
    <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dotted #999;">
        <p style="margin: 1px 0; font-weight: bold;">#{{ $cuenta['numero_venta'] ?? $cuenta['venta_id'] }}</p>
        <p style="margin: 1px 0;">{{ \Carbon\Carbon::parse($cuenta['fecha_venta'])->format('d/m') }} - Bs. {{ number_format($cuenta['monto_original'], 0) }}</p>
        <p style="margin: 1px 0; color: #e74c3c;"><strong>Saldo: Bs. {{ number_format($cuenta['saldo_pendiente'], 0) }}</strong></p>
    </div>
    @empty
    @endforelse
</div>

<div class="separador"></div>

{{-- Estado Final --}}
<div class="center" style="font-size: 6px; font-weight: bold;">
    @if($cuentas_pendientes['cuentas_vencidas'] > 0)
    <span style="color: #e74c3c;">⚠️ VENCIDAS</span>
    @elseif($cuentas_pendientes['total'] > 0)
    <span style="color: #f39c12;">⏳ PENDIENTES</span>
    @else
    <span style="color: #27ae60;">✓ AL DÍA</span>
    @endif
</div>

@endsection
