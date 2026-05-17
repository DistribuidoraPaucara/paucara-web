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
        Schema::table('productos', function (Blueprint $table) {
            $table->string('principio_activo', 255)
                ->nullable()
                ->after('descripcion')
                ->comment('Principio activo del medicamento');

            $table->text('uso_de_medicacion')
                ->nullable()
                ->after('principio_activo')
                ->comment('Indicaciones de uso del medicamento');

            $table->index('principio_activo', 'idx_productos_principio_activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_principio_activo');
            $table->dropColumn(['principio_activo', 'uso_de_medicacion']);
        });
    }
};
