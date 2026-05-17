<?php
namespace App\Console\Commands;

use App\Enums\TipoEmpleado;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class RegistrarNuevoRolEmpleado extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'empleados:registrar-rol
                            {nombre : Nombre del nuevo rol}
                            {--trait= : Trait asociado al rol (opcional)}
                            {--campos=* : Campos adicionales para el rol en formato campo:regla}
                            {--crear-trait : Crear un nuevo trait para el rol}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Registra un nuevo rol para empleados en el sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $nombreRol = $this->argument('nombre');

        // Verificar si el rol ya existe
        if (Role::where('name', $nombreRol)->exists()) {
            $this->error("El rol '{$nombreRol}' ya existe en el sistema.");
            return 1;
        }

        // Crear el rol
        $role = Role::create(['name' => $nombreRol, 'guard_name' => 'web']);
        $this->info("Rol '{$nombreRol}' creado exitosamente.");

        // Limpiar caché de roles
        TipoEmpleado::limpiarCache();
        $this->info("Caché de roles limpiada.");

        // Crear un trait si se solicitó
        if ($this->option('crear-trait')) {
            $this->crearTrait($nombreRol);
        } elseif ($this->option('trait')) {
            $this->info("Trait asociado: {$this->option('trait')}");
            // Aquí podrías agregar el trait a una configuración o base de datos
        }

        // Registrar campos adicionales
        if ($this->option('campos')) {
            $this->registrarCamposAdicionales($nombreRol, $this->option('campos'));
        }

        return 0;
    }

    /**
     * Crea un nuevo trait para el rol
     */
    protected function crearTrait(string $nombreRol)
    {
        $nombreTrait = str_replace(' ', '', $nombreRol) . 'Trait';
        $rutaTrait   = app_path("Models/Traits/{$nombreTrait}.php");

        // Verificar si el trait ya existe
        if (file_exists($rutaTrait)) {
            $this->error("El trait '{$nombreTrait}' ya existe.");
            return;
        }

        // Crear el contenido del trait
        $contenido = $this->generarContenidoTrait($nombreRol, $nombreTrait);

        // Crear el archivo del trait
        if (! is_dir(dirname($rutaTrait))) {
            mkdir(dirname($rutaTrait), 0755, true);
        }

        file_put_contents($rutaTrait, $contenido);

        $this->info("Trait '{$nombreTrait}' creado en {$rutaTrait}");

        // Sugerir actualizar la configuración de traits
        $this->info("Para asociar este trait con el rol, actualice el método traitsAsociados() en la clase TipoEmpleado.");
        $this->line("Agregue la siguiente línea:");
        $this->line("'{$nombreRol}' => 'App\\Models\\Traits\\{$nombreTrait}',");
    }

    /**
     * Genera el contenido para un nuevo trait
     */
    protected function generarContenidoTrait(string $nombreRol, string $nombreTrait): string
    {
        $nombreRolVariable = str_replace(' ', '', strtolower($nombreRol));

        return <<<PHP
<?php
namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * Trait para empleados con rol de {$nombreRol}
 */
trait {$nombreTrait}
{
    /**
     * Verifica si el empleado tiene el rol {$nombreRol}
     */
    public function es{$nombreTrait}(): bool
    {
        return \$this->user && \$this->user->hasRole('{$nombreRol}');
    }

    /**
     * Ejemplo de método específico para {$nombreRol}
     * Personalice este método según las necesidades del rol
     */
    public function funcionesDe{$nombreTrait}(): array
    {
        return [
            'función_1',
            'función_2',
            'función_3',
        ];
    }

    /**
     * Método específico para {$nombreRol}
     * Implementación de ejemplo
     */
    public function accion{$nombreTrait}(\$param = null)
    {
        if (!\$this->es{$nombreTrait}()) {
            return null;
        }

        // Implementación de la acción
        return "Acción ejecutada para {$nombreRol} con parámetro: " . \$param;
    }
}
PHP;
    }

    /**
     * Registra campos adicionales para el rol
     */
    protected function registrarCamposAdicionales(string $nombreRol, array $campos)
    {
        $this->info("Campos adicionales para el rol '{$nombreRol}':");

        foreach ($campos as $campo) {
            list($nombreCampo, $regla) = explode(':', $campo);
            $this->line("- {$nombreCampo}: {$regla}");
        }

        $this->info("Para configurar estos campos, actualice el método conCamposAdicionales() en la clase TipoEmpleado.");
    }
}
