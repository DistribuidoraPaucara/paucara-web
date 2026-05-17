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
        Schema::table('proformas', function (Blueprint $table) {
            // Eliminar columnas innecesarias/redundantes

            // cliente_app_id es redundante con cliente_id
            if (Schema::hasColumn('proformas', 'cliente_app_id')) {
                $table->dropColumn('cliente_app_id');
            }

            // ubicacion_entrega es redundante con direccion_entrega_solicitada_id
            if (Schema::hasColumn('proformas', 'ubicacion_entrega')) {
                $table->dropColumn('ubicacion_entrega');
            }

            // idempotency_key no se está usando en el sistema
            if (Schema::hasColumn('proformas', 'idempotency_key')) {
                $table->dropColumn('idempotency_key');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            // Agregar nuevamente las columnas eliminadas si se hace rollback
            $table->unsignedBigInteger('cliente_app_id')->nullable();
            $table->string('ubicacion_entrega')->nullable();
            $table->string('idempotency_key')->nullable()->unique();
        });
    }
};
