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
        Schema::create('prestamos_vendidos', function (Blueprint $table) {
            $table->id();

            // Referencias
            $table->string('numero_venta')->unique()->index();
            $table->foreignId('cliente_id')->nullable()->index()->constrained('clientes')->nullOnDelete();
            $table->foreignId('usuario_id')->index()->constrained('users')->onDelete('cascade');

            // Estado
            $table->enum('estado', ['BORRADOR', 'CONFIRMADA', 'CANCELADA'])->default('BORRADOR')->index();

            // Montos
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('iva', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);

            // Información de la venta
            $table->text('observaciones')->nullable();
            $table->text('motivo_cancelacion')->nullable();

            // Auditoría
            $table->ipAddress('ip_usuario')->nullable();
            $table->string('user_agent')->nullable();

            // Fechas importantes
            $table->timestamp('fecha_venta')->useCurrent();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->timestamp('fecha_cancelacion')->nullable();
            $table->index('fecha_venta');

            $table->timestamps();
        });

        Schema::create('prestamos_vendidos_detalles', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('prestamo_vendido_id')->index()->constrained('prestamos_vendidos')->cascadeOnDelete();
            $table->foreignId('prestable_id')->index()->constrained('prestables')->cascadeOnDelete();
            $table->foreignId('almacen_id')->index()->constrained('almacenes')->onDelete('cascade');

            // Cantidad y precios
            $table->integer('cantidad')->unsigned()->default(1);
            $table->decimal('precio_unitario', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);

            // Auditoría del detalle
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos_vendidos_detalles');
        Schema::dropIfExists('prestamos_vendidos');
    }
};
