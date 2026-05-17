<?php
namespace Database\Seeders;

use App\Models\Capability;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        // ============================================
        // FASE 1: DEFINIR CAPACIDADES Y CREAR PERMISOS
        // ============================================
        $capabilities = $this->defineCapabilities();

        // Obtener todos los permisos únicos del mapa centralizado
        $permissions = $this->getAllUniquePermissions();

        // Crear permisos en la BD
        foreach ($permissions as $name) {
            Permission::findOrCreate($name);
        }

        // Asignar capacidades a los permisos
        $this->assignCapabilitiesToPermissions($capabilities);

        // Create roles - Jerarquía clara
        // Nivel 1: Super Admin (acceso total + gestión de admins)
        $superAdmin = Role::findOrCreate('Super Admin');

        // Nivel 2: Admin/Manager (casi todo, excepto crear Super Admins)
        $admin = Role::findOrCreate('admin');

        // ============================================
        // NIVEL 1: Super Admin - Acceso Total
        // ============================================
        $superAdmin->givePermissionTo(Permission::all());

        // ============================================
        // NIVEL 2: Admin - Casi todos los permisos
        // (NO puede gestionar Super Admins)
        // ============================================
        $adminPerms = Permission::all()->reject(function ($permission) {
            // Excluir permisos críticos del sistema que solo Super Admin debe tener
            return in_array($permission->name, [
                'admin.system', // Configuraciones críticas del sistema
            ]);
        });
        $admin->syncPermissions($adminPerms);

        // ============================================
        // FASE 2: ASIGNAR PERMISOS A ROLES
        // Usando mapa centralizado para eliminar duplicidad
        // ============================================
        $rolePermissionsMap = $this->getRolePermissionsMap();

        // Asignar permisos a roles (excepto los que tienen lógica especial)
        foreach ($rolePermissionsMap as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName);
            $role->syncPermissions($permissions);
        }

        // ============================================
        // FASE 3: ASIGNAR ROLES A USUARIOS
        // ============================================
        // Asignar Super Admin al primer usuario
        $firstUser = User::query()->orderBy('id')->first();
        if ($firstUser !== null && ! $firstUser->hasRole('Super Admin')) {
            $firstUser->assignRole('Super Admin');
        }

        // ✅ NUEVO: Asignar múltiples roles al usuario admin@admin.com
        $this->assignMultipleRolesToAdminUser();

        // Crear usuario Cajero para testing/uso por defecto
        if (! User::where('email', 'cajero@distribuidora.com')->exists()) {
            $cajeroUser = User::create([
                'name'     => 'Cajero Principal',
                'email'    => 'cajero@distribuidora.com',
                'usernick' => 'cajero',
                'password' => bcrypt('password'),
                'activo'   => true,
            ]);
            $cajeroUser->assignRole('cajero');
        }
    }

    /**
     * ============================================
     * ASIGNAR MÚLTIPLES ROLES AL USUARIO ADMIN
     * ============================================
     *
     * El usuario admin@admin.com recibe múltiples roles:
     * - Super Admin: Acceso total al sistema
     * - Admin: Para usar como rol principal en operaciones
     * - Manager: Para acceso a reportes y configuración
     *
     * Esto permite que todas las búsquedas de hasRole()
     * funcionen correctamente sin necesidad de cambiar código.
     */
    private function assignMultipleRolesToAdminUser(): void
    {
        // Buscar usuario admin@admin.com
        $adminUser = User::where('email', 'admin@admin.com')->first();

        if (! $adminUser) {
            return;
        }

        // Roles que debe tener el usuario admin
        $adminRoles = [
            'Super Admin', // Acceso total
            'admin',       // Rol administrativo estándar (minúscula)
            'manager', // Acceso a reportes (minúscula)
        ];

        // Sincronizar roles (reemplaza los existentes)
        $adminUser->syncRoles($adminRoles);

        echo "✅ Usuario admin@admin.com ahora tiene múltiples roles: " . implode(', ', $adminRoles) . "\n";
    }

    /**
     * ============================================
     * MÓDULOS: Permisos organizados por dominio
     * ============================================
     *
     * Cada módulo agrupa permisos relacionados.
     * Se reutilizan en múltiples roles para evitar duplicidad.
     */
    private function getPermissionsByModule(): array
    {
        return [
            'ventas'         => [
                'ventas.index', 'ventas.create', 'ventas.store', 'ventas.show', 'ventas.edit', 'ventas.update', 'ventas.destroy',
                'ventas.detalles.index', 'ventas.detalles.store', 'ventas.detalles.update', 'ventas.detalles.destroy',
                'ventas.verificar-stock', 'ventas.stock.bajo', 'ventas.stock.producto', 'ventas.stock.verificar', 'ventas.stock.resumen',
            ],
            'proformas'      => [
                'proformas.index', 'proformas.create', 'proformas.store', 'proformas.show', 'proformas.edit', 'proformas.update',
                'proformas.aprobar', 'proformas.rechazar', 'proformas.convertir-venta',
            ],
            'compras'        => [
                'compras.index', 'compras.create', 'compras.store', 'compras.show', 'compras.edit', 'compras.update', 'compras.destroy',
                'compras.detalles.index', 'compras.detalles.store', 'compras.detalles.update', 'compras.detalles.destroy',
                'compras.cuentas-por-pagar.index', 'compras.cuentas-por-pagar.show', 'compras.cuentas-por-pagar.actualizar-estado', 'compras.cuentas-por-pagar.export',
                'compras.pagos.index', 'compras.pagos.create', 'compras.pagos.store', 'compras.pagos.show', 'compras.pagos.destroy', 'compras.pagos.export',
                'compras.lotes-vencimientos.index', 'compras.lotes-vencimientos.export', 'compras.lotes-vencimientos.actualizar-estado', 'compras.lotes-vencimientos.actualizar-cantidad',
                'compras.reportes.index', 'compras.reportes.export', 'compras.reportes.export-pdf',
            ],
            'inventario'     => [
                'inventario.dashboard', 'inventario.stock-bajo', 'inventario.proximos-vencer', 'inventario.vencidos', 'inventario.movimientos',
                'inventario.ajuste.form', 'inventario.ajuste.procesar', 'inventario.api.buscar-productos', 'inventario.api.stock-producto',
                'inventario.reportes', 'inventario.mermas.index', 'inventario.mermas.registrar', 'inventario.mermas.store', 'inventario.mermas.show',
                'inventario.mermas.aprobar', 'inventario.mermas.rechazar',
                'inventario.transferencias.index', 'inventario.transferencias.crear', 'inventario.transferencias.ver', 'inventario.transferencias.edit',
                'inventario.transferencias.enviar', 'inventario.transferencias.recibir', 'inventario.transferencias.cancelar',
                'inventario.tipos-ajuste.manage', 'inventario.tipos-ajuste.index', 'inventario.tipos-ajuste.create', 'inventario.tipos-ajuste.store', 'inventario.tipos-ajuste.edit', 'inventario.tipos-ajuste.update', 'inventario.tipos-ajuste.destroy',
                'inventario.vehiculos.manage', 'inventario.vehiculos.index', 'inventario.vehiculos.create', 'inventario.vehiculos.store', 'inventario.vehiculos.ver', 'inventario.vehiculos.edit', 'inventario.vehiculos.update', 'inventario.vehiculos.destroy',
                'inventario.analisis.manage', // ✅ NUEVO: Análisis ABC del inventario
            ],
            'entregas'       => [
                'entregas.index', 'entregas.create', 'entregas.store', 'entregas.show', 'entregas.view', 'entregas.edit', 'entregas.update', 'entregas.delete', 'entregas.destroy',
                'entregas.asignar', 'entregas.tracking',
                'entregas.confirmar-carga', 'entregas.listo-para-entrega', 'entregas.iniciar-transito', 'entregas.actualizar-ubicacion',
            ],
            'envios'         => [
                'envios.index', 'envios.create', 'envios.store', 'envios.show', 'envios.edit', 'envios.update', 'envios.destroy',
                'envios.programar', 'envios.cancelar', 'envios.confirmar-entrega', 'envios.confirmar-salida', 'envios.iniciar-preparacion',
                'envios.choferes-disponibles', 'envios.vehiculos-disponibles',
            ],
            'logistica'      => [
                'logistica.manage', 'logistica.dashboard', 'logistica.envios.seguimiento',
            ],
            'reportes_carga' => [
                'reportes-carga.manage', 'reportes-carga.crear', 'reportes-carga.show', 'reportes-carga.view', 'reportes-carga.actualizar-detalle', 'reportes-carga.verificar-detalle',
                'reportes-carga.confirmar', 'reportes-carga.listo-para-entrega', 'reportes-carga.cancelar', 'reportes-carga.delete',
            ],
            'cajas'          => [
                'cajas.index', 'cajas.create', 'cajas.store', 'cajas.show', 'cajas.edit', 'cajas.update',
                'cajas.abrir', 'cajas.cerrar', 'cajas.transacciones', 'cajas.corregir',
                'cajas.reportes', 'cajas.auditoria', 'cajas.gastos.index', 'cajas.gastos.create', 'admin.auditoria',
                'admin.cierres.ver', 'admin.cierres.consolidar', 'admin.cierres.rechazar',
            ],
            'contabilidad'   => [
                'contabilidad.manage', 'contabilidad.asientos.index', 'contabilidad.asientos.show', 'contabilidad.reportes.libro-mayor', 'contabilidad.reportes.balance-comprobacion',
            ],
            'reportes'       => [
                'reportes.manage', 'reportes.precios.index', 'reportes.precios.export', 'reportes.ganancias.index', 'reportes.ganancias.export',
                'reportes.inventario.stock-actual', 'reportes.inventario.vencimientos', 'reportes.inventario.rotacion',
                'reportes.inventario.movimientos', 'reportes.inventario.export',
            ],
            'clientes'       => [
                'clientes.manage',
                'clientes.direcciones.index', 'clientes.direcciones.create', 'clientes.direcciones.store',
                'clientes.direcciones.edit', 'clientes.direcciones.update', 'clientes.direcciones.destroy',
                'clientes.ventanas-entrega.index', 'clientes.ventanas-entrega.create', 'clientes.ventanas-entrega.store',
                'clientes.ventanas-entrega.edit', 'clientes.ventanas-entrega.update', 'clientes.ventanas-entrega.destroy',
                'clientes.fotos.index', 'clientes.fotos.store', 'clientes.fotos.destroy',
                'clientes.cuentas-por-cobrar.index', 'clientes.cuentas-por-cobrar.view',
            ],
            'empleados'      => [
                'empleados.manage', 'empleados.index', 'empleados.create', 'empleados.store', 'empleados.show', 'empleados.edit', 'empleados.update', 'empleados.destroy',
                'empleados.toggle-estado', 'empleados.toggle-acceso-sistema',
            ],
            'usuarios'       => [
                'usuarios.manage', 'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit', 'usuarios.update', 'usuarios.destroy',
                'usuarios.assign-role', 'usuarios.remove-role', 'usuarios.assign-permission', 'usuarios.remove-permission',
            ],
            'roles'          => [
                'roles.manage', 'roles.index', 'roles.create', 'roles.store', 'roles.show', 'roles.edit', 'roles.update', 'roles.destroy',
                'roles.assign-permission', 'roles.remove-permission',
            ],
            'permissions'    => [
                'permissions.manage', 'permissions.index', 'permissions.create', 'permissions.store', 'permissions.show', 'permissions.edit', 'permissions.update', 'permissions.destroy',
            ],
            'maestros'       => [
                'categorias.manage', 'marcas.manage', 'almacenes.manage', 'proveedores.manage', 'productos.manage',
                'unidades.manage', 'tipos-precio.manage', 'tipos-pago.manage', 'monedas.manage', 'localidades.manage', 'tipos_documento.manage',
            ],
            'configuracion'  => [
                'modulos-sidebar.manage', 'modulos-sidebar.index', 'modulos-sidebar.create', 'modulos-sidebar.store', 'modulos-sidebar.show', 'modulos-sidebar.edit',
                'modulos-sidebar.update', 'modulos-sidebar.destroy', 'modulos-sidebar.actualizar-orden', 'modulos-sidebar.toggle-activo',
                'configuracion-global.index', 'configuracion-global.store', 'configuracion-global.show', 'configuracion-global.update',
                'configuracion-global.reset', 'configuracion-global.ganancias', 'configuracion-global.ganancias.update',
            ],
            'admin'          => [
                'admin.config', 'admin.system', 'admin.image-backup.manage', 'admin.creditos.importar',
            ],
            'creditos'       => [
                'admin.creditos.importar',
            ],
        ];
    }

    /**
     * ============================================
     * MÉTODO AUXILIAR: Obtener permisos únicos
     * ============================================
     *
     * Extrae todos los permisos únicos del mapa de roles.
     * Útil para crear permisos en la BD sin duplicados.
     */
    private function getAllUniquePermissions(): array
    {
        $rolePermissionsMap = $this->getRolePermissionsMap();
        $allPermissions     = [];

        foreach ($rolePermissionsMap as $roleName => $permissions) {
            $allPermissions = array_merge($allPermissions, $permissions);
        }

        return array_unique($allPermissions);
    }

    /**
     * ============================================
     * MAPA CENTRALIZADO: Roles → Permisos
     * ============================================
     *
     * Array asociativo que mapea cada rol a sus permisos.
     * Este es el único lugar donde se definen los permisos de cada rol.
     * Elimina la duplicidad que existía antes.
     */
    private function getRolePermissionsMap(): array
    {
        $modules = $this->getPermissionsByModule();

        return [
            'vendedor'             => [
                 ...$modules['ventas'],
                'proformas.index', 'proformas.show', 'proformas.aprobar', 'proformas.rechazar', 'proformas.convertir-venta',
                ...$modules['clientes'],
                'productos.manage',
            ],
            'compras'              => [
                 ...$modules['compras'],
                'proveedores.manage', 'productos.manage', 'monedas.manage',
            ],
            'Gestor de Inventario' => [
                 ...$modules['inventario'],
                'productos.manage', 'almacenes.manage',
            ],
            'reportes'             => [
                 ...$modules['reportes'],
            ],
            'Gestor de Logística'  => [
                 ...$modules['envios'],
                ...$modules['logistica'],
                ...$modules['entregas'],
                'reportes-carga.crear', 'reportes-carga.show', 'reportes-carga.view', 'reportes-carga.actualizar-detalle', 'reportes-carga.verificar-detalle',
                'reportes-carga.confirmar', 'reportes-carga.listo-para-entrega',
            ],
            'contabilidad'         => [
                 ...$modules['contabilidad'],
            ],
            'gerente'              => [
                 ...$modules['reportes'],
                'ventas.index', 'ventas.show', 'compras.index', 'compras.show',
                'inventario.dashboard',
                'empleados.index', 'empleados.show',
                'configuracion-global.ganancias',
            ],
            'cajero'               => [
                 ...$modules['cajas'],
                'ventas.index', 'ventas.create', 'ventas.store', 'ventas.show', 'ventas.edit', 'ventas.update',
                ...$modules['proformas'],
                'clientes.manage',
                ...$modules['envios'],
                ...$modules['logistica'],
                ...$modules['entregas'],
                'entregas.asignar',
                'reportes-carga.crear', 'reportes-carga.show', 'reportes-carga.view', 'reportes-carga.actualizar-detalle', 'reportes-carga.verificar-detalle',
                'reportes-carga.confirmar', 'reportes-carga.listo-para-entrega',
            ],
            'Gestor de Clientes'   => [
                'clientes.manage',
                'productos.manage',
                'ventas.index', 'ventas.show',
            ],
            'chofer'               => [
                'envios.index', 'envios.show',
                'logistica.dashboard', 'logistica.envios.seguimiento',
                'envios.confirmar-entrega', 'envios.confirmar-salida', 'envios.iniciar-preparacion',
                'entregas.index', 'entregas.show', 'entregas.view', 'entregas.edit', 'entregas.update',
                'entregas.confirmar-carga', 'entregas.listo-para-entrega', 'entregas.iniciar-transito', 'entregas.actualizar-ubicacion',
                'reportes-carga.show', 'reportes-carga.view', 'reportes-carga.actualizar-detalle', 'reportes-carga.verificar-detalle',
                'reportes-carga.confirmar',
                'cajas.index', 'cajas.show', 'cajas.abrir', 'cajas.cerrar', 'cajas.transacciones',
                'ventas.index', 'ventas.show',
                'clientes.manage',
                'empleados.show',
            ],
            'cliente'              => [
                'clientes.manage',
            ],
            'Gestor de Almacén'    => [
                'inventario.dashboard', 'inventario.stock-bajo', 'inventario.proximos-vencer', 'inventario.vencidos', 'inventario.movimientos',
                'inventario.ajuste.form', 'inventario.ajuste.procesar',
                'inventario.transferencias.index', 'inventario.transferencias.crear', 'inventario.transferencias.ver',
                'inventario.transferencias.enviar', 'inventario.transferencias.recibir',
                'inventario.mermas.index', 'inventario.mermas.registrar', 'inventario.mermas.store', 'inventario.mermas.show',
                'inventario.tipos-ajuste.index', 'inventario.tipos-ajuste.manage',
                'almacenes.manage',
                'productos.manage',
                'reportes.inventario.stock-actual', 'reportes.inventario.vencimientos', 'reportes.inventario.movimientos',
            ],
            'comprador'            => [
                'compras.index', 'compras.create', 'compras.store', 'compras.show', 'compras.edit', 'compras.update',
                'compras.detalles.index', 'compras.detalles.store', 'compras.detalles.update', 'compras.detalles.destroy',
                'compras.cuentas-por-pagar.index', 'compras.cuentas-por-pagar.show',
                'compras.pagos.index', 'compras.pagos.create', 'compras.pagos.store', 'compras.pagos.show',
                'compras.lotes-vencimientos.index', 'compras.lotes-vencimientos.actualizar-estado', 'compras.lotes-vencimientos.actualizar-cantidad',
                'proveedores.manage',
                'productos.manage',
                'reportes.precios.index', 'reportes.precios.export',
            ],
            'manager'              => [
                 ...$modules['ventas'],
                ...$modules['proformas'],
                ...$modules['compras'],
                ...$modules['inventario'],
                ...$modules['envios'],
                ...$modules['logistica'],
                ...$modules['cajas'],
                ...$modules['contabilidad'],
                ...$modules['reportes'],
                ...$modules['empleados'],
                'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit', 'usuarios.update',
                'usuarios.assign-role', 'usuarios.remove-role',
                ...$modules['maestros'],
                'configuracion-global.index', 'configuracion-global.show', 'configuracion-global.store', 'configuracion-global.update',
                'configuracion-global.ganancias', 'configuracion-global.ganancias.update',
                'modulos-sidebar.index', 'modulos-sidebar.show',
                'admin.config',
            ],
            'empleado'             => [
                'empleados.show',
            ],
            'preventista'          => [
                 ...$modules['clientes'],
                'categorias.manage',
                'envios.index', 'envios.show',
                'logistica.dashboard', 'logistica.envios.seguimiento',
                ...$modules['ventas'],
                ...$modules['proformas'],
                ...$modules['cajas'],
                'reportes.inventario.stock-actual', 'reportes.inventario.movimientos',
                'inventario.dashboard', 'inventario.stock-bajo', 'inventario.proximos-vencer',
                'empleados.index', 'empleados.show',
                'productos.manage',
                'localidades.manage',
            ],
        ];
    }

    /**
     * ============================================
     * METADATA: Información de Capacidades
     * ============================================
     *
     * Solo contiene metadata (label, description, icon)
     * Los permisos se obtienen de getPermissionsByModule()
     */
    private function getCapabilitiesMetadata(): array
    {
        return [
            'ventas'         => [
                'label'       => 'Vender (Crear proformas y ventas)',
                'description' => 'Capacidad para crear, editar y gestionar ventas y proformas',
                'icon'        => '💰',
            ],
            'proformas'      => [
                'label'       => 'Gestionar Proformas',
                'description' => 'Capacidad para crear, aprobar y convertir proformas',
                'icon'        => '📋',
            ],
            'compras'        => [
                'label'       => 'Comprar (Gestionar compras a proveedores)',
                'description' => 'Capacidad para crear y gestionar órdenes de compra',
                'icon'        => '📦',
            ],
            'clientes'       => [
                'label'       => 'Gestionar Clientes (Crear/editar datos maestros)',
                'description' => 'Capacidad para administrar información de clientes, direcciones, ventanas de entrega',
                'icon'        => '👥',
            ],
            'inventario'     => [
                'label'       => 'Gestionar Inventario (Stock, ajustes, transferencias)',
                'description' => 'Capacidad para controlar stock, hacer ajustes, transferencias y ver mermas',
                'icon'        => '📊',
            ],
            'entregas'       => [
                'label'       => 'Gestionar Entregas',
                'description' => 'Capacidad para gestionar el flujo de entregas y logística',
                'icon'        => '📍',
            ],
            'logistica'      => [
                'label'       => 'Gestionar Logística',
                'description' => 'Capacidad para gestionar envíos, asignar choferes y seguimiento de entregas',
                'icon'        => '🚚',
            ],
            'reportes_carga' => [
                'label'       => 'Reportes de Carga',
                'description' => 'Capacidad para crear y gestionar reportes de carga',
                'icon'        => '📄',
            ],
            'cajas'          => [
                'label'       => 'Gestionar Cajas (Cobros, aperturas, cierres)',
                'description' => 'Capacidad para operar cajas, registrar cobros y transacciones',
                'icon'        => '💳',
            ],
            'contabilidad'   => [
                'label'       => 'Gestionar Contabilidad (Asientos, libros, balance)',
                'description' => 'Capacidad para registro contable y reportes financieros',
                'icon'        => '📚',
            ],
            'reportes'       => [
                'label'       => 'Ver Reportes (Ventas, inventario, ganancias)',
                'description' => 'Capacidad para acceder a reportes y análisis de datos',
                'icon'        => '📈',
            ],
            'empleados'      => [
                'label'       => 'Gestionar Empleados (CRUD)',
                'description' => 'Capacidad para crear, editar y administrar empleados',
                'icon'        => '👨‍💼',
            ],
            'usuarios'       => [
                'label'       => 'Administrar Usuarios (CRUD, asignar roles)',
                'description' => 'Capacidad para crear, editar usuarios y asignar roles',
                'icon'        => '👤',
            ],
            'roles'          => [
                'label'       => 'Administrar Roles (CRUD, permisos)',
                'description' => 'Capacidad para crear, editar y asignar permisos a roles',
                'icon'        => '🔑',
            ],
            'permissions'    => [
                'label'       => 'Administrar Permisos',
                'description' => 'Capacidad para crear, editar y eliminar permisos',
                'icon'        => '🔓',
            ],
            'maestros'       => [
                'label'       => 'Gestionar Maestros (Categorías, marcas, proveedores)',
                'description' => 'Capacidad para editar datos maestros del sistema',
                'icon'        => '⚙️',
            ],
            'configuracion'  => [
                'label'       => 'Configurar Sistema (Configuración global)',
                'description' => 'Capacidad para cambiar configuraciones del sistema',
                'icon'        => '⚙️',
            ],
            'admin'          => [
                'label'       => 'Admin del Sistema (Crítico - Solo Super Admin)',
                'description' => 'Capacidad para cambios críticos del sistema',
                'icon'        => '🛡️',
            ],
            'creditos'       => [
                'label'       => 'Gestionar Créditos (Importación histórica)',
                'description' => 'Capacidad para importar créditos históricos desde otros sistemas',
                'icon'        => '📥',
            ],
        ];
    }

    /**
     * ============================================
     * FASE 1: DEFINIR CAPACIDADES
     * Combina metadata con permisos de módulos
     * ============================================
     *
     * Las capacidades agrupan permisos relacionados
     * Reutiliza los permisos de getPermissionsByModule()
     */
    private function defineCapabilities(): array
    {
        $modules  = $this->getPermissionsByModule();
        $metadata = $this->getCapabilitiesMetadata();

        // Combinar metadata con permisos de módulos
        $capabilities = [];
        foreach ($metadata as $capName => $capData) {
            $capabilities[$capName] = [
                'name'        => $capName,
                'label'       => $capData['label'],
                'description' => $capData['description'],
                'icon'        => $capData['icon'] ?? null,
                'permissions' => $modules[$capName] ?? [],
            ];
        }

        // Crear/actualizar Capabilities en BD
        foreach ($capabilities as $capName => $capData) {
            Capability::updateOrCreate(
                ['name' => $capName],
                [
                    'label'       => $capData['label'],
                    'description' => $capData['description'],
                    'icon'        => $capData['icon'] ?? null,
                ]
            );
        }

        return $capabilities;
    }

    /**
     * Asignar capacidades a los permisos individuales
     */
    private function assignCapabilitiesToPermissions(array $capabilities): void
    {
        foreach ($capabilities as $capName => $capData) {
            $capability = Capability::where('name', $capName)->first();

            if ($capability) {
                foreach ($capData['permissions'] as $permissionName) {
                    $permission = Permission::where('name', $permissionName)->first();
                    if ($permission) {
                        $permission->update(['capability' => $capName]);
                    }
                }
            }
        }
    }
}
