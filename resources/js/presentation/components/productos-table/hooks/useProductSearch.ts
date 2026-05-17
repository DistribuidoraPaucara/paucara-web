import { useState, useCallback, useRef, useEffect } from 'react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { Producto } from '@/domain/entities/ventas';
import Fuse from 'fuse.js';

interface UseProductSearchProps {
    tipo: 'compra' | 'venta';
    almacen_id?: number;
    cliente_id?: number | null;
    readOnly?: boolean;
    onAddProduct: (producto: Producto) => void;
    useFuseSearch?: boolean; // ✅ NIVEL 2: Permitir deshabilitar Fuse.js si es necesario
    isClienteGeneral?: boolean; // ✅ NUEVO: Indicar si es cliente GENERAL para seleccionar tipo de precio
    es_farmacia?: boolean; // ✅ NUEVO (2026-05-08): Indicar si es farmacia para permitir productos sin stock
}

export function useProductSearch({
    tipo,
    almacen_id,
    cliente_id,
    readOnly,
    onAddProduct,
    useFuseSearch = false, // ✅ DESACTIVADO (2026-05-08): Usar búsqueda por API en lugar de cargar todos los productos al inicio
    isClienteGeneral = false, // ✅ NUEVO: Por defecto NO es cliente general
    es_farmacia = false // ✅ NUEVO (2026-05-08): Por defecto NO es farmacia
}: UseProductSearchProps) {
    const [productSearch, setProductSearch] = useState('');
    const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    // ✅ NIVEL 2: Estados para Fuse.js
    const [todosProductos, setTodosProductos] = useState<Producto[]>([]);
    const [productosInicioCargados, setProductosInicioCargados] = useState(false);
    const fuseIndexRef = useRef<Fuse<Producto> | null>(null);

    // ✅ NIVEL 1: Caché local para búsquedas
    const searchCacheRef = useRef<Map<string, Producto[]>>(new Map());

    // ✅ NIVEL 1: Ref para debounce
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ Helper: Transformar respuesta de API a formato Producto
    const transformarProductoAPI = (p: any): Producto => {
        // 🔍 Logging de entrada - verificar códigos de barras
        if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
            console.log(`🔄 [transformarProductoAPI] ENTRADA: ${p.nombre}`, {
                codigosBarra: p.codigosBarra,
                codigos_barras: p.codigos_barras,
                codigos_producto: p.codigos_producto
            });
        }

        const stockDisponible = tipo === 'compra'
            ? (p.stock_disponible !== null && p.stock_disponible !== undefined ? p.stock_disponible : (p.stock || 0))
            : (p.stock_disponible || 0);

        // ✅ NUEVO: Determinar el precio correcto según tipo (compra vs venta) y cliente
        let precioVenta = p.precio_base || 0;
        let tipoPrecioUsado = 'precio_base';
        let tipoPrecioSeleccionado = null;

        // ✅ MODO COMPRA: Usar precio de costo directamente
        if (tipo === 'compra') {
            precioVenta = p.precio_costo || 0;
            tipoPrecioUsado = 'Precio Costo';
            console.log(`💵 [transformarProductoAPI] MODO COMPRA - ${p.nombre}: Precio Costo = ${precioVenta}`);
        }
        // ✅ MODO VENTA: Seleccionar según cliente (LICORERIA vs VENTA)
        else if (tipo === 'venta') {
            // Si hay array de precios disponibles
            if (p.precios && Array.isArray(p.precios) && p.precios.length > 0) {
                // ✅ LÓGICA: Seleccionar tipo de precio según cliente
                let tipoNombreBuscado = null;

                if (isClienteGeneral) {
                    // ✅ CLIENTE GENERAL → buscar LICORERIA
                    tipoNombreBuscado = 'LICORERIA';
                    console.log(`🎯 [transformarProductoAPI] Cliente es GENERAL → buscando precio ${tipoNombreBuscado}`);
                } else {
                    // ✅ OTROS CLIENTES → buscar VENTA
                    tipoNombreBuscado = 'VENTA';
                    console.log(`🎯 [transformarProductoAPI] Cliente es ESPECÍFICO → buscando precio ${tipoNombreBuscado}`);
                }

                // Intentar encontrar el precio por nombre exacto
                if (tipoNombreBuscado) {
                    const precioBuscado = p.precios.find((pr: any) =>
                        (pr.nombre?.toUpperCase() === tipoNombreBuscado?.toUpperCase() ||
                         pr.tipoPrecio?.nombre?.toUpperCase() === tipoNombreBuscado?.toUpperCase())
                    );

                    if (precioBuscado) {
                        precioVenta = precioBuscado.precio || 0;
                        tipoPrecioUsado = precioBuscado.nombre || precioBuscado.tipoPrecio?.nombre || tipoNombreBuscado;
                        tipoPrecioSeleccionado = precioBuscado.tipo_precio_id;
                        console.log(`✅ [transformarProductoAPI] ${p.nombre}: Precio ${tipoNombreBuscado} encontrado = ${precioVenta}`);
                    } else {
                        // Si no encuentra el tipo buscado, usar recomendado o primero disponible
                        console.log(`⚠️ [transformarProductoAPI] ${p.nombre}: Precio ${tipoNombreBuscado} NO encontrado, usando alternativa`);
                        if (p.tipo_precio_id_recomendado) {
                            const precioRecomendado = p.precios.find((pr: any) => pr.tipo_precio_id === p.tipo_precio_id_recomendado);
                            if (precioRecomendado) {
                                precioVenta = precioRecomendado.precio || 0;
                                tipoPrecioUsado = precioRecomendado.nombre || p.tipo_precio_nombre_recomendado || 'Recomendado';
                                tipoPrecioSeleccionado = p.tipo_precio_id_recomendado;
                            }
                        } else {
                            precioVenta = p.precios[0].precio || 0;
                            tipoPrecioUsado = p.precios[0].nombre || 'Primer disponible';
                            tipoPrecioSeleccionado = p.precios[0].tipo_precio_id;
                        }
                    }
                }
            }

            // 🔍 Logging: Mostrar qué precio se seleccionó en VENTA
            if (p.precios && p.precios.length > 0) {
                console.log(`💰 [transformarProductoAPI] MODO VENTA - ${p.nombre} | Precio: ${precioVenta} (${tipoPrecioUsado}) | Tipos disponibles:`, p.precios.map((pr: any) => ({
                    tipo: pr.nombre || pr.tipoPrecio?.nombre,
                    precio: pr.precio,
                    esMarcado: pr.tipo_precio_id === tipoPrecioSeleccionado
                })));
            }
        }

        // 🔍 VERIFICACIÓN: Intentar obtener códigos de barras desde diferentes fuentes
        let codigosBarrasExtraidos: string[] = [];

        if (p.codigosBarra && Array.isArray(p.codigosBarra) && p.codigosBarra.length > 0) {
            codigosBarrasExtraidos = p.codigosBarra.map((cb: any) => cb.codigo);
            if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
                console.log(`✅ [transformarProductoAPI] ${p.nombre}: Códigos de barras desde codigosBarra:`, codigosBarrasExtraidos);
            }
        } else if (p.codigos_barras && Array.isArray(p.codigos_barras) && p.codigos_barras.length > 0) {
            codigosBarrasExtraidos = p.codigos_barras.map((cb: any) => typeof cb === 'string' ? cb : cb.codigo);
            if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
                console.log(`✅ [transformarProductoAPI] ${p.nombre}: Códigos de barras desde codigos_barras:`, codigosBarrasExtraidos);
            }
        } else if (p.codigos_producto && Array.isArray(p.codigos_producto) && p.codigos_producto.length > 0) {
            codigosBarrasExtraidos = p.codigos_producto.map((cb: any) => cb.codigo || cb);
            if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
                console.log(`✅ [transformarProductoAPI] ${p.nombre}: Códigos de barras desde codigos_producto:`, codigosBarrasExtraidos);
            }
        } else {
            if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
                console.log(`⚠️ [transformarProductoAPI] ${p.nombre}: NO SE ENCONTRARON CÓDIGOS DE BARRAS en ninguna fuente`);
            }
        }

        const resultado: Producto = {
            id: p.id,
            nombre: p.nombre,
            codigo: p.sku || p.codigo_barras,
            codigo_barras: p.codigo_barras,
            precio_venta: precioVenta,
            precio_costo: p.precio_costo || 0,
            precio_compra: p.precio_costo || 0,
            stock: stockDisponible,
            stock_disponible_calc: stockDisponible,
            stock_total_calc: p.stock_total || 0,
            stock_reservado: p.stock_reservado || 0,
            capacidad: p.capacidad || null,
            peso: p.peso,
            codigos_barras: codigosBarrasExtraidos,
            es_fraccionado: p.es_fraccionado || false,
            unidad_medida_id: p.unidad_medida_id,
            unidad_medida_nombre: p.unidad_medida_nombre,
            conversiones: p.conversiones || [],
            precios: p.precios?.map((pr: any) => ({
                id: pr.id,
                tipo_precio_id: pr.tipo_precio_id,
                nombre: pr.nombre || pr.tipoPrecio?.nombre,
                precio: pr.precio
            })) || [],
            tipo_precio_id_recomendado: tipoPrecioSeleccionado || p.tipo_precio_id_recomendado,
            tipo_precio_nombre_recomendado: tipoPrecioUsado || p.tipo_precio_nombre_recomendado,
            es_combo: p.es_combo || false,
            combo_items: p.combo_items || [],
            limite_productos: p.limite_productos || null,
            limite_venta: p.limite_venta || null,
            marca: p.marca ? { id: p.marca.id, nombre: p.marca.nombre } : null,
            unidad: p.unidad ? { id: p.unidad.id, nombre: p.unidad.nombre, codigo: p.unidad.codigo } : null,
            categoria: p.categoria ? { id: p.categoria.id, nombre: p.categoria.nombre } : null,
            principio_activo: p.principio_activo || null,
            uso_de_medicacion: p.uso_de_medicacion || null
        };

        // 🔍 Logging de salida - mostrar resumen
        if (p.nombre && (p.nombre.includes('Paceña') || p.nombre.includes('Corona'))) {
            console.log(`📤 [transformarProductoAPI] SALIDA: ${p.nombre}`, {
                codigo: resultado.codigo,
                codigos_barras: resultado.codigos_barras,
                codigosCount: resultado.codigos_barras.length
            });
        }

        return resultado;
    };

    // ✅ Helper: Filtrar productos válidos según tipo
    const filtrarProductosValidos = (productosAPI: Producto[]): Producto[] => {
        return productosAPI.filter(p => {
            if (tipo === 'venta') {
                const esCombo = (p as any).es_combo || false;
                const tieneComponentes = ((p as any).combo_items?.length || 0) > 0;
                const permiteSinStock = (p as any).permite_venta_sin_stock || false; // ✅ NUEVO (2026-05-08)

                if (esCombo) {
                    return tieneComponentes;
                }

                // ✅ MODIFICADO (2026-05-08): Permitir productos sin stock si es farmacia y el producto lo permite
                const tieneStockSuficiente = p.stock > 0;
                const esProductoFarmacia = es_farmacia && permiteSinStock;

                return (tieneStockSuficiente || esProductoFarmacia) && p.precio_venta > 0;
            }
            return true;
        });
    };

    // ✅ Función para agregar producto y limpiar input/sugerencias
    const handleAgregarProductoYLimpiar = (producto: Producto) => {
        onAddProduct(producto);
        setProductSearch('');
        setProductosDisponibles([]);
        setSearchError(null);
    };

    // ✅ NIVEL 2: Cargar todos los productos una sola vez (para Fuse.js)
    useEffect(() => {
        if (!useFuseSearch || productosInicioCargados) return;

        const cargarTodosProductos = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams({
                    limite: '2000', // ⚡ Cargar todos los productos
                    tipo: tipo
                });

                if (almacen_id) params.append('almacen_id', almacen_id.toString());
                if (cliente_id) params.append('cliente_id', cliente_id.toString());

                const url = `/api/app/productos/listar?${params.toString()}`;

                // 📤 LOG: Mostrar exactamente qué se envía
                console.log('📤 [useProductSearch] PARÁMETROS ENVIADOS AL BACKEND:', {
                    url,
                    parametros: {
                        limite: params.get('limite'),
                        tipo: params.get('tipo'),
                        almacen_id: params.get('almacen_id'),
                        cliente_id: params.get('cliente_id')
                    }
                });

                const response = await fetch(url);

                if (!response.ok) {
                    console.warn(`⚠️ [useProductSearch] Endpoint /listar no disponible (${response.status}), usando búsqueda tradicional`);
                    setProductosInicioCargados(true);
                    return;
                }

                const data = await response.json();

                // 📥 LOG: Mostrar exactamente qué llega del backend
                console.log('📥 [useProductSearch] RESPUESTA COMPLETA DEL BACKEND:', {
                    success: data.success,
                    total: data.data?.length,
                    permiteSinStock: data.data?.filter((p: any) => p.permite_venta_sin_stock)?.length || 0,
                    primerosProductos: data.data?.slice(0, 5).map((p: any) => ({
                        id: p.id,
                        nombre: p.nombre,
                        permiteSinStock: p.permite_venta_sin_stock,
                        stock: p.stock_disponible || p.stock,
                        precios: p.precios?.length || 0
                    })) || []
                });

                console.log('📊 [useProductSearch] DATOS CRUDOS:', data);

                const productosAPI = data.data.map(transformarProductoAPI);
                console.log(`📊 [useProductSearch] Productos transformados: ${productosAPI.length}`);

                const productosValidos = filtrarProductosValidos(productosAPI);
                console.log(`✅ [useProductSearch] Productos válidos (después de filtrar): ${productosValidos.length}`);

                setTodosProductos(productosValidos);
                setProductosInicioCargados(true);

                // 🔍 Configurar Fuse.js
                fuseIndexRef.current = new Fuse(productosValidos, {
                    keys: [
                        { name: 'nombre', weight: 0.5 },
                        { name: 'codigo', weight: 0.3 },
                        { name: 'marca.nombre', weight: 0.1 },
                        { name: 'categoria.nombre', weight: 0.1 }
                    ],
                    threshold: 0.3, // 🎯 Tolerancia 0-1 (menor = más estricto)
                    minMatchCharLength: 2,
                    limit: 10,
                    isCaseSensitive: false
                });

                console.log(`✨ [useProductSearch] Fuse.js inicializado con ${productosValidos.length} productos`);
                console.log(`%c📋 ÍNDICE DE PRODUCTOS CARGADO`, 'color: #00aa00; font-weight: bold; font-size: 14px;', {
                    totalCargado: productosValidos.length,
                    tipo: tipo,
                    almacen_id: almacen_id,
                    cliente_id: cliente_id,
                    pesos: {
                        nombre: 0.5,
                        codigo: 0.3,
                        marca: 0.1,
                        categoria: 0.1
                    }
                });
            } catch (error) {
                console.error('❌ [useProductSearch] Error cargando productos:', error);
                setProductosInicioCargados(true);
            } finally {
                setIsLoading(false);
            }
        };

        cargarTodosProductos();
    }, [useFuseSearch, productosInicioCargados, tipo, almacen_id, cliente_id]);

    // ✅ NIVEL 1 + 2: Función de búsqueda con debounce, caché y Fuse.js
    const buscarProductos = useCallback(async (searchTerm?: string) => {
        // ✅ IMPORTANTE: Usar argumento si se proporciona, sino usar estado actual
        const term = searchTerm !== undefined ? searchTerm.trim() : productSearch.trim();

        // Si no hay búsqueda, limpiar resultados
        if (term === '') {
            setProductosDisponibles([]);
            setSearchError(null);
            return;
        }

        // Si búsqueda muy corta, no hacer request
        if (term.length < 2) {
            setProductosDisponibles([]);
            setSearchError(null);
            return;
        }

        // 💾 Revisar caché primero
        const cacheKey = `${term}_${tipo}_${almacen_id}_${cliente_id}`;
        if (searchCacheRef.current.has(cacheKey)) {
            console.log('✅ [useProductSearch] Resultado del caché para:', term);
            setProductosDisponibles(searchCacheRef.current.get(cacheKey) || []);
            setSearchError(null);
            return;
        }

        // ⏱️ Limpiar timeout anterior
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // ⏰ Esperar 300ms antes de buscar (debounce)
        searchTimeoutRef.current = setTimeout(async () => {
            setIsLoading(true);
            setSearchError(null);

            try {
                let resultados: Producto[] = [];

                // ✅ NIVEL 2: Si Fuse.js está disponible, usar búsqueda local
                if (useFuseSearch && fuseIndexRef.current && productosInicioCargados) {
                    console.log('🔍 [useProductSearch] Búsqueda LOCAL con Fuse.js para:', term);
                    const resultadosFuse = fuseIndexRef.current.search(term);
                    resultados = resultadosFuse.map(r => r.item);
                    console.log(`✨ [useProductSearch] Resultados Fuse.js: ${resultados.length} productos`);
                    if (resultados.length > 0) {
                        console.table(resultados.map(p => ({
                            nombre: p.nombre,
                            código: p.codigo,
                            precio: p.precio_venta,
                            stock: p.stock,
                            unidad: p.unidad_medida_nombre
                        })));
                    }
                } else {
                    // ✅ NIVEL 1: Fallback a búsqueda por API
                    console.log('🔍 [useProductSearch] Búsqueda por API para:', term);
                    const params = new URLSearchParams({
                        q: term,
                        limite: '10',
                        tipo: tipo
                    });

                    if (almacen_id) params.append('almacen_id', almacen_id.toString());
                    if (cliente_id) params.append('cliente_id', cliente_id.toString());

                    const url = `/api/app/productos/buscar?${params.toString()}`;
                    console.log('📡 [useProductSearch] URL:', url);
                    console.log('📦 [useProductSearch] Parámetros:', {
                        q: term,
                        limite: '10',
                        tipo: tipo,
                        almacen_id: almacen_id,
                        cliente_id: cliente_id
                    });

                    const response = await fetch(url);

                    if (!response.ok) {
                        console.error(`❌ [useProductSearch] Error HTTP ${response.status}:`, response.statusText);
                        throw new Error('Error en búsqueda de productos');
                    }

                    const data = await response.json();
                    console.log('📥 [useProductSearch] Respuesta cruda del API:', data);

                    // 🔍 NUEVO: Verificar códigos de barras en el primer producto
                    if (data.data && data.data.length > 0) {
                        const primerProducto = data.data[0];
                        console.log(`🏷️ [useProductSearch] Primer producto - Verificación de códigos de barras:`, {
                            nombre: primerProducto.nombre,
                            codigo: primerProducto.codigo || primerProducto.sku,
                            codigo_barras: primerProducto.codigo_barras,
                            codigosBarra: primerProducto.codigosBarra,
                            codigos_barras: primerProducto.codigos_barras,
                            codigos_producto: primerProducto.codigos_producto,
                            todas_las_keys: Object.keys(primerProducto)
                        });
                    }

                    const productosAPI = data.data.map(transformarProductoAPI);
                    console.log(`📊 [useProductSearch] Productos transformados: ${productosAPI.length}`);
                    if (productosAPI.length > 0) {
                        console.table(productosAPI.slice(0, 5).map(p => ({
                            nombre: p.nombre,
                            código: p.codigo,
                            precio: p.precio_venta,
                            stock: p.stock,
                            unidad: p.unidad_medida_nombre,
                            codigosBarras: p.codigos_barras?.length || 0
                        })));
                    }

                    resultados = filtrarProductosValidos(productosAPI);
                    console.log(`✅ [useProductSearch] Productos válidos (después de filtrar): ${resultados.length}`);
                    if (resultados.length > 0) {
                        console.table(resultados.slice(0, 5).map(p => ({
                            nombre: p.nombre,
                            código: p.codigo,
                            precio: p.precio_venta,
                            stock: p.stock,
                            unidad: p.unidad_medida_nombre
                        })));
                    }
                }

                // 💾 Guardar en caché
                searchCacheRef.current.set(cacheKey, resultados);
                setProductosDisponibles(resultados);
                console.log(`🎯 [useProductSearch] Resultado final para mostrar: ${resultados.length} productos`);

                // 🤖 Si hay 1 resultado exacto, agregar automáticamente
                if (resultados.length === 1) {
                    console.log('🤖 [useProductSearch] Auto-agregando producto único:', resultados[0].nombre);
                    handleAgregarProductoYLimpiar(resultados[0]);
                }
            } catch (error) {
                console.error('❌ [useProductSearch] Error:', error);
                setSearchError('Error al buscar productos');
                setProductosDisponibles([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // ⏱️ 300ms debounce
    }, [productSearch, tipo, almacen_id, cliente_id, useFuseSearch, productosInicioCargados]);

    // ✅ Limpiar timeout al desmontar o cuando cambian dependencias
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // ✅ AUTO-DISPARAR búsqueda cuando productSearch cambia (para que funcione sin presionar botón)
    // ⚠️ PERO: Solo buscar si hay más de 1 carácter (evitar búsquedas innecesarias en page load)
    useEffect(() => {
        if (productSearch.trim().length >= 1) {
            buscarProductos(productSearch);
        } else if (productSearch.trim().length === 0) {
            // Limpiar resultados si se borra todo
            setProductosDisponibles([]);
            setSearchError(null);
        }
    }, [productSearch, buscarProductos]);

    // ✅ Manejar resultado del escáner (búsqueda EXACTA por código de barras)
    const handleScannerResult = useCallback(async (result: string) => {
        if (!result) return;

        console.log(`🔍 [Scanner] Escaneando código: "${result}"`);

        try {
            setIsLoading(true);
            setSearchError(null);

            let producto: Producto | null = null;

            // ✅ NIVEL 2: Si Fuse.js está disponible, buscar localmente primero
            if (useFuseSearch && fuseIndexRef.current && productosInicioCargados) {
                console.log('🔍 [Scanner] Búsqueda LOCAL en Fuse.js para código:', result);
                const resultadosFuse = fuseIndexRef.current.search(result, { limit: 1 });
                console.log(`📊 [Scanner] Resultados Fuse.js: ${resultadosFuse.length} encontrados`);
                if (resultadosFuse.length > 0) {
                    producto = resultadosFuse[0].item;
                    console.log(`✅ [Scanner] Producto encontrado en Fuse.js:`, {
                        nombre: producto.nombre,
                        codigo: producto.codigo,
                        score: resultadosFuse[0].score
                    });
                }
            }

            // ✅ Fallback a API si Fuse.js no encontró nada
            if (!producto) {
                console.log('🔍 [Scanner] Búsqueda por API para código:', result);
                const params = new URLSearchParams({
                    q: result,
                    tipo_busqueda: 'exacta',
                    limite: '1',
                    tipo: tipo
                });

                if (almacen_id) params.append('almacen_id', almacen_id.toString());
                if (cliente_id) params.append('cliente_id', cliente_id.toString());

                const url = `/api/productos/buscar?${params.toString()}`;
                console.log('📡 [Scanner] URL:', url);
                const response = await fetch(url);

                if (!response.ok) {
                    console.error(`❌ [Scanner] Error HTTP ${response.status}:`, response.statusText);
                    throw new Error('Error buscando producto');
                }

                const data = await response.json();
                console.log('📥 [Scanner] Respuesta API:', data);

                if (data.data && data.data.length > 0) {
                    producto = transformarProductoAPI(data.data[0]);
                    console.log('✅ [Scanner] Producto encontrado en API:', {
                        nombre: producto.nombre,
                        codigo: producto.codigo,
                        stock: producto.stock
                    });
                } else {
                    console.log('⚠️ [Scanner] No se encontró producto con ese código');
                }
            }

            if (producto) {
                console.log('🎯 [Scanner] Validando producto:', { nombre: producto.nombre, tipo: tipo });

                // ✅ Validar producto para ventas
                if (tipo === 'venta') {
                    const esCombo = (producto as any).es_combo || false;
                    const tieneComponentes = ((producto as any).combo_items?.length || 0) > 0;

                    console.log(`📋 [Scanner] Validación para venta: esCombo=${esCombo}, tieneComponentes=${tieneComponentes}, stock=${producto.stock}, precio=${producto.precio_venta}`);

                    if (!esCombo) {
                        if (producto.stock === 0) {
                            console.warn('⚠️ [Scanner] Producto sin stock disponible');
                            NotificationService.error('Producto sin stock disponible');
                            return;
                        }

                        if (producto.precio_venta === 0) {
                            console.warn('⚠️ [Scanner] Producto sin precio de venta configurado');
                            NotificationService.error('Producto sin precio de venta configurado');
                            return;
                        }
                    } else {
                        if (!tieneComponentes) {
                            console.warn('⚠️ [Scanner] Combo sin productos componentes configurados');
                            NotificationService.error('Combo sin productos componentes configurados');
                            return;
                        }
                    }
                }

                console.log(`✨ [Scanner] Producto validado y listo para agregar: ${producto.nombre}`);
                handleAgregarProductoYLimpiar(producto);
                NotificationService.success(`Producto escaneado: ${producto.nombre}`);
            } else {
                console.log('❌ [Scanner] No se encontró producto con ese código de barras');
                NotificationService.error('No se encontró producto con ese código de barras');
            }
        } catch (error) {
            console.error('❌ [Scanner] Error:', error);
            NotificationService.error('Error al buscar producto escaneado');
        } finally {
            setIsLoading(false);
        }
    }, [tipo, almacen_id, cliente_id, useFuseSearch, productosInicioCargados]);

    return {
        productSearch,
        setProductSearch,
        productosDisponibles,
        isLoading,
        searchError,
        isFocused,
        setIsFocused,
        buscarProductos,
        handleScannerResult,
        handleAgregarProductoYLimpiar
    };
}
