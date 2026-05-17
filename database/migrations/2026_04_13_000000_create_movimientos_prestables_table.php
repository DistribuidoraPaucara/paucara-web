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
        Schema::create('movimientos_prestables', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('prestable_stock_id')->index()->constrained('prestable_stock')->onDelete('cascade');
            $table->foreignId('almacen_id')->index()->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('usuario_id')->index()->constrained('users')->onDelete('cascade');

            // Tipos de movimiento
            $table->enum('tipo', [
                'AJUSTE_DIRECTO',
                'AJUSTE_RELATIVO',
                'ENTRADA',
                'SALIDA',
                'CONSUMO_RESERVA',
                'DISTRIBUCION_RESERVA',
                'LIBERACION_RESERVA',
            ])->index();

            // Cantidad del movimiento
            $table->integer('cantidad')->default(0);

            // Estados antes del movimiento
            $table->integer('disponible_anterior')->default(0);
            $table->integer('prestamo_cliente_anterior')->default(0);
            $table->integer('prestamo_proveedor_anterior')->default(0);
            $table->integer('vendida_anterior')->default(0);

            // Estados después del movimiento
            $table->integer('disponible_posterior')->default(0);
            $table->integer('prestamo_cliente_posterior')->default(0);
            $table->integer('prestamo_proveedor_posterior')->default(0);
            $table->integer('vendida_posterior')->default(0);

            // Información del movimiento
            $table->string('categoria_afectada')->nullable();
            $table->string('motivo')->nullable();
            $table->text('observaciones')->nullable();
            $table->string('numero_referencia')->nullable();

            // Referencias externas
            $table->string('referencia_tipo')->nullable();
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->index(['referencia_tipo', 'referencia_id']);

            // Auditoría
            $table->ipAddress('ip_usuario')->nullable();
            $table->string('user_agent')->nullable();

            // Soporte para anulación
            $table->boolean('anulado')->default(false)->index();
            $table->string('motivo_anulacion')->nullable();
            $table->foreignId('usuario_anulacion_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('fecha_anulacion')->nullable();

            // Soft deletes
            $table->softDeletes();

            // Timestamps
            $table->index('created_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_prestables');
    }
};
