<?php

/**
 * Configuración del servicio de conversión PDF a Imagen
 *
 * Soporta dos métodos:
 * 1. Servicio Python remoto (Railway, Heroku, etc)
 * 2. ImageMagick local (fallback)
 */

return [
    'pdf_image' => [
        // Habilitar/deshabilitar servicio Python
        'enabled' => env('PDF_IMAGE_SERVICE_ENABLED', false),

        // URL del servicio Python
        // Ejemplos:
        // - Local: http://localhost:8000
        // - Railway: https://tu-servicio.railway.app
        // - Docker: http://pdf-service:8000
        'url' => env('PDF_IMAGE_SERVICE_URL', null),

        // Parámetros por defecto para todas las conversiones
        'defaults' => [
            'dpi' => 150,              // Resolución (72-300)
            'quality' => 85,           // Compresión (50-100)
            'format' => 'jpeg',        // Formato (jpeg|png|webp)
            'optimize' => true,        // Optimizar imagen
        ],

        // Timeout para conexión al servicio (segundos)
        'timeout' => 60,
    ],
];
