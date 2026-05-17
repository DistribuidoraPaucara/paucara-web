@extends('impresion.layouts.base-ticket')

@section('titulo', 'Venta Folio' . $documento->id)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo" style="font-size:12px;">{{ $documento->tipoDocumento->nombre ?? 'Folio: ' }} N°{{ $documento->id }}</div>
<div class="documento-numero" style="font-size:12px;">{{ $documento->numero }}</div>
<div class="center" style="margin-top: 3px; font-size:11px">
    <p style="margin: 2px 0;"><strong>Creados:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL CLIENTE ==================== --}}
<div class="documento-info" style="font-size:12px;">
    <p><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</p>
    @if($documento->cliente->razon_social)
    <p><strong>Razon Social:</strong> {{ $documento->cliente->razon_social }}</p>
    @endif
    <p><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id }} | {{ $documento->cliente->codigo_cliente }}</p>
    @if($documento->cliente->nit)
    <p><strong>NIT/CI:</strong> {{ $documento->cliente->nit }}</p>
    @endif
    {{-- ✅ NUEVO: Mostrar localidad del cliente --}}
    @if($documento->cliente->localidad)
    <p><strong>Localidad:</strong> {{ $documento->cliente->localidad->nombre ?? 'Sin localidad' }}</p>
    @endif
    {{-- ✅ NUEVO: Mostrar dirección registrada en la venta --}}
    {{-- @if($documento->direccionCliente)
    <p><strong>Dirección:</strong> {{ $documento->direccionCliente->direccion ?? 'Sin dirección' }}</p>
    @endif --}}
    @if($documento->direccionCliente)
    <p style="center"><strong>Dir:</strong> {{ $documento->direccionCliente->observaciones ?? 'Sin direccion' }}</p>
    @endif
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            @if($documento->usuario)
            <td style="width: 50%; padding: 2px 5px 2px 0;"><strong>Vendedor:</strong> {{ $documento->usuario->name }}</td>
            @endif
            @if($documento->movimientoCaja && $documento->movimientoCaja->caja)
            <td style="width: 50%; padding: 2px 0;"><strong>Caja:</strong> {{ $documento->movimientoCaja->caja->nombre }}</td>
            @endif
        </tr>
    </table>
    {{-- ✅ NUEVO: Mostrar preventista (desde proforma O directamente de preventista_id) --}}
    @php
    $preventista = null;
    // Prioridad 1: Usuario creador de la proforma (si existe)
    if ($documento->proforma_id && $documento->proforma && $documento->proforma->usuarioCreador) {
        $preventista = $documento->proforma->usuarioCreador;
    }
    // Prioridad 2: Preventista directo (preventista_id)
    elseif ($documento->preventista_id && $documento->preventista) {
        $preventista = $documento->preventista;
    }
    @endphp
    @if($preventista)
    <p><strong>Preventista:</strong> {{ $preventista->name }}</p>
    @endif
</div>

@if($documento->movimientoCaja)
<div class="documento-info" style="font-size:13px;">
    
    @if($documento->detalles && $documento->detalles->first())
    @php
    $primeraLinea = $documento->detalles->first();
    $almacen = null;
    if($primeraLinea && $primeraLinea->producto && $primeraLinea->producto->stock) {
    $stock = $primeraLinea->producto->stock->first();
    if($stock && $stock->almacen) {
    $almacen = $stock->almacen;
    }
    }
    @endphp
    @if($almacen)
    <p><strong>Almacén:</strong> {{ $almacen->nombre }}</p>
    @endif
    @endif
</div>
@endif

<div class="separador"></div>

{{-- ==================== ITEMS ==================== --}}
@include('impresion.ventas.partials._items', ['formato' => 'ticket-80'])

<div class="separador-doble"></div>

{{-- ==================== TOTALES ==================== --}}
@include('impresion.ventas.partials._totales')

<div class="separador"></div>
@if($documento->tipoPago)
<div class="center bold" style="font-size: 12px; margin-top: 2px;">
    Tipo Pago: <strong>{{ $documento->tipoPago->nombre }}</strong>
</div>
@endif

{{-- ==================== INFORMACIÓN DE PAGO ==================== --}}
<div class="center bold" style="font-size: 12px;">
    Politica Pago: {{ $documento->politica_pago ?? 'CONTRA_ENTREGA' }}
</div>

{{-- ✅ NUEVO: Tipo de Pago --}}

<div class="center" style="margin-top: 5px; font-weight: bold; font-size: 13px;">
    @if($documento->estado_pago === 'PAGADA')
    <span>PAGADA</span>
    @elseif($documento->estado_pago === 'PARCIAL')
    <span>PAGO PARCIAL</span><br>
    <span>Pendiente: {{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->monto_pendiente ?? 0, 2) }}</span>
    @elseif($documento->estado_pago === 'PENDIENTE')
    <span>PENDIENTE PAGO</span><br>
    <span>Pendiente: {{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->monto_pendiente ?? $documento->subtotal, 2) }}</span>
    @else
    <span>{{ $documento->estado_pago ?? 'SIN ESTADO' }}</span>
    @endif
</div>

<div class="separador"></div>

@endsection
