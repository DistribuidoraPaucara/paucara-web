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
        Schema::create('ajustes_stock_prestables', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('cascade');
            $table->foreignId('prestable_stock_id')->constrained('prestable_stock')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');

            // Valores antes del ajuste
            $table->integer('cantidad_disponible_antes')->default(0);
            $table->integer('cantidad_en_prestamo_cliente_antes')->default(0);
            $table->integer('cantidad_en_prestamo_proveedor_antes')->default(0);
            $table->integer('cantidad_vendida_antes')->default(0);

            // Valores después del ajuste
            $table->integer('cantidad_disponible_despues')->default(0);
            $table->integer('cantidad_en_prestamo_cliente_despues')->default(0);
            $table->integer('cantidad_en_prestamo_proveedor_despues')->default(0);
            $table->integer('cantidad_vendida_despues')->default(0);

            // Información del ajuste
            $table->string('motivo')->nullable();
            $table->text('comentarios')->nullable();
            $table->enum('tipo_ajuste', ['edicion_directa', 'ajuste_relativo'])->default('ajuste_relativo');

            // Auditoría
            $table->ipAddress('ip_usuario')->nullable();
            $table->string('user_agent')->nullable();

            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('prestable_id');
            $table->index('almacen_id');
            $table->index('usuario_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajustes_stock_prestables');
    }
};
