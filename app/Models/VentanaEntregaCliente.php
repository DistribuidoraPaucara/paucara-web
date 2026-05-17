<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentanaEntregaCliente extends Model
{
    use HasFactory;

    protected $table = 'ventanas_entrega_cliente';

    protected $fillable = [
        'cliente_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'hora_inicio' => 'string', // 🔧 Cambiar a string para evitar issues con datetime
            'hora_fin' => 'string', // 🔧 Cambiar a string para evitar issues con datetime
        ];
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
