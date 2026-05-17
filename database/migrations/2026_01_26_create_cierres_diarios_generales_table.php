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
        Schema::create('cierres_diarios_generales', function (Blueprint $table) {
            $table->id();

            // Usuario que ejecutó el cierre general
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete();

            // Información del cierre
            $table->datetime('fecha_ejecucion');

            // Resumen de la operación
            $table->integer('total_cajas_procesadas')->default(0);
            $table->integer('total_cajas_cerradas')->default(0);
            $table->integer('total_cajas_con_discrepancia')->default(0);
            $table->integer('cajas_sin_apertura')->default(0);

            // Montos
            $table->decimal('total_monto_esperado', 18, 2)->default(0);
            $table->decimal('total_monto_real', 18, 2)->default(0);
            $table->decimal('total_diferencias', 18, 2)->default(0);

            // Detalles (JSON con array de cajas procesadas)
            $table->json('detalle_cajas')->nullable();

            // Observaciones generales
            $table->text('observaciones')->nullable();

            // IP y User-Agent del admin que ejecutó
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            // Índices para búsquedas
            $table->index('usuario_id');
            $table->index('fecha_ejecucion');
            $table->index(['usuario_id', 'fecha_ejecucion']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cierres_diarios_generales');
    }
};
