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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Relación con usuario que recibe la notificación
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Tipo de notificación
            $table->string('type'); // proforma.creada, proforma.aprobada, etc.

            // Datos de la notificación (JSON)
            $table->json('data');

            // Si se ha leído o no
            $table->boolean('read')->default(false);
            $table->timestamp('read_at')->nullable();

            // Relación con proforma (opcional, si aplica)
            $table->foreignId('proforma_id')->nullable()->constrained('proformas')->onDelete('cascade');

            // Relación con venta (opcional, si aplica)
            $table->foreignId('venta_id')->nullable()->constrained('ventas')->onDelete('cascade');

            // Timestamps
            $table->timestamps();

            // Índices para queries rápidas
            $table->index(['user_id', 'read']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
