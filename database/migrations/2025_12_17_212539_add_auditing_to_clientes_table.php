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
        // ✅ Agregar campos de auditoría a tabla clientes
        Schema::table('clientes', function (Blueprint $table) {
            // Relación directa con Preventista (Empleado)
            if (!Schema::hasColumn('clientes', 'preventista_id')) {
                $table->unsignedBigInteger('preventista_id')
                    ->nullable()
                    ->after('usuario_creacion_id');

                $table->foreign('preventista_id')
                    ->references('id')
                    ->on('empleados')
                    ->onDelete('set null');
            }

            // Quién fue el último que modificó
            if (!Schema::hasColumn('clientes', 'usuario_actualizacion_id')) {
                $table->unsignedBigInteger('usuario_actualizacion_id')
                    ->nullable()
                    ->after('preventista_id');

                $table->foreign('usuario_actualizacion_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('set null');
            }

            // Cuándo fue creado/actualizado
            if (!Schema::hasColumn('clientes', 'fecha_creacion')) {
                $table->timestamp('fecha_creacion')
                    ->useCurrent()
                    ->after('fecha_registro');
            }

            if (!Schema::hasColumn('clientes', 'fecha_actualizacion')) {
                $table->timestamp('fecha_actualizacion')
                    ->nullable()
                    ->after('fecha_creacion');
            }

            // Estado del cliente
            if (!Schema::hasColumn('clientes', 'estado')) {
                $table->enum('estado', ['prospecto', 'activo', 'inactivo', 'bloqueado'])
                    ->default('prospecto')
                    ->after('activo');
            }
        });

        // ✅ Crear tabla: Auditoría de clientes
        Schema::create('cliente_audits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('preventista_id')->nullable(); // Preventista que hizo la acción
            $table->unsignedBigInteger('usuario_id')->nullable(); // User que hizo la acción (super-admin, admin)
            $table->string('accion'); // 'created', 'updated', 'bloqueado', 'estado_cambio'
            $table->json('cambios'); // Qué cambió
            $table->text('motivo')->nullable(); // Por qué se bloqueó, etc
            $table->string('ip_address')->nullable();
            $table->timestamps();

            // Índices para performance
            $table->index('cliente_id');
            $table->index('preventista_id');
            $table->index('usuario_id');
            $table->index('accion');
            $table->index('created_at');

            // Relaciones
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('preventista_id')->references('id')->on('empleados')->onDelete('set null');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar tabla de auditoría
        Schema::dropIfExists('cliente_audits');

        // Eliminar columnas de auditoría
        Schema::table('clientes', function (Blueprint $table) {
            // Eliminar foreign keys primero
            if (Schema::hasColumn('clientes', 'preventista_id')) {
                $table->dropForeign(['preventista_id']);
                $table->dropColumn('preventista_id');
            }

            if (Schema::hasColumn('clientes', 'usuario_actualizacion_id')) {
                $table->dropForeign(['usuario_actualizacion_id']);
                $table->dropColumn('usuario_actualizacion_id');
            }

            if (Schema::hasColumn('clientes', 'fecha_creacion')) {
                $table->dropColumn('fecha_creacion');
            }

            if (Schema::hasColumn('clientes', 'fecha_actualizacion')) {
                $table->dropColumn('fecha_actualizacion');
            }

            if (Schema::hasColumn('clientes', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};
