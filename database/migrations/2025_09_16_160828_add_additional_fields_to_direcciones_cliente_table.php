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
        Schema::table('direcciones_cliente', function (Blueprint $table) {
            $table->string('ciudad')->nullable()->after('direccion');
            $table->string('departamento')->nullable()->after('ciudad');
            $table->string('codigo_postal', 20)->nullable()->after('departamento');
            $table->text('observaciones')->nullable()->after('codigo_postal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('direcciones_cliente', function (Blueprint $table) {
            $table->dropColumn(['ciudad', 'departamento', 'codigo_postal', 'observaciones']);
        });
    }
};
