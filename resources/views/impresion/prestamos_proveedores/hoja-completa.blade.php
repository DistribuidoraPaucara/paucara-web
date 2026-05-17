@extends('impresion.layouts.base-a4')

@section('content')
    <div class="document">
        <h1 class="text-center text-xl font-bold mb-2">PRÉSTAMO / COMPRA DE CANASTILLAS / EMBASES</h1>

        <p class="text-center text-sm mb-4">
            Comprobante de préstamo/compra emitido por {{ $empresa->razon_social ?? $empresa->nombre ?? 'La Empresa' }}
        </p>

        <table class="w-full text-sm mb-4">
            <tr>
                <td><strong>Fecha emisión:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}</td>
                <td><strong>ID préstamo:</strong> #{{ $documento->id }}</td>
            </tr>
            <tr>
                <td>
                    <strong>Proveedor:</strong>
                    {{ $documento->proveedor->razon_social ?? $documento->proveedor->nombre ?? 'Sin nombre' }}
                </td>
                <td>
                    <strong>Documento:</strong>
                    {{ $documento->proveedor->numero_documento ?? 'N/D' }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Dirección:</strong>
                    {{ $documento->proveedor->direccion ?? 'Sin dirección' }}
                </td>
                <td>
                    <strong>Teléfono:</strong>
                    {{ $documento->proveedor->telefono ?? 'N/D' }}
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <strong>Tipo de operación:</strong>
                    {{ $documento->es_compra ? 'COMPRA' : 'PRÉSTAMO' }}
                </td>
            </tr>
            @if(!empty($documento->almacen_impresion))
                <tr>
                    <td colspan="2">
                        <strong>Almacén:</strong>
                        {{ $documento->almacen_impresion->nombre ?? 'N/D' }}
                    </td>
                </tr>
            @endif
            @if($documento->compra)
                <tr>
                    <td colspan="2">
                        <strong>Folio Compra:</strong>
                        #{{ $documento->compra->id ?? 'N/D' }}
                    </td>
                </tr>
            @endif
        </table>

        <h2 class="text-base font-semibold mb-2">Detalle del préstamo</h2>

        <table class="w-full text-sm mb-4" border="1" cellspacing="0" cellpadding="4">
            <thead>
                <tr>
                    <th class="text-left">Prestable</th>
                    <th class="text-right">Cantidad recibida</th>
                    <th class="text-right">Cantidad devuelta</th>
                    <th class="text-right">Cantidad dañada</th>
                    <th class="text-right">Cantidad pendiente</th>
                </tr>
            </thead>
            <tbody>
                @if($documento->detalles && count($documento->detalles) > 0)
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devolucionDetalles->sum('cantidad_devuelta') ?? 0;
                            $cantidadDaniada = ($detalle->devolucionDetalles->sum('cantidad_dañada_parcial') ?? 0) + ($detalle->devolucionDetalles->sum('cantidad_dañada_total') ?? 0);
                            $cantidadPendiente = $cantidadPrestada - $cantidadDevuelta;
                        @endphp
                        <tr>
                            <td>
                                {{ $detalle->prestable->nombre ?? 'Prestable' }}
                            </td>
                            <td class="text-right">
                                {{ number_format($cantidadPrestada, 0) }}
                            </td>
                            <td class="text-right">
                                {{ number_format($cantidadDevuelta, 0) }}
                            </td>
                            <td class="text-right">
                                {{ number_format($cantidadDaniada, 0) }}
                            </td>
                            <td class="text-right">
                                {{ number_format($cantidadPendiente, 0) }}
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5" class="text-center">
                            Sin detalles registrados
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <p class="text-xs mb-4">
            <strong>Nota:</strong> La cantidad dañada es solo informativa y proviene de <code>devolucion_proveedor_detalle</code>.
        </p>

        <h2 class="text-base font-semibold mb-2">Información adicional</h2>

        <table class="w-full text-sm mb-4">
            <tr>
                <td>
                    <strong>Garantía:</strong>
                    Bs {{ number_format($documento->monto_garantia ?? 0, 2) }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Daño Total Cobrado:</strong>
                    Bs {{ number_format($documento->monto_cobrado_danio_total_impresion ?? 0, 2) }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Fecha límite de devolución:</strong>
                    {{ optional($documento->fecha_esperada_devolucion)->format('d/m/Y') ?? 'No registrada' }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Estado:</strong>
                    @if($documento->estado === 'COMPLETAMENTE_DEVUELTO')
                        <span style="color: green; font-weight: bold;">COMPLETAMENTE DEVUELTO</span>
                    @elseif($documento->estado === 'PARCIALMENTE_DEVUELTO')
                        <span style="color: orange; font-weight: bold;">PARCIALMENTE DEVUELTO</span>
                    @else
                        <span style="color: red; font-weight: bold;">ACTIVO</span>
                    @endif
                </td>
            </tr>
            @if(!empty($documento->observaciones))
                <tr>
                    <td>
                        <strong>Observaciones:</strong><br>
                        {{ $documento->observaciones }}
                    </td>
                </tr>
            @endif
        </table>

        <div class="mt-8 flex justify-between text-sm">
            <div class="text-center" style="width: 45%;">
                <p>______________________________</p>
                <p><strong>ENTREGA</strong></p>
                <p>{{ $empresa->razon_social ?? $empresa->nombre ?? 'La Empresa' }}</p>
            </div>
            <div class="text-center" style="width: 45%;">
                <p>______________________________</p>
                <p><strong>RECEPCIÓN</strong></p>
                <p>{{ $documento->proveedor->razon_social ?? $documento->proveedor->nombre ?? 'Proveedor' }}</p>
            </div>
        </div>

        <p class="text-xs mt-6">
            El proveedor se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado.
        </p>
    </div>
@endsection
