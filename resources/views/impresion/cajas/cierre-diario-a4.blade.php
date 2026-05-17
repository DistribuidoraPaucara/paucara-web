@extends('impresion.layouts.base-a4')

@section('titulo', 'Cierre Diario General')

@section('contenido')
<div class="container">
    <!-- Header -->
    <div style="border-bottom: 3px solid #000; margin-bottom: 20px; padding-bottom: 10px;">
        <h1 style="text-align: center; font-size: 24px; margin: 0;">CIERRE DIARIO GENERAL</h1>
        <p style="text-align: center; font-size: 12px; color: #666; margin: 5px 0;">Resumen consolidado de todas las cajas</p>
    </div>

    <!-- Información General -->
    <div style="margin-bottom: 20px;">
        <table style="width: 100%; font-size: 11px;">
            <tr>
                <td style="width: 50%;">
                    <strong>Fecha/Hora Cierre:</strong> {{ $cierre->fecha->format('d/m/Y H:i:s') }}
                </td>
                <td style="width: 50%; text-align: right;">
                    <strong>Ejecutado por:</strong> {{ $cierre->usuario->name }}
                </td>
            </tr>
            <tr style="height: 5px;"></tr>
            <tr>
                <td colspan="2">
                    <strong>Caja:</strong> {{ $cierre->caja->nombre }} | <strong>ID Cierre:</strong> {{ $cierre->id }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Métricas Principales -->
    <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; border-bottom: 2px solid #333; padding-bottom: 5px; margin: 0 0 10px 0;">
            RESUMEN DE CIERRE
        </h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0; border-bottom: 1px solid #ccc;">
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc;"><strong>Fecha Apertura</strong></td>
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc; text-align: right;"><strong>{{ $cierre->apertura->fecha->format('d/m/Y H:i:s') }}</strong></td>
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc;"><strong>Monto Apertura</strong></td>
                <td style="padding: 8px; width: 25%; text-align: right;"><strong>Bs. {{ number_format($cierre->apertura->monto_apertura, 2) }}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px; border-right: 1px solid #ccc;">Monto Esperado</td>
                <td style="padding: 8px; border-right: 1px solid #ccc; text-align: right;">Bs. {{ number_format($cierre->monto_esperado, 2) }}</td>
                <td style="padding: 8px; border-right: 1px solid #ccc;">Monto Real</td>
                <td style="padding: 8px; text-align: right;">Bs. {{ number_format($cierre->monto_real, 2) }}</td>
            </tr>
            <tr style="background-color: #fff3cd; border-bottom: 2px solid #333;">
                <td colspan="2" style="padding: 8px; border-right: 1px solid #ccc;"><strong>Diferencia</strong></td>
                <td colspan="2" style="padding: 8px; text-align: right;">
                    <strong style="font-size: 13px; color: {{ $cierre->diferencia == 0 ? '#28a745' : ($cierre->diferencia > 0 ? '#007bff' : '#dc3545') }};">
                        {{ $cierre->diferencia == 0 ? '✓ SIN DIFERENCIAS' : ($cierre->diferencia > 0 ? '+' : '') }} Bs. {{ number_format($cierre->diferencia, 2) }}
                    </strong>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información de Auditoría -->
    <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; border-bottom: 2px solid #333; padding-bottom: 5px; margin: 0 0 10px 0;">
            INFORMACIÓN DEL CIERRE
        </h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; width: 30%; border-right: 1px solid #ddd;"><strong>ID Cierre:</strong></td>
                <td style="padding: 8px;">{{ $cierre->id }}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; border-right: 1px solid #ddd;"><strong>Caja:</strong></td>
                <td style="padding: 8px;">{{ $cierre->caja->nombre }} (ID: {{ $cierre->caja_id }})</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; border-right: 1px solid #ddd;"><strong>Ejecutado por:</strong></td>
                <td style="padding: 8px;">{{ $cierre->usuario->name }}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; border-right: 1px solid #ddd;"><strong>Fecha de Cierre:</strong></td>
                <td style="padding: 8px;">{{ $cierre->fecha->format('d/m/Y H:i:s') }}</td>
            </tr>
        </table>
    </div>

    <!-- Notas finales -->
    <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
        <p>
            <strong>Moneda:</strong> BOB (Boliviano) |
            <strong>Documento generado:</strong> {{ now()->format('d/m/Y H:i:s') }} |
            <strong>Tipo:</strong> Cierre Diario General Consolidado
        </p>
        <p style="margin-top: 10px;">
            Este documento constituye un registro oficial de auditoría. Todos los cierres incluidos en este resumen han sido verificados y consolidados automáticamente por el sistema.
        </p>
    </div>
</div>

<style>
    .container {
        margin: 20px;
    }
    table {
        width: 100%;
    }
</style>
@endsection
