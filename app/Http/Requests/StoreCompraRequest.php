<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Validator;

class StoreCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        Log::info('StoreCompraRequest::authorize() - Solicitud de compra recibida');
        return true;
    }

    public function rules(): array
    {
        return [
            'numero'                       => 'nullable|string|unique:compras,numero',
            'fecha'                        => 'required|date|before_or_equal:today',
            'numero_factura'               => 'nullable|string',
            'subtotal'                     => 'required|numeric|min:0',
            'descuento'                    => 'nullable|numeric|min:0',
            'impuesto'                     => 'nullable|numeric|min:0',
            'total'                        => 'required|numeric|min:0',
            'observaciones'                => 'nullable|string|max:500',
            'proveedor_id'                 => 'required|exists:proveedores,id',
            'usuario_id'                   => 'required|exists:users,id',
            'estado_documento_id'          => 'required|exists:estados_documento,id',
            'moneda_id'                    => 'required|exists:monedas,id',
            'tipo_pago_id'                 => 'nullable|exists:tipos_pago,id',
            'almacen_id'                   => 'required|exists:almacenes,id',
            'detalles'                     => 'required|array|min:1',
            'detalles.*.producto_id'       => 'required|exists:productos,id',
            'detalles.*.cantidad'          => 'required|integer|min:1|max:999999',
            'detalles.*.precio_unitario'   => 'required|numeric|min:0.01|max:9999999', // Problema #10: > 0
            'detalles.*.descuento'         => 'nullable|numeric|min:0',
            'detalles.*.subtotal'          => 'required|numeric|min:0.01',
            'detalles.*.lote'              => 'nullable|string|max:50',
            'detalles.*.fecha_vencimiento' => 'nullable|date|after:today',
        ];
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
        Log::info('StoreCompraRequest::withValidator() - Iniciando validaciones adicionales', [
            'data_keys'      => array_keys($this->all()),
            'fecha'          => $this->input('fecha'),
            'proveedor_id'   => $this->input('proveedor_id'),
            'subtotal'       => $this->input('subtotal'),
            'total'          => $this->input('total'),
            'detalles_count' => count($this->input('detalles', [])),
        ]);

        $validator->after(function (Validator $validator) {
            // 1. Validar coherencia de subtotal con detalles
            $this->validarCoherenciaSubtotal($validator);

            // 2. Validar coherencia de total
            $this->validarCoherenciaTotal($validator);

            // 3. Validar que el descuento no exceda el subtotal
            $this->validarDescuento($validator);

            // 4. Validar coherencia de subtotales de detalles
            $this->validarDetallesSubtotal($validator);

            // 5. Validar productos activos
            $this->validarProductosActivos($validator);

            // 6. Problema #12: Validar que proveedor esté activo
            $this->validarProveedorActivo($validator);

            // 7. Problema #14: Validar que moneda esté activa
            $this->validarMonedaActiva($validator);
        });
    }

    private function validarCoherenciaSubtotal(Validator $validator): void
    {
        $detalles          = $this->input('detalles', []);
        $subtotalCalculado = array_reduce($detalles, fn($sum, $det) => $sum + ($det['subtotal'] ?? 0), 0);
        $subtotalDeclarado = $this->input('subtotal', 0);

        Log::info('StoreCompraRequest::validarCoherenciaSubtotal()', [
            'subtotalDeclarado' => $subtotalDeclarado,
            'subtotalCalculado' => $subtotalCalculado,
            'diferencia'        => abs($subtotalCalculado - $subtotalDeclarado),
        ]);

        // Permitir margen de error de 0.01 por redondeos
        if (abs($subtotalCalculado - $subtotalDeclarado) > 0.01) {
            Log::warning('StoreCompraRequest::validarCoherenciaSubtotal() - FALLA', [
                'error' => "El subtotal ({$subtotalDeclarado}) no coincide con la suma de los detalles ({$subtotalCalculado}).",
            ]);
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

        Log::info('StoreCompraRequest::validarCoherenciaTotal()', [
            'subtotal'       => $subtotal,
            'descuento'      => $descuento,
            'impuesto'       => $impuesto,
            'totalDeclarado' => $total,
            'totalCalculado' => $totalCalculado,
            'diferencia'     => abs($totalCalculado - $total),
        ]);

        // Permitir margen de error de 0.01 por redondeos
        if (abs($totalCalculado - $total) > 0.01) {
            Log::warning('StoreCompraRequest::validarCoherenciaTotal() - FALLA', [
                'error' => "El total ({$total}) no coincide con el cálculo (subtotal: {$subtotal} - descuento: {$descuento} + impuesto: {$impuesto} = {$totalCalculado}).",
            ]);
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

            $subtotalCalculado = ($cantidad * $precioUnitario) - $descuento;

            // Permitir margen de error de 0.01 por redondeos
            if (abs($subtotalCalculado - $subtotal) > 0.01) {
                $validator->errors()->add("detalles.{$index}.subtotal",
                    "El subtotal del detalle #{$index} ({$subtotal}) no coincide con el cálculo ({$subtotalCalculado})."
                );
            }

            // Validar que el descuento no exceda el subtotal antes del descuento
            $subtotalAntesDescuento = $cantidad * $precioUnitario;
            if ($descuento > $subtotalAntesDescuento) {
                $validator->errors()->add("detalles.{$index}.descuento",
                    "El descuento del detalle #{$index} ({$descuento}) no puede ser mayor al subtotal ({$subtotalAntesDescuento})."
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
