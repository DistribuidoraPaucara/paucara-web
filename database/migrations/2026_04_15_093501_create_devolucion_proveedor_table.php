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
        Schema::create('devolucion_proveedor', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('prestamo_proveedor_id');
            $table->date('fecha_devolucion');
            $table->decimal('monto_cobrado_daño_total', 10, 2)->default(0);
            $table->decimal('monto_garantia_devuelta_total', 10, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->unsignedBigInteger('chofer_id')->nullable();
            $table->timestamps();

            // Relaciones
            $table->foreign('prestamo_proveedor_id')
                ->references('id')
                ->on('prestamo_proveedor')
                ->onDelete('cascade');

            // Comentado por ahora - ajustar según tabla real de choferes
            // $table->foreign('chofer_id')
            //     ->references('id')
            //     ->on('chofer')
            //     ->onDelete('set null');

            // Índices
            $table->index('prestamo_proveedor_id');
            $table->index('fecha_devolucion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_proveedor');
    }
};
