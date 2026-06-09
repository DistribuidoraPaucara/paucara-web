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
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Agregar almacén (similar a prestamo_evento)
            $table->foreignId('almacenes_prestables_id')
                ->nullable()
                ->after('proveedor_id')
                ->constrained('almacenes_prestables')
                ->nullOnDelete();

            // Agregar chofer (similar a prestamo_evento)
            $table->foreignId('chofer_id')
                ->nullable()
                ->after('almacenes_prestables_id')
                ->constrained('users')
                ->nullOnDelete();

            // Agregar vehículo asignado (similar a prestamo_evento)
            $table->string('vehiculo_asignado')
                ->nullable()
                ->after('chofer_id')
                ->comment('Placa o identificación del vehículo asignado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            try {
                $table->dropForeignKey('prestamo_proveedor_almacenes_prestables_id_foreign');
            } catch (\Exception $e) {
                // FK might not exist
            }
            try {
                $table->dropForeignKey('prestamo_proveedor_chofer_id_foreign');
            } catch (\Exception $e) {
                // FK might not exist
            }
            $table->dropColumn(['almacenes_prestables_id', 'chofer_id', 'vehiculo_asignado']);
        });
    }
};
