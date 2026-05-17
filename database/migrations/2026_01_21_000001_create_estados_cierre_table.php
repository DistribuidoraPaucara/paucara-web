<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estados_cierre', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->unique();
            $table->string('nombre', 100);
            $table->string('descripcion')->nullable();
            $table->string('color', 20)->default('gray'); // Para UI
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('codigo');
            $table->index('activo');
        });

        // Insertar estados iniciales
        DB::table('estados_cierre')->insert([
            [
                'codigo' => 'PENDIENTE',
                'nombre' => 'Pendiente de Verificación',
                'descripcion' => 'El cierre está pendiente de revisión por el administrador',
                'color' => 'yellow',
                'orden' => 1,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'codigo' => 'CONSOLIDADA',
                'nombre' => 'Consolidada',
                'descripcion' => 'El cierre ha sido aprobado y consolidado',
                'color' => 'green',
                'orden' => 2,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'codigo' => 'RECHAZADA',
                'nombre' => 'Rechazada',
                'descripcion' => 'El cierre ha sido rechazado y requiere corrección',
                'color' => 'red',
                'orden' => 3,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'codigo' => 'CORREGIDA',
                'nombre' => 'Corregida',
                'descripcion' => 'El cierre rechazado ha sido corregido',
                'color' => 'blue',
                'orden' => 4,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estados_cierre');
    }
};
