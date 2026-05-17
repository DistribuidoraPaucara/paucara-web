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
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->date('fecha');
            $table->string('numero_factura')->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('impuesto', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->text('observaciones')->nullable();
            $table->foreignId('proveedor_id')->constrained('proveedores');
            $table->foreignId('usuario_id')->constrained('users');
            $table->foreignId('estado_documento_id')->constrained('estados_documento');
            $table->foreignId('moneda_id')->constrained('monedas');
            $table->foreignId('tipo_pago_id')->nullable()->constrained('tipos_pago');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
