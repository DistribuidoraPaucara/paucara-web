<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EmpleadoRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos específicos para empleados
        $permisos = [
            // Gestión de empleados
            'empleados.ver',
            'empleados.crear',
            'empleados.editar',
            'empleados.eliminar',
            'empleados.cambiar_estado',
            'empleados.gestionar_acceso_sistema',
            'empleados.ver_informacion_salarial',
            'empleados.editar_informacion_salarial',
            'empleados.ver_documentos',
            'empleados.subir_documentos',
            'empleados.ver_historial_accesos',

            // Gestión de departamentos y cargos
            'empleados.gestionar_departamentos',
            'empleados.gestionar_cargos',
            'empleados.asignar_supervisor',

            // Reportes RRHH
            'empleados.reportes.nomina',
            'empleados.reportes.asistencia',
            'empleados.reportes.cumpleanos',
            'empleados.reportes.antiguedad',
            'empleados.reportes.rotacion',

            // Gestión de horarios
            'empleados.gestionar_horarios',
            'empleados.ver_horarios',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate([
                'name'       => $permiso,
                'guard_name' => 'web',
            ]);
        }

        // Crear roles específicos para empleados
        $roles = [
            'Gerente RRHH'           => [
                'empleados.ver',
                'empleados.crear',
                'empleados.editar',
                'empleados.eliminar',
                'empleados.cambiar_estado',
                'empleados.gestionar_acceso_sistema',
                'empleados.ver_informacion_salarial',
                'empleados.editar_informacion_salarial',
                'empleados.ver_documentos',
                'empleados.subir_documentos',
                'empleados.ver_historial_accesos',
                'empleados.gestionar_departamentos',
                'empleados.gestionar_cargos',
                'empleados.asignar_supervisor',
                'empleados.reportes.nomina',
                'empleados.reportes.asistencia',
                'empleados.reportes.cumpleanos',
                'empleados.reportes.antiguedad',
                'empleados.reportes.rotacion',
                'empleados.gestionar_horarios',
                'empleados.ver_horarios',
            ],

            'supervisor'             => [
                'empleados.ver',
                'empleados.ver_documentos',
                'empleados.ver_horarios',
                'empleados.reportes.asistencia',
            ],

            'empleado'               => [
                // Permisos básicos que ya están definidos en el sistema
                // Un empleado regular solo puede ver su propia información
            ],

            'Gerente Administrativo' => [
                'empleados.ver',
                'empleados.crear',
                'empleados.editar',
                'empleados.cambiar_estado',
                'empleados.gestionar_acceso_sistema',
                'empleados.ver_documentos',
                'empleados.subir_documentos',
                'empleados.gestionar_departamentos',
                'empleados.gestionar_cargos',
                'empleados.asignar_supervisor',
                'empleados.reportes.asistencia',
                'empleados.reportes.cumpleanos',
                'empleados.reportes.antiguedad',
                'empleados.gestionar_horarios',
                'empleados.ver_horarios',
            ],
        ];

        foreach ($roles as $nombreRol => $permisosRol) {
            $rol = Role::firstOrCreate([
                'name'       => $nombreRol,
                'guard_name' => 'web',
            ]);

            // Asignar permisos al rol
            $rol->syncPermissions($permisosRol);
        }

        $this->command->info('Roles y permisos para empleados creados exitosamente.');
    }
}
