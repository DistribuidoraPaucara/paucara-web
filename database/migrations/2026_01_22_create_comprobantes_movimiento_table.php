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
        Schema::create('comprobantes_movimiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movimiento_caja_id')->constrained('movimientos_caja')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('ruta_archivo'); // Path del archivo almacenado
            $table->string('nombre_original'); // Nombre original subido por el usuario
            $table->string('tipo_archivo'); // MIME type (image/jpeg, image/png, application/pdf, etc.)
            $table->unsignedBigInteger('tamaño'); // Tamaño en bytes
            $table->string('hash')->nullable()->unique(); // Hash del archivo para evitar duplicados
            $table->text('observaciones')->nullable(); // Notas sobre el comprobante
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('movimiento_caja_id');
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes_movimiento');
    }
};
