<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | SIN (Servicio de Impuestos Nacionales) - Bolivia
    |--------------------------------------------------------------------------
    |
    | Configuración para la integración con el Sistema de Facturación
    | Electrónica del SIN de Bolivia.
    |
    */
    'sin' => [
        'api_url' => env('SIN_API_URL', 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos'),
        'nit_emisor' => env('SIN_NIT_EMISOR'),
        'codigo_punto_venta' => env('SIN_CODIGO_PUNTO_VENTA', 0),
        'codigo_sucursal' => env('SIN_CODIGO_SUCURSAL', 0),
        'token' => env('SIN_TOKEN'),
        'ambiente' => env('SIN_AMBIENTE', 'piloto'), // piloto o produccion
        'modalidad' => env('SIN_MODALIDAD', 1),       // 1=Electronico, 2=Computarizada
    ],

    /*
    |--------------------------------------------------------------------------
    | Google Maps API
    |--------------------------------------------------------------------------
    |
    | Configuración para Google Maps API utilizada para geocodificación,
    | visualización de mapas, cálculo de rutas y logística.
    |
    */
    'google_maps' => [
        'api_key' => env('GOOGLE_MAPS_API_KEY'),
    ],

];
