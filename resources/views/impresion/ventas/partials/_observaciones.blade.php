{{-- Observaciones --}}
@if($documento->observaciones)
<div class="observaciones">
    <strong>📝 Observaciones:</strong>
    <p style="margin-top: 5px;">
        {{ $documento->observaciones }}
    </p>
</div>
@endif
