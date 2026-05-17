{{-- Lista Genérica Agrupada de todos los productos en la entrega --}}
<div style="margin-top: 15px; margin-bottom: 20px; width: 100%; box-sizing: border-box;">
    <h3 style="font-size: 12px; color: #4F81BD; border-bottom: 2px solid #4F81BD; padding-bottom: 4px; margin: 0 0 8px 0; width: 100%; box-sizing: border-box;">
        LISTA GENÉRICA DE PRODUCTOS (CONSOLIDADO)
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin: 8px 0; table-layout: fixed; box-sizing: border-box;">
        <thead>
            <tr style="background: #f0f0f0; border-bottom: 1px solid #999;">
                <th style="padding: 5px 3px; font-size: 8px; text-align: left; width: 4%; box-sizing: border-box;">#</th>
                <th style="padding: 5px 3px; font-size: 8px; text-align: left; width: 40%; box-sizing: border-box;">Producto</th>
                <th style="padding: 5px 3px; font-size: 8px; text-align: center; width: 12%; box-sizing: border-box;">Cantidad Total</th>
                <th style="padding: 5px 3px; font-size: 8px; text-align: right; width: 12%; box-sizing: border-box;">P.Unit.</th>
                <th style="padding: 5px 3px; font-size: 8px; text-align: right; width: 14%; box-sizing: border-box;">En Ventas</th>
                <th style="padding: 5px 3px; font-size: 8px; text-align: right; width: 18%; box-sizing: border-box;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $itemNum = 1; @endphp
            @forelse($productosGenerico as $producto)
                <tr style="border-bottom: 1px dotted #ccc;">
                    <td style="padding: 4px 3px; font-size: 8px; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ $itemNum }}</td>
                    <td style="padding: 4px 3px; font-size: 8px; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">
                        <strong>@if($producto['es_combo']) 📦 @endif {{ $producto['producto_nombre'] }}</strong>
                        @if($producto['codigo_producto'])
                            <br><span style="color: #999; font-size: 7px;">{{ $producto['codigo_producto'] }}</span>
                        @endif
                        {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
                        @if($producto['es_combo'] && !empty($producto['componentes']))
                            <br><span style="color: #666; font-size: 7px;">
                                @foreach($producto['componentes'] as $componente)
                                    └─ {{ $componente['producto_nombre'] }} ({{ number_format($componente['cantidad'], 0) }} {{ $componente['unidad'] }})<br>
                                @endforeach
                            </span>
                        @endif
                    </td>
                    <td style="padding: 4px 3px; font-size: 8px; text-align: center; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">
                        {{ number_format($producto['cantidad_total'], 2) }} {{ $producto['unidad_medida'] }}
                    </td>
                    <td style="padding: 4px 3px; font-size: 8px; text-align: right; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($producto['precio_unitario'], 2) }}</td>
                    <td style="padding: 4px 3px; font-size: 8px; text-align: right; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ $producto['cantidad_ventas'] }}</td>
                    <td style="padding: 4px 3px; font-size: 8px; text-align: right; font-weight: bold; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($producto['subtotal_total'], 2) }}</td>
                </tr>
                @php $itemNum++; @endphp
            @empty
                <tr>
                    <td colspan="6" style="padding: 10px; text-align: center; color: #999; font-size: 9px; box-sizing: border-box; width: 100%;">
                        Sin productos asignados a esta entrega
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Totales de la lista genérica agrupada --}}
    @if($productosGenerico->isNotEmpty())
        <div style="margin-top: 8px; padding: 8px; background: #f9f9f9; border: 1px solid #ddd; width: 100%; box-sizing: border-box;">
            @php
                $totalCantidad = $productosGenerico->sum('cantidad_total');
                $totalSubtotal = $productosGenerico->sum('subtotal_total');
            @endphp
            <table style="width: 100%; font-size: 9px; box-sizing: border-box; table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td style="padding: 3px 8px; box-sizing: border-box; width: 33.33%;">
                        <strong>Productos Únicos:</strong> {{ $productosGenerico->count() }}
                    </td>
                    <td style="padding: 3px 8px; text-align: right; box-sizing: border-box; width: 33.33%;">
                        <strong>Total Cantidad:</strong> {{ number_format($totalCantidad, 2) }}
                    </td>
                    <td style="padding: 3px 8px; text-align: right; background: #e8f4f8; border-radius: 3px; box-sizing: border-box; width: 33.34%;">
                        <strong>TOTAL ENTREGA:</strong> {{ number_format($totalSubtotal, 2) }}
                    </td>
                </tr>
            </table>
        </div>
    @endif
</div>
