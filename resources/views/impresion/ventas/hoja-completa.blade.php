@extends('impresion.layouts.base-a4')

@section('titulo', 'Factura #' . $documento->numero)

@section('contenido')

{{-- ==================== INFORMACIÓN DEL DOCUMENTO ==================== --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2>{{ $documento->tipoDocumento->nombre ?? 'FACTURA' }} #{{ $documento->numero }}</h2>
            <p><strong>Fecha de Creación:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Fecha y Hora de Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Moneda:</strong> {{ $documento->moneda->codigo ?? 'BOB' }}</p>
            @if($documento->estadoDocumento)
                <p><strong>Estado:</strong> {{ $documento->estadoDocumento->nombre }}</p>
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
            @if($documento->movimientoCaja && $documento->movimientoCaja->caja)
                <p><strong>Caja:</strong> {{ $documento->movimientoCaja->caja->nombre }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            {{-- Cliente --}}
            @include('impresion.ventas.partials._cliente')
            {{-- Código del cliente --}}
            <p style="margin-top: 10px;"><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id }}</p>
        </div>
    </div>
</div>

{{-- ==================== INFORMACIÓN DE ENTREGA (si aplica) ==================== --}}
@include('impresion.ventas.partials._direccion-entrega')

{{-- ==================== TABLA DE PRODUCTOS ==================== --}}
@include('impresion.ventas.partials._items', ['formato' => 'a4'])

{{-- ==================== TOTALES ==================== --}}
@include('impresion.ventas.partials._totales')

{{-- ==================== ESTADO LOGÍSTICO (si aplica) ==================== --}}
@include('impresion.ventas.partials._estado-logistico')

{{-- ==================== INFORMACIÓN DE PAGO ==================== --}}
@include('impresion.ventas.partials._informacion-pago')

{{-- ==================== OBSERVACIONES ==================== --}}
@include('impresion.ventas.partials._observaciones')

{{-- ==================== ALMACÉN ==================== --}}
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
    <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
        <p><strong>Almacén:</strong> {{ $almacen->nombre }}</p>
    </div>
    @endif
@endif

{{-- ==================== QR CODE ==================== --}}
@include('impresion.ventas.partials._qr')

{{-- ==================== TÉRMINOS Y CONDICIONES ==================== --}}
@include('impresion.ventas.partials._terminos-condiciones')

@endsection
