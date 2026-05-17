<?php
namespace Database\Seeders;

use App\Models\Caja;
use App\Models\User;
use Illuminate\Database\Seeder;

class CajaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea una caja individual para CADA usuario.
     * Esto permite que cualquier usuario (chofer, vendedor, gerente, etc.)
     * pueda tener su propia caja para manejar dinero.
     */
    public function run(): void
    {
        // Obtener todos los usuarios
        $usuarios = User::all();

        foreach ($usuarios as $usuario) {
            // Crear/actualizar caja para cada usuario
            Caja::updateOrCreate(
                ['user_id' => $usuario->id],
                [
                    'nombre'            => "Caja {$usuario->name}",
                    'ubicacion'         => $usuario->empleado?->ubicacion ?? 'Ruta',
                    'monto_inicial_dia' => 100.00, // Default inicial
                    'activa'            => true,
                ]
            );
        }

        $this->command->info("✅ {$usuarios->count()} cajas creadas exitosamente (1 por usuario)");
    }
}
