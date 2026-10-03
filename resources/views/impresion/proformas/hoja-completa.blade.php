@extends('impresion.layouts.base-a4')

@section('titulo', 'Proforma #' . $documento->numero)

@section('contenido')

{{-- ==================== INFORMACIÓN DEL DOCUMENTO ==================== --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2>PROFORMA #{{ $documento->numero }}</h2>
            <p><strong>Fecha de Creación:</strong> {{ $documento->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Fecha y Hora de Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Moneda:</strong> {{ $documento->moneda->codigo ?? 'BOB' }}</p>
            @if($documento->estadoDocumento)
                <p><strong>Estado:</strong> {{ $documento->estadoDocumento->nombre }}</p>
            @endif
            @if($documento->usuarioCreador)
                <p><strong>Preventista:</strong> {{ $documento->usuarioCreador->name }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            {{-- Cliente --}}
            @if($documento->cliente)
                <p><strong>CLIENTE:</strong></p>
                <p>{{ $documento->cliente->nombre }}</p>
                @if($documento->cliente->nit_ci)
                    <p>NIT/CI: {{ $documento->cliente->nit_ci }}</p>
                @endif
                {{-- ✅ ACTUALIZADO: Mostrar localidad de la dirección solicitada --}}
                @if($documento->direccionSolicitada?->localidad)
                    <p>📍 {{ $documento->direccionSolicitada->localidad->nombre }}</p>
                @elseif($documento->cliente->localidad)
                    <p>📍 {{ $documento->cliente->localidad->nombre }}</p>
                @endif
                {{-- ✅ NUEVO: Mostrar observaciones de la dirección solicitada --}}
                @if($documento->direccionSolicitada?->observaciones)
                    <p style="margin-top: 5px; font-size: 12px; font-style: italic; color: #666;">
                        <strong>Obs:</strong> {{ strtoupper($documento->direccionSolicitada->observaciones) }}
                    </p>
                @endif
            @endif
            <p style="margin-top: 10px;"><strong>Cód. Cliente:</strong> #{{ $documento->cliente->id ?? 'N/A' }}</p>
        </div>
    </div>
</div>

{{-- ==================== INFORMACIÓN DE VENCIMIENTO Y ENTREGA ==================== --}}
@if($documento->fecha_vencimiento || $documento->fecha_entrega_solicitada)
<div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        @if($documento->fecha_vencimiento)
        <div>
            <p><strong>📅 Fecha de Vencimiento:</strong></p>
            @php
                $estaVencida = $documento->fecha_vencimiento->isPast();
            @endphp
            <p style="font-size: 16px; font-weight: bold; color: {{ $estaVencida ? '#d9534f' : '#333' }}">
                {{ $documento->fecha_vencimiento->format('d/m/Y') }}
            </p>
            @if($estaVencida)
                <p style="color: #d9534f; font-weight: bold; margin-top: 5px;">⚠️ VENCIDA</p>
            @endif
        </div>
        @endif
        @if($documento->fecha_entrega_solicitada)
        <div>
            <p><strong>🚚 Fecha de Entrega Solicitada:</strong></p>
            <p style="font-size: 16px; font-weight: bold;">{{ $documento->fecha_entrega_solicitada->format('d/m/Y') }}</p>
            @if($documento->hora_entrega_solicitada)
                <p style="font-size: 14px;">⏰ {{ $documento->hora_entrega_solicitada }}</p>
            @endif
        </div>
        @endif
    </div>
</div>
@endif

{{-- ==================== TABLA DE PRODUCTOS ==================== --}}
@include('impresion.ventas.partials._items', ['formato' => 'a4'])

{{-- ==================== TOTALES ==================== --}}
<div style="margin: 30px 0; text-align: right;">
    <div style="width: 400px; margin-left: auto;">
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                @php
                    $subtotal = $documento->subtotal ?? 0;
                    $descuento = $documento->descuento ?? 0;
                    $impuesto = $documento->impuesto ?? 0;
                    $total = $documento->total ?? 0;
                @endphp
                <tr style="border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; text-align: right;">Subtotal:</td>
                    <td style="padding: 8px; text-align: right; width: 150px;"><strong>{{ number_format($subtotal, 2) }}</strong></td>
                </tr>
                @if($descuento > 0)
                <tr>
                    <td style="padding: 8px; text-align: right;">Descuento:</td>
                    <td style="padding: 8px; text-align: right;">-{{ number_format($descuento, 2) }}</td>
                </tr>
                @endif
                @if($impuesto > 0)
                <tr>
                    <td style="padding: 8px; text-align: right;">Impuesto (IVA):</td>
                    <td style="padding: 8px; text-align: right;">{{ number_format($impuesto, 2) }}</td>
                </tr>
                @endif
                <tr style="background-color: #f5f5f5; border-top: 2px solid #333; border-bottom: 2px solid #333;">
                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">TOTAL:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">{{ number_format($total, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

{{-- ==================== INFORMACIÓN DE RESERVA ==================== --}}
@if($documento->tieneReservas())
@php
    $primeraReserva = $documento->reservas->first();
    $fechaVencimientoReserva = $primeraReserva?->fecha_vencimiento?->format('d/m/Y') ?? 'N/A';
@endphp
<div style="margin: 20px 0; padding: 15px; background-color: #fff9e6; border-left: 4px solid #ff9800; border-radius: 4px;">
    <p><strong>📦 Información de Reserva de Stock:</strong></p>
    <p style="font-size: 12px; color: #666; margin-top: 8px;">
        Los productos de esta proforma se encuentran reservados en el almacén.
        La reserva es válida hasta: <strong>{{ $fechaVencimientoReserva }}</strong>
    </p>
</div>
@endif

{{-- ==================== OBSERVACIONES ==================== --}}
@if($documento->observaciones)
<div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;">
    <p><strong>📝 Observaciones:</strong></p>
    <p style="font-size: 12px; white-space: pre-wrap; margin-top: 8px;">{{ $documento->observaciones }}</p>
</div>
@endif

{{-- ==================== TÉRMINOS Y CONDICIONES ==================== --}}
@include('impresion.ventas.partials._terminos-condiciones')

@endsection
