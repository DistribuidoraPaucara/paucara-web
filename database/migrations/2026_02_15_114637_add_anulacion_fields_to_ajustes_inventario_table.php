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
        Schema::table('ajustes_inventario', function (Blueprint $table) {
            $table->timestamp('fecha_anulacion')->nullable()->after('created_at');
            $table->foreignId('user_anulacion_id')->nullable()->after('fecha_anulacion')->constrained('users')->onDelete('set null');
            $table->text('motivo_anulacion')->nullable()->after('user_anulacion_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ajustes_inventario', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['user_anulacion_id']);
            $table->dropColumn(['fecha_anulacion', 'user_anulacion_id', 'motivo_anulacion']);
        });
    }
};
