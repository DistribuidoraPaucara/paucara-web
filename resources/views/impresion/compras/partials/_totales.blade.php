{{--
    Sección de Totales para Compras
    ✅ Muestra subtotal, descuento e impuesto
    ✅ Muestra el total final
--}}
<div class="totales" style="font-size: 13px;">
    <table>
        {{-- SUBTOTAL --}}
        <tr>
            <td><strong>Subtotal:</strong></td>
            <td class="text-right">{{ $compra->moneda->simbolo ?? 'Bs' }} {{ number_format($compra->subtotal, 2) }}</td>
        </tr>

        {{-- DESCUENTO (si existe) --}}
        @if($compra->descuento > 0)
        <tr>
            <td><strong>Descuento:</strong></td>
            <td class="text-right">-{{ $compra->moneda->simbolo ?? 'Bs' }} {{ number_format($compra->descuento, 2) }}</td>
        </tr>
        @endif

        {{-- IMPUESTO (si existe) --}}
        @if($compra->impuesto > 0)
        <tr>
            <td><strong>Impuesto:</strong></td>
            <td class="text-right">+{{ $compra->moneda->simbolo ?? 'Bs' }} {{ number_format($compra->impuesto, 2) }}</td>
        </tr>
        @endif

        {{-- TOTAL FINAL --}}
        <tr class="total-final">
            <td><strong>TOTAL:</strong></td>
            <td class="text-right">
                <strong>{{ $compra->moneda->simbolo ?? 'Bs' }} {{ number_format($compra->total, 2) }}</strong>
            </td>
        </tr>
    </table>
</div>
