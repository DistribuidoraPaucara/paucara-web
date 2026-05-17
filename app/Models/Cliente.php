<?php
namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory, GeneratesSequentialCode, HasActiveScope;

    public $timestamps = false;

    protected $table = 'clientes';

    protected $fillable = [
        'nombre',
        'razon_social',
        'nit',
        'telefono',
        'email',
        'activo',
        'fecha_registro',
        'limite_credito',
        'puede_tener_credito',      // ← NUEVO
        'foto_perfil',
        'ci_anverso',
        'ci_reverso',
        'localidad_id',
        'codigo_cliente',
        'user_id',
        'usuario_creacion_id',
        'preventista_id',           // ← NUEVO
        'usuario_actualizacion_id', // ← NUEVO
        'fecha_creacion',           // ← NUEVO
        'fecha_actualizacion',      // ← NUEVO
    ];

    protected $appends = ['credito_utilizado', 'categorias_ids'];

    protected function casts(): array
    {
        return [
            'activo'                => 'boolean',
            'puede_tener_credito'   => 'boolean',
            'fecha_registro'        => 'datetime',
            'limite_credito'        => 'decimal:2',
        ];
    }

    public function localidad()
    {
        return $this->belongsTo(Localidad::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function direcciones()
    {
        return $this->hasMany(DireccionCliente::class, 'cliente_id');
    }

    public function ventanasEntrega()
    {
        return $this->hasMany(VentanaEntregaCliente::class, 'cliente_id');
    }

    public function fotosLugar()
    {
        return $this->hasMany(FotoLugarCliente::class, 'cliente_id');
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class);
    }

    public function proformas()
    {
        return $this->hasMany(Proforma::class);
    }

    public function categorias()
    {
        return $this->belongsToMany(CategoriaCliente::class, 'categoria_cliente', 'cliente_id', 'categoria_cliente_id')->withTimestamps();
    }

    public function cuentasPorCobrar()
    {
        return $this->hasMany(CuentaPorCobrar::class);
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion_id');
    }

    /**
     * ✅ NUEVO: Preventista que gestiona este cliente
     */
    public function preventista()
    {
        return $this->belongsTo(Empleado::class, 'preventista_id');
    }

    /**
     * ✅ NUEVO: Usuario que actualizó el cliente
     */
    public function usuarioActualizacion()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion_id');
    }

    /**
     * ✅ NUEVO: Auditoría de cambios
     */
    public function auditLogs()
    {
        return $this->hasMany(ClienteAudit::class);
    }

    /**
     * ✅ NUEVO: Método para registrar cambios manualmente
     */
    public function registrarCambio(string $accion, array $cambios, ?string $motivo = null)
    {
        ClienteAudit::create([
            'cliente_id' => $this->id,
            'preventista_id' => auth()->user()?->empleado?->id,
            'usuario_id' => auth()->user()?->id,
            'accion' => $accion,
            'cambios' => $cambios,
            'motivo' => $motivo,
            'ip_address' => request()?->ip() ?? '127.0.0.1',
        ]);
    }

    /**
     * ✅ SCOPE: Filtrar clientes por usuario actual
     * - Preventista: Solo VE sus clientes (preventista_id = empleado_id)
     * - Cliente: Solo VE su propio cliente (user_id = auth()->id())
     * - Super Admin: VE TODOS los clientes (sin filtro)
     */
    public function scopeForCurrentUser($query)
    {
        $user = auth()->user();

        // Super Admin ve TODOS
        if ($user?->hasRole('Super Admin')) {
            return $query;
        }

        // Preventista ve SOLO sus clientes
        if ($user?->hasRole('Preventista')) {
            return $query->where('preventista_id', $user->empleado?->id);
        }

        // Cliente ve SOLO su cliente
        if ($user?->hasRole('Cliente')) {
            return $query->where('user_id', $user->id);
        }

        // Admin y otros: Sin filtro específico (controlado por Policy)
        return $query;
    }

    protected static function boot()
    {
        parent::boot();

        // Generar el código de cliente DESPUÉS de crear, para poder usar el ID del cliente
        static::created(function ($cliente) {
            if (! $cliente->codigo_cliente && $cliente->localidad_id) {
                $cliente->codigo_cliente = $cliente->generateCodigoCliente();
                // Guardar en silencio para evitar eventos recursivos
                $cliente->saveQuietly();
            }
        });

        // Regenerar código si la localidad cambia (pero respetar si el usuario envía manualmente un código)
        static::updating(function ($cliente) {
            \Log::info("📝 Evento updating disparado para cliente {$cliente->id}", [
                'isDirty' => $cliente->isDirty(),
                'dirty_attributes' => $cliente->getDirty(),
                'localidad_id_actual' => $cliente->localidad_id,
                'localidad_id_original' => $cliente->getOriginal('localidad_id'),
                'codigo_cliente_actual' => $cliente->codigo_cliente,
                'codigo_cliente_original' => $cliente->getOriginal('codigo_cliente'),
            ]);

            // ✅ IMPORTANTE: Respetar si el usuario envía manualmente un código en el UPDATE
            $codigoFueModificado = $cliente->isDirty('codigo_cliente');

            if ($cliente->isDirty('localidad_id')) {
                $localidadAnterior = $cliente->getOriginal('localidad_id');
                $localidadNueva = $cliente->localidad_id;

                \Log::info("🔄 Localidad cambió en cliente {$cliente->id}", [
                    'anterior' => $localidadAnterior,
                    'nueva' => $localidadNueva,
                    'codigo_anterior' => $cliente->getOriginal('codigo_cliente'),
                    'codigo_actual' => $cliente->codigo_cliente,
                    'codigo_fue_modificado' => $codigoFueModificado,
                ]);

                // Solo regenerar código si:
                // 1. La localidad cambió
                // 2. El usuario NO envió manualmente un código
                if ($localidadNueva && !$codigoFueModificado) {
                    $codigoAnterior = $cliente->codigo_cliente;
                    $cliente->codigo_cliente = $cliente->generateCodigoCliente();

                    \Log::info("✅ Código de cliente regenerado automáticamente (localidad cambió)", [
                        'cliente_id' => $cliente->id,
                        'codigo_anterior' => $codigoAnterior ?? 'NULL',
                        'codigo_nuevo' => $cliente->codigo_cliente,
                    ]);
                } elseif ($codigoFueModificado) {
                    \Log::info("✅ Código de cliente respetado (usuario envió manualmente)", [
                        'cliente_id' => $cliente->id,
                        'codigo_usuario' => $cliente->codigo_cliente,
                    ]);
                }
            }
        });
    }

    public function generateCodigoCliente(): string
    {
        if (! $this->localidad_id) {
            return '';
        }

        $localidad = $this->localidad;
        if (! $localidad) {
            return '';
        }

        $codigoLocalidad = $localidad->codigo;

        // Regla: CODLOCALIDAD + 000 + IDCLIENTE (con padding a 4 dígitos hasta 999)
        $numero = (int) $this->id;
        if ($numero < 1000) {
            // 1 => 0001, 12 => 0012, 999 => 0999
            return $codigoLocalidad . str_pad((string) $numero, 4, '0', STR_PAD_LEFT);
        }

        // A partir de 1000, se usa el número tal cual (PS1000, PS1001, ...)
        return $codigoLocalidad . $numero;
    }

    /**
     * ✅ CRÉDITO: Calcular saldo disponible = limite_credito - sum(saldo_pendiente de cuentas pendientes)
     *
     * @return float Saldo disponible para comprar a crédito
     */
    public function calcularSaldoDisponible(): float
    {
        // Si el cliente no está habilitado para crédito, retorna 0
        if (!$this->puede_tener_credito) {
            return 0.0;
        }

        // ✅ MEJORADO: Si el límite es null o 0, significa SIN LÍMITE
        if ($this->limite_credito === null || $this->limite_credito <= 0) {
            return PHP_FLOAT_MAX; // Retorna un límite muy alto (sin restricción práctica)
        }

        // Sumar el saldo pendiente de todas las cuentas pendientes del cliente
        $saldoUtilizado = $this->cuentasPorCobrar()
            ->where('estado', 'pendiente')
            ->sum('saldo_pendiente');

        // Calcular saldo disponible (no puede ser negativo)
        return max(0.0, (float)$this->limite_credito - $saldoUtilizado);
    }

    /**
     * ✅ CRÉDITO: Validar si el cliente puede hacer una compra a crédito por el monto especificado
     *
     * @param float $monto Monto de la compra a validar
     * @return array ['valido' => bool, 'errores' => string[], 'saldo_disponible' => float]
     */
    public function esCreditoValido(float $monto): array
    {
        $errores = [];

        // ✅ MEJORADO: Validar que el cliente esté activo PRIMERO
        if (!$this->activo) {
            $errores[] = "El cliente '{$this->nombre}' está inactivo. Debe estar activo para realizar compras a crédito.";
            return [
                'valido' => false,
                'errores' => $errores,
                'saldo_disponible' => 0.0,
            ];
        }

        // ✅ MEJORADO: Validar que el cliente esté habilitado para crédito
        if (!$this->puede_tener_credito) {
            $errores[] = "El cliente '{$this->nombre}' no está habilitado para compras a crédito. Contacte a administración para habilitar esta opción.";
            return [
                'valido' => false,
                'errores' => $errores,
                'saldo_disponible' => 0.0,
            ];
        }

        // Calcular saldo disponible
        $saldoDisponible = $this->calcularSaldoDisponible();

        // ✅ MEJORADO: Validar que el monto no exceda el saldo disponible
        // (excepto si el límite es sin restricción, donde saldoDisponible es PHP_FLOAT_MAX)
        if ($saldoDisponible !== PHP_FLOAT_MAX && $monto > $saldoDisponible) {
            $errores[] = "El monto de la compra (Bs " . number_format($monto, 2) . ") excede el saldo disponible (Bs " . number_format($saldoDisponible, 2) . "). Límite de crédito: Bs " . number_format($this->limite_credito, 2);
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
            'saldo_disponible' => $saldoDisponible === PHP_FLOAT_MAX ? $this->limite_credito ?? 0 : $saldoDisponible,
        ];
    }

    /**
     * ✅ CRÉDITO: Calcular crédito utilizado = sum(saldo_pendiente de cuentas pendientes)
     *
     * @return float Crédito actualmente utilizado
     */
    public function calcularCreditoUtilizado(): float
    {
        // Si el cliente no está habilitado para crédito, retorna 0
        if (!$this->puede_tener_credito) {
            return 0.0;
        }

        // Si la relación cuentasPorCobrar está precargada, usar esos datos en memoria
        if ($this->relationLoaded('cuentasPorCobrar')) {
            return (float)$this->cuentasPorCobrar
                ->where('estado', 'pendiente')
                ->sum('saldo_pendiente');
        }

        // Si no está precargada, hacer el query a la base de datos
        return (float)$this->cuentasPorCobrar()
            ->where('estado', 'pendiente')
            ->sum('saldo_pendiente');
    }

    /**
     * ✅ CRÉDITO: Accessor para obtener crédito utilizado
     */
    public function getCreditoUtilizadoAttribute(): float
    {
        return $this->calcularCreditoUtilizado();
    }

    /**
     * ✅ Acceso a IDs de categorías para formularios
     */
    public function getCategoriasIdsAttribute(): array
    {
        return $this->categorias()->pluck('categorias_cliente.id')->toArray();
    }
}
