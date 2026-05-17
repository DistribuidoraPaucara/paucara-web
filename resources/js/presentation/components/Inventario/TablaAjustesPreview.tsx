import React, { useState, useMemo, useEffect } from 'react';
import { FilaAjusteValidada } from '@/infrastructure/services/ajustesCSV.service';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import InputSearch from '@/presentation/components/ui/input-search';

interface TipoOperacion {
  id: number;
  clave: string;
  label: string;
  direccion: 'entrada' | 'salida';
  requiere_tipo_motivo: string | null;
  requiere_proveedor: boolean;
  requiere_cliente: boolean;
}

interface TablaAjustesPreviewProps {
  filas: FilaAjusteValidada[];
  tiposOperacion: TipoOperacion[];
  tiposAjuste: any[];
  tiposMerma: any[];
  almacenes: any[];
  productos: any[];
  proveedores?: any[];
  clientes?: any[];
  onFilasActualizadas: (filasActualizadas: FilaAjusteValidada[]) => void;
}

export default function TablaAjustesPreview({
  filas: filasInicial,
  tiposOperacion,
  tiposAjuste,
  tiposMerma,
  almacenes,
  productos,
  proveedores = [],
  clientes = [],
  onFilasActualizadas,
}: TablaAjustesPreviewProps) {
  const [filas, setFilas] = useState<FilaAjusteValidada[]>(filasInicial);
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [productosInfo, setProductosInfo] = useState<{ [key: string]: any }>({});
  const [mostrarModalNuevaFila, setMostrarModalNuevaFila] = useState(false);
  const [nuevaFila, setNuevaFila] = useState<FilaAjusteValidada>({
    fila: 0,
    producto: '',
    cantidad: '',
    tipo_operacion: '',
    tipo_motivo: '',
    almacen: '',
    observacion: '',
    valido: false,
    errores: [],
  });

  // Cargar información de productos desde CSV al inicio
  useEffect(() => {
    const cargarProductosDelCSV = async () => {
      const productosUnicos = new Set<string>();
      filasInicial.forEach(fila => {
        if (fila.producto) productosUnicos.add(fila.producto);
      });

      for (const nombreProducto of productosUnicos) {
        // Buscar cada producto para obtener su información completa
        try {
          const response = await fetch(`/api/productos/buscar?q=${encodeURIComponent(nombreProducto)}&limite=5`);
          const data = await response.json();
          const productos = data.data || [];

          // Encontrar coincidencia exacta o la primera coincidencia
          const productoEncontrado = productos.find((p: any) =>
            p.nombre.toLowerCase() === nombreProducto.toLowerCase() ||
            p.sku?.toLowerCase() === nombreProducto.toLowerCase() ||
            p.codigo_barras?.toLowerCase() === nombreProducto.toLowerCase()
          ) || productos[0];

          if (productoEncontrado) {
            setProductosInfo(prev => ({
              ...prev,
              [nombreProducto]: productoEncontrado,
            }));
          }
        } catch (error) {
          console.error(`Error al buscar producto ${nombreProducto}:`, error);
        }
      }
    };

    if (filasInicial.length > 0) {
      cargarProductosDelCSV();
    }
  }, [filasInicial]);

  // Mejorar búsqueda: buscar por nombre, SKU, código de barras
  const filasFiltradasBusqueda = filas.filter(f => {
    const queryLower = busqueda.toLowerCase();
    const productoInfo = productosInfo[f.producto];

    // Buscar en nombre del producto del CSV
    if (f.producto.toLowerCase().includes(queryLower)) return true;

    // Si tenemos información del producto, buscar también en SKU y código de barras
    if (productoInfo) {
      if (productoInfo.nombre?.toLowerCase().includes(queryLower)) return true;
      if (productoInfo.sku?.toLowerCase().includes(queryLower)) return true;
      if (productoInfo.codigo_barras?.toLowerCase().includes(queryLower)) return true;
    }

    return false;
  });

  /**
   * Obtiene los valores válidos para el campo tipo_motivo basado en la operación seleccionada
   */
  const obtenerOpcionesMotivo = (tipoOperacionClave: string): { id: any; label: string; value: string }[] => {
    const operacion = tiposOperacion.find(o => o.clave === tipoOperacionClave);
    if (!operacion) return [];

    if (operacion.requiere_tipo_motivo === 'tipo_ajuste') {
      return tiposAjuste.map(t => ({
        id: t.id,
        label: `${t.clave} - ${t.label}`,
        value: t.clave,
      }));
    } else if (operacion.requiere_tipo_motivo === 'tipo_merma') {
      return tiposMerma.map(t => ({
        id: t.id,
        label: `${t.clave} - ${t.label}`,
        value: t.clave,
      }));
    } else if (operacion.requiere_proveedor || operacion.requiere_cliente) {
      // Para proveedor/cliente, el tipo_motivo es texto libre
      return [];
    }
    return [];
  };

  /**
   * Convierte las opciones de tipo operación al formato de SelectOption
   */
  const opcionesTiposOperacion = useMemo<SelectOption[]>(() => {
    return tiposOperacion.map(op => ({
      value: op.clave,
      label: op.label,
      description: op.clave,
    }));
  }, [tiposOperacion]);

  /**
   * Convierte las opciones de almacenes al formato de SelectOption
   */
  const opcionesAlmacenes = useMemo<SelectOption[]>(() => {
    return almacenes.map(almacen => ({
      value: almacen.nombre,
      label: almacen.nombre,
      description: almacen.activo ? 'Activo' : 'Inactivo',
      disabled: !almacen.activo,
    }));
  }, [almacenes]);

  /**
   * Obtiene las opciones de motivo como SelectOption
   */
  const obtenerOpcionesMotivoBusqueda = (tipoOperacionClave: string): SelectOption[] => {
    const opciones = obtenerOpcionesMotivo(tipoOperacionClave);
    return opciones.map(op => ({
      value: op.value,
      label: op.label,
    }));
  };

  /**
   * Busca productos en tiempo real desde la API
   */
  const buscarProductos = async (query: string) => {
    if (!query.trim() || query.length < 2) return [];

    try {
      const response = await fetch(`/api/productos/buscar?q=${encodeURIComponent(query)}&limite=10`);
      const data = await response.json();

      return (data.data || []).map((producto: any) => ({
        value: producto.nombre, // Usar nombre como value para consistencia con CSV
        label: `${producto.nombre} (${producto.sku || producto.codigo_barras})`,
        description: `Stock: ${producto.stock_total} | Precio: $${producto.precio_base}`,
        producto, // Guardar objeto completo para uso posterior
      }));
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return [];
    }
  };

  /**
   * Busca proveedores o clientes según la operación
   */
  const buscarProveedorCliente = async (query: string, tipoOperacionClave: string) => {
    const operacion = tiposOperacion.find(o => o.clave === tipoOperacionClave);

    if (!operacion) return [];

    let lista: any[] = [];
    if (operacion.requiere_proveedor) {
      lista = proveedores;
    } else if (operacion.requiere_cliente) {
      lista = clientes;
    }

    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    return lista
      .filter(item =>
        item.nombre?.toLowerCase().includes(queryLower) ||
        item.razon_social?.toLowerCase().includes(queryLower) ||
        item.ci_nit?.toLowerCase().includes(queryLower)
      )
      .map(item => ({
        value: item.id,
        label: item.nombre || item.razon_social,
        description: item.ci_nit || '',
      }));
  };

  const handleCambio = (index: number, campo: keyof FilaAjusteValidada, valor: any, opcionProducto?: any) => {
    const filasActualizadas = [...filas];
    const fila = filasActualizadas[index];

    // Actualizar campo
    if (campo === 'cantidad') {
      fila[campo] = valor === '' ? '' : parseInt(valor, 10);
    } else {
      fila[campo] = valor;
    }

    // Si se seleccionó un producto, guardar su información
    if (campo === 'producto' && opcionProducto?.producto) {
      setProductosInfo(prev => ({
        ...prev,
        [fila.producto]: opcionProducto.producto,
      }));
    }

    // Si cambia el tipo_operacion, resetear tipo_motivo
    if (campo === 'tipo_operacion') {
      fila.tipo_motivo = '';
    }

    // Revalidar esta fila
    const nuevosErrores: string[] = [];

    if (campo === 'cantidad' || campo === 'tipo_operacion' || campo === 'tipo_motivo') {
      const cantidad = parseInt(String(fila.cantidad), 10);
      if (isNaN(cantidad) || cantidad <= 0) {
        nuevosErrores.push('La cantidad debe ser un número entero positivo');
      }

      // Validar tipo_operacion
      const operacion = tiposOperacion.find(o => o.clave === fila.tipo_operacion);
      if (!operacion) {
        nuevosErrores.push('Tipo de operación no válido');
      } else {
        fila.tipo_operacion_id = operacion.id;

        // Validar tipo_motivo según la operación
        if (operacion.requiere_tipo_motivo === 'tipo_ajuste') {
          const tipoAjuste = tiposAjuste.find(t => t.clave === fila.tipo_motivo);
          if (!tipoAjuste) {
            nuevosErrores.push(`Tipo de ajuste no válido para esta operación`);
          } else {
            fila.tipo_motivo_id = tipoAjuste.id;
          }
        } else if (operacion.requiere_tipo_motivo === 'tipo_merma') {
          const tipoMerma = tiposMerma.find(t => t.clave === fila.tipo_motivo);
          if (!tipoMerma) {
            nuevosErrores.push(`Tipo de merma no válido para esta operación`);
          } else {
            fila.tipo_motivo_id = tipoMerma.id;
          }
        } else if (operacion.requiere_proveedor || operacion.requiere_cliente) {
          if (!fila.tipo_motivo || String(fila.tipo_motivo).trim().length === 0) {
            nuevosErrores.push(
              `${operacion.requiere_proveedor ? 'Proveedor' : 'Cliente'} es requerido`
            );
          }
        }
      }
    }

    if (campo === 'almacen') {
      const almacen = almacenes.find(a => a.nombre?.toUpperCase() === fila.almacen.toUpperCase());
      if (!almacen) {
        nuevosErrores.push(`Almacén "${fila.almacen}" no encontrado`);
      } else {
        fila.almacen_id = almacen.id;
      }
    }

    fila.errores = nuevosErrores;
    fila.valido = nuevosErrores.length === 0;

    setFilas(filasActualizadas);
    onFilasActualizadas(filasActualizadas);
  };

  const handleEliminarFila = (index: number) => {
    const filasActualizadas = filas.filter((_, i) => i !== index);
    setFilas(filasActualizadas);
    onFilasActualizadas(filasActualizadas);
  };

  const handleDuplicarFila = (index: number) => {
    const filaADuplicar = filas[index];
    const nuevaFilaDuplicada: FilaAjusteValidada = {
      ...filaADuplicar,
      fila: filas.length + 2,
    };
    const filasActualizadas = [...filas, nuevaFilaDuplicada];
    setFilas(filasActualizadas);
    onFilasActualizadas(filasActualizadas);
  };

  const handleAgregarFilaModal = () => {
    // Validar que todos los campos requeridos estén completos
    const errores: string[] = [];

    if (!nuevaFila.producto || nuevaFila.producto.trim().length === 0) {
      errores.push('El producto es requerido');
    }

    const cantidad = parseInt(String(nuevaFila.cantidad), 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      errores.push('La cantidad debe ser un número entero positivo');
    }

    if (!nuevaFila.tipo_operacion || nuevaFila.tipo_operacion.trim().length === 0) {
      errores.push('El tipo de operación es requerido');
    }

    if (!nuevaFila.almacen || nuevaFila.almacen.trim().length === 0) {
      errores.push('El almacén es requerido');
    }

    // Validar tipo_motivo según operación
    const operacion = tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion);
    if (operacion) {
      if (operacion.requiere_tipo_motivo === 'tipo_ajuste' || operacion.requiere_tipo_motivo === 'tipo_merma' || operacion.requiere_proveedor || operacion.requiere_cliente) {
        if (!nuevaFila.tipo_motivo || String(nuevaFila.tipo_motivo).trim().length === 0) {
          errores.push(`${operacion.requiere_proveedor ? 'Proveedor' : operacion.requiere_cliente ? 'Cliente' : 'Tipo de motivo'} es requerido`);
        }
      }
    }

    if (errores.length > 0) {
      alert('Por favor completa todos los campos requeridos:\n' + errores.join('\n'));
      return;
    }

    // Crear la nueva fila validada
    const filaValidada: FilaAjusteValidada = {
      ...nuevaFila,
      fila: filas.length + 2,
      cantidad: cantidad,
      valido: true,
      errores: [],
    };

    // Buscar IDs
    const almacenEncontrado = almacenes.find(a => a.nombre?.toUpperCase() === nuevaFila.almacen.toUpperCase());
    if (almacenEncontrado) {
      filaValidada.almacen_id = almacenEncontrado.id;
    }

    if (operacion) {
      filaValidada.tipo_operacion_id = operacion.id;

      if (operacion.requiere_tipo_motivo === 'tipo_ajuste') {
        const tipoAjuste = tiposAjuste.find(t => t.clave === nuevaFila.tipo_motivo);
        if (tipoAjuste) {
          filaValidada.tipo_motivo_id = tipoAjuste.id;
        }
      } else if (operacion.requiere_tipo_motivo === 'tipo_merma') {
        const tipoMerma = tiposMerma.find(t => t.clave === nuevaFila.tipo_motivo);
        if (tipoMerma) {
          filaValidada.tipo_motivo_id = tipoMerma.id;
        }
      }
    }

    // Agregar la fila
    const filasActualizadas = [...filas, filaValidada];
    setFilas(filasActualizadas);
    onFilasActualizadas(filasActualizadas);

    // Cerrar modal y limpiar
    setMostrarModalNuevaFila(false);
    setNuevaFila({
      fila: 0,
      producto: '',
      cantidad: '',
      tipo_operacion: '',
      tipo_motivo: '',
      almacen: '',
      observacion: '',
      valido: false,
      errores: [],
    });
  };

  /**
   * Obtiene la información del stock para una fila
   */
  const obtenerInfoStock = (fila: FilaAjusteValidada) => {
    const productoInfo = productosInfo[fila.producto];
    if (!productoInfo) return null;

    const stockActual = productoInfo.stock_total || 0;

    // Calcular cantidad anterior (suma de otras filas del mismo producto)
    const cantidadAnterior = filas
      .filter((f, idx) => f.producto === fila.producto && f !== fila && f.valido)
      .reduce((sum, f) => sum + (parseInt(String(f.cantidad), 10) || 0), 0);

    const cantidad = parseInt(String(fila.cantidad), 10) || 0;
    const stockResultante = stockActual + cantidad;

    return {
      stockActual,
      cantidadAnterior,
      cantidad,
      stockResultante,
    };
  };

  return (
    <div className="space-y-4 mb-36">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
            <path fillRule="evenodd" d="M3 7h14v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0V4a1 1 0 011-1h12a1 1 0 011 1v3h1V4a3 3 0 00-3-3H4a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3v-3h-1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" clipRule="evenodd" />
          </svg>
          Vista previa editable ({filas.length} filas)
        </h4>

        <div className="flex items-center gap-2">
          {filas.length > 0 && (
            <input
              type="text"
              placeholder="Buscar por nombre, SKU, código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
            />
          )}
          <button
            onClick={() => setMostrarModalNuevaFila(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar fila
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
        <table className="w-full text-sm border-collapse mb-48">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900">
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap">
                Fila
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap min-w-[150px]">
                Producto
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap">
                Cant.
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap min-w-[140px]">
                Tipo Op.
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap min-w-[140px]">
                Tipo Motivo
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap min-w-[120px]">
                Almacén
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap min-w-[120px]">
                Observ.
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-semibold text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {filasFiltradasBusqueda.map((fila, index) => {
              const indexOriginal = filas.indexOf(fila);
              const esValida = fila.valido;

              return (
                <React.Fragment key={indexOriginal}>
                  <tr
                    className={`border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${esValida
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-red-50 dark:bg-red-900/20'
                      } mb-36`}
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-400 text-xs">
                      {fila.fila}
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      <InputSearch
                        value={fila.producto}
                        onChange={(value, opcion) => handleCambio(indexOriginal, 'producto', value, opcion)}
                        onSearch={(query) => buscarProductos(query)}
                        placeholder="SKU, nombre o código..."
                        emptyText="No hay productos disponibles"
                        displayValue={fila.producto}
                        className="w-full"
                      />
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                      <input
                        type="number"
                        value={fila.cantidad}
                        onChange={(e) => handleCambio(indexOriginal, 'cantidad', e.target.value)}
                        onFocus={() => setFilaEditando(indexOriginal)}
                        onBlur={() => setFilaEditando(null)}
                        className={`w-full px-1 py-1 text-xs border rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${esValida
                          ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          : 'border-red-300 dark:border-red-600 focus:border-red-500'
                          }`}
                      />
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      <SearchSelect
                        value={fila.tipo_operacion}
                        options={opcionesTiposOperacion}
                        onChange={(value) => handleCambio(indexOriginal, 'tipo_operacion', value)}
                        placeholder="Selecciona operación..."
                        searchPlaceholder="Buscar operación..."
                        emptyText="No hay operaciones disponibles"
                        className="w-full"
                      />
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      {fila.tipo_operacion && obtenerOpcionesMotivo(fila.tipo_operacion).length > 0 ? (
                        <SearchSelect
                          value={fila.tipo_motivo}
                          options={obtenerOpcionesMotivoBusqueda(fila.tipo_operacion)}
                          onChange={(value) => handleCambio(indexOriginal, 'tipo_motivo', value)}
                          placeholder="Selecciona motivo..."
                          searchPlaceholder="Buscar motivo..."
                          emptyText="No hay opciones disponibles"
                          className="w-full"
                        />
                      ) : fila.tipo_operacion &&
                        (tiposOperacion.find(o => o.clave === fila.tipo_operacion)?.requiere_proveedor ||
                          tiposOperacion.find(o => o.clave === fila.tipo_operacion)?.requiere_cliente) ? (
                        <InputSearch
                          value={fila.tipo_motivo}
                          onChange={(value, opcion) => handleCambio(indexOriginal, 'tipo_motivo', value, opcion)}
                          onSearch={(query) => buscarProveedorCliente(query, fila.tipo_operacion)}
                          placeholder={
                            tiposOperacion.find(o => o.clave === fila.tipo_operacion)?.requiere_proveedor
                              ? "Buscar proveedor..."
                              : "Buscar cliente..."
                          }
                          emptyText={
                            tiposOperacion.find(o => o.clave === fila.tipo_operacion)?.requiere_proveedor
                              ? "No hay proveedores disponibles"
                              : "No hay clientes disponibles"
                          }
                          className="w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value={fila.tipo_motivo}
                          onChange={(e) => handleCambio(indexOriginal, 'tipo_motivo', e.target.value)}
                          onFocus={() => setFilaEditando(indexOriginal)}
                          onBlur={() => setFilaEditando(null)}
                          placeholder="Motivo o detalle"
                          className={`w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${esValida
                            ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                            : 'border-red-300 dark:border-red-600 focus:border-red-500'
                            }`}
                        />
                      )}
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      <SearchSelect
                        value={fila.almacen}
                        options={opcionesAlmacenes}
                        onChange={(value) => handleCambio(indexOriginal, 'almacen', value)}
                        placeholder="Selecciona almacén..."
                        searchPlaceholder="Buscar almacén..."
                        emptyText="No hay almacenes disponibles"
                        className="w-full"
                      />
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      <input
                        type="text"
                        value={fila.observacion}
                        onChange={(e) => handleCambio(indexOriginal, 'observacion', e.target.value)}
                        onFocus={() => setFilaEditando(indexOriginal)}
                        onBlur={() => setFilaEditando(null)}
                        maxLength={30}
                        className="w-full px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {fila.observacion.length}/30
                      </div>
                    </td>

                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                      <div className="flex gap-1 justify-center items-center flex-wrap">
                        {esValida ? (
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <button
                          onClick={() => handleDuplicarFila(indexOriginal)}
                          title="Duplicar fila"
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEliminarFila(indexOriginal)}
                          title="Eliminar fila"
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Mostrar errores debajo de la fila */}
                  {!esValida && (
                    <tr className="bg-red-50 dark:bg-red-900/20 border-b border-gray-300 dark:border-gray-600">
                      <td colSpan={9} className="px-2 py-1">
                        <div className="space-y-0.5">
                          {fila.errores.map((error, i) => (
                            <div key={i} className="text-red-700 dark:text-red-300 text-xs flex items-start">
                              <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Mostrar información de stock */}
                  {esValida && obtenerInfoStock(fila) && (
                    <tr className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-300 dark:border-gray-600">
                      <td colSpan={9} className="px-2 py-1">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">📦 Stock actual:</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              {obtenerInfoStock(fila)?.stockActual}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">➕ Cantidad:</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              {obtenerInfoStock(fila)?.cantidad}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">📊 Stock resultante:</span>
                            <span className={`font-semibold ${
                              obtenerInfoStock(fila)!.stockResultante < 0
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-green-700 dark:text-green-300'
                            }`}>
                              {obtenerInfoStock(fila)?.stockResultante}
                            </span>
                          </div>
                          {obtenerInfoStock(fila)?.cantidadAnterior > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-400">📈 Cantidad anterior:</span>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">
                                {obtenerInfoStock(fila)?.cantidadAnterior}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {filas.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay filas para mostrar
        </div>
      )}

      {/* MODAL PARA AGREGAR NUEVA FILA */}
      {mostrarModalNuevaFila && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Agregar nueva fila
              </h3>
              <button
                onClick={() => setMostrarModalNuevaFila(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Producto *
                </label>
                <InputSearch
                  value={nuevaFila.producto}
                  onChange={(value) => setNuevaFila({ ...nuevaFila, producto: value })}
                  onSearch={(query) => buscarProductos(query)}
                  placeholder="Buscar producto..."
                  emptyText="No hay productos disponibles"
                  className="w-full"
                />
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  value={nuevaFila.cantidad}
                  onChange={(e) => setNuevaFila({ ...nuevaFila, cantidad: e.target.value })}
                  placeholder="0"
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo de Operación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Operación *
                </label>
                <SearchSelect
                  value={nuevaFila.tipo_operacion}
                  options={opcionesTiposOperacion}
                  onChange={(value) => setNuevaFila({ ...nuevaFila, tipo_operacion: value, tipo_motivo: '' })}
                  placeholder="Selecciona operación..."
                  searchPlaceholder="Buscar operación..."
                  emptyText="No hay operaciones disponibles"
                  className="w-full"
                />
              </div>

              {/* Tipo Motivo */}
              {nuevaFila.tipo_operacion && obtenerOpcionesMotivo(nuevaFila.tipo_operacion).length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo Motivo *
                  </label>
                  <SearchSelect
                    value={nuevaFila.tipo_motivo}
                    options={obtenerOpcionesMotivoBusqueda(nuevaFila.tipo_operacion)}
                    onChange={(value) => setNuevaFila({ ...nuevaFila, tipo_motivo: value })}
                    placeholder="Selecciona motivo..."
                    searchPlaceholder="Buscar motivo..."
                    emptyText="No hay opciones disponibles"
                    className="w-full"
                  />
                </div>
              ) : nuevaFila.tipo_operacion &&
                (tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion)?.requiere_proveedor ||
                  tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion)?.requiere_cliente) ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion)?.requiere_proveedor
                      ? 'Proveedor'
                      : 'Cliente'} *
                  </label>
                  <InputSearch
                    value={nuevaFila.tipo_motivo}
                    onChange={(value) => setNuevaFila({ ...nuevaFila, tipo_motivo: value })}
                    onSearch={(query) => buscarProveedorCliente(query, nuevaFila.tipo_operacion)}
                    placeholder={
                      tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion)?.requiere_proveedor
                        ? 'Buscar proveedor...'
                        : 'Buscar cliente...'
                    }
                    emptyText={
                      tiposOperacion.find(o => o.clave === nuevaFila.tipo_operacion)?.requiere_proveedor
                        ? 'No hay proveedores disponibles'
                        : 'No hay clientes disponibles'
                    }
                    className="w-full"
                  />
                </div>
              ) : null}

              {/* Almacén */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Almacén *
                </label>
                <SearchSelect
                  value={nuevaFila.almacen}
                  options={opcionesAlmacenes}
                  onChange={(value) => setNuevaFila({ ...nuevaFila, almacen: value })}
                  placeholder="Selecciona almacén..."
                  searchPlaceholder="Buscar almacén..."
                  emptyText="No hay almacenes disponibles"
                  className="w-full"
                />
              </div>

              {/* Observación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observación
                </label>
                <input
                  type="text"
                  value={nuevaFila.observacion}
                  onChange={(e) => setNuevaFila({ ...nuevaFila, observacion: e.target.value.slice(0, 30) })}
                  maxLength={30}
                  placeholder="Detalles adicionales..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {nuevaFila.observacion.length}/30
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setMostrarModalNuevaFila(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-md text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarFilaModal}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Agregar fila
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
