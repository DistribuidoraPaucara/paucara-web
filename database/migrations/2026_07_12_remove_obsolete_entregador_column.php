<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * BUGFIX: Eliminar la columna obsoleta 'entregador' (string)
 *
 * PROBLEMA:
 * - La columna 'entregador' (string) fue agregada en una migración anterior
 * - Luego se agregó 'entregador_id' (FK) como relación a users
 * - Pero la columna 'entregador' nunca fue removida
 * - En Eloquent, cuando un atributo y una relación tienen el mismo nombre,
 *   el atributo toma precedencia, causando que `$entrega->entregador`
 *   retorne NULL en lugar de cargar la relación
 *
 * SOLUCIÓN:
 * - Remover la columna 'entregador' (string) ya que no se usa
 * - Mantener 'entregador_id' como FK correcta
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Eliminar la columna obsoleta 'entregador' (string)
            if (Schema::hasColumn('entregas', 'entregador')) {
                $table->dropColumn('entregador');
            }
        });
    }

    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Revertir: agregar la columna si es necesario
            $table->string('entregador')->nullable()->after('observaciones')
                ->comment('Nombre de la persona que realiza la entrega [OBSOLETO - Usar relación entregador_id]');
        });
    }
};
