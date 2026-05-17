<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateCajeroLogisticsPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚚 Actualizando permisos de logística para el rol Cajero...');

        // Obtener o crear el rol Cajero
        $rolCajero = Role::firstOrCreate(['name' => 'cajero']);

        // Definir todos los permisos que debe tener el Cajero
        $permisosCajero = [
            // === GESTIÓN DE CAJAS ===
            'cajas.index',
            'cajas.show',
            'cajas.abrir',
            'cajas.cerrar',
            'cajas.transacciones',
            'cajas.create',
            'cajas.store',

            // === GESTIÓN DE VENTAS ===
            'ventas.index',
            'ventas.create',
            'ventas.store',
            'ventas.show',
            'ventas.edit',
            'ventas.update',

            // === GESTIÓN COMPLETA DE PROFORMAS ===
            'proformas.index',
            'proformas.create',
            'proformas.store',
            'proformas.show',
            'proformas.edit',
            'proformas.update',
            'proformas.aprobar',
            'proformas.rechazar',
            'proformas.convertir-venta',

            // === GESTIÓN DE CLIENTES ===
            'clientes.manage',

            // Dashboard y navegación de logística
            'logistica.dashboard',
            'logistica.envios.seguimiento',

            // Gestión de Envíos/Entregas
            'envios.index',
            'envios.create',
            'envios.store',
            'envios.show',
            'envios.edit',
            'envios.update',
            'envios.destroy',
            'envios.programar',
            'envios.cancelar',
            'envios.confirmar-salida',
            'envios.confirmar-entrega',
            'envios.iniciar-preparacion',
            'envios.choferes-disponibles',
            'envios.vehiculos-disponibles',
            'envios.manage', // Para gestión de rutas

            // Reportes de Carga
            'reportes-carga.index',
            'reportes-carga.show',
            'reportes-carga.view',
            'reportes-carga.crear',
            'reportes-carga.actualizar-detalle',
            'reportes-carga.verificar-detalle',
            'reportes-carga.confirmar',
            'reportes-carga.listo-para-entrega',
            'reportes-carga.cancelar',
            'reportes-carga.delete',

            // Entregas - TODOS LOS PERMISOS
            'entregas.index',
            'entregas.create',
            'entregas.store',
            'entregas.show',
            'entregas.view',
            'entregas.edit',
            'entregas.update',
            'entregas.delete',
            'entregas.destroy',
            'entregas.asignar',
            'entregas.manage',
            'entregas.tracking',
            'entregas.confirmar-carga',
            'entregas.listo-para-entrega',
            'entregas.iniciar-transito',
            'entregas.actualizar-ubicacion',

            // Vehículos
            'inventario.vehiculos.manage',
            'inventario.vehiculos.index',
            'inventario.vehiculos.create',
            'inventario.vehiculos.store',
            'inventario.vehiculos.ver',
            'inventario.vehiculos.edit',
            'inventario.vehiculos.update',
            'inventario.vehiculos.destroy',
        ];

        // Obtener los permisos existentes
        $permisosExistentes = Permission::whereIn('name', $permisosCajero)->pluck('id')->toArray();

        // Sincronizar permisos (esto agrega los nuevos sin eliminar los existentes)
        $rolCajero->syncPermissions($permisosExistentes);

        $this->command->info('');
        $this->command->info('✅ Permisos actualizados exitosamente');
        $this->command->info('');
        $this->command->info('📊 Resumen de permisos asignados al Cajero:');
        $this->command->info("  • Logística: 2 permisos");
        $this->command->info("  • Envíos/Entregas: 17 permisos");
        $this->command->info("  • Reportes de Carga: 8 permisos");
        $this->command->info("  • Entregas: 14 permisos");
        $this->command->info("  • Vehículos: 8 permisos");
        $this->command->info("  • Total: " . count($permisosExistentes) . " permisos");
        $this->command->info('');
        $this->command->info('🎯 Módulos de logística habilitados:');
        $this->command->info('  ✓ Dashboard de logística');
        $this->command->info('  ✓ Gestión de envíos');
        $this->command->info('  ✓ Entregas y seguimiento');
        $this->command->info('  ✓ Reportes de carga');
        $this->command->info('  ✓ Gestión de rutas');
        $this->command->info('  ✓ Gestión de vehículos');
        $this->command->info('');
    }
}
