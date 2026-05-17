<?php

namespace App\Services\Traits;

use App\Exceptions\Venta\EstadoInvalidoException;

/**
 * Trait para validar transiciones de estado usando máquina de estados
 *
 * Propósito: Centralizar la lógica de validación de transiciones de estado
 * de diferentes entidades (Proforma, Entrega, Ruta, etc.)
 *
 * Elimina la duplicación de código para validaciones idénticas en:
 * - ProformaService
 * - EntregaService
 * - RutaService
 *
 * Uso:
 * 1. Usar el trait en tu servicio:
 *    class ProformaService {
 *        use ValidatesStateTransitions;
 *    }
 *
 * 2. Definir una propiedad estática con transiciones válidas:
 *    protected static array $transicionesValidas = [
 *        'PENDIENTE' => ['APROBADA', 'RECHAZADA'],
 *        'APROBADA' => ['CONVERTIDA', 'RECHAZADA'],
 *        'CONVERTIDA' => [],
 *        'RECHAZADA' => [],
 *    ];
 *
 * 3. Llamar al método de validación:
 *    $this->validarTransicion($estadoActual, $estadoNuevo, 'Proforma', $id);
 */
trait ValidatesStateTransitions
{
    /**
     * Validar si una transición de estado es válida
     *
     * Lanza una excepción si la transición no está permitida.
     * Esto asegura una máquina de estados rigurosa.
     *
     * @param string $estadoActual Estado actual de la entidad
     * @param string $estadoNuevo Estado al que se quiere transicionar
     * @param string $nombreEntidad Nombre de la entidad (para el mensaje de error)
     * @param int $entidadId ID de la entidad (para el mensaje de error)
     *
     * @return void
     * @throws EstadoInvalidoException Si la transición no es válida
     *
     * Ejemplo:
     * $this->validarTransicion('PENDIENTE', 'APROBADA', 'Proforma', 123);
     * // ✅ Pasa sin errores
     *
     * $this->validarTransicion('PENDIENTE', 'CONVERTIDA', 'Proforma', 123);
     * // ❌ Lanza EstadoInvalidoException: No se puede pasar de PENDIENTE a CONVERTIDA
     */
    protected function validarTransicion(
        string $estadoActual,
        string $estadoNuevo,
        string $nombreEntidad = 'Entidad',
        int $entidadId = 0
    ): void {
        // Obtener transiciones válidas desde el estado actual
        $permitidas = static::$transicionesValidas[$estadoActual] ?? [];

        // Verificar que la transición esté permitida
        if (!in_array($estadoNuevo, $permitidas)) {
            throw EstadoInvalidoException::transicionInvalida(
                $nombreEntidad,
                $entidadId,
                $estadoActual,
                $estadoNuevo
            );
        }
    }

    /**
     * Obtener los estados válidos a los que se puede transicionar desde un estado actual
     *
     * Útil para mostrar en UI qué transiciones son posibles.
     *
     * @param string $estadoActual Estado actual
     * @return array Array de estados a los que se puede transicionar
     *
     * Ejemplo:
     * $estadosValidos = $this->obtenerEstadosValidos('PENDIENTE');
     * // Resultado: ['APROBADA', 'RECHAZADA']
     */
    protected function obtenerEstadosValidos(string $estadoActual): array
    {
        return static::$transicionesValidas[$estadoActual] ?? [];
    }

    /**
     * Verificar si una transición es válida SIN lanzar excepción
     *
     * Útil para validaciones condicionales donde se necesita un boolean.
     *
     * @param string $estadoActual Estado actual
     * @param string $estadoNuevo Estado destino
     * @return bool true si la transición es válida, false si no
     *
     * Ejemplo:
     * if ($this->esTransicionValida('PENDIENTE', 'APROBADA')) {
     *     // Hacer algo
     * }
     */
    protected function esTransicionValida(string $estadoActual, string $estadoNuevo): bool
    {
        $permitidas = static::$transicionesValidas[$estadoActual] ?? [];
        return in_array($estadoNuevo, $permitidas);
    }

    /**
     * Validar transición y obtener mensaje de error personalizado
     *
     * @param string $estadoActual
     * @param string $estadoNuevo
     * @param string $nombreEntidad
     * @return array ['valido' => bool, 'mensaje' => string]
     */
    protected function validarTransicionConMensaje(
        string $estadoActual,
        string $estadoNuevo,
        string $nombreEntidad = 'Entidad'
    ): array {
        $permitidas = static::$transicionesValidas[$estadoActual] ?? [];

        if (!in_array($estadoNuevo, $permitidas)) {
            $estadosPermitidos = implode(', ', $permitidas) ?: 'ninguno';
            return [
                'valido' => false,
                'mensaje' => "{$nombreEntidad} no puede pasar de {$estadoActual} a {$estadoNuevo}. "
                           . "Estados permitidos: {$estadosPermitidos}",
            ];
        }

        return [
            'valido' => true,
            'mensaje' => "Transición de {$estadoActual} a {$estadoNuevo} es válida",
        ];
    }
}
