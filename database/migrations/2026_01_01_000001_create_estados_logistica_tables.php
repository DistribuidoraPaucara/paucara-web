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
        // Tabla principal: estados_logistica
        Schema::create('estados_logistica', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('codigo', 50); // 'PENDIENTE', 'EN_TRANSITO', etc.
            $table->string('categoria', 50); // 'proforma', 'venta_logistica', 'entrega', 'vehiculo', 'pago'
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);

            // Atributos visuales
            $table->string('color', 7)->nullable(); // '#FFC107'
            $table->string('icono', 50)->nullable(); // 'clock', 'check-circle'

            // Metadata
            $table->boolean('es_estado_final')->default(false);
            $table->boolean('permite_edicion')->default(true);
            $table->boolean('requiere_aprobacion')->default(false);
            $table->json('metadatos')->nullable();

            $table->timestamps();

            // Índices y constraints
            $table->unique(['codigo', 'categoria']); // Unique per categoria
            $table->index(['categoria', 'activo']);
            $table->index(['categoria', 'orden']);
        });

        // Tabla: transiciones_estado - Define transiciones válidas entre estados
        Schema::create('transiciones_estado', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('estado_origen_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('cascade');
            $table->foreignId('estado_destino_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('cascade');
            $table->string('categoria', 50); // 'proforma', 'entrega', etc.

            $table->string('requiere_permiso', 100)->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('automatica')->default(false); // Transición automática vs manual
            $table->boolean('notificar')->default(true); // Enviar notificaciones
            $table->boolean('activa')->default(true);

            $table->timestamps();

            // Índices
            $table->unique(['estado_origen_id', 'estado_destino_id', 'categoria']);
            $table->index(['estado_origen_id', 'activa']);
            $table->index('categoria');
        });

        // Tabla: mapeos_estado - Mapeos entre categorías (ej: entrega → venta)
        Schema::create('mapeos_estado', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('categoria_origen', 50); // 'entrega'
            $table->foreignId('estado_origen_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('cascade');
            $table->string('categoria_destino', 50); // 'venta_logistica'
            $table->foreignId('estado_destino_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('cascade');

            $table->integer('prioridad')->default(0);
            $table->boolean('activo')->default(true);
            $table->text('descripcion')->nullable();

            $table->timestamps();

            // Índices
            $table->unique(['categoria_origen', 'estado_origen_id', 'categoria_destino']);
            $table->index(['categoria_origen', 'estado_origen_id']);
        });

        // Tabla: historial_estados - Auditoría de cambios de estado
        Schema::create('historial_estados', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entidad_tipo', 50); // 'proforma', 'venta', 'entrega'
            $table->bigInteger('entidad_id'); // ID de la proforma/venta/entrega
            $table->foreignId('estado_anterior_id')
                ->nullable()
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('set null');
            $table->foreignId('estado_nuevo_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('restrict');

            $table->foreignId('usuario_id')
                ->nullable()
                ->references('id')
                ->on('users')
                ->onDelete('set null');
            $table->text('motivo')->nullable();
            $table->text('observaciones')->nullable();
            $table->json('metadatos')->nullable();

            $table->timestamp('created_at')->useCurrent();

            // Índices
            $table->index(['entidad_tipo', 'entidad_id']);
            $table->index('created_at');
            $table->index('usuario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_estados');
        Schema::dropIfExists('mapeos_estado');
        Schema::dropIfExists('transiciones_estado');
        Schema::dropIfExists('estados_logistica');
    }
};
