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
        Schema::table('estados_documento', function (Blueprint $table) {
            $table->string('icono', 50)->nullable()->after('color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estados_documento', function (Blueprint $table) {
            $table->dropColumn('icono');
        });
    }
};
