{{-- Información de Pago para Compras --}}
<div class="informacion-pago" style="font-size: 13px;">
    {{-- Tipo de pago --}}
    @if($compra->tipoPago)
        <p><strong>Tipo de Pago:</strong> {{ $compra->tipoPago->nombre }}</p>
    @endif

    {{-- Detalles del pago si es inmediato --}}
    @if($compra->tipoPago && $compra->tipoPago->codigo !== 'CREDITO')
        <p style="color: #27ae60;">
            <strong>✓ Pago inmediato</strong>
        </p>
    @endif

    {{-- Detalles de crédito si aplica --}}
    @if($compra->tipoPago && $compra->tipoPago->codigo === 'CREDITO')
        <div style="margin-top: 5px; padding: 5px; border-left: 3px solid #f39c12; background: #fef5e7;">
            <strong style="color: #f39c12;">📋 Compra a Crédito</strong>
            <p style="margin: 3px 0; font-size: 11px;">
                Total a Crédito: {{ $compra->moneda->simbolo ?? 'Bs' }} {{ number_format($compra->total, 2) }}
            </p>
        </div>
    @endif

    {{-- Número de referencia si existe --}}
    @if($compra->numero_factura)
        <p><strong>Numero Factura Proveedor: </strong> #{{ $compra->numero_factura }}</p>
    @endif

    {{-- Estado del documento --}}
    @if($compra->estadoDocumento)
        <p>
            <strong>Estado:</strong>
            @php
                $estado_color = match($compra->estadoDocumento->codigo ?? '') {
                    'APROBADO' => 'green',
                    'FACTURADO' => 'blue',
                    'CANCELADO' => 'green',
                    'BORRADOR' => 'orange',
                    default => 'gray'
                };
                $estado_label = $compra->estadoDocumento->nombre;
            @endphp
            <span style="color: {{ $estado_color }};">{{ $estado_label }}</span>
        </p>
    @endif
</div>
