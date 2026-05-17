{{--
    Items/Detalles de la venta - Versión FARMACIA
    Variables esperadas:
    - $documento: objeto Venta
    - $formato: 'ticket-80-farmacia' (obligatorio)

    Layout: Dos filas por producto
    - Fila 1: CANT. | PRODUCTO
    - Fila 2: (vacío) | P.U. | QTY | SUBTOTAL (precio_unitario * cantidad)
--}}

@php
    $formato = $formato ?? 'ticket-80-farmacia';
@endphp

@if($formato === 'ticket-80-farmacia')
    {{-- FORMATO TICKET 80mm FARMACIA: Dos filas por producto --}}
    <table class="items-farmacia" style="width: 100%; border-collapse: collapse;">
        {{-- ✅ ENCABEZADO DE LA TABLA --}}
        <thead>
            <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold; font-size: 13px;">
                <th style="width: 100%; text-align: left; padding: 2px 4px;">PRODUCTO | CANT. | P.U. | SUBTOTAL</th>
            </tr>
        </thead>

        {{-- ✅ CUERPO DE LA TABLA --}}
        <tbody>
            @foreach($documento->detalles as $detalle)
            {{-- Detectar si es combo --}}
            @php
                $esCombo = $detalle->producto->es_combo === true || $detalle->producto->es_combo === 1;
                $comboItems = $detalle->combo_items_seleccionados ?? [];
                $itemsSeleccionados = array_filter($comboItems, fn($item) => $item['incluido'] ?? false);
            @endphp

            {{-- FILA 1: SOLO NOMBRE DEL PRODUCTO --}}
            <tr style="border-bottom: 1px dotted #ccc;">
                <td style="width: 100%; text-align: left; padding: 3px 4px; font-size: 13px;">
                    <strong>{{ $detalle->producto->nombre }}</strong>
                    @if($detalle->producto->codigo)
                        <br><small style="color: #999; font-size: 9px;">Cod: {{ $detalle->producto->codigo }}</small>
                    @endif
                </td>
            </tr>

            {{-- FILA 2: CANTIDAD | PRECIO UNITARIO | SUBTOTAL --}}
            <tr style="border-bottom: 1px dotted #ccc;">
                <td style="width: 100%; text-align: left; padding: 2px 4px; font-size: 12px;">
                    <span style="margin-right: 12px;"><strong>Cant:</strong> {{ number_format($detalle->cantidad, 2) }}</span>
                    <span style="margin-right: 12px;"><strong>| P.U:</strong> {{ number_format($detalle->precio_unitario, 2) }} Bs</span>
                    <span style="font-weight: bold;"><strong>| SubTotal:</strong> {{ number_format($detalle->precio_unitario * $detalle->cantidad, 2) }} Bs</span>
                </td>
            </tr>

            {{-- ✅ LÍNEA SEPARADORA ENTRE PRODUCTOS --}}
            <tr>
                <td colspan="2" style="padding: 4; border-bottom: 1px solid #000; height: 2px;"></td>
            </tr>

            {{-- ITEMS DEL COMBO SI EXISTEN --}}
            @if($esCombo && count($itemsSeleccionados) > 0)
                <tr>
                    <td colspan="2" style="padding: 2px 4px; font-size: 10px; color: #666;">
                        <strong>Componentes ({{ count($itemsSeleccionados) }}):</strong>
                    </td>
                </tr>
                @foreach($itemsSeleccionados as $item)
                    @php
                        $itemProducto = $documento->detalles
                            ->flatMap(fn($d) => $d->producto->comboItems ?? [])
                            ->firstWhere('producto_id', $item['producto_id'])
                            ?->producto;
                    @endphp
                    <tr>
                        <td colspan="2" style="padding: 1px 12px; font-size: 11px; color: #999;">
                            └─ {{ $itemProducto?->nombre ?? 'Producto #' . $item['producto_id'] }}
                            @if($item['cantidad'] ?? false)
                                ({{ $item['cantidad'] }} u)
                            @endif
                        </td>
                    </tr>
                @endforeach
            @endif

            @endforeach
        </tbody>
    </table>

@endif
