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
        Schema::create('seguimiento_envios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('envio_id')->constrained('envios')->onDelete('cascade');
            $table->string('estado');
            $table->decimal('coordenadas_lat', 10, 8)->nullable();
            $table->decimal('coordenadas_lng', 11, 8)->nullable();
            $table->datetime('fecha_hora');
            $table->text('observaciones')->nullable();
            $table->string('foto')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->timestamps();

            // Índices
            $table->index(['envio_id', 'fecha_hora']);
            $table->index('fecha_hora');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seguimiento_envios');
    }
};
