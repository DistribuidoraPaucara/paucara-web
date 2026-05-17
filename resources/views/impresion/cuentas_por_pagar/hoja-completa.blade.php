@extends('impresion.layouts.base')

@section('titulo', 'Cuenta por Pagar #' . $documento->id)

@section('contenido')

<div style="padding: 20px;">
    {{-- HEADER --}}
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
        <h1 style="margin: 0; font-size: 28px;">CUENTA POR PAGAR</h1>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">Número: {{ $documento->id }}</p>
        <p style="margin: 5px 0; font-size: 12px; color: #999;">Referencia: {{ $documento->referencia_documento ?? 'N/A' }}</p>
        <p style="margin: 5px 0; font-size: 11px; color: #999;">
            Creado: {{ $documento->created_at->format('d/m/Y H:i') }} |
            Impreso: {{ now()->format('d/m/Y H:i') }}
        </p>
    </div>

    {{-- INFORMACIÓN DEL PROVEEDOR Y COMPRA --}}
    <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Información del Proveedor</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
                <td style="padding: 5px; width: 30%;"><strong>Proveedor:</strong></td>
                <td style="padding: 5px; width: 70%;">{{ $documento->compra?->proveedor?->nombre ?? 'N/A' }}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
                <td style="padding: 5px;"><strong>Código:</strong></td>
                <td style="padding: 5px;">#{{ $documento->compra?->proveedor?->id ?? 'N/A' }}</td>
            </tr>
            @if($documento->compra?->proveedor?->ruc)
            <tr>
                <td style="padding: 5px;"><strong>RUC:</strong></td>
                <td style="padding: 5px;">{{ $documento->compra->proveedor->ruc }}</td>
            </tr>
            @endif
            @if($documento->compra?->proveedor?->telefono)
            <tr style="background-color: #f9f9f9;">
                <td style="padding: 5px;"><strong>Teléfono:</strong></td>
                <td style="padding: 5px;">{{ $documento->compra->proveedor->telefono }}</td>
            </tr>
            @endif
            @if($documento->compra?->proveedor?->email)
            <tr>
                <td style="padding: 5px;"><strong>Email:</strong></td>
                <td style="padding: 5px;">{{ $documento->compra->proveedor->email }}</td>
            </tr>
            @endif
        </table>
    </div>

    {{-- DETALLES DE LA COMPRA Y CUENTA --}}
    <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Detalles de la Cuenta</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
                <td style="padding: 5px; width: 30%;"><strong>Número Factura:</strong></td>
                <td style="padding: 5px; width: 70%;">{{ $documento->compra?->numero_factura ?? 'N/A' }}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
                <td style="padding: 5px;"><strong>Fecha Vencimiento:</strong></td>
                <td style="padding: 5px;">{{ $documento->fecha_vencimiento->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td style="padding: 5px;"><strong>Estado:</strong></td>
                <td style="padding: 5px;">
                    @if($documento->estado === 'PAGADO')
                        <span style="background-color: #4CAF50; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px;">PAGADO</span>
                    @elseif($documento->estado === 'VENCIDO')
                        <span style="background-color: #f44336; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px;">VENCIDO</span>
                    @elseif($documento->estado === 'PARCIAL')
                        <span style="background-color: #FF9800; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px;">PARCIAL</span>
                    @else
                        <span style="background-color: #2196F3; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px;">{{ strtoupper($documento->estado) }}</span>
                    @endif
                </td>
            </tr>
            @if($documento->dias_vencido && $documento->dias_vencido > 0)
            <tr style="background-color: #fff3cd;">
                <td style="padding: 5px;"><strong>Días Vencido:</strong></td>
                <td style="padding: 5px; color: #dc3545;"><strong>{{ $documento->dias_vencido }} días</strong></td>
            </tr>
            @endif
        </table>
    </div>

    {{-- MONTOS --}}
    <div style="margin-bottom: 25px; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Resumen Financiero</h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; text-align: right; width: 60%;"><strong>Monto Original:</strong></td>
                <td style="padding: 8px; text-align: right; width: 40%; background-color: white; border-radius: 3px;">Bs {{ number_format($documento->monto_original, 2) }}</td>
            </tr>
            @if($documento->monto_total)
            <tr>
                <td style="padding: 8px; text-align: right;"><strong>Monto Total:</strong></td>
                <td style="padding: 8px; text-align: right; background-color: white; border-radius: 3px;">Bs {{ number_format($documento->monto_total, 2) }}</td>
            </tr>
            @endif
            @if($documento->monto_pagado && $documento->monto_pagado > 0)
            <tr>
                <td style="padding: 8px; text-align: right;"><strong>Monto Pagado:</strong></td>
                <td style="padding: 8px; text-align: right; background-color: white; border-radius: 3px;">Bs {{ number_format($documento->monto_pagado, 2) }}</td>
            </tr>
            @endif
            <tr style="background-color: #2196F3; color: white;">
                <td style="padding: 12px; text-align: right; font-size: 13px;"><strong>SALDO PENDIENTE:</strong></td>
                <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: bold;">Bs {{ number_format($documento->saldo_pendiente, 2) }}</td>
            </tr>
        </table>
    </div>

    {{-- OBSERVACIONES --}}
    @if($documento->observaciones)
    <div style="margin-bottom: 25px; padding: 10px; background-color: #fffbea; border-left: 4px solid #ff9800;">
        <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; color: #ff9800;">Observaciones:</h4>
        <p style="margin: 0; font-size: 10px; line-height: 1.5; color: #333;">{{ $documento->observaciones }}</p>
    </div>
    @endif

    {{-- INFORMACIÓN DEL REGISTRO --}}
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 9px; color: #999;">
        @if($documento->usuario)
        <p style="margin: 3px 0;"><strong>Registrado por:</strong> {{ $documento->usuario->name }}</p>
        @endif
        <p style="margin: 3px 0;"><strong>ID Cuenta:</strong> {{ $documento->id }}</p>
        <p style="margin: 3px 0;"><strong>Fecha de Registro:</strong> {{ $documento->created_at->format('d/m/Y H:i:s') }}</p>
    </div>

    {{-- FIRMA --}}
    <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 10px;">
        <div style="text-align: center; width: 30%;">
            <p style="margin: 0; border-top: 1px solid #333; padding-top: 5px; height: 40px;"></p>
            <p style="margin: 3px 0 0 0;">Firma Autorizado</p>
        </div>
        <div style="text-align: center; width: 30%;">
            <p style="margin: 0; border-top: 1px solid #333; padding-top: 5px; height: 40px;"></p>
            <p style="margin: 3px 0 0 0;">Firma Proveedor</p>
        </div>
        <div style="text-align: center; width: 30%;">
            <p style="margin: 0; border-top: 1px solid #333; padding-top: 5px; height: 40px;"></p>
            <p style="margin: 3px 0 0 0;">Firma Testigo</p>
        </div>
    </div>
</div>

@endsection
