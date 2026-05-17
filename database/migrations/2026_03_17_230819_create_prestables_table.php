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
        Schema::create('prestables', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // ej: "Canastilla La Paceña"
            $table->string('codigo')->unique(); // ej: "CANAS-LP-24"
            $table->enum('tipo', ['CANASTILLA', 'EMBASES', 'OTRO']); // tipo de prestable
            $table->integer('capacidad')->nullable(); // 24 embases, 12 embases, etc.
            $table->foreignId('producto_id')->nullable()->constrained('productos')->onDelete('set null'); // referencia al producto
            $table->foreignId('proveedor_id')->nullable()->constrained('proveedores')->onDelete('set null'); // fabricante
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestables');
    }
};
