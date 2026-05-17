<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Precios - {{ $empresa }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        header {
            background-image: url('/storage/banner/banner.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-attachment: fixed;
            color: white;
            padding: 60px 20px;
            min-height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
        }

        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 0;
        }

        header h1,
        header p,
        .header-stats {
            position: relative;
            z-index: 1;
        }

        header h1 {
            text-shadow:
                0 2px 4px rgba(0, 0, 0, 0.5),
                0 4px 8px rgba(0, 0, 0, 0.7);
        }

        header p {
            text-shadow:
                0 2px 4px rgba(0, 0, 0, 0.5),
                0 4px 8px rgba(0, 0, 0, 0.7);
        }

        .stat-number,
        .stat-label {
            text-shadow:
                0 1px 3px rgba(0, 0, 0, 0.5),
                0 2px 4px rgba(0, 0, 0, 0.7);
        }

        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .header-stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 2em;
            font-weight: bold;
            display: block;
        }

        .stat-label {
            font-size: 0.9em;
            opacity: 0.8;
        }

        .filters {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            flex: 1;
            min-width: 250px;
        }

        .filter-group label {
            display: block;
            font-size: 0.9em;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }

        .filter-group input,
        .filter-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1em;
            font-family: inherit;
        }

        .filter-group input:focus,
        .filter-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .content {
            padding: 30px;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #333;
            font-size: 0.95em;
        }

        tbody tr {
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s;
        }

        tbody tr:hover {
            background-color: #f8f9fa;
        }

        td {
            padding: 15px;
            color: #555;
        }

        .sku {
            font-family: 'Courier New', monospace;
            background: #f0f1f3;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 500;
        }

        .price {
            font-weight: 600;
            color: #667eea;
            font-size: 1.1em;
        }

        .price-null {
            color: #ccc;
            font-style: italic;
        }

        .stock {
            text-align: center;
            padding: 8px 14px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.95em;
            display: inline-block;
            min-width: 120px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border: 2px solid;
        }

        .stock.available {
            background: #d4edda;
            color: #155724;
            border-color: #28a745;
        }

        .stock.limited {
            background: #fff3cd;
            color: #856404;
            border-color: #ffc107;
        }

        .stock.unavailable {
            background: #f8d7da;
            color: #721c24;
            border-color: #dc3545;
        }

        footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #e9ecef;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state svg {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-state h3 {
            font-size: 1.5em;
            margin-bottom: 10px;
            color: #666;
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 1.8em;
            }

            .header-stats {
                gap: 15px;
            }

            .filters {
                flex-direction: column;
            }

            .filter-group {
                min-width: 100%;
            }

            table {
                font-size: 0.9em;
            }

            th,
            td {
                padding: 10px;
            }

            .table-wrapper {
                overflow-x: auto;
            }
        }

        .badge-new {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            margin-left: 10px;
        }

        .description {
            font-size: 0.9em;
            color: #888;
            max-width: 300px;
        }

        .precio-principal {
            font-weight: 600;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        }

        .rangos-columna {
            margin-top: 8px;
            padding-top: 8px;
            font-size: 0.85em;
        }

        .rango-fila {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 4px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .rango-fila:last-child {
            border-bottom: none;
        }

        .rango-cant {
            color: #777;
            font-size: 0.9em;
            min-width: 80px;
        }

        .rango-pre {
            color: #667eea;
            font-weight: 600;
            white-space: nowrap;
        }

    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <header>
            <h1>📋 Catálogo de Precios</h1>
            <p>{{ $empresa }}</p>
            <div class="header-stats">
                <div class="stat">
                    <span class="stat-number">{{ $total_productos }}</span>
                    <span class="stat-label">Productos</span>
                </div>
                {{-- <div class="stat">
                    <span class="stat-number">{{ $productos->sum('stock_disponible') }}</span>
                <span class="stat-label">Unidades en Stock</span>
            </div> --}}
            <div class="stat">
                <span class="stat-label">Actualizado:</span>
                <span class="stat-number">{{ $fecha_actualizacion }}</span>
            </div>
    </div>
    </header>

    <!-- FILTERS -->
    {{-- <div class="filters">
            <div class="filter-group">
                <label for="search">🔍 Buscar por nombre o SKU:</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Ej: Producto, ABC123"
                    onkeyup="filtrarTabla()"
                >
            </div>
            <div class="filter-group">
                <label for="categoria">📦 Stock mínimo:</label>
                <select id="categoria" onchange="filtrarTabla()">
                    <option value="">Todos</option>
                    <option value="0">Disponible (>0)</option>
                    <option value="10">Bajo (<10)</option>
                </select>
            </div>
        </div> --}}

    <!-- TABLA DE PRODUCTOS -->
    <div class="content">
        @if($productos->isEmpty())
        <div class="empty-state">
            <h3>No hay productos disponibles</h3>
            <p>Por el momento no contamos con stock disponible.</p>
        </div>
        @else
        <div class="table-wrapper">
            <table id="tablaPrecios">
                <thead>
                    <tr>
                        <th style="width: 30%;">Producto</th>
                        <th style="width: 10%;">Código</th>
                        <th style="width: 15%;">Precio Venta</th>
                        <th style="width: 15%;">Descuento</th>
                        <th style="width: 15%;">Especial</th>
                        @if($mostrar_stock ?? false)
                        <th style="width: 15%; text-align: center;">📦 Stock</th>
                        @endif
                    </tr>
                </thead>
                <tbody id="cuerpoTabla">
                    @foreach($productos as $producto)
                    <tr class="fila-producto" data-nombre="{{ strtolower($producto['nombre']) }}" data-sku="{{ strtolower($producto['sku']) }}" data-stock="{{ $producto['stock_disponible'] }}">
                        <td>
                            <strong>{{ $producto['nombre'] }}</strong>
                            @if($producto['descripcion'])
                            <div class="description">{{ $producto['descripcion'] }}</div>
                            @endif
                        </td>
                        <td><span class="sku">{{ $producto['sku'] }}</span></td>
                        <td class="price">
                            @if($producto['precio_venta'])
                            <div class="precio-principal">Bs. {{ number_format($producto['precio_venta'], 2) }}</div>
                            @else
                            <span class="price-null">-</span>
                            @endif
                            @if($producto['rangos_venta'])
                            <div class="rangos-columna">
                                @foreach($producto['rangos_venta'] as $rango)
                                <div class="rango-fila">
                                    <span class="rango-cant">{{ $rango['rango_texto'] }}</span>
                                    {{-- <span class="rango-pre">Bs. {{ number_format($rango['precio'], 2) }}</span> --}}
                                </div>
                                @endforeach
                            </div>
                            @endif
                        </td>
                        <td class="price">
                            @if($producto['precio_descuento'])
                            <div class="precio-principal">Bs. {{ number_format($producto['precio_descuento'], 2) }}</div>
                            @else
                            <span class="price-null">-</span>
                            @endif
                            @if($producto['rangos_descuento'])
                            <div class="rangos-columna">
                                @foreach($producto['rangos_descuento'] as $rango)
                                <div class="rango-fila">
                                    <span class="rango-cant">{{ $rango['rango_texto'] }}</span>
                                    {{-- <span class="rango-pre">Bs. {{ number_format($rango['precio'], 2) }}</span> --}}
                                </div>
                                @endforeach
                            </div>
                            @endif
                        </td>
                        <td class="price">
                            @if($producto['precio_especial'])
                            <div class="precio-principal"><strong>Bs. {{ number_format($producto['precio_especial'], 2) }}</strong></div>
                            @else
                            <span class="price-null">-</span>
                            @endif
                            @if($producto['rangos_especial'])
                            <div class="rangos-columna">
                                @foreach($producto['rangos_especial'] as $rango)
                                <div class="rango-fila">
                                    <span class="rango-cant">{{ $rango['rango_texto'] }}</span>
                                    {{-- <span class="rango-pre">Bs. {{ number_format($rango['precio'], 2) }}</span> --}}
                                </div>
                                @endforeach
                            </div>
                            @endif
                        </td>
                        @if($mostrar_stock ?? false)
                        <td style="text-align: center;">
                            @php
                                $stock = $producto['stock_disponible'];
                                if ($stock > 50) {
                                    $clase = 'stock available';
                                    $texto = "✓ {$stock} unidades";
                                } elseif ($stock > 10) {
                                    $clase = 'stock limited';
                                    $texto = "⚠ {$stock} unidades";
                                } else {
                                    $clase = 'stock unavailable';
                                    $texto = "✗ {$stock} unidades";
                                }
                            @endphp
                            <span class="{{ $clase }}">{{ $texto }}</span>
                        </td>
                        @endif
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
    </div>

    <!-- FOOTER -->
    <footer>
        <p>💡 Esta es una página pública de catálogo de precios. Para consultas adicionales, contáctenos.</p>
        <p style="margin-top: 10px; opacity: 0.7;">© {{ date('Y') }} {{ $empresa }} - Todos los derechos reservados</p>
    </footer>
    </div>

    <script>
        function filtrarTabla() {
            const search = document.getElementById('search').value.toLowerCase();
            const filtroStock = document.getElementById('categoria').value;
            const filas = document.querySelectorAll('.fila-producto');

            filas.forEach(fila => {
                const nombre = fila.getAttribute('data-nombre');
                const sku = fila.getAttribute('data-sku');
                const stock = parseInt(fila.getAttribute('data-stock'));

                let mostrar = true;

                // Filtro búsqueda
                if (search && !nombre.includes(search) && !sku.includes(search)) {
                    mostrar = false;
                }

                // Filtro stock
                if (filtroStock === '0' && stock === 0) {
                    mostrar = false;
                } else if (filtroStock === '10' && stock >= 10) {
                    mostrar = false;
                }

                fila.style.display = mostrar ? '' : 'none';
            });
        }

        // Imprimir página
        window.imprimirCatalogo = function() {
            window.print();
        };

    </script>
</body>
</html>
