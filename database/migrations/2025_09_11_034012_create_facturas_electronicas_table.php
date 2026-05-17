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
        Schema::create('facturas_electronicas', function (Blueprint $table) {
            $table->id();
            $table->string('cuf', 50)->unique(); // Código Único de Factura
            $table->string('numero_factura');
            $table->string('nit_emisor');
            $table->date('fecha_emision');
            $table->time('hora_emision');
            $table->decimal('monto_total', 15, 2);
            $table->decimal('monto_total_sujeto_iva', 15, 2)->default(0);
            $table->decimal('monto_total_moneda_extranjera', 15, 2)->default(0);
            $table->decimal('tipo_cambio', 10, 4)->default(1);
            $table->integer('codigo_moneda')->default(1); // 1=BOB, 2=USD, etc.
            $table->string('codigo_punto_venta');
            $table->enum('modalidad', ['online', 'offline', 'masiva'])->default('online');
            $table->enum('tipo_emision', ['linea', 'fuera_linea', 'contingencia'])->default('linea');
            $table->enum('tipo_factura_documento', ['factura', 'factura_compra_venta', 'nota_conciliacion', 'factura_especial'])->default('factura');
            $table->enum('estado', ['vigente', 'anulada', 'observada'])->default('vigente');
            $table->string('codigo_recepcion')->nullable(); // Respuesta del SIN
            $table->text('xml_firmado')->nullable();        // XML de la factura firmada
            $table->text('respuesta_sin')->nullable();      // Respuesta completa del SIN
            $table->timestamp('fecha_envio_sin')->nullable();
            $table->timestamp('fecha_procesamiento_sin')->nullable();
            $table->text('observaciones_sin')->nullable(); // En caso de observaciones
            $table->foreignId('venta_id')->constrained('ventas');
            $table->timestamps();

            // Índices para búsquedas y reportes
            $table->index(['fecha_emision', 'estado']);
            $table->index('codigo_recepcion');
            $table->index('nit_emisor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas_electronicas');
    }
};
