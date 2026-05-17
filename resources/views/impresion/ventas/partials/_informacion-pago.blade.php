{{-- Información de Pago Detallada --}}
<div class="informacion-pago">
    {{-- Política de pago --}}
    <p><strong>Política de Pago:</strong> {{ $documento->politica_pago ?? 'CONTRA_ENTREGA' }}</p>

    {{-- Método de pago si existe --}}
    @if($documento->tipoPago)
        <p><strong>Método:</strong> {{ $documento->tipoPago->nombre }}</p>
    @endif

    {{-- Estado de pago --}}
    @if($documento->estado_pago)
        <p>
            <strong>Estado Pago:</strong>
            @php
                $estado_color = match($documento->estado_pago) {
                    'PAGADA' => 'green',
                    'PARCIAL' => 'orange',
                    'PENDIENTE' => 'red',
                    default => 'gray'
                };
                $estado_label = match($documento->estado_pago) {
                    'PAGADA' => '✓ PAGADA',
                    'PARCIAL' => '⚠ PARCIAL',
                    'PENDIENTE' => '⏳ PENDIENTE',
                    default => $documento->estado_pago
                };
            @endphp
            <span style="color: {{ $estado_color }};">{{ $estado_label }}</span>
        </p>
    @endif

    {{-- Información de crédito si aplica --}}
    @if($documento->politica_pago === 'CREDITO')
        <div style="margin-top: 5px; padding: 5px; border-left: 3px solid #f39c12; background: #fef5e7;">
            <strong style="color: #f39c12;">📋 Información de Crédito</strong>
            @if($documento->monto_pendiente > 0)
                <p style="margin: 3px 0;">
                    Monto a Crédito: {{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->monto_pendiente, 2) }}
                </p>
            @endif
            @if($documento->monto_pagado > 0)
                <p style="margin: 3px 0;">
                    Pagado a la Fecha: {{ $documento->moneda->simbolo ?? 'Bs' }} {{ number_format($documento->monto_pagado, 2) }}
                </p>
            @endif
        </div>
    @endif

    {{-- Detalles de pago al contado --}}
    @if($documento->estado_pago === 'PAGADA' && $documento->politica_pago === 'CONTRA_ENTREGA')
        <p style="margin-top: 5px; color: green;">
            <strong>✓ Pagado al momento</strong>
        </p>
    @endif
</div>
