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
        Schema::create('compras_prestables', function (Blueprint $table) {
            $table->id();

            // Referencias
            $table->string('numero_compra')->unique()->index();
            $table->foreignId('proveedor_id')->nullable()->index()->constrained('proveedores')->nullOnDelete();
            $table->foreignId('usuario_id')->index()->constrained('users')->onDelete('cascade');

            // Estado
            $table->enum('estado', ['BORRADOR', 'CONFIRMADA', 'CANCELADA'])->default('BORRADOR')->index();

            // Montos
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('iva', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);

            // Información de la compra
            $table->text('observaciones')->nullable();
            $table->text('motivo_cancelacion')->nullable();

            // Auditoría
            $table->ipAddress('ip_usuario')->nullable();
            $table->string('user_agent')->nullable();

            // Fechas importantes
            $table->timestamp('fecha_compra')->useCurrent();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->timestamp('fecha_cancelacion')->nullable();
            $table->index('fecha_compra');

            $table->timestamps();
        });

        Schema::create('compra_prestable_detalles', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('compra_prestable_id')->index()->constrained('compras_prestables')->cascadeOnDelete();
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
        Schema::dropIfExists('compra_prestable_detalles');
        Schema::dropIfExists('compras_prestables');
    }
};
