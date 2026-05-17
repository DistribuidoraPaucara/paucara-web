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
        Schema::table('cajas', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->after('id')
                ->nullable()
                ->constrained('users')
                ->onDelete('cascade');

            // Índice único: cada usuario puede tener máximo 1 caja
            $table->unique(['user_id']);

            $table->index('activa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cajas', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
            $table->dropIndex(['activa']);
            $table->dropForeignKey(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
