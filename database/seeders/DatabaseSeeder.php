<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(EmpresaSeeder::class);
        $this->call(CoreCatalogSeeder::class);
        $this->call(AlmacenesUbicacionSeeder::class);
        // ✅ NUEVO: Poblar almacenes_prestables desde almacenes
        $this->call(PopulateAlmacenesPrestablesSeeder::class);
        // Asignar almacenes a empresas (antes de que se usen para búsquedas)
        $this->call(AssignAlmacenesToEmpresasSeeder::class);
        // ✅ NUEVO: Crear sectores para almacenes
        $this->call(SectorSeeder::class);
        // Seed roles and permissions FIRST
        $this->call(RolesAndPermissionsSeeder::class);

        // NUEVO: Permisos específicos del Sidebar
        $this->call(SidebarPermissionsSeeder::class);

        // ✅ NUEVO: Crear permiso de Análisis ABC
        $this->call(CreateAnalisisAbcPermissionSeeder::class);

        // Asignar permisos de reportes
        $this->call(AssignReportesPermissionsSeeder::class);

        // ✅ NUEVO: Permisos de Sectores
        $this->call(SectorPermissionsSeeder::class);

        // COMENTADO: Mapeo de Capacidades a Permisos reales
        // Nota: Este seeder crea roles duplicados (preventista, chofer, cajero, etc.)
        // Usamos solo RolesAndPermissionsSeeder para roles y el sistema de Capabilities para UI
        // $this->call(CapabilityToRolePermissionsSeeder::class);

        // $this->call(CajaSeeder::class);
        // $this->call(ClienteTestSeeder::class);
        // $this->call(ClientesConUsuariosSeeder::class);
        // $this->call(CuentaContableSeeder::class);
        $this->call(EmpleadoRolesSeeder::class);
        // $this->call(EmpleadosTestSeeder::class);
        // $this->call(EmpleadosSinUsuarioSeeder::class);
        // $this->call(SupervisoresSeeder::class);
        $this->call(EstadoDocumentoSeeder::class);
        $this->call(EstadoMermaSeeder::class);
        $this->call(EstadosLogisticaSeeder::class);
        // $this->call(ImpuestoSeeder::class);
        $this->call(ModuloSidebarSeeder::class);

        // ✅ NUEVO: Limpiar módulos duplicados del sidebar
        // $this->call(CleanupDuplicateModulesSeeder::class);

        // ✅ NUEVO: Actualizar permisos del sidebar para Cajero
        // $this->call(UpdateSidebarPermissionsSeeder::class);

        $this->call(MonedaSeeder::class);
        // $this->call(ProformaAppExternaSeeder::class);
        $this->call(TipoAjustInventarioSeeder::class);
        $this->call(TipoDocumentoSeeder::class);
        $this->call(TipoMermaSeeder::class);
        $this->call(TipoOperacionCajaSeeder::class);
        // ✅ NUEVO: Asignar direcciones (ENTRADA/SALIDA/AJUSTE) a tipos de operación
        $this->call(TipoOperacionCajaDireccionSeeder::class);
        $this->call(TiposPrecioSeeder::class);
        // $this->call(ProductosEjemploSeeder::class);
        $this->call(CategoriaClienteSeeder::class);
        $this->call(LocalidadSeeder::class);
        $this->call(EstadosLogisticaSeeder::class);
        $this->call(EstadosLogisticaPickupSeeder::class);

        // Create a default admin user if not exists
        $admin = User::query()->where('email', 'admin@admin.com')->first();
        if (! $admin) {
            $admin = User::factory()->create([
                'name'       => 'Administrador',
                'usernick'   => 'admin',
                'email'      => 'admin@admin.com',
                'password'   => Hash::make('password'),
                'empresa_id' => 1,
            ]);
        } else {
            // Ensure usernick is set for legacy records
            if (empty($admin->usernick)) {
                $admin->forceFill(['usernick' => 'admin'])->save();
            }
        }
        // ✅ NOTA: Los roles se asignan en RolesAndPermissionsSeeder
        // No asignamos roles aquí para evitar conflictos
        // El usuario admin@admin.com recibirá múltiples roles en RolesAndPermissionsSeeder

        // ✅ IMPORTANTE: Crear choferes ANTES de los vehículos
        // Crear usuario chofer de prueba
        $this->call(ChoferTestSeeder::class);

        // ✅ NUEVO: Crear preventistas de prueba
        $this->call(PreventistaTestSeeder::class);

        // ✅ Crear vehículos DESPUÉS de los choferes para poder asignarlos
        $this->call(VehiculoSeeder::class);

        // Crear usuarios cajero de prueba
        // $this->call(CajeroTestSeeder::class);

        // ✅ NUEVO: Actualizar permisos de logística para el Cajero
        $this->call(UpdateCajeroLogisticsPermissionsSeeder::class);

        // ✅ NUEVO: Crear permiso para importación de créditos
        $this->call(CreditosPermissionsSeeder::class);

        // ✅ NUEVO: Validar y crear datos críticos que puedan faltar
        $this->call(ValidateAndCreateRequiredDataSeeder::class);

        // ✅ NUEVO: Crear plantillas de impresión para pagos
        $this->call(PagosPlantillaImpresionSeeder::class);

        // Precalentar caché de códigos de barra (después de que los datos estén listos)
        $this->call(CodigosBarraCachePrecalentarSeeder::class);

        // ✅ NUEVO: Seeders para módulo de Préstamos de Canastillas y Embases
        $this->call(PrestableSeeder::class);
        $this->call(PrestableStockSeeder::class);
    }
}
