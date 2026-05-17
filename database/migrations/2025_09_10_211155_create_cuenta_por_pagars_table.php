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
        Schema::create('cuentas_por_pagar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compra_id')->constrained('compras');
            $table->decimal('monto_original', 15, 2);
            $table->decimal('saldo_pendiente', 15, 2);
            $table->date('fecha_vencimiento');
            $table->integer('dias_vencido')->default(0);
            $table->enum('estado', ['PENDIENTE', 'PAGADO', 'VENCIDO', 'PARCIAL'])->default('PENDIENTE');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->index(['fecha_vencimiento', 'estado']);
            $table->index(['compra_id', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuentas_por_pagar');
    }
};
