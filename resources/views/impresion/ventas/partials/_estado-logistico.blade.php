{{-- Estado Logístico de la Venta --}}
@if($documento->requiere_envio)
    <div class="estado-logistico">
        <strong>📦 Estado de Logística</strong>
        @if($documento->estadoLogistica)
            <p>
                <strong>Estado:</strong> {{ $documento->estadoLogistica->codigo }}
            </p>
        @endif

        {{-- Ventana de entrega si existe --}}
        @if($documento->ventana_entrega_ini && $documento->ventana_entrega_fin)
            <p>
                <strong>Ventana de Entrega:</strong>
                {{ $documento->ventana_entrega_ini->format('H:i') }} - {{ $documento->ventana_entrega_fin->format('H:i') }}
            </p>
        @elseif($documento->hora_entrega_comprometida)
            <p>
                <strong>Hora Comprometida:</strong> {{ $documento->hora_entrega_comprometida->format('H:i') }}
            </p>
        @endif
    </div>
@endif
