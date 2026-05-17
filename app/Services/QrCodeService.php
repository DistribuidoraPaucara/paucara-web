<?php

namespace App\Services;

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

class QrCodeService
{
    /**
     * Generar QR como data URI (SVG es escalable y funciona perfectamente en PDF)
     * @param string $data Datos a codificar en el QR
     * @param int $scale Escala del QR (1-10, default 1 es más pequeño)
     */
    public static function generateDataUri($data, $scale = 1): ?string
    {
        try {
            $options = new QROptions([
                'scale' => $scale,
                'quietZoneSize' => 1,
            ]);

            $qrCode = new QRCode($options);
            // render() devuelve un data URI de SVG base64 listo para usar en img tags
            return $qrCode->render($data);
        } catch (\Exception $e) {
            \Log::error('QR Code generation failed: ' . $e->getMessage());
            return null;
        }
    }
}
