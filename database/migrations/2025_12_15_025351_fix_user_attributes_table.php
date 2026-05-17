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
        // Crear tabla si no existe
        if (!Schema::hasTable('user_attributes')) {
            Schema::create('user_attributes', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->comment('Usuario propietario del atributo');
                $table->string('attribute_type')->comment('Tipo: zona, departamento, sucursal, región, zona_venta');
                $table->string('attribute_value')->comment('Valor del atributo (ej: "ZONA_NORTE", "SUCURSAL_1")');
                $table->text('description')->nullable()->comment('Descripción del atributo');
                $table->boolean('is_primary')->default(false)->comment('Si es el atributo principal de este tipo');
                $table->integer('priority')->default(0)->comment('Prioridad (para múltiples atributos del mismo tipo)');
                $table->timestamp('valid_from')->nullable()->comment('Desde cuándo es válido');
                $table->timestamp('valid_until')->nullable()->comment('Hasta cuándo es válido');
                $table->timestamps();

                // Índices
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
                $table->unique(['user_id', 'attribute_type', 'attribute_value']);
                $table->index(['attribute_type', 'attribute_value']);
                $table->index(['user_id', 'attribute_type']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_attributes');
    }
};
