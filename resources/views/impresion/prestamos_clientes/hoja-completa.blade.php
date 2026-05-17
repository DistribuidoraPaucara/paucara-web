@extends('impresion.layouts.base-a4')

@section('content')
    <div class="document">
        <h1 class="text-center text-xl font-bold mb-2">PRÉSTAMO DE CANASTILLAS / EMBASES</h1>

        <p class="text-center text-sm mb-4">
            Comprobante de préstamo emitido por {{ $empresa->razon_social ?? $empresa->nombre ?? 'La Empresa' }}
        </p>

        <table class="w-full text-sm mb-4">
            <tr>
                <td><strong>Fecha emisión:</strong> {{ optional($documento->created_at)->format('d/m/Y H:i') }}</td>
                <td><strong>ID préstamo:</strong> #{{ $documento->id }}</td>
            </tr>
            <tr>
                <td>
                    <strong>Cliente:</strong>
                    {{ $documento->cliente->razon_social ?? $documento->cliente->nombre ?? 'Sin nombre' }}
                </td>
                <td>
                    <strong>Documento:</strong>
                    {{ $documento->cliente->numero_documento ?? 'N/D' }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Dirección:</strong>
                    {{ $documento->cliente->direccion ?? 'Sin dirección' }}
                </td>
                <td>
                    <strong>Teléfono:</strong>
                    {{ $documento->cliente->telefono ?? 'N/D' }}
                </td>
            </tr>
            @if($documento->chofer)
                <tr>
                    <td colspan="2">
                        <strong>Chofer:</strong>
                        {{ $documento->chofer->name ?? $documento->chofer->nombre ?? 'N/D' }}
                    </td>
                </tr>
            @endif
        </table>

        <h2 class="text-base font-semibold mb-2">Detalle del préstamo</h2>

        <table class="w-full text-sm mb-4" border="1" cellspacing="0" cellpadding="4">
            <thead>
                <tr>
                    <th class="text-left">Prestable</th>
                    <th class="text-right">Cantidad prestada</th>
                    <th class="text-right">Cantidad devuelta</th>
                    <th class="text-right">Cantidad pendiente</th>
                </tr>
            </thead>
            <tbody>
                @if($documento->detalles && count($documento->detalles) > 0)
                    @foreach($documento->detalles as $detalle)
                        @php
                            $cantidadPrestada = $detalle->cantidad_prestada ?? 0;
                            $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta') ?? 0;
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
                                {{ number_format($cantidadPendiente, 0) }}
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td>
                            {{ $documento->prestable->nombre ?? 'Prestable' }}
                        </td>
                        <td class="text-right">
                            {{ number_format($documento->cantidad_prestada ?? $documento->cantidad ?? 0, 0) }}
                        </td>
                        <td class="text-right">
                            {{ number_format($documento->cantidad_devuelta ?? ($documento->devoluciones->sum('cantidad_devuelta') ?? 0), 0) }}
                        </td>
                        <td class="text-right">
                            {{ number_format(($documento->cantidad_prestada ?? $documento->cantidad ?? 0) - ($documento->cantidad_devuelta ?? ($documento->devoluciones->sum('cantidad_devuelta') ?? 0)), 0) }}
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <h2 class="text-base font-semibold mb-2">Información adicional</h2>

        <table class="w-full text-sm mb-4">
            <tr>
                <td>
                    <strong>Fecha límite de devolución:</strong>
                    {{ optional($documento->fecha_limite_devolucion ?? $documento->fecha_devolucion_estimada ?? null)->format('d/m/Y') ?? 'No registrada' }}
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
                <p>{{ $documento->cliente->razon_social ?? $documento->cliente->nombre ?? 'Cliente' }}</p>
            </div>
        </div>

        <p class="text-xs mt-6">
            El cliente se compromete a devolver las canastillas/embases en buen estado dentro del plazo acordado.
        </p>
    </div>
@endsection
