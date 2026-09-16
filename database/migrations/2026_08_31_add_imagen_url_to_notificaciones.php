<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notificaciones_recurrentes', function (Blueprint $table) {
            // ✅ NUEVO: URL de la imagen para mostrar en notificaciones
            $table->string('imagen_url')->nullable()->after('vistas')->comment('URL de imagen a mostrar en la notificación');
        });
    }

    public function down(): void
    {
        Schema::table('notificaciones_recurrentes', function (Blueprint $table) {
            $table->dropColumn('imagen_url');
        });
    }
};
