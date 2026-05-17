<?php

namespace Database\Seeders;

use App\Models\CapabilityTemplate;
use Illuminate\Database\Seeder;

class CapabilityTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * ============================================
         * PLANTILLAS PREDEFINIDAS DE CAPACIDADES
         * Combinaciones comunes de capacidades para roles
         * ============================================
         */

        $templates = [
            // Plantilla: Vendedor Básico
            [
                'name' => 'vendedor-basico',
                'label' => '💼 Vendedor Básico',
                'description' => 'Vendedor que solo puede crear proformas y ventas',
                'capabilities' => ['ventas'],
                'order' => 1,
            ],

            // Plantilla: Vendedor Avanzado (con gestión de clientes)
            [
                'name' => 'vendedor-avanzado',
                'label' => '💼 Vendedor Avanzado',
                'description' => 'Vendedor que puede crear ventas y gestionar sus clientes',
                'capabilities' => ['ventas', 'clientes'],
                'order' => 2,
            ],

            // Plantilla: Preventista (Vendedor con todas sus responsabilidades)
            [
                'name' => 'preventista',
                'label' => '🚀 Preventista',
                'description' => 'Vendedor con gestión completa de clientes y acceso a reportes',
                'capabilities' => ['ventas', 'clientes', 'reportes', 'cajas'],
                'order' => 3,
            ],

            // Plantilla: Comprador
            [
                'name' => 'comprador',
                'label' => '📥 Comprador',
                'description' => 'Especialista en compras y gestión de proveedores',
                'capabilities' => ['compras', 'maestros'],
                'order' => 4,
            ],

            // Plantilla: Gestor de Inventario
            [
                'name' => 'gestor-inventario',
                'label' => '📦 Gestor de Inventario',
                'description' => 'Responsable de stock, ajustes y transferencias',
                'capabilities' => ['inventario', 'reportes'],
                'order' => 5,
            ],

            // Plantilla: Gestor de Almacén
            [
                'name' => 'gestor-almacen',
                'label' => '🏢 Gestor de Almacén',
                'description' => 'Gestiona almacén, inventario y logística',
                'capabilities' => ['inventario', 'logistica', 'maestros'],
                'order' => 6,
            ],

            // Plantilla: Chofer/Repartidor
            [
                'name' => 'chofer',
                'label' => '🚚 Chofer/Repartidor',
                'description' => 'Acceso a envíos y seguimiento de entregas',
                'capabilities' => ['logistica'],
                'order' => 7,
            ],

            // Plantilla: Cajero
            [
                'name' => 'cajero',
                'label' => '💳 Cajero',
                'description' => 'Operador de cajas y cobros',
                'capabilities' => ['cajas', 'ventas'],
                'order' => 8,
            ],

            // Plantilla: Contador/Contabilidad
            [
                'name' => 'contador',
                'label' => '📊 Contador',
                'description' => 'Gestión contable y reportes financieros',
                'capabilities' => ['contabilidad', 'reportes'],
                'order' => 9,
            ],

            // Plantilla: Gerente
            [
                'name' => 'gerente',
                'label' => '👨‍💼 Gerente',
                'description' => 'Supervisión general: ventas, compras, inventario y reportes',
                'capabilities' => ['ventas', 'compras', 'clientes', 'inventario', 'logistica', 'cajas', 'reportes', 'empleados'],
                'order' => 10,
            ],

            // Plantilla: Admin Operaciones
            [
                'name' => 'admin-operaciones',
                'label' => '⚡ Admin Operaciones',
                'description' => 'Control total de operaciones sin acceso a admin',
                'capabilities' => ['ventas', 'compras', 'clientes', 'inventario', 'logistica', 'cajas', 'contabilidad', 'reportes', 'maestros', 'empleados'],
                'order' => 11,
            ],

            // Plantilla: Admin Sistema
            [
                'name' => 'admin-sistema',
                'label' => '🛡️ Admin del Sistema',
                'description' => 'Control total incluyendo configuración y permisos',
                'capabilities' => ['ventas', 'compras', 'clientes', 'inventario', 'logistica', 'cajas', 'contabilidad', 'reportes', 'maestros', 'empleados', 'admin_usuarios', 'admin_roles', 'admin_config', 'admin_system'],
                'order' => 12,
            ],

            // Plantilla: Analista de Reportes
            [
                'name' => 'analista-reportes',
                'label' => '📈 Analista de Reportes',
                'description' => 'Acceso a reportes y análisis de datos',
                'capabilities' => ['reportes', 'ventas', 'inventario'],
                'order' => 13,
            ],
        ];

        foreach ($templates as $template) {
            CapabilityTemplate::updateOrCreate(
                ['name' => $template['name']],
                array_merge($template, [
                    'created_by' => 1, // Asume que hay un usuario con ID 1
                ])
            );
        }
    }
}
