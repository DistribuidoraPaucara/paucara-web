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
        Schema::create('role_audits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('role_id'); // Rol modificado
            $table->unsignedBigInteger('user_id'); // Usuario que hizo el cambio
            $table->string('accion'); // 'crear', 'actualizar', 'agregar_permiso', 'quitar_permiso'
            $table->string('permiso_nombre')->nullable(); // Nombre del permiso afectado
            $table->json('antes')->nullable(); // Estado anterior (para permisos)
            $table->json('despues')->nullable(); // Estado nuevo (para permisos)
            $table->text('descripcion'); // Descripción del cambio
            $table->integer('usuarios_afectados')->default(0); // Cuántos usuarios se vieron afectados
            $table->timestamps();

            // Relaciones
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_audits');
    }
};
