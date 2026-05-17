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
        Schema::create('cuentas_por_cobrar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas');
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->decimal('monto_original', 15, 2);
            $table->decimal('saldo_pendiente', 15, 2);
            $table->date('fecha_vencimiento');
            $table->integer('dias_vencido')->default(0);
            $table->string('estado')->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuentas_por_cobrar');
    }
};
