<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModuloSidebar>
 */
class ModuloSidebarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => $this->faker->words(2, true),
            'ruta' => '/'.$this->faker->slug(),
            'icono' => $this->faker->randomElement(['Package', 'Boxes', 'Users', 'Settings', 'ShoppingCart']),
            'descripcion' => $this->faker->sentence(),
            'orden' => $this->faker->numberBetween(1, 10),
            'activo' => true,
            'es_submenu' => false,
            'modulo_padre_id' => null,
            'permisos' => null,
            'color' => null,
            'categoria' => $this->faker->randomElement(['Inventario', 'Comercial', 'Finanzas']),
            'visible_dashboard' => true,
        ];
    }
}
