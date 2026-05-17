<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoDocumento extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'estados_documento';

    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        'activo',
        'permite_edicion',
        'permite_anulacion',
        'es_estado_final',
        'color',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    // Relaciones
    public function compras()
    {
        return $this->hasMany(Compra::class, 'estado_documento_id');
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'estado_documento_id');
    }

    public function proformas()
    {
        return $this->hasMany(Proforma::class, 'estado_documento_id');
    }

    /**
     * Obtener el estado inicial para documentos nuevos
     * Busca por código PENDIENTE, si no existe usa id=2 como fallback
     */
    public static function obtenerEstadoInicial(): int
    {
        $estado = self::where('codigo', 'PENDIENTE')
            ->where('activo', true)
            ->first();

        // Si existe, retorna su ID, si no usa fallback 2
        return $estado?->id ?? 2;
    }

    /**
     * Obtener el estado APROBADO para documentos finalizados
     * Busca por código APROBADA, si no existe usa id=3 como fallback
     */
    public static function obtenerEstadoAprobado(): int
    {
        $estado = self::whereIn('codigo', ['APROBADA', 'APROBADO'])
            ->where('activo', true)
            ->first();

        // Si existe, retorna su ID, si no usa fallback 3
        return $estado?->id ?? 3;
    }
}
