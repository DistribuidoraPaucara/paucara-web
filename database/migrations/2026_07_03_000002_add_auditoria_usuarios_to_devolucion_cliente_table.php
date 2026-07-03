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
        Schema::table('devolucion_cliente', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->after('chofer_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('anulada_por')
                ->nullable()
                ->after('created_by')
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('fecha_anulacion')
                ->nullable()
                ->after('anulada_por');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente', function (Blueprint $table) {
            $table->dropForeignIdFor('created_by');
            $table->dropForeignIdFor('anulada_por');
            $table->dropColumn(['created_by', 'anulada_por', 'fecha_anulacion']);
        });
    }
};
