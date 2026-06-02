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
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->foreignId('almacenes_prestables_id')->nullable()->after('cliente_id')->constrained('almacenes_prestables')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->dropForeign(['almacenes_prestables_id']);
            $table->dropColumn('almacenes_prestables_id');
        });
    }
};
