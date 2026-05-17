<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('empresa_id')
                ->nullable()
                ->after('id')
                ->constrained('empresas')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE productos
            DROP CONSTRAINT IF EXISTS productos_empresa_id_foreign
        ");

        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('empresa_id');
        });
    }
};
