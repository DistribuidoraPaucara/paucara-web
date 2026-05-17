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
        if (!Schema::hasTable('plantillas_impresion')) {
            Schema::create('plantillas_impresion', function (Blueprint $table) {
            $table->id();

            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');

            // Identificación
            $table->string('codigo')->unique(); // Ej: 'VENTA_A4', 'VENTA_TICKET_80'
            $table->string('nombre'); // Ej: 'Factura Hoja Completa'
            $table->string('tipo_documento'); // 'venta', 'proforma', 'envio', 'reporte'
            $table->string('formato'); // 'A4', 'TICKET_58', 'TICKET_80', 'CUSTOM'

            // Template Blade
            $table->string('vista_blade'); // 'impresion.ventas.ticket-80'

            // Configuración específica del template (JSON)
            $table->json('configuracion')->nullable();

            // Orden y control
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->boolean('es_default')->default(false);

            $table->timestamps();

            // Índices y constraints
            $table->index(['tipo_documento', 'formato']);
            $table->index('activo');
            $table->unique(['empresa_id', 'tipo_documento', 'formato']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantillas_impresion');
    }
};
