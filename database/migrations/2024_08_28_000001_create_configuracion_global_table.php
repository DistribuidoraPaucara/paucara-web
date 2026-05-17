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
        Schema::create('configuracion_global', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique(); // 'porcentaje_interes_general', 'margen_minimo_global', etc.
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('tipo_valor')->default('decimal'); // 'decimal', 'integer', 'string', 'boolean'
            $table->text('valor'); // Almacena cualquier tipo de valor como texto
            $table->decimal('valor_numerico', 8, 2)->nullable(); // Para valores numéricos (optimización de queries)
            $table->string('categoria')->default('general'); // 'precios', 'general', 'ganancias', etc.
            $table->boolean('activo')->default(true);
            $table->boolean('es_sistema')->default(false);
            $table->json('metadatos')->nullable(); // Para configuraciones adicionales
            $table->timestamps();

            $table->index(['clave', 'activo']);
            $table->index(['categoria', 'activo']);
        });

        // Insertar configuraciones por defecto
        DB::table('configuracion_global')->insert([
            [
                'clave' => 'porcentaje_interes_general',
                'nombre' => 'Porcentaje de Interés General',
                'descripcion' => 'Porcentaje de ganancia por defecto para nuevos productos',
                'tipo_valor' => 'decimal',
                'valor' => '20.00',
                'valor_numerico' => 20.00,
                'categoria' => 'ganancias',
                'activo' => true,
                'es_sistema' => true,
                'metadatos' => json_encode([
                    'min_valor' => 0,
                    'max_valor' => 100,
                    'unidad' => 'porcentaje',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'margen_minimo_global',
                'nombre' => 'Margen Mínimo Global',
                'descripcion' => 'Margen mínimo de ganancia por defecto',
                'tipo_valor' => 'decimal',
                'valor' => '10.00',
                'valor_numerico' => 10.00,
                'categoria' => 'ganancias',
                'activo' => true,
                'es_sistema' => true,
                'metadatos' => json_encode([
                    'min_valor' => 0,
                    'max_valor' => 100,
                    'unidad' => 'porcentaje',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'aplicar_interes_automatico',
                'nombre' => 'Aplicar Interés Automático',
                'descripcion' => 'Aplicar automáticamente el porcentaje de interés a nuevos productos',
                'tipo_valor' => 'boolean',
                'valor' => 'true',
                'valor_numerico' => null,
                'categoria' => 'ganancias',
                'activo' => true,
                'es_sistema' => true,
                'metadatos' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuracion_global');
    }
};
