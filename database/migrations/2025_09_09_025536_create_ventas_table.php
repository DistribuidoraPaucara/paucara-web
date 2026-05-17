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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->date('fecha');
            $table->decimal('subtotal', 15, 2);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('impuesto', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->text('observaciones')->nullable();
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->foreignId('usuario_id')->constrained('users');
            $table->foreignId('estado_documento_id')->constrained('estados_documento');
            $table->foreignId('moneda_id')->constrained('monedas');
            $table->foreignId('tipo_pago_id')->nullable()->constrained('tipos_pago');
            $table->foreignId('proforma_id')->nullable()->constrained('proformas');
            // Campos para el flujo con app externa
            $table->boolean('requiere_envio')->default(false);
            $table->enum('canal_origen', ['APP_EXTERNA', 'WEB', 'PRESENCIAL'])
                ->default('WEB');
            $table->enum('estado_logistico', ['PENDIENTE_ENVIO', 'PREPARANDO', 'ENVIADO', 'ENTREGADO'])
                ->nullable();
            $table->timestamps();

            // Índices para optimización
            $table->index(['canal_origen', 'created_at']);
            $table->index(['estado_logistico', 'created_at']);
            $table->index('requiere_envio');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
