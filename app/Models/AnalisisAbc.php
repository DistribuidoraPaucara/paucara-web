<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class AnalisisAbc extends Model
{
    use HasFactory;

    protected $table = 'analisis_abc';

    protected $fillable = [
        'producto_id',
        'almacen_id',
        'periodo_ano',
        'periodo_mes',
        'clasificacion_abc',
        'clasificacion_xyz',
        'ventas_cantidad',
        'ventas_valor',
        'stock_promedio',
        'costo_promedio',
        'rotacion_inventario',
        'dias_cobertura',
        'porcentaje_ventas_cantidad',
        'porcentaje_ventas_valor',
        'porcentaje_acumulado_valor',
        'ranking_ventas',
        'producto_activo',
        'tiene_movimientos',
        'ultima_venta',
        'ultima_compra',
        'recomendaciones'
    ];

    protected function casts(): array
    {
        return [
            'periodo_ano' => 'integer',
            'periodo_mes' => 'integer',
            'ventas_cantidad' => 'decimal:4',
            'ventas_valor' => 'decimal:2',
            'stock_promedio' => 'decimal:4',
            'costo_promedio' => 'decimal:4',
            'rotacion_inventario' => 'decimal:2',
            'dias_cobertura' => 'integer',
            'porcentaje_ventas_cantidad' => 'decimal:2',
            'porcentaje_ventas_valor' => 'decimal:2',
            'porcentaje_acumulado_valor' => 'decimal:2',
            'ranking_ventas' => 'integer',
            'producto_activo' => 'boolean',
            'tiene_movimientos' => 'boolean',
            'ultima_venta' => 'date',
            'ultima_compra' => 'date',
        ];
    }

    // Clasificaciones ABC
    const CLASIFICACION_A = 'A'; // Alto valor - 80% de las ventas
    const CLASIFICACION_B = 'B'; // Valor medio - 15% de las ventas
    const CLASIFICACION_C = 'C'; // Bajo valor - 5% de las ventas

    // Clasificaciones XYZ (por rotación)
    const CLASIFICACION_X = 'X'; // Alta rotación - movimiento regular
    const CLASIFICACION_Y = 'Y'; // Rotación media - movimiento moderado
    const CLASIFICACION_Z = 'Z'; // Baja rotación - movimiento esporádico

    // Relaciones
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class);
    }

    // Scopes
    public function scopeClasificacionA($query)
    {
        return $query->where('clasificacion_abc', self::CLASIFICACION_A);
    }

    public function scopeClasificacionB($query)
    {
        return $query->where('clasificacion_abc', self::CLASIFICACION_B);
    }

    public function scopeClasificacionC($query)
    {
        return $query->where('clasificacion_abc', self::CLASIFICACION_C);
    }

    public function scopeAltaRotacion($query)
    {
        return $query->where('clasificacion_xyz', self::CLASIFICACION_X);
    }

    public function scopeRotacionMedia($query)
    {
        return $query->where('clasificacion_xyz', self::CLASIFICACION_Y);
    }

    public function scopeBajaRotacion($query)
    {
        return $query->where('clasificacion_xyz', self::CLASIFICACION_Z);
    }

    public function scopePeriodoActual($query)
    {
        return $query->where('periodo_ano', date('Y'))
                    ->whereNull('periodo_mes');
    }

    public function scopePeriodo($query, $ano, $mes = null)
    {
        $query->where('periodo_ano', $ano);

        if ($mes !== null) {
            $query->where('periodo_mes', $mes);
        } else {
            $query->whereNull('periodo_mes');
        }

        return $query;
    }

    public function scopeProductosActivos($query)
    {
        return $query->where('producto_activo', true);
    }

    public function scopeConMovimientos($query)
    {
        return $query->where('tiene_movimientos', true);
    }

    public function scopeObsoletos($query, $diasSinVenta = 180)
    {
        return $query->where('ultima_venta', '<', now()->subDays($diasSinVenta))
                    ->orWhereNull('ultima_venta');
    }

    public function scopeRotacionBaja($query, $umbral = 2)
    {
        return $query->where('rotacion_inventario', '<', $umbral);
    }

    public function scopeStockExcesivo($query, $diasCobertura = 90)
    {
        return $query->where('dias_cobertura', '>', $diasCobertura);
    }

    // Métodos auxiliares
    public function getClasificacionCompletaAttribute(): string
    {
        $xyz = $this->clasificacion_xyz ? $this->clasificacion_xyz : 'Z';
        return $this->clasificacion_abc . $xyz;
    }

    public function getDescripcionClasificacionAttribute(): string
    {
        $abc_desc = [
            'A' => 'Alto Valor',
            'B' => 'Valor Medio',
            'C' => 'Bajo Valor'
        ];

        $xyz_desc = [
            'X' => 'Alta Rotación',
            'Y' => 'Rotación Media',
            'Z' => 'Baja Rotación'
        ];

        $abc = $abc_desc[$this->clasificacion_abc] ?? 'Desconocido';
        $xyz = $xyz_desc[$this->clasificacion_xyz ?? 'Z'] ?? 'Sin Rotación';

        return "$abc - $xyz";
    }

    public function getPrioridadGestionAttribute(): string
    {
        $combinacion = $this->clasificacion_completa;

        $prioridades = [
            'AX' => 'CRÍTICA',    // Alto valor, alta rotación
            'AY' => 'ALTA',       // Alto valor, rotación media
            'AZ' => 'ALTA',       // Alto valor, baja rotación (requiere atención)
            'BX' => 'MEDIA',      // Valor medio, alta rotación
            'BY' => 'MEDIA',      // Valor medio, rotación media
            'BZ' => 'BAJA',       // Valor medio, baja rotación
            'CX' => 'BAJA',       // Bajo valor, alta rotación
            'CY' => 'BAJA',       // Bajo valor, rotación media
            'CZ' => 'MÍNIMA',     // Bajo valor, baja rotación
        ];

        return $prioridades[$combinacion] ?? 'DESCONOCIDA';
    }

    public function getRecomendacionesAutomaticasAttribute(): array
    {
        $recomendaciones = [];
        $combinacion = $this->clasificacion_completa;

        // Recomendaciones basadas en clasificación ABC-XYZ
        switch ($combinacion) {
            case 'AX': // Alto valor, alta rotación
                $recomendaciones[] = 'Monitoreo continuo de stock';
                $recomendaciones[] = 'Mantener nivel de seguridad alto';
                $recomendaciones[] = 'Revisión semanal de inventario';
                break;

            case 'AY': // Alto valor, rotación media
                $recomendaciones[] = 'Control mensual de stock';
                $recomendaciones[] = 'Optimizar frecuencia de pedidos';
                break;

            case 'AZ': // Alto valor, baja rotación
                $recomendaciones[] = 'Revisar estrategia de ventas';
                $recomendaciones[] = 'Considerar promociones especiales';
                $recomendaciones[] = 'Evaluar descontinuación';
                break;

            case 'BX': // Valor medio, alta rotación
                $recomendaciones[] = 'Control estándar de inventario';
                $recomendaciones[] = 'Oportunidad de crecimiento';
                break;

            case 'BZ': // Valor medio, baja rotación
                $recomendaciones[] = 'Reducir stock gradualmente';
                $recomendaciones[] = 'Evaluar descontinuación';
                break;

            case 'CZ': // Bajo valor, baja rotación
                $recomendaciones[] = 'Candidato para descontinuación';
                $recomendaciones[] = 'Minimizar stock';
                break;
        }

        // Recomendaciones por métricas específicas
        if ($this->rotacion_inventario < 1) {
            $recomendaciones[] = 'Rotación muy baja - revisar demanda';
        }

        if ($this->dias_cobertura > 180) {
            $recomendaciones[] = 'Stock excesivo - más de 6 meses de cobertura';
        }

        if ($this->ultima_venta && $this->ultima_venta->diffInDays(now()) > 90) {
            $recomendaciones[] = 'Sin ventas en los últimos 3 meses';
        }

        return array_unique($recomendaciones);
    }

    public function esProductoObsoleto($diasSinVenta = 180): bool
    {
        if (!$this->ultima_venta) {
            return true;
        }

        return $this->ultima_venta->diffInDays(now()) > $diasSinVenta;
    }

    public function requiereAtencionEspecial(): bool
    {
        // Productos que requieren atención inmediata
        $condiciones = [
            $this->clasificacion_abc === 'A' && $this->rotacion_inventario < 2, // Alto valor, baja rotación
            $this->dias_cobertura > 365, // Más de un año de stock
            $this->esProductoObsoleto(90), // Sin ventas en 3 meses
            $this->stock_promedio > 0 && $this->ventas_cantidad == 0 // Stock sin ventas
        ];

        return in_array(true, $condiciones);
    }

    // Métodos estáticos para análisis masivo
    public static function calcularAnalisisABC($almacenId = null, $ano = null, $mes = null)
    {
        $ano = $ano ?? date('Y');

        // Eliminar análisis previo del periodo
        self::where('periodo_ano', $ano)
            ->where('periodo_mes', $mes)
            ->when($almacenId, function($query) use ($almacenId) {
                return $query->where('almacen_id', $almacenId);
            })
            ->delete();

        // Obtener datos de ventas del periodo
        $query = \DB::table('detalle_ventas as dv')
                   ->join('ventas as v', 'dv.venta_id', '=', 'v.id')
                   ->join('stock_productos as sp', 'dv.stock_producto_id', '=', 'sp.id')
                   ->join('productos as p', 'sp.producto_id', '=', 'p.id')
                   ->whereYear('v.fecha_venta', $ano);

        if ($mes) {
            $query->whereMonth('v.fecha_venta', $mes);
        }

        if ($almacenId) {
            $query->where('sp.almacen_id', $almacenId);
        }

        $datosVentas = $query->select([
                'sp.producto_id',
                'sp.almacen_id',
                \DB::raw('SUM(dv.cantidad) as total_cantidad'),
                \DB::raw('SUM(dv.cantidad * dv.precio_unitario) as total_valor'),
                \DB::raw('AVG(sp.stock_actual) as stock_promedio'),
                \DB::raw('AVG(dv.precio_unitario) as precio_promedio'),
                \DB::raw('MAX(v.fecha_venta) as ultima_venta')
            ])
            ->groupBy('sp.producto_id', 'sp.almacen_id')
            ->orderBy('total_valor', 'desc')
            ->get();

        if ($datosVentas->isEmpty()) {
            return false;
        }

        $totalVentas = $datosVentas->sum('total_valor');
        $acumulado = 0;
        $ranking = 1;

        foreach ($datosVentas as $dato) {
            $porcentajeVentas = ($dato->total_valor / $totalVentas) * 100;
            $acumulado += $porcentajeVentas;

            // Determinar clasificación ABC
            if ($acumulado <= 80) {
                $clasificacionABC = self::CLASIFICACION_A;
            } elseif ($acumulado <= 95) {
                $clasificacionABC = self::CLASIFICACION_B;
            } else {
                $clasificacionABC = self::CLASIFICACION_C;
            }

            // Calcular rotación
            $rotacion = $dato->stock_promedio > 0
                ? $dato->total_cantidad / $dato->stock_promedio
                : 0;

            // Determinar clasificación XYZ
            if ($rotacion >= 12) { // Más de 12 veces al año
                $clasificacionXYZ = self::CLASIFICACION_X;
            } elseif ($rotacion >= 4) { // Entre 4 y 12 veces al año
                $clasificacionXYZ = self::CLASIFICACION_Y;
            } else { // Menos de 4 veces al año
                $clasificacionXYZ = self::CLASIFICACION_Z;
            }

            // Calcular días de cobertura
            $ventasDiarias = $dato->total_cantidad / ($mes ? 30 : 365);
            $diasCobertura = $ventasDiarias > 0 ? $dato->stock_promedio / $ventasDiarias : 9999;

            // Crear registro de análisis
            $analisis = new self([
                'producto_id' => $dato->producto_id,
                'almacen_id' => $dato->almacen_id,
                'periodo_ano' => $ano,
                'periodo_mes' => $mes,
                'clasificacion_abc' => $clasificacionABC,
                'clasificacion_xyz' => $clasificacionXYZ,
                'ventas_cantidad' => $dato->total_cantidad,
                'ventas_valor' => $dato->total_valor,
                'stock_promedio' => $dato->stock_promedio,
                'costo_promedio' => $dato->precio_promedio * 0.7, // Estimar costo
                'rotacion_inventario' => $rotacion,
                'dias_cobertura' => min($diasCobertura, 9999),
                'porcentaje_ventas_valor' => $porcentajeVentas,
                'porcentaje_acumulado_valor' => $acumulado,
                'ranking_ventas' => $ranking,
                'producto_activo' => true,
                'tiene_movimientos' => true,
                'ultima_venta' => $dato->ultima_venta,
            ]);

            $analisis->save();
            $ranking++;
        }

        return true;
    }

    public static function obtenerResumen($almacenId = null, $ano = null)
    {
        $query = self::where('periodo_ano', $ano ?? date('Y'))
                    ->whereNull('periodo_mes');

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $totalProductos = $query->count();
        $productosClaseA = $query->clone()->where('clasificacion_abc', 'A')->count();
        $valorClaseA = $query->clone()->where('clasificacion_abc', 'A')->sum('ventas_valor') ?? 0;
        $valorTotal = $query->clone()->sum('ventas_valor') ?? 0;
        $porcentajeClaseA = $valorTotal > 0 ? ($valorClaseA / $valorTotal) * 100 : 0;

        return [
            'total_productos' => $totalProductos,
            'productos_clase_a' => $productosClaseA,
            'productos_clase_b' => $query->clone()->where('clasificacion_abc', 'B')->count(),
            'productos_clase_c' => $query->clone()->where('clasificacion_abc', 'C')->count(),
            'valor_total_ventas' => $valorTotal,
            'valor_clase_a' => $valorClaseA,
            'porcentaje_clase_a' => $porcentajeClaseA,
            'alta_rotacion' => $query->clone()->where('clasificacion_xyz', 'X')->count(),
            'media_rotacion' => $query->clone()->where('clasificacion_xyz', 'Y')->count(),
            'baja_rotacion' => $query->clone()->where('clasificacion_xyz', 'Z')->count(),
        ];
    }
}