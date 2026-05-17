<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique(); // SEC-2026-0001
            $table->date('fecha');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('caja_id')->constrained('cajas')->onDelete('cascade');
            $table->string('descripcion'); // Ej: Inyección de ampolla
            $table->decimal('monto', 18, 2); // Monto dinámico
            $table->foreignId('tipo_pago_id')->nullable()->constrained('tipos_pago')->onDelete('set null');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
