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
        Schema::create('libro_ventas_iva', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->string('numero_factura');
            $table->string('numero_autorizacion')->nullable();
            $table->string('nit_ci_cliente');
            $table->string('razon_social_cliente');
            $table->decimal('importe_total', 15, 2);
            $table->decimal('importe_ice', 15, 2)->default(0);       // Impuesto a Consumos Específicos
            $table->decimal('importe_iehd', 15, 2)->default(0);      // Impuesto Especial Hidrocarburos y Derivados
            $table->decimal('importe_ipj', 15, 2)->default(0);       // Impuesto a los Premios de Juegos
            $table->decimal('tasas', 15, 2)->default(0);             // Otras tasas
            $table->decimal('importe_gift_card', 15, 2)->default(0); // Gift Cards
            $table->decimal('descuentos', 15, 2)->default(0);
            $table->decimal('importe_base_cf', 15, 2)->default(0); // Base para Crédito Fiscal
            $table->decimal('credito_fiscal', 15, 2)->default(0);  // IVA - Crédito Fiscal
            $table->enum('estado_factura', ['vigente', 'anulada'])->default('vigente');
            $table->string('codigo_control')->nullable(); // Para facturas computarizadas
            $table->foreignId('venta_id')->constrained('ventas');
            $table->foreignId('tipo_documento_id')->constrained('tipos_documento');
            $table->timestamps();

            // Índices para reportes tributarios
            $table->index(['fecha', 'estado_factura']);
            $table->index('numero_autorizacion');
            $table->index('nit_ci_cliente');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('libro_ventas_iva');
    }
};
