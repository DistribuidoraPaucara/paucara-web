<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotoLugarCliente extends Model
{
    use HasFactory;

    protected $table = 'fotos_lugar_cliente';

    public $timestamps = false;

    protected $fillable = [
        'cliente_id',
        'direccion_cliente_id',
        'url',
        'descripcion',
        'fecha_captura',
    ];

    protected function casts(): array
    {
        return [
            'fecha_captura' => 'datetime',
        ];
    }

    /**
     * Obtiene el cliente asociado a esta foto.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Obtiene la dirección del cliente asociada a esta foto, si existe.
     */
    public function direccion()
    {
        return $this->belongsTo(DireccionCliente::class, 'direccion_cliente_id');
    }
}
