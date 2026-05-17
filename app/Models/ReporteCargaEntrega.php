<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ReporteCargaEntrega
 *
 * Tabla pivot que vincula múltiples entregas a un reporte de carga
 *
 * Permite:
 * - Un reporte consolidado con múltiples entregas
 * - Un reporte individual con una entrega
 * - Auditoría completa del vínculo
 */
class ReporteCargaEntrega extends Model
{
    use HasFactory;

    protected $table = 'reporte_carga_entregas';

    protected $fillable = [
        'reporte_carga_id',
        'entrega_id',
        'orden',
        'incluida_en_carga',
        'notas',
    ];

    protected function casts(): array
    {
        return [
            'incluida_en_carga' => 'boolean',
        ];
    }

    /**
     * Reporte de carga asociado
     */
    public function reporteCarga(): BelongsTo
    {
        return $this->belongsTo(ReporteCarga::class);
    }

    /**
     * Entrega asociada
     */
    public function entrega(): BelongsTo
    {
        return $this->belongsTo(Entrega::class);
    }

    /**
     * Marcar entrega como incluida en carga física
     */
    public function marcarComoIncluida(string $notas = null): void
    {
        $this->update([
            'incluida_en_carga' => true,
            'notas' => $notas,
        ]);
    }

    /**
     * Marcar entrega como no incluida
     */
    public function marcarComoNoIncluida(string $razon = null): void
    {
        $this->update([
            'incluida_en_carga' => false,
            'notas' => $razon,
        ]);
    }
}
