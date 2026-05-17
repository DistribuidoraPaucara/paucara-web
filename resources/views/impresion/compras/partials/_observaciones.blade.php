{{-- Observaciones de la Compra --}}
@if($compra->observaciones)
<div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #3498db; font-size: 13px;">
    <h4 style="margin-top: 0; color: #333;">📝 Observaciones</h4>
    <p style="margin: 0; white-space: pre-wrap;">{{ $compra->observaciones }}</p>
</div>
@endif
