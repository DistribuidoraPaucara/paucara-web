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
        // Solo crear si no existe
        if (!Schema::hasTable('user_chofer_preferencias')) {
            Schema::create('user_chofer_preferencias', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('chofer_id')->constrained('empleados')->cascadeOnDelete();
                $table->dateTime('fecha_uso')->nullable();
                $table->integer('frecuencia')->default(0);
                $table->timestamps();
                $table->unique(['user_id', 'chofer_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_chofer_preferencias');
    }
};
