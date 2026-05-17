<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campos para controlar el acceso de usuarios a diferentes plataformas:
     * - can_access_web: Para acceso a la plataforma web/admin
     * - can_access_mobile: Para acceso a la aplicación móvil
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregar campos si no existen
            if (!Schema::hasColumn('users', 'can_access_web')) {
                $table->boolean('can_access_web')->default(true)->after('activo')->comment('Usuario puede acceder a la plataforma web/admin');
            }

            if (!Schema::hasColumn('users', 'can_access_mobile')) {
                $table->boolean('can_access_mobile')->default(true)->after('can_access_web')->comment('Usuario puede acceder a la aplicación móvil');
            }
        });

        // Actualizar usuarios existentes con rol Cliente para que solo tengan acceso móvil
        // Usando sintaxis compatible con PostgreSQL
        DB::statement("UPDATE users
            SET can_access_web = false
            WHERE id IN (
                SELECT DISTINCT mhr.model_id
                FROM model_has_roles mhr
                INNER JOIN roles r ON mhr.role_id = r.id
                WHERE r.name IN ('Cliente', 'cliente')
                AND mhr.model_type = 'App\\\\Models\\\\User'
            )
        ");

        // Asegurar que todos los otros usuarios tengan acceso a ambas plataformas
        DB::statement("UPDATE users
            SET can_access_web = true, can_access_mobile = true
            WHERE id NOT IN (
                SELECT DISTINCT mhr.model_id
                FROM model_has_roles mhr
                INNER JOIN roles r ON mhr.role_id = r.id
                WHERE r.name IN ('Cliente', 'cliente')
                AND mhr.model_type = 'App\\\\Models\\\\User'
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'can_access_web')) {
                $table->dropColumn('can_access_web');
            }

            if (Schema::hasColumn('users', 'can_access_mobile')) {
                $table->dropColumn('can_access_mobile');
            }
        });
    }
};
