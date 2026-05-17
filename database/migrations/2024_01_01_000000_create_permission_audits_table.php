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
        Schema::create('permission_audits', function (Blueprint $table) {
            $table->id();

            // Usuario que realizó el cambio
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');

            // Tipo de cambio: 'usuario' o 'rol'
            $table->enum('target_type', ['usuario', 'rol'])->index();

            // ID del usuario o rol afectado
            $table->unsignedBigInteger('target_id')->index();
            $table->string('target_name'); // Nombre del usuario o rol para auditoría

            // Detalles del cambio
            $table->enum('action', ['crear', 'editar', 'eliminar', 'restaurar']);
            $table->json('permisos_anteriores')->nullable(); // Permisos previos (JSON)
            $table->json('permisos_nuevos')->nullable(); // Permisos posteriores (JSON)
            $table->text('descripcion')->nullable(); // Descripción adicional

            // IP y User Agent para seguridad
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            // Timestamps
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index(['target_type', 'target_id']);
            $table->index(['admin_id', 'created_at']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_audits');
    }
};
