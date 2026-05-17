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
        Schema::table('empleados', function (Blueprint $table) {
            // ✅ NUEVO: Agregar empresa_id para tener referencia directa a la empresa
            $table->foreignId('empresa_id')
                ->nullable()
                ->after('user_id')
                ->constrained('empresas')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            // Índice para optimizar consultas por empresa
            $table->index('empresa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropForeignKeyIfExists('empleados_empresa_id_foreign');
            $table->dropIndex('empleados_empresa_id_index');
            $table->dropColumn('empresa_id');
        });
    }
};
