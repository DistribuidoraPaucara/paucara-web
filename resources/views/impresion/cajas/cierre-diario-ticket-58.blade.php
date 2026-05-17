@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre Diario General')

@section('contenido')
<div class="separador"></div>

<div class="documento-titulo" style="font-size: 10px;">CIERRE DIARIO</div>
<div class="documento-numero" style="font-size: 9px;">Resumen General</div>
<div class="center" style="font-size: 7px; margin-top: 3px;">
    {{ $cierre->fecha_ejecucion->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

<div class="documento-info" style="font-size: 8px;">
    <p><strong>Por:</strong> {{ Str::limit($cierre->usuario->name, 15) }}</p>
    <p><strong>Cajas:</strong> {{ $cierre->total_cajas_cerradas }}</p>
</div>

<div class="separador-doble"></div>

<div class="totales">
    <table style="width: 100%; font-size: 8px;">
        <tr>
            <td style="width: 60%;"><strong>Esperado:</strong></td>
            <td class="right" style="width: 40%;"><strong>{{ number_format($cierre->total_monto_esperado, 2) }}</strong></td>
        </tr>
        <tr style="height: 1px;"></tr>
        <tr>
            <td><strong>Real:</strong></td>
            <td class="right"><strong>{{ number_format($cierre->total_monto_real, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador-doble"></div>

<div class="center" style="font-size: 9px; font-weight: bold;">
    @if($cierre->total_diferencias == 0)
    <div>✓ SIN DIFERENCIAS</div>
    <div style="font-size: 10px; margin-top: 2px;">0.00</div>
    @else
    <div>{{ $cierre->total_diferencias > 0 ? '↑ SOBRANTE' : '↓ FALTANTE' }}</div>
    <div style="font-size: 10px; margin-top: 2px;">{{ number_format(abs($cierre->total_diferencias), 2) }}</div>
    @endif
</div>

<div class="separador"></div>

<div class="center" style="font-size: 7px;">
    <p>BOB</p>
    <p style="margin-top: 2px; font-size: 6px;">Cierre consolidado</p>
</div>

@endsection
