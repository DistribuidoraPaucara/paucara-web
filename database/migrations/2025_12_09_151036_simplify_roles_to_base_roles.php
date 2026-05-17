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
        Schema::table('roles', function (Blueprint $table) {
            // Identificar si es un rol base (Super Admin, Admin, Manager, Empleado, Cliente)
            $table->boolean('is_base')->default(false)->comment('Si es uno de los 5 roles base');

            // Describir el tipo de rol para UI
            $table->string('role_type')->nullable()->comment('Tipo: base, funcional (deprecated)');

            // Asociar con una plantilla de capacidades
            $table->string('template_name')->nullable()->comment('Nombre de plantilla asociada');

            // Descripción para UI
            $table->text('description')->nullable()->after('name')->comment('Descripción del rol');

            // Orden en UI
            $table->integer('display_order')->default(0)->comment('Orden de visualización');

            // Para roles legacy: fecha de deprecación
            $table->timestamp('deprecated_at')->nullable()->comment('Fecha en que el rol se marcó como deprecado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn([
                'is_base',
                'role_type',
                'template_name',
                'description',
                'display_order',
                'deprecated_at'
            ]);
        });
    }
};
