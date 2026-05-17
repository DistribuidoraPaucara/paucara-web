<?php

/**
 * Configuración para impresoras térmicas ESC/POS
 *
 * Esta configuración define los parámetros para conectar y usar
 * impresoras térmicas en red compartida.
 */

return [
    /**
     * Host/IP de la impresora térmica
     * Ejemplo: '192.168.1.100' (impresora compartida en red)
     * Ejemplo: '192.168.100.50' (otra máquina en la red)
     */
    'host' => env('PRINTER_HOST', '192.168.1.100'),

    /**
     * Puerto de la impresora
     * Default: 9100 (Puerto estándar para impresoras ESC/POS)
     * Algunas impresoras usan: 515, 631, 8000, etc.
     */
    'port' => env('PRINTER_PORT', 9100),

    /**
     * Ancho del papel de la impresora térmica
     * Valores: 58 (56-58mm) o 80 (80mm)
     * Afecta el formato del ticket generado
     */
    'paper_width' => env('PRINTER_PAPER_WIDTH', 58),

    /**
     * Habilitar/Deshabilitar impresión térmica
     * true: Imprimir automáticamente cuando se crea una venta
     * false: Solo preparar datos, no imprimir
     * Útil para desarrollo/testing
     */
    'enabled' => env('PRINTER_ENABLED', false),

    /**
     * Configuración avanzada
     */
    'advanced' => [
        /**
         * Timeout de conexión en segundos
         */
        'timeout' => env('PRINTER_TIMEOUT', 5),

        /**
         * Reintentos de conexión
         */
        'retries' => env('PRINTER_RETRIES', 3),

        /**
         * Habilitar logs detallados
         */
        'debug' => env('PRINTER_DEBUG', false),

        /**
         * Corte de papel después de imprimir
         * true: Corta papel automáticamente
         * false: Solo prepara para corte manual
         */
        'auto_cut' => env('PRINTER_AUTO_CUT', true),

        /**
         * Tipo de corte
         * 'full' - Corte completo
         * 'partial' - Corte parcial
         */
        'cut_type' => env('PRINTER_CUT_TYPE', 'full'),
    ],
];
