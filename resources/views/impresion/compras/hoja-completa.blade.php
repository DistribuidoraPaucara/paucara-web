@extends('impresion.layouts.base-a4')

@section('titulo', 'Comprobante de Compra #' . $compra->numero)

@section('contenido')

{{-- ==================== INFORMACIÓN DEL DOCUMENTO ==================== --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2>COMPRA #{{ $compra->id }}</h2>
            <p><strong>Numero Compra: </strong>{{ $compra->numero }}</p>
            <p><strong>Fecha:</strong> {{ $compra->fecha->format('d/m/Y') }}</p>
            {{-- <p><strong>Moneda:</strong> {{ $compra->moneda->codigo ?? 'BOB' }}</p> --}}
            @if($compra->estadoDocumento)
                <p><strong>Estado:</strong> {{ $compra->estadoDocumento->nombre }}</p>
            @endif
            @if($compra->numero_factura)
                <p><strong>Numero Factura Proveedor: </strong> #{{ $compra->numero_factura }}</p>
            @endif
            @if($compra->usuario)
                <p><strong>Recibido por:</strong> {{ $compra->usuario->name }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            {{-- Proveedor --}}
            @include('impresion.compras.partials._proveedor')
        </div>
    </div>
</div>

{{-- ==================== INFORMACIÓN DEL ALMACÉN ==================== --}}
@include('impresion.compras.partials._almacen')

{{-- ==================== TABLA DE PRODUCTOS ==================== --}}
@include('impresion.compras.partials._items', ['formato' => 'a4'])

{{-- ==================== TOTALES ==================== --}}
@include('impresion.compras.partials._totales')

{{-- ==================== INFORMACIÓN DE PAGO ==================== --}}
@include('impresion.compras.partials._informacion-pago')

{{-- ==================== OBSERVACIONES ==================== --}}
@include('impresion.compras.partials._observaciones')

{{-- ==================== CONFIRMACIÓN ==================== --}}
<div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #ddd;">
    <p style="color: #27ae60; font-weight: bold;">✓ Compra registrada correctamente en el sistema</p>
    <p style="font-size: 11px; color: #666;">Impreso: {{ now()->format('d/m/Y H:i') }}</p>
    @if(isset($usuario))
        <p style="font-size: 10px; color: #999;">Por: {{ is_string($usuario) ? $usuario : (isset($usuario->name) ? $usuario->name : 'Sistema') }}</p>
    @endif
</div>

@endsection
