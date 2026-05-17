<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ Crear tabla para registrar confirmaciones de entregas por venta
     * Permite:
     * - Múltiples fotos por venta
     * - Contexto de entrega (tienda abierta, cliente presente)
     * - Reintentos de entrega
     * - Auditoría completa
     */
    public function up(): void
    {
        Schema::create('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->bigIncrements('id');

            // ✅ Relaciones
            $table->foreignId('entrega_id')
                ->constrained('entregas')
                ->onDelete('cascade');
            $table->foreignId('venta_id')
                ->constrained('ventas')
                ->onDelete('cascade');

            // ✅ Datos de confirmación
            $table->string('firma_digital_url')->nullable();  // URL de firma
            $table->json('fotos')->nullable();                // Array de URLs de fotos
            $table->text('observaciones')->nullable();        // Notas del chofer

            // ✅ Contexto de entrega
            $table->boolean('tienda_abierta')->nullable();           // ¿Tienda estaba abierta?
            $table->boolean('cliente_presente')->nullable();         // ¿Cliente presente para recibir?
            $table->enum('motivo_rechazo', [
                'TIENDA_CERRADA',
                'CLIENTE_AUSENTE',
                'CLIENTE_RECHAZA',
                'DIRECCION_INCORRECTA',
                'CLIENTE_NO_IDENTIFICADO',
                'OTRO'
            ])->nullable();  // Razón si fue rechazado

            // ✅ FASE 1: Confirmación de Pago (venta por venta)
            $table->enum('estado_pago', [
                'PAGADO',
                'PARCIAL',
                'NO_PAGADO'
            ])->nullable();  // Estado del pago en la entrega
            $table->decimal('monto_recibido', 12, 2)->nullable();    // Dinero recibido del cliente
            $table->foreignId('tipo_pago_id')->nullable()            // FK a tipos_pago (Efectivo, Transferencia, etc)
                ->constrained('tipos_pago')
                ->onDelete('set null');
            $table->string('motivo_no_pago')->nullable();            // Motivo si NO pagó o pagó parcial

            // ✅ Auditoría
            $table->foreignId('confirmado_por')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');  // Usuario (chofer) que confirmó

            $table->timestamp('confirmado_en')->nullable();  // Cuándo se confirmó
            $table->timestamps();                            // created_at, updated_at

            // ✅ Índices
            $table->index(['entrega_id', 'venta_id']);
            $table->index('confirmado_por');
            $table->index('confirmado_en');
            $table->unique(['entrega_id', 'venta_id'], 'unique_entrega_venta');  // Una confirmación principal por venta
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregas_venta_confirmaciones');
    }
};
