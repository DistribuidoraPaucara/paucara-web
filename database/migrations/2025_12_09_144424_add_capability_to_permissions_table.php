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
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('capability')->nullable()->after('name')->comment('Agrupa permisos por capacidad/funcionalidad (ej: ventas, clientes, inventario)');
            $table->string('description')->nullable()->after('capability')->comment('Descripción legible del permiso para UI');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn(['capability', 'description']);
        });
    }
};
