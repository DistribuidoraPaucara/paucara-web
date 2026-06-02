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
        Schema::table('prestables', function (Blueprint $table) {
            $table->unsignedBigInteger('embase_asociado_id')->nullable()->after('prestable_relacionado_id');
            $table->foreign('embase_asociado_id')
                ->references('id')
                ->on('prestables')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestables', function (Blueprint $table) {
            $table->dropForeign(['embase_asociado_id']);
            $table->dropColumn('embase_asociado_id');
        });
    }
};
