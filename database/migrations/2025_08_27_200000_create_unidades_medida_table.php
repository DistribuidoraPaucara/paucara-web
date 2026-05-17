<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidades_medida', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique();
            $table->string('nombre');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // seed básicos
        if (class_exists('Illuminate\\Support\\Facades\\DB')) {
            \Illuminate\Support\Facades\DB::table('unidades_medida')->insert([
                ['codigo' => 'UN', 'nombre' => 'Unidad', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'KG', 'nombre' => 'Kilogramo', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'G', 'nombre' => 'Gramo', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'LT', 'nombre' => 'Litro', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'ML', 'nombre' => 'Mililitro', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'PAQ', 'nombre' => 'Paquete', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
                ['codigo' => 'CAJA', 'nombre' => 'Caja', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        // añadir columna FK y migrar datos desde string si existe
        Schema::table('productos', function (Blueprint $table) {
            if (! Schema::hasColumn('productos', 'unidad_medida_id')) {
                $table->foreignId('unidad_medida_id')->nullable()->after('peso')->constrained('unidades_medida')->nullOnDelete();
            }
        });

        if (Schema::hasColumn('productos', 'unidad_medida')) {
            // mapear valores actuales a IDs
            $pairs = \Illuminate\Support\Facades\DB::table('unidades_medida')->pluck('id', 'codigo'); // [codigo=>id]
            $productos = \Illuminate\Support\Facades\DB::table('productos')->select('id', 'unidad_medida')->get();
            foreach ($productos as $p) {
                $codigo = $p->unidad_medida ?? 'UN';
                $unidadId = $pairs[$codigo] ?? null;
                \Illuminate\Support\Facades\DB::table('productos')->where('id', $p->id)->update(['unidad_medida_id' => $unidadId]);
            }
            Schema::table('productos', function (Blueprint $table) {
                $table->dropColumn('unidad_medida');
            });
        }
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos', 'unidad_medida_id')) {
                $table->dropConstrainedForeignId('unidad_medida_id');
            }
        });
        Schema::dropIfExists('unidades_medida');
    }
};
