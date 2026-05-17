<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('combo_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_id')->constrained('productos')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->decimal('cantidad', 10, 2)->default(1);
            $table->decimal('precio_unitario', 18, 2)->default(0);
            $table->foreignId('tipo_precio_id')->nullable()->constrained('tipos_precio')->nullOnDelete();
            $table->timestamps();

            $table->unique(['combo_id', 'producto_id'], 'uq_combo_producto');
            $table->index(['producto_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('combo_items');
    }
};
