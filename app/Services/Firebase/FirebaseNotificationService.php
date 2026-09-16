<?php

namespace App\Services\Firebase;

use App\Models\DispositivoTokenFcm;
use App\Models\NotificacionRecurrente;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FirebaseNotificationService
{
    protected string $projectId;
    protected string $credentialsPath;

    public function __construct()
    {
        $this->projectId = config('firebase.project_id');
        $this->credentialsPath = config('firebase.credentials_path');
    }

    /**
     * Enviar notificación a dispositivos específicos
     */
    public function enviarADispositivos(
        NotificacionRecurrente $notificacion,
        array $tokens = [],
        ?array $metadata = null
    ): array {
        try {
            // Si no se especifican tokens, obtener todos los activos
            if (empty($tokens)) {
                $tokens = DispositivoTokenFcm::tokensActivos();
            }

            if (empty($tokens)) {
                Log::warning('⚠️ No hay dispositivos registrados para recibir notificación', [
                    'notificacion_id' => $notificacion->id,
                ]);
                return ['enviados' => 0, 'fallidos' => 0, 'errores' => []];
            }

            // Obtener token de acceso Firebase
            $accessToken = $this->obtenerAccessToken();

            $url = "https://fcm.googleapis.com/v1/projects/{$this->projectId}/messages:send";

            $enviados = 0;
            $fallidos = 0;
            $errores = [];

            foreach ($tokens as $token) {
                try {
                    $payload = $this->construirPayload($notificacion, $token, $metadata);

                    $response = Http::withToken($accessToken)
                        ->post($url, $payload);

                    if ($response->successful()) {
                        $enviados++;
                    } else {
                        $fallidos++;
                        $errores[] = [
                            'token' => $token,
                            'error' => $response->body(),
                            'status' => $response->status(),
                        ];

                        Log::warning('⚠️ Fallo al enviar notificación FCM', [
                            'notificacion_id' => $notificacion->id,
                            'token' => substr($token, 0, 50) . '...',
                            'error' => $response->body(),
                        ]);
                    }
                } catch (\Exception $e) {
                    $fallidos++;
                    $errores[] = [
                        'token' => $token,
                        'error' => $e->getMessage(),
                    ];

                    Log::error('❌ Excepción al enviar FCM', [
                        'notificacion_id' => $notificacion->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('✅ Envío de notificaciones completado', [
                'notificacion_id' => $notificacion->id,
                'enviados' => $enviados,
                'fallidos' => $fallidos,
                'total_tokens' => count($tokens),
            ]);

            return [
                'enviados' => $enviados,
                'fallidos' => $fallidos,
                'errores' => $errores,
            ];
        } catch (\Exception $e) {
            Log::error('❌ Error en FirebaseNotificationService::enviarADispositivos', [
                'notificacion_id' => $notificacion->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Construir payload para FCM
     */
    protected function construirPayload(
        NotificacionRecurrente $notificacion,
        string $token,
        ?array $metadata = null
    ): array {
        // ✅ NUEVO: Usar imagen de la notificación o imagen por defecto
        $imageUrl = $notificacion->imagen_url
            ?? (config('app.url') . '/storage/notificacion/ic_notification.png');

        return [
            'message' => [
                'token' => $token,
                'notification' => [
                    'title' => $notificacion->titulo,
                    'body' => substr($notificacion->descripcion, 0, 240),
                    'image' => $imageUrl, // ✅ Imagen en la notificación (para iOS)
                ],
                'data' => [
                    'notificacion_id' => (string)$notificacion->id,
                    'tipo' => $notificacion->tipo,
                    'frecuencia' => $notificacion->frecuencia,
                    'timestamp' => now()->toIso8601String(),
                    'image_url' => $imageUrl, // ✅ NUEVO: Enviar imagen en data también (para Android)
                    ...$metadata ?? [],
                ],
                'android' => [
                    'ttl' => '3600s',
                    'priority' => 'high',
                    'notification' => [
                        'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                        'sound' => 'default',
                        'color' => '#FF5733',
                        'image' => $imageUrl, // ✅ NUEVO: Imagen en Android
                    ],
                ],
                'apns' => [
                    // ✅ NUEVO: Configuración para iOS
                    'payload' => [
                        'aps' => [
                            'sound' => 'default',
                            'mutable-content' => 1,
                        ],
                    ],
                    'fcm_options' => [
                        'image' => $imageUrl, // Imagen para iOS
                    ],
                ],
            ],
        ];
    }

    /**
     * Obtener token de acceso OAuth2 para Firebase
     * Usa la Service Account
     */
    protected function obtenerAccessToken(): string
    {
        try {
            $credentialsPath = storage_path('firebase/' . basename($this->credentialsPath));

            if (!file_exists($credentialsPath)) {
                throw new \Exception("Archivo de credenciales no encontrado: {$credentialsPath}");
            }

            $credentials = json_decode(file_get_contents($credentialsPath), true);

            $now = time();
            $expiration = $now + 3600; // 1 hora

            $payload = [
                'iss' => $credentials['client_email'],
                'scope' => 'https://www.googleapis.com/auth/cloud-platform',
                'aud' => 'https://oauth2.googleapis.com/token',
                'exp' => $expiration,
                'iat' => $now,
            ];

            $jwt = $this->crearJWT($payload, $credentials['private_key']);

            $response = Http::asForm()
                ->post('https://oauth2.googleapis.com/token', [
                    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'assertion' => $jwt,
                ]);

            if (!$response->successful()) {
                throw new \Exception("Error al obtener token OAuth: " . $response->body());
            }

            return $response->json('access_token');
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo token OAuth', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Crear JWT para autenticación OAuth2
     */
    protected function crearJWT(array $payload, string $privateKey): string
    {
        $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
        $payload = json_encode($payload);

        $base64Header = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
        $base64Payload = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');

        $signatureInput = "{$base64Header}.{$base64Payload}";

        $signature = '';
        openssl_sign($signatureInput, $signature, $privateKey, 'sha256WithRSAEncryption');

        $base64Signature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

        return "{$signatureInput}.{$base64Signature}";
    }

    /**
     * Enviar notificación de prueba a un dispositivo específico
     */
    public function enviarPrueba(string $token, string $titulo = "Prueba", string $descripcion = "Notificación de prueba"): bool
    {
        try {
            $accessToken = $this->obtenerAccessToken();

            $payload = [
                'message' => [
                    'token' => $token,
                    'notification' => [
                        'title' => $titulo,
                        'body' => $descripcion,
                    ],
                    'data' => [
                        'tipo' => 'prueba',
                        'timestamp' => now()->toIso8601String(),
                    ],
                ],
            ];

            $response = Http::withToken($accessToken)
                ->post("https://fcm.googleapis.com/v1/projects/{$this->projectId}/messages:send", $payload);

            if ($response->successful()) {
                Log::info('✅ Notificación de prueba enviada', ['token' => substr($token, 0, 50) . '...']);
                return true;
            }

            Log::error('❌ Error en notificación de prueba', ['response' => $response->body()]);
            return false;
        } catch (\Exception $e) {
            Log::error('❌ Error enviando notificación de prueba', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
