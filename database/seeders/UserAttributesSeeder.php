<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AbacService;
use Illuminate\Database\Seeder;

/**
 * ============================================
 * FASE 4: SEEDER DE ATRIBUTOS ABAC
 * UserAttributesSeeder - Asignar atributos ABAC
 * ============================================
 *
 * Asigna atributos (zona, departamento, sucursal, etc.)
 * a usuarios existentes para el sistema ABAC.
 *
 * Ejecutar: php artisan db:seed --class=UserAttributesSeeder
 */
class UserAttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $abacService = app(AbacService::class);

        echo "\n=== Asignando Atributos ABAC ===\n";

        // Obtener usuarios de prueba
        $users = User::where('activo', true)
            ->where('usernick', '<>', null)
            ->limit(10)
            ->get();

        if ($users->isEmpty()) {
            echo "⚠️  No hay usuarios activos para asignar atributos.\n";
            echo "   Crea usuarios primero y vuelve a ejecutar este seeder.\n";
            return;
        }

        // Definir zonas y departamentos disponibles
        $zonas = ['ZONA_NORTE', 'ZONA_CENTRO', 'ZONA_SUR', 'ZONA_ESTE', 'ZONA_OESTE'];
        $departamentos = ['VENTAS', 'COMPRAS', 'LOGISTICA', 'ALMACEN', 'CONTABILIDAD'];
        $sucursales = ['SUC_001', 'SUC_002', 'SUC_003', 'SUC_004', 'SUC_005'];
        $centrosDistribucion = ['CD_NORTE', 'CD_CENTRO', 'CD_SUR'];

        $count = 0;

        foreach ($users as $index => $user) {
            echo "\n📝 Procesando usuario: {$user->name} ({$user->usernick})\n";

            // Asignar zona primaria
            try {
                $zona = $zonas[$index % count($zonas)];
                $abacService->asignarAtributo($user, 'zona', $zona, [
                    'is_primary' => true,
                    'description' => "Zona de venta asignada para {$user->name}",
                    'valid_from' => now(),
                    'valid_until' => now()->addYear(),
                ]);
                echo "   ✓ Zona: {$zona}\n";
                $count++;
            } catch (\Exception $e) {
                echo "   ✗ Error asignando zona: " . $e->getMessage() . "\n";
            }

            // Asignar departamento primario
            try {
                $departamento = $departamentos[$index % count($departamentos)];
                $abacService->asignarAtributo($user, 'departamento', $departamento, [
                    'is_primary' => true,
                    'description' => "Departamento asignado para {$user->name}",
                ]);
                echo "   ✓ Departamento: {$departamento}\n";
                $count++;
            } catch (\Exception $e) {
                echo "   ✗ Error asignando departamento: " . $e->getMessage() . "\n";
            }

            // Asignar sucursal primaria
            try {
                $sucursal = $sucursales[$index % count($sucursales)];
                $abacService->asignarAtributo($user, 'sucursal', $sucursal, [
                    'is_primary' => true,
                    'description' => "Sucursal asignada para {$user->name}",
                ]);
                echo "   ✓ Sucursal: {$sucursal}\n";
                $count++;
            } catch (\Exception $e) {
                echo "   ✗ Error asignando sucursal: " . $e->getMessage() . "\n";
            }

            // Si es manager, asignar múltiples zonas
            if ($user->hasRole('Manager')) {
                try {
                    $zona2 = $zonas[($index + 1) % count($zonas)];
                    $zona3 = $zonas[($index + 2) % count($zonas)];

                    $abacService->asignarAtributo($user, 'zona', $zona2, [
                        'is_primary' => false,
                        'priority' => 5,
                        'description' => "Zona secundaria 1 para manager {$user->name}",
                    ]);
                    echo "   ✓ Zona secundaria: {$zona2}\n";

                    $abacService->asignarAtributo($user, 'zona', $zona3, [
                        'is_primary' => false,
                        'priority' => 1,
                        'description' => "Zona secundaria 2 para manager {$user->name}",
                    ]);
                    echo "   ✓ Zona secundaria: {$zona3}\n";
                    $count += 2;
                } catch (\Exception $e) {
                    echo "   ✗ Error asignando zonas secundarias: " . $e->getMessage() . "\n";
                }
            }

            // Si es Super Admin o Admin, asignar todos los centros de distribución
            if ($user->hasRole(['Super Admin', 'Admin'])) {
                try {
                    foreach ($centrosDistribucion as $cd) {
                        $abacService->asignarAtributo($user, 'centro_distribucion', $cd, [
                            'is_primary' => $cd === $centrosDistribucion[0],
                            'priority' => count($centrosDistribucion) - array_search($cd, $centrosDistribucion),
                        ]);
                    }
                    echo "   ✓ Centros de distribución: " . implode(', ', $centrosDistribucion) . "\n";
                    $count += count($centrosDistribucion);
                } catch (\Exception $e) {
                    echo "   ✗ Error asignando centros de distribución: " . $e->getMessage() . "\n";
                }
            }
        }

        echo "\n✅ Asignación completada!\n";
        echo "   Total de atributos asignados: {$count}\n";
        echo "   Usuarios procesados: " . $users->count() . "\n\n";
    }
}
