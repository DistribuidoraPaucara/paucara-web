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
        Schema::table('detalle_ventas', function (Blueprint $table) {
            // ✅ NUEVO: Almacenar items del combo seleccionados por el usuario
            // JSON array con estructura: [{ combo_item_id, producto_id, incluido }]
            $table->json('combo_items_seleccionados')->nullable()->after('tipo_precio_nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropColumn('combo_items_seleccionados');
        });
    }
};
