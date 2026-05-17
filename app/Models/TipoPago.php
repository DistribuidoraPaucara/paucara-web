<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPago extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'tipos_pago';

    protected $fillable = [
        'codigo', 'nombre', 'activo', 'es_credito',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'es_credito' => 'boolean',
        ];
    }

    // Relaciones
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'tipo_pago_id');
    }

    public function compras()
    {
        return $this->hasMany(Compra::class, 'tipo_pago_id');
    }

    /**
     * Scope para obtener solo tipos de pago activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Obtener el icono asociado al tipo de pago
     *
     * @return string Nombre del icono de Lucide React
     */
    public function getIcon(): string
    {
        return match($this->codigo) {
            'EFECTIVO' => 'Banknote',
            'TRANSFERENCIA' => 'Send',
            'CREDITO' => 'CreditCard',
            'TARJETA' => 'CreditCard',
            default => 'DollarSign',
        };
    }

    /**
     * Obtener el icono con su información formateada para la API
     */
    public function getIconAttribute(): string
    {
        return $this->getIcon();
    }
}
