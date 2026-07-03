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
        Schema::table('devolucion_proveedor', function (Blueprint $table) {
            $table->enum('estado', ['ACTIVA', 'ANULADA'])->default('ACTIVA')->after('chofer_id');

            $table->foreignId('created_by')
                ->nullable()
                ->after('estado')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('anulada_por')
                ->nullable()
                ->after('created_by')
                ->constrained('users')
                ->nullOnDelete();

            $table->text('razon_anulacion')
                ->nullable()
                ->after('anulada_por');

            $table->timestamp('fecha_anulacion')
                ->nullable()
                ->after('razon_anulacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_proveedor', function (Blueprint $table) {
            $table->dropForeignIdFor('created_by');
            $table->dropForeignIdFor('anulada_por');
            $table->dropColumn(['estado', 'created_by', 'anulada_por', 'razon_anulacion', 'fecha_anulacion']);
        });
    }
};
