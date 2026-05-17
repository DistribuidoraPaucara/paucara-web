<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('combo_items', function (Blueprint $table) {
            $table->boolean('es_obligatorio')->default(true)->after('tipo_precio_id');
            $table->string('grupo_opcional')->nullable()->after('es_obligatorio');
            $table->index(['combo_id', 'grupo_opcional']);
        });
    }

    public function down(): void
    {
        Schema::table('combo_items', function (Blueprint $table) {
            $table->dropIndex(['combo_id', 'grupo_opcional']);
            $table->dropColumn(['es_obligatorio', 'grupo_opcional']);
        });
    }
};
