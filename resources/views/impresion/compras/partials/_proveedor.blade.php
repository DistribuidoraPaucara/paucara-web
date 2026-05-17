{{-- Información del Proveedor - Reutilizable en todos los formatos --}}
<div class="proveedor-info">
    <p><strong>Proveedor:</strong> {{ $compra->proveedor->nombre }}</p>
    @if($compra->proveedor->nit)
        <p><strong>NIT:</strong> {{ $compra->proveedor->nit }}</p>
    @endif
    @if($compra->proveedor->telefono)
        <p><strong>Teléfono:</strong> {{ $compra->proveedor->telefono }}</p>
    @endif
    @if($compra->proveedor->email)
        <p><strong>Email:</strong> {{ $compra->proveedor->email }}</p>
    @endif
</div>
