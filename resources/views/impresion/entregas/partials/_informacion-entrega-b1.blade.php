{{-- Información general de la entrega optimizada para B1 --}}
<div class="documento-info" style="width: 100%; box-sizing: border-box;">
    <h2 style="color: #4F81BD; margin: 0 0 15px 0; width: 100%; box-sizing: border-box; font-size: 24px;">
        ENTREGA #{{ $entrega->numero_entrega }}
    </h2>

    {{-- Primera fila: Información general --}}
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin-bottom: 15px; width: 100%; box-sizing: border-box; overflow: visible;">

        <!-- Fecha y Estado -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Fecha Asignación:</strong></p>
            <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px;">{{ $entrega->fecha_asignacion->format('d/m/Y H:i') }}</p>
            @if($entrega->fecha_entrega)
                <p style="margin: 8px 0 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Fecha Entregado:</strong></p>
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px;">{{ $entrega->fecha_entrega->format('d/m/Y H:i') }}</p>
            @endif
        </div>

        <!-- Estado -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Estado:</strong></p>
            <span style="display: inline-block; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; box-sizing: border-box; margin-top: 4px;
                @if($entrega->estado === 'PENDIENTE' || $entrega->estado === 'PROGRAMADO') background: #fff3cd; color: #856404;
                @elseif($entrega->estado === 'EN_CAMINO' || $entrega->estado === 'EN_TRANSITO') background: #cfe2ff; color: #084298;
                @elseif($entrega->estado === 'ENTREGADO') background: #d4edda; color: #155724;
                @elseif($entrega->estado === 'NOVEDAD' || $entrega->estado === 'RECHAZADO') background: #f8d7da; color: #721c24;
                @elseif($entrega->estado === 'CANCELADA') background: #e2e3e5; color: #383d41;
                @endif">
                {{ $entrega->estado }}
            </span>
        </div>

        <!-- Peso Total -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Peso Total Carga:</strong></p>
            @if($entrega->peso_kg)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px;">{{ number_format($entrega->peso_kg, 2) }} kg</p>
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px; color: #999;">Sin especificar</p>
            @endif
        </div>

        <!-- Zona/Localidad -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Zona:</strong></p>
            @if($entrega->localidad)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px;">{{ $entrega->localidad->nombre }}</p>
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px; color: #999;">Sin zona</p>
            @endif
        </div>
    </div>

    {{-- Segunda fila: Información del chofer, entregador y vehículo --}}
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px; width: 100%; box-sizing: border-box; overflow: visible;">

        <!-- Chofer -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Chofer:</strong></p>
            @if($entrega->chofer)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; font-weight: bold;">{{ $entrega->chofer->name ?? $entrega->chofer->nombre ?? 'S/N' }}</p>
                @if($entrega->chofer->email)
                    <p style="margin: 4px 0; box-sizing: border-box; font-size: 11px; color: #666;">{{ $entrega->chofer->email }}</p>
                @endif
                @if($entrega->chofer->phone ?? false)
                    <p style="margin: 4px 0; box-sizing: border-box; font-size: 11px; color: #666;">{{ $entrega->chofer->phone }}</p>
                @endif
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; color: #999;">Sin asignar</p>
            @endif
        </div>

        {{-- ✅ NUEVO: Entregador --}}
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Entregador:</strong></p>
            @if($entrega->entregador)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; font-weight: bold;">{{ $entrega->entregador->name ?? $entrega->entregador->nombre ?? 'S/N' }}</p>
                @if($entrega->entregador->email)
                    <p style="margin: 4px 0; box-sizing: border-box; font-size: 11px; color: #666;">{{ $entrega->entregador->email }}</p>
                @endif
                @if($entrega->entregador->phone ?? false)
                    <p style="margin: 4px 0; box-sizing: border-box; font-size: 11px; color: #666;">{{ $entrega->entregador->phone }}</p>
                @endif
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; color: #999;">Sin asignar</p>
            @endif
        </div>

        <!-- Vehículo Placa -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Vehículo:</strong></p>
            @if($entrega->vehiculo)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px; font-weight: bold;">{{ $entrega->vehiculo->placa }}</p>
                @if($entrega->vehiculo->marca)
                    <p style="margin: 4px 0; box-sizing: border-box; font-size: 11px; color: #666;">{{ $entrega->vehiculo->marca }} {{ $entrega->vehiculo->modelo ?? '' }}</p>
                @endif
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; color: #999;">Sin vehículo</p>
            @endif
        </div>

        <!-- Capacidad del Vehículo -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Capacidad:</strong></p>
            @if($entrega->vehiculo && $entrega->vehiculo->capacidad_kg)
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px;">{{ number_format($entrega->vehiculo->capacidad_kg, 1) }} kg</p>
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; color: #999;">N/A</p>
            @endif
        </div>

        <!-- Uso de Capacidad -->
        <div style="font-size: 12px; box-sizing: border-box; width: 100%;">
            <p style="margin: 4px 0; box-sizing: border-box;"><strong style="font-size: 13px;">Uso:</strong></p>
            @if($entrega->vehiculo && $entrega->vehiculo->capacidad_kg)
                @php
                    $pesoTotal = $entrega->peso_kg ?? 0;
                    $capacidad = $entrega->vehiculo->capacidad_kg;
                    $porcentajeUso = ($pesoTotal / $capacidad) * 100;
                    $colorEstado = $porcentajeUso > 100 ? '#ff6b6b' : ($porcentajeUso > 80 ? '#ffd43b' : '#51cf66');
                @endphp
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 14px; color: {{ $colorEstado }}; font-weight: bold;">
                    {{ number_format($porcentajeUso, 1) }}%
                    @if($porcentajeUso > 100)
                        ⚠ EXCESO
                    @elseif($porcentajeUso > 80)
                        ⚡ ALTO
                    @else
                        ✓ OK
                    @endif
                </p>
            @else
                <p style="margin: 4px 0; box-sizing: border-box; font-size: 13px; color: #999;">N/A</p>
            @endif
        </div>
    </div>

    {{-- Observaciones (si las hay) --}}
    @if($entrega->observaciones)
        <div style="margin-top: 15px; padding: 12px; background: #f0f0f0; border-left: 4px solid #4F81BD; font-size: 12px; width: 100%; box-sizing: border-box; border-radius: 2px;">
            <strong style="font-size: 13px; display: block; margin-bottom: 6px; color: #4F81BD;">Observaciones:</strong>
            <p style="margin: 0; line-height: 1.6;">{{ $entrega->observaciones }}</p>
        </div>
    @endif
</div>
