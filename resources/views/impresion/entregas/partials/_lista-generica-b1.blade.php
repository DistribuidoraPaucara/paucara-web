{{-- Lista Genérica Agrupada optimizada para B1 --}}
<div style="margin-top: 25px; margin-bottom: 30px; width: 100%; box-sizing: border-box;">
    <h3 style="font-size: 18px; color: #4F81BD; border-bottom: 3px solid #4F81BD; padding-bottom: 8px; margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
        LISTA GENÉRICA DE PRODUCTOS (CONSOLIDADO)
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; table-layout: auto; box-sizing: border-box;">
        <thead>
            <tr style="background: #4F81BD; color: white;">
                <th style="padding: 10px 8px; font-size: 13px; text-align: left; width: 5%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">#</th>
                <th style="padding: 10px 8px; font-size: 13px; text-align: left; width: 35%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">Producto</th>
                <th style="padding: 10px 8px; font-size: 13px; text-align: center; width: 13%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">Cantidad Total</th>
                <th style="padding: 10px 8px; font-size: 13px; text-align: right; width: 12%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">P.Unit.</th>
                <th style="padding: 10px 8px; font-size: 13px; text-align: center; width: 10%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">En Ventas</th>
                <th style="padding: 10px 8px; font-size: 13px; text-align: right; width: 15%; box-sizing: border-box; font-weight: bold; border: 1px solid #357ABD;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $itemNum = 1; @endphp
            @forelse($productosGenerico as $producto)
                <tr style="border-bottom: 1px solid #ddd; @if($itemNum % 2 === 0)background: #f9f9f9;@endif">
                    <td style="padding: 8px; font-size: 12px; box-sizing: border-box; overflow: hidden; word-wrap: break-word; text-align: center; border-right: 1px solid #eee;">{{ $itemNum }}</td>
                    <td style="padding: 8px; font-size: 12px; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">
                        <strong style="font-size: 13px; display: block;">@if($producto['es_combo']) 📦 @endif {{ $producto['producto_nombre'] }}</strong>
                        @if($producto['codigo_producto'])
                            <span style="color: #999; font-size: 10px;">{{ $producto['codigo_producto'] }}</span>
                        @endif
                        {{-- ✅ NUEVO (2026-04-23): Mostrar componentes del combo --}}
                        @if($producto['es_combo'] && !empty($producto['componentes']))
                            <div style="color: #666; font-size: 10px; margin-top: 4px;">
                                @foreach($producto['componentes'] as $componente)
                                    └─ {{ $componente['producto_nombre'] }} ({{ number_format($componente['cantidad'], 0) }} {{ $componente['unidad'] }})<br>
                                @endforeach
                            </div>
                        @endif
                    </td>
                    <td style="padding: 8px; font-size: 12px; text-align: center; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">
                        {{ number_format($producto['cantidad_total'], 2) }} <span style="font-size: 11px; color: #666;">{{ $producto['unidad_medida'] }}</span>
                    </td>
                    <td style="padding: 8px; font-size: 12px; text-align: right; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">Bs {{ number_format($producto['precio_unitario'], 2) }}</td>
                    <td style="padding: 8px; font-size: 12px; text-align: center; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ $producto['cantidad_ventas'] }}</td>
                    <td style="padding: 8px; font-size: 13px; text-align: right; font-weight: bold; box-sizing: border-box; overflow: hidden; word-wrap: break-word; color: #4F81BD;">Bs {{ number_format($producto['subtotal_total'], 2) }}</td>
                </tr>
                @php $itemNum++; @endphp
            @empty
                <tr>
                    <td colspan="6" style="padding: 20px; text-align: center; color: #999; font-size: 13px; box-sizing: border-box; width: 100%;">
                        Sin productos asignados a esta entrega
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Totales de la lista genérica agrupada --}}
    @if($productosGenerico->isNotEmpty())
        <div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border: 2px solid #4F81BD; width: 100%; box-sizing: border-box; border-radius: 4px;">
            @php
                $totalCantidad = $productosGenerico->sum('cantidad_total');
                $totalSubtotal = $productosGenerico->sum('subtotal_total');
            @endphp
            <table style="width: 100%; font-size: 13px; box-sizing: border-box; table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 12px; box-sizing: border-box; width: 33.33%; border-right: 1px solid #ddd;">
                        <strong style="font-size: 14px;">Productos Únicos:</strong>
                        <p style="margin: 6px 0 0 0; font-size: 16px; color: #4F81BD; font-weight: bold;">{{ $productosGenerico->count() }}</p>
                    </td>
                    <td style="padding: 10px 12px; text-align: center; box-sizing: border-box; width: 33.33%; border-right: 1px solid #ddd;">
                        <strong style="font-size: 14px;">Total Cantidad:</strong>
                        <p style="margin: 6px 0 0 0; font-size: 16px; color: #4F81BD; font-weight: bold;">{{ number_format($totalCantidad, 2) }}</p>
                    </td>
                    <td style="padding: 10px 12px; text-align: right; background: #e8f4f8; box-sizing: border-box; width: 33.34%; border-radius: 0 4px 4px 0;">
                        <strong style="font-size: 14px;">TOTAL ENTREGA:</strong>
                        <p style="margin: 6px 0 0 0; font-size: 18px; color: #2196F3; font-weight: bold;">Bs {{ number_format($totalSubtotal, 2) }}</p>
                    </td>
                </tr>
            </table>
        </div>
    @endif
</div>
