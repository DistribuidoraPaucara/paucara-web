@extends('impresion.layouts.base-ticket')

@section('titulo', 'Venta #' . $documento->numero)

@section('contenido')

<div class="separador"></div>

{{-- ==================== INFO DEL DOCUMENTO ==================== --}}
<div class="documento-titulo" style="font-size:12px;">{{ $documento->tipoDocumento->nombre ?? 'Folio: ' }} N°{{ $documento->id }}</div>
{{-- <div class="documento-numero" style="font-size:12px;">{{ $documento->numero }}</div> --}}
<div class="center" style="margin-top: 3px; font-size:12px">
    <p style="margin: 2px 0;"><strong>Creado:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
    <p style="margin: 2px 0;"><strong>Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
</div>

<div class="separador"></div>

{{-- ==================== INFO DEL CLIENTE - Solo si NO es cliente GENERAL ==================== --}}
@if($documento->cliente && $documento->cliente->codigo_cliente !== 'GENERAL')
<div class="documento-info" style="font-size:13px;">
    <p><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</p>
    {{-- <p><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id }} | {{ $documento->cliente->codigo_cliente }}</p> --}}
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
    @if($documento->usuario)
    <p><strong>Vendedor:</strong> {{ $documento->usuario->name }}</p>
    @endif
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

<div class="separador"></div>
@endif

{{-- ==================== ITEMS (Versión Farmacia: 2 filas) ==================== --}}
@include('impresion.ventas.partials._items_farmacia', ['formato' => 'ticket-80-farmacia'])

<div class="separador-doble"></div>

{{-- ==================== TOTALES ==================== --}}
@include('impresion.ventas.partials._totales')

<div class="separador-doble"></div>

{{-- ==================== INFORMACIÓN DE PAGO ==================== --}}
{{-- <div class="center bold" style="font-size: 12px;">
    Politica Pago: {{ $documento->politica_pago ?? 'CONTRA_ENTREGA' }}
</div> --}}

{{-- ✅ NUEVO: Tipo de Pago --}}
@if($documento->tipoPago)
<div class="center" style="font-size: 14px; margin-top: 2px;">
    Tipo Pago: <strong>{{ $documento->tipoPago->nombre }}</strong>
</div>
@endif

{{-- <div class="center" style="margin-top: 5px; font-weight: bold; font-size: 13px;">
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
</div> --}}

{{-- ==================== OBSERVACIONES ==================== --}}
@if($documento->observaciones)
<div class="observaciones">
    <strong>Obs:</strong>
    {{ Str::limit($documento->observaciones, 100) }}
</div>
@endif

<div class="separador"></div>

{{-- ==================== INFORMACIÓN DE CAJA Y ALMACÉN ==================== --}}
{{-- @if($documento->movimientoCaja)
<div class="documento-info" style="font-size:13px;">
    @if($documento->movimientoCaja->caja)
    <p><strong>Caja:</strong> {{ $documento->movimientoCaja->caja->nombre }}</p>
    @endif
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
@endif --}}

<div class="separador"></div>

{{-- ==================== NOTA: VISTA ESPECÍFICA PARA FARMACIAS ==================== --}}
{{-- Esta vista NO incluye el QR de distribuidores, es específica para empresas farmacéuticas --}}
{{-- Para cambios específicos de farmacia, edita esta vista en lugar de la ticket-80 estándar --}}

<div class="separador"></div>

@endsection
