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
        Schema::create('modulos_sidebar', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('ruta');
            $table->string('icono')->nullable();
            $table->string('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->boolean('es_submenu')->default(false);
            $table->unsignedBigInteger('modulo_padre_id')->nullable();
            $table->json('permisos')->nullable();                // Para gestionar permisos
            $table->string('color')->nullable();                 // Color personalizado
            $table->string('categoria')->nullable();             // Categoria del módulo
            $table->boolean('visible_dashboard')->default(true); // Si se muestra en dashboard
            $table->timestamps();

            $table->foreign('modulo_padre_id')->references('id')->on('modulos_sidebar')->onDelete('cascade');
            $table->index(['activo', 'orden']);
            $table->index(['es_submenu', 'modulo_padre_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulos_sidebar');
    }
};
