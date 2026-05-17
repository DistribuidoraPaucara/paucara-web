<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory, GeneratesSequentialCode;

    protected $fillable = [
        'numero',
        'fecha',
        'cliente_id',
        'usuario_id',
        'caja_id',
        'descripcion',
        'monto',
        'tipo_pago_id',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'monto' => 'decimal:2',
        ];
    }

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function tipoPago()
    {
        return $this->belongsTo(TipoPago::class);
    }

    // Generar número secuencial (formato: SEC + ID)
    public static function generarNumero(): string
    {
        return static::generateSequentialCode('SEC', 'numero', false, '', 0);
    }
}
