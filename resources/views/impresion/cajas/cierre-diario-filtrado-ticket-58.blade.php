@extends('impresion.layouts.base-ticket')

@section('titulo', 'Cierre Diario - Reporte Filtrado')

@section('contenido')
<div class="separador"></div>

<div class="documento-titulo" style="font-size: 10px;">CIERRE DIARIO</div>
<div class="documento-numero" style="font-size: 9px;">Reporte Filtrado</div>
<div class="center" style="font-size: 7px; margin-top: 3px;">
    {{ $cierre->fecha->format('d/m/Y H:i') }}
</div>

<div class="separador"></div>

<div class="documento-info" style="font-size: 8px;">
    <p><strong>Por:</strong> {{ Str::limit($cierre->usuario->name, 15) }}</p>
    <p><strong>Caja:</strong> {{ Str::limit($cierre->caja->nombre, 15) }}</p>
</div>

<div class="separador-doble"></div>

<div class="documento-info" style="font-size: 7px;">
    @if(!empty($filtros_aplicados['tipos']))
        <p><strong>Tipos:</strong> {{ implode(', ', array_slice($filtros_aplicados['tipos'], 0, 2)) }}</p>
    @endif
    @if(!empty($filtros_aplicados['busqueda']))
        <p><strong>Doc:</strong> {{ substr($filtros_aplicados['busqueda'], 0, 15) }}</p>
    @endif
</div>

<div class="separador"></div>

<div class="totales">
    <table style="width: 100%; font-size: 8px;">
        <tr>
            <td style="width: 60%;"><strong>Movimientos:</strong></td>
            <td class="right" style="width: 40%;"><strong>{{ $movimientos_count }}</strong></td>
        </tr>
        <tr style="height: 1px;"></tr>
        <tr>
            <td><strong>Ingresos:</strong></td>
            <td class="right"><strong>{{ number_format($total_ingresos, 2) }}</strong></td>
        </tr>
        <tr style="height: 1px;"></tr>
        <tr>
            <td><strong>Egresos:</strong></td>
            <td class="right"><strong>{{ number_format($total_egresos, 2) }}</strong></td>
        </tr>
    </table>
</div>

<div class="separador-doble"></div>

<div class="center" style="font-size: 9px; font-weight: bold;">
    @if($total_neto >= 0)
    <div>POSITIVO</div>
    <div style="font-size: 10px; margin-top: 2px;">{{ number_format($total_neto, 2) }}</div>
    @else
    <div>NEGATIVO</div>
    <div style="font-size: 10px; margin-top: 2px;">{{ number_format($total_neto, 2) }}</div>
    @endif
</div>

<div class="separador"></div>

<div class="center" style="font-size: 7px;">
    <p>BOB</p>
    <p style="margin-top: 2px; font-size: 6px;">Reporte Filtrado</p>
</div>

@endsection
