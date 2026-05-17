{{-- Cliente Information - Reutilizable en todos los formatos --}}
<div class="cliente-info">
    <p><strong>Cliente:</strong> {{ $documento->cliente->nombre }}</p>
    @if($documento->cliente->nit)
        <p><strong>NIT/CI:</strong> {{ $documento->cliente->nit }}</p>
    @endif
    @if($documento->cliente->telefono)
        <p><strong>Teléfono:</strong> {{ $documento->cliente->telefono }}</p>
    @endif
    @if($documento->cliente->email)
        <p><strong>Email:</strong> {{ $documento->cliente->email }}</p>
    @endif
</div>
