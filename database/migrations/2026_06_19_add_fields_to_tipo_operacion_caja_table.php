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
        Schema::table('tipo_operacion_caja', function (Blueprint $table) {
            // Agregar descripción si no existe
            if (!Schema::hasColumn('tipo_operacion_caja', 'descripcion')) {
                $table->text('descripcion')->nullable()->after('nombre');
            }

            // Agregar dirección si no existe
            if (!Schema::hasColumn('tipo_operacion_caja', 'direccion')) {
                $table->string('direccion')->nullable()->after('descripcion');
            }

            // Agregar activo si no existe
            if (!Schema::hasColumn('tipo_operacion_caja', 'activo')) {
                $table->boolean('activo')->default(true)->after('direccion');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipo_operacion_caja', function (Blueprint $table) {
            $table->dropColumn(['descripcion', 'direccion', 'activo']);
        });
    }
};
