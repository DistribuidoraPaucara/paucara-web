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
        Schema::create('detalle_transferencia_inventarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transferencia_id')->constrained('transferencia_inventarios')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos');
            $table->integer('cantidad');
            $table->string('lote')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->integer('cantidad_recibida')->default(0);
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->index(['transferencia_id', 'producto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_transferencia_inventarios');
    }
};
