<?php
namespace App\Models;

use App\Models\Traits\HasActiveScope;
use App\Models\Traits\RolesFuncionalesTrait;
use App\Models\Traits\CajeroTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    use HasFactory, RolesFuncionalesTrait, HasActiveScope, CajeroTrait;

    protected $fillable = [
        'user_id',
        'empresa_id',  // ✅ NUEVO: Referencia directa a la empresa
        'codigo_empleado',
        'ci',
        'licencia',                   // Para choferes
        'fecha_vencimiento_licencia', // Para choferes
        'telefono',
        'direccion',
        'fecha_ingreso',
        'fecha_salida',
        'estado',
        'puede_acceder_sistema',
        'ultimo_acceso_sistema',
        'foto_perfil',
        'cv_documento',
        'observaciones',
        'latitud',  // Coordenadas GPS
        'longitud', // Coordenadas GPS
    ];

    /**
     * Atributos que se añaden automáticamente al modelo
     */
    protected $appends = ['nombre', 'email', 'usernick', 'roles'];

    protected function casts(): array
    {
        return [
            'fecha_ingreso'              => 'date:Y-m-d',
            'fecha_salida'               => 'date:Y-m-d',
            'fecha_vencimiento_licencia' => 'date:Y-m-d', // Para choferes
            'puede_acceder_sistema'      => 'boolean',
            'ultimo_acceso_sistema'      => 'datetime',
            'latitud'                    => 'decimal:8',
            'longitud'                   => 'decimal:8',
        ];
    }

    /**
     * Usuario asociado al empleado
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    /**
     * ✅ NUEVO: Empresa a la que pertenece el empleado
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class)->withDefault();
    }

    /**
     * ⚠️ DEPRECADO: Entregas asignadas a este chofer
     *
     * NOTA: Esta relación es históricamente incorrecta.
     * En FASE 3, chofer_id en entregas apunta a users.id, no a empleados.id
     * Usar $user->entregas() en su lugar
     *
     * @deprecated Usar $empleado->user->entregas() en su lugar
     */
    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class, 'chofer_id');
    }

    /**
     * Accessor: Obtener el nombre del empleado desde el usuario relacionado
     */
    public function getNombreAttribute(): string
    {
        return $this->user?->name ?? $this->codigo_empleado ?? 'Sin nombre';
    }

    /**
     * Accessor: Obtener el email del empleado desde el usuario relacionado
     */
    public function getEmailAttribute(): ?string
    {
        return $this->user?->email;
    }

    /**
     * Accessor: Obtener el usernick del empleado desde el usuario relacionado
     */
    public function getUsernickAttribute(): ?string
    {
        return $this->user?->usernick;
    }

    /**
     * Accessor: Obtener los roles del empleado como array de nombres
     */
    public function getRolesAttribute(): array
    {
        if (!$this->user) {
            return [];
        }

        // Verificar si la relación roles está cargada en el usuario
        if (!$this->user->relationLoaded('roles')) {
            return [];
        }

        return $this->user->roles->pluck('name')->toArray();
    }

    /**
     * Verificar si el empleado está activo
     */
    public function estaActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Verificar si puede acceder al sistema
     */
    public function puedeAccederSistema(): bool
    {
        return $this->puede_acceder_sistema && $this->estaActivo();
    }

    /**
     * Calcular años de servicio
     */
    public function anosServicio(): int
    {
        if (! $this->fecha_ingreso) {
            return 0;
        }

        $fechaFin    = $this->fecha_salida ?? now();
        $fechaInicio = \Carbon\Carbon::parse($this->fecha_ingreso);

        return $fechaInicio->diffInYears($fechaFin);
    }

    /**
     * Verificar si está en periodo de prueba (menos de 3 meses)
     */
    public function enPeriodoPrueba(): bool
    {
        if (! $this->fecha_ingreso) {
            return false;
        }

        return \Carbon\Carbon::parse($this->fecha_ingreso)->diffInMonths(now()) < 3;
    }

    /**
     * Scope para empleados que pueden acceder al sistema
     */
    public function scopeConAccesoSistema($query)
    {
        return $query->where('puede_acceder_sistema', true)->where('estado', 'activo');
    }

    /**
     * Actualizar último acceso al sistema
     */
    public function actualizarUltimoAcceso(): void
    {
        $this->update(['ultimo_acceso_sistema' => now()]);
    }

    /**
     * Asigna roles al usuario del empleado validando compatibilidad
     *
     * @param array $roles Array de nombres de roles a asignar
     * @throws Exception Si hay conflicto de roles
     */
    public function asignarRolesConValidacion(array $roles): void
    {
        if (!$this->user) {
            throw new \Exception('El empleado no tiene usuario asociado.');
        }

        $this->user->asignarRolesValidado($roles);
    }

    /**
     * Obtiene los roles compatibles para asignar a este empleado
     */
    public function obtenerRolesCompatibles(array $rolesDisponibles): array
    {
        if (!$this->user) {
            return $rolesDisponibles;
        }

        return $this->user->obtenerRolesCompatibles($rolesDisponibles);
    }

    /**
     * Valida que los roles propuestos sean compatibles
     */
    public function rolesCompatibles(array $roles): bool
    {
        if (!$this->user) {
            return true;
        }

        return $this->user->puedenCombinarse($roles);
    }

    /**
     * Valida que un empleado NO tenga el rol 'Cliente'
     * Los empleados deben tener roles de empleados (Gerente, Vendedor, Chofer, etc.)
     * NO deben tener el rol Cliente que está destinado a usuarios en la tabla clientes
     *
     * @return bool
     */
    public function tienRolClienteIncorrecto(): bool
    {
        if (!$this->user) {
            return false;
        }

        return $this->user->roles()->where('name', 'Cliente')->exists();
    }

    /**
     * Obtiene los roles que NO son permitidos para empleados
     *
     * @return array Array de nombres de roles prohibidos para empleados
     */
    public static function rolesProhibidosParaEmpleados(): array
    {
        return ['Cliente']; // Solo Cliente está prohibido para empleados
    }

    /**
     * Validación para asegurar que empleados no tengan roles de cliente
     * Se ejecuta automaticamente cuando se guardan cambios
     */
    protected static function booted(): void
    {
        static::created(function (Empleado $empleado) {
            if ($empleado->tienRolClienteIncorrecto()) {
                \Log::warning('Empleado creado con rol Cliente incorrecto', [
                    'empleado_id' => $empleado->id,
                    'user_id' => $empleado->user_id,
                    'nombre' => $empleado->nombre,
                ]);
            }
        });

        static::updated(function (Empleado $empleado) {
            if ($empleado->tienRolClienteIncorrecto()) {
                \Log::warning('Empleado actualizado con rol Cliente incorrecto', [
                    'empleado_id' => $empleado->id,
                    'user_id' => $empleado->user_id,
                    'nombre' => $empleado->nombre,
                ]);
            }
        });
    }

    /**
     * Relación con Zona (para preventistas)
     */
    public function zona()
    {
        return $this->hasOne(Zona::class, 'preventista_id');
    }

    /**
     * Rutas asignadas (para choferes)
     */
    public function rutasAsignadas()
    {
        return $this->hasMany(Ruta::class, 'chofer_id');
    }

    /**
     * Verificar si es chofer
     */
    public function esChofer(): bool
    {
        return $this->user && $this->user->hasRole('Chofer');
    }

    /**
     * Verificar si es preventista
     */
    public function esPreventista(): bool
    {
        return $this->user && $this->user->hasRole('Preventista');
    }

    /**
     * Verificar si es cajero (acepta 'Cajero' o 'cajero')
     */
    public function esCajero(): bool
    {
        if (!$this->user) {
            return false;
        }

        return $this->user->hasRole('Cajero') || $this->user->hasRole('cajero');
    }

    /**
     * Verificar si tiene licencia vigente (para choferes)
     */
    public function tieneLicenciaVigente(): bool
    {
        if (!$this->licencia || !$this->fecha_vencimiento_licencia) {
            return false;
        }

        return now()->lte($this->fecha_vencimiento_licencia);
    }

    /**
     * Verificar si está disponible para una fecha específica
     * (no tiene rutas activas en esa fecha)
     *
     * @param string $fecha Fecha en formato Y-m-d
     * @return bool
     */
    public function estaDisponiblePara(string $fecha): bool
    {
        if (!$this->estaActivo()) {
            return false;
        }

        // Si es chofer, validar licencia
        if ($this->esChofer() && !$this->tieneLicenciaVigente()) {
            return false;
        }

        // Verificar si NO tiene rutas activas en esa fecha
        $rutasActivas = $this->rutasAsignadas()
            ->whereDate('fecha_ruta', $fecha)
            ->whereIn('estado', ['planificada', 'en_progreso'])
            ->count();

        return $rutasActivas === 0;
    }

    /**
     * Scope: Choferes con licencia vigente
     */
    public function scopeConLicenciaVigente($query)
    {
        return $query->whereNotNull('licencia')
                     ->whereNotNull('fecha_vencimiento_licencia')
                     ->where('fecha_vencimiento_licencia', '>=', now());
    }

    /**
     * Scope: Choferes disponibles para una fecha
     */
    public function scopeDisponiblesPara($query, string $fecha)
    {
        return $query->where('estado', 'activo')
                     ->conLicenciaVigente()
                     ->whereDoesntHave('rutasAsignadas', function ($q) use ($fecha) {
                         $q->whereDate('fecha_ruta', $fecha)
                           ->whereIn('estado', ['planificada', 'en_progreso']);
                     });
    }
}
