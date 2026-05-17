<?php

namespace Database\Seeders;

use App\Models\CategoriaCliente;
use Illuminate\Database\Seeder;

class CategoriaClienteSeeder extends Seeder
{
    public function run(): void
    {
        // Catálogo base de categorías de clientes
        $categorias = [
            [
                'clave' => 'VIP',
                'nombre' => 'VIP',
                'descripcion' => 'Cliente de alto valor (condiciones preferenciales)'.'',
                'activo' => true,
            ],
            [
                'clave' => 'MAYORISTA',
                'nombre' => 'Mayorista',
                'descripcion' => 'Compra en volumen o por bultos',
                'activo' => true,
            ],
            [
                'clave' => 'FRECUENTE',
                'nombre' => 'Frecuente',
                'descripcion' => 'Realiza compras de manera regular',
                'activo' => true,
            ],
            [
                'clave' => 'DEUDOR',
                'nombre' => 'Deudor',
                'descripcion' => 'Tiene cuentas por cobrar con saldo',
                'activo' => true,
            ],
            [
                'clave' => 'MOROSO',
                'nombre' => 'Moroso',
                'descripcion' => 'Presenta retrasos en sus pagos',
                'activo' => true,
            ],
            [
                'clave' => 'NUEVO',
                'nombre' => 'Nuevo',
                'descripcion' => 'Cliente recientemente registrado',
                'activo' => true,
            ],
            [
                'clave' => 'HORECA',
                'nombre' => 'HoReCa',
                'descripcion' => 'Hoteles, Restaurantes y Cafeterías',
                'activo' => true,
            ],
            [
                'clave' => 'APP',
                'nombre' => 'App',
                'descripcion' => 'Cliente que compra desde la app',
                'activo' => true,
            ],
        ];

        // Upsert por clave para no duplicar si se corre múltiples veces
        CategoriaCliente::query()->upsert($categorias, ['clave'], ['nombre', 'descripcion', 'activo', 'updated_at']);
    }
}
