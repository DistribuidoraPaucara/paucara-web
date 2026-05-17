<?php

namespace App\Services\Logistica;

use App\Models\EstadoLogistica;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class EstadoLogisticoCacheService
{
    private const CACHE_TTL = 86400; // 24 horas en segundos
    private const CACHE_KEY_PREFIX = 'estados_logistica:';
    private const ALL_CATEGORIES_KEY = 'estados_logistica:categorias';

    /**
     * Obtener estados de una categoría (con cache)
     */
    public function obtenerEstadosCacheados(string $categoria): Collection
    {
        $key = self::CACHE_KEY_PREFIX . $categoria;

        try {
            return Cache::remember(
                $key,
                self::CACHE_TTL,
                fn() => $this->cargarEstadosDB($categoria)
            );
        } catch (\Exception $e) {
            Log::warning("Error obteniendo estados cacheados para {$categoria}: {$e->getMessage()}");

            // Fallback a BD directamente si cache falla
            return $this->cargarEstadosDB($categoria);
        }
    }

    /**
     * Cargar estados directamente de BD
     */
    private function cargarEstadosDB(string $categoria): Collection
    {
        return EstadoLogistica::where('categoria', $categoria)
            ->where('activo', true)
            ->orderBy('orden')
            ->get();
    }

    /**
     * Obtener todas las categorías de estados
     */
    public function obtenerCategoriasCacheadas(): array
    {
        try {
            return Cache::remember(
                self::ALL_CATEGORIES_KEY,
                self::CACHE_TTL,
                function () {
                    return EstadoLogistica::where('activo', true)
                        ->select('categoria')
                        ->distinct()
                        ->pluck('categoria')
                        ->toArray();
                }
            );
        } catch (\Exception $e) {
            Log::warning("Error obteniendo categorías: {$e->getMessage()}");

            return [];
        }
    }

    /**
     * Pre-cargar todos los estados en cache (cache warming)
     */
    public function precalentarCache(): void
    {
        try {
            $categorias = $this->obtenerCategoriasCacheadas();

            foreach ($categorias as $categoria) {
                $this->obtenerEstadosCacheados($categoria);
            }

            Log::info('Cache de estados precalentado exitosamente');
        } catch (\Exception $e) {
            Log::error("Error precalentando cache: {$e->getMessage()}");
        }
    }

    /**
     * Invalidar cache de una categoría específica
     */
    public function invalidarCache(?string $categoria = null): void
    {
        try {
            if ($categoria) {
                $key = self::CACHE_KEY_PREFIX . $categoria;
                Cache::forget($key);
                Log::info("Cache de estados invalidado para categoría: {$categoria}");
            } else {
                // Invalidar todas las categorías
                $categorias = $this->obtenerCategoriasCacheadas();

                foreach ($categorias as $cat) {
                    $key = self::CACHE_KEY_PREFIX . $cat;
                    Cache::forget($key);
                }

                // Invalidar lista de categorías
                Cache::forget(self::ALL_CATEGORIES_KEY);

                Log::info('Cache de estados invalidado completamente');
            }
        } catch (\Exception $e) {
            Log::error("Error invalidando cache: {$e->getMessage()}");
        }
    }

    /**
     * Obtener estadísticas de cache
     */
    public function obtenerEstadisticasCache(): array
    {
        try {
            $categorias = $this->obtenerCategoriasCacheadas();
            $stats = [
                'cache_ttl' => self::CACHE_TTL,
                'cache_store' => config('cache.default'),
                'categorias_totales' => count($categorias),
                'categorias' => [],
            ];

            foreach ($categorias as $categoria) {
                $estados = $this->obtenerEstadosCacheados($categoria);
                $stats['categorias'][$categoria] = [
                    'total_estados' => $estados->count(),
                    'estados_finales' => $estados->filter(fn($e) => $e->es_estado_final)->count(),
                ];
            }

            return $stats;
        } catch (\Exception $e) {
            Log::error("Error obteniendo estadísticas de cache: {$e->getMessage()}");

            return [];
        }
    }

    /**
     * Validar integridad del cache
     */
    public function validarIntegridad(): bool
    {
        try {
            $categorias = $this->obtenerCategoriasCacheadas();

            // Validar que cada categoría en cache coincida con BD
            foreach ($categorias as $categoria) {
                $cached = $this->obtenerEstadosCacheados($categoria);
                $db = $this->cargarEstadosDB($categoria);

                if ($cached->count() !== $db->count()) {
                    Log::warning("Desalineación de cache en categoría: {$categoria}");

                    return false;
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::error("Error validando integridad de cache: {$e->getMessage()}");

            return false;
        }
    }

    /**
     * Limpiar todo el cache del sistema (si se pasa $force=true)
     */
    public function limpiarTodo(bool $force = false): bool
    {
        if (!$force) {
            return false;
        }

        try {
            Cache::flush();
            Log::warning('Cache del sistema limpiado completamente');

            return true;
        } catch (\Exception $e) {
            Log::error("Error limpiando cache: {$e->getMessage()}");

            return false;
        }
    }
}
