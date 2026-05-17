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
        Schema::create('transferencia_inventarios', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->datetime('fecha');
            $table->foreignId('almacen_origen_id')->constrained('almacenes');
            $table->foreignId('almacen_destino_id')->constrained('almacenes');
            $table->foreignId('usuario_id')->constrained('users');
            $table->enum('estado', ['BORRADOR', 'ENVIADO', 'RECIBIDO', 'CANCELADO'])->default('BORRADOR');
            $table->text('observaciones')->nullable();
            $table->datetime('fecha_envio')->nullable();
            $table->datetime('fecha_recepcion')->nullable();
            $table->foreignId('vehiculo_id')->nullable()->constrained('vehiculos');
            $table->foreignId('chofer_id')->nullable()->constrained('chofers');
            $table->integer('total_productos')->default(0);
            $table->integer('total_cantidad')->default(0);
            $table->timestamps();

            $table->index(['estado', 'fecha']);
            $table->index(['almacen_origen_id', 'almacen_destino_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferencia_inventarios');
    }
};
