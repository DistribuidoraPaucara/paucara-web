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
        Schema::table('empresas', function (Blueprint $table) {
            $table->boolean('permite_productos_fraccionados')
                ->default(false)
                ->after('activo')
                ->comment('Si true, permite crear productos con conversiones de unidades (fraccionados)');

            $table->index('permite_productos_fraccionados');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropIndex(['permite_productos_fraccionados']);
            $table->dropColumn('permite_productos_fraccionados');
        });
    }
};
