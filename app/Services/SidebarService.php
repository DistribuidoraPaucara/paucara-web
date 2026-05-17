<?php

namespace App\Services;

use App\Models\ModuloSidebar;

class SidebarService
{
    /**
     * Obtener módulos para el sidebar principal
     */
    public function obtenerModulosParaSidebar(): array
    {
        $modulos = ModuloSidebar::obtenerParaSidebar();

        return $modulos
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            })
            ->map(function ($modulo) {
                return $modulo->toNavItem();
            })
            ->values()
            ->toArray();
    }

    /**
     * Obtener módulos para el footer del sidebar
     */
    public function obtenerModulosParaFooter(): array
    {
        // Por ahora devolvemos un array vacío, pero aquí podrías implementar
        // módulos específicos para el footer como configuración, documentación, etc.
        return [];
    }

    /**
     * Sincronizar módulos desde configuración estática (utilidad para migración)
     */
    public function sincronizarModulosDesdeConfiguracion(array $modulosEstaticos): void
    {
        foreach ($modulosEstaticos as $moduloData) {
            $this->crearOActualizarModulo($moduloData);
        }
    }

    /**
     * Crear o actualizar un módulo
     */
    private function crearOActualizarModulo(array $data, $padre = null): ModuloSidebar
    {
        $moduloData = [
            'titulo' => $data['title'],
            'ruta' => $data['href'],
            'icono' => $data['icon'] ?? null,
            'es_submenu' => $padre !== null,
            'modulo_padre_id' => $padre?->id,
            'activo' => true,
        ];

        // Buscar módulo existente por título y ruta
        $modulo = ModuloSidebar::where('titulo', $moduloData['titulo'])
            ->where('ruta', $moduloData['ruta'])
            ->where('es_submenu', $moduloData['es_submenu'])
            ->when($padre, function ($query) use ($padre) {
                $query->where('modulo_padre_id', $padre->id);
            })
            ->first();

        if ($modulo) {
            $modulo->update($moduloData);
        } else {
            $modulo = ModuloSidebar::create($moduloData);
        }

        // Procesar submódulos si existen
        if (isset($data['children']) && is_array($data['children'])) {
            foreach ($data['children'] as $index => $child) {
                $childData = array_merge($child, ['orden' => $index + 1]);
                $this->crearOActualizarModulo($childData, $modulo);
            }
        }

        return $modulo;
    }

    /**
     * Obtener módulos agrupados por categoría
     */
    public function obtenerModulosPorCategoria(): array
    {
        $modulos = ModuloSidebar::activos()
            ->principales()
            ->ordenados()
            ->with(['submodulos' => function ($query) {
                $query->activos()->ordenados();
            }])
            ->get()
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            });

        return $modulos->groupBy('categoria')->map(function ($grupoModulos, $categoria) {
            return [
                'categoria' => $categoria ?: 'General',
                'modulos' => $grupoModulos->map(function ($modulo) {
                    return $modulo->toNavItem();
                })->values()->toArray(),
            ];
        })->values()->toArray();
    }

    /**
     * Buscar módulos por término
     */
    public function buscarModulos(string $termino): array
    {
        return ModuloSidebar::activos()
            ->where(function ($query) use ($termino) {
                $query->where('titulo', 'ILIKE', "%{$termino}%")
                    ->orWhere('descripcion', 'ILIKE', "%{$termino}%");
            })
            ->ordenados()
            ->with('padre')
            ->get()
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            })
            ->map(function ($modulo) {
                return [
                    'id' => $modulo->id,
                    'titulo' => $modulo->titulo,
                    'ruta' => $modulo->ruta,
                    'icono' => $modulo->icono,
                    'descripcion' => $modulo->descripcion,
                    'categoria' => $modulo->categoria,
                    'padre' => $modulo->padre ? $modulo->padre->titulo : null,
                ];
            })
            ->values()
            ->toArray();
    }
}
