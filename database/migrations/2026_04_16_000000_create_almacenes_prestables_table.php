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
        Schema::create('almacenes_prestables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')
                ->nullable()
                ->constrained('empresas')
                ->cascadeOnDelete();
            $table->string('nombre')->unique();
            $table->string('direccion')->nullable();
            $table->string('ubicacion_fisica')->nullable()
                ->comment('Identifica la ubicación física compartida (ej: "SEDE_PRINCIPAL", "SUCURSAL_NORTE")');
            $table->boolean('requiere_transporte_externo')->default(false)
                ->comment('Indica si este almacén requiere transporte externo para transferencias');
            $table->string('responsable')->nullable();
            $table->string('telefono')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índices
            $table->index('empresa_id');
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('almacenes_prestables');
    }
};
