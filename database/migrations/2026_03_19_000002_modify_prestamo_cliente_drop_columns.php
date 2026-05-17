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
            // Quitar constraint a prestables
            $table->dropForeign(['prestable_id']);
            // Quitar columnas que se movieron a detalle
            $table->dropColumn(['prestable_id', 'cantidad', 'precio_unitario', 'precio_prestamo']);
            // Agregar observaciones
            $table->text('observaciones')->nullable()->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            // Re-agregar columnas (nullable para rollback seguro)
            $table->foreignId('prestable_id')->nullable()->after('id')->constrained('prestables')->onDelete('restrict');
            $table->integer('cantidad')->default(0)->after('chofer_id');
            $table->decimal('precio_unitario', 12, 2)->nullable()->after('cantidad');
            $table->decimal('precio_prestamo', 12, 2)->nullable()->after('precio_unitario');
            // Quitar observaciones
            $table->dropColumn('observaciones');
        });
    }
};
