<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UbicacionTracking extends Model
{
    use HasFactory;

    protected $table = 'ubicacion_trackings';

    protected $fillable = [
        'entrega_id',
        'chofer_id',
        'latitud',
        'longitud',
        'altitud',
        'precision',
        'velocidad',
        'rumbo',
        'timestamp',
        'evento',
    ];

    protected function casts(): array
    {
        return [
            'latitud' => 'decimal:7',
            'longitud' => 'decimal:7',
            'altitud' => 'decimal:2',
            'precision' => 'decimal:2',
            'velocidad' => 'decimal:2',
            'rumbo' => 'decimal:2',
            'timestamp' => 'datetime',
        ];
    }

    /**
     * Relaciones
     */

    /**
     * Entrega asociada a esta ubicación
     */
    public function entrega(): BelongsTo
    {
        return $this->belongsTo(Entrega::class);
    }

    /**
     * Chofer que registró esta ubicación (empleado con rol Chofer)
     */
    public function chofer(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'chofer_id');
    }

    /**
     * Scopes
     */

    /**
     * Ubicaciones recientes (últimas N ubicaciones)
     */
    public function scopeRecientes($query, $limite = 50)
    {
        return $query->latest('timestamp')->limit($limite);
    }

    /**
     * Ubicaciones de una entrega específica
     */
    public function scopePorEntrega($query, $entregaId)
    {
        return $query->where('entrega_id', $entregaId);
    }

    /**
     * Métodos útiles
     */

    /**
     * Calcular distancia hacia un punto (Haversine)
     */
    public function distanciaA(float $latDestino, float $lngDestino): float
    {
        $lat1 = deg2rad($this->latitud);
        $lon1 = deg2rad($this->longitud);
        $lat2 = deg2rad($latDestino);
        $lon2 = deg2rad($lngDestino);

        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;

        $a = sin($dlat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dlon / 2) ** 2;
        $c = 2 * asin(sqrt($a));
        $r = 6371; // Radio de la tierra en km

        return $c * $r;
    }
}
