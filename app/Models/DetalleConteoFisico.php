<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleConteoFisico extends Model
{
    use HasFactory;

    protected $table = 'detalle_conteos_fisicos';

    protected $fillable = [
        'conteo_fisico_id',
        'producto_id',
        'stock_producto_id',
        'lote',
        'fecha_vencimiento',
        'cantidad_sistema',
        'cantidad_contada',
        'diferencia',
        'valor_unitario',
        'valor_diferencia',
        'estado_item',
        'observaciones',
        'contado_por',
        'fecha_conteo',
        'requiere_reconteo',
        'motivo_diferencia'
    ];

    protected function casts(): array
    {
        return [
            'fecha_vencimiento' => 'date',
            'cantidad_sistema' => 'decimal:4',
            'cantidad_contada' => 'decimal:4',
            'diferencia' => 'decimal:4',
            'valor_unitario' => 'decimal:4',
            'valor_diferencia' => 'decimal:2',
            'fecha_conteo' => 'datetime',
            'requiere_reconteo' => 'boolean',
        ];
    }

    // Estados del item
    const ESTADO_PENDIENTE = 'pendiente';
    const ESTADO_CONTADO = 'contado';
    const ESTADO_CON_DIFERENCIA = 'con_diferencia';
    const ESTADO_AJUSTADO = 'ajustado';

    // Relaciones
    public function conteoFisico(): BelongsTo
    {
        return $this->belongsTo(ConteoFisico::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function stockProducto(): BelongsTo
    {
        return $this->belongsTo(StockProducto::class);
    }

    public function contadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contado_por');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado_item', self::ESTADO_PENDIENTE);
    }

    public function scopeContados($query)
    {
        return $query->whereNotNull('cantidad_contada');
    }

    public function scopeConDiferencias($query)
    {
        return $query->where('diferencia', '!=', 0);
    }

    public function scopeDiferenciasMayoresA($query, $umbral)
    {
        return $query->where('diferencia', '>', $umbral)
                    ->orWhere('diferencia', '<', -$umbral);
    }

    public function scopeRequierenReconteo($query)
    {
        return $query->where('requiere_reconteo', true);
    }

    // Métodos auxiliares
    public function registrarConteo($cantidadContada, $userId, $observaciones = null): bool
    {
        if ($this->estado_item === self::ESTADO_AJUSTADO) {
            return false;
        }

        $this->cantidad_contada = $cantidadContada;
        $this->contado_por = $userId;
        $this->fecha_conteo = now();

        if ($observaciones) {
            $this->observaciones = $observaciones;
        }

        // Calcular diferencia
        $this->calcularDiferencia();

        // Determinar estado
        if ($this->diferencia == 0) {
            $this->estado_item = self::ESTADO_CONTADO;
        } else {
            $this->estado_item = self::ESTADO_CON_DIFERENCIA;

            // Marcar para reconteo si la diferencia es significativa
            if ($this->esDiferenciaSignificativa()) {
                $this->requiere_reconteo = true;
            }
        }

        return $this->save();
    }

    public function calcularDiferencia(): void
    {
        if ($this->cantidad_contada !== null) {
            $this->diferencia = $this->cantidad_contada - $this->cantidad_sistema;
            $this->valor_diferencia = $this->diferencia * $this->valor_unitario;
        }
    }

    public function esDiferenciaSignificativa($umbralPorcentaje = 10, $umbralValor = 100): bool
    {
        if ($this->diferencia == 0) {
            return false;
        }

        // Verificar por porcentaje
        if ($this->cantidad_sistema > 0) {
            $porcentajeDiferencia = abs($this->diferencia / $this->cantidad_sistema) * 100;
            if ($porcentajeDiferencia > $umbralPorcentaje) {
                return true;
            }
        }

        // Verificar por valor
        if (abs($this->valor_diferencia) > $umbralValor) {
            return true;
        }

        return false;
    }

    public function marcarParaReconteo($motivo = null): bool
    {
        $this->requiere_reconteo = true;

        if ($motivo) {
            $this->motivo_diferencia = $motivo;
        }

        return $this->save();
    }

    public function realizarReconteo($nuevaCantidad, $userId, $observaciones = null): bool
    {
        if (!$this->requiere_reconteo) {
            return false;
        }

        // Guardar el conteo anterior en observaciones
        $observacionesAnteriores = "Reconteo - Cantidad anterior: {$this->cantidad_contada}";
        if ($this->observaciones) {
            $observacionesAnteriores = $this->observaciones . "\n" . $observacionesAnteriores;
        }

        if ($observaciones) {
            $observacionesAnteriores .= "\n" . $observaciones;
        }

        // Registrar el nuevo conteo
        $this->registrarConteo($nuevaCantidad, $userId, $observacionesAnteriores);

        // Quitar la marca de reconteo
        $this->requiere_reconteo = false;

        return $this->save();
    }

    public function getStatusColorAttribute(): string
    {
        switch ($this->estado_item) {
            case self::ESTADO_PENDIENTE:
                return 'gray';
            case self::ESTADO_CONTADO:
                return $this->diferencia == 0 ? 'green' : 'yellow';
            case self::ESTADO_CON_DIFERENCIA:
                return $this->requiere_reconteo ? 'red' : 'orange';
            case self::ESTADO_AJUSTADO:
                return 'blue';
            default:
                return 'gray';
        }
    }

    public function getStatusTextAttribute(): string
    {
        switch ($this->estado_item) {
            case self::ESTADO_PENDIENTE:
                return 'Pendiente';
            case self::ESTADO_CONTADO:
                return $this->diferencia == 0 ? 'Sin diferencia' : 'Con diferencia';
            case self::ESTADO_CON_DIFERENCIA:
                return $this->requiere_reconteo ? 'Requiere reconteo' : 'Con diferencia';
            case self::ESTADO_AJUSTADO:
                return 'Ajustado';
            default:
                return 'Desconocido';
        }
    }

    public function getDiferenciaFormateadaAttribute(): string
    {
        if ($this->diferencia == 0) {
            return '0';
        }

        $signo = $this->diferencia > 0 ? '+' : '';
        return $signo . number_format($this->diferencia, 2);
    }

    public function getValorDiferenciaFormateadaAttribute(): string
    {
        if ($this->valor_diferencia == 0) {
            return '$0.00';
        }

        $signo = $this->valor_diferencia > 0 ? '+' : '';
        return $signo . '$' . number_format($this->valor_diferencia, 2);
    }

    // Eventos del modelo
    protected static function booted()
    {
        static::saving(function ($detalle) {
            // Recalcular diferencia automáticamente al guardar
            if ($detalle->cantidad_contada !== null) {
                $detalle->calcularDiferencia();
            }
        });
    }
}