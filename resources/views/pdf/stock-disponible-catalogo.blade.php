<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Stock</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 14px;
            color: #333;
            background: #fff;
        }

        .container {
            padding: 8px;
            max-width: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 2px solid #003366;
            padding-bottom: 6px;
        }

        .header h1 {
            font-size: 18px;
            margin-bottom: 2px;
            color: #003366;
            font-weight: bold;
        }

        .header p {
            font-size: 12px;
            color: #666;
            margin: 1px 0;
        }

        .filter-info {
            font-size: 11px;
            color: #666;
            margin: 3px 0;
            padding: 2px;
            background: #f5f5f5;
            border-left: 3px solid #003366;
        }

        /* GRILLA DE PRODUCTOS - 3 columnas */
        .productos-grid {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        .producto-card {
            flex: 0 0 33.333%;
            padding: 4px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            border: 1px solid #ddd;
            border-radius: 3px;
            overflow: hidden;
            background: #fff;
            margin: 0;
        }

        .producto-imagen {
            width: 100%;
            height: 80px;
            object-fit: cover;
            background: #f0f0f0;
            border-bottom: 1px solid #eee;
        }

        .producto-info {
            padding: 3px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .producto-nombre {
            font-size: 11px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 2px;
            line-height: 1;
            min-height: auto;
        }

        .producto-stock {
            font-size: 10px;
            padding: 1px 2px;
            border-radius: 2px;
            margin-bottom: 2px;
            font-weight: bold;
            text-align: center;
        }

        .stock-disponible {
            background: #d4edda;
            color: #155724;
        }

        .stock-agotado {
            background: #f8d7da;
            color: #721c24;
        }

        .precio-section {
            font-size: 11px;
            margin-bottom: 2px;
            padding-bottom: 2px;
            border-bottom: 1px solid #eee;
        }

        .precio-label {
            font-size: 9px;
            color: #666;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 1px;
        }

        .precio-valor {
            font-size: 12px;
            font-weight: bold;
            margin: 0;
        }

        .precio-venta .precio-valor {
            color: #003366;
        }

        .precio-descuento .precio-valor {
            color: #27ae60;
        }

        .precio-especial .precio-valor {
            color: #e74c3c;
        }

        .rango-label {
            font-size: 8px;
            color: #999;
            margin-top: 1px;
            margin-bottom: 1px;
        }

        .rango-item {
            font-size: 9px;
            color: #666;
            line-height: 1;
            padding: 0;
        }

        .sin-datos {
            color: #999;
            font-style: italic;
            font-size: 10px;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            color: #999;
            margin-top: 8px;
            padding-top: 4px;
            border-top: 1px solid #ddd;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }

    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>CATÁLOGO DE PRODUCTOS</h1>
            <p>{{ $empresa }}</p>
            <div class="filter-info">
                Generado: {{ $fecha_generacion }} | Total productos: {{ $total_productos }}
                @if($mostrar_stock ?? false)
                    | Mostrando: Stock disponible
                @endif
            </div>
        </div>

        <!-- Grilla de Productos -->
        @if(count($filas) > 0)
        <div class="productos-grid">
            @foreach($filas as $producto)
            <div class="producto-card">
                <!-- Imagen -->
                @php
                    $producto_obj = $producto['producto'] ?? null;
                    $imagen = $producto['imagenes']?->first();
                @endphp
                @if($imagen && $imagen->url)
                    <img src="{{ $imagen->url }}" alt="{{ $producto['nombre'] }}" class="producto-imagen">
                @else
                    <div class="producto-imagen" style="display: flex; align-items: center; justify-content: center; background: #e0e0e0;">
                        <span style="color: #999; font-size: 11px;">Sin imagen</span>
                    </div>
                @endif

                <!-- Info del Producto -->
                <div class="producto-info">
                    <!-- Nombre -->
                    <div class="producto-nombre">{{ $producto['nombre'] }}</div>

                    <!-- Stock Badge -->
                    @if($mostrar_stock ?? false)
                    @php
                        $stock = $producto['stock_disponible'] ?? 0;
                    @endphp
                    <div class="producto-stock stock-disponible">
                        ✓ Stock: {{ number_format($stock, 2) }}
                    </div>
                    @endif

                    <!-- Precios -->
                    @if($producto['precio_venta'])
                    <div class="precio-section precio-venta">
                        <div class="precio-label">Precio Venta</div>
                        <div class="precio-valor">Bs {{ number_format($producto['precio_venta'], 2) }}</div>
                        @php $rangosV = $producto['rangos_venta'] ?? []; @endphp
                        @if(count($rangosV) > 0)
                            <div class="rango-label">Rangos:</div>
                            @foreach($rangosV as $r)
                                <div class="rango-item">{{ $r['rango_texto'] }}</div>
                            @endforeach
                        @endif
                    </div>
                    @endif

                    @if($producto['precio_descuento'])
                    <div class="precio-section precio-descuento">
                        <div class="precio-label">P. Descuento</div>
                        <div class="precio-valor">Bs {{ number_format($producto['precio_descuento'], 2) }}</div>
                        @php $rangosD = $producto['rangos_descuento'] ?? []; @endphp
                        @if(count($rangosD) > 0)
                            <div class="rango-label">Rangos:</div>
                            @foreach($rangosD as $r)
                                <div class="rango-item">{{ $r['rango_texto'] }}</div>
                            @endforeach
                        @endif
                    </div>
                    @endif

                    @if($producto['precio_especial'])
                    <div class="precio-section precio-especial">
                        <div class="precio-label">P. Especial</div>
                        <div class="precio-valor">Bs {{ number_format($producto['precio_especial'], 2) }}</div>
                        @php $rangosE = $producto['rangos_especial'] ?? []; @endphp
                        @if(count($rangosE) > 0)
                            <div class="rango-label">Rangos:</div>
                            @foreach($rangosE as $r)
                                <div class="rango-item">{{ $r['rango_texto'] }}</div>
                            @endforeach
                        @endif
                    </div>
                    @endif

                    @if(!$producto['precio_venta'] && !$producto['precio_descuento'] && !$producto['precio_especial'])
                    <div class="sin-datos">Sin precios configurados</div>
                    @endif
                </div>
            </div>
            @endforeach
        </div>

        @else
        <div class="empty-state">
            <p>⚠️ No hay productos para mostrar con los filtros seleccionados.</p>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Catálogo de productos generado automáticamente por el sistema.</p>
        </div>
    </div>
</body>
</html>
