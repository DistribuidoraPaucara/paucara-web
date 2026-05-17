<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConteoFisico extends Model
{
    use HasFactory, GeneratesSequentialCode;

    protected $table = 'conteos_fisicos';

    protected $fillable = [
        'codigo_conteo',
        'almacen_id',
        'creado_por',
        'supervisado_por',
        'tipo_conteo',
        'estado',
        'fecha_programada',
        'fecha_inicio',
        'fecha_finalizacion',
        'fecha_aprobacion',
        'descripcion',
        'observaciones',
        'filtros',
        'total_productos_esperados',
        'total_productos_contados',
        'total_diferencias',
        'valor_diferencias',
        'ajustes_aplicados'
    ];

    protected function casts(): array
    {
        return [
            'fecha_programada' => 'date',
            'fecha_inicio' => 'datetime',
            'fecha_finalizacion' => 'datetime',
            'fecha_aprobacion' => 'datetime',
            'filtros' => 'array',
            'total_productos_esperados' => 'decimal:0',
            'total_productos_contados' => 'decimal:0',
            'total_diferencias' => 'decimal:0',
            'valor_diferencias' => 'decimal:2',
            'ajustes_aplicados' => 'boolean',
        ];
    }

    // Estados
    const ESTADO_PLANIFICADO = 'planificado';
    const ESTADO_EN_PROGRESO = 'en_progreso';
    const ESTADO_FINALIZADO = 'finalizado';
    const ESTADO_APROBADO = 'aprobado';
    const ESTADO_CANCELADO = 'cancelado';

    // Tipos de conteo
    const TIPO_CICLICO = 'ciclico';
    const TIPO_GENERAL = 'general';
    const TIPO_POR_CATEGORIA = 'por_categoria';
    const TIPO_SPOT = 'spot';

    // Relaciones
    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class);
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por');
    }

    public function supervisadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisado_por');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleConteoFisico::class);
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->whereIn('estado', [self::ESTADO_PLANIFICADO, self::ESTADO_EN_PROGRESO]);
    }

    public function scopeProgramadosHoy($query)
    {
        return $query->where('fecha_programada', today());
    }

    public function scopeEnProgreso($query)
    {
        return $query->where('estado', self::ESTADO_EN_PROGRESO);
    }

    public function scopeFinalizados($query)
    {
        return $query->where('estado', self::ESTADO_FINALIZADO);
    }

    public function scopeConDiferencias($query)
    {
        return $query->where('total_diferencias', '>', 0);
    }

    // Métodos auxiliares
    public function puedeIniciar(): bool
    {
        return $this->estado === self::ESTADO_PLANIFICADO;
    }

    public function puedeFinalizar(): bool
    {
        return $this->estado === self::ESTADO_EN_PROGRESO;
    }

    public function puedeAprobar(): bool
    {
        return $this->estado === self::ESTADO_FINALIZADO;
    }

    public function puedeCancelar(): bool
    {
        return in_array($this->estado, [self::ESTADO_PLANIFICADO, self::ESTADO_EN_PROGRESO]);
    }

    public function iniciar($userId): bool
    {
        if (!$this->puedeIniciar()) {
            return false;
        }

        $this->estado = self::ESTADO_EN_PROGRESO;
        $this->fecha_inicio = now();

        return $this->save();
    }

    public function finalizar($userId): bool
    {
        if (!$this->puedeFinalizar()) {
            return false;
        }

        // Calcular totales
        $this->calcularTotales();

        $this->estado = self::ESTADO_FINALIZADO;
        $this->fecha_finalizacion = now();

        return $this->save();
    }

    public function aprobar($userId, $aplicarAjustes = true): bool
    {
        if (!$this->puedeAprobar()) {
            return false;
        }

        if ($aplicarAjustes && !$this->ajustes_aplicados) {
            $this->aplicarAjustes();
        }

        $this->estado = self::ESTADO_APROBADO;
        $this->fecha_aprobacion = now();
        $this->supervisado_por = $userId;

        return $this->save();
    }

    public function cancelar($motivo = null): bool
    {
        if (!$this->puedeCancelar()) {
            return false;
        }

        $this->estado = self::ESTADO_CANCELADO;

        if ($motivo) {
            $this->observaciones = $this->observaciones
                ? $this->observaciones . "\n" . $motivo
                : $motivo;
        }

        return $this->save();
    }

    public function calcularTotales(): void
    {
        $detalles = $this->detalles;

        $this->total_productos_esperados = $detalles->count();
        $this->total_productos_contados = $detalles->whereNotNull('cantidad_contada')->count();
        $this->total_diferencias = $detalles->where('diferencia', '!=', 0)->count();
        $this->valor_diferencias = $detalles->sum('valor_diferencia');

        $this->save();
    }

    public function aplicarAjustes(): bool
    {
        if ($this->ajustes_aplicados) {
            return false;
        }

        \DB::transaction(function() {
            foreach ($this->detalles as $detalle) {
                if ($detalle->diferencia != 0 && $detalle->stockProducto) {
                    // Registrar movimiento de ajuste
                    MovimientoInventario::registrar(
                        $detalle->stockProducto->producto_id,
                        $this->almacen_id,
                        $detalle->diferencia,
                        $detalle->diferencia > 0 ? MovimientoInventario::TIPO_ENTRADA_AJUSTE : MovimientoInventario::TIPO_SALIDA_AJUSTE,
                        "Ajuste por conteo físico #{$this->codigo_conteo}",
                        auth()->id() ?? $this->supervisado_por
                    );
                }

                $detalle->estado_item = 'ajustado';
                $detalle->save();
            }
        });

        $this->ajustes_aplicados = true;
        return $this->save();
    }

    public function porcentajeCompletado(): float
    {
        if ($this->total_productos_esperados == 0) {
            return 0;
        }

        return ($this->total_productos_contados / $this->total_productos_esperados) * 100;
    }

    public function tieneDiferenciasSignificativas($umbral = 1000): bool
    {
        return abs($this->valor_diferencias) > $umbral;
    }

    /**
     * Generar código de conteo físico
     * ✅ CONSOLIDADO: Usa GeneratesSequentialCode trait
     */
    public static function generarCodigo(): string
    {
        return static::generateSequentialCode('CF', 'codigo', true, 'Y', 6);
    }

    public static function programarConteosCiclicos($almacenId, $frecuenciaDias = 30)
    {
        $almacen = Almacen::find($almacenId);
        if (!$almacen) {
            return false;
        }

        // Obtener productos que necesitan conteo cíclico
        $productos = StockProducto::where('almacen_id', $almacenId)
                                 ->with('producto')
                                 ->get()
                                 ->groupBy(function($item) use ($frecuenciaDias) {
                                     // Agrupar por semanas para distribuir el trabajo
                                     return $item->producto->categoria_id % 4; // 4 semanas
                                 });

        $conteosProgramados = [];

        foreach ($productos as $semana => $productosGrupo) {
            $fechaProgramada = now()->addWeeks($semana);

            $conteo = new self([
                'codigo_conteo' => self::generarCodigo(),
                'almacen_id' => $almacenId,
                'creado_por' => auth()->id(),
                'tipo_conteo' => self::TIPO_CICLICO,
                'fecha_programada' => $fechaProgramada,
                'descripcion' => "Conteo cíclico programado - Semana " . ($semana + 1),
                'filtros' => [
                    'productos' => $productosGrupo->pluck('producto_id')->toArray()
                ]
            ]);

            if ($conteo->save()) {
                $conteosProgramados[] = $conteo;
            }
        }

        return $conteosProgramados;
    }
}