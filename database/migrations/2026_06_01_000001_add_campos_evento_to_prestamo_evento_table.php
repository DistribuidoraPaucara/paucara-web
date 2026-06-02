<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->foreignId('venta_id')->nullable()->after('evento_id')
                  ->constrained('ventas')->nullOnDelete();
            $table->string('encargado_evento')->nullable()->after('nombre_evento');
            $table->string('vehiculo_asignado')->nullable()->after('encargado_evento');
            $table->string('direccion_evento')->nullable()->after('vehiculo_asignado');
            $table->string('telefono_uno')->nullable()->after('direccion_evento');
            $table->string('telefono_dos')->nullable()->after('telefono_uno');
            $table->date('fecha_entrega')->nullable()->after('fecha_prestamo');
        });
    }

    public function down(): void
    {
        Schema::table('prestamo_evento', function (Blueprint $table) {
            $table->dropForeignIdFor('ventas', 'venta_id');
            $table->dropColumn([
                'venta_id',
                'encargado_evento',
                'vehiculo_asignado',
                'direccion_evento',
                'telefono_uno',
                'telefono_dos',
                'fecha_entrega',
            ]);
        });
    }
};
