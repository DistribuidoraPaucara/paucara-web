<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('direcciones_cliente', function (Blueprint $table) {
            $table->foreignId('localidad_id')->nullable()->after('cliente_id')->constrained('localidades')->onDelete('set null');
        });

        // Migrar datos existentes: copiar localidad_id del cliente a sus direcciones
        // Sintaxis compatible con PostgreSQL y MySQL
        DB::statement('
            UPDATE direcciones_cliente
            SET localidad_id = clientes.localidad_id
            FROM clientes
            WHERE direcciones_cliente.cliente_id = clientes.id
            AND clientes.localidad_id IS NOT NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('direcciones_cliente', function (Blueprint $table) {
            $table->dropForeign(['localidad_id']);
            $table->dropColumn('localidad_id');
        });
    }
};
