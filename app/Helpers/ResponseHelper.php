<?php

namespace App\Helpers;

use Illuminate\Http\RedirectResponse;

/**
 * Helper para respuestas de redirección consistentes
 *
 * Propósito: Eliminar duplicación de mensajes de éxito/error en controladores
 * Ocurrencias originales: 27+ redirecciones inconsistentes
 *
 * Uso:
 * return ResponseHelper::created('categorias.index', 'Categoría creada');
 * return ResponseHelper::updated('categorias.index', 'Categoría actualizada');
 * return ResponseHelper::deleted('categorias.index', 'Categoría eliminada');
 */
class ResponseHelper
{
    /**
     * Redirección tras crear un recurso
     *
     * @param string $route Nombre de la ruta destino
     * @param string $message Mensaje personalizado (opcional)
     * @param string $resourceName Nombre del recurso (para mensaje por defecto)
     * @return RedirectResponse
     *
     * Ejemplo:
     * return ResponseHelper::created('categorias.index', 'Categoría creada exitosamente');
     */
    public static function created(string $route, string $message = null, string $resourceName = null): RedirectResponse
    {
        $defaultMessage = $resourceName
            ? ucfirst($resourceName) . ' creada exitosamente'
            : 'Recurso creado exitosamente';

        return redirect()
            ->route($route)
            ->with('success', $message ?? $defaultMessage);
    }

    /**
     * Redirección tras actualizar un recurso
     *
     * @param string $route Nombre de la ruta destino
     * @param string $message Mensaje personalizado (opcional)
     * @param string $resourceName Nombre del recurso (para mensaje por defecto)
     * @return RedirectResponse
     *
     * Ejemplo:
     * return ResponseHelper::updated('categorias.index', 'Categoría actualizada exitosamente');
     */
    public static function updated(string $route, string $message = null, string $resourceName = null): RedirectResponse
    {
        $defaultMessage = $resourceName
            ? ucfirst($resourceName) . ' actualizada exitosamente'
            : 'Recurso actualizado exitosamente';

        return redirect()
            ->route($route)
            ->with('success', $message ?? $defaultMessage);
    }

    /**
     * Redirección tras eliminar un recurso
     *
     * @param string $route Nombre de la ruta destino
     * @param string $message Mensaje personalizado (opcional)
     * @param string $resourceName Nombre del recurso (para mensaje por defecto)
     * @return RedirectResponse
     *
     * Ejemplo:
     * return ResponseHelper::deleted('categorias.index', 'Categoría eliminada exitosamente');
     */
    public static function deleted(string $route, string $message = null, string $resourceName = null): RedirectResponse
    {
        $defaultMessage = $resourceName
            ? ucfirst($resourceName) . ' eliminada exitosamente'
            : 'Recurso eliminado exitosamente';

        return redirect()
            ->route($route)
            ->with('success', $message ?? $defaultMessage);
    }

    /**
     * Redirección con mensaje de error
     *
     * @param string $route Nombre de la ruta destino
     * @param string $message Mensaje de error
     * @return RedirectResponse
     *
     * Ejemplo:
     * return ResponseHelper::error('categorias.index', 'No se pudo eliminar la categoría');
     */
    public static function error(string $route, string $message): RedirectResponse
    {
        return redirect()
            ->route($route)
            ->with('error', $message);
    }

    /**
     * Redirección genérica con mensaje personalizado
     *
     * @param string $route Nombre de la ruta destino
     * @param string $message Mensaje a mostrar
     * @param string $type Tipo de alerta ('success', 'error', 'warning', 'info')
     * @return RedirectResponse
     *
     * Ejemplo:
     * return ResponseHelper::withMessage('dashboard', 'Operación completada', 'warning');
     */
    public static function withMessage(string $route, string $message, string $type = 'info'): RedirectResponse
    {
        return redirect()
            ->route($route)
            ->with($type, $message);
    }
}
