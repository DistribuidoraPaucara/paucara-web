<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventanas_entrega_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            // 0 = domingo ... 6 = sábado
            $table->unsignedTinyInteger('dia_semana');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index(['cliente_id', 'dia_semana']);
            $table->unique(['cliente_id', 'dia_semana', 'hora_inicio', 'hora_fin'], 'ux_cliente_dia_hora');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventanas_entrega_cliente');
    }
};
