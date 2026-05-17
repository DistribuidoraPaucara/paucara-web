<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $zonas = DB::table('zonas')->get();

        foreach ($zonas as $zona) {
            if (!$zona->localidades) {
                continue;
            }

            $localidadesArray = json_decode($zona->localidades, true);
            if (!is_array($localidadesArray)) {
                continue;
            }

            foreach ($localidadesArray as $localidadData) {
                $localidadId = $this->resolverLocalidadId($localidadData);

                if ($localidadId) {
                    DB::table('localidad_zona')->insertOrIgnore([
                        'zona_id' => $zona->id,
                        'localidad_id' => $localidadId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restaurar JSON desde pivot
        $zonas = DB::table('zonas')->get();

        foreach ($zonas as $zona) {
            $localidadesIds = DB::table('localidad_zona')
                ->where('zona_id', $zona->id)
                ->pluck('localidad_id')
                ->toArray();

            DB::table('zonas')
                ->where('id', $zona->id)
                ->update(['localidades' => json_encode($localidadesIds)]);
        }

        DB::table('localidad_zona')->truncate();
    }

    /**
     * Resolver localidad ID desde diferentes formatos
     */
    private function resolverLocalidadId($data)
    {
        // Si es número, asumir que es ID
        if (is_numeric($data)) {
            return DB::table('localidades')->where('id', $data)->exists() ? $data : null;
        }

        // Si es string, buscar por nombre o código
        if (is_string($data)) {
            return DB::table('localidades')
                ->where('nombre', $data)
                ->orWhere('codigo', $data)
                ->value('id');
        }

        // Si es array con 'id'
        if (is_array($data) && isset($data['id'])) {
            return $data['id'];
        }

        return null;
    }
};
