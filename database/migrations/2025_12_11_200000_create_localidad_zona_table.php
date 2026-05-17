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
        Schema::create('localidad_zona', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('localidad_id');
            $table->unsignedBigInteger('zona_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('localidad_id')
                  ->references('id')
                  ->on('localidades')
                  ->onDelete('cascade');

            $table->foreign('zona_id')
                  ->references('id')
                  ->on('zonas')
                  ->onDelete('cascade');

            // Constraints e índices
            $table->unique(['localidad_id', 'zona_id']);
            $table->index('localidad_id');
            $table->index('zona_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localidad_zona');
    }
};
