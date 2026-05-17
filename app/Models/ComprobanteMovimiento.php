<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComprobanteMovimiento extends Model
{
    use HasFactory;

    protected $table = 'comprobantes_movimiento';

    protected $fillable = [
        'movimiento_caja_id',
        'user_id',
        'ruta_archivo',
        'nombre_original',
        'tipo_archivo',
        'tamaño',
        'hash',
        'observaciones',
    ];

    /**
     * Relación: Un comprobante pertenece a un movimiento
     */
    public function movimiento(): BelongsTo
    {
        return $this->belongsTo(MovimientoCaja::class, 'movimiento_caja_id');
    }

    /**
     * Relación: Un comprobante fue subido por un usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Obtener la URL pública del comprobante
     */
    public function getUrlAttribute(): string
    {
        return url('storage/' . $this->ruta_archivo);
    }

    /**
     * Formatear tamaño en KB/MB
     */
    public function getTamañoFormateadoAttribute(): string
    {
        $bytes = $this->tamaño;
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Obtener el icono según el tipo de archivo
     */
    public function getIconoAttribute(): string
    {
        $tipo = strtolower($this->tipo_archivo);

        if (strpos($tipo, 'image') !== false) {
            return '🖼️';
        } elseif (strpos($tipo, 'pdf') !== false) {
            return '📄';
        } else {
            return '📎';
        }
    }
}
