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
        // Esta tabla se elimina en la migración 2026_01_19_155858_drop_choferes_legacy_with_constraints
        // que primero elimina las restricciones FK
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No restaurar (tabla obsoleta)
    }
};
