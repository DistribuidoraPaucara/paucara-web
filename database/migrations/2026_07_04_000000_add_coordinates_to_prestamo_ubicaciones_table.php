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
        Schema::table('prestamo_ubicaciones', function (Blueprint $table) {
            $table->decimal('longitud', 10, 8)->nullable()->after('direccion');
            $table->decimal('latitud', 10, 8)->nullable()->after('longitud');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_ubicaciones', function (Blueprint $table) {
            $table->dropColumn(['longitud', 'latitud']);
        });
    }
};
