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
        Schema::table('estados_documento', function (Blueprint $table) {
            $table->foreignId('estado_anterior_id')
                ->nullable()
                ->after('icono')
                ->constrained('estados_documento')
                ->cascadeOnDelete();

            $table->foreignId('estado_siguiente_id')
                ->nullable()
                ->after('estado_anterior_id')
                ->constrained('estados_documento')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estados_documento', function (Blueprint $table) {
            $table->dropForeignIdFor('estados_documento', 'estado_anterior_id');
            $table->dropColumn('estado_anterior_id');

            $table->dropForeignIdFor('estados_documento', 'estado_siguiente_id');
            $table->dropColumn('estado_siguiente_id');
        });
    }
};
