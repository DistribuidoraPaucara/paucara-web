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
        Schema::create('cierres_caja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('apertura_caja_id')->constrained('aperturas_caja');
            $table->datetime('fecha');
            $table->decimal('monto_esperado', 15, 2);
            $table->decimal('monto_real', 15, 2);
            $table->decimal('diferencia', 15, 2);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cierres_caja');
    }
};
