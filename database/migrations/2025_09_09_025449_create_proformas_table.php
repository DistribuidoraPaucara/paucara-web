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
        Schema::create('proformas', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->date('fecha');
            $table->date('fecha_vencimiento')->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('impuesto', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->text('observaciones')->nullable();
            $table->text('observaciones_rechazo')->nullable();
            // Estados para el flujo con app externa
            $table->enum('estado', ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CONVERTIDA', 'VENCIDA'])
                ->default('PENDIENTE');
            // Canal de origen
            $table->enum('canal_origen', ['APP_EXTERNA', 'WEB', 'PRESENCIAL'])
                ->default('WEB');
            // Usuarios del proceso
            $table->foreignId('usuario_creador_id')->nullable()->constrained('users');
            $table->foreignId('usuario_aprobador_id')->nullable()->constrained('users');
            $table->timestamp('fecha_aprobacion')->nullable();
            // Usuarios del proceso
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->foreignId('moneda_id')->constrained('monedas');
            $table->string('cliente_app_id')->nullable();
            $table->json('ubicacion_entrega')->nullable();
            $table->json('contacto_entrega')->nullable();
            $table->timestamp('fecha_respuesta')->nullable();
            $table->text('comentario_aprobacion')->nullable();
            $table->text('comentario_rechazo')->nullable();
            $table->foreignId('aprobado_por')->nullable();
            $table->timestamps();
            // Índices
            $table->index('cliente_app_id');
            $table->index(['canal_origen', 'estado']);

            // Índices para optimización
            $table->index(['estado', 'fecha']);
            $table->index(['cliente_id', 'estado']);
            $table->index('canal_origen');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proformas');
    }
};
