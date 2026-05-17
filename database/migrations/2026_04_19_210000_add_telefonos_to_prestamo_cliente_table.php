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
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->string('telefono_cliente_1', 25)
                ->nullable()
                ->after('chofer_id');

            $table->string('telefono_cliente_2', 25)
                ->nullable()
                ->after('telefono_cliente_1');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->dropColumn(['telefono_cliente_1', 'telefono_cliente_2']);
        });
    }
};
