{{--
    Items/Detalles de la compra
    Variables esperadas:
    - $compra: objeto Compra
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
                <th style="width: 18%;" class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($compra->detalles as $index => $detalle)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $detalle->producto->nombre }}</strong>
                    @if($detalle->producto->codigo)
                        <br><small style="color: #666;">Código: {{ $detalle->producto->codigo }}</small>
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
    {{-- FORMATO TICKET 80mm --}}
    <table class="items">
        @foreach($compra->detalles as $detalle)
        <tr>
            <td colspan="3" class="item-nombre">{{ $detalle->producto->nombre }}</td>
        </tr>
        @if($detalle->producto->codigo)
        <tr>
            <td colspan="3" class="item-detalle">Código: {{ $detalle->producto->codigo }}</td>
        </tr>
        @endif
        <tr>
            <td style="width: 50%;">
                {{ number_format($detalle->cantidad, 2) }} x {{ number_format($detalle->precio_unitario, 2) }}
            </td>
            <td style="width: 10%;"></td>
            <td style="width: 40%; text-align: right;">
                <strong>{{ number_format($detalle->subtotal, 2) }}</strong>
            </td>
        </tr>
        <tr><td colspan="3" style="height: 3px;"></td></tr>
        @endforeach
    </table>

@elseif($formato === 'ticket-58')
    {{-- FORMATO TICKET 58mm (compacto) --}}
    <table class="items">
        @foreach($compra->detalles as $detalle)
        <tr>
            <td colspan="2" style="font-weight: bold;">{{ Str::limit($detalle->producto->nombre, 25) }}</td>
        </tr>
        <tr>
            <td style="width: 60%;">
                {{ number_format($detalle->cantidad, 0) }} x {{ number_format($detalle->precio_unitario, 2) }}
            </td>
            <td style="width: 40%; text-align: right;">
                <strong>{{ number_format($detalle->subtotal, 2) }}</strong>
            </td>
        </tr>
        <tr><td colspan="2" style="height: 2px;"></td></tr>
        @endforeach
    </table>
@endif
