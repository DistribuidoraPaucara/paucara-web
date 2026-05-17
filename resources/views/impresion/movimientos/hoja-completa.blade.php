@extends('impresion.layouts.base-a4')

@section('titulo', 'Listado de Movimientos')

@section('contenido')
{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">MOVIMIENTOS DE INVENTARIO</h2>
            <p><strong>Fecha de generación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            @if($filtros && isset($filtros['tipo']) && $filtros['tipo'])
                <p><strong>Tipo:</strong> {{ ucfirst(str_replace('_', ' ', $filtros['tipo'])) }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Total de registros:</strong> {{ count($movimientos) }}</p>
        </div>
    </div>
</div>

{{-- Tabla de movimientos --}}
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 3%;">#</th>
            <th style="width: 10%;">Fecha</th>
            <th style="width: 12%;">Tipo</th>
            <th style="width: 20%;">Producto</th>
            <th style="width: 12%;">Almacén</th>
            <th style="width: 9%;" class="text-right">Cantidad</th>
            <th style="width: 18%;">Motivo</th>
            <th style="width: 16%;">Usuario</th>
        </tr>
    </thead>
    <tbody>
        @forelse($movimientos as $item)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>
                @php
                    $fecha = null;
                    if (is_array($item) && isset($item['fecha'])) {
                        $fecha = $item['fecha'];
                    } elseif (is_object($item) && isset($item->fecha)) {
                        $fecha = $item->fecha;
                    }
                    if ($fecha) {
                        if (is_string($fecha)) {
                            echo date('d/m/Y', strtotime($fecha));
                        } else {
                            echo $fecha->format('d/m/Y');
                        }
                    } else {
                        echo '-';
                    }
                @endphp
            </td>
            <td>
                @php
                    $tipo = '-';
                    if (is_array($item) && isset($item['tipo'])) {
                        $tipo = ucfirst(str_replace('_', ' ', strtolower($item['tipo'])));
                    } elseif (is_object($item) && isset($item->tipo)) {
                        $tipo = ucfirst(str_replace('_', ' ', strtolower($item->tipo)));
                    }
                @endphp
                <strong>{{ $tipo }}</strong>
            </td>
            <td>
                @php
                    $producto = '-';
                    $sku = '';

                    // Buscar en stock_producto.producto (array o objeto)
                    if (is_array($item) && isset($item['stock_producto'])) {
                        $sp = $item['stock_producto'];
                        if (is_array($sp) && isset($sp['producto'])) {
                            $prod = $sp['producto'];
                            $producto = is_array($prod) ? ($prod['nombre'] ?? '-') : (is_object($prod) ? ($prod->nombre ?? '-') : '-');
                            $sku = is_array($prod) ? ($prod['sku'] ?? '') : (is_object($prod) ? ($prod->sku ?? '') : '');
                        } elseif (is_object($sp) && isset($sp->producto)) {
                            $producto = $sp->producto->nombre ?? '-';
                            $sku = $sp->producto->sku ?? '';
                        }
                    } elseif (is_object($item) && isset($item->stock_producto)) {
                        $producto = $item->stock_producto->producto->nombre ?? '-';
                        $sku = $item->stock_producto->producto->sku ?? '';
                    }
                @endphp
                <strong>{{ $producto }}</strong>
                @if($sku)
                    <br><span style="font-size: 8px; color: #666;">SKU: {{ $sku }}</span>
                @endif
            </td>
            <td>
                @php
                    $almacen = '-';

                    // Buscar en stock_producto.almacen (array o objeto)
                    if (is_array($item) && isset($item['stock_producto'])) {
                        $sp = $item['stock_producto'];
                        if (is_array($sp) && isset($sp['almacen'])) {
                            $alm = $sp['almacen'];
                            $almacen = is_array($alm) ? ($alm['nombre'] ?? '-') : (is_object($alm) ? ($alm->nombre ?? '-') : '-');
                        } elseif (is_object($sp) && isset($sp->almacen)) {
                            $almacen = $sp->almacen->nombre ?? '-';
                        }
                    } elseif (is_object($item) && isset($item->stock_producto)) {
                        $almacen = $item->stock_producto->almacen->nombre ?? '-';
                    }
                @endphp
                {{ $almacen }}
            </td>
            <td class="text-right">
                @php
                    $cantidad = 0;
                    if (is_array($item) && isset($item['cantidad'])) {
                        $cantidad = (float)$item['cantidad'];
                    } elseif (is_object($item) && isset($item->cantidad)) {
                        $cantidad = (float)$item->cantidad;
                    }
                @endphp
                <strong style="color: {{ $cantidad >= 0 ? '#27ae60' : '#e74c3c' }};">
                    {{ $cantidad >= 0 ? '+' : '' }}{{ number_format($cantidad, 2) }}
                </strong>
            </td>
            <td>
                @php
                    $motivo = '-';
                    if (is_array($item) && isset($item['motivo'])) {
                        $motivo = $item['motivo'] ?: '-';
                    } elseif (is_object($item) && isset($item->motivo)) {
                        $motivo = $item->motivo ?: '-';
                    }
                @endphp
                {{ $motivo }}
            </td>
            <td>
                @php
                    $usuario = '-';
                    if (is_array($item)) {
                        if (isset($item['usuario'])) {
                            $usr = $item['usuario'];
                            $usuario = is_array($usr) ? ($usr['name'] ?? '-') : (is_object($usr) ? ($usr->name ?? '-') : '-');
                        } elseif (isset($item['user'])) {
                            $usr = $item['user'];
                            $usuario = is_array($usr) ? ($usr['name'] ?? '-') : (is_object($usr) ? ($usr->name ?? '-') : '-');
                        }
                    } elseif (is_object($item)) {
                        if (isset($item->usuario)) {
                            $usuario = $item->usuario->name ?? '-';
                        } elseif (isset($item->user)) {
                            $usuario = $item->user->name ?? '-';
                        }
                    }
                @endphp
                {{ $usuario }}
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="8" style="text-align: center; padding: 20px;">
                No hay movimientos para mostrar
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- Resumen --}}
<div class="totales">
    <table>
        <tr class="total-final">
            <td><strong>TOTAL DE MOVIMIENTOS:</strong></td>
            <td class="text-right">
                <strong>{{ count($movimientos) }}</strong>
            </td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #3498db; background: #ecf0f1;">
    <strong>Nota Informativa:</strong>
    <p style="margin-top: 5px; font-size: 8px;">
        Este es un listado de referencia de movimientos de inventario.
        Generado el {{ now()->format('d/m/Y \a \l\a\s H:i') }}.
    </p>
</div>
@endsection
