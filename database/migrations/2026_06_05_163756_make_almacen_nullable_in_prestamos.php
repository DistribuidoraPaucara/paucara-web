<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hacer nullable almacenes_prestables_id en prestamo_cliente
        // para permitir múltiples almacenes en detalles
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->unsignedBigInteger('almacenes_prestables_id')->nullable()->change();
        });

        // Hacer nullable almacenes_prestables_id en prestamo_evento
        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->unsignedBigInteger('almacenes_prestables_id')->nullable()->change();
        });

        // Hacer nullable almacenes_prestables_id en prestamo_proveedor
        if (Schema::hasTable('prestamo_proveedor')) {
            Schema::table('prestamo_proveedor', function (Blueprint $table) {
                $table->unsignedBigInteger('almacenes_prestables_id')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->unsignedBigInteger('almacenes_prestables_id')->nullable(false)->change();
        });

        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->unsignedBigInteger('almacenes_prestables_id')->nullable(false)->change();
        });

        if (Schema::hasTable('prestamo_proveedor')) {
            Schema::table('prestamo_proveedor', function (Blueprint $table) {
                $table->unsignedBigInteger('almacenes_prestables_id')->nullable(false)->change();
            });
        }
    }
};
