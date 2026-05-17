<?php
namespace App\Enums;

use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;

/**
 * Clase para manejar los tipos de empleados y sus roles correspondientes
 */
class TipoEmpleado
{
    // Constantes para los tipos de empleado comunes (para facilitar referencias en el código)
    public const VENDEDOR               = 'Vendedor';
    public const CAJERO                 = 'Cajero';
    public const CHOFER                 = 'Chofer';
    public const GESTOR_ALMACEN         = 'Gestor de Almacén';
    public const LOGISTICA              = 'Logística';
    public const COMPRADOR              = 'Comprador';
    public const SUPERVISOR             = 'Supervisor';
    public const GERENTE_RRHH           = 'Gerente RRHH';
    public const GERENTE_ADMINISTRATIVO = 'Gerente Administrativo';
    public const EMPLEADO_BASE          = 'Empleado';

    /**
     * Obtiene todos los tipos de empleados disponibles desde la base de datos
     * y los almacena en caché para mejorar rendimiento
     */
    public static function all(): array
    {
        return Cache::remember('tipos_empleado_roles', 3600, function () {
            $rolesList = Role::all()->pluck('name')->toArray();

            // Asegurarse que al menos los roles básicos estén disponibles
            $basicRoles = [
                self::VENDEDOR,
                self::CAJERO,
                self::CHOFER,
                self::GESTOR_ALMACEN,
                self::LOGISTICA,
                self::COMPRADOR,
                self::SUPERVISOR,
                self::EMPLEADO_BASE,
            ];

            return array_unique(array_merge($rolesList, $basicRoles));
        });
    }

    /**
     * Devuelve la configuración de campos adicionales por rol
     * Centraliza la configuración de reglas especiales para cada rol
     */
    public static function conCamposAdicionales(): array
    {
        return Cache::remember('tipos_empleado_campos', 3600, function () {
            $camposEspeciales = [
                self::CHOFER   => [
                    'campos'              => [
                        'licencia'                   => [
                            'label'         => 'Licencia de conducir',
                            'type'          => 'text',
                            'validation'    => 'required|string|max:20',
                            'error_message' => 'La licencia de conducir es obligatoria',
                        ],
                        'fecha_vencimiento_licencia' => [
                            'label'         => 'Fecha de vencimiento',
                            'type'          => 'date',
                            'validation'    => 'required|date|after:today',
                            'error_message' => 'Debe ingresar una fecha válida posterior a hoy',
                        ],
                        'tipo_licencia'              => [
                            'label'         => 'Tipo de licencia',
                            'type'          => 'select',
                            'options'       => ['A', 'B', 'C', 'T', 'M', 'P'],
                            'validation'    => 'required|string|in:A,B,C,T,M,P',
                            'error_message' => 'Debe seleccionar un tipo de licencia válido',
                        ],
                        'vehiculos_autorizados'      => [
                            'label'          => 'Vehículos autorizados',
                            'type'           => 'multiselect',
                            'options_source' => 'vehiculos',
                            'validation'     => 'nullable|array',
                            'error_message'  => 'Seleccione los vehículos autorizados',
                        ],
                    ],
                    'cargos_relacionados' => ['Chofer', 'Conductor', 'Repartidor', 'Mensajero'],
                ],
                self::VENDEDOR => [
                    'campos'              => [
                        'zona_ventas'         => [
                            'label'          => 'Zona de ventas',
                            'type'           => 'select',
                            'options_source' => 'zonas',
                            'validation'     => 'nullable|string',
                            'error_message'  => 'Seleccione una zona de ventas válida',
                        ],
                        'meta_mensual'        => [
                            'label'         => 'Meta mensual (Bs)',
                            'type'          => 'number',
                            'validation'    => 'nullable|numeric|min:0',
                            'error_message' => 'Ingrese un valor válido para la meta mensual',
                        ],
                        'comision_porcentaje' => [
                            'label'         => 'Comisión (%)',
                            'type'          => 'number',
                            'validation'    => 'nullable|numeric|min:0|max:100',
                            'error_message' => 'El porcentaje debe estar entre 0 y 100',
                        ],
                    ],
                    'trait'               => 'App\Models\Traits\VendedorTrait',
                    'cargos_relacionados' => ['Vendedor', 'Representante de Ventas', 'Ejecutivo de Ventas'],
                ],
                self::CAJERO   => [
                    'campos'              => [
                        'caja_asignada'   => [
                            'label'          => 'Caja asignada',
                            'type'           => 'select',
                            'options_source' => 'cajas',
                            'validation'     => 'nullable|exists:cajas,id',
                            'error_message'  => 'Seleccione una caja válida',
                        ],
                        'limite_efectivo' => [
                            'label'         => 'Límite de efectivo (Bs)',
                            'type'          => 'number',
                            'validation'    => 'nullable|numeric|min:0',
                            'error_message' => 'Ingrese un valor válido para el límite',
                        ],
                    ],
                    'trait'               => 'App\Models\Traits\CajeroTrait',
                    'cargos_relacionados' => ['Cajero', 'Tesorero', 'Recepcionista de Cobros'],
                ],
                // Puedes añadir más roles con sus configuraciones específicas
            ];

            return $camposEspeciales;
        });
    }

    /**
     * Verifica si un tipo de empleado requiere campos adicionales
     */
    public static function requiereCamposAdicionales(string $tipo): bool
    {
        return array_key_exists($tipo, self::conCamposAdicionales());
    }

    /**
     * Obtiene las reglas de validación para un tipo de empleado específico
     */
    public static function reglasValidacion(string $tipo): array
    {
        if (! self::requiereCamposAdicionales($tipo)) {
            return [];
        }

        $reglas        = [];
        $configuracion = self::conCamposAdicionales()[$tipo];

        foreach ($configuracion['campos'] as $campo => $detalles) {
            $reglas[$campo] = $detalles['validation'];
        }

        return $reglas;
    }

    /**
     * Obtiene los mensajes de error para un tipo de empleado específico
     */
    public static function mensajesError(string $tipo): array
    {
        if (! self::requiereCamposAdicionales($tipo)) {
            return [];
        }

        $mensajes      = [];
        $configuracion = self::conCamposAdicionales()[$tipo];

        foreach ($configuracion['campos'] as $campo => $detalles) {
            $mensajes[$campo . '.required'] = $detalles['error_message'];
        }

        return $mensajes;
    }

    /**
     * Limpia la caché de roles cuando se añaden nuevos roles
     */
    public static function limpiarCache(): void
    {
        Cache::forget('tipos_empleado_roles');
        Cache::forget('tipos_empleado_campos');
    }

    /**
     * Determinar el rol adecuado basado en el cargo
     */
    public static function determinarRolPorCargo(?string $cargo): string
    {
        if (! $cargo) {
            return self::EMPLEADO_BASE;
        }

        $cargoTrim = trim($cargo);

        // Buscar en las configuraciones de roles si el cargo está en cargos_relacionados
        foreach (self::conCamposAdicionales() as $rol => $config) {
            if (isset($config['cargos_relacionados']) && in_array($cargoTrim, $config['cargos_relacionados'])) {
                return $rol;
            }
        }

        // Si no se encuentra, usar el mapeo directo
        $cargoRoleMapping = [
            'Chofer'                   => self::CHOFER,
            'Conductor'                => self::CHOFER,
            'Repartidor'               => self::CHOFER,
            'Mensajero'                => self::CHOFER,
            'Cajero'                   => self::CAJERO,
            'Vendedor'                 => self::VENDEDOR,
            'Representante de Ventas'  => self::VENDEDOR,
            'Ejecutivo de Ventas'      => self::VENDEDOR,
            'Comprador'                => self::COMPRADOR,
            'Analista de Compras'      => self::COMPRADOR,
            'Almacenero'               => self::GESTOR_ALMACEN,
            'Encargado de Almacén'     => self::GESTOR_ALMACEN,
            'Gestor de Almacén'        => self::GESTOR_ALMACEN,
            'Logístico'                => self::LOGISTICA,
            'Coordinador de Logística' => self::LOGISTICA,
            'Supervisor'               => self::SUPERVISOR,
            'Gerente de RRHH'          => self::GERENTE_RRHH,
            'Director de RRHH'         => self::GERENTE_RRHH,
            'Gerente Administrativo'   => self::GERENTE_ADMINISTRATIVO,
        ];

        return $cargoRoleMapping[$cargoTrim] ?? self::EMPLEADO_BASE;
    }

    /**
     * Método para obtener los traits asociados a cada rol
     * Esto permite un mapeo dinámico entre roles y traits sin acoplar el código
     */
    public static function traitsAsociados(): array
    {
        $traits = [];

        // Primero obtener de la configuración
        foreach (self::conCamposAdicionales() as $rol => $config) {
            if (isset($config['trait'])) {
                $traits[$rol] = $config['trait'];
            }
        }

        // Añadir cualquier trait adicional que no esté en la configuración
        $traitsAdicionales = [
            self::VENDEDOR       => 'App\Models\Traits\VendedorTrait',
            self::GESTOR_ALMACEN => 'App\Models\Traits\GestorAlmacenTrait',
            self::CAJERO         => 'App\Models\Traits\CajeroTrait',
            self::LOGISTICA      => 'App\Models\Traits\LogisticaTrait',
        ];

        // Combinar ambos, dando prioridad a la configuración
        return array_merge($traitsAdicionales, $traits);
    }

    /**
     * Verifica si un rol específico tiene un trait asociado
     */
    public static function tieneTrait(string $rol): bool
    {
        return array_key_exists($rol, self::traitsAsociados());
    }

    /**
     * Obtiene el nombre de clase del trait para un rol específico
     */
    public static function obtenerTrait(string $rol): ?string
    {
        return self::traitsAsociados()[$rol] ?? null;
    }
}
