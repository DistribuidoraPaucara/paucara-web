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
        // Eliminar restricción FK en transferencia_inventarios
        Schema::table('transferencia_inventarios', function (Blueprint $table) {
            $table->dropForeign('transferencia_inventarios_chofer_id_foreign');
        });

        // Eliminar tabla choferes_legacy
        Schema::dropIfExists('choferes_legacy');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
