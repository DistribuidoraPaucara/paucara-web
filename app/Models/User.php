<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Traits\RoleCheckerTrait; // ✨ NUEVO
use App\Models\Traits\CaseInsensitiveRoles; // ✅ NUEVO: Case-insensitive roles

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, CaseInsensitiveRoles, RoleCheckerTrait, Notifiable {
        // ✅ Resolver conflicto: usar CaseInsensitiveRoles::hasRole en lugar de HasRoles::hasRole
        CaseInsensitiveRoles::hasRole insteadof HasRoles;
        CaseInsensitiveRoles::hasAllRoles insteadof HasRoles;
        CaseInsensitiveRoles::hasAnyRole insteadof HasRoles;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'usernick',
        'email',
        'password',
        'activo',
        'can_access_web',
        'can_access_mobile',
        'empresa_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
            'can_access_web' => 'boolean',
            'can_access_mobile' => 'boolean',
        ];
    }

    /**
     * Relación con empresa
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Relación con datos del empleado si es que los tiene
     */
    public function empleado(): HasOne
    {
        return $this->hasOne(Empleado::class);
    }

    /**
     * Relación con datos del chofer (empleado con rol Chofer)
     *
     * DEPRECADO: Usar $user->empleado en su lugar
     * Los choferes ahora se gestionan exclusivamente a través de la tabla Empleados
     * Esta relación se mantiene solo para compatibilidad histórica
     */
    public function chofer(): HasOne
    {
        return $this->hasOne(Empleado::class);
    }

    /**
     * Relación con datos del cliente si es que los tiene
     */
    public function cliente(): HasOne
    {
        return $this->hasOne(Cliente::class);
    }

    /**
     * Relación con entregas asignadas al chofer (usuario)
     *
     * Entregas asignadas a este usuario (como chofer)
     * FK chofer_id en entregas apunta a users.id (FASE 3)
     */
    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class, 'chofer_id');
    }

    /**
     * Relación con cajas asignadas al usuario
     */
    public function cajas(): HasMany
    {
        return $this->hasMany(Caja::class);
    }

    /**
     * Verificar si el usuario es un empleado
     */
    public function esEmpleado(): bool
    {
        return $this->empleado !== null;
    }

    /**
     * Verificar si el usuario es un cliente
     */
    public function esCliente(): bool
    {
        return $this->cliente !== null;
    }

    /**
     * Verificar si el empleado puede acceder al sistema
     */
    public function puedeAccederSistema(): bool
    {
        return $this->empleado?->puedeAccederSistema() ?? true; // Si no es empleado, puede acceder por defecto
    }

    /**
     * Actualizar último acceso si es empleado
     */
    public function actualizarUltimoAccesoEmpleado(): void
    {
        if ($this->esEmpleado()) {
            $this->empleado->actualizarUltimoAcceso();
        }
    }

    /**
     * Asigna roles validando compatibilidad
     * Lanza excepción si hay conflicto
     */
    public function asignarRolesValidado(array $roles): void
    {
        $validator = new \App\Services\RoleCompatibilityValidator();
        $validator->validar($roles, $this->roles->pluck('name')->first());
        $this->syncRoles($roles);
    }

    /**
     * Valida si puede tener múltiples roles específicos
     */
    public function puedenCombinarse(array $roles): bool
    {
        try {
            $validator = new \App\Services\RoleCompatibilityValidator();
            $validator->validar($roles);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Obtiene roles compatibles con el rol actual
     */
    public function obtenerRolesCompatibles(array $rolesDisponibles): array
    {
        $rolActual = $this->roles->pluck('name')->first();

        if (!$rolActual) {
            return $rolesDisponibles;
        }

        $validator = new \App\Services\RoleCompatibilityValidator();
        return $validator->obtenerCompatibles($rolActual, $rolesDisponibles);
    }

    /**
     * ============================================
     * FASE 4: Relaciones ABAC (Atributos)
     * ============================================
     */

    /**
     * Atributos del usuario (zona, departamento, sucursal, etc.)
     */
    public function attributes(): HasMany
    {
        return $this->hasMany(UserAttribute::class);
    }

    /**
     * Obtener atributo primario de un tipo
     */
    public function getAttributo(string $type): ?UserAttribute
    {
        return $this->attributes()
            ->where('attribute_type', $type)
            ->where('is_primary', true)
            ->where(function ($query) {
                $now = now();
                $query->where(function ($q) use ($now) {
                    $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                });
            })
            ->first();
    }

    /**
     * Obtener todos los atributos vigentes agrupados por tipo
     */
    public function getAttributos(): array
    {
        $attrs = $this->attributes()
            ->where(function ($query) {
                $now = now();
                $query->where(function ($q) use ($now) {
                    $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                });
            })
            ->get()
            ->groupBy('attribute_type');

        $result = [];
        foreach ($attrs as $type => $attributes) {
            $result[$type] = $attributes->pluck('attribute_value')->toArray();
        }
        return $result;
    }

    /**
     * ============================================
     * FASE 5: Control de Acceso por Plataforma
     * ============================================
     */

    /**
     * Verificar si el usuario puede acceder a la plataforma web
     */
    public function canAccessWeb(): bool
    {
        return $this->can_access_web ?? true;
    }

    /**
     * Verificar si el usuario puede acceder a la aplicación móvil
     */
    public function canAccessMobile(): bool
    {
        return $this->can_access_mobile ?? true;
    }
}
