<?php

namespace Database\Factories;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empleado>
 */
class EmpleadoFactory extends Factory
{
    protected $model = Empleado::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fechaIngreso = fake()->dateTimeBetween('-5 years', 'now');

        return [
            'user_id' => User::factory(),
            'codigo_empleado' => 'EMP-'.str_pad(fake()->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'ci' => fake()->unique()->numerify('########'),
            'telefono' => fake()->phoneNumber(),
            'direccion' => fake()->address(),
            'fecha_nacimiento' => fake()->dateTimeBetween('-65 years', '-18 years'),
            'genero' => fake()->randomElement(['M', 'F']),
            'estado_civil' => fake()->randomElement(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre']),
            'cargo' => fake()->randomElement([
                'Gerente General',
                'Gerente de Ventas',
                'Vendedor',
                'Cajero',
                'Almacenero',
                'Contador',
                'Asistente Administrativo',
                'Chofer',
                'Supervisor de Inventario',
            ]),
            'departamento' => fake()->randomElement([
                'Administración',
                'Ventas',
                'Inventario',
                'Contabilidad',
                'Logística',
                'Recursos Humanos',
            ]),
            'fecha_ingreso' => $fechaIngreso,
            'tipo_contrato' => fake()->randomElement(['indefinido', 'temporal', 'medio_tiempo']),
            'estado' => fake()->randomElement(['activo', 'activo', 'activo', 'inactivo']), // Más probabilidad de activo
            'salario_base' => fake()->numberBetween(2500, 15000),
            'bonos' => fake()->numberBetween(0, 2000),
            'cuenta_bancaria' => fake()->numerify('################'),
            'banco' => fake()->randomElement(['Banco Nacional de Bolivia', 'Banco Mercantil Santa Cruz', 'Banco de Crédito', 'Banco Unión']),
            'contacto_emergencia_nombre' => fake()->name(),
            'contacto_emergencia_telefono' => fake()->phoneNumber(),
            'contacto_emergencia_relacion' => fake()->randomElement(['Esposo/a', 'Padre', 'Madre', 'Hermano/a', 'Hijo/a']),
            'puede_acceder_sistema' => fake()->boolean(70), // 70% de probabilidad de acceder al sistema
            'certificaciones' => fake()->randomElement([
                null,
                ['Licenciatura en Administración'],
                ['Técnico en Ventas', 'Curso de Atención al Cliente'],
                ['Certificación en Contabilidad'],
            ]),
            'horario_trabajo' => [
                'lunes' => '08:00-17:00',
                'martes' => '08:00-17:00',
                'miercoles' => '08:00-17:00',
                'jueves' => '08:00-17:00',
                'viernes' => '08:00-17:00',
                'sabado' => '08:00-12:00',
            ],
            'observaciones' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Estado para empleados activos
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activo',
        ]);
    }

    /**
     * Estado para empleados con acceso al sistema
     */
    public function conAccesoSistema(): static
    {
        return $this->state(fn (array $attributes) => [
            'puede_acceder_sistema' => true,
            'estado' => 'activo',
        ]);
    }

    /**
     * Estado para empleados supervisores
     */
    public function supervisor(): static
    {
        return $this->state(fn (array $attributes) => [
            'cargo' => fake()->randomElement(['Gerente General', 'Gerente de Ventas', 'Supervisor de Inventario']),
            'salario_base' => fake()->numberBetween(8000, 15000),
            'puede_acceder_sistema' => true,
            'estado' => 'activo',
        ]);
    }

    /**
     * Estado para empleados de ventas
     */
    public function vendedor(): static
    {
        return $this->state(fn (array $attributes) => [
            'cargo' => 'Vendedor',
            'departamento' => 'Ventas',
            'puede_acceder_sistema' => true,
            'estado' => 'activo',
        ]);
    }
}
