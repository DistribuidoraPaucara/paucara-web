@extends('impresion.layouts.base-a4')

@section('titulo', 'Reporte de Crédito - ' . $cliente['nombre'])

@section('contenido')
{{-- Información del cliente --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">REPORTE DE CRÉDITO</h2>
            <p><strong>Cliente:</strong> {{ $cliente['nombre'] }}</p>
            <p><strong>Código:</strong> {{ $cliente['codigo_cliente'] }}</p>
            @if($cliente['nit'])
                <p><strong>NIT/CI:</strong> {{ $cliente['nit'] }}</p>
            @endif
            @if($cliente['email'])
                <p><strong>Email:</strong> {{ $cliente['email'] }}</p>
            @endif
            @if($cliente['telefono'])
                <p><strong>Teléfono:</strong> {{ $cliente['telefono'] }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Fecha Generación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Límite de Crédito:</strong> <span style="color: #3498db; font-weight: bold;">Bs. {{ number_format($credito['limite_credito'], 2) }}</span></p>
            <p><strong>Saldo Disponible:</strong> <span style="color: #27ae60; font-weight: bold;">Bs. {{ number_format($credito['saldo_disponible'], 2) }}</span></p>
            <p><strong>Utilización:</strong>
                <span style="padding: 3px 8px; border-radius: 3px;
                    @if($credito['porcentaje_utilizacion'] >= 100) background: #f8d7da; color: #721c24;
                    @elseif($credito['porcentaje_utilizacion'] >= 80) background: #fff3cd; color: #856404;
                    @else background: #d4edda; color: #155724;
                    @endif">
                    {{ number_format($credito['porcentaje_utilizacion'], 1) }}%
                </span>
            </p>
        </div>
    </div>
</div>

{{-- Resumen de Crédito --}}
<div style="margin: 15px 0; border: 1px solid #bdc3c7; padding: 10px; background: #ecf0f1; border-radius: 4px;">
    <h3 style="margin-top: 0; color: #2c3e50;">RESUMEN DE CRÉDITO</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 5px;"><strong>Saldo Utilizado:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong>Bs. {{ number_format($credito['saldo_utilizado'], 2) }}</strong></td>
            <td style="width: 30%;"></td>
            <td style="padding: 5px;"><strong>Cuentas Pendientes:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong>{{ $cuentas_pendientes['total'] }}</strong></td>
        </tr>
        <tr>
            <td style="padding: 5px;"><strong>Saldo Disponible:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong style="color: #27ae60;">Bs. {{ number_format($credito['saldo_disponible'], 2) }}</strong></td>
            <td style="width: 30%;"></td>
            <td style="padding: 5px;"><strong>Cuentas Vencidas:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong style="color: #e74c3c;">{{ $cuentas_pendientes['cuentas_vencidas'] }}</strong></td>
        </tr>
        <tr>
            <td style="padding: 5px;"><strong>Límite de Crédito:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong>Bs. {{ number_format($credito['limite_credito'], 2) }}</strong></td>
            <td style="width: 30%;"></td>
            <td style="padding: 5px;"><strong>Días Máximo Vencido:</strong></td>
            <td style="padding: 5px; text-align: right;"><strong>{{ $cuentas_pendientes['dias_maximo_vencido'] }} días</strong></td>
        </tr>
    </table>
</div>

{{-- Tabla de Cuentas por Cobrar --}}
<h3 style="color: #2c3e50; margin-top: 20px;">
    @if($es_cuenta_individual)
        DETALLE DE CUENTA POR COBRAR
    @else
        CUENTAS POR COBRAR
    @endif
</h3>
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 10%;">#Venta</th>
            <th style="width: 12%;">Fecha</th>
            <th style="width: 15%;">Monto Original</th>
            <th style="width: 12%;">Pagado</th>
            <th style="width: 15%;">Saldo Pendiente</th>
            <th style="width: 13%;">Vencimiento</th>
            <th style="width: 13%;">Estado</th>
        </tr>
    </thead>
    <tbody>
        @forelse($todas_las_cuentas as $cuenta)
        <tr style="@if($cuenta['dias_vencido'] > 0) background-color: #f8d7da; @endif">
            <td>#{{ $cuenta['numero_venta'] ?? $cuenta['venta_id'] }}</td>
            <td>{{ \Carbon\Carbon::parse($cuenta['fecha_venta'])->format('d/m/Y') }}</td>
            <td style="text-align: right;">Bs. {{ number_format($cuenta['monto_original'], 2) }}</td>
            <td style="text-align: right; color: #27ae60;"><strong>Bs. {{ number_format($cuenta['monto_original'] - $cuenta['saldo_pendiente'], 2) }}</strong></td>
            <td style="text-align: right; color: #e74c3c;"><strong>Bs. {{ number_format($cuenta['saldo_pendiente'], 2) }}</strong></td>
            <td>{{ \Carbon\Carbon::parse($cuenta['fecha_vencimiento'])->format('d/m/Y') }}</td>
            <td style="text-align: center;">
                @if($cuenta['saldo_pendiente'] == 0)
                    <span style="background: #d4edda; color: #155724; padding: 3px 8px; border-radius: 3px; font-size: 9px;">PAGADO</span>
                @elseif($cuenta['dias_vencido'] > 0)
                    <span style="background: #f8d7da; color: #721c24; padding: 3px 8px; border-radius: 3px; font-size: 9px;">{{ $cuenta['dias_vencido'] }}d VENCIDO</span>
                @else
                    <span style="background: #e8f8f5; color: #0e5f4f; padding: 3px 8px; border-radius: 3px; font-size: 9px;">AL DÍA</span>
                @endif
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="7" style="text-align: center; padding: 15px; color: #7f8c8d;">No hay cuentas por cobrar</td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- Tabla de Pagos Recientes --}}
@if(count($todas_las_cuentas) > 0 && collect($todas_las_cuentas)->flatMap(fn($c) => $c['pagos'] ?? [])->count() > 0)
<h3 style="color: #2c3e50; margin-top: 20px;">HISTORIAL DE PAGOS RECIENTES</h3>
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 10%;">#Venta</th>
            <th style="width: 15%;">Fecha Pago</th>
            <th style="width: 15%;">Monto</th>
            <th style="width: 15%;">Tipo de Pago</th>
            <th style="width: 20%;">Recibo</th>
            <th style="width: 25%;">Registrado Por</th>
        </tr>
    </thead>
    <tbody>
        @php $contadorPagos = 0; @endphp
        @forelse($todas_las_cuentas as $cuenta)
            @forelse($cuenta['pagos'] as $pago)
                @if($contadorPagos < 10)
                <tr>
                    <td>#{{ $cuenta['numero_venta'] ?? $cuenta['venta_id'] }}</td>
                    <td>{{ \Carbon\Carbon::parse($pago['fecha_pago'])->format('d/m/Y H:i') }}</td>
                    <td style="text-align: right; color: #27ae60;"><strong>Bs. {{ number_format($pago['monto'], 2) }}</strong></td>
                    <td><span style="background: #d1ecf1; color: #0c5460; padding: 2px 6px; border-radius: 3px; font-size: 9px;">{{ $pago['tipo_pago'] ?? 'N/A' }}</span></td>
                    <td style="font-family: monospace; font-size: 9px;">{{ $pago['numero_recibo'] ?? '-' }}</td>
                    <td>{{ $pago['usuario'] ?? 'Sistema' }}</td>
                </tr>
                @php $contadorPagos++; @endphp
                @endif
            @empty
            @endforelse
        @empty
        @endforelse
    </tbody>
</table>
@endif

{{-- Notas importantes --}}
@if($cuentas_pendientes['cuentas_vencidas'] > 0)
<div style="margin-top: 20px; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;">
    <strong>⚠️ ALERTA:</strong> Este cliente tiene {{ $cuentas_pendientes['cuentas_vencidas'] }} cuenta(s) vencida(s) por {{ $cuentas_pendientes['dias_maximo_vencido'] }} días.
</div>
@endif

@if($credito['porcentaje_utilizacion'] >= 80)
<div style="margin-top: 10px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; color: #856404;">
    <strong>⚠️ ADVERTENCIA:</strong> Utilización de crédito al {{ number_format($credito['porcentaje_utilizacion'], 1) }}%.
</div>
@endif

<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #bdc3c7; font-size: 9px; color: #7f8c8d; text-align: center;">
    <p>Documento generado automáticamente el {{ now()->format('d/m/Y H:i:s') }} | Sistema de Gestión Distribuidora</p>
</div>

@endsection
