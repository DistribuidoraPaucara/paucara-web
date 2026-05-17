<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            [
                'codigo' => 'BORRADOR',
                'nombre' => 'Borrador',
                'descripcion' => 'Documento en edición',
                'color' => '#6B7280',
                'permite_edicion' => true,
                'permite_anulacion' => true,
                'es_estado_final' => false,
                'activo' => true,
            ],
            [
                'codigo' => 'PENDIENTE',
                'nombre' => 'Pendiente',
                'descripcion' => 'Pendiente de aprobación',
                'color' => '#F59E0B',
                'permite_edicion' => true,
                'permite_anulacion' => true,
                'es_estado_final' => false,
                'activo' => true,
            ],
            [
                'codigo' => 'APROBADO',
                'nombre' => 'Aprobado',
                'descripcion' => 'Documento aprobado',
                'color' => '#10B981',
                'permite_edicion' => false,
                'permite_anulacion' => true,
                'es_estado_final' => false,
                'activo' => true,
            ],
            [
                'codigo' => 'FACTURADO',
                'nombre' => 'Facturado',
                'descripcion' => 'Documento facturado',
                'color' => '#3B82F6',
                'permite_edicion' => false,
                'permite_anulacion' => false,
                'es_estado_final' => true,
                'activo' => true,
            ],
            [
                'codigo' => 'ANULADO',
                'nombre' => 'Anulado',
                'descripcion' => 'Documento anulado',
                'color' => '#EF4444',
                'permite_edicion' => false,
                'permite_anulacion' => false,
                'es_estado_final' => true,
                'activo' => true,
            ],
            [
                'codigo' => 'CANCELADO',
                'nombre' => 'Cancelado',
                'descripcion' => 'Documento cancelado',
                'color' => '#DC2626',
                'permite_edicion' => false,
                'permite_anulacion' => false,
                'es_estado_final' => true,
                'activo' => true,
            ],
        ];

        foreach ($estados as $estado) {
            DB::table('estados_documento')->insertOrIgnore($estado);
        }
    }
}
