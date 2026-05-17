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
        Schema::create('cargo_csv_inventarios', function (Blueprint $table) {
            $table->id();

            // Usuario que realizó la carga
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('restrict');

            // Información del archivo
            $table->string('nombre_archivo');
            $table->string('hash_archivo')->unique();

            // Datos de la carga
            $table->integer('cantidad_filas');
            $table->integer('cantidad_validas');
            $table->integer('cantidad_errores');
            $table->enum('estado', ['pendiente', 'procesado', 'cancelado', 'revertido'])->default('pendiente');

            // Almacenamiento de datos
            $table->longText('datos_json')->nullable(); // CSV original
            $table->longText('errores_json')->nullable(); // Errores de validación
            $table->longText('cambios_json')->nullable(); // Detalles de cambios realizados

            // Seguimiento de reversión
            $table->unsignedBigInteger('revertido_por_usuario_id')->nullable();
            $table->foreign('revertido_por_usuario_id')->references('id')->on('users')->onDelete('set null');
            $table->dateTime('fecha_reversion')->nullable();
            $table->text('motivo_reversion')->nullable();

            $table->timestamps();

            // Índices
            $table->index('usuario_id');
            $table->index('estado');
            $table->index('created_at');
        });

        // Tabla de relación entre cargo CSV y movimientos de inventario
        Schema::create('cargo_csv_movimientos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cargo_csv_id');
            $table->unsignedBigInteger('movimiento_inventario_id');

            $table->foreign('cargo_csv_id')->references('id')->on('cargo_csv_inventarios')->onDelete('cascade');
            $table->foreign('movimiento_inventario_id')->references('id')->on('movimientos_inventario')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['cargo_csv_id', 'movimiento_inventario_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargo_csv_movimientos');
        Schema::dropIfExists('cargo_csv_inventarios');
    }
};
