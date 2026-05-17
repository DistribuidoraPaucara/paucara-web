<?php
namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class TransferenciaInventario extends Model
{
    use HasFactory, GeneratesSequentialCode;

    protected $fillable = [
        'numero',
        'fecha',
        'almacen_origen_id',
        'almacen_destino_id',
        'vehiculo_id',
        'chofer_id',
        'usuario_id',
        'fecha_envio',
        'fecha_recepcion',
        'estado',
        'observaciones',
        'total_productos',
        'total_cantidad',
    ];

    protected function casts(): array
    {
        return [
            'fecha'           => 'datetime',
            'fecha_envio'     => 'datetime',
            'fecha_recepcion' => 'datetime',
        ];
    }

    // Estados de transferencia
    const ESTADO_BORRADOR = 'BORRADOR';

    const ESTADO_ENVIADO = 'ENVIADO';

    const ESTADO_RECIBIDO = 'RECIBIDO';

    const ESTADO_CANCELADO = 'CANCELADO';

    /**
     * Almacén origen
     */
    public function almacenOrigen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class, 'almacen_origen_id');
    }

    /**
     * Almacén destino
     */
    public function almacenDestino(): BelongsTo
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }

    /**
     * Vehículo asignado
     */
    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }

    /**
     * Chofer asignado (empleado con rol Chofer)
     */
    public function chofer(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'chofer_id');
    }

    /**
     * Usuario que creó la transferencia
     */
    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Alias para la relación creadoPor (para compatibilidad)
     */
    public function usuario(): BelongsTo
    {
        return $this->creadoPor();
    }

    /**
     * Detalles de la transferencia
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleTransferenciaInventario::class, 'transferencia_id');
    }

    /**
     * Enviar transferencia
     */
    public function enviar(): void
    {
        if ($this->estado !== self::ESTADO_BORRADOR) {
            throw new \Exception('Solo se pueden enviar transferencias en borrador');
        }

        DB::transaction(function () {
            // Crear movimientos de salida en el almacén origen
            foreach ($this->detalles as $detalle) {
                // Buscar el stock del producto en el almacén origen
                $stockProducto = StockProducto::where('producto_id', $detalle->producto_id)
                    ->where('almacen_id', $this->almacen_origen_id)
                    ->first();

                if (! $stockProducto) {
                    throw new \Exception("No se encontró stock para el producto {$detalle->producto->nombre} en el almacén origen");
                }

                if ($stockProducto->cantidad_disponible < $detalle->cantidad) {
                    throw new \Exception("Stock insuficiente para el producto {$detalle->producto->nombre}. Disponible: {$stockProducto->cantidad_disponible}, Requerido: {$detalle->cantidad}");
                }

                MovimientoInventario::registrar(
                    $stockProducto,
                    -$detalle->cantidad,
                    'SALIDA_TRANSFERENCIA',
                    "Transferencia {$this->numero} - Envío a {$this->almacenDestino->nombre}",
                    $this->numero,
                    $this->usuario_id
                );
            }

            $this->update([
                'estado'      => self::ESTADO_ENVIADO,
                'fecha_envio' => now(),
            ]);
        });
    }

    /**
     * Recibir transferencia
     */
    public function recibir(): void
    {
        if ($this->estado !== self::ESTADO_ENVIADO) {
            throw new \Exception('Solo se pueden recibir transferencias enviadas');
        }

        DB::transaction(function () {
            // Crear movimientos de entrada en el almacén destino
            foreach ($this->detalles as $detalle) {
                // Buscar o crear stock en el almacén destino
                $stockOrigen = StockProducto::where('producto_id', $detalle->producto_id)
                    ->where('almacen_id', $this->almacen_origen_id)
                    ->first();

                $stockDestino = StockProducto::firstOrCreate(
                    [
                        'producto_id' => $detalle->producto_id,
                        'almacen_id'  => $this->almacen_destino_id,
                    ],
                    [
                        'cantidad'          => 0,
                        'precio_promedio'   => $stockOrigen ? $stockOrigen->precio_promedio : $detalle->producto->precio_compra,
                        'stock_minimo'      => $stockOrigen ? $stockOrigen->stock_minimo : 0,
                        'fecha_vencimiento' => $detalle->fecha_vencimiento,
                    ]
                );

                MovimientoInventario::registrar(
                    $stockDestino,
                    $detalle->cantidad,
                    'ENTRADA_TRANSFERENCIA',
                    "Transferencia {$this->numero} - Recepción desde {$this->almacenOrigen->nombre}",
                    $this->numero,
                    $this->usuario_id
                );

                // Actualizar cantidad recibida en el detalle
                $detalle->update([
                    'cantidad_recibida' => $detalle->cantidad,
                ]);
            }

            $this->update([
                'estado'          => self::ESTADO_RECIBIDO,
                'fecha_recepcion' => now(),
            ]);
        });
    }

    /**
     * Cancelar transferencia
     */
    public function cancelar(string $motivo): void
    {
        if ($this->estado === self::ESTADO_RECIBIDO) {
            throw new \Exception('No se puede cancelar una transferencia ya recibida');
        }

        DB::transaction(function () use ($motivo) {
            // Si ya fue enviada, restaurar stock en el almacén origen
            if ($this->estado === self::ESTADO_ENVIADO) {
                foreach ($this->detalles as $detalle) {
                    $stockProducto = StockProducto::where('producto_id', $detalle->producto_id)
                        ->where('almacen_id', $this->almacen_origen_id)
                        ->first();

                    if ($stockProducto) {
                        MovimientoInventario::registrar(
                            $stockProducto,
                            $detalle->cantidad,
                            MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                            "Cancelación transferencia {$this->numero} - {$motivo}",
                            "CANCEL-{$this->numero}",
                            $this->usuario_id
                        );
                    }
                }
            }

            $this->update([
                'estado'        => self::ESTADO_CANCELADO,
                'observaciones' => ($this->observaciones ? $this->observaciones . "\n" : '') . 'CANCELADO: ' . $motivo,
            ]);
        });
    }

    /**
     * Generar número de transferencia
     * ✅ CONSOLIDADO: Usa GeneratesSequentialCode trait
     */
    public static function generarNumero(): string
    {
        return static::generateSequentialCode('TRANS', 'numero', true, 'Ymd', 6);
    }

    /**
     * Scope para transferencias por estado
     */
    public function scopePorEstado($query, string $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para transferencias pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', self::ESTADO_BORRADOR);
    }

    /**
     * Scope para transferencias enviadas
     */
    public function scopeEnviadas($query)
    {
        return $query->where('estado', self::ESTADO_ENVIADO);
    }

    /**
     * Obtener lista de estados disponibles
     */
    public static function getEstados(): array
    {
        return [
            [
                'value' => self::ESTADO_BORRADOR,
                'label' => 'Borrador',
                'color' => 'gray',
            ],
            [
                'value' => self::ESTADO_ENVIADO,
                'label' => 'Enviado',
                'color' => 'blue',
            ],
            [
                'value' => self::ESTADO_RECIBIDO,
                'label' => 'Recibido',
                'color' => 'green',
            ],
            [
                'value' => self::ESTADO_CANCELADO,
                'label' => 'Cancelado',
                'color' => 'red',
            ],
        ];
    }

    /**
     * Scope para transferencias por almacén (origen o destino)
     */
    public function scopePorAlmacen($query, int $almacenId)
    {
        return $query->where(function ($q) use ($almacenId) {
            $q->where('almacen_origen_id', $almacenId)
                ->orWhere('almacen_destino_id', $almacenId);
        });
    }

    /**
     * Scope para transferencias por rango de fechas
     */
    public function scopePorFecha($query, $fechaInicio, $fechaFin = null)
    {
        if (! $fechaFin) {
            $fechaFin = $fechaInicio;
        }

        return $query->whereBetween('fecha', [$fechaInicio, $fechaFin]);
    }
}
