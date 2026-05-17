<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campo created_by para registrar quién creó la entrega
     * Esto permite notificar al creador de cambios de estado
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->after('chofer_id')
                ->comment('Usuario que creó la entrega');

            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropIndex(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
