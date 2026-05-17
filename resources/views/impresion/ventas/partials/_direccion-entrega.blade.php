{{-- Dirección de Entrega - Solo si requiere envío --}}
@if($documento->requiere_envio && $documento->direccionCliente)
<div class="entrega-info">
    <strong>📍 Entregar en:</strong>
    <p style="margin: 5px 0;">
        {{ $documento->direccionCliente->direccion }}
    </p>
    @if($documento->direccionCliente->referencias)
        <p style="margin: 3px 0; font-size: 0.9em; color: #666;">
            Ref: {{ $documento->direccionCliente->referencias }}
        </p>
    @endif
    @if($documento->direccionCliente->localidad)
        <p style="margin: 3px 0; font-size: 0.9em; color: #666;">
            📍 {{ $documento->direccionCliente->localidad }}
        </p>
    @endif
    @if($documento->fecha_entrega_comprometida)
        <p style="margin: 5px 0;">
            <strong>Entrega esperada:</strong> {{ $documento->fecha_entrega_comprometida->format('d/m/Y') }}
        </p>
    @endif
</div>
@endif
