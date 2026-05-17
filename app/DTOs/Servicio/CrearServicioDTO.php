<?php

namespace App\DTOs\Servicio;

use App\DTOs\BaseDTO;
use Illuminate\Validation\ValidationException;

class CrearServicioDTO extends BaseDTO
{
    public function __construct(
        public ?int $cliente_id = null,
        public string $descripcion = '',
        public float $monto = 0,
        public ?int $tipo_pago_id = null,
        public ?string $observaciones = null,
    ) {
        $this->validar();
    }

    public function validar(): void
    {
        // Validar descripción
        if (empty($this->descripcion)) {
            throw ValidationException::withMessages([
                'descripcion' => 'La descripción es requerida.',
            ]);
        }

        // Validar monto
        if ($this->monto <= 0) {
            throw ValidationException::withMessages([
                'monto' => 'El monto debe ser mayor a 0.',
            ]);
        }

        // Validar tipo de pago
        if (!$this->tipo_pago_id) {
            throw ValidationException::withMessages([
                'tipo_pago_id' => 'El tipo de pago es requerido.',
            ]);
        }
    }

    public static function fromRequest($request): self
    {
        return new self(
            cliente_id: $request->input('cliente_id') ? (int)$request->input('cliente_id') : null,
            descripcion: $request->input('descripcion', ''),
            monto: (float)$request->input('monto', 0),
            tipo_pago_id: $request->input('tipo_pago_id') ? (int)$request->input('tipo_pago_id') : null,
            observaciones: $request->input('observaciones'),
        );
    }
}
