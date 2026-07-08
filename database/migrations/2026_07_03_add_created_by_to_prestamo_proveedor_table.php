<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('prestamo_proveedor', 'created_by')) {
            Schema::table('prestamo_proveedor', function (Blueprint $table) {
                $table->foreignId('created_by')
                    ->nullable()
                    ->after('id')
                    ->constrained('users')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            $table->dropForeignIdFor('User', 'created_by');
            $table->dropColumn('created_by');
        });
    }
};
