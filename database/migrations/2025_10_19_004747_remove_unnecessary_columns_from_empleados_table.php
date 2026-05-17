<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Para SQLite: eliminar índices que contienen columnas a eliminar
        // SQLite no puede eliminar columnas que están en índices
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Obtener lista de índices en la tabla empleados
            $indexes = DB::select("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='empleados'");

            foreach ($indexes as $index) {
                // Eliminar todos los índices excepto los de SQLite internos
                if (!str_starts_with($index->name, 'sqlite_autoindex')) {
                    DB::statement("DROP INDEX IF EXISTS " . $index->name);
                }
            }
        }

        Schema::table('empleados', function (Blueprint $table) {
            // Eliminar información personal innecesaria
            $table->dropColumn([
                'fecha_nacimiento',
                'genero',
                'estado_civil'
            ]);

            // Eliminar información laboral innecesaria
            try {
                $table->dropForeign(['supervisor_id']);
            } catch (\Exception $e) {
                // La foreign key podría no existir
            }

            $table->dropColumn([
                'cargo',
                'departamento',
                'supervisor_id',
                'tipo_contrato'
            ]);

            // Eliminar información salarial
            $table->dropColumn([
                'salario_base',
                'bonos',
                'cuenta_bancaria',
                'banco'
            ]);

            // Eliminar contactos de emergencia
            $table->dropColumn([
                'contacto_emergencia_nombre',
                'contacto_emergencia_telefono',
                'contacto_emergencia_relacion'
            ]);

            // Eliminar documentos y datos adicionales
            $table->dropColumn([
                'contrato_documento',
                'certificaciones',
                'horario_trabajo',
                'notas_rrhh'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empleados', function (Blueprint $table) {
            // Restaurar información personal
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['M', 'F', 'O'])->nullable();
            $table->enum('estado_civil', ['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'])->nullable();

            // Restaurar información laboral
            $table->string('cargo')->nullable();
            $table->string('departamento')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('empleados')->onDelete('set null');
            $table->enum('tipo_contrato', ['indefinido', 'temporal', 'medio_tiempo', 'por_horas', 'practicante'])->default('indefinido');

            // Restaurar información salarial
            $table->decimal('salario_base', 10, 2)->nullable();
            $table->decimal('bonos', 10, 2)->default(0);
            $table->string('cuenta_bancaria')->nullable();
            $table->string('banco')->nullable();

            // Restaurar contactos de emergencia
            $table->string('contacto_emergencia_nombre')->nullable();
            $table->string('contacto_emergencia_telefono')->nullable();
            $table->string('contacto_emergencia_relacion')->nullable();

            // Restaurar documentos y datos adicionales
            $table->string('contrato_documento')->nullable();
            $table->json('certificaciones')->nullable();
            $table->json('horario_trabajo')->nullable();
            $table->text('notas_rrhh')->nullable();
        });
    }
};
