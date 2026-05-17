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
        Schema::create('adicionales_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')
                ->constrained('productos')
                ->onDelete('cascade')
                ->comment('Producto base (comida/helado)');

            $table->string('nombre')
                ->comment('Nombre del adicional (ej: Leche, Chocolate)');

            $table->text('descripcion')
                ->nullable()
                ->comment('Descripción del adicional');

            $table->decimal('precio_adicional', 10, 2)
                ->default(0)
                ->comment('Precio a sumar al producto base');

            $table->integer('orden')
                ->default(0)
                ->comment('Orden de visualización');

            $table->boolean('activo')
                ->default(true)
                ->comment('Estado del adicional');

            $table->timestamps();

            $table->index(['producto_id', 'activo'], 'idx_adicionales_producto_activo');
            $table->index('orden', 'idx_adicionales_orden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adicionales_producto');
    }
};
