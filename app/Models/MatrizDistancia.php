<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatrizDistancia extends Model
{
    protected $table = 'matriz_distancia';

    public $timestamps = false;

    protected $fillable = [
        'punto_origen',
        'punto_destino',
        'distancia_km',
        'tiempo_minutos',
        'metodo_calculo',
        'fecha_actualizacion'
    ];

    protected function casts(): array
    {
        return [
            'distancia_km' => 'float',
            'tiempo_minutos' => 'integer',
            'fecha_actualizacion' => 'datetime'
        ];
    }

    /**
     * Obtener distancia cacheada entre dos puntos
     */
    public static function obtenerDistancia(string $origen, string $destino): ?float
    {
        return self::where('punto_origen', $origen)
            ->where('punto_destino', $destino)
            ->value('distancia_km');
    }

    /**
     * Guardar distancia cacheada
     */
    public static function guardarDistancia(
        string $origen,
        string $destino,
        float $distancia_km,
        int $tiempo_minutos,
        string $metodo = 'HAVERSINE'
    ): self {
        return self::updateOrCreate(
            ['punto_origen' => $origen, 'punto_destino' => $destino],
            [
                'distancia_km' => $distancia_km,
                'tiempo_minutos' => $tiempo_minutos,
                'metodo_calculo' => $metodo,
                'fecha_actualizacion' => now()
            ]
        );
    }
}
