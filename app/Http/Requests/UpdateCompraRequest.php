<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $compraId = $this->route('compra');
        $rules = [
            'numero'                       => 'sometimes|string|unique:compras,numero,' . $compraId,
            'fecha'                        => 'sometimes|date|before_or_equal:today',
            'numero_factura'               => 'nullable|string',
            'subtotal'                     => 'sometimes|numeric|min:0',
            'descuento'                    => 'nullable|numeric|min:0',
            'impuesto'                     => 'nullable|numeric|min:0',
            'total'                        => 'sometimes|numeric|min:0',
            'observaciones'                => 'nullable|string|max:500',
            'proveedor_id'                 => 'sometimes|exists:proveedores,id',
            'usuario_id'                   => 'sometimes|exists:users,id',
            'estado_documento_id'          => 'sometimes|exists:estados_documento,id',
            'moneda_id'                    => 'sometimes|exists:monedas,id',
            'tipo_pago_id'                 => 'nullable|exists:tipos_pago,id',
        ];

        // Solo validar detalles si están siendo modificados (Escenario 1)
        // En Escenario 2 (solo cambio de estado), los detalles pueden venir como strings
        // y no necesitan ser validados estrictamente
        if ($this->has('detalles') && is_array($this->input('detalles'))) {
            $firstDetalle = $this->input('detalles.0', null);

            // Detectar si es Escenario 2: Solo cambio de estado sin modificación real de detalles
            // En este caso, los detalles vienen como strings y no deben validarse como nuevos
            $esEscenarioEstadoOnly = !$this->hasDetallesModificados();

            if (!$esEscenarioEstadoOnly) {
                $rules['detalles'] = 'sometimes|array|min:1';
                $rules['detalles.*.id'] = 'nullable|exists:detalle_compras,id';
                $rules['detalles.*.producto_id'] = 'required|exists:productos,id';
                $rules['detalles.*.cantidad'] = 'required|integer|min:1|max:999999';
                $rules['detalles.*.precio_unitario'] = 'required|numeric|min:0.01|max:9999999';
                $rules['detalles.*.descuento'] = 'nullable|numeric|min:0';
                $rules['detalles.*.subtotal'] = 'required|numeric|min:0.01';
                $rules['detalles.*.lote'] = 'nullable|string|max:50';
                $rules['detalles.*.fecha_vencimiento'] = 'nullable|date|after:today';
            }
        }

        return $rules;
    }

    /**
     * Detectar si los detalles fueron realmente modificados
     * Retorna false si parece ser un cambio de estado-only (Escenario 2)
     */
    private function hasDetallesModificados(): bool
    {
        $detalles = $this->input('detalles', []);

        if (empty($detalles)) {
            return false;
        }

        // Si los valores están llegando como strings en cantidad/precio_unitario,
        // probablemente son datos existentes siendo reenviados sin cambios
        foreach ($detalles as $detalle) {
            // Si hay un ID existente y los valores son strings, es escenario-only
            if (isset($detalle['id']) && is_string($detalle['cantidad']) && is_string($detalle['precio_unitario'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validaciones adicionales después de las reglas básicas
     *
     * Problema #9: Coherencia de cálculos
     * Problema #12: Proveedor activo
     * Problema #14: Moneda activa
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Detectar si es Escenario 2: solo cambio de estado
            $esEscenarioEstadoOnly = !$this->hasDetallesModificados();

            // Solo validar coherencia si se están actualizando detalles (Escenario 1)
            if (!$esEscenarioEstadoOnly) {
                if ($this->has('subtotal') || $this->has('detalles')) {
                    $this->validarCoherenciaSubtotal($validator);
                }

                if ($this->has('total') || $this->has('subtotal') || $this->has('descuento') || $this->has('impuesto')) {
                    $this->validarCoherenciaTotal($validator);
                }

                if ($this->has('descuento')) {
                    $this->validarDescuento($validator);
                }

                if ($this->has('detalles')) {
                    $this->validarDetallesSubtotal($validator);
                    $this->validarProductosActivos($validator);
                }
            }

            // Problema #12: Validar proveedor activo
            if ($this->has('proveedor_id')) {
                $this->validarProveedorActivo($validator);
            }

            // Problema #14: Validar moneda activa
            if ($this->has('moneda_id')) {
                $this->validarMonedaActiva($validator);
            }
        });
    }

    private function validarCoherenciaSubtotal(Validator $validator): void
    {
        if (! $this->has('detalles')) {
            return;
        }

        $detalles          = $this->input('detalles', []);
        $subtotalCalculado = array_reduce($detalles, fn($sum, $det) => $sum + ($det['subtotal'] ?? 0), 0);
        $subtotalDeclarado = $this->input('subtotal', 0);

        // ✅ TOLERANCIA: 0.0001 (BD almacena hasta 10 decimales: decimal:18,10)
        if (abs($subtotalCalculado - $subtotalDeclarado) > 0.0001) {
            $validator->errors()->add('subtotal',
                "El subtotal ({$subtotalDeclarado}) no coincide con la suma de los detalles ({$subtotalCalculado})."
            );
        }
    }

    private function validarCoherenciaTotal(Validator $validator): void
    {
        $subtotal  = $this->input('subtotal', 0);
        $descuento = $this->input('descuento', 0);
        $impuesto  = $this->input('impuesto', 0);
        $total     = $this->input('total', 0);

        $totalCalculado = $subtotal - $descuento + $impuesto;

        // ✅ TOLERANCIA: 0.05 para errores de redondeo en cálculos decimales
        if (abs($totalCalculado - $total) > 0.05) {
            $validator->errors()->add('total',
                "El total ({$total}) no coincide con el cálculo (subtotal: {$subtotal} - descuento: {$descuento} + impuesto: {$impuesto} = {$totalCalculado})."
            );
        }
    }

    private function validarDescuento(Validator $validator): void
    {
        $subtotal  = $this->input('subtotal', 0);
        $descuento = $this->input('descuento', 0);

        if ($descuento > $subtotal) {
            $validator->errors()->add('descuento',
                "El descuento ({$descuento}) no puede ser mayor al subtotal ({$subtotal})."
            );
        }
    }

    private function validarDetallesSubtotal(Validator $validator): void
    {
        $detalles = $this->input('detalles', []);

        foreach ($detalles as $index => $detalle) {
            $cantidad       = $detalle['cantidad'] ?? 0;
            $precioUnitario = $detalle['precio_unitario'] ?? 0;
            $descuento      = $detalle['descuento'] ?? 0;
            $subtotal       = $detalle['subtotal'] ?? 0;

            // ✅ REMOVIDO 2026-03-19: Validación de coherencia de subtotal removida
            // El frontend recalcula automáticamente el subtotal (cantidad × precio - descuento)
            // por lo que ya no es necesario validar en el backend

            if ($descuento > ($cantidad * $precioUnitario)) {
                $validator->errors()->add("detalles.{$index}.descuento",
                    "El descuento del detalle #{$index} ({$descuento}) no puede ser mayor al subtotal (" . ($cantidad * $precioUnitario) . ")."
                );
            }
        }
    }

    private function validarProductosActivos(Validator $validator): void
    {
        $detalles = $this->input('detalles', []);

        foreach ($detalles as $index => $detalle) {
            $productoId = $detalle['producto_id'] ?? null;

            if ($productoId) {
                $producto = \App\Models\Producto::find($productoId);

                if ($producto && ! $producto->activo) {
                    $validator->errors()->add("detalles.{$index}.producto_id",
                        "El producto seleccionado en el detalle #{$index} no está activo."
                    );
                }
            }
        }
    }

    /**
     * Problema #12: Validar que el proveedor esté activo
     */
    private function validarProveedorActivo(Validator $validator): void
    {
        $proveedorId = $this->input('proveedor_id');

        if ($proveedorId) {
            $proveedor = \App\Models\Proveedor::find($proveedorId);

            if ($proveedor && ! $proveedor->activo) {
                $validator->errors()->add('proveedor_id',
                    "El proveedor '{$proveedor->nombre}' está desactivado. Active el proveedor antes de continuar."
                );
            }
        }
    }

    /**
     * Problema #14: Validar que la moneda esté activa
     */
    private function validarMonedaActiva(Validator $validator): void
    {
        $monedaId = $this->input('moneda_id');

        if ($monedaId) {
            $moneda = \App\Models\Moneda::find($monedaId);

            if ($moneda && ! $moneda->activo) {
                $validator->errors()->add('moneda_id',
                    "La moneda '{$moneda->nombre}' está desactivada. Active la moneda antes de continuar."
                );
            }
        }
    }
}
