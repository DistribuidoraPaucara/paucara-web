import { useState, useCallback, useMemo } from 'react';
import {
  DatosProductosMasivos,
  FilaProductoCSV,
  FilaProductoValidada,
  ResultadoProductosMasivos,
  ResultadoValidacion,
} from '@/domain/entities/productos-masivos';
import { productosCSVService } from '@/infrastructure/services/productosCSV.service';
import { busquedaInteligente } from '@/infrastructure/services/busquedaInteligente.service';

export function useProductosMasivos() {
  // Estado
  const [archivo, setArchivo] = useState<File | null>(null);
  const [contenidoCSV, setContenidoCSV] = useState<string>('');
  const [filas, setFilas] = useState<FilaProductoValidada[]>([]);
  const [paso, setPaso] = useState<'carga' | 'validacion' | 'confirmacion' | 'procesando' | 'resultado'>('carga');
  const [progreso, setProgreso] = useState(0);
  const [erroresGlobales, setErroresGlobales] = useState<string[]>([]);
  const [resultadoProcesamiento, setResultadoProcesamiento] = useState<ResultadoProductosMasivos | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // Computed values
  const puedeValidar = useMemo(() => !cargando && filas.length > 0, [cargando, filas]);

  const puedeConfirmar = useMemo(
    () => paso === 'validacion' && filas.some((f) => f.validacion.es_valido) && !cargando,
    [paso, filas, cargando]
  );

  const filasValidas = useMemo(() => filas.filter((f) => f.validacion.es_valido), [filas]);

  const filasConErrores = useMemo(() => filas.filter((f) => !f.validacion.es_valido), [filas]);

  const porcentajeValidez = useMemo(() => {
    if (filas.length === 0) return 0;
    return Math.round((filasValidas.length / filas.length) * 100);
  }, [filas, filasValidas]);

  const resumenValidacion = useMemo(() => {
    const sinProveedor = filas.filter((f) => !f.proveedor_nombre).length;
    const sinUnidad = filas.filter((f) => !f.unidad_medida_nombre).length;
    const sinPrecio = filas.filter((f) => !f.precio_costo && !f.precio_venta).length;
    const sinCodigoBarras = filas.filter((f) => !f.codigo_barra).length;

    return {
      total: filas.length,
      validas: filasValidas.length,
      conErrores: filasConErrores.length,
      advertencias: {
        sinProveedor,
        sinUnidad,
        sinPrecio,
        sinCodigoBarras,
      },
    };
  }, [filas, filasValidas, filasConErrores]);

  // Métodos
  const validarArchivo = useCallback(
    async (file: File): Promise<void> => {
      try {
        setCargando(true);
        setMensajeError(null);
        setErroresGlobales([]);

        setArchivo(file);

        // Validar tamaño (máx 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('El archivo no puede exceder 10MB');
        }

        // Validar extensión
        const ext = file.name.split('.').pop()?.toLowerCase();
        const extensionesValidas = ['csv', 'xlsx', 'xls', 'ods'];
        if (!ext || !extensionesValidas.includes(ext)) {
          throw new Error(`Formato no válido. Usa: ${extensionesValidas.join(', ')}`);
        }

        // Leer archivo
        const texto = await file.text();
        if (!texto.trim()) {
          throw new Error('El archivo está vacío');
        }

        setContenidoCSV(texto);

        // Validar estructura
        const validacionEstructura = productosCSVService.validarEstructura(texto);
        if (!validacionEstructura.valido) {
          setErroresGlobales(validacionEstructura.errores);
          throw new Error('Estructura del CSV inválida');
        }

        // Parsear CSV
        const filasRaw = productosCSVService.parsearCSV(texto);
        if (filasRaw.length === 0) {
          throw new Error('El CSV no contiene datos');
        }

        if (filasRaw.length > 5000) {
          throw new Error('El archivo contiene más de 5000 filas');
        }

        // Validar filas
        const resultadoValidacion = await productosCSVService.validarFilas(filasRaw);
        let filasEnriquecidas = resultadoValidacion.filas_validadas;

        // Validar con backend para detectar productos existentes
        try {
          const validacionBackend = await productosCSVService.validarConBackend(filasRaw);
          if (validacionBackend.success && validacionBackend.resultados) {
            // Enriquecer filas con información de backend
            filasEnriquecidas = filasEnriquecidas.map((fila, index) => {
              const resultadoBackend = validacionBackend.resultados[index];
              if (resultadoBackend?.existe && resultadoBackend.producto_existente) {
                return {
                  ...fila,
                  producto_existente: resultadoBackend.producto_existente,
                  accion_stock: 'sumar' as const, // Default a sumar
                };
              }
              return {
                ...fila,
                accion_stock: 'sumar' as const,
              };
            });
          }
        } catch (error: any) {
          // Si falla validación con backend, continuar con validación local solamente
          console.warn('Validación backend falló, continuando con validación local:', error.message);
          // Agregar accion_stock default a las filas
          filasEnriquecidas = filasEnriquecidas.map((fila) => ({
            ...fila,
            accion_stock: 'sumar' as const,
          }));
        }

        setFilas(filasEnriquecidas);

        // Ir al paso de validación
        setPaso('validacion');
      } catch (error: any) {
        setMensajeError(error.message || 'Error procesando archivo');
        setPaso('carga');
      } finally {
        setCargando(false);
      }
    },
    []
  );

  /**
   * Resolver referencias inteligentemente usando búsqueda por ID, código, nombre (case-insensitive)
   */
  const resolverReferencias = useCallback(
    (
      filasParaResolver: FilaProductoValidada[],
      categorias: any[],
      marcas: any[],
      unidades: any[],
      almacenes: any[]
    ): FilaProductoValidada[] => {
      return filasParaResolver.map((fila) => {
        const filaResuelta = { ...fila };

        // Resolver categoría
        if (fila.categoria_nombre) {
          const catResuelta = busquedaInteligente.resolver(
            fila.categoria_nombre,
            categorias
          );
          if (catResuelta) {
            filaResuelta.categoria_nombre = catResuelta.nombre;
          }
        }

        // Resolver marca
        if (fila.marca_nombre) {
          const marcaResuelta = busquedaInteligente.resolver(
            fila.marca_nombre,
            marcas
          );
          if (marcaResuelta) {
            filaResuelta.marca_nombre = marcaResuelta.nombre;
          }
        }

        // Resolver unidad de medida
        if (fila.unidad_medida_nombre) {
          const unidadResuelta = busquedaInteligente.resolver(
            fila.unidad_medida_nombre,
            unidades
          );
          if (unidadResuelta) {
            filaResuelta.unidad_medida_nombre = unidadResuelta.nombre;
          }
        }

        // Resolver almacén
        if (fila.almacen_nombre) {
          const almacenResuelta = busquedaInteligente.resolver(
            fila.almacen_nombre,
            almacenes
          );
          if (almacenResuelta) {
            filaResuelta.almacen_id = almacenResuelta.id;
            filaResuelta.almacen_nombre = almacenResuelta.nombre;
          }
        }
        if (fila.almacen_id && !fila.almacen_nombre) {
          const almacen = almacenes.find((a) => a.id === fila.almacen_id);
          if (almacen) {
            filaResuelta.almacen_nombre = almacen.nombre;
          }
        }

        return filaResuelta;
      });
    },
    []
  );

  const detectarDuplicados = useCallback((): FilaProductoValidada[] => {
    const nombres = new Map<string, FilaProductoValidada[]>();
    const codigosBarras = new Map<string, FilaProductoValidada[]>();

    // Agrupar por nombre y código
    for (const fila of filas) {
      const nombreNorm = productosCSVService.normalizarTexto(fila.nombre);
      if (nombreNorm) {
        if (!nombres.has(nombreNorm)) {
          nombres.set(nombreNorm, []);
        }
        nombres.get(nombreNorm)!.push(fila);
      }

      if (fila.codigo_barra) {
        if (!codigosBarras.has(fila.codigo_barra)) {
          codigosBarras.set(fila.codigo_barra, []);
        }
        codigosBarras.get(fila.codigo_barra)!.push(fila);
      }
    }

    // Encontrar duplicados
    const duplicados: FilaProductoValidada[] = [];
    for (const grupo of nombres.values()) {
      if (grupo.length > 1) {
        duplicados.push(...grupo.slice(1));
      }
    }
    for (const grupo of codigosBarras.values()) {
      if (grupo.length > 1) {
        duplicados.push(...grupo.slice(1));
      }
    }

    return duplicados;
  }, [filas]);

  const procesarProductos = useCallback(
    async (): Promise<void> => {
      try {
        setCargando(true);
        setMensajeError(null);
        setPaso('procesando');
        setProgreso(0);

        // Preparar datos
        const productosParaProcesar = filasValidas.map((fila) => ({
          nombre: fila.nombre,
          descripcion: fila.descripcion,
          principio_activo: fila.principio_activo,
          uso_de_medicacion: fila.uso_de_medicacion,
          sku: fila.sku,
          codigo_barra: fila.codigo_barra,
          proveedor_nombre: fila.proveedor_nombre,
          unidad_medida_nombre: fila.unidad_medida_nombre,
          cantidad: fila.cantidad,
          precio_costo: fila.precio_costo,
          precio_venta: fila.precio_venta,
          lote: fila.lote,
          fecha_vencimiento: fila.fecha_vencimiento,
          categoria_nombre: fila.categoria_nombre,
          marca_nombre: fila.marca_nombre,
          almacen_id: fila.almacen_id,
          almacen_nombre: fila.almacen_nombre,
          accion_stock: fila.accion_stock || 'sumar',
        }));

        const datos: DatosProductosMasivos = {
          nombre_archivo: archivo?.name || 'plantilla_productos.csv',
          datos_csv: contenidoCSV,
          productos: productosParaProcesar,
        };

        // Enviar al servidor
        setProgreso(50);
        setMensajeError(null); // Limpiar errores previos

        const resultado = await productosCSVService.procesarProductosMasivos(datos);
        setResultadoProcesamiento(resultado);

        setProgreso(100);
        setPaso('resultado');
      } catch (error: any) {
        // Capturar mensaje de error del backend o del cliente
        const mensajeError = error.message || 'Error procesando productos';
        setMensajeError(mensajeError);

        // Si es un error 409 (archivo duplicado), mantener en confirmación
        // Si es otro error, también mantener en confirmación para que el usuario pueda revisar
        setPaso('confirmacion');

        console.error('Error en procesamiento:', {
          mensaje: mensajeError,
          status: error.status,
          datos: error.data,
        });
      } finally {
        setCargando(false);
      }
    },
    [filasValidas, archivo, contenidoCSV]
  );

  const limpiar = useCallback((): void => {
    setArchivo(null);
    setContenidoCSV('');
    setFilas([]);
    setPaso('carga');
    setProgreso(0);
    setErroresGlobales([]);
    setResultadoProcesamiento(null);
    setMensajeError(null);
  }, []);

  const volverAlPaso = useCallback((nuevoPaso: 'carga' | 'validacion' | 'confirmacion'): void => {
    setPaso(nuevoPaso);
    if (nuevoPaso === 'carga') {
      limpiar();
    }
    setMensajeError(null);
  }, [limpiar]);

  // Método para editar una fila
  const editarFila = useCallback((filaIndex: number, campo: keyof FilaProductoValidada, valor: any): void => {
    setFilas((filasActuales) => {
      const nuevasFilas = [...filasActuales];
      const fila = nuevasFilas[filaIndex];

      if (fila) {
        // Actualizar el campo
        (fila as any)[campo] = valor;

        // Revalidar la fila
        if (campo === 'cantidad' || campo === 'nombre' || campo === 'precio_costo' || campo === 'precio_venta') {
          // Validaciones básicas
          if (campo === 'cantidad') {
            fila.validacion.es_valido = fila.nombre && fila.cantidad >= 0;
          } else if (campo === 'nombre') {
            fila.validacion.es_valido = valor && valor.trim().length > 0 && fila.cantidad >= 0;
          }
        }
      }

      return nuevasFilas;
    });
  }, []);

  // Método para eliminar una fila
  const eliminarFila = useCallback((filaIndex: number): void => {
    setFilas((filasActuales) => filasActuales.filter((_, idx) => idx !== filaIndex));
  }, []);

  // Cambiar acción de stock (sumar o reemplazar)
  const cambiarAccionStock = useCallback((filaIndex: number, accion: 'sumar' | 'reemplazar'): void => {
    setFilas((filasActuales) => {
      const nuevasFilas = [...filasActuales];
      if (nuevasFilas[filaIndex]) {
        nuevasFilas[filaIndex].accion_stock = accion;
      }
      return nuevasFilas;
    });
  }, []);

  /**
   * Aplicar acción de stock a TODOS los productos
   */
  const cambiarAccionStockGlobal = useCallback((accion: 'sumar' | 'reemplazar'): void => {
    setFilas((filasActuales) => {
      return filasActuales.map((fila) => ({
        ...fila,
        accion_stock: accion,
      }));
    });
  }, []);

  /**
   * Detectar SKUs duplicados en las filas válidas
   */
  const detectarSKUsDuplicados = useCallback((): { [sku: string]: FilaProductoValidada[] } => {
    const skuDuplicados: { [sku: string]: FilaProductoValidada[] } = {};

    filasValidas.forEach((fila) => {
      if (fila.sku) {
        if (!skuDuplicados[fila.sku]) {
          skuDuplicados[fila.sku] = [];
        }
        skuDuplicados[fila.sku].push(fila);
      }
    });

    // Retornar solo los que aparecen más de una vez
    return Object.entries(skuDuplicados)
      .filter(([_, filas]) => filas.length > 1)
      .reduce((acc, [sku, filas]) => {
        acc[sku] = filas;
        return acc;
      }, {} as { [sku: string]: FilaProductoValidada[] });
  }, [filasValidas]);

  /**
   * Unificar productos con el mismo SKU agrupando cantidades
   */
  const unificarSKUsDuplicados = useCallback((): void => {
    const skuDuplicados = detectarSKUsDuplicados();

    if (Object.keys(skuDuplicados).length === 0) {
      setMensajeError('No hay SKUs duplicados para unificar');
      return;
    }

    setFilas((filasActuales) => {
      const filasUnificadas: FilaProductoValidada[] = [];
      const skusProcessados = new Set<string>();

      filasActuales.forEach((fila) => {
        // Si este SKU ya fue procesado (unificado), omitir
        if (fila.sku && skusProcessados.has(fila.sku)) {
          return;
        }

        if (fila.sku && skuDuplicados[fila.sku]) {
          // Este SKU es duplicado, unificar todas sus instancias
          const filasConEsteSKU = filasActuales.filter((f) => f.sku === fila.sku);
          const cantidadTotal = filasConEsteSKU.reduce((sum, f) => sum + (f.cantidad || 0), 0);

          // Usar la primera fila como base y actualizar cantidad
          const filaUnificada = { ...filasConEsteSKU[0] };
          filaUnificada.cantidad = cantidadTotal;
          filaUnificada.validacion = {
            ...filaUnificada.validacion,
            advertencias: [
              ...(filaUnificada.validacion.advertencias || []),
              `SKU unificado: ${filasConEsteSKU.length} productos agrupados (total: ${cantidadTotal} unidades)`,
            ],
          };

          filasUnificadas.push(filaUnificada);
          skusProcessados.add(fila.sku);
        } else {
          // No es duplicado, agregar tal cual
          filasUnificadas.push(fila);
        }
      });

      return filasUnificadas;
    });

    setMensajeError(null);
  }, [detectarSKUsDuplicados]);

  return {
    // Estado
    archivo,
    setArchivo,
    contenidoCSV,
    setContenidoCSV,
    filas,
    setFilas,
    paso,
    setPaso,
    progreso,
    setProgreso,
    erroresGlobales,
    setErroresGlobales,
    resultadoProcesamiento,
    setResultadoProcesamiento,
    cargando,
    setCargando,
    mensajeError,
    setMensajeError,

    // Computed
    puedeValidar,
    puedeConfirmar,
    filasValidas,
    filasConErrores,
    porcentajeValidez,
    resumenValidacion,

    // Métodos
    validarArchivo,
    resolverReferencias,
    detectarDuplicados,
    procesarProductos,
    limpiar,
    volverAlPaso,
    editarFila,
    eliminarFila,
    cambiarAccionStock,
    cambiarAccionStockGlobal,
    detectarSKUsDuplicados,
    unificarSKUsDuplicados,
  };
}
