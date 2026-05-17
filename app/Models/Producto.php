<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    use HasFactory, GeneratesSequentialCode, HasActiveScope;

    protected $table = 'productos';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'sku',
        'descripcion',
        'principio_activo',
        'uso_de_medicacion',
        'peso',
        'unidad_medida_id',
        'stock_minimo',
        'stock_maximo',
        'limite_venta', // ✨ NUEVO - Límite de cantidad por venta
        'activo',
        'fecha_creacion',
        'es_alquilable',
        'es_fraccionado',
        'es_combo',
        'es_producto_comida', // ✨ NUEVO - Producto de comida/helado sin stock
        'permite_venta_sin_stock', // ✨ NUEVO - Permite vender sin stock (servicios, inyectables)
        'categoria_id',
        'marca_id',
        'proveedor_id',
        'empresa_id',
        'visible_app',
        'precio_compra',
        'precio_venta',
    ];

    protected function casts(): array
    {
        return [
            'peso' => 'float',
            'stock_minimo' => 'integer',
            'stock_maximo' => 'integer',
            'limite_venta' => 'integer', // ✨ NUEVO
            'activo' => 'boolean',
            'es_alquilable' => 'boolean',
            'es_fraccionado' => 'boolean',
            'es_combo' => 'boolean',
            'es_producto_comida' => 'boolean', // ✨ NUEVO
            'permite_venta_sin_stock' => 'boolean', // ✨ NUEVO
            'visible_app' => 'boolean',
            'fecha_creacion' => 'datetime',
            'precio_compra' => 'decimal:2',
            'precio_venta' => 'decimal:2',
        ];
    }

    /**
     * Mutator: Convertir SKU a mayúsculas automáticamente
     * Esto asegura consistencia y previene duplicados por diferencias de mayúsculas
     */
    public function setSku(?string $value): void
    {
        $this->attributes['sku'] = $value ? strtoupper(trim($value)) : null;
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id');
    }

    public function precios()
    {
        return $this->hasMany(PrecioProducto::class, 'producto_id');
    }

    public function comboItems()
    {
        return $this->hasMany(ComboItem::class, 'combo_id');
    }

    public function comboGrupos()
    {
        return $this->hasMany(ComboGrupo::class, 'combo_id');
    }

    public function stock()
    {
        return $this->hasMany(StockProducto::class, 'producto_id');
    }

    public function unidad()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_medida_id');
    }

    public function codigosBarra()
    {
        return $this->hasMany(CodigoBarra::class, 'producto_id');
    }

    /**
     * Obtener el código de barra principal activo
     */
    public function codigoPrincipal()
    {
        return $this->hasOne(CodigoBarra::class, 'producto_id')
            ->where('es_principal', true)
            ->where('activo', true);
    }

    public function configuracionesGanancias()
    {
        return $this->hasMany(ConfiguracionGanancia::class);
    }

    /**
     * Relación: Todas las conversiones de unidad para este producto
     */
    public function conversiones()
    {
        return $this->hasMany(ConversionUnidadProducto::class, 'producto_id');
    }

    /**
     * Relación: Conversión principal (por defecto) para este producto
     */
    public function conversionPrincipal()
    {
        return $this->hasOne(ConversionUnidadProducto::class, 'producto_id')
            ->where('activo', true)
            ->where('es_conversion_principal', true);
    }

    /**
     * Relación: Rangos de cantidad con precios especiales
     */
    public function rangosPrecios()
    {
        return $this->hasMany(PrecioRangoCantidadProducto::class, 'producto_id');
    }

    /**
     * Relación: Adicionales para productos de comida/helados
     */
    public function adicionales()
    {
        return $this->hasMany(AdicionalesProducto::class, 'producto_id');
    }

    /**
     * Obtener el precio de un tipo específico
     */
    public function obtenerPrecio(TipoPrecio|int|string $tipoPrecio): ?PrecioProducto
    {
        return $this->precios()
            ->activos()
            ->porTipo($tipoPrecio)
            ->first();
    }

    /**
     * Agregar un nuevo precio con configuración de ganancia
     */
    public function agregarPrecio(string $nombre, float $precio, TipoPrecio|int|string $tipoPrecio, ?array $configuracionGanancia = null): PrecioProducto
    {
        // Obtener el ID del tipo de precio
        $tipoPrecioId = null;
        if ($tipoPrecio instanceof TipoPrecio) {
            $tipoPrecioId = $tipoPrecio->id;
            $tipoPrecioModel = $tipoPrecio;
        } elseif (is_numeric($tipoPrecio)) {
            $tipoPrecioId = $tipoPrecio;
            $tipoPrecioModel = TipoPrecio::find($tipoPrecio);
        } else {
            $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);
            $tipoPrecioId = $tipoPrecioModel?->id;
        }

        if (! $tipoPrecioModel) {
            throw new \InvalidArgumentException("Tipo de precio no válido: $tipoPrecio");
        }

        // Crear el precio
        $precioProducto = $this->precios()->create([
            'nombre' => $nombre,
            'precio' => $precio,
            'tipo_precio_id' => $tipoPrecioId,
            'es_precio_base' => $tipoPrecioModel->es_precio_base,
            'activo' => true,
            'fecha_ultima_actualizacion' => now(),
        ]);

        // Si se proporciona configuración de ganancia, crearla
        // Si no, usar configuración global como referencia
        if ($configuracionGanancia && $tipoPrecioModel->esGanancia()) {
            $this->configuracionesGanancias()->updateOrCreate(
                ['tipo_precio_id' => $tipoPrecioId],
                array_merge([
                    'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
                    'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
                    'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
                    'activo' => true,
                ], $configuracionGanancia)
            );
        } elseif (! $configuracionGanancia && $tipoPrecioModel->esGanancia()) {
            // Usar configuración global por defecto
            $this->configuracionesGanancias()->updateOrCreate(
                ['tipo_precio_id' => $tipoPrecioId],
                [
                    'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
                    'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
                    'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
                    'activo' => true,
                ]
            );
        }

        return $precioProducto;
    }

    /**
     * Eliminar precio de un tipo específico
     */
    public function eliminarPrecio(TipoPrecio|int|string $tipoPrecio): bool
    {
        $precio = $this->obtenerPrecio($tipoPrecio);

        if ($precio) {
            $precio->update(['activo' => false]);

            return true;
        }

        return false;
    }

    /**
     * Calcular ganancia para un tipo de venta específico
     */
    public function calcularGanancia(TipoPrecio|int|string $tipoVenta): float
    {
        $precioCosto = $this->obtenerPrecio(TipoPrecio::costo() ?? 'COSTO');
        $precioVenta = $this->obtenerPrecio($tipoVenta);

        if (! $precioCosto || ! $precioVenta) {
            return 0;
        }

        return $precioVenta->precio - $precioCosto->precio;
    }

    /**
     * Obtener el precio considerando rangos de cantidad
     * Si existe un rango configurado para esta cantidad y empresa, usa ese precio
     * Si no, usa el precio normal del producto
     */
    public function obtenerPrecioConRango(int $cantidad, ?int $empresaId = null): ?float
    {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;

        // ✅ MEJORADO: Buscar CUALQUIER rango que aplique a esta cantidad
        // Sin filtrar por tipo de precio - usa el tipo que esté configurado en el rango
        $rango = PrecioRangoCantidadProducto::query()
            ->where('producto_id', $this->id)
            ->where('empresa_id', $empresaId)
            ->activos()
            ->vigentes()
            ->where(function ($q) use ($cantidad) {
                $q->where('cantidad_minima', '<=', $cantidad)
                  ->where(function ($subQ) use ($cantidad) {
                      $subQ->whereNull('cantidad_maxima')
                           ->orWhere('cantidad_maxima', '>=', $cantidad);
                  });
            })
            ->first();

        if ($rango) {
            // ✅ Si hay rango, usar el precio del tipo_precio_id configurado en el rango
            return $this->obtenerPrecio($rango->tipo_precio_id)?->precio;
        }

        // ✅ Si NO hay rango, usar precio VENTA por defecto
        $tipoVenta = TipoPrecio::where('codigo', 'VENTA')->first();
        $tipoVentaId = $tipoVenta?->id ?? 2;

        return $this->obtenerPrecio($tipoVentaId)?->precio
               ?? $this->obtenerPrecio('VENTA_NORMAL')?->precio
               ?? $this->precios()->activos()->first()?->precio;
    }

    /**
     * Obtener información completa del precio con rango
     * Devuelve: precio unitario, subtotal, rango aplicado, próximo rango y ahorro
     */
    public function obtenerPrecioConDetallesRango(int $cantidad, ?int $empresaId = null): array
    {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;
        $precioUnitario = $this->obtenerPrecioConRango($cantidad, $empresaId);
        $subtotal = $cantidad * ($precioUnitario ?? 0);

        // ✅ MEJORADO: Buscar CUALQUIER rango que aplique a esta cantidad
        // Sin filtrar por tipo - usa el primer rango que matches
        $rangoActual = PrecioRangoCantidadProducto::query()
            ->where('producto_id', $this->id)
            ->where('empresa_id', $empresaId)
            ->activos()
            ->vigentes()
            ->where(function ($q) use ($cantidad) {
                $q->where('cantidad_minima', '<=', $cantidad)
                  ->where(function ($subQ) use ($cantidad) {
                      $subQ->whereNull('cantidad_maxima')
                           ->orWhere('cantidad_maxima', '>=', $cantidad);
                  });
            })
            ->first();

        // Buscar PRÓXIMO rango (el siguiente después del rango actual)
        $proximoRango = PrecioRangoCantidadProducto::query()
            ->where('producto_id', $this->id)
            ->where('empresa_id', $empresaId)
            ->activos()
            ->vigentes()
            ->where('cantidad_minima', '>', $cantidad)
            ->orderBy('cantidad_minima')
            ->first();

        $ahorro = null;
        if ($proximoRango) {
            $precioProximo = $this->obtenerPrecio($proximoRango->tipo_precio_id)?->precio;
            if ($precioProximo && $precioProximo < ($precioUnitario ?? 0)) {
                // Ahorro total al llegar al siguiente rango
                $diferenciaPorUnidad = ($precioUnitario ?? 0) - $precioProximo;
                $ahorro = $diferenciaPorUnidad * $proximoRango->cantidad_minima;
            }
        }

        return [
            'precio_unitario' => $precioUnitario,
            'subtotal' => $subtotal,
            'rango_aplicado' => $rangoActual ? [
                'id' => $rangoActual->id,
                'cantidad_minima' => $rangoActual->cantidad_minima,
                'cantidad_maxima' => $rangoActual->cantidad_maxima,
                'tipo_precio_id' => $rangoActual->tipo_precio_id,
                'tipo_precio_nombre' => $rangoActual->tipoPrecio->nombre,
            ] : null,
            'proximo_rango' => $proximoRango ? [
                'cantidad_minima' => $proximoRango->cantidad_minima,
                'cantidad_maxima' => $proximoRango->cantidad_maxima,
                'tipo_precio_nombre' => $proximoRango->tipoPrecio->nombre,
                'falta_cantidad' => $proximoRango->cantidad_minima - $cantidad,
            ] : null,
            'ahorro_proximo' => $ahorro,
        ];
    }

    /**
     * Obtener todos los rangos activos para este producto en una empresa
     */
    public function obtenerRangosActivos(int $empresaId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->rangosPrecios()
            ->where('empresa_id', $empresaId)
            ->activos()
            ->vigentes()
            ->ordenadoPorCantidad()
            ->get();
    }

    /**
     * Obtener todos los precios activos con sus tipos
     */
    public function obtenerTodosLosPrecios(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->precios()
            ->activos()
            ->with('tipoPrecio')
            ->get()
            ->sortBy(function ($precio) {
                return $precio->tipoPrecio ? $precio->tipoPrecio->orden : 999;
            });
    }

    /**
     * Crear precios automáticos basados en configuración global
     */
    public function crearPreciosAutomaticos(float $precioCosto): array
    {
        $preciosCreados = [];

        // Crear precio de costo (base)
        $tipoCosto = TipoPrecio::costo() ?? TipoPrecio::porCodigo('COSTO');
        if ($tipoCosto) {
            $preciosCreados[] = $this->agregarPrecio(
                'Precio de Costo',
                $precioCosto,
                $tipoCosto
            );
        }

        // Crear precios de ganancia automáticamente si está habilitado
        if (ConfiguracionGlobal::aplicarInteresAutomatico()) {
            $tiposGanancia = TipoPrecio::activos()
                ->ganancias()
                ->ordenados()
                ->get();

            foreach ($tiposGanancia as $tipo) {
                // Determinar el porcentaje a usar por prioridad:
                // 1) Configuración específica del producto para este tipo (si existe)
                // 2) Configuración en el propio Tipo de Precio (configuracion.porcentaje_ganancia)
                // 3) Configuración global
                $porcentajeGanancia = null;

                // Verificar si ya existe configuración específica para este tipo
                $configExistente = $this->configuracionesGanancias()
                    ->where('tipo_precio_id', $tipo->id)
                    ->first();

                if ($configExistente) {
                    $porcentajeGanancia = $configExistente->porcentaje_ganancia_esperado;
                }

                if ($porcentajeGanancia === null) {
                    $porcentajeGanancia = $tipo->porcentaje_ganancia !== null
                        ? (float) $tipo->porcentaje_ganancia
                        : (is_array($tipo->configuracion) && array_key_exists('porcentaje_ganancia', $tipo->configuracion)
                            ? (float) $tipo->configuracion['porcentaje_ganancia']
                            : null);
                }

                if ($porcentajeGanancia === null) {
                    $porcentajeGanancia = (float) ConfiguracionGlobal::porcentajeInteresGeneral();
                }

                $precioVenta = $precioCosto + ($precioCosto * $porcentajeGanancia / 100);

                $preciosCreados[] = $this->agregarPrecio(
                    $tipo->nombre,
                    $precioVenta,
                    $tipo
                );
            }
        }

        return $preciosCreados;
    }

    /**
     * Actualizar configuración de ganancia con valores globales como respaldo
     */
    public function actualizarConfiguracionGanancia(TipoPrecio|int|string $tipoPrecio, array $configuracion = []): ConfiguracionGanancia
    {
        $tipoPrecioId = null;
        if ($tipoPrecio instanceof TipoPrecio) {
            $tipoPrecioId = $tipoPrecio->id;
        } elseif (is_numeric($tipoPrecio)) {
            $tipoPrecioId = $tipoPrecio;
        } else {
            $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);
            $tipoPrecioId = $tipoPrecioModel?->id;
        }

        if (! $tipoPrecioId) {
            throw new \InvalidArgumentException("Tipo de precio no válido: $tipoPrecio");
        }

        // Combinar configuración proporcionada con valores globales como respaldo
        $configuracionCompleta = array_merge([
            'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
            'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
            'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
            'activo' => true,
        ], $configuracion);

        return $this->configuracionesGanancias()->updateOrCreate(
            ['tipo_precio_id' => $tipoPrecioId],
            $configuracionCompleta
        );
    }

    /**
     * Obtener porcentaje de ganancia efectivo (específico del producto o global)
     */
    public function obtenerPorcentajeGananciaEfectivo(TipoPrecio|int|string $tipoPrecio): float
    {
        $configuracion = $this->configuracionesGanancias()
            ->where('tipo_precio_id', $this->obtenerTipoPrecioId($tipoPrecio))
            ->where('activo', true)
            ->first();

        return $configuracion
            ? $configuracion->porcentaje_ganancia_esperado
            : ConfiguracionGlobal::porcentajeInteresGeneral();
    }

    /**
     * Obtener margen mínimo efectivo (específico del producto o global)
     */
    public function obtenerMargenMinimoEfectivo(TipoPrecio|int|string $tipoPrecio): float
    {
        $configuracion = $this->configuracionesGanancias()
            ->where('tipo_precio_id', $this->obtenerTipoPrecioId($tipoPrecio))
            ->where('activo', true)
            ->first();

        return $configuracion
            ? $configuracion->margen_minimo
            : ConfiguracionGlobal::margenMinimoGlobal();
    }

    /**
     * Actualizar precios automáticamente basado en configuración
     */
    public function actualizarPreciosAutomaticos(): void
    {
        $precioCosto = $this->obtenerPrecio(TipoPrecio::costo() ?? 'COSTO');

        if (! $precioCosto) {
            return;
        }

        $configuraciones = $this->configuracionesGanancias()
            ->where('activo', true)
            ->where('calcular_automatico', true)
            ->get();

        foreach ($configuraciones as $config) {
            $nuevoPrecio = $config->calcularPrecioAutomatico($precioCosto->precio);

            if ($nuevoPrecio > 0) {
                $precioExistente = $this->precios()
                    ->activos()
                    ->where('tipo_precio_id', $config->tipo_precio_id)
                    ->first();

                if ($precioExistente) {
                    $precioExistente->actualizarPrecio(
                        $nuevoPrecio,
                        'Actualización automática basada en configuración global/específica',
                        'Sistema'
                    );
                }
            }
        }
    }

    /**
     * Método auxiliar para obtener ID de tipo de precio
     */
    private function obtenerTipoPrecioId(TipoPrecio|int|string $tipoPrecio): ?int
    {
        if ($tipoPrecio instanceof TipoPrecio) {
            return $tipoPrecio->id;
        }

        if (is_numeric($tipoPrecio)) {
            return (int) $tipoPrecio;
        }

        $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);

        return $tipoPrecioModel?->id;
    }

    /**
     * Boot del modelo para aplicar configuración automática
     */
    protected static function boot()
    {
        parent::boot();

        // Al crear un producto, aplicar configuración global si está habilitada
        static::created(function ($producto) {
            // 1️⃣ Generar SKU automáticamente si no se proporcionó
            if (! $producto->sku) {
                $producto->sku = $producto->generateSku();
                // Guardar en silencio para evitar eventos recursivos
                $producto->saveQuietly();
            }

            // 2️⃣ Configuraciones de ganancia automáticas
            if (ConfiguracionGlobal::aplicarInteresAutomatico()) {
                // Crear configuraciones de ganancia por defecto para tipos activos
                $tiposGanancia = TipoPrecio::activos()->ganancias()->get();

                foreach ($tiposGanancia as $tipo) {
                    $producto->actualizarConfiguracionGanancia($tipo);
                }
            }
        });
    }

    /**
     * Generar código SKU automático: PRO + ID con padding
     * Ejemplo: PRO0001, PRO0123, PRO1001
     */
    public function generateSku(): string
    {
        $numero = (int) $this->id;

        // Para números < 1000: usar padding de 4 dígitos (PRO0001, PRO0123, PRO0999)
        if ($numero < 1000) {
            return 'PRO' . str_pad((string) $numero, 4, '0', STR_PAD_LEFT);
        }

        // Para números >= 1000: usar el número tal cual (PRO1000, PRO1001, ...)
        return 'PRO' . $numero;
    }

    /**
     * ==========================================
     * MÉTODOS DE INVENTARIO Y STOCK
     * ==========================================
     */

    /**
     * Obtener stock total consolidado de todos los almacenes
     */
    public function stockTotal(): int
    {
        return $this->stock()->sum('cantidad');
    }

    /**
     * Verificar si el producto tiene stock bajo (menor al mínimo)
     */
    public function stockBajo(): bool
    {
        if ($this->stock_minimo <= 0) {
            return false;
        }

        return $this->stockTotal() < $this->stock_minimo;
    }

    /**
     * Verificar si el producto excede el stock máximo
     */
    public function stockAlto(): bool
    {
        if ($this->stock_maximo <= 0) {
            return false;
        }

        return $this->stockTotal() > $this->stock_maximo;
    }

    /**
     * Verificar si tiene productos próximos a vencer
     */
    public function proximoVencer(int $diasAnticipacion = 30): bool
    {
        $fechaLimite = now()->addDays($diasAnticipacion);

        return $this->stock()
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('cantidad', '>', 0)
            ->exists();
    }

    /**
     * Obtener productos que vencen próximamente
     */
    public function stockProximoVencer(int $diasAnticipacion = 30): \Illuminate\Database\Eloquent\Collection
    {
        $fechaLimite = now()->addDays($diasAnticipacion);

        return $this->stock()
            ->with('almacen')
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('cantidad', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    /**
     * Obtener productos vencidos
     */
    public function stockVencido(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->stock()
            ->with('almacen')
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', now()->toDateString())
            ->where('cantidad', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    /**
     * Registrar movimiento de inventario
     *
     * IMPORTANTE: Actualiza tanto cantidad como cantidad_disponible
     *
     * @deprecated Para operaciones críticas de venta/compra usar StockService
     */
    public function registrarMovimiento(
        int $almacenId,
        int $cantidad,
        string $tipo,
        ?string $observacion = null,
        ?string $numeroDocumento = null,
        ?string $lote = null,
        ?\Carbon\Carbon $fechaVencimiento = null,
        ?int $userId = null
    ): MovimientoInventario {
        // Buscar o crear registro de stock
        $stockProducto = $this->stock()
            ->where('almacen_id', $almacenId)
            ->where(function ($q) use ($lote) {
                if ($lote) {
                    $q->where('lote', $lote);
                } else {
                    $q->whereNull('lote');
                }
            })
            ->first();

        if (! $stockProducto) {
            $stockProducto = StockProducto::create([
                'producto_id' => $this->id,
                'almacen_id' => $almacenId,
                'cantidad' => 0,
                'cantidad_disponible' => 0, // ✓ Inicializar correctamente
                'cantidad_reservada' => 0,  // ✓ Inicializar correctamente
                'lote' => $lote,
                'fecha_vencimiento' => $fechaVencimiento,
                'fecha_actualizacion' => now(),
            ]);
        }

        return MovimientoInventario::registrar(
            $stockProducto,
            $cantidad,
            $tipo,
            $observacion,
            $numeroDocumento,
            $userId
        );
    }

    /**
     * Ajustar stock directo (para correcciones)
     *
     * IMPORTANTE: Actualiza tanto cantidad como cantidad_disponible
     */
    public function ajustarStock(
        int $almacenId,
        int $nuevaCantidad,
        string $observacion = 'Ajuste de inventario',
        ?string $lote = null
    ): MovimientoInventario {
        $stockProducto = $this->stock()
            ->where('almacen_id', $almacenId)
            ->where(function ($q) use ($lote) {
                if ($lote) {
                    $q->where('lote', $lote);
                } else {
                    $q->whereNull('lote');
                }
            })
            ->firstOrCreate(
                [
                    'producto_id' => $this->id,
                    'almacen_id' => $almacenId,
                    'lote' => $lote,
                ],
                [
                    'cantidad' => 0,
                    'cantidad_disponible' => 0, // ✓ Inicializar correctamente
                    'cantidad_reservada' => 0,  // ✓ Inicializar correctamente
                    'fecha_actualizacion' => now(),
                ]
            );

        $diferencia = $nuevaCantidad - $stockProducto->cantidad;
        $tipo = $diferencia >= 0 ? MovimientoInventario::TIPO_ENTRADA_AJUSTE : MovimientoInventario::TIPO_SALIDA_AJUSTE;

        return MovimientoInventario::registrar(
            $stockProducto,
            $diferencia,
            $tipo,
            $observacion,
            null
        );
    }

    /**
     * Obtener historial de movimientos
     */
    public function movimientos(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            MovimientoInventario::class,
            StockProducto::class,
            'producto_id',       // Foreign key en stock_productos
            'stock_producto_id', // Foreign key en movimientos_inventario
            'id',                // Local key en productos
            'id'                 // Local key en stock_productos
        );
    }

    /**
     * Scopes para consultas de inventario
     */
    public function scopeStockBajo($query)
    {
        // Usar AMBOS criterios:
        // 1. Producto con stock bajo en ALGÚN almacén específico
        // 2. O producto con stock bajo en total consolidado
        return $query->where('stock_minimo', '>', 0)
            ->where(function ($q) {
                // Criterio 1: Stock bajo en algún almacén específico
                $q->whereRaw('EXISTS (
                    SELECT 1 FROM stock_productos
                    WHERE producto_id = productos.id
                    AND cantidad <= productos.stock_minimo
                    AND cantidad > 0
                )')
                // Criterio 2: O stock bajo en total consolidado
                ->orWhereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos WHERE producto_id = productos.id) < stock_minimo');
            });
    }

    public function scopeStockAlto($query)
    {
        return $query->where('stock_maximo', '>', 0)
            ->whereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos WHERE producto_id = productos.id) > stock_maximo');
    }

    public function scopeProximosVencer($query, int $diasAnticipacion = 30)
    {
        $fechaLimite = now()->addDays($diasAnticipacion)->toDateString();

        return $query->whereHas('stock', function ($q) use ($fechaLimite) {
            $q->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('cantidad', '>', 0);
        });
    }

    public function scopeVencidos($query)
    {
        return $query->whereHas('stock', function ($q) {
            $q->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<', now()->toDateString())
                ->where('cantidad', '>', 0);
        });
    }

    /**
     * FASE 3: Scopes adicionales para optimización
     */

    /**
     * Scope: Productos activos
     * Uso: Producto::activo()->get()
     */

    /**
     * Scope: Productos inactivos
     */
    public function scopeInactivo($query)
    {
        return $query->where('activo', false);
    }

    /**
     * Scope: Filtrar por categoría
     * Uso: Producto::porCategoria(1)->get()
     */
    public function scopePorCategoria($query, int $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    /**
     * Scope: Filtrar por marca
     * Uso: Producto::porMarca(1)->get()
     */
    public function scopePorMarca($query, int $marcaId)
    {
        return $query->where('marca_id', $marcaId);
    }

    /**
     * Scope: Búsqueda por nombre o SKU (case-insensitive)
     * Uso: Producto::buscar('laptop')->get()
     */
    public function scopeBuscar($query, string $termino)
    {
        $terminoLower = strtolower($termino);
        return $query->where(function ($q) use ($terminoLower) {
            $q->whereRaw('LOWER(nombre) like ?', ["%{$terminoLower}%"])
              ->orWhereRaw('LOWER(sku) like ?', ["%{$terminoLower}%"])
              ->orWhereRaw('LOWER(descripcion) like ?', ["%{$terminoLower}%"]);
        });
    }

    /**
     * Scope: Productos con stock
     * Uso: Producto::conStock()->get()
     */
    public function scopeConStock($query)
    {
        return $query->whereHas('stock', function ($q) {
            $q->where('cantidad', '>', 0);
        });
    }

    /**
     * Scope: Productos sin stock
     */
    public function scopeSinStock($query)
    {
        return $query->whereDoesntHave('stock', function ($q) {
            $q->where('cantidad', '>', 0);
        })->orWhereDoesntHave('stock');
    }

    /**
     * Scope: Cargar relaciones para listados (previene N+1)
     * Uso: Producto::conRelacionesBasicas()->get()
     */
    public function scopeConRelacionesBasicas($query)
    {
        return $query->with([
            'categoria:id,nombre',
            'marca:id,nombre',
            'unidad:id,codigo,nombre',
            'precios' => function ($q) {
                $q->where('activo', true)->with('tipoPrecio:id,codigo,nombre');
            }
        ]);
    }

    /**
     * Scope: Productos alquilables
     */
    public function scopeAlquilables($query)
    {
        return $query->where('es_alquilable', true);
    }

    /**
     * Scope: Productos fraccionados
     */
    public function scopeFraccionados($query)
    {
        return $query->where('es_fraccionado', true);
    }

    /**
     * Scope: Productos que permiten venta sin stock
     */
    public function scopePermiteSinStock($query)
    {
        return $query->where('permite_venta_sin_stock', true);
    }

    /**
     * Verificar si el producto puede venderse sin stock en una farmacia
     *
     * Retorna true si:
     * - El producto tiene permite_venta_sin_stock = true Y
     * - La empresa es farmacia
     */
    public function puedeVenderseSinStock(bool $esFarmacia = false): bool
    {
        return $this->permite_venta_sin_stock && $esFarmacia;
    }

    /**
     * Verificar si hay stock suficiente para vender una cantidad
     *
     * Retorna true si:
     * - Hay suficiente stock disponible, O
     * - El producto puede venderse sin stock (servicios/inyectables)
     */
    public function tieneStockSuficiente(int $cantidad, int $almacenId = null, bool $esFarmacia = false): bool
    {
        // Si es un producto que permite venta sin stock en farmacia, siempre hay "stock"
        if ($this->puedeVenderseSinStock($esFarmacia)) {
            return true;
        }

        // Si no, verificar stock real
        $stockDisponible = $almacenId
            ? $this->stock()->where('almacen_id', $almacenId)->sum('cantidad_disponible')
            : $this->stockTotal();

        return $stockDisponible >= $cantidad;
    }

    // ======================== MÉTODOS DE CONVERSIÓN ========================

    /**
     * Convertir cantidad entre dos unidades
     *
     * @param float $cantidad
     * @param int $unidadOrigenId
     * @param int $unidadDestinoId
     * @return float
     * @throws \Exception
     */
    public function convertirCantidad(float $cantidad, int $unidadOrigenId, int $unidadDestinoId): float
    {
        // Si las unidades son iguales, retornar sin cambios
        if ($unidadOrigenId === $unidadDestinoId) {
            return $cantidad;
        }

        // Si el producto no es fraccionado, no permitir conversiones
        if (!$this->es_fraccionado) {
            throw new \Exception("Producto no fraccionado no permite conversiones entre unidades");
        }

        // Buscar conversión directa (origen → destino)
        $conversion = $this->conversiones()
            ->where('unidad_base_id', $unidadOrigenId)
            ->where('unidad_destino_id', $unidadDestinoId)
            ->where('activo', true)
            ->first();

        if ($conversion) {
            return $conversion->convertirADestino($cantidad);
        }

        // Buscar conversión inversa (destino → origen)
        $conversionInversa = $this->conversiones()
            ->where('unidad_base_id', $unidadDestinoId)
            ->where('unidad_destino_id', $unidadOrigenId)
            ->where('activo', true)
            ->first();

        if ($conversionInversa) {
            return $conversionInversa->convertirABase($cantidad);
        }

        throw new \Exception("No existe conversión entre unidades para este producto");
    }

    /**
     * Convertir cantidad a la unidad base del producto
     *
     * @param float $cantidad
     * @param int $unidadOrigenId
     * @return float
     * @throws \Exception
     */
    public function convertirAUnidadBase(float $cantidad, int $unidadOrigenId): float
    {
        if ($unidadOrigenId === $this->unidad_medida_id) {
            return $cantidad;
        }

        return $this->convertirCantidad($cantidad, $unidadOrigenId, $this->unidad_medida_id);
    }

    /**
     * Obtener conversión entre dos unidades específicas
     *
     * @param int $unidadBaseId
     * @param int $unidadDestinoId
     * @return ConversionUnidadProducto|null
     */
    public function obtenerConversion(int $unidadBaseId, int $unidadDestinoId): ?ConversionUnidadProducto
    {
        // Buscar conversión directa
        $conversion = $this->conversiones()
            ->where('unidad_base_id', $unidadBaseId)
            ->where('unidad_destino_id', $unidadDestinoId)
            ->where('activo', true)
            ->first();

        if ($conversion) {
            return $conversion;
        }

        // Buscar conversión inversa
        return $this->conversiones()
            ->where('unidad_base_id', $unidadDestinoId)
            ->where('unidad_destino_id', $unidadBaseId)
            ->where('activo', true)
            ->first();
    }

    /**
     * Calcular precios por unidad automáticamente para productos fraccionados
     *
     * Solo aplica para productos fraccionados con conversiones activas
     * Los precios se calculan: precio_base / factor_conversion
     *
     * @return array Matriz de precios por unidad: [tipo_precio_id][unidad_destino_id] = monto
     */
    public function calcularPreciosPorUnidad(): array
    {
        $preciosPorUnidad = [];

        // Solo calcular si el producto es fraccionado
        if (!$this->es_fraccionado) {
            return $preciosPorUnidad;
        }

        // Cargar conversiones activas
        $conversiones = $this->conversiones()
            ->where('activo', true)
            ->get();

        if ($conversiones->isEmpty()) {
            return $preciosPorUnidad;
        }

        // Cargar precios activos
        $precios = $this->precios()
            ->where('activo', true)
            ->get();

        if ($precios->isEmpty()) {
            return $preciosPorUnidad;
        }

        // Calcular precio para cada tipo de precio
        foreach ($precios as $precio) {
            $tipoPrecioId = $precio->tipo_precio_id;
            $precioBase = (float) $precio->precio;

            $preciosPorUnidad[$tipoPrecioId] = [];

            // Precio para la unidad base (misma unidad del producto)
            $preciosPorUnidad[$tipoPrecioId][$this->unidad_medida_id] = round($precioBase, 2);

            // Calcular precio para cada conversión
            foreach ($conversiones as $conversion) {
                $precioPorUnidad = $precioBase / $conversion->factor_conversion;
                $preciosPorUnidad[$tipoPrecioId][$conversion->unidad_destino_id] = round($precioPorUnidad, 2);
            }
        }

        return $preciosPorUnidad;
    }

    /**
     * Obtener precio por unidad específica
     *
     * @param int $tipoPrecioId ID del tipo de precio
     * @param int $unidadDestinoId ID de la unidad destino (si es null, usa unidad base)
     * @return float|null Precio calculado o null si no existe
     */
    public function obtenerPrecioPorUnidad(int $tipoPrecioId, ?int $unidadDestinoId = null): ?float
    {
        // Si no hay unidad destino, usar la unidad base
        if ($unidadDestinoId === null) {
            $unidadDestinoId = $this->unidad_medida_id;
        }

        // Solo para productos fraccionados
        if (!$this->es_fraccionado) {
            // Para productos no fraccionados, devolver el precio base
            $precio = $this->precios()
                ->where('tipo_precio_id', $tipoPrecioId)
                ->where('activo', true)
                ->first();

            return $precio ? (float) $precio->precio : null;
        }

        // Calcular precios por unidad
        $preciosPorUnidad = $this->calcularPreciosPorUnidad();

        return $preciosPorUnidad[$tipoPrecioId][$unidadDestinoId] ?? null;
    }

    /**
     * Calcular precio por unidad específica
     *
     * @param string $tipoPrecio Tipo de precio (ej: 'VENTA_MOSTRADOR', 'VENTA_DISTRIBUIDOR')
     * @param int|null $unidadMedidaId ID de la unidad (si es null usa la unidad base)
     * @return float|null
     * @throws \Exception
     */
    public function calcularPrecioPorUnidad(string $tipoPrecio, ?int $unidadMedidaId = null): ?float
    {
        $precioProducto = $this->obtenerPrecio($tipoPrecio);

        if (!$precioProducto) {
            return null;
        }

        // Si no especifica unidad o es la unidad base, retornar precio directo
        if (!$unidadMedidaId || $unidadMedidaId === $this->unidad_medida_id) {
            return (float) $precioProducto->precio;
        }

        // Si el producto no es fraccionado, solo tiene precio en unidad base
        if (!$this->es_fraccionado) {
            throw new \Exception("Producto no fraccionado solo tiene precio en su unidad base");
        }

        // Buscar la conversión para calcular precio proporcional
        $conversion = $this->obtenerConversion($this->unidad_medida_id, $unidadMedidaId);

        if (!$conversion) {
            throw new \Exception("No existe conversión para calcular precio en esa unidad");
        }

        // Precio proporcional: precio_base / factor_conversion
        // Ej: 150 Bs/caja ÷ 100 = 1.50 Bs/tableta
        return (float) $precioProducto->precio / (float) $conversion->factor_conversion;
    }

    /**
     * Prestables que están relacionados con este producto
     */
    public function prestablesRelacionados()
    {
        return $this->hasMany(ProductoRelacionadoPrestable::class);
    }
}
