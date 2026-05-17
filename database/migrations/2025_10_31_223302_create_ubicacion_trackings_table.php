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
        Schema::create('ubicacion_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entrega_id')->constrained('entregas')->onDelete('cascade');
            $table->foreignId('chofer_id')->nullable()->constrained('choferes_legacy');

            $table->decimal('latitud', 10, 7);
            $table->decimal('longitud', 10, 7);
            $table->decimal('altitud', 8, 2)->nullable();
            $table->decimal('precision', 8, 2)->nullable();
            $table->decimal('velocidad', 6, 2)->nullable();
            $table->decimal('rumbo', 6, 2)->nullable();

            $table->timestamp('timestamp');
            $table->enum('evento', ['inicio_ruta', 'llegada', 'entrega'])->nullable();

            $table->timestamps();

            // Índices para performance
            $table->index('entrega_id');
            $table->index('timestamp');
            $table->index('chofer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ubicacion_trackings');
    }
};
