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
        // Solo crear la tabla si no existe
        if (!Schema::hasTable('tipo_operaciones')) {
            Schema::create('tipo_operaciones', function (Blueprint $table) {
                $table->id();

                // Identificadores
                $table->string('clave', 50)->unique(); // ENTRADA_AJUSTE, SALIDA_VENTA, etc
                $table->string('label', 150); // "Entrada por Ajuste", "Salida por Venta"

                // Dirección del movimiento
                $table->enum('direccion', ['entrada', 'salida']); // entrada o salida

                // Tipos de motivo requeridos
                $table->string('requiere_tipo_motivo', 50)->nullable(); // 'tipo_ajuste', 'tipo_merma', NULL
                $table->boolean('requiere_proveedor')->default(false); // Para ENTRADA_COMPRA
                $table->boolean('requiere_cliente')->default(false); // Para SALIDA_VENTA

                // Metadatos
                $table->text('descripcion')->nullable();
                $table->boolean('activo')->default(true);

                // Auditoria
                $table->timestamps();

                // Índices
                $table->index('clave');
                $table->index('activo');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Solo eliminar si existe
        if (Schema::hasTable('tipo_operaciones')) {
            Schema::dropIfExists('tipo_operaciones');
        }
    }
};
