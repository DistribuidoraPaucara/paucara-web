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
        Schema::create('modulo_audits', function (Blueprint $table) {
            $table->id();
            // Sin foreign key en modulo_id para permitir historial independiente
            $table->unsignedBigInteger('modulo_id')->nullable()->index();
            $table->foreignId('usuario_id')
                ->nullable()
                ->constrained('users')
                ->setOnDelete('set null');
            $table->enum('accion', ['creado', 'actualizado', 'eliminado'])->default('actualizado');
            $table->json('datos_anteriores')->nullable();
            $table->json('datos_nuevos')->nullable();
            $table->timestamps();

            // Índices para optimizar búsquedas
            $table->index(['modulo_id', 'accion']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulo_audits');
    }
};
