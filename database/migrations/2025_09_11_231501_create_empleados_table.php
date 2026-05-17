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
        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->onUpdate('cascade');
            // Información personal
            $table->string('codigo_empleado')->unique();
            $table->string('ci', 20)->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('direccion')->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['M', 'F', 'O'])->nullable();
            $table->enum('estado_civil', ['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'])->nullable();

            // Información laboral
            $table->string('cargo');
            $table->string('departamento')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('empleados')->onDelete('set null');
            $table->date('fecha_ingreso');
            $table->date('fecha_salida')->nullable();
            $table->enum('tipo_contrato', ['indefinido', 'temporal', 'medio_tiempo', 'por_horas', 'practicante'])->default('indefinido');
            $table->enum('estado', ['activo', 'inactivo', 'suspendido', 'vacaciones', 'permiso', 'despedido'])->default('activo');

            // Información salarial
            $table->decimal('salario_base', 10, 2)->nullable();
            $table->decimal('bonos', 10, 2)->default(0);
            $table->string('cuenta_bancaria')->nullable();
            $table->string('banco')->nullable();

            // Contacto de emergencia
            $table->string('contacto_emergencia_nombre')->nullable();
            $table->string('contacto_emergencia_telefono')->nullable();
            $table->string('contacto_emergencia_relacion')->nullable();

            // Control de acceso al sistema
            $table->boolean('puede_acceder_sistema')->default(false);
            $table->timestamp('ultimo_acceso_sistema')->nullable();

            // Documentos
            $table->string('foto_perfil')->nullable();
            $table->string('cv_documento')->nullable();
            $table->string('contrato_documento')->nullable();
            $table->json('certificaciones')->nullable(); // Para almacenar certificados, títulos, etc.

            // Horarios
            $table->json('horario_trabajo')->nullable(); // Para almacenar horarios flexibles

            // Observaciones y notas
            $table->text('observaciones')->nullable();
            $table->text('notas_rrhh')->nullable();

            $table->timestamps();

            // Índices para optimizar consultas
            $table->index(['estado', 'departamento']);
            $table->index(['fecha_ingreso', 'estado']);
            $table->index(['supervisor_id']);
            $table->index(['puede_acceder_sistema']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
