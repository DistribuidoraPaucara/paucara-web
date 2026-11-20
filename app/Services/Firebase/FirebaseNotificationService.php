<?php

namespace App\Services\Firebase;

use App\Models\DispositivoTokenFcm;
use App\Models\NotificacionEnvio;
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

            // token → user_id, para el historial de envíos
            $usuarioPorToken = DispositivoTokenFcm::whereIn('token_fcm', $tokens)->pluck('user_id', 'token_fcm');
            $tipo = 'recurrente.' . ($notificacion->tipo ?: 'informativo');
            $referencia = ['notificacion_recurrente_id' => $notificacion->id];

            foreach ($tokens as $token) {
                try {
                    $payload = $this->construirPayload($notificacion, $token, $metadata);

                    $response = Http::withToken($accessToken)
                        ->post($url, $payload);

                    if ($response->successful()) {
                        $enviados++;
                        $this->registrarEnvio($tipo, $usuarioPorToken[$token] ?? null, $token, $notificacion->titulo, $referencia);
                    } else {
                        $fallidos++;
                        $this->registrarEnvio($tipo, $usuarioPorToken[$token] ?? null, $token, $notificacion->titulo, $referencia, $response);
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
        $imageUrl = $notificacion->imagen_url ?: '/storage/notificacion/ic_notification.png';
        // Las imágenes subidas se guardan como ruta relativa; FCM necesita la URL absoluta
        if (str_starts_with($imageUrl, '/')) {
            $imageUrl = rtrim(config('app.url'), '/') . $imageUrl;
        }

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
            // ✅ NUEVO: Intentar desde variable de entorno primero (production en Railway)
            $credentialsJson = config('firebase.credentials_json') ?? env('FIREBASE_SERVICE_ACCOUNT_JSON');

            if ($credentialsJson) {
                // Si está en base64, decodificar
                $decoded = base64_decode($credentialsJson, true);
                if ($decoded !== false) {
                    $credentials = json_decode($decoded, true);
                } else {
                    // Si no es base64, asumir que es JSON directo
                    $credentials = json_decode($credentialsJson, true);
                }
            } else {
                // Fallback: leer desde archivo (development)
                $credentialsPath = storage_path('firebase/' . basename($this->credentialsPath));

                if (!file_exists($credentialsPath)) {
                    throw new \Exception("Archivo de credenciales no encontrado: {$credentialsPath}");
                }

                $credentials = json_decode(file_get_contents($credentialsPath), true);
            }

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
     * Enviar un push FCM a los dispositivos activos de usuarios específicos.
     *
     * Llega aunque la app esté minimizada o cerrada (Android muestra el
     * bloque `notification` por su cuenta). Los tokens que FCM reporta como
     * inválidos se desactivan.
     *
     * @param  int[]  $userIds
     * @param  array<string, scalar>  $data  Datos extra (se convierten a string, FCM lo exige)
     * @return array{enviados:int, fallidos:int}
     */
    public function enviarAUsuarios(
        array $userIds,
        string $titulo,
        string $cuerpo,
        array $data = [],
        string $canalAndroid = 'proformas'
    ): array {
        $resultado = ['enviados' => 0, 'fallidos' => 0];

        if (empty($userIds) || ! config('firebase.fcm.enabled', true)) {
            return $resultado;
        }

        // token_fcm => user_id (un token repetido se envía una sola vez)
        $usuarioPorToken = DispositivoTokenFcm::where('activo', true)
            ->whereIn('user_id', $userIds)
            ->pluck('user_id', 'token_fcm');
        $tokens = $usuarioPorToken->keys();
        $tipoEnvio = (string) ($data['tipo'] ?? 'push');
        $referencia = array_filter([
            'proforma_id' => $data['proforma_id'] ?? null,
            'numero'      => $data['numero'] ?? null,
        ]);

        if ($tokens->isEmpty()) {
            Log::info('ℹ️ FCM: ningún dispositivo registrado para los usuarios destino', [
                'user_ids' => $userIds,
            ]);
            return $resultado;
        }

        try {
            $accessToken = $this->obtenerAccessToken();
        } catch (\Throwable $e) {
            Log::error('❌ FCM: no se pudo obtener access token', ['error' => $e->getMessage()]);
            $resultado['fallidos'] = $tokens->count();
            return $resultado;
        }

        $url = "https://fcm.googleapis.com/v1/projects/{$this->projectId}/messages:send";
        $dataString = array_map(fn ($v) => is_bool($v) ? ($v ? 'true' : 'false') : (string) $v, $data);
        $dataString['timestamp'] = now()->toIso8601String();

        foreach ($tokens as $token) {
            $payload = [
                'message' => [
                    'token'        => $token,
                    'notification' => [
                        'title' => $titulo,
                        'body'  => mb_substr($cuerpo, 0, 240),
                    ],
                    'data'    => $dataString,
                    'android' => [
                        'priority'     => 'high',
                        'ttl'          => '3600s',
                        'notification' => [
                            'channel_id'   => $canalAndroid,
                            'sound'        => 'default',
                            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                        ],
                    ],
                    'apns' => [
                        'payload' => ['aps' => ['sound' => 'default']],
                    ],
                ],
            ];

            try {
                $response = Http::withToken($accessToken)
                    ->timeout((int) config('firebase.fcm.timeout', 10))
                    ->post($url, $payload);

                if ($response->successful()) {
                    $resultado['enviados']++;
                    $this->registrarEnvio($tipoEnvio, $usuarioPorToken[$token] ?? null, $token, $titulo, $referencia);
                    continue;
                }

                $resultado['fallidos']++;
                $this->registrarEnvio($tipoEnvio, $usuarioPorToken[$token] ?? null, $token, $titulo, $referencia, $response);
                $errorCode = $response->json('error.details.0.errorCode') ?? $response->json('error.status');

                // Token caducado o de una app desinstalada: desactivarlo
                if (in_array($errorCode, ['UNREGISTERED', 'INVALID_ARGUMENT', 'NOT_FOUND'], true)) {
                    DispositivoTokenFcm::where('token_fcm', $token)->update(['activo' => false]);
                }

                Log::warning('⚠️ FCM: fallo al enviar a usuario', [
                    'token'  => substr($token, 0, 30) . '...',
                    'status' => $response->status(),
                    'error'  => $errorCode,
                ]);
            } catch (\Throwable $e) {
                $resultado['fallidos']++;
                $this->registrarEnvio($tipoEnvio, $usuarioPorToken[$token] ?? null, $token, $titulo, $referencia, null, $e->getMessage());
                Log::warning('⚠️ FCM: excepción enviando push', ['error' => $e->getMessage()]);
            }
        }

        Log::info('📲 FCM enviado a usuarios', $resultado + ['user_ids' => count($userIds)]);

        return $resultado;
    }

    /**
     * Guarda el resultado de un envío push en notificaciones_envios.
     * Nunca lanza: el historial no debe romper el envío.
     */
    protected function registrarEnvio(
        string $tipo,
        ?int $userId,
        string $token,
        ?string $titulo,
        array $referencia = [],
        ?\Illuminate\Http\Client\Response $response = null,
        ?string $excepcion = null
    ): void {
        try {
            $fallido = $excepcion !== null || ($response !== null && ! $response->successful());

            $errorCodigo = null;
            $errorDetalle = null;
            if ($excepcion !== null) {
                $errorCodigo = 'EXCEPCION';
                $errorDetalle = mb_substr($excepcion, 0, 500);
            } elseif ($fallido) {
                $errorCodigo = $response->json('error.details.0.errorCode')
                    ?? $response->json('error.status')
                    ?? (string) $response->status();
                $errorDetalle = mb_substr((string) ($response->json('error.message') ?? $response->body()), 0, 500);
            }

            NotificacionEnvio::create([
                'canal'         => 'fcm',
                'tipo'          => $tipo,
                'user_id'       => $userId,
                'token_sufijo'  => substr($token, -12),
                'estado'        => $fallido ? 'fallido' : 'enviado',
                'error_codigo'  => $errorCodigo,
                'error_detalle' => $errorDetalle,
                'titulo'        => $titulo ? mb_substr($titulo, 0, 250) : null,
                'referencia'    => $referencia ?: null,
            ]);
        } catch (\Throwable $e) {
            Log::warning('⚠️ No se pudo registrar el envío push', ['error' => $e->getMessage()]);
        }
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
