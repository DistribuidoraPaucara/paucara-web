<?php

namespace App\Services;

use App\Models\CodigoBarra;
use App\Models\Producto;
use Illuminate\Support\Facades\Cache;

/**
 * Servicio de caché para búsqueda rápida de productos por código de barra
 *
 * Optimizado para POS y operaciones que requieren búsqueda instantánea
 */
class CodigosBarraCacheService
{
    /**
     * Clave base para el caché
     */
    private const CACHE_PREFIX = 'codigo_barra:';
    private const CACHE_INDEX_PREFIX = 'codigo_barra_index:';
    private const CACHE_TTL = 3600; // 1 hora

    /**
     * Obtener producto por código de barra (con caché)
     */
    public function obtenerProductoPorCodigo(string $codigo): ?Producto
    {
        $codigo = trim($codigo);
        $cacheKey = self::CACHE_PREFIX . $codigo;

        // Intentar obtener del caché
        $productoId = Cache::get($cacheKey);

        if ($productoId !== null) {
            return Producto::find($productoId);
        }

        // Si no está en caché, buscar en BD
        $codigoBarra = CodigoBarra::where('codigo', $codigo)
            ->where('activo', true)
            ->first();

        if (!$codigoBarra) {
            // Cachear resultado negativo por menos tiempo (10 minutos)
            Cache::put($cacheKey, null, 600);
            return null;
        }

        // Cachear el resultado positivo
        Cache::put($cacheKey, $codigoBarra->producto_id, self::CACHE_TTL);

        return $codigoBarra->producto;
    }

    /**
     * Reconstruir el índice de caché de todos los códigos
     * Útil después de importaciones o cambios masivos
     */
    public function reconstruirIndice(): int
    {
        // Limpiar caché anterior
        $this->limpiarTodo();

        // Obtener todos los códigos activos
        $codigos = CodigoBarra::where('activo', true)
            ->select('codigo', 'producto_id')
            ->get();

        $count = 0;
        foreach ($codigos as $codigo) {
            $cacheKey = self::CACHE_PREFIX . $codigo->codigo;
            Cache::put($cacheKey, $codigo->producto_id, self::CACHE_TTL);
            $count++;
        }

        return $count;
    }

    /**
     * Invalidar caché para un código específico
     */
    public function invalidarCodigo(string $codigo): void
    {
        Cache::forget(self::CACHE_PREFIX . trim($codigo));
    }

    /**
     * Invalidar caché para un producto (todos sus códigos)
     */
    public function invalidarProducto(int $productoId): void
    {
        $codigos = CodigoBarra::where('producto_id', $productoId)
            ->pluck('codigo');

        foreach ($codigos as $codigo) {
            $this->invalidarCodigo($codigo);
        }
    }

    /**
     * Limpiar todo el caché de códigos de barra
     */
    public function limpiarTodo(): void
    {
        Cache::flush();
    }

    /**
     * Obtener estadísticas de caché
     */
    public function obtenerEstadisticas(): array
    {
        $totalCodigos = CodigoBarra::where('activo', true)->count();
        $totalProductos = Producto::where('activo', true)
            ->whereHas('codigosBarra', fn ($q) => $q->where('activo', true))
            ->count();

        return [
            'total_codigos_activos' => $totalCodigos,
            'total_productos_con_codigo' => $totalProductos,
            'cache_ttl' => self::CACHE_TTL,
            'cache_prefix' => self::CACHE_PREFIX,
        ];
    }

    /**
     * Precalentar el caché (warm up)
     * Útil después de despliegues o reinicio de servicios
     */
    public function precalentarCache(int $limite = 1000): int
    {
        $codigos = CodigoBarra::where('activo', true)
            ->select('codigo', 'producto_id')
            ->limit($limite)
            ->get();

        $count = 0;
        foreach ($codigos as $codigo) {
            $cacheKey = self::CACHE_PREFIX . $codigo->codigo;
            Cache::put($cacheKey, $codigo->producto_id, self::CACHE_TTL);
            $count++;
        }

        return $count;
    }
}
