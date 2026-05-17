<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserAttribute;

/**
 * ============================================
 * FASE 4: SERVICIO ABAC
 * Attribute-Based Access Control
 * ============================================
 *
 * Permite control de acceso basado en atributos del usuario:
 * - Zona de venta
 * - Departamento
 * - Sucursal
 * - Región
 * - Centro de distribución
 * etc.
 */
class AbacService
{
    /**
     * Tipos de atributos soportados
     */
    public const ATTRIBUTE_TYPES = [
        'zona' => 'Zona de Venta',
        'departamento' => 'Departamento',
        'sucursal' => 'Sucursal',
        'region' => 'Región',
        'centro_distribucion' => 'Centro de Distribución',
        'equipo' => 'Equipo/Squad',
        'proyecto' => 'Proyecto',
    ];

    /**
     * Asignar atributo a un usuario
     */
    public function asignarAtributo(User $user, string $type, string $value, array $options = []): UserAttribute
    {
        // Validar tipo de atributo
        if (!isset(self::ATTRIBUTE_TYPES[$type])) {
            throw new \Exception("Tipo de atributo '{$type}' no válido");
        }

        // Si es primario, remover otros primarios del mismo tipo
        if ($options['is_primary'] ?? false) {
            UserAttribute::where('user_id', $user->id)
                ->where('attribute_type', $type)
                ->update(['is_primary' => false]);
        }

        return UserAttribute::updateOrCreate(
            [
                'user_id' => $user->id,
                'attribute_type' => $type,
                'attribute_value' => $value,
            ],
            array_merge($options, [
                'is_primary' => $options['is_primary'] ?? true,
                'priority' => $options['priority'] ?? 0,
            ])
        );
    }

    /**
     * Obtener atributo primario de un usuario
     */
    public function obtenerAtributoPrimario(User $user, string $type): ?UserAttribute
    {
        return UserAttribute::where('user_id', $user->id)
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
     * Obtener todos los atributos de un usuario (agrupados por tipo)
     */
    public function obtenerAtributos(User $user): array
    {
        $attributes = UserAttribute::where('user_id', $user->id)
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
        foreach ($attributes as $type => $attrs) {
            $result[$type] = $attrs->pluck('attribute_value')->toArray();
        }

        return $result;
    }

    /**
     * Verificar si usuario puede acceder a recurso basado en atributos
     */
    public function puedeAcceder(User $user, string $resourceType, string $resourceValue): bool
    {
        // Super Admin siempre puede acceder
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // Obtener atributo del usuario para este tipo
        $userAttribute = $this->obtenerAtributoPrimario($user, $this->mapResourceTypeToAttributeType($resourceType));

        if (!$userAttribute) {
            return false;
        }

        // Verificar si el valor coincide
        return $userAttribute->attribute_value === $resourceValue;
    }

    /**
     * Obtener valores permitidos para un usuario
     */
    public function obtenerValoresPermitidos(User $user, string $attributeType): array
    {
        return UserAttribute::where('user_id', $user->id)
            ->where('attribute_type', $attributeType)
            ->where(function ($query) {
                $now = now();
                $query->where(function ($q) use ($now) {
                    $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                });
            })
            ->pluck('attribute_value')
            ->toArray();
    }

    /**
     * Filtrar recursos según atributos del usuario
     */
    public function filtrarResourcesPorAtributos($query, User $user, string $resourceColumnName, string $attributeType)
    {
        // Super Admin ve todo
        if ($user->hasRole('Super Admin')) {
            return $query;
        }

        $valoresPermitidos = $this->obtenerValoresPermitidos($user, $attributeType);

        if (empty($valoresPermitidos)) {
            // Si no tiene atributos, no puede ver nada
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn($resourceColumnName, $valoresPermitidos);
    }

    /**
     * Mapear tipo de recurso a tipo de atributo
     */
    private function mapResourceTypeToAttributeType(string $resourceType): string
    {
        $map = [
            'cliente' => 'zona',
            'producto' => 'centro_distribucion',
            'venta' => 'zona',
            'compra' => 'departamento',
            'pedido' => 'sucursal',
        ];

        return $map[$resourceType] ?? $resourceType;
    }

    /**
     * Validar atributo (verificar si existe y está vigente)
     */
    public function validarAtributo(UserAttribute $attribute): array
    {
        $errores = [];
        $advertencias = [];

        if (!$attribute->isValid()) {
            $errores[] = 'El atributo ha expirado';
        }

        if ($attribute->valid_from && $attribute->valid_from->isFuture()) {
            $advertencias[] = 'El atributo aún no está vigente';
        }

        if ($attribute->valid_until && $attribute->valid_until->diffInDays(now()) < 7) {
            $advertencias[] = 'El atributo expirará pronto';
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
            'advertencias' => $advertencias,
        ];
    }

    /**
     * Obtener contexto de usuario (para auditoría/logging)
     */
    public function obtenerContextoUsuario(User $user): array
    {
        return [
            'usuario_id' => $user->id,
            'nombre' => $user->name,
            'rol' => $user->roles->pluck('name')->first(),
            'capacidades' => $user->getAllPermissions()->pluck('capability')->unique()->toArray(),
            'atributos' => $this->obtenerAtributos($user),
            'es_super_admin' => $user->hasRole('Super Admin'),
            'timestamp' => now(),
        ];
    }

    /**
     * Eliminar atributo de usuario
     */
    public function removerAtributo(User $user, string $type, string $value): bool
    {
        return UserAttribute::where('user_id', $user->id)
            ->where('attribute_type', $type)
            ->where('attribute_value', $value)
            ->delete() > 0;
    }

    /**
     * Reasignar atributo (cambiar valor)
     */
    public function reasignarAtributo(User $user, string $type, string $oldValue, string $newValue): UserAttribute
    {
        $this->removerAtributo($user, $type, $oldValue);
        return $this->asignarAtributo($user, $type, $newValue);
    }

    /**
     * Obtener todos los usuarios con un atributo específico
     */
    public function obtenerUsuariosConAtributo(string $type, string $value): \Illuminate\Database\Eloquent\Collection
    {
        return User::query()
            ->whereHas('attributes', function ($query) use ($type, $value) {
                $query->where('attribute_type', $type)
                    ->where('attribute_value', $value)
                    ->where(function ($q) {
                        $now = now();
                        $q->where(function ($subQ) use ($now) {
                            $subQ->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                        })
                        ->where(function ($subQ) use ($now) {
                            $subQ->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                        });
                    });
            })
            ->with('attributes')
            ->get();
    }
}
