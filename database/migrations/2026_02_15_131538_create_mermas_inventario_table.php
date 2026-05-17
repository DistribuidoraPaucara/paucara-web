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
        Schema::create('mermas_inventario', function (Blueprint $table) {
            $table->id();

            // Número único de merma: MERMA20260215-0001
            $table->string('numero')->unique();

            // Relaciones
            $table->foreignId('almacen_id')->constrained('almacenes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // tipo_merma_id se almacena como string en movimientos_inventario, así que aquí solo es referencia
            $table->string('tipo_merma')->nullable()->comment('Referencia al tipo de merma (ej: MERMA_ROTURA, MERMA_VENCIMIENTO)');

            // Sumatorias
            $table->integer('cantidad_productos')->default(0); // Cantidad de productos diferentes
            $table->decimal('costo_total', 12, 2)->default(0); // Costo total de la merma

            // Datos adicionales
            $table->text('observacion')->nullable();
            $table->enum('estado', ['pendiente', 'procesado'])->default('procesado');

            // Auditoría
            $table->timestamps();

            // Índices
            $table->index('almacen_id');
            $table->index('user_id');
            $table->index('estado');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mermas_inventario');
    }
};
