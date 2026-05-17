<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AsientoContable extends Model
{
    use HasFactory, GeneratesSequentialCode;

    protected $fillable = [
        'numero',
        'fecha',
        'tipo_documento',
        'numero_documento',
        'concepto',
        'total_debe',
        'total_haber',
        'estado',
        'observaciones',
        'asientable_type',
        'asientable_id',
        'usuario_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'total_debe' => 'decimal:2',
            'total_haber' => 'decimal:2',
        ];
    }

    /**
     * Relación polimórfica con el documento origen (Venta, Compra, etc.)
     */
    public function asientable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Detalles del asiento contable
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleAsientoContable::class);
    }

    /**
     * Usuario que creó el asiento
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Boot del modelo para generar número automáticamente
     */
    protected static function booted(): void
    {
        static::creating(function (AsientoContable $asiento) {
            if (empty($asiento->numero)) {
                $asiento->numero = static::generarNumero();
            }
        });
    }

    /**
     * Generar número secuencial del asiento
     * ✅ CONSOLIDADO: Usa GeneratesSequentialCode trait
     */
    public static function generarNumero(): string
    {
        return static::generateSequentialCode('ASI', 'numero', true, 'Y', 6);
    }

    /**
     * Actualizar totales del asiento basado en los detalles
     */
    public function actualizarTotales(): void
    {
        $this->total_debe = $this->detalles()->sum('debe');
        $this->total_haber = $this->detalles()->sum('haber');
        $this->saveQuietly(); // Sin disparar eventos
    }

    /**
     * Verificar si el asiento está balanceado
     */
    public function estaBalanceado(): bool
    {
        return abs($this->total_debe - $this->total_haber) < 0.01;
    }

    /**
     * Crear asiento para venta
     */
    public static function crearParaVenta(Venta $venta): self
    {
        $asiento = static::create([
            'fecha' => $venta->fecha,
            'tipo_documento' => 'VENTA',
            'numero_documento' => $venta->numero,
            'concepto' => "Venta #{$venta->numero} - Cliente: {$venta->cliente?->nombre}",
            'asientable_type' => Venta::class,
            'asientable_id' => $venta->id,
            'usuario_id' => $venta->usuario_id,
        ]);

        // Crear detalles del asiento
        $asiento->crearDetallesVenta($venta);

        // Actualizar totales manualmente
        $asiento->actualizarTotales();

        return $asiento;
    }

    /**
     * Crear detalles contables para una venta
     */
    private function crearDetallesVenta(Venta $venta): void
    {
        $orden = 1;

        // 1. DEBE: Cuentas por Cobrar o Caja (según tipo de pago)
        $cuentaCliente = $venta->tipo_pago === 'CONTADO' ? '1.1.01.001' : '1.1.02.001';
        $nombreCuentaCliente = $venta->tipo_pago === 'CONTADO' ? 'Caja General' : 'Cuentas por Cobrar';

        $this->detalles()->create([
            'codigo_cuenta' => $cuentaCliente,
            'nombre_cuenta' => $nombreCuentaCliente,
            'descripcion' => "Cliente: {$venta->cliente?->nombre}",
            'debe' => $venta->total,
            'haber' => 0,
            'orden' => $orden++,
        ]);

        // 2. HABER: Ventas (sin IVA)
        $this->detalles()->create([
            'codigo_cuenta' => '4.1.01.001',
            'nombre_cuenta' => 'Ventas',
            'descripcion' => 'Venta de productos',
            'debe' => 0,
            'haber' => $venta->subtotal,
            'orden' => $orden++,
        ]);

        // 3. HABER: IVA Débito Fiscal (si aplica)
        if ($venta->impuesto > 0) {
            $this->detalles()->create([
                'codigo_cuenta' => '2.1.03.001',
                'nombre_cuenta' => 'IVA Débito Fiscal',
                'descripcion' => 'IVA 13% sobre ventas',
                'debe' => 0,
                'haber' => $venta->impuesto,
                'orden' => $orden++,
            ]);
        }

        // 4. Registrar costo de ventas si hay información de costo
        $this->registrarCostoVentas($venta, $orden);
    }

    /**
     * Registrar asiento de costo de ventas
     */
    private function registrarCostoVentas(Venta $venta, int &$orden): void
    {
        $costoTotal = 0;

        // Calcular costo total basado en los productos
        foreach ($venta->detalles as $detalle) {
            $costoUnitario = $detalle->producto->precio_compra ?? 0;
            $costoTotal += $costoUnitario * $detalle->cantidad;
        }

        if ($costoTotal > 0) {
            // DEBE: Costo de Ventas
            $this->detalles()->create([
                'codigo_cuenta' => '5.1.01.001',
                'nombre_cuenta' => 'Costo de Ventas',
                'descripcion' => 'Costo de productos vendidos',
                'debe' => $costoTotal,
                'haber' => 0,
                'orden' => $orden++,
            ]);

            // HABER: Inventario
            $this->detalles()->create([
                'codigo_cuenta' => '1.1.03.001',
                'nombre_cuenta' => 'Inventario de Mercaderías',
                'descripcion' => 'Salida de inventario por venta',
                'debe' => 0,
                'haber' => $costoTotal,
                'orden' => $orden++,
            ]);
        }
    }
}
