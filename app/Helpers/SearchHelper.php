<?php

namespace App\Helpers;

/**
 * Helper para búsquedas genéricas
 *
 * Propósito: Eliminar duplicación de whereRaw('LOWER(...) like ?') en controladores
 * Ocurrencias originales: 23 veces en 15+ controladores
 *
 * Uso:
 * User::query()
 *     ->when($q, fn($query) => SearchHelper::byNameOrFields($query, $q, ['nombre', 'email']))
 *     ->paginate()
 */
class SearchHelper
{
    /**
     * Búsqueda sensible a mayúsculas en un solo campo
     *
     * Ejemplo: SearchHelper::byName($query, 'test', 'nombre')
     * Genera: WHERE LOWER(nombre) LIKE '%test%'
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $searchTerm Término a buscar
     * @param string $field Campo a buscar
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function byField($query, string $searchTerm, string $field)
    {
        $searchLower = strtolower($searchTerm);
        return $query->whereRaw("LOWER({$field}) like ?", ["%{$searchLower}%"]);
    }

    /**
     * Búsqueda en campo 'nombre' (shortcut común)
     *
     * Ejemplo: SearchHelper::byName($query, 'test')
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $searchTerm
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function byName($query, string $searchTerm)
    {
        return self::byField($query, $searchTerm, 'nombre');
    }

    /**
     * Búsqueda en múltiples campos (OR logic)
     *
     * Ejemplo:
     * SearchHelper::byFields($query, 'test', ['nombre', 'codigo', 'descripcion'])
     *
     * Genera: WHERE LOWER(nombre) LIKE '%test%' OR LOWER(codigo) LIKE '%test%' OR ...
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $searchTerm Término a buscar
     * @param array $fields Array de campos donde buscar
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function byFields($query, string $searchTerm, array $fields = ['nombre'])
    {
        $searchLower = strtolower($searchTerm);

        return $query->where(function ($q) use ($searchLower, $fields) {
            foreach ($fields as $field) {
                $q->orWhereRaw("LOWER({$field}) like ?", ["%{$searchLower}%"]);
            }
        });
    }

    /**
     * Búsqueda en nombre Y código (caso común en catálogos)
     *
     * Ejemplo: SearchHelper::byNameOrCode($query, 'test')
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $searchTerm
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function byNameOrCode($query, string $searchTerm)
    {
        return self::byFields($query, $searchTerm, ['nombre', 'codigo']);
    }
}
