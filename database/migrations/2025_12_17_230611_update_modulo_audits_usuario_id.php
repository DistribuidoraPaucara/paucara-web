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
        Schema::table('modulo_audits', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['usuario_id']);
            // Change to unsignedBigInteger without constraint
            $table->unsignedBigInteger('usuario_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modulo_audits', function (Blueprint $table) {
            $table->foreignId('usuario_id')
                ->nullable()
                ->constrained('users')
                ->setOnDelete('set null');
        });
    }
};
