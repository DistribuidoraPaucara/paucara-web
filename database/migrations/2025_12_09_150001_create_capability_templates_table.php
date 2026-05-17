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
        Schema::create('capability_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Nombre único de la plantilla (ej: vendedor-basico)');
            $table->string('label')->comment('Etiqueta amigable para mostrar');
            $table->text('description')->nullable()->comment('Descripción de qué contiene la plantilla');
            $table->json('capabilities')->comment('Array de nombres de capacidades en la plantilla');
            $table->unsignedBigInteger('created_by')->nullable()->comment('Usuario que creó la plantilla');
            $table->unsignedBigInteger('updated_by')->nullable()->comment('Último usuario que modificó');
            $table->integer('order')->default(0)->comment('Orden de visualización');
            $table->boolean('is_active')->default(true)->comment('Si la plantilla está disponible');
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capability_templates');
    }
};
