<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Ajustar según sistema de permisos
    }

    /**
     * ✅ NUEVO: Personalizar la respuesta de validación fallida
     * Agregar información de debug cuando hay errores
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $response = response()->json([
            'success' => false,
            'message' => 'Validación fallida',
            'errors' => $validator->errors()->messages(),
            // ✅ NUEVO: Información de debug en desarrollo
            'debug' => config('app.debug') ? [
                'detalles_enviados' => $this->input('detalles'),
                'subtotal_enviado' => $this->input('subtotal'),
                'total_enviado' => $this->input('total'),
            ] : null
        ], 422);

        throw new \Illuminate\Validation\ValidationException($validator, $response);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'numero'                     => 'nullable|string|unique:ventas,numero',
            'fecha'                      => 'required|date',
            'subtotal'                   => 'required|numeric|min:0',
            'descuento'                  => 'nullable|numeric|min:0',
            'impuesto'                   => 'nullable|numeric|min:0',
            'total'                      => 'required|numeric|min:0',
            'observaciones'              => 'nullable|string|max:500',
            'cliente_id'                 => 'required|exists:clientes,id',
            'usuario_id'                 => 'required|exists:users,id',
            'estado_documento_id'        => 'required|exists:estados_documento,id',
            'moneda_id'                  => 'nullable|exists:monedas,id',
            'proforma_id'                => 'nullable|exists:proformas,id',
            'tipo_pago_id'               => 'nullable|exists:tipos_pago,id',
            'tipo_documento_id'          => 'nullable|exists:tipos_documento,id',
            'requiere_envio'             => 'nullable|boolean',
            // ✅ CORREGIDO (2026-02-10): direccion_cliente_id solo requerida si requiere_envio=true
            'direccion_cliente_id'       => 'nullable|exists:direcciones_cliente,id',
            // ✅ NUEVO (2026-03-01): preventista_id es opcional, debe existir si se proporciona
            'preventista_id'             => 'nullable|exists:users,id',
            // ✅ NUEVO (2026-03-03): entrega_id es opcional, para asignar a una entrega existente
            'entrega_id'                 => 'nullable|exists:entregas,id',
            'canal_origen'               => 'nullable|string|in:APP_EXTERNA,WEB,PRESENCIAL',
            'estado_logistico'           => 'nullable|string|in:PENDIENTE_ENVIO,PREPARANDO,ENVIADO,ENTREGADO',

            // Validación de detalles
            'detalles'                   => 'required|array|min:1',
            'detalles.*.producto_id'     => 'required|exists:productos,id',
            'detalles.*.cantidad'        => 'required|numeric|min:0.000001',
            'detalles.*.unidad_medida_id' => 'nullable|exists:unidades_medida,id',
            'detalles.*.precio_unitario' => 'required|numeric|min:0.01|max:999999.99', // Problema #10: > 0 y razonable
            'detalles.*.descuento'       => 'nullable|numeric|min:0',
            'detalles.*.subtotal'        => 'required|numeric|min:0.01',
            'detalles.*.tipo_precio_id'  => 'nullable|integer|exists:tipos_precio,id',
            'detalles.*.tipo_precio_nombre' => 'nullable|string|max:100',
            // ✅ NUEVO: Validación para combo_items_seleccionados
            'detalles.*.combo_items_seleccionados' => 'nullable|array',
            'detalles.*.combo_items_seleccionados.*.combo_item_id' => 'nullable|integer|exists:combo_items,id',
            'detalles.*.combo_items_seleccionados.*.producto_id' => 'nullable|integer|exists:productos,id',
            'detalles.*.combo_items_seleccionados.*.incluido' => 'nullable|boolean',
            // ✅ NUEVO (2026-03-02): Validación para monto_pagado_inicial
            'monto_pagado_inicial' => 'nullable|numeric|min:0',

            // ✅ NUEVO (2026-03-09): Validación para pagos parciales
            'pagos' => 'nullable|array|min:0',
            'pagos.*.tipo_pago_id' => 'required_if:pagos,present|exists:tipos_pago,id',
            'pagos.*.monto' => 'required_if:pagos,present|numeric|min:0.01',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'numero.required'                     => 'El número de venta es requerido.',
            'numero.unique'                       => 'El número de venta ya existe.',
            'fecha.required'                      => 'La fecha es requerida.',
            'fecha.date'                          => 'La fecha debe ser válida.',
            'subtotal.required'                   => 'El subtotal es requerido.',
            'subtotal.numeric'                    => 'El subtotal debe ser numérico.',
            'subtotal.min'                        => 'El subtotal debe ser mayor a 0.',
            'total.required'                      => 'El total es requerido.',
            'total.numeric'                       => 'El total debe ser numérico.',
            'total.min'                           => 'El total debe ser mayor a 0.',
            'cliente_id.required'                 => 'El cliente es requerido.',
            'cliente_id.exists'                   => 'El cliente seleccionado no existe.',
            'usuario_id.required'                 => 'El usuario es requerido.',
            'usuario_id.exists'                   => 'El usuario seleccionado no existe.',
            'estado_documento_id.required'        => 'El estado del documento es requerido.',
            'estado_documento_id.exists'          => 'El estado del documento seleccionado no existe.',
            'moneda_id.required'                  => 'La moneda es requerida.',
            'moneda_id.exists'                    => 'La moneda seleccionada no existe.',
            // ✅ NUEVO (2026-02-10): Mensaje para dirección cliente
            'direccion_cliente_id.exists'         => 'La dirección de cliente seleccionada no existe.',
            // ✅ NUEVO (2026-03-01): Mensaje para preventista
            'preventista_id.exists'               => 'El preventista seleccionado no existe.',
            // ✅ NUEVO (2026-03-03): Mensaje para entrega
            'entrega_id.exists'                   => 'La entrega seleccionada no existe.',

            'detalles.required'                   => 'Los detalles de venta son requeridos.',
            'detalles.array'                      => 'Los detalles deben ser un arreglo.',
            'detalles.min'                        => 'Debe incluir al menos un detalle de venta.',
            'detalles.*.producto_id.required'     => 'El producto es requerido en cada detalle.',
            'detalles.*.producto_id.exists'       => 'El producto seleccionado no existe.',
            'detalles.*.cantidad.required'        => 'La cantidad es requerida en cada detalle.',
            'detalles.*.cantidad.numeric'         => 'La cantidad debe ser un número válido.',
            'detalles.*.cantidad.min'             => 'La cantidad debe ser mayor a 0.',
            'detalles.*.unidad_medida_id.exists'  => 'La unidad de medida seleccionada no existe.',
            'detalles.*.precio_unitario.required' => 'El precio unitario es requerido.',
            'detalles.*.precio_unitario.numeric'  => 'El precio unitario debe ser numérico.',
            'detalles.*.precio_unitario.min'      => 'El precio unitario debe ser mayor a 0.',
            'detalles.*.subtotal.required'        => 'El subtotal del detalle es requerido.',
            'detalles.*.subtotal.numeric'         => 'El subtotal del detalle debe ser numérico.',
            'detalles.*.subtotal.min'             => 'El subtotal del detalle debe ser mayor a 0.',
            // ✅ NUEVO (2026-03-02): Mensajes para monto_pagado_inicial
            'monto_pagado_inicial.numeric'        => 'El monto pagado debe ser un número válido.',
            'monto_pagado_inicial.min'            => 'El monto pagado no puede ser negativo.',

            // ✅ NUEVO (2026-03-09): Mensajes para pagos parciales
            'pagos.array'                         => 'Los pagos deben ser un arreglo.',
            'pagos.*.tipo_pago_id.required_if'    => 'El tipo de pago es requerido para cada pago parcial.',
            'pagos.*.tipo_pago_id.exists'         => 'El tipo de pago seleccionado no existe.',
            'pagos.*.monto.required_if'           => 'El monto es requerido para cada pago parcial.',
            'pagos.*.monto.numeric'               => 'El monto debe ser un número válido.',
            'pagos.*.monto.min'                   => 'El monto debe ser mayor a 0.01.',
        ];
    }

    /**
     * Configure el validador para agregar validaciones personalizadas
     *
     * Problema #9: Validar coherencia de cálculos
     * Problema #11: Validar que cliente esté activo
     * Problema #14: Validar que moneda esté activa
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $validator->getData();

            // ✅ NUEVO (2026-02-10): Validar que direccion_cliente_id sea requerida solo cuando requiere_envio=true
            $requiereEnvio = $data['requiere_envio'] ?? false;
            $direccionClienteId = $data['direccion_cliente_id'] ?? null;

            if ($requiereEnvio && !$direccionClienteId) {
                $validator->errors()->add(
                    'direccion_cliente_id',
                    'La dirección de entrega es requerida cuando la venta requiere envío.'
                );
            }

            // Validar coherencia de cálculos de detalles
            if (isset($data['detalles']) && is_array($data['detalles'])) {
                $subtotalCalculado = 0;

                foreach ($data['detalles'] as $index => $detalle) {
                    // Validar que subtotal del detalle sea correcto
                    $cantidad = $detalle['cantidad'] ?? 0;
                    $precioUnitario = $detalle['precio_unitario'] ?? 0;
                    $descuentoDetalle = $detalle['descuento'] ?? 0;
                    $esFraccionado = $detalle['es_fraccionado'] ?? false;
                    $unidadVentaId = $detalle['unidad_venta_id'] ?? null;

                    // ✅ MODIFICADO: Para productos fraccionados, confiar en el cálculo del frontend
                    // El frontend ya tiene toda la lógica de conversión correcta
                    $precioUnitarioEsperado = $precioUnitario;

                    // ℹ️ Para fraccionados, no recalcular desde backend
                    // Solo validar que: subtotal = cantidad × precio_unitario - descuento
                    // Los precios fraccionados ya han sido calculados correctamente en frontend

                    $subtotalEsperado = ($cantidad * $precioUnitarioEsperado) - $descuentoDetalle;
                    $subtotalRecibido = $detalle['subtotal'] ?? 0;

                    \Log::debug("📊 [StoreVentaRequest] Cálculo de subtotal del detalle #{$index}:", [
                        'es_fraccionado' => $esFraccionado,
                        'unidad_venta_id' => $unidadVentaId,
                        'cantidad' => $cantidad,
                        'precio_unitario_recibido' => $precioUnitario,
                        'precio_unitario_esperado' => $precioUnitarioEsperado,
                        'descuento_detalle' => $descuentoDetalle,
                        'subtotal_esperado' => $subtotalEsperado,
                        'subtotal_recibido' => $subtotalRecibido,
                        'diferencia' => abs($subtotalEsperado - $subtotalRecibido),
                        'coincide' => abs($subtotalEsperado - $subtotalRecibido) <= ($esFraccionado ? 0.05 : 0.01)
                    ]);

                    // ✅ MODIFICADO: Aumentar tolerancia para productos fraccionados (errores de redondeo)
                    $tolerancia = $esFraccionado ? 0.05 : 0.01;
                    if (abs($subtotalEsperado - $subtotalRecibido) > $tolerancia) {
                        $validator->errors()->add(
                            "detalles.{$index}.subtotal",
                            "El subtotal del detalle no coincide. Esperado: " . number_format($subtotalEsperado, 2) .
                            ", Recibido: " . number_format($subtotalRecibido, 2)
                        );
                    }

                    $subtotalCalculado += $subtotalRecibido;
                }

                // ✅ MODIFICADO: Recalcular automáticamente subtotal y total basado en detalles
                // Permite que usuarios editen manualmente precios sin rechazar la venta
                $descuento = $data['descuento'] ?? 0;
                $impuesto = $data['impuesto'] ?? 0;

                // Forzar subtotal = suma de detalles
                $data['subtotal'] = $subtotalCalculado;
                $data['total'] = $subtotalCalculado - $descuento + $impuesto;
            }

            // Validar que el cliente esté activo
            if (isset($data['cliente_id'])) {
                $cliente = \App\Models\Cliente::find($data['cliente_id']);
                if ($cliente && !$cliente->activo) {
                    $validator->errors()->add(
                        'cliente_id',
                        "El cliente '{$cliente->nombre}' está desactivado. Active el cliente antes de continuar."
                    );
                }
            }

            // Validar que la moneda esté activa
            if (isset($data['moneda_id'])) {
                $moneda = \App\Models\Moneda::find($data['moneda_id']);
                if ($moneda && !$moneda->activo) {
                    $validator->errors()->add(
                        'moneda_id',
                        "La moneda '{$moneda->nombre}' está desactivada. Active la moneda antes de continuar."
                    );
                }
            }

            // ✅ Validar que el cliente esté habilitado para crédito si la venta es a crédito
            // Y que tenga saldo disponible para el monto de la venta
            if (isset($data['cliente_id']) && isset($data['tipo_pago_id']) && isset($data['total'])) {
                $tipoPago = \App\Models\TipoPago::find($data['tipo_pago_id']);

                if ($tipoPago && strtoupper($tipoPago->codigo) === 'CREDITO') {
                    $cliente = \App\Models\Cliente::find($data['cliente_id']);

                    if ($cliente) {
                        // Usar el método de validación del cliente
                        $validacion = $cliente->esCreditoValido((float)$data['total']);

                        if (!$validacion['valido']) {
                            // Agregar todos los errores de validación
                            foreach ($validacion['errores'] as $error) {
                                $validator->errors()->add('cliente_id', $error);
                            }
                        }
                    }
                }
            }

            // ✅ ACTUALIZADO (2026-05-03): Validar que suma de pagos sea >= total de venta
            // Permite pagos mayores al total (genera cambio)
            if (isset($data['pagos']) && is_array($data['pagos'])) {
                $totalPagos = 0;
                $pagosValidos = [];

                foreach ($data['pagos'] as $index => $pago) {
                    // Solo contar pagos que tienen tipo_pago_id y monto válidos
                    if (!empty($pago['tipo_pago_id']) && isset($pago['monto']) && $pago['monto'] > 0) {
                        $totalPagos += (float) $pago['monto'];
                        $pagosValidos[] = $pago;
                    }
                }

                // Validar que suma de pagos sea >= al total (permite cambio)
                if ($totalPagos > 0 && isset($data['total'])) {
                    $total = (float) $data['total'];
                    if ($totalPagos < $total) {
                        $validator->errors()->add(
                            'pagos',
                            "La suma de pagos (Bs. " . number_format($totalPagos, 2) .
                            ") debe ser mayor o igual al total (Bs. " . number_format($total, 2) . ")"
                        );
                    }
                }
            }

            // ✅ NUEVO (2026-02-16): Validar cantidades fraccionadas solo si producto permite
            if (isset($data['detalles']) && is_array($data['detalles'])) {
                foreach ($data['detalles'] as $index => $detalle) {
                    $producto = \App\Models\Producto::find($detalle['producto_id'] ?? null);
                    $cantidad = $detalle['cantidad'] ?? 0;

                    if ($producto) {
                        // 🔷 VALIDACIÓN 1: Rechazar decimales si NO es fraccionado
                        if (!$producto->es_fraccionado) {
                            // Verificar si cantidad tiene decimales
                            if ((float) $cantidad != floor((float) $cantidad)) {
                                $validator->errors()->add(
                                    "detalles.{$index}.cantidad",
                                    "El producto '{$producto->nombre}' no permite cantidades fraccionadas. " .
                                    "Solo se pueden vender unidades completas."
                                );
                            }
                        }

                        $unidadId = $detalle['unidad_medida_id'] ?? $producto->unidad_medida_id;

                        // 🔷 VALIDACIÓN 2: Si NO es fraccionado y la unidad es diferente a la base
                        if (!$producto->es_fraccionado && $unidadId != $producto->unidad_medida_id) {
                            $validator->errors()->add(
                                "detalles.{$index}.unidad_medida_id",
                                "El producto '{$producto->nombre}' no es fraccionado y solo puede venderse en su unidad base"
                            );
                        }

                        // 🔷 VALIDACIÓN 3: Si ES fraccionado, validar que existe conversión
                        if ($producto->es_fraccionado && $unidadId != $producto->unidad_medida_id) {
                            $existe = \App\Models\ConversionUnidadProducto::where('producto_id', $producto->id)
                                ->where(function($q) use ($unidadId, $producto) {
                                    $q->where(function($q2) use ($unidadId, $producto) {
                                        $q2->where('unidad_base_id', $producto->unidad_medida_id)
                                           ->where('unidad_destino_id', $unidadId);
                                    })->orWhere(function($q2) use ($unidadId, $producto) {
                                        $q2->where('unidad_base_id', $unidadId)
                                           ->where('unidad_destino_id', $producto->unidad_medida_id);
                                    });
                                })
                                ->where('activo', true)
                                ->exists();

                            if (!$existe) {
                                $validator->errors()->add(
                                    "detalles.{$index}.unidad_medida_id",
                                    "No existe conversión de unidad configurada para el producto '{$producto->nombre}'"
                                );
                            }
                        }
                    }
                }
            }
        });
    }
}
