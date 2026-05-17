<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model: AuditoriaCaja
 *
 * Responsabilidades:
 * ✅ Registrar todos los intentos de operación con caja
 * ✅ Rastrear intentos exitosos y fallidos
 * ✅ Almacenar información del cliente (IP, User-Agent, etc)
 * ✅ Proporcionar datos para análisis y auditoría
 *
 * Acciones auditadas:
 * - INTENTO_SIN_CAJA: Usuario intentó operación sin caja abierta
 * - OPERACION_EXITOSA: Operación con caja completada exitosamente
 * - CAJA_ABIERTA: Usuario abrió una caja
 * - CAJA_CERRADA: Usuario cerró una caja
 * - ERROR_SISTEMA: Error inesperado durante operación
 */
class AuditoriaCaja extends Model
{
    protected $table = 'cajas_auditoria';

    protected $fillable = [
        'user_id',
        'caja_id',
        'apertura_caja_id',
        'accion',
        'operacion_intentada',
        'operacion_tipo',
        'detalle_operacion',
        'codigo_http',
        'mensaje_error',
        'exitosa',
        'ip_address',
        'user_agent',
        'request_headers',
        'response_metadata',
        'navegador',
        'sistema_operativo',
        'es_mobile',
        'fecha_intento',
        'modo',
    ];

    protected $casts = [
        'detalle_operacion' => 'array',
        'request_headers' => 'array',
        'response_metadata' => 'array',
        'exitosa' => 'boolean',
        'es_mobile' => 'boolean',
        'fecha_intento' => 'datetime',
    ];

    // ========== RELACIONES ==========

    /**
     * Relación con User
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con Caja
     */
    public function caja(): BelongsTo
    {
        return $this->belongsTo(Caja::class);
    }

    /**
     * Relación con AperturaCaja
     */
    public function aperturaCaja(): BelongsTo
    {
        return $this->belongsTo(AperturaCaja::class, 'apertura_caja_id');
    }

    // ========== SCOPES ==========

    /**
     * Filtrar por acción
     */
    public function scopePorAccion($query, string $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * Filtrar intentos fallidos (sin caja)
     */
    public function scopeIntentosSinCaja($query)
    {
        return $query->where('accion', 'INTENTO_SIN_CAJA');
    }

    /**
     * Filtrar por usuario
     */
    public function scopePorUsuario($query, int $usuarioId)
    {
        return $query->where('user_id', $usuarioId);
    }

    /**
     * Filtrar por fecha
     */
    public function scopePorFecha($query, string $fecha)
    {
        return $query->whereDate('fecha_intento', $fecha);
    }

    /**
     * Filtrar por rango de fechas
     */
    public function scopeEntreFechas($query, string $desde, string $hasta)
    {
        return $query->whereBetween('fecha_intento', [$desde, $hasta]);
    }

    /**
     * Solo intentos exitosos
     */
    public function scopeExitosos($query)
    {
        return $query->where('exitosa', true);
    }

    /**
     * Solo intentos fallidos
     */
    public function scopeFallidos($query)
    {
        return $query->where('exitosa', false);
    }

    /**
     * Ordenar por fecha descendente
     */
    public function scopeRecientes($query)
    {
        return $query->orderBy('fecha_intento', 'desc');
    }

    // ========== MÉTODOS ESTÁTICOS ==========

    /**
     * Registrar intento sin caja
     *
     * @param User $user
     * @param string $operacion e.g., "POST /api/ventas"
     * @param string $ip
     * @param string $userAgent
     * @param array $detalles
     */
    public static function registrarIntentoSinCaja(
        User $user,
        string $operacion,
        string $ip,
        string $userAgent,
        array $detalles = []
    ): self {
        return self::create([
            'user_id' => $user->id,
            'accion' => 'INTENTO_SIN_CAJA',
            'operacion_intentada' => $operacion,
            'operacion_tipo' => $detalles['tipo'] ?? null,
            'detalle_operacion' => $detalles,
            'codigo_http' => 403,
            'mensaje_error' => 'Usuario intentó operación sin caja abierta',
            'exitosa' => false,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'modo' => 'hard-block',
        ]);
    }

    /**
     * Registrar acceso sin caja con advertencia suave
     * Se usa para rutas web de ventas que permiten acceso sin caja abierta
     *
     * @param User $user
     * @param string $operacion e.g., "GET /ventas"
     * @param string $ip
     * @param string $userAgent
     * @param string $modo 'soft-warning' o 'hard-block'
     */
    public static function registrarAccesoSinCaja(
        User $user,
        string $operacion,
        string $ip,
        string $userAgent,
        string $modo = 'soft-warning'
    ): self {
        return self::create([
            'user_id' => $user->id,
            'accion' => 'ACCESO_SIN_CAJA',
            'operacion_intentada' => $operacion,
            'operacion_tipo' => self::extraerTipoOperacion($operacion),
            'detalle_operacion' => [
                'modo' => $modo,
                'ruta' => $operacion,
            ],
            'codigo_http' => 200,
            'mensaje_error' => null,
            'exitosa' => true,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'modo' => $modo,
        ]);
    }

    /**
     * Extraer tipo de operación desde la ruta
     */
    private static function extraerTipoOperacion(string $operacion): ?string
    {
        if (str_contains($operacion, 'venta')) {
            return 'VENTA';
        } elseif (str_contains($operacion, 'compra')) {
            return 'COMPRA';
        } elseif (str_contains($operacion, 'pago')) {
            return 'PAGO';
        }

        return null;
    }

    /**
     * Registrar apertura de caja
     */
    public static function registrarAperturaCaja(
        User $user,
        Caja $caja,
        AperturaCaja $apertura,
        string $ip,
        string $userAgent
    ): self {
        return self::create([
            'user_id' => $user->id,
            'caja_id' => $caja->id,
            'apertura_caja_id' => $apertura->id,
            'accion' => 'CAJA_ABIERTA',
            'operacion_intentada' => 'POST /cajas/abrir',
            'operacion_tipo' => 'APERTURA',
            'codigo_http' => 200,
            'exitosa' => true,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'detalle_operacion' => [
                'caja_numero' => $caja->numero,
                'monto_inicial' => $apertura->monto_inicial,
            ],
        ]);
    }

    /**
     * Registrar cierre de caja
     */
    public static function registrarCierreCaja(
        User $user,
        Caja $caja,
        AperturaCaja $apertura,
        string $ip,
        string $userAgent,
        array $datos = []
    ): self {
        return self::create([
            'user_id' => $user->id,
            'caja_id' => $caja->id,
            'apertura_caja_id' => $apertura->id,
            'accion' => 'CAJA_CERRADA',
            'operacion_intentada' => 'POST /cajas/cerrar',
            'operacion_tipo' => 'CIERRE',
            'codigo_http' => 200,
            'exitosa' => true,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'detalle_operacion' => $datos,
        ]);
    }

    /**
     * Registrar operación exitosa con caja
     */
    public static function registrarOperacionExitosa(
        User $user,
        Caja $caja,
        string $operacion,
        string $tipo,
        string $ip,
        string $userAgent,
        array $detalles = []
    ): self {
        return self::create([
            'user_id' => $user->id,
            'caja_id' => $caja->id,
            'accion' => 'OPERACION_EXITOSA',
            'operacion_intentada' => $operacion,
            'operacion_tipo' => $tipo,
            'codigo_http' => 200,
            'exitosa' => true,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'detalle_operacion' => $detalles,
        ]);
    }

    /**
     * Registrar error de sistema
     */
    public static function registrarError(
        User $user,
        string $operacion,
        string $mensaje,
        string $ip,
        string $userAgent,
        int $codigoHttp = 500
    ): self {
        return self::create([
            'user_id' => $user->id,
            'accion' => 'ERROR_SISTEMA',
            'operacion_intentada' => $operacion,
            'codigo_http' => $codigoHttp,
            'mensaje_error' => $mensaje,
            'exitosa' => false,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }

    // ========== MÉTODOS DE UTILIDAD ==========

    /**
     * Obtener descripción legible de la acción
     */
    public function obtenerDescripcionAccion(): string
    {
        return match ($this->accion) {
            'INTENTO_SIN_CAJA' => 'Intento sin caja abierta',
            'OPERACION_EXITOSA' => 'Operación exitosa',
            'CAJA_ABIERTA' => 'Caja abierta',
            'CAJA_CERRADA' => 'Caja cerrada',
            'ERROR_SISTEMA' => 'Error del sistema',
            default => $this->accion,
        };
    }

    /**
     * Obtener ícono para la acción
     */
    public function obtenerIconoAccion(): string
    {
        return match ($this->accion) {
            'INTENTO_SIN_CAJA' => '❌',
            'OPERACION_EXITOSA' => '✅',
            'CAJA_ABIERTA' => '🔓',
            'CAJA_CERRADA' => '🔒',
            'ERROR_SISTEMA' => '⚠️',
            default => '❓',
        };
    }

    /**
     * Chequear si es sospechoso (múltiples intentos fallidos)
     */
    public static function esOperacionSospechosa(User $user, int $minutosAtras = 5): bool
    {
        $intentosFallidos = self::porUsuario($user->id)
            ->fallidos()
            ->where('fecha_intento', '>=', now()->subMinutes($minutosAtras))
            ->count();

        return $intentosFallidos >= 3; // 3+ intentos fallidos en 5 minutos
    }
}
