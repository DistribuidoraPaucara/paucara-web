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
        if (Schema::hasTable('empleados') && Schema::hasColumn('empleados', 'codigo_empleado')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->string('codigo_empleado')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('empleados') && Schema::hasColumn('empleados', 'codigo_empleado')) {
            Schema::table('empleados', function (Blueprint $table) {
                $table->string('codigo_empleado')->nullable(false)->change();
            });
        }
    }
};
