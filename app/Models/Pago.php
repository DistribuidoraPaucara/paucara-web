<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_pago', // ✅ NUEVO: Número único y secuencial de pago
        'cuenta_por_pagar_id',
        'cuenta_por_cobrar_id',
        'venta_id', // Mantener para compatibilidad con ventas
        'caja_id', // ✅ NUEVO (2026-02-11): Caja en la que se registró el pago
        'tipo_pago_id',
        'monto',
        'fecha',
        'fecha_pago',
        'numero_recibo',
        'numero_transferencia',
        'numero_cheque',
        'observaciones',
        'usuario_id',
        'moneda_id',
        'estado', // REGISTRADO o ANULADO
    ];

    protected function casts(): array
    {
        return [
            'monto'      => 'decimal:2',
            'fecha'      => 'datetime',
            'fecha_pago' => 'date',
        ];
    }

    // Relaciones
    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function cuentaPorPagar()
    {
        return $this->belongsTo(CuentaPorPagar::class);
    }

    public function cuentaPorCobrar()
    {
        return $this->belongsTo(CuentaPorCobrar::class);
    }

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function tipoPago()
    {
        return $this->belongsTo(TipoPago::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function moneda()
    {
        return $this->belongsTo(Moneda::class);
    }

    public function movimientosCaja()  // ✅ NUEVO: Relación con movimientos de caja
    {
        return $this->hasMany(MovimientoCaja::class, 'pago_id');
    }

    // Alias para compatibilidad con código existente (singular)
    public function movimientoCaja()
    {
        return $this->hasOne(MovimientoCaja::class, 'pago_id');
    }

    // Scopes
    public function scopePorTipoPago($query, $tipoPagoId)
    {
        return $query->where('tipo_pago_id', $tipoPagoId);
    }

    public function scopePorFechaRango($query, $fechaDesde, $fechaHasta)
    {
        return $query->whereBetween('fecha_pago', [$fechaDesde, $fechaHasta]);
    }

    public function scopePorMes($query, $mes = null, $año = null)
    {
        $mes  = $mes ?? now()->month;
        $año = $año ?? now()->year;

        return $query->whereMonth('fecha_pago', $mes)
            ->whereYear('fecha_pago', $año);
    }

    // ✅ Scopes para filtrar por estado
    public function scopeRegistrados($query)
    {
        return $query->where('estado', 'REGISTRADO');
    }

    public function scopeAnulados($query)
    {
        return $query->where('estado', 'ANULADO');
    }

    public function scopeActivos($query)
    {
        return $query->where('estado', '!=', 'ANULADO');
    }

    // Métodos auxiliares
    public function getNumeroTransaccionAttribute()
    {
        return $this->numero_recibo ?? $this->numero_transferencia ?? $this->numero_cheque;
    }

    /**
     * Generar número de pago único y secuencial
     * Formato: PAGO-YYYYMMDD-00001 (ejemplo: PAGO-20260202-00001)
     */
    public static function generarNumeroPago(): string
    {
        $hoy = now()->format('Ymd');

        // Obtener el último número de pago del día
        $ultimoPago = static::where('numero_pago', 'like', "PAGO-{$hoy}-%")
            ->orderByDesc('numero_pago')
            ->first();

        if ($ultimoPago) {
            // Extraer el número secuencial del último pago
            preg_match('/PAGO-\d+-(\d+)/', $ultimoPago->numero_pago, $matches);
            $secuencial = (int) $matches[1] + 1;
        } else {
            $secuencial = 1;
        }

        return sprintf('PAGO-%s-%05d', $hoy, $secuencial);
    }
}
