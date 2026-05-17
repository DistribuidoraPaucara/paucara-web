{{--
    Items/Detalles de la venta
    Variables esperadas:
    - $documento: objeto Venta
    - $formato: 'a4', 'ticket-80', 'ticket-58' (opcional)
--}}
@php
    $formato = $formato ?? 'a4';
@endphp

@if($formato === 'a4')
    {{-- FORMATO A4: Tabla completa --}}
    <table class="tabla-productos">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 45%;">Producto</th>
                <th style="width: 10%;">Cant.</th>
                <th style="width: 12%;">P. Unit.</th>
                <th style="width: 10%;">Desc.</th>
                <th style="width: 18%;" class="text-right">Subt.</th>
            </tr>
        </thead>
        <tbody>
            @foreach($documento->detalles as $index => $detalle)
            {{-- ✅ NUEVO: Detectar si es combo --}}
            @php
                $esCombo = $detalle->producto->es_combo === true || $detalle->producto->es_combo === 1;
                $comboItems = $detalle->combo_items_seleccionados ?? [];
                $itemsSeleccionados = array_filter($comboItems, fn($item) => $item['incluido'] ?? false);
            @endphp

            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <strong>@if($esCombo) 📦 @endif {{ $detalle->producto->nombre }}</strong>
                    @if($detalle->producto->codigo)
                        <br><small style="color: #666;">Código: {{ $detalle->producto->codigo }}</small>
                    @endif
                    {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo desde las relaciones cargadas --}}
                    @if($esCombo && $detalle->producto->comboItems && $detalle->producto->comboItems->count() > 0)
                        <br><small style="color: #999; margin-top: 4px;">
                            @foreach($detalle->producto->comboItems as $comboItem)
                                @php
                                    // Calcular cantidad total = combo cantidad × cantidad del componente en el combo
                                    $cantidadComponente = $detalle->cantidad * $comboItem->cantidad;
                                @endphp
                                └─ {{ $comboItem->producto->nombre }} ({{ number_format($cantidadComponente, 0) }} u)<br>
                            @endforeach
                        </small>
                    @endif
                </td>
                <td>{{ number_format($detalle->cantidad, 2) }}</td>
                <td>{{ number_format($detalle->precio_unitario, 2) }}</td>
                <td>{{ number_format($detalle->descuento ?? 0, 2) }}</td>
                <td class="text-right"><strong>{{ number_format($detalle->subtotal, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

@elseif($formato === 'ticket-80')
    {{-- FORMATO TICKET 80mm: Tabla con columnas: Cantidad | Nombre | Precio Unit. | Subtotal --}}
    <table class="items" style="width: 100%; border-collapse: collapse;">
        {{-- ✅ ENCABEZADO DE LA TABLA --}}
        <thead>
            <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: bold; font-size: 11px;">
                <th style="width: 12%; text-align: center; padding: 2px 0;">CANT.</th>
                <th style="width: 50%; text-align: left; padding: 2px 4px;">NOMBRE</th>
                <th style="width: 18%; text-align: right; padding: 2px 0;">P.UNIT.</th>
                <th style="width: 20%; text-align: right; padding: 2px 2px;">SUB.</th>
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

            {{-- FILA DE PRODUCTO --}}
            <tr style="border-bottom: 1px dotted #ccc;">
                <td style="width: 12%; text-align: center; padding: 2px 0; font-size: 12px;">
                    {{ number_format($detalle->cantidad, 0) }}
                </td>
                <td style="width: 50%; text-align: left; padding: 2px 4px; font-size: 12px;">
                    <strong>{{ $detalle->producto->nombre }}</strong>
                    @if($detalle->producto->codigo)
                        <br><small style="color: #999; font-size: 8px;">{{ $detalle->producto->codigo }}</small>
                    @endif
                </td>
                <td style="width: 18%; text-align: right; padding: 2px 0; font-size: 12px;">
                    {{ number_format($detalle->precio_unitario, 2) }}
                </td>
                <td style="width: 20%; text-align: right; padding: 2px 2px; font-size: 12px; font-weight: bold;">
                    {{ number_format($detalle->subtotal, 2) }}
                </td>
            </tr>

            {{-- COMPONENTES DEL COMBO (2026-04-23) --}}
            @if($esCombo && $detalle->producto->comboItems && $detalle->producto->comboItems->count() > 0)
                @foreach($detalle->producto->comboItems as $comboItem)
                    @php
                        $cantidadComponente = $detalle->cantidad * $comboItem->cantidad;
                    @endphp
                    <tr>
                        <td style="width: 12%; text-align: center; padding: 2px 0; font-size: 11px;">
                            {{ number_format($cantidadComponente, 0) }}
                        </td>
                        <td style="width: 50%; text-align: left; padding: 2px 4px; font-size: 11px;">
                                {{ $comboItem->producto->nombre }}
                        </td>
                    </tr>
                @endforeach
            @endif

            @endforeach
        </tbody>
    </table>

@elseif($formato === 'ticket-58')
    {{-- FORMATO TICKET 58mm (compacto) --}}
    <table class="items">
        @foreach($documento->detalles as $detalle)
        {{-- ✅ NUEVO: Detectar si es combo --}}
        @php
            $esCombo = $detalle->producto->es_combo === true || $detalle->producto->es_combo === 1;
            $comboItems = $detalle->combo_items_seleccionados ?? [];
            $itemsSeleccionados = array_filter($comboItems, fn($item) => $item['incluido'] ?? false);
        @endphp

        <tr>
            <td colspan="2" style="font-weight: bold;">
                @if($esCombo) 📦 @endif
                {{ Str::limit($detalle->producto->nombre, 25) }}
            </td>
        </tr>
        <tr>
            <td style="width: 60%;">
                {{ number_format($detalle->cantidad, 0) }} x {{ number_format($detalle->precio_unitario, 2) }}
            </td>
            <td style="width: 40%; text-align: right;">
                <strong>{{ number_format($detalle->subtotal, 2) }}</strong>
            </td>
        </tr>

        {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
        @if($esCombo && $detalle->producto->comboItems && $detalle->producto->comboItems->count() > 0)
            @foreach($detalle->producto->comboItems as $comboItem)
                @php
                    $cantidadComponente = $detalle->cantidad * $comboItem->cantidad;
                @endphp
                <tr>
                    <td colspan="2" style="padding-left: 14px; font-size: 7px;">
                        └ {{ Str::limit($comboItem->producto->nombre, 22) }} ({{ number_format($cantidadComponente, 0) }} u)
                    </td>
                </tr>
            @endforeach
        @endif

        <tr><td colspan="2" style="height: 2px;"></td></tr>
        @endforeach
    </table>
@endif
