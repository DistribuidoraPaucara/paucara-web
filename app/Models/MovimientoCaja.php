<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    use HasFactory;

    protected $table = 'movimientos_caja';

    public $timestamps = false;

    protected $fillable = [
        'caja_id',
        'user_id',
        'apertura_caja_id',  // ✅ NUEVO: Referencia directa a apertura
        'fecha',
        'monto',
        'observaciones',
        'numero_documento',
        'tipo_operacion_id',
        'tipo_pago_id',  // ✅ NUEVO: Tipo de pago asociado al movimiento
        'venta_id',      // ✅ NUEVO: ID de venta para análisis de rango
        'pago_id',       // ✅ NUEVO: ID de pago para análisis de rango
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'datetime',
            'monto' => 'float',
        ];
    }

    // Relaciones
    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function apertura()  // ✅ NUEVO: Relación con apertura de caja
    {
        return $this->belongsTo(AperturaCaja::class, 'apertura_caja_id');
    }

    public function tipoOperacion()
    {
        return $this->belongsTo(TipoOperacionCaja::class, 'tipo_operacion_id');
    }

    public function tipoPago()  // ✅ NUEVO: Relación con tipo de pago
    {
        return $this->belongsTo(TipoPago::class, 'tipo_pago_id');
    }

    public function venta()  // ✅ NUEVO: Relación con venta
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    public function pago()  // ✅ NUEVO: Relación con pago
    {
        return $this->belongsTo(Pago::class, 'pago_id');
    }

    public function comprobantes()
    {
        return $this->hasMany(ComprobanteMovimiento::class, 'movimiento_caja_id');
    }

    // Scopes
    public function scopeIngresos($query)
    {
        return $query->where('monto', '>', 0);
    }

    public function scopeEgresos($query)
    {
        return $query->where('monto', '<', 0);
    }

    public function scopeDelDia($query, $fecha = null)
    {
        $fecha = $fecha ?? today();

        return $query->whereDate('fecha', $fecha);
    }
}
