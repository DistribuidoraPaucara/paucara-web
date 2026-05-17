@extends('impresion.layouts.base-a4')

@section('titulo', 'Listado de Movimientos de Inventario')

@section('contenido')
{{-- Información del documento --}}
<div class="documento-info">
    <div class="documento-info-grid">
        <div class="documento-info-seccion">
            <h2 style="color: #3498db;">REPORTE DE MOVIMIENTOS</h2>
            <p><strong>Fecha de generación:</strong> {{ now()->format("d/m/Y H:i") }}</p>
            @if($filtros && isset($filtros["tipo"]) && $filtros["tipo"])
                <p><strong>Tipo:</strong> {{ ucfirst($filtros["tipo"]) }}</p>
            @endif
        </div>
        <div class="documento-info-seccion" style="text-align: right;">
            <p><strong>Total de registros:</strong> {{ count($movimientos) }}</p>
            <p><strong>Cantidad movida:</strong> {{ number_format(abs($movimientos->sum(fn($m) => $m->cantidad ?? 0) ?? 0), 0) }}</p>
        </div>
    </div>
</div>

{{-- Tabla de movimientos --}}
<table class="tabla-productos">
    <thead>
        <tr>
            <th style="width: 10%;">Fecha</th>
            <th style="width: 12%;">Producto</th>
            <th style="width: 8%;">Cant. Anterior</th>
            <th style="width: 8%;">Cantidad</th>
            <th style="width: 8%;">Cant. Posterior</th>
            <th style="width: 18%;">Referencia</th>
        </tr>
    </thead>
    <tbody>
        @forelse($movimientos as $item)
        <tr>
            <td>
                @php
                    $fecha = null;
                    if (is_array($item) && isset($item["created_at"])) {
                        $fecha = $item["created_at"];
                    } elseif (is_object($item) && isset($item->created_at)) {
                        $fecha = $item->created_at;
                    }
                    if ($fecha) {
                        if (is_string($fecha)) {
                            echo date("d/m/Y H:i", strtotime($fecha));
                        } else {
                            echo $fecha->format("d/m/Y H:i");
                        }
                    } else {
                        echo "-";
                    }
                @endphp
            </td>
            <td>
                @php
                    $producto = "-";
                    if (is_array($item)) {
                        if (isset($item["stockProducto"])) {
                            $sp = $item["stockProducto"];
                            $prod = is_array($sp) ? ($sp["producto"] ?? []) : (is_object($sp) ? ($sp->producto ?? null) : []);
                            if (is_array($prod)) {
                                $producto = $prod["nombre"] ?? "-";
                            } elseif (is_object($prod)) {
                                $producto = $prod->nombre ?? "-";
                            }
                        }
                    } elseif (is_object($item)) {
                        if (isset($item->stockProducto)) {
                            $producto = $item->stockProducto->producto->nombre ?? "-";
                        }
                    }
                @endphp
                <strong>{{ $producto }}</strong>
                <div>
                    @php
                    $almacen = "-";
                    if (is_array($item)) {
                        if (isset($item["stockProducto"])) {
                            $sp = $item["stockProducto"];
                            $alm = is_array($sp) ? ($sp["almacen"] ?? []) : (is_object($sp) ? ($sp->almacen ?? null) : []);
                            if (is_array($alm)) {
                                $almacen = $alm["nombre"] ?? "-";
                            } elseif (is_object($alm)) {
                                $almacen = $alm->nombre ?? "-";
                            }
                        }
                    } elseif (is_object($item)) {
                        if (isset($item->stockProducto)) {
                            $almacen = $item->stockProducto->almacen->nombre ?? "-";
                        }
                    }
                @endphp
                {{ $almacen }}
                </div>
                <div>
                     @php
                        $tipo = "-";
                        if (is_array($item)) {
                            $tipo = $item["tipo"] ?? "-";
                        } elseif (is_object($item)) {
                            $tipo = $item->tipo ?? "-";
                        }
                    @endphp
                    <span style="padding: 2px 4px; background: #e3f2fd; border-radius: 3px; font-size: 0.85em;">
                        {{ $tipo }}
                    </span>
                </div>
            </td>
            <td style="text-align: right;">
                @php
                    $cantidadAnterior = "-";
                    if (is_array($item) && isset($item["cantidad_anterior"])) {
                        $cantidadAnterior = number_format($item["cantidad_anterior"], 0);
                    } elseif (is_object($item) && isset($item->cantidad_anterior)) {
                        $cantidadAnterior = number_format($item->cantidad_anterior, 0);
                    }
                @endphp
                {{ $cantidadAnterior }}
            </td>
            <td style="text-align: right;">
                @php
                    $cantidad = 0;
                    if (is_array($item) && isset($item["cantidad"])) {
                        $cantidad = $item["cantidad"];
                    } elseif (is_object($item) && isset($item->cantidad)) {
                        $cantidad = $item->cantidad;
                    }
                @endphp
                <strong>{{ number_format($cantidad, 0) }}</strong>
            </td>
            <td style="text-align: right;">
                @php
                    $cantidadPosterior = "-";
                    if (is_array($item) && isset($item["cantidad_posterior"])) {
                        $cantidadPosterior = number_format($item["cantidad_posterior"], 0);
                    } elseif (is_object($item) && isset($item->cantidad_posterior)) {
                        $cantidadPosterior = number_format($item->cantidad_posterior, 0);
                    }
                @endphp
                {{ $cantidadPosterior }}
            </td>
            <td>
                @php
                    $documento = "-";
                    if (is_array($item)) {
                        $documento = $item["numero_documento"] ?? "-";
                    } elseif (is_object($item)) {
                        $documento = $item->numero_documento ?? "-";
                    }
                @endphp
                <small>{{ $documento }}</small>
                <div>
                    @php
                        $usuario = "-";
                        if (is_array($item)) {
                            if (isset($item["user"])) {
                                $u = $item["user"];
                                $usuario = is_array($u) ? ($u["name"] ?? "-") : (is_object($u) ? ($u->name ?? "-") : "-");
                            }
                        } elseif (is_object($item)) {
                            if (isset($item->user)) {
                                $usuario = $item->user->name ?? "-";
                            }
                        }
                    @endphp
                    {{ $usuario }}
                </div>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="10" style="text-align: center; padding: 20px;">
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
        <tr class="total-final">
            <td><strong>CANTIDAD TOTAL MOVIDA:</strong></td>
            <td class="text-right">
                <strong>{{ number_format(abs($movimientos->sum(fn($m) => $m->cantidad ?? 0) ?? 0), 2) }}</strong>
            </td>
        </tr>
    </table>
</div>

{{-- Nota de documentación --}}
<div class="observaciones" style="margin-top: 10px; border-left-color: #3498db; background: #ecf0f1;">
    <strong>Nota Informativa:</strong>
    <p style="margin-top: 5px;">
        Este es un reporte de referencia de movimientos de inventario.
        Generado el {{ now()->format("d/m/Y \a \l\a\s H:i") }}.
    </p>
</div>
@endsection