<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DireccionCliente extends Model
{
    use HasFactory;

    protected $table = 'direcciones_cliente';

    protected $fillable = [
        'cliente_id', 'localidad_id', 'direccion', 'latitud', 'longitud', 'es_principal', 'activa', 'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'latitud'      => 'float',
            'longitud'     => 'float',
            'es_principal' => 'boolean',
            'activa'       => 'boolean',
        ];
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function localidad()
    {
        return $this->belongsTo(Localidad::class, 'localidad_id');
    }
}
