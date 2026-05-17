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
        Schema::create('entrega_estado_historials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entrega_id')->constrained('entregas')->onDelete('cascade');
            $table->foreignId('usuario_id')->nullable()->constrained('users');

            $table->string('estado_anterior')->nullable();
            $table->string('estado_nuevo');

            $table->text('comentario')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            // Índices
            $table->index('entrega_id');
            $table->index('usuario_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrega_estado_historials');
    }
};
