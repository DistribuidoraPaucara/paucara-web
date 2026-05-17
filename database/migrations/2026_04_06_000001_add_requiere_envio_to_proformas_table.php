<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campo requiere_envio a proformas para distinguir entre envíos y pickups
     */
    public function up(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            if (!Schema::hasColumn('proformas', 'requiere_envio')) {
                $table->boolean('requiere_envio')
                    ->default(false)
                    ->after('tipo_entrega')
                    ->comment('Indica si la proforma requiere envío (DELIVERY o PICKUP)');

                $table->index('requiere_envio');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            if (Schema::hasColumn('proformas', 'requiere_envio')) {
                $table->dropIndex(['requiere_envio']);
                $table->dropColumn('requiere_envio');
            }
        });
    }
};
