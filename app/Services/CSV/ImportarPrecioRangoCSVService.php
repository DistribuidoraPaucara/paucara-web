<?php

namespace App\Services\CSV;

use App\Models\Producto;
use App\Models\PrecioRangoCantidadProducto;
use App\Models\TipoPrecio;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class ImportarPrecioRangoCSVService
{
    /**
     * Procesar archivo CSV de rangos de precios
     *
     * Formato esperado del CSV:
     * sku,cantidad_minima,cantidad_maxima,tipo_precio_codigo,fecha_inicio,fecha_fin,activo
     *
     * Ejemplo:
     * PEPSI-250,1,9,VENTA_NORMAL,,
     * PEPSI-250,10,49,DESCUENTO,,
     * PEPSI-250,50,,ESPECIAL,,
     */
    public function procesarArchivo(
        UploadedFile $archivo,
        int $empresaId,
        ?int $productoId = null,
        bool $sobreescribir = false,
        ?array $correcciones = null,
        ?array $filasEliminadas = null
    ): array {
        $resultado = [
            'exitosos' => 0,
            'errores' => 0,
            'total' => 0,
            'detalles' => [],
            'productos_procesados' => [],
        ];

        try {
            $filas = $this->leerCSV($archivo);

            if (empty($filas)) {
                throw new Exception('El archivo CSV está vacío');
            }

            // Procesar cada fila
            foreach ($filas as $numFila => $fila) {
                // Saltar filas que fueron eliminadas por el usuario
                // Convertir a string para comparación en caso que venga como JSON
                if ($filasEliminadas) {
                    $filasEliminadasString = array_map('strval', $filasEliminadas);
                    if (in_array(strval($numFila), $filasEliminadasString)) {
                        continue;
                    }
                }

                $resultado['total']++;

                try {
                    $this->procesarFila($fila, $numFila, $empresaId, $productoId, $sobreescribir, $resultado, $correcciones);
                    $resultado['exitosos']++;
                } catch (Exception $e) {
                    $resultado['errores']++;
                    $resultado['detalles'][] = [
                        'fila' => $numFila,
                        'error' => $e->getMessage(),
                        'tipo' => 'error',
                    ];
                }
            }

            return $resultado;
        } catch (Exception $e) {
            return [
                'exitosos' => 0,
                'errores' => 1,
                'total' => 0,
                'detalles' => [['error' => $e->getMessage(), 'tipo' => 'error']],
                'productos_procesados' => [],
            ];
        }
    }

    /**
     * Leer archivo CSV con soporte UTF-8
     */
    private function leerCSV(UploadedFile $archivo): array
    {
        try {
            // Leer contenido asegurando UTF-8
            $contenido = file_get_contents($archivo->getPathname());

            // Detectar y convertir a UTF-8 si es necesario
            $encoding = mb_detect_encoding($contenido, 'UTF-8, ISO-8859-1, WINDOWS-1252', true);
            if ($encoding !== 'UTF-8') {
                $contenido = mb_convert_encoding($contenido, 'UTF-8', $encoding);
            }

            // Normalizar saltos de línea
            $contenido = str_replace(["\r\n", "\r"], "\n", $contenido);
            $lineas = array_filter(array_map('trim', explode("\n", $contenido)));

            $filas = [];
            $headers = null;
            $lineNum = 0;

            foreach ($lineas as $numLinea => $linea) {
                // Ignorar líneas vacías
                if (empty(trim($linea))) {
                    continue;
                }

                // Procesar encabezados (primera línea no vacía)
                if ($headers === null) {
                    $headers = str_getcsv($linea);
                    // Normalizar nombres de columnas a minúsculas
                    $headers = array_map(function($h) {
                        return mb_strtolower(trim($h), 'UTF-8');
                    }, $headers);
                    continue;
                }

                $valores = str_getcsv($linea);
                $fila = [];

                foreach ($headers as $indice => $encabezado) {
                    $fila[$encabezado] = trim($valores[$indice] ?? '');
                }

                $filas[] = $fila;
                $lineNum++;
            }

            return $filas;
        } catch (\Exception $e) {
            throw new Exception("Error al leer archivo CSV: " . $e->getMessage());
        }
    }

    /**
     * Procesar una fila del CSV
     */
    private function procesarFila(
        array $fila,
        int $numFila,
        int $empresaId,
        ?int $productoIdForzado,
        bool $sobreescribir,
        array &$resultado,
        ?array $correcciones = null
    ): void {
        // Validar campos requeridos
        $sku = $fila['sku'] ?? $fila['codigo_sku'] ?? $fila['producto'] ?? null;
        if (!$sku) {
            throw new Exception('Campo "sku" requerido');
        }

        $cantidadMinima = (int) ($fila['cantidad_minima'] ?? $fila['cantidad_min'] ?? null);
        if (!$cantidadMinima || $cantidadMinima <= 0) {
            throw new Exception('cantidad_minima debe ser > 0');
        }

        $cantidadMaxima = !empty($fila['cantidad_maxima'] ?? $fila['cantidad_max'] ?? null)
            ? (int) ($fila['cantidad_maxima'] ?? $fila['cantidad_max'])
            : null;

        if ($cantidadMaxima && $cantidadMaxima < $cantidadMinima) {
            throw new Exception('cantidad_maxima debe ser >= cantidad_minima');
        }

        $tipoPrecioCodigo = mb_strtoupper($fila['tipo_precio'] ?? $fila['tipo_precio_codigo'] ?? null, 'UTF-8');
        if (!$tipoPrecioCodigo) {
            throw new Exception('Campo "tipo_precio" requerido');
        }

        // Obtener producto - usar corrección si está disponible
        $productoId = null;

        // Si hay corrección manual para esta fila, usarla
        // Buscar tanto con numero como con string (JSON puede venir como string)
        $productoIdCorregido = null;
        if ($correcciones) {
            $productoIdCorregido = $correcciones[$numFila] ?? $correcciones[strval($numFila)] ?? null;
        }

        if ($productoIdCorregido && $productoIdCorregido > 0) {
            $productoId = $productoIdCorregido;
            $producto = Producto::find($productoId);
            if (!$producto) {
                throw new Exception("Producto corregido (ID: {$productoId}) no encontrado");
            }
        } else {
            // Búsqueda flexible case-insensitive por SKU o nombre
            $skuTrimmed = trim($sku);
            // Normalizar espacios múltiples a un solo espacio
            $skuNormalizado = preg_replace('/\s+/', ' ', $skuTrimmed);
            $skuLower = mb_strtolower($skuNormalizado, 'UTF-8');

            // Obtener todos los productos (activos e inactivos) para comparación
            $productos = Producto::select('id', 'sku', 'nombre', 'activo')
                ->get();

            // Función auxiliar para normalizar y convertir a minúsculas
            $normalizarYLower = function($texto) {
                $trimmed = trim($texto);
                $normalizado = preg_replace('/\s+/', ' ', $trimmed);
                return mb_strtolower($normalizado, 'UTF-8');
            };

            // Función auxiliar para remover espacios (búsqueda sin espacios)
            $sinEspacios = function($texto) {
                return str_replace(' ', '', $texto);
            };

            // Función auxiliar para normalizar sinónimos comunes
            $normalizarSinonimos = function($texto) {
                // Mapear sinónimos comunes
                $sinonimos = [
                    'litro' => 'l',
                    'lts' => 'l',
                    'lt' => 'l',
                    'mililitro' => 'ml',
                    'ml' => 'ml',
                    'kilogramo' => 'kg',
                    'kg' => 'kg',
                    'gramo' => 'g',
                    'onza' => 'oz',
                    'libra' => 'lb',
                ];

                $texto = mb_strtolower($texto, 'UTF-8');
                foreach ($sinonimos as $sinonimo => $valor) {
                    $texto = str_replace($sinonimo, $valor, $texto);
                }
                return $texto;
            };

            // Buscar coincidencia exacta primero
            $producto = $productos->first(function ($p) use ($skuLower, $normalizarYLower) {
                return $normalizarYLower($p->sku) === $skuLower ||
                       $normalizarYLower($p->nombre) === $skuLower;
            });

            // Si no encuentra coincidencia exacta, buscar parcial
            if (!$producto) {
                $producto = $productos->first(function ($p) use ($skuLower, $normalizarYLower, $sinEspacios, $normalizarSinonimos) {
                    $productoNombreLower = $normalizarYLower($p->nombre);
                    $productoSkuLower = $normalizarYLower($p->sku);

                    // Versiones sin espacios para comparación más flexible
                    $skuSinEspacios = $sinEspacios($skuLower);
                    $productoNombreSinEspacios = $sinEspacios($productoNombreLower);
                    $productoSkuSinEspacios = $sinEspacios($productoSkuLower);

                    // Versiones con sinónimos normalizados
                    $skuConSinonimos = $normalizarSinonimos($skuLower);
                    $productoNombreConSinonimos = $normalizarSinonimos($productoNombreLower);
                    $productoSkuConSinonimos = $normalizarSinonimos($productoSkuLower);

                    // Buscar si una está contenida en la otra (con o sin espacios)
                    return strpos($productoNombreLower, $skuLower) !== false ||
                           strpos($productoSkuLower, $skuLower) !== false ||
                           strpos($skuLower, $productoNombreLower) !== false ||
                           // Búsqueda sin espacios
                           strpos($productoNombreSinEspacios, $skuSinEspacios) !== false ||
                           strpos($productoSkuSinEspacios, $skuSinEspacios) !== false ||
                           strpos($skuSinEspacios, $productoNombreSinEspacios) !== false ||
                           // Búsqueda con sinónimos normalizados
                           strpos($productoNombreConSinonimos, $skuConSinonimos) !== false ||
                           strpos($productoSkuConSinonimos, $skuConSinonimos) !== false ||
                           strpos($skuConSinonimos, $productoNombreConSinonimos) !== false;
                });
            }

            // Si aún no encuentra, generar sugerencias
            if (!$producto) {
                // Buscar productos similares (primeras 3 letras)
                $palabrasClave = explode(' ', $skuLower);
                $similares = $productos->filter(function ($p) use ($palabrasClave, $normalizarYLower) {
                    $nombreLower = $normalizarYLower($p->nombre);
                    foreach ($palabrasClave as $palabra) {
                        if (mb_strlen($palabra) > 2 && strpos($nombreLower, $palabra) !== false) {
                            return true;
                        }
                    }
                    return false;
                })->take(3)->pluck('nombre')->toArray();

                $sugerencias = !empty($similares)
                    ? '. Productos similares: ' . implode(', ', $similares)
                    : '';

                throw new Exception("Producto '{$skuTrimmed}' no encontrado{$sugerencias}");
            }

            // Validar que el producto esté activo
            if (!$producto->activo) {
                throw new Exception("El producto '{$skuTrimmed}' existe pero está inactivo");
            }
        }

        // Si se especificó un producto, validar que coincida
        if ($productoIdForzado && $producto->id !== $productoIdForzado) {
            throw new Exception("El producto {$sku} no coincide con el filtro especificado");
        }

        // Obtener tipo de precio - búsqueda case-insensitive por código o nombre
        $tipoPrecioLower = mb_strtolower($tipoPrecioCodigo, 'UTF-8');
        $tipoPrecio = TipoPrecio::where('activo', true)
            ->where(function ($query) use ($tipoPrecioLower) {
                $query->whereRaw('LOWER(codigo) = ?', [$tipoPrecioLower])
                    ->orWhereRaw('LOWER(nombre) = ?', [$tipoPrecioLower]);
            })
            ->first();

        if (!$tipoPrecio) {
            throw new Exception("Tipo de precio '{$tipoPrecioCodigo}' no encontrado o inactivo");
        }

        // Validar que el producto tenga precio para este tipo
        $precioExistente = $producto->obtenerPrecio($tipoPrecio->id);
        if (!$precioExistente) {
            throw new Exception("El producto {$sku} no tiene precio configurado para tipo '{$tipoPrecioCodigo}'");
        }

        // Procesar fechas
        $fechaInicio = !empty($fila['fecha_inicio'] ?? $fila['vigencia_inicio'] ?? null)
            ? date('Y-m-d', strtotime($fila['fecha_inicio'] ?? $fila['vigencia_inicio']))
            : null;

        $fechaFin = !empty($fila['fecha_fin'] ?? $fila['vigencia_fin'] ?? null)
            ? date('Y-m-d', strtotime($fila['fecha_fin'] ?? $fila['vigencia_fin']))
            : null;

        // Validar fechas
        if ($fechaFin && $fechaInicio && strtotime($fechaFin) < strtotime($fechaInicio)) {
            throw new Exception('Fecha fin debe ser >= fecha inicio');
        }

        // Procesar activo - UTF-8 compatible
        $activo = !isset($fila['activo']) || mb_strtolower($fila['activo'], 'UTF-8') !== 'no';

        // Si sobreescribir, eliminar rangos anteriores del producto
        if ($sobreescribir && !isset($resultado['_sobreescrito'][$producto->id])) {
            PrecioRangoCantidadProducto::where('empresa_id', $empresaId)
                ->where('producto_id', $producto->id)
                ->delete();

            $resultado['_sobreescrito'][$producto->id] = true;
        }

        // Crear o actualizar rango
        PrecioRangoCantidadProducto::updateOrCreate(
            [
                'empresa_id' => $empresaId,
                'producto_id' => $producto->id,
                'cantidad_minima' => $cantidadMinima,
                'cantidad_maxima' => $cantidadMaxima,
            ],
            [
                'tipo_precio_id' => $tipoPrecio->id,
                'fecha_vigencia_inicio' => $fechaInicio,
                'fecha_vigencia_fin' => $fechaFin,
                'activo' => $activo,
            ]
        );

        // Rastrear productos procesados
        if (!in_array($producto->nombre, $resultado['productos_procesados'])) {
            $resultado['productos_procesados'][] = $producto->nombre;
        }

        $resultado['detalles'][] = [
            'fila' => $numFila,
            'producto' => $producto->nombre,
            'rango' => "{$cantidadMinima}-" . ($cantidadMaxima ?? '∞'),
            'tipo_precio' => $tipoPrecio->nombre,
            'tipo' => 'exito',
        ];
    }

    /**
     * Previsualizar archivo CSV sin importar
     * Retorna la estructura del archivo con búsquedas ya resueltas
     */
    public function previsualizarArchivo(
        UploadedFile $archivo,
        int $empresaId,
        ?int $productoId = null
    ): array {
        $preview = [
            'total_filas' => 0,
            'filas_validas' => 0,
            'filas_con_error' => 0,
            'productos_encontrados' => [],
            'tipos_precio_encontrados' => [],
            'detalles' => [],
            'productos_procesados' => [],
        ];

        try {
            $filas = $this->leerCSV($archivo);

            if (empty($filas)) {
                throw new Exception('El archivo CSV está vacío');
            }

            foreach ($filas as $numFila => $fila) {
                $preview['total_filas']++;
                $detallePreview = [
                    'fila' => $numFila,
                    'valido' => true,
                    'error' => null,
                    'datos' => []
                ];

                try {
                    // PRIMERO: Parsear datos de cantidad y tipo de precio
                    // Esto se hace antes de buscar el producto para que estén disponibles incluso si hay error
                    $cantidadMinima = (int) ($fila['cantidad_minima'] ?? $fila['cantidad_min'] ?? null);
                    if (!$cantidadMinima || $cantidadMinima <= 0) {
                        throw new Exception('cantidad_minima debe ser > 0');
                    }

                    $cantidadMaxima = !empty($fila['cantidad_maxima'] ?? $fila['cantidad_max'] ?? null)
                        ? (int) ($fila['cantidad_maxima'] ?? $fila['cantidad_max'])
                        : null;

                    if ($cantidadMaxima && $cantidadMaxima < $cantidadMinima) {
                        throw new Exception('cantidad_maxima debe ser >= cantidad_minima');
                    }

                    // Obtener tipo de precio
                    $tipoPrecioCodigo = mb_strtoupper($fila['tipo_precio'] ?? $fila['tipo_precio_codigo'] ?? null, 'UTF-8');
                    if (!$tipoPrecioCodigo) {
                        throw new Exception('Campo "tipo_precio" requerido');
                    }

                    // Validar campos requeridos
                    $sku = $fila['sku'] ?? $fila['codigo_sku'] ?? $fila['producto'] ?? null;
                    if (!$sku) {
                        throw new Exception('Campo "sku" requerido');
                    }

                    // Buscar producto - búsqueda flexible UTF-8 compatible
                    $skuTrimmed = trim($sku);
                    // Normalizar espacios múltiples a un solo espacio
                    $skuNormalizado = preg_replace('/\s+/', ' ', $skuTrimmed);
                    $skuLower = mb_strtolower($skuNormalizado, 'UTF-8');

                    // Obtener todos los productos y filtrar en PHP para comparación case-insensitive confiable
                    $productosLista = Producto::select('id', 'sku', 'nombre', 'activo')
                        ->get();

                    // Función auxiliar para normalizar y convertir a minúsculas
                    $normalizarYLower = function($texto) {
                        $trimmed = trim($texto);
                        $normalizado = preg_replace('/\s+/', ' ', $trimmed);
                        return mb_strtolower($normalizado, 'UTF-8');
                    };

                    // Función auxiliar para remover espacios (búsqueda sin espacios)
                    $sinEspacios = function($texto) {
                        return str_replace(' ', '', $texto);
                    };

                    // Función auxiliar para normalizar sinónimos comunes
                    $normalizarSinonimos = function($texto) {
                        // Mapear sinónimos comunes
                        $sinonimos = [
                            'litro' => 'l',
                            'lts' => 'l',
                            'lt' => 'l',
                            'mililitro' => 'ml',
                            'ml' => 'ml',
                            'kilogramo' => 'kg',
                            'kg' => 'kg',
                            'gramo' => 'g',
                            'onza' => 'oz',
                            'libra' => 'lb',
                        ];

                        $texto = mb_strtolower($texto, 'UTF-8');
                        foreach ($sinonimos as $sinonimo => $valor) {
                            $texto = str_replace($sinonimo, $valor, $texto);
                        }
                        return $texto;
                    };

                    // Buscar coincidencia exacta primero
                    $producto = $productosLista->first(function ($p) use ($skuLower, $normalizarYLower) {
                        return $normalizarYLower($p->sku) === $skuLower ||
                               $normalizarYLower($p->nombre) === $skuLower;
                    });

                    // Si no encuentra coincidencia exacta, buscar parcial
                    if (!$producto) {
                        $producto = $productosLista->first(function ($p) use ($skuLower, $normalizarYLower, $sinEspacios, $normalizarSinonimos) {
                            $productoNombreLower = $normalizarYLower($p->nombre);
                            $productoSkuLower = $normalizarYLower($p->sku);

                            // Versiones sin espacios para comparación más flexible
                            $skuSinEspacios = $sinEspacios($skuLower);
                            $productoNombreSinEspacios = $sinEspacios($productoNombreLower);
                            $productoSkuSinEspacios = $sinEspacios($productoSkuLower);

                            // Versiones con sinónimos normalizados
                            $skuConSinonimos = $normalizarSinonimos($skuLower);
                            $productoNombreConSinonimos = $normalizarSinonimos($productoNombreLower);
                            $productoSkuConSinonimos = $normalizarSinonimos($productoSkuLower);

                            // Buscar si una está contenida en la otra (con o sin espacios)
                            return strpos($productoNombreLower, $skuLower) !== false ||
                                   strpos($productoSkuLower, $skuLower) !== false ||
                                   strpos($skuLower, $productoNombreLower) !== false ||
                                   // Búsqueda sin espacios
                                   strpos($productoNombreSinEspacios, $skuSinEspacios) !== false ||
                                   strpos($productoSkuSinEspacios, $skuSinEspacios) !== false ||
                                   strpos($skuSinEspacios, $productoNombreSinEspacios) !== false ||
                                   // Búsqueda con sinónimos normalizados
                                   strpos($productoNombreConSinonimos, $skuConSinonimos) !== false ||
                                   strpos($productoSkuConSinonimos, $skuConSinonimos) !== false ||
                                   strpos($skuConSinonimos, $productoNombreConSinonimos) !== false;
                        });
                    }

                    if (!$producto) {
                        throw new Exception("Producto '{$skuTrimmed}' no encontrado");
                    }

                    // Validar que el producto esté activo
                    if (!$producto->activo) {
                        throw new Exception("El producto '{$skuTrimmed}' existe pero está inactivo");
                    }

                    // Validar filtro de producto si existe
                    if ($productoId && $producto->id !== $productoId) {
                        throw new Exception("El producto no coincide con el filtro especificado");
                    }

                    // Búsqueda de tipo de precio - UTF-8 compatible
                    $tipoPrecioLower = mb_strtolower($tipoPrecioCodigo, 'UTF-8');
                    $tipoPrecio = TipoPrecio::where('activo', true)
                        ->where(function ($query) use ($tipoPrecioLower) {
                            $query->whereRaw('LOWER(codigo) = ?', [$tipoPrecioLower])
                                ->orWhereRaw('LOWER(nombre) = ?', [$tipoPrecioLower]);
                        })
                        ->first();

                    if (!$tipoPrecio) {
                        throw new Exception("Tipo de precio '{$tipoPrecioCodigo}' no encontrado o inactivo");
                    }

                    // Llenar detalles válidos
                    $detallePreview['datos'] = [
                        'producto_id' => $producto->id,
                        'producto_nombre' => $producto->nombre,
                        'producto_sku' => $producto->sku,
                        'tipo_precio_id' => $tipoPrecio->id,
                        'tipo_precio_nombre' => $tipoPrecio->nombre,
                        'tipo_precio_codigo' => $tipoPrecio->codigo,
                        'cantidad_minima' => $cantidadMinima,
                        'cantidad_maxima' => $cantidadMaxima,
                        'rango_texto' => "{$cantidadMinima}-" . ($cantidadMaxima ?? '∞'),
                    ];

                    // Rastrear productos y tipos encontrados
                    if (!isset($preview['productos_encontrados'][$producto->id])) {
                        $preview['productos_encontrados'][$producto->id] = [
                            'id' => $producto->id,
                            'nombre' => $producto->nombre,
                            'sku' => $producto->sku,
                        ];
                    }

                    if (!isset($preview['tipos_precio_encontrados'][$tipoPrecio->id])) {
                        $preview['tipos_precio_encontrados'][$tipoPrecio->id] = [
                            'id' => $tipoPrecio->id,
                            'nombre' => $tipoPrecio->nombre,
                            'codigo' => $tipoPrecio->codigo,
                        ];
                    }

                    if (!in_array($producto->nombre, $preview['productos_procesados'])) {
                        $preview['productos_procesados'][] = $producto->nombre;
                    }

                    $preview['filas_validas']++;

                } catch (Exception $e) {
                    $detallePreview['valido'] = false;
                    $detallePreview['error'] = $e->getMessage();

                    // Intentar llenar datos parciales aunque haya error
                    // Para que el usuario vea qué información tenía el CSV
                    try {
                        $cantidadMinimaTemp = (int) ($fila['cantidad_minima'] ?? $fila['cantidad_min'] ?? null);
                        $cantidadMaximaTemp = !empty($fila['cantidad_maxima'] ?? $fila['cantidad_max'] ?? null)
                            ? (int) ($fila['cantidad_maxima'] ?? $fila['cantidad_max'])
                            : null;
                        $tipoPrecioCodigoTemp = mb_strtoupper($fila['tipo_precio'] ?? $fila['tipo_precio_codigo'] ?? null, 'UTF-8');

                        if ($cantidadMinimaTemp > 0 && $tipoPrecioCodigoTemp) {
                            // Buscar tipo de precio para obtener su nombre
                            $tipoPrecioTemp = TipoPrecio::where('activo', true)
                                ->where(function ($query) use ($tipoPrecioCodigoTemp) {
                                    $query->whereRaw('LOWER(codigo) = ?', [mb_strtolower($tipoPrecioCodigoTemp, 'UTF-8')])
                                        ->orWhereRaw('LOWER(nombre) = ?', [mb_strtolower($tipoPrecioCodigoTemp, 'UTF-8')]);
                                })
                                ->first();

                            // Asegurar que los valores sean UTF-8 válidos
                            $tipoPrecioNombre = $tipoPrecioTemp?->nombre ?? $tipoPrecioCodigoTemp;
                            $tipoPrecioCodigo = $tipoPrecioTemp?->codigo ?? $tipoPrecioCodigoTemp;

                            // Validar que sean UTF-8 válido
                            if (!mb_check_encoding($tipoPrecioNombre, 'UTF-8')) {
                                $tipoPrecioNombre = mb_convert_encoding($tipoPrecioNombre, 'UTF-8', 'UTF-8');
                            }
                            if (!mb_check_encoding($tipoPrecioCodigo, 'UTF-8')) {
                                $tipoPrecioCodigo = mb_convert_encoding($tipoPrecioCodigo, 'UTF-8', 'UTF-8');
                            }

                            $detallePreview['datos'] = [
                                'cantidad_minima' => $cantidadMinimaTemp,
                                'cantidad_maxima' => $cantidadMaximaTemp,
                                'tipo_precio_nombre' => $tipoPrecioNombre,
                                'tipo_precio_codigo' => $tipoPrecioCodigo,
                                'rango_texto' => "{$cantidadMinimaTemp}-" . ($cantidadMaximaTemp ?? '∞'),
                            ];
                        }
                    } catch (Exception $parseError) {
                        // Si no se pueden parsear los datos parciales, dejar el array vacío
                        $detallePreview['datos'] = [];
                    }

                    $preview['filas_con_error']++;
                }

                $preview['detalles'][] = $detallePreview;
            }

            // Convertir arrays asociativos a arrays indexados
            $preview['productos_encontrados'] = array_values($preview['productos_encontrados']);
            $preview['tipos_precio_encontrados'] = array_values($preview['tipos_precio_encontrados']);

            return $preview;

        } catch (Exception $e) {
            return [
                'total_filas' => 0,
                'filas_validas' => 0,
                'filas_con_error' => 1,
                'productos_encontrados' => [],
                'tipos_precio_encontrados' => [],
                'detalles' => [['error' => $e->getMessage(), 'valido' => false]],
                'productos_procesados' => [],
            ];
        }
    }

    /**
     * Generar plantilla CSV de ejemplo
     * Usa los tipos de precio reales de la BD
     */
    public static function generarPlantillaCSV(int $empresaId): string
    {
        $csv = "sku,cantidad_minima,cantidad_maxima,tipo_precio,fecha_inicio,fecha_fin,activo\n";

        // Obtener algunos productos como ejemplo
        $productos = Producto::where('activo', true)->limit(3)->get();

        // Obtener tipos de precio actuales ordenados por orden
        $tiposPrecio = TipoPrecio::where('activo', true)
            ->orderBy('orden', 'asc')
            ->get();

        // Si no hay productos, agregar un ejemplo genérico
        if ($productos->isEmpty()) {
            $productos = collect([
                (object)['sku' => 'EJEMPLO-001'],
                (object)['sku' => 'EJEMPLO-002'],
            ]);
        }

        // Generar filas de ejemplo con tipos de precio reales
        foreach ($productos as $producto) {
            if ($tiposPrecio->isNotEmpty()) {
                // Usar los tipos de precio reales de la BD
                foreach ($tiposPrecio as $index => $tipo) {
                    if ($index === 0) {
                        $csv .= "{$producto->sku},1,9,{$tipo->codigo},,\n";
                    } elseif ($index === 1) {
                        $csv .= "{$producto->sku},10,49,{$tipo->codigo},,\n";
                    } elseif ($index === 2) {
                        $csv .= "{$producto->sku},50,,{$tipo->codigo},,\n";
                    } else {
                        // Si hay más de 3 tipos, agregar otros ejemplos
                        $csv .= "{$producto->sku}," . (10 * $index) . "," . (10 * $index + 9) . ",{$tipo->codigo},,\n";
                    }
                }
            } else {
                // Fallback si no hay tipos de precio definidos
                $csv .= "{$producto->sku},1,9,VENTA_NORMAL,,\n";
                $csv .= "{$producto->sku},10,49,DESCUENTO,,\n";
                $csv .= "{$producto->sku},50,,ESPECIAL,,\n";
            }
        }

        return $csv;
    }
}
