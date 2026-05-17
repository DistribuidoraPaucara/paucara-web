<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    use HasFactory, HasActiveScope;

    protected $fillable = [
        'user_id',
        'nombre',
        'ubicacion',
        'monto_inicial_dia',
        'activa',
    ];

    protected function casts(): array
    {
        return [
            'monto_inicial_dia' => 'decimal:2',
            'activa' => 'boolean',
        ];
    }

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class);
    }

    public function aperturas()
    {
        return $this->hasMany(AperturaCaja::class);
    }

    public function cierres()
    {
        return $this->hasMany(CierreCaja::class);
    }

    // Métodos de negocio
    public function obtenerSaldoActual()
    {
        return $this->movimientos()
            ->whereDate('fecha', today())
            ->sum('monto');
    }

    public function estaAbierta()
    {
        return $this->aperturas()
            ->whereDate('fecha', today())
            ->whereDoesntHave('cierre')
            ->exists();
    }
}
