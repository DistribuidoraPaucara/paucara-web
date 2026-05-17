<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReporteCargaDetalle extends Model
{
    use HasFactory;

    protected $table = 'reporte_carga_detalles';

    protected $fillable = [
        'reporte_carga_id',
        'detalle_venta_id',
        'producto_id',
        'cantidad_solicitada',
        'cantidad_cargada',
        'peso_kg',
        'notas',
        'verificado',
        'verificado_por',
        'fecha_verificacion',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_solicitada' => 'integer',
            'cantidad_cargada' => 'integer',
            'peso_kg' => 'decimal:2',
            'verificado' => 'boolean',
            'fecha_verificacion' => 'datetime',
        ];
    }

    /**
     * Relaciones
     */

    /**
     * Reporte de carga al que pertenece este detalle
     */
    public function reporteCarga(): BelongsTo
    {
        return $this->belongsTo(ReporteCarga::class);
    }

    /**
     * Detalle de venta original (puede ser null si es desde entregas)
     */
    public function detalleVenta(): BelongsTo
    {
        return $this->belongsTo(DetalleVenta::class);
    }

    /**
     * Producto que se está cargando
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Usuario que verificó la carga
     */
    public function verificador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verificado_por');
    }

    /**
     * Métodos útiles
     */

    /**
     * Verificar si la carga está completa para esta línea
     */
    public function estaCargadoCompleto(): bool
    {
        return $this->cantidad_cargada >= $this->cantidad_solicitada;
    }

    /**
     * Obtener diferencia entre solicitado y cargado
     */
    public function getDiferenciaAttribute(): int
    {
        return $this->cantidad_solicitada - $this->cantidad_cargada;
    }

    /**
     * Obtener porcentaje cargado para esta línea
     */
    public function getPorcentajeCargadoAttribute(): float
    {
        if ($this->cantidad_solicitada === 0) {
            return 0;
        }

        return round(($this->cantidad_cargada / $this->cantidad_solicitada) * 100, 2);
    }

    /**
     * Marcar como verificado
     */
    public function marcarVerificado(?int $usuarioId = null): void
    {
        $this->update([
            'verificado' => true,
            'verificado_por' => $usuarioId,
            'fecha_verificacion' => now(),
        ]);
    }
}
