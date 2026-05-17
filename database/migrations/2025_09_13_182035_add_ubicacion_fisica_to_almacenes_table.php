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
        Schema::table('almacenes', function (Blueprint $table) {
            $table->string('ubicacion_fisica')->nullable()->after('direccion')
                ->comment('Identifica la ubicación física compartida (ej: "SEDE_PRINCIPAL", "SUCURSAL_NORTE")');
            $table->boolean('requiere_transporte_externo')->default(false)->after('ubicacion_fisica')
                ->comment('Indica si este almacén requiere transporte externo para transferencias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('almacenes', function (Blueprint $table) {
            $table->dropColumn(['ubicacion_fisica', 'requiere_transporte_externo']);
        });
    }
};
