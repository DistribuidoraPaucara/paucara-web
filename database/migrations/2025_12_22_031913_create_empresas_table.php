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
        // Solo crear si no existe
        if (!Schema::hasTable('empresas')) {
            Schema::create('empresas', function (Blueprint $table) {
            $table->id();

            // Datos básicos
            $table->string('nombre_comercial');
            $table->string('razon_social');
            $table->string('nit', 20)->unique();

            // Contacto
            $table->string('telefono', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('sitio_web')->nullable();

            // Dirección
            $table->string('direccion');
            $table->string('ciudad', 100)->default('La Paz');
            $table->string('pais', 50)->default('Bolivia');

            // Logos (rutas a storage)
            $table->string('logo_principal')->nullable(); // Logo completo para hojas
            $table->string('logo_compacto')->nullable();  // Logo pequeño para tickets
            $table->string('logo_footer')->nullable();    // Logo pequeño pie de página

            // Configuración de impresión (JSON flexible)
            $table->json('configuracion_impresion')->nullable();

            // Mensajes personalizados para documentos
            $table->text('mensaje_footer')->nullable();
            $table->text('mensaje_legal')->nullable();

            // Control
            $table->boolean('activo')->default(true);
            $table->boolean('es_principal')->default(false); // Solo una empresa principal activa

            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('es_principal');
            $table->index('activo');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
