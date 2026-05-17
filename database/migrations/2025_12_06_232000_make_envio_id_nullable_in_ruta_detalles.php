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
        Schema::table('ruta_detalles', function (Blueprint $table) {
            // Hacer envio_id nullable y remover FK si existe
            if (Schema::hasColumn('ruta_detalles', 'envio_id')) {
                try {
                    $table->dropForeign(['envio_id']);
                } catch (\Exception $e) {
                    // FK might not exist, continue
                }

                $table->unsignedBigInteger('envio_id')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruta_detalles', function (Blueprint $table) {
            if (Schema::hasColumn('ruta_detalles', 'envio_id')) {
                $table->unsignedBigInteger('envio_id')->nullable(false)->change();
            }
        });
    }
};
