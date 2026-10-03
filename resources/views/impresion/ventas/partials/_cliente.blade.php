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
    {{-- ✅ ACTUALIZADO: Mostrar localidad de la dirección --}}
    @if($documento->direccionCliente?->localidad)
        <p><strong>📍 Localidad:</strong> {{ $documento->direccionCliente->localidad->nombre }}</p>
    @elseif($documento->cliente->localidad)
        <p><strong>📍 Localidad:</strong> {{ $documento->cliente->localidad->nombre }}</p>
    @endif
    {{-- ✅ NUEVO: Mostrar observaciones de la dirección --}}
    @if($documento->direccionCliente?->observaciones)
        <p style="font-size: 12px; font-style: italic; color: #666;">
            <strong>Observaciones:</strong> {{ $documento->direccionCliente->observaciones }}
        </p>
    @endif
</div>
