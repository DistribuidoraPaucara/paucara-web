@extends('impresion.layouts.base-a4')

@section('titulo', 'Cierre Diario - Reporte Filtrado')

@section('contenido')
<div class="container">
    <!-- Header -->
    <div style="border-bottom: 3px solid #000; margin-bottom: 20px; padding-bottom: 10px;">
        <h1 style="text-align: center; font-size: 24px; margin: 0;">CIERRE DIARIO - REPORTE FILTRADO</h1>
        <p style="text-align: center; font-size: 12px; color: #666; margin: 5px 0;">Movimientos según filtros aplicados</p>
    </div>

    <!-- Información General -->
    <div style="margin-bottom: 20px;">
        <table style="width: 100%; font-size: 11px;">
            <tr>
                <td style="width: 50%;">
                    <strong>Fecha Apertura:</strong> {{ $cierre->apertura->fecha->format('d/m/Y H:i:s') }}
                </td>
            </tr>
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

    <!-- Información de Filtros Aplicados -->
    <div style="margin-bottom: 20px; padding: 10px; background-color: #e8f4f8; border-left: 4px solid #0099cc;">
        <h3 style="font-size: 13px; margin: 0 0 8px 0;">Filtros Aplicados:</h3>
        <table style="width: 100%; font-size: 10px;">
            @if(!empty($filtros_aplicados['tipos']))
            <tr>
                <td style="padding: 3px;"><strong>Tipos:</strong> {{ implode(', ', $filtros_aplicados['tipos']) }}</td>
            </tr>
            @endif
            @if(!empty($filtros_aplicados['busqueda']))
            <tr>
                <td style="padding: 3px;"><strong>Documento:</strong> "{{ $filtros_aplicados['busqueda'] }}"</td>
            </tr>
            @endif
            @if($filtros_aplicados['monto_min'])
            <tr>
                <td style="padding: 3px;"><strong>Monto Mínimo:</strong> Bs. {{ number_format($filtros_aplicados['monto_min'], 2) }}</td>
            </tr>
            @endif
            @if($filtros_aplicados['monto_max'])
            <tr>
                <td style="padding: 3px;"><strong>Monto Máximo:</strong> Bs. {{ number_format($filtros_aplicados['monto_max'], 2) }}</td>
            </tr>
            @endif
        </table>
    </div>

    <!-- Resumen Filtrado -->
    <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; border-bottom: 2px solid #333; padding-bottom: 5px; margin: 0 0 10px 0;">
            RESUMEN FILTRADO
        </h3>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0; border-bottom: 1px solid #ccc;">
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc;"><strong>Movimientos Filtrados</strong></td>
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc; text-align: right;"><strong>{{ $movimientos_count }}</strong></td>
                <td style="padding: 8px; width: 25%; border-right: 1px solid #ccc;"><strong>Total Ingresos</strong></td>
                <td style="padding: 8px; width: 25%; text-align: right;"><strong style="color: #28a745;">Bs. {{ number_format($total_ingresos, 2) }}</strong></td>
            </tr>
            <tr style="border-bottom: 2px solid #333; background-color: #f9f9f9;">
                <td style="padding: 8px; border-right: 1px solid #ccc;"><strong>Total Egresos</strong></td>
                <td style="padding: 8px; border-right: 1px solid #ccc; text-align: right;"><strong style="color: #dc3545;">Bs. {{ number_format($total_egresos, 2) }}</strong></td>
                <td style="padding: 8px; border-right: 1px solid #ccc;"><strong>Total Neto</strong></td>
                <td style="padding: 8px; text-align: right;">
                    <strong style="font-size: 12px; color: {{ $total_neto >= 0 ? '#28a745' : '#dc3545' }};">
                        Bs. {{ number_format($total_neto, 2) }}
                    </strong>
                </td>
            </tr>
        </table>
    </div>

    <!-- Tabla de Movimientos Filtrados -->
    @if($movimientos_count > 0)
    <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; border-bottom: 2px solid #333; padding-bottom: 5px; margin: 0 0 10px 0;">
            MOVIMIENTOS ({{ $movimientos_count }})
        </h3>
        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #333; color: white; border-bottom: 2px solid #000;">
                    <th style="padding: 8px; text-align: left; border-right: 1px solid white;">ID</th>
                    <th style="padding: 8px; text-align: left; border-right: 1px solid white;">Fecha/Hora</th>
                    <th style="padding: 8px; text-align: left; border-right: 1px solid white;">Usuario</th>
                    <th style="padding: 8px; text-align: left; border-right: 1px solid white;">Tipo</th>
                    <th style="padding: 8px; text-align: left; border-right: 1px solid white;">Documento</th>
                    <th style="padding: 8px; text-align: right;">Monto</th>
                </tr>
            </thead>
            <tbody>
                @foreach($movimientos as $mov)
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 6px; border-right: 1px solid #ddd;">{{ $mov['id'] }}</td>
                    <td style="padding: 6px; border-right: 1px solid #ddd;">{{ $mov['fecha'] }}</td>
                    <td style="padding: 6px; border-right: 1px solid #ddd;">{{ $mov['usuario'] }}</td>
                    <td style="padding: 6px; border-right: 1px solid #ddd;">{{ $mov['tipo_operacion'] }}</td>
                    <td style="padding: 6px; border-right: 1px solid #ddd;">{{ $mov['numero_documento'] }}</td>
                    <td style="padding: 6px; text-align: right; color: {{ $mov['monto'] > 0 ? '#28a745' : '#dc3545' }};">
                        {{ $mov['monto'] > 0 ? '+' : '' }}Bs. {{ number_format($mov['monto'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @else
    <div style="margin-bottom: 20px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
        <p style="font-size: 11px; color: #666; margin: 0;">No hay movimientos que coincidan con los filtros aplicados.</p>
    </div>
    @endif

    <!-- Información de Auditoría -->
    {{-- <div style="margin-bottom: 20px;">
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
        <td style="padding: 8px; border-right: 1px solid #ddd;"><strong>Fecha Apertura:</strong></td>
        <td style="padding: 8px;">{{ $cierre->apertura->fecha->format('d/m/Y H:i:s') }}</td>
    </tr>
    <tr>
        <td style="padding: 8px; border-right: 1px solid #ddd;"><strong>Fecha Cierre:</strong></td>
        <td style="padding: 8px;">{{ $cierre->fecha->format('d/m/Y H:i:s') }}</td>
    </tr>
    </table>
</div> --}}

<!-- Notas finales -->
<div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
    <p>
        <strong>Moneda:</strong> BOB (Boliviano) |
        <strong>Documento generado:</strong> {{ now()->format('d/m/Y H:i:s') }} |
        <strong>Tipo:</strong> Reporte Filtrado de Cierre Diario
    </p>
    <p style="margin-top: 10px;">
        Este documento constituye un registro de los movimientos seleccionados según los filtros aplicados. Los datos mostrados corresponden al cierre #{{ $cierre->id }} realizado el {{ $cierre->fecha->format('d/m/Y') }}.
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
