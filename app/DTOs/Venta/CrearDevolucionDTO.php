<?php

namespace App\DTOs\Venta;

use App\DTOs\BaseDTO;
use Illuminate\Validation\ValidationException;

class CrearDevolucionDTO extends BaseDTO
{
    public function __construct(
        public string $tipo, // DEVOLUCION | CAMBIO
        public int $venta_id,
        public int $cliente_id,
        public string $motivo,
        public string $tipo_reembolso, // EFECTIVO | CREDITO
        public array $detalles, // [{detalle_venta_id, producto_id, cantidad_devuelta, precio_unitario}]
        public ?array $detalles_cambio = null, // [{producto_id, cantidad, precio_unitario}]
        public ?int $tipo_pago_id = null, // Tipo de pago para la devolución (si es EFECTIVO)
        public ?string $observaciones = null,
    ) {
        $this->validar();
    }

    /**
     * Validar los datos del DTO
     *
     * @throws ValidationException
     */
    public function validar(): void
    {
        // Validar tipo
        if (!in_array($this->tipo, ['DEVOLUCION', 'CAMBIO'])) {
            throw ValidationException::withMessages([
                'tipo' => 'El tipo debe ser DEVOLUCION o CAMBIO.',
            ]);
        }

        // Validar reembolso
        if (!in_array($this->tipo_reembolso, ['EFECTIVO', 'CREDITO'])) {
            throw ValidationException::withMessages([
                'tipo_reembolso' => 'El tipo de reembolso debe ser EFECTIVO o CREDITO.',
            ]);
        }

        // Si es EFECTIVO, tipo_pago_id es requerido
        if ($this->tipo_reembolso === 'EFECTIVO' && !$this->tipo_pago_id) {
            throw ValidationException::withMessages([
                'tipo_pago_id' => 'El tipo de pago es requerido para devoluciones en efectivo.',
            ]);
        }

        // Validar detalles
        if (empty($this->detalles)) {
            throw ValidationException::withMessages([
                'detalles' => 'Debe devolver al menos un producto.',
            ]);
        }

        // Validar cantidades en detalles
        foreach ($this->detalles as $detalle) {
            if (!isset($detalle['cantidad_devuelta']) || $detalle['cantidad_devuelta'] <= 0) {
                throw ValidationException::withMessages([
                    'detalles' => 'Todas las cantidades devueltas deben ser mayores a 0.',
                ]);
            }
        }

        // Si es CAMBIO, validar detalles_cambio
        if ($this->tipo === 'CAMBIO') {
            if (empty($this->detalles_cambio)) {
                throw ValidationException::withMessages([
                    'detalles_cambio' => 'Para un cambio, debe especificar los productos nuevos.',
                ]);
            }

            foreach ($this->detalles_cambio as $cambio) {
                if (!isset($cambio['cantidad']) || $cambio['cantidad'] <= 0) {
                    throw ValidationException::withMessages([
                        'detalles_cambio' => 'Todas las cantidades nuevas deben ser mayores a 0.',
                    ]);
                }
            }
        }
    }

    /**
     * Factory: Crear desde request
     */
    public static function fromRequest($request): self
    {
        return new self(
            tipo: $request->input('tipo'),
            venta_id: $request->input('venta_id'),
            cliente_id: $request->input('cliente_id'),
            motivo: $request->input('motivo'),
            tipo_reembolso: $request->input('tipo_reembolso'),
            detalles: $request->input('detalles', []),
            detalles_cambio: $request->input('detalles_cambio'),
            tipo_pago_id: $request->input('tipo_pago_id') ? (int)$request->input('tipo_pago_id') : null,
            observaciones: $request->input('observaciones'),
        );
    }
}
