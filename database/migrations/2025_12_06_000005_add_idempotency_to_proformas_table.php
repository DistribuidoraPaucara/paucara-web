<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar idempotency_key a proformas para evitar duplicados
     * cuando hay doble click o reintentos de la app
     */
    public function up(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            // Idempotency key: evita duplicados
            // Ejemplo: "42_1736000000123" (cliente_id_timestamp)
            $table->string('idempotency_key', 100)
                ->nullable()
                ->after('numero')
                ->unique()
                ->comment('Clave de idempotencia para evitar duplicados');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            $table->dropUnique(['idempotency_key']);
            $table->dropColumn('idempotency_key');
        });
    }
};
