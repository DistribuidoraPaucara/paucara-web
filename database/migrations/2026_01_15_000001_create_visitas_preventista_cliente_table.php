<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitas_preventista_cliente', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('preventista_id')
                  ->constrained('empleados')
                  ->onDelete('cascade')
                  ->comment('Preventista que realiza la visita');

            $table->foreignId('cliente_id')
                  ->constrained('clientes')
                  ->onDelete('cascade')
                  ->comment('Cliente visitado');

            // Datos de la visita
            $table->timestamp('fecha_hora_visita')
                  ->comment('Fecha y hora exacta de la visita');

            $table->enum('tipo_visita', [
                'COBRO',
                'TOMA_PEDIDO',
                'ENTREGA',
                'SUPERVISION',
                'OTRO'
            ])->comment('Motivo de la visita');

            $table->enum('estado_visita', [
                'EXITOSA',
                'NO_ATENDIDO'
            ])->comment('Resultado de la visita');

            $table->enum('motivo_no_atencion', [
                'CLIENTE_CERRADO',
                'CLIENTE_AUSENTE',
                'DIRECCION_INCORRECTA',
                'OTRO'
            ])->nullable()
              ->comment('Motivo si no fue atendido');

            // Geolocalización
            $table->decimal('latitud', 10, 8)
                  ->comment('Latitud GPS de la visita');

            $table->decimal('longitud', 11, 8)
                  ->comment('Longitud GPS de la visita');

            // Evidencia
            $table->string('foto_local', 255)
                  ->nullable()
                  ->comment('Path de la foto del local/cliente');

            // Notas y observaciones
            $table->text('observaciones')
                  ->nullable()
                  ->comment('Notas del preventista');

            // Validación de ventana de entrega
            $table->boolean('dentro_ventana_horaria')
                  ->default(false)
                  ->comment('Si la visita fue dentro del horario programado');

            $table->foreignId('ventana_entrega_id')
                  ->nullable()
                  ->constrained('ventanas_entrega_cliente')
                  ->onDelete('set null')
                  ->comment('Ventana de entrega correspondiente (si aplica)');

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización
            $table->index(['preventista_id', 'fecha_hora_visita']);
            $table->index(['cliente_id', 'fecha_hora_visita']);
            $table->index(['estado_visita']);
            $table->index(['tipo_visita']);
            $table->index(['fecha_hora_visita']);
            $table->index(['dentro_ventana_horaria']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitas_preventista_cliente');
    }
};
