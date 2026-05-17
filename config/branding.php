<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Branding Configuration
    |--------------------------------------------------------------------------
    |
    | Configuración de marca/branding por cliente. Estos valores se exponen
    | al frontend via Vite environment variables y son inyectados en componentes.
    |
    */

    'logo' => [
        'svg' => env('LOGO_SVG', '/logo.svg'),
        'png' => env('LOGO_PNG', '/logo.png'),
        'alt' => env('LOGO_ALT', 'Distribuidora Paucara'),
    ],

    'favicon' => [
        'ico' => env('FAVICON_ICO', '/favicon.ico'),
        'svg' => env('FAVICON_SVG', '/favicon.svg'),
        'apple_touch_icon' => env('APPLE_TOUCH_ICON', '/apple-touch-icon.png'),
    ],

];
