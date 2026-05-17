<?php

namespace App\Services;

use Exception;

/**
 * Servicio para generar imágenes de códigos de barra
 *
 * Soporta:
 * - EAN-13
 * - UPC-A, UPC-E
 * - CODE128
 * - CODE39
 * - Otros formatos estándar
 */
class CodigosBarraImagenService
{
    /**
     * Formatos soportados
     */
    private const FORMATOS_SOPORTADOS = [
        'EAN' => 'ean13',
        'UPC' => 'upca',
        'CODE128' => 'code128',
        'CODE39' => 'code39',
        'INTERNAL' => 'code128',
        'QR' => 'qrcode',
    ];

    /**
     * Generar imagen de código de barras en PNG
     *
     * @param string $codigo Código a generar
     * @param string $tipo Tipo de código (EAN, UPC, CODE128, etc)
     * @param int $ancho Ancho en píxeles
     * @param int $alto Alto en píxeles
     * @return string Imagen en base64
     */
    public function generarPNG(string $codigo, string $tipo = 'EAN', int $ancho = 400, int $alto = 200): string
    {
        try {
            $formato = $this->obtenerFormato($tipo);

            // Usar librería barcode si está disponible
            if (class_exists('Milon\Barcode\Facades\DNBarcode')) {
                $imagen = \Milon\Barcode\Facades\DNBarcode::getBarcodePNG(
                    $codigo,
                    $formato,
                    $ancho,
                    $alto
                );

                return base64_encode($imagen);
            }

            // Fallback: generar usando alternativa
            return $this->generarImagenAlternativa($codigo, $tipo);
        } catch (Exception $e) {
            throw new Exception("Error al generar imagen de código: {$e->getMessage()}");
        }
    }

    /**
     * Generar imagen de código de barras en SVG
     *
     * @param string $codigo Código a generar
     * @param string $tipo Tipo de código
     * @param int $escala Escala/tamaño de barras
     * @return string SVG en formato string
     */
    public function generarSVG(string $codigo, string $tipo = 'EAN', int $escala = 2): string
    {
        try {
            if (class_exists('Milon\Barcode\Facades\DNBarcode')) {
                return \Milon\Barcode\Facades\DNBarcode::getBarcodeSVG(
                    $codigo,
                    $this->obtenerFormato($tipo),
                    $escala
                );
            }

            return $this->generarSVGAlternativa($codigo, $tipo, $escala);
        } catch (Exception $e) {
            throw new Exception("Error al generar SVG de código: {$e->getMessage()}");
        }
    }

    /**
     * Generar HTML con imagen embebida
     */
    public function generarHTML(string $codigo, string $tipo = 'EAN', string $etiqueta = ''): string
    {
        $imagenBase64 = $this->generarPNG($codigo, $tipo);
        $etiquetaText = htmlspecialchars($etiqueta);

        return <<<HTML
        <div class="codigo-barra" style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <img src="data:image/png;base64,{$imagenBase64}" alt="{$etiquetaText}" style="max-width: 100%; height: auto;">
            <p style="font-family: monospace; font-weight: bold; margin: 5px 0; font-size: 14px;">{$codigo}</p>
            {$etiquetaText && "<p style=\"font-size: 12px; color: #666; margin: 0;\">{$etiquetaText}</p>" ?: ''}
        </div>
        HTML;
    }

    /**
     * Generar URL para obtener la imagen dinámicamente
     */
    public function obtenerUrlImagen(string $codigo, string $tipo = 'EAN'): string
    {
        return route('api.codigo-barra.imagen', [
            'codigo' => urlencode($codigo),
            'tipo' => $tipo,
        ]);
    }

    /**
     * Obtener formato interno desde tipo de código
     */
    private function obtenerFormato(string $tipo): string
    {
        $tipo = strtoupper($tipo);
        return self::FORMATOS_SOPORTADOS[$tipo] ?? 'ean13';
    }

    /**
     * Generar imagen alternativa (fallback sin librería barcode)
     *
     * Esta es una implementación simplificada que dibuja un código de barras básico
     */
    private function generarImagenAlternativa(string $codigo, string $tipo): string
    {
        // Crear imagen en blanco
        $imagen = imagecreatetruecolor(400, 200);
        $blanco = imagecolorallocate($imagen, 255, 255, 255);
        $negro = imagecolorallocate($imagen, 0, 0, 0);

        // Llenar fondo blanco
        imagefill($imagen, 0, 0, $blanco);

        // Dibujar barras simples
        $barraAncho = 2;
        $x = 20;

        for ($i = 0; $i < strlen($codigo) && $i < 50; $i++) {
            $digito = intval($codigo[$i]);
            $altura = 100 + ($digito * 1.5);

            if ($digito % 2 === 0) {
                imagefilledrectangle($imagen, $x, 50, $x + $barraAncho, 50 + $altura, $negro);
            }

            $x += $barraAncho + 2;
        }

        // Dibujar número
        $negro_color = imagecolorallocate($imagen, 0, 0, 0);
        imagestring($imagen, 5, 80, 170, $codigo, $negro_color);

        // Obtener imagen como string
        ob_start();
        imagepng($imagen);
        $imagenData = ob_get_clean();
        imagedestroy($imagen);

        return base64_encode($imagenData);
    }

    /**
     * Generar SVG alternativa (fallback)
     */
    private function generarSVGAlternativa(string $codigo, string $tipo, int $escala): string
    {
        $ancho = strlen($codigo) * 10 * $escala + 40;
        $alto = 150 * $escala;

        $svg = <<<SVG
        <svg width="{$ancho}" height="{$alto}" xmlns="http://www.w3.org/2000/svg">
            <rect width="{$ancho}" height="{$alto}" fill="white"/>
            <text x="50%" y="70%" font-size="24" font-family="monospace" text-anchor="middle" font-weight="bold">{$codigo}</text>
        </svg>
        SVG;

        return $svg;
    }
}
