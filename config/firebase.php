<?php

return [
    /**
     * ID del proyecto Firebase
     * Obtener de: Firebase Console → Configuración del proyecto → ID del proyecto
     */
    'project_id' => env('FIREBASE_PROJECT_ID', 'distribuidora-paucara'),

    /**
     * Ruta a las credenciales de Firebase (Service Account JSON)
     * Descargar de: Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada
     * Guardar en: storage/firebase/service-account.json
     */
    'credentials_path' => env('FIREBASE_CREDENTIALS_PATH', 'firebase/service-account.json'),

    /**
     * Configuración de FCM (Cloud Messaging)
     */
    'fcm' => [
        'enabled' => env('FIREBASE_FCM_ENABLED', true),
        'timeout' => env('FIREBASE_FCM_TIMEOUT', 10), // segundos
        'retry' => env('FIREBASE_FCM_RETRY', 3), // intentos
    ],
];
