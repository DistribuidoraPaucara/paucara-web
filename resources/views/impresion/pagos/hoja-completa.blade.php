@extends('impresion.layouts.base-a4')

@section('titulo', 'Comprobante de Pago - ' . $cliente['nombre'])

@section('contenido')
{{-- Separador inicial --}}
<div style="border-top: 2px solid #2c3e50; margin-bottom: 20px;"></div>

{{-- Título del documento --}}
<div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #27ae60; margin: 0; font-size: 24px;">COMPROBANTE DE PAGO</h1>
    <p style="color: #7f8c8d; margin: 5px 0; font-size: 11px;">Recibo de Pago Generado por el Sistema</p>
</div>

{{-- Número y fecha de comprobante --}}
<div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: #ecf0f1; border-radius: 4px;">
    <div>
        <p style="margin: 0; font-size: 10px;"><strong>Comprobante #:</strong> {{ $pago['id'] }}</p>
        <p style="margin: 5px 0 0 0; font-size: 10px;"><strong>Fecha Impresión:</strong> {{ $fecha_impresion->format('d/m/Y H:i:s') }}</p>
    </div>
    <div style="text-align: right;">
        <p style="margin: 0; font-size: 10px;"><strong>Fecha Pago:</strong> {{ \Carbon\Carbon::parse($pago['fecha_pago'])->format('d/m/Y') }}</p>
        <p style="margin: 5px 0 0 0; font-size: 10px;"><strong>Usuario:</strong> {{ is_string($usuario) ? $usuario : (isset($usuario->name) ? $usuario->name : 'Sistema') }}</p>
    </div>
</div>

{{-- Separador --}}
<div style="border-top: 1px solid #bdc3c7; margin: 15px 0;"></div>

{{-- Información del cliente --}}
<div style="margin-bottom: 15px;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px; font-size: 12px;">INFORMACIÓN DEL CLIENTE</h3>
    <table style="width: 100%; font-size: 10px;">
        <tr>
            <td style="padding: 5px; width: 50%;"><strong>Cliente:</strong> {{ $cliente['nombre'] }}</td>
            <td style="padding: 5px; width: 50%;"><strong>Código:</strong> {{ $cliente['codigo_cliente'] }}</td>
        </tr>
        @if($cliente['nit'])
        <tr>
            <td style="padding: 5px;"><strong>NIT/CI:</strong> {{ $cliente['nit'] }}</td>
            <td style="padding: 5px;"><strong>Email:</strong> {{ $cliente['email'] ?? '-' }}</td>
        </tr>
        @endif
        @if($cliente['telefono'])
        <tr>
            <td style="padding: 5px;" colspan="2"><strong>Teléfono:</strong> {{ $cliente['telefono'] }}</td>
        </tr>
        @endif
    </table>
</div>

{{-- Separador --}}
<div style="border-top: 1px solid #bdc3c7; margin: 15px 0;"></div>

{{-- Monto destacado --}}
<div style="text-align: center; padding: 20px; background: #d4edda; border: 2px solid #27ae60; border-radius: 4px; margin-bottom: 15px;">
    <p style="margin: 0; color: #7f8c8d; font-size: 11px;">MONTO PAGADO</p>
    <p style="margin: 5px 0; color: #27ae60; font-size: 32px; font-weight: bold;">{{ $pago['moneda']['simbolo'] }} {{ number_format($pago['monto'], 2) }}</p>
</div>

{{-- Detalle del pago --}}
<div style="margin-bottom: 15px;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px; font-size: 12px;">DETALLE DEL PAGO</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <tr style="background: #ecf0f1;">
            <th style="padding: 8px; border: 1px solid #bdc3c7; text-align: left;">Concepto</th>
            <th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">Valor</th>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Tipo de Pago:</strong> {{ $pago['tipo_pago'] }}</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;"><strong>{{ $pago['moneda']['simbolo'] }} {{ number_format($pago['monto'], 2) }}</strong></td>
        </tr>
        @if($pago['numero_recibo'])
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Número de Recibo:</strong> {{ $pago['numero_recibo'] }}</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        @endif
        @if($pago['numero_transferencia'])
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Número de Transferencia:</strong> {{ $pago['numero_transferencia'] }}</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        @endif
        @if($pago['numero_cheque'])
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Número de Cheque:</strong> {{ $pago['numero_cheque'] }}</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;"></td>
        </tr>
        @endif
    </table>
</div>

{{-- Información de la venta/cuenta aplicada --}}
@if($venta || $cuenta)
<div style="margin-bottom: 15px;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px; font-size: 12px;">APLICADO A VENTA/CUENTA</h3>
    @if($venta)
    <p style="margin: 5px 0; font-size: 10px;"><strong>Número de Venta:</strong> #{{ $venta['numero'] }}</p>
    <p style="margin: 5px 0; font-size: 10px;"><strong>Fecha de Venta:</strong> {{ \Carbon\Carbon::parse($venta['fecha'])->format('d/m/Y') }}</p>
    <p style="margin: 5px 0; font-size: 10px;"><strong>Monto Total Venta:</strong> {{ $pago['moneda']['simbolo'] }} {{ number_format($venta['total'], 2) }}</p>
    @endif
    @if($cuenta)
    <p style="margin: 5px 0; font-size: 10px;"><strong>Cuenta por Cobrar #:</strong> {{ $cuenta['id'] }}</p>
    <p style="margin: 5px 0; font-size: 10px;"><strong>Monto Original de Cuenta:</strong> {{ $pago['moneda']['simbolo'] }} {{ number_format($cuenta['monto_original'], 2) }}</p>
    @endif
</div>

{{-- Separador --}}
<div style="border-top: 1px solid #bdc3c7; margin: 15px 0;"></div>

{{-- Estado de la cuenta después del pago --}}
@if($cuenta)
<div style="margin-bottom: 15px;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px; font-size: 12px;">ESTADO DE CUENTA</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <tr style="background: #ecf0f1;">
            <th style="padding: 8px; border: 1px solid #bdc3c7; text-align: left;">Concepto</th>
            <th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">Monto</th>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">Saldo Anterior</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;"><strong>{{ $pago['moneda']['simbolo'] }} {{ number_format($cuenta['saldo_anterior'], 2) }}</strong></td>
        </tr>
        <tr style="background: #d4edda;">
            <td style="padding: 8px; border: 1px solid #bdc3c7; color: #27ae60;"><strong>(-) Pago Realizado</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right; color: #27ae60;"><strong>({{ $pago['moneda']['simbolo'] }} {{ number_format($pago['monto'], 2) }})</strong></td>
        </tr>
        <tr style="background: #e8f8f5; border-top: 2px solid #27ae60;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;"><strong>Nuevo Saldo</strong></td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;"><strong>{{ $pago['moneda']['simbolo'] }} {{ number_format($cuenta['saldo_pendiente'], 2) }}</strong></td>
        </tr>
    </table>

    {{-- Estado de la cuenta --}}
    <div style="margin-top: 10px;">
        <p style="margin: 5px 0; font-size: 10px;">
            <strong>Estado de Cuenta:</strong>
            @if($cuenta['saldo_pendiente'] == 0)
                <span style="background: #d4edda; color: #155724; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold;">PAGADO TOTALMENTE</span>
            @elseif($cuenta['saldo_pendiente'] < $cuenta['monto_original'])
                <span style="background: #fff3cd; color: #856404; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold;">PAGO PARCIAL</span>
            @else
                <span style="background: #f8d7da; color: #721c24; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold;">PENDIENTE</span>
            @endif
        </p>
    </div>
</div>
@endif
@endif

{{-- Separador --}}
<div style="border-top: 1px solid #bdc3c7; margin: 15px 0;"></div>

{{-- Observaciones --}}
@if($pago['observaciones'])
<div style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 5px; font-size: 11px;">OBSERVACIONES</h3>
    <p style="margin: 0; font-size: 10px;">{{ $pago['observaciones'] }}</p>
</div>

{{-- Separador --}}
<div style="border-top: 1px solid #bdc3c7; margin: 15px 0;"></div>
@endif

{{-- Mensaje de confirmación --}}
<div style="text-align: center; padding: 15px; background: #d4edda; border: 1px solid #27ae60; border-radius: 4px;">
    <p style="margin: 0; color: #155724; font-size: 11px; font-weight: bold;">
        ✓ PAGO REGISTRADO EXITOSAMENTE
    </p>
    <p style="margin: 5px 0 0 0; color: #155724; font-size: 9px;">
        Este comprobante confirma la recepción del pago en {{ $empresa->nombre ?? 'Nuestro Sistema' }}
    </p>
</div>

{{-- Footer --}}
<div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #bdc3c7; font-size: 8px; color: #7f8c8d; text-align: center;">
    <p style="margin: 0;">{{ $empresa->nombre ?? 'Distribuidora' }} | {{ $empresa->nit ?? '' }}</p>
    <p style="margin: 5px 0 0 0;">Documento generado automáticamente el {{ now()->format('d/m/Y H:i:s') }}</p>
    <p style="margin: 5px 0 0 0;">Sistema de Gestión de Distribuidora - Todos los derechos reservados</p>
</div>

@endsection
