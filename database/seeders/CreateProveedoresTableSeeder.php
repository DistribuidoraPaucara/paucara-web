<?php

namespace Database\Seeders;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CreateProveedoresTableSeeder extends Seeder
{
    public function run(): void
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('razon_social')->nullable();
            $table->string('nit')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->string('direccion')->nullable();
            $table->string('contacto')->nullable();
            $table->boolean('activo')->default(true);
            $table->string('foto_perfil')->nullable();
            $table->string('ci_anverso')->nullable();
            $table->string('ci_reverso')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
        });
    }
}
