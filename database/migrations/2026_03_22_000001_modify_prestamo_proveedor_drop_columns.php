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
            // Agregar nuevos campos
            if (!Schema::hasColumn('prestamo_proveedor', 'compra_id')) {
                $table->foreignId('compra_id')->nullable()->constrained('compras')->nullOnDelete();
            }
            if (!Schema::hasColumn('prestamo_proveedor', 'monto_garantia')) {
                $table->decimal('monto_garantia', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('prestamo_proveedor', 'observaciones')) {
                $table->text('observaciones')->nullable();
            }
        });

        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Quitar campos antiguos
            $table->dropForeign(['prestable_id']);
            $table->dropColumn([
                'prestable_id',
                'cantidad',
                'precio_unitario',
                'numero_documento',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Agregar de vuelta campos antiguos
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('restrict');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 12, 2)->nullable();
            $table->string('numero_documento')->nullable();
        });

        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Quitar nuevos campos
            $table->dropForeign(['compra_id']);
            $table->dropColumn([
                'compra_id',
                'monto_garantia',
                'observaciones',
            ]);
        });
    }
};
