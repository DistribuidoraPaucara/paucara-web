@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre Diario General')

@section('contenido')
<div class="separador"></div>

<div class="documento-titulo">CIERRE DIARIO GENERAL</div>
<div class="documento-numero">#{{ $cierre->id }}</div>
<div class="center" style="font-size: 8px; margin-top: 3px;">
    {{ $cierre->fecha_ejecucion->format('d/m/Y H:i:s') }}
</div>

<div class="separador"></div>

<div class="documento-info">
    <p><strong>Ejecutado por:</strong> {{ $cierre->usuario->name }}</p>
    <p><strong>Cajas Cerradas:</strong> {{ $cierre->total_cajas_cerradas }}</p>
</div>

<div class="separador"></div>

<div class="center" style="font-size: 8px;">
    <p><strong>Cajas Procesadas:</strong> {{ $cierre->total_cajas_procesadas }}</p>
    <p><strong>Con Discrepancias:</strong> {{ $cierre->total_cajas_con_discrepancia }}</p>
</div>

<div class="separador-doble"></div>

<div class="totales">
    <table style="width: 100%; font-size: 9px;">
        <tr>
            <td style="width: 50%;"><strong>Total Esperado:</strong></td>
            <td class="right" style="width: 50%;"><strong>Bs {{ number_format($cierre->total_monto_esperado, 2) }}</strong></td>
        </tr>
        <tr style="height: 2px;"></tr>
        <tr>
            <td><strong>Total Real:</strong></td>
            <td class="right"><strong>Bs {{ number_format($cierre->total_monto_real, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador-doble"></div>

<div class="center" style="font-size: 10px; font-weight: bold; margin: 5px 0;">
    @if($cierre->total_diferencias == 0)
    <div>✓ SIN DIFERENCIAS</div>
    <div style="font-size: 12px; margin-top: 2px;">Bs 0.00</div>
    @elseif($cierre->total_diferencias > 0)
    <div>↑ SOBRANTE</div>
    <div style="font-size: 12px; margin-top: 2px;">+Bs {{ number_format($cierre->total_diferencias, 2) }}</div>
    @else
    <div>↓ FALTANTE</div>
    <div style="font-size: 12px; margin-top: 2px;">-Bs {{ number_format(abs($cierre->total_diferencias), 2) }}</div>
    @endif
</div>

<div class="separador"></div>

<div class="center" style="font-size: 8px;">
    <p><strong>Moneda:</strong> BOB (Boliviano)</p>
    <p style="margin-top: 3px; font-size: 7px;">Cierre diario general consolidado</p>
</div>

<div class="separador"></div>

<!-- Espacio para Firmas -->
<div class="firmas-container">
    <table>
        <tr>
            <td style="width: 50%;">
                <p>Firma Autorizado</p>
            </td>
            <td style="width: 50%;">
                <p>Firma Recibido</p>
            </td>
        </tr>
    </table>
</div>

@endsection
