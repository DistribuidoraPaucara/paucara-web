<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->foreignId('cliente_id')->nullable()->after('evento_id')
                  ->constrained('clientes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->dropForeignIdFor('clientes', 'cliente_id');
        });
    }
};
