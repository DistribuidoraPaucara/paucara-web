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
        Schema::create('role_templates', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->text('descripcion')->nullable();
            $table->json('permisos'); // Array de IDs de permisos
            $table->unsignedBigInteger('created_by')->nullable(); // Usuario que creó la plantilla
            $table->unsignedBigInteger('updated_by')->nullable(); // Último usuario que la editó
            $table->timestamps();

            // Relación con usuarios
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_templates');
    }
};
