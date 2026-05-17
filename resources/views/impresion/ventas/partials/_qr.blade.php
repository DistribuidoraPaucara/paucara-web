{{-- Código QR con enlace público a la venta --}}
<div class="qr-container" style="font-size:12px;">
    @php
    // Obtener o crear token de acceso público
    $accessToken = $documento->accessToken;

    // ✅ CORREGIDO: Si no existe, crear automáticamente
    if (!$accessToken) {
    $accessToken = \App\Models\VentaAccessToken::create([
    'venta_id' => $documento->id,
    'token' => \App\Models\VentaAccessToken::generateToken(),
    'is_active' => true,
    'expires_at' => now()->addDays(30), // Token válido por 30 días
    ]);
    }

    // ✅ Generar URL pública compartible
    $shareUrl = route('venta.preview', ['token' => $accessToken->token]);

    // ✅ Generar QR SIEMPRE con acceso público
    $qrImage = \App\Services\QrCodeService::generateDataUri($shareUrl, 1);
    @endphp

    @if($qrImage)
    <div class="qr-box" style="font-size:12px;">
        <img src="{{ $qrImage }}" alt="QR Code" class="qr-code">
        <p class="qr-label">{{ $documento->numero }}</p>
    </div>
    @endif
</div>
