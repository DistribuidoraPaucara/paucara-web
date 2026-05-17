{{--
    Sección de Totales
    ✅ Muestra subtotal
    ✅ Muestra descuento si existe
    ✅ Muestra monto a pagar
    ✅ Muestra cambio si aplica
    ✅ Muestra total en letras
--}}
<div class="totales text-right">
    <table>
        {{-- Subtotal --}}
        {{-- <tr>
            <td><strong>Subtotal:</strong></td>
            <td class="text-right">{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->subtotal + ($documento->descuento ?? 0), 2) }}</td>
        </tr> --}}

        {{-- Mostrar descuento si existe --}}
        {{-- @if($documento->descuento > 0)
        @endif --}}
        <tr style="font-size:12px;">
            <td><strong>Descuento:</strong></td>
            <td class="text-right">{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->descuento, 2) }}</td>
        </tr>

        {{-- ✅ NUEVO: Detalles de pagos (tipo de pago y monto) --}}
        @if($documento->detallesPagoVenta && $documento->detallesPagoVenta->count() > 0)
            @foreach($documento->detallesPagoVenta as $detallePago)
            <tr style="font-size:11px;">
                <td><strong>{{ $detallePago->tipoPago->nombre ?? 'Pago' }}:</strong></td>
                <td class="text-right">{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($detallePago->monto, 2) }}</td>
            </tr>
            @endforeach
        @endif

        {{-- TOTAL (final a pagar) --}}
        <tr class="total-final" style="font-size:12px;">
            <td><strong>Total:</strong></td>
            <td class="text-right">
                <strong>{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->total, 2) }}</strong>
            </td>
        </tr>
        {{-- MONTO PAGADO --}}
        <tr style="font-size:12px;">
            <td><strong>Monto Pagado:</strong></td>
            <td class="text-left">{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->monto_pagado ?? 0, 2) }}</td>
        </tr>
        {{-- CAMBIO --}}
        @php
        $cambio = max(0, ($documento->monto_pagado ?? 0) - $documento->total);
        @endphp
        <tr style="font-size:12px;">
            <td><strong>Cambio:</strong></td>
            <td class="text-right">{{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($cambio, 2) }}</td>
        </tr>
    </table>
</div>

{{-- TOTAL EN LETRAS --}}
<div style="margin-top: 10px; padding: 8px; background-color: #f9f9f9; border-radius: 4px; text-align: center; font-size: 10px; font-weight: bold;">
    {{ \App\Helpers\FormatHelper::numeroALetras($documento->total, 'Bolivianos') }} 00/100 Bolivianos
</div>
