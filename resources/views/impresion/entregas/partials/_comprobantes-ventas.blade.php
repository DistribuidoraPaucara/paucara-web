{{-- Comprobantes de las ventas asociadas --}}
@if($entrega->ventas->isNotEmpty())
    <div style="margin-top: 20px; page-break-before: always; width: 100%; box-sizing: border-box;">
        <h3 style="font-size: 12px; color: #4F81BD; border-bottom: 2px solid #4F81BD; padding-bottom: 4px; margin: 0 0 8px 0; width: 100%; box-sizing: border-box;">
            COMPROBANTES DE VENTAS ENTREGADOS AL CLIENTE
        </h3>

        <p style="font-size: 9px; color: #666; margin: 8px 0; padding: 6px; background: #f0f0f0; border-left: 3px solid #4F81BD; width: 100%; box-sizing: border-box;">
            <strong>Nota:</strong> A continuación se muestran los comprobantes/facturas de las ventas que se entregan con esta carga.
        </p>

        @foreach($entrega->ventas as $venta)
            {{-- Información de la venta --}}
            <div style="margin-top: 15px; padding: 8px; background: #fafafa; border: 1px solid #ddd; border-radius: 3px; width: 100%; box-sizing: border-box; overflow: visible;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 9px; width: 100%; box-sizing: border-box; overflow: visible;">
                    <div style="box-sizing: border-box; width: 100%; overflow: visible;">
                        <p style="margin: 2px 0; box-sizing: border-box;"><strong>Venta #{{ $venta->numero }}</strong></p>
                        <p style="margin: 2px 0; box-sizing: border-box;"><strong>Fecha:</strong> {{ $venta->fecha?->format('d/m/Y') ?? 'N/A' }}</p>
                        <p style="margin: 2px 0; box-sizing: border-box;"><strong>Cliente:</strong> {{ $venta->cliente?->nombre ?? 'N/A' }}</p>
                        @if($venta->cliente?->direccion)
                            <p style="margin: 2px 0; font-size: 8px; box-sizing: border-box;"><strong>Dir:</strong> {{ substr($venta->cliente->direccion, 0, 40) }}</p>
                        @endif
                    </div>
                    <div style="text-align: right; box-sizing: border-box; width: 100%; overflow: visible;">
                        <p style="margin: 2px 0; box-sizing: border-box;"><strong>Documento:</strong> {{ $venta->tipoDocumento?->nombre ?? 'FACTURA' }}</p>
                        <p style="margin: 2px 0; box-sizing: border-box;"><strong>Vendedor:</strong> {{ $venta->usuario?->name ?? 'N/A' }}</p>
                        @if($venta->estadoDocumento)
                            <p style="margin: 2px 0; box-sizing: border-box;"><strong>Estado:</strong> {{ $venta->estadoDocumento->nombre }}</p>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Tabla de items de la venta --}}
            <table style="width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 8px; box-sizing: border-box; table-layout: fixed;">
                <thead>
                    <tr style="background: #f0f0f0; border-bottom: 1px solid #999;">
                        <th style="padding: 4px 3px; text-align: left; width: 5%; box-sizing: border-box;">#</th>
                        <th style="padding: 4px 3px; text-align: left; width: 40%; box-sizing: border-box;">Producto</th>
                        <th style="padding: 4px 3px; text-align: center; width: 12%; box-sizing: border-box;">Cantidad</th>
                        <th style="padding: 4px 3px; text-align: right; width: 15%; box-sizing: border-box;">P.Unit.</th>
                        <th style="padding: 4px 3px; text-align: right; width: 18%; box-sizing: border-box;">Descuento</th>
                        <th style="padding: 4px 3px; text-align: right; width: 15%; box-sizing: border-box;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($venta->detalles as $index => $detalle)
                        <tr style="border-bottom: 1px dotted #ddd;">
                            <td style="padding: 3px 3px; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ $index + 1 }}</td>
                            <td style="padding: 3px 3px; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">
                                {{ substr($detalle->producto?->nombre ?? 'N/A', 0, 35) }}
                                @if($detalle->producto?->codigo)
                                    <br><span style="color: #999; font-size: 7px;">{{ $detalle->producto->codigo }}</span>
                                @endif
                            </td>
                            <td style="padding: 3px 3px; text-align: center; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($detalle->cantidad, 2) }}</td>
                            <td style="padding: 3px 3px; text-align: right; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($detalle->precio_unitario, 2) }}</td>
                            <td style="padding: 3px 3px; text-align: right; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($detalle->descuento ?? 0, 2) }}</td>
                            <td style="padding: 3px 3px; text-align: right; font-weight: bold; box-sizing: border-box; overflow: hidden; word-wrap: break-word;">{{ number_format($detalle->subtotal, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{-- Totales de la venta --}}
            <table style="width: 50%; margin: 4px 0; font-size: 9px; margin-left: auto; margin-right: 0; box-sizing: border-box; table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td style="padding: 2px 6px; box-sizing: border-box;"><strong>Subtotal:</strong></td>
                    <td style="padding: 2px 6px; text-align: right; box-sizing: border-box;">{{ number_format($venta->subtotal, 2) }}</td>
                </tr>
                @if($venta->descuento > 0)
                    <tr>
                        <td style="padding: 2px 6px; box-sizing: border-box;"><strong>Descuento:</strong></td>
                        <td style="padding: 2px 6px; text-align: right; box-sizing: border-box;">-{{ number_format($venta->descuento, 2) }}</td>
                    </tr>
                @endif
                @if($venta->impuesto > 0)
                    <tr>
                        <td style="padding: 2px 6px; box-sizing: border-box;"><strong>IVA:</strong></td>
                        <td style="padding: 2px 6px; text-align: right; box-sizing: border-box;">{{ number_format($venta->impuesto, 2) }}</td>
                    </tr>
                @endif
                <tr style="background: #e8f4f8; border-top: 1px solid #999; border-bottom: 1px solid #999;">
                    <td style="padding: 3px 6px; box-sizing: border-box;"><strong>TOTAL:</strong></td>
                    <td style="padding: 3px 6px; text-align: right; font-weight: bold; box-sizing: border-box;">{{ number_format($venta->total, 2) }}</td>
                </tr>
            </table>

            {{-- Información de pago --}}
            @if($venta->estado_pago || $venta->monto_pagado)
                <div style="margin: 6px 0; padding: 4px 6px; background: #f9f9f9; border-left: 2px solid #ddd; font-size: 8px; width: 100%; box-sizing: border-box;">
                    <p style="margin: 2px 0;">
                        <strong>Pago:</strong> {{ $venta->estado_pago ?? 'N/A' }}
                        @if($venta->monto_pagado > 0)
                            - Pagado: {{ number_format($venta->monto_pagado, 2) }}
                        @endif
                        @if($venta->monto_pendiente > 0)
                            - Pendiente: {{ number_format($venta->monto_pendiente, 2) }}
                        @endif
                    </p>
                </div>
            @endif

            {{-- Separador entre ventas --}}
            @if(!$loop->last)
                <div style="margin: 15px 0; border-top: 2px dashed #ccc; width: 100%; box-sizing: border-box;"></div>
            @endif
        @endforeach
    </div>
@endif
