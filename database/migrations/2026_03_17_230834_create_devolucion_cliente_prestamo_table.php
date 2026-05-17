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
        Schema::create('devolucion_cliente_prestamo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_cliente_id')->constrained('prestamo_cliente')->onDelete('restrict');
            $table->integer('cantidad_devuelta'); // cantidad en buen estado
            $table->integer('cantidad_dañada_parcial')->default(0); // con daño reparable
            $table->integer('cantidad_dañada_total')->default(0); // inutilizable
            $table->decimal('monto_cobrado_daño', 12, 2)->default(0); // total a cobrar por daño
            $table->decimal('monto_garantia_devuelta', 12, 2)->default(0); // garantía devuelta (si no hay daño)
            $table->text('observaciones')->nullable(); // motivos del daño, etc
            $table->foreignId('chofer_id')->nullable()->constrained('users')->onDelete('set null'); // quien recibe
            $table->date('fecha_devolucion');
            $table->timestamps();

            // Índices
            $table->index(['prestamo_cliente_id']);
            $table->index(['chofer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_cliente_prestamo');
    }
};
