@extends('impresion.layouts.base-a4')

@section('titulo', 'Reporte Entrega #' . $documento->id)

@section('contenido')

{{-- ==================== INFORMACIÓN DEL DOCUMENTO ==================== --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2>REPORTE DE ENTREGA - {{ $documento->tipoDocumento->nombre ?? 'FACTURA' }} #{{ $documento->numero }}</h2>
            <p><strong>Fecha de Creación:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Fecha y Hora de Impresión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Moneda:</strong> {{ $documento->moneda->codigo ?? 'BOB' }}</p>
            @if($documento->estadoDocumento)
                <p><strong>Estado Documento:</strong> {{ $documento->estadoDocumento->nombre }}</p>
            @endif
            @if($documento->usuario)
                <p><strong>Vendedor:</strong> {{ $documento->usuario->name }}</p>
            @endif
            {{-- ✅ Mostrar preventista (desde proforma O directamente de preventista_id) --}}
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
<div style="page-break-inside: avoid;">
    <h3 style="border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">📦 PRODUCTOS</h3>
    @include('impresion.ventas.partials._items', ['formato' => 'a4'])
</div>

{{-- ==================== TOTALES ==================== --}}
@include('impresion.ventas.partials._totales')

{{-- ==================== ESTADO LOGÍSTICO (si aplica) ==================== --}}
@include('impresion.ventas.partials._estado-logistico')

{{-- ==================== INFORMACIÓN DE PAGO ==================== --}}
@include('impresion.ventas.partials._informacion-pago')

{{-- ==================== OBSERVACIONES DE VENTA ==================== --}}
@if($documento->observaciones || $documento->observaciones_logistica)
    <div style="margin-top: 20px; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #2196F3; border-radius: 4px;">
        <h3 style="color: #1976D2; margin: 0 0 10px 0; font-size: 13px;">📌 OBSERVACIONES</h3>

        @if($documento->observaciones)
            <div style="margin-bottom: 10px;">
                <strong style="font-size: 11px;">Observaciones Generales:</strong>
                <p style="margin: 3px 0 0 0; font-size: 11px; white-space: pre-wrap;">{{ $documento->observaciones }}</p>
            </div>
        @endif

        @if($documento->observaciones_logistica)
            <div>
                <strong style="font-size: 11px;">Observaciones Logística:</strong>
                <p style="margin: 3px 0 0 0; font-size: 11px; white-space: pre-wrap;">{{ $documento->observaciones_logistica }}</p>
            </div>
        @endif
    </div>
@endif

{{-- ==================== CONFIRMACIÓN DE ENTREGA ==================== --}}
@include('impresion.ventas.partials._confirmacion-entrega')

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

{{-- ==================== TÉRMINOS Y CONDICIONES ==================== --}}
@include('impresion.ventas.partials._terminos-condiciones')

@endsection
