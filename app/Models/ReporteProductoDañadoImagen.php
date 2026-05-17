<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReporteProductoDañadoImagen extends Model
{
    use HasFactory;

    protected $table = 'reporte_producto_danado_imagenes';

    protected $fillable = [
        'reporte_id',
        'ruta_imagen',
        'nombre_archivo',
        'descripcion',
        'fecha_carga',
    ];

    protected function casts(): array
    {
        return [
            'fecha_carga' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación con el reporte
     */
    public function reporte(): BelongsTo
    {
        return $this->belongsTo(ReporteProductoDanado::class, 'reporte_id');
    }

    /**
     * Obtener la URL completa de la imagen
     */
    public function getUrlImagen(): string
    {
        return asset('storage/' . $this->ruta_imagen);
    }
}
