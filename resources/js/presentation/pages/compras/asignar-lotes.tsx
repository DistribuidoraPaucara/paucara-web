import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from '@/infrastructure/routing/routes';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useState, useCallback } from 'react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { AlertCircle, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/presentation/components/ui/alert';

interface PageProps extends InertiaPageProps {
  compra: {
    id: number;
    numero: string;
    fecha: string;
    proveedor_nombre: string;
    almacen_nombre: string;
    almacen_id: number;
    estado_nombre: string;
  };
  moneda: {
    id: number;
    nombre: string;
    simbolo: string;
  };
  detalles: Array<{
    id: number;
    producto_id: number;
    producto_nombre: string;
    producto_sku: string;
    cantidad_original: number;
    cantidad_actual: number;
    lote_actual: string | null;
    fecha_vencimiento_actual: string | null;
    precio_unitario: number;
    subtotal: number;
    stock_total: number;
    stock_disponible: number;
    stock_reservado: number;
    stock_registrados: Array<{
      id: number;
      cantidad: number;
      cantidad_disponible: number;
      cantidad_reservada: number;
      lote: string | null;
      fecha_vencimiento: string | null;
    }>;
    movimientos: Array<{
      id: number;
      fecha: string;
      tipo: string;
      cantidad: number;
      cantidad_anterior: number;
      cantidad_posterior: number;
      lote: string;
      descripcion: string;
      referencia: string;
    }>;
  }>;
}

interface StockAnteriorActualizar {
  stock_id: number;
  cantidad?: number;
  nuevo_lote: string;
  nueva_fecha_vencimiento: string;
}

interface StockNuevo {
  cantidad: number;
  lote: string;
  fecha_vencimiento: string;
}

interface Transferencia {
  origen_stock_id: number;
  destino_stock_id: number;
  cantidad: number;
}

interface DetalleDistribuido {
  detalle_id: number;
  stock_anterior_actualizar: StockAnteriorActualizar[];
  stock_nuevo: StockNuevo[];
  transferencias?: Transferencia[];
}

export default function AsignarLotes() {
  const { props } = usePage<PageProps>();
  const { compra, detalles, moneda } = props;

  // ✅ DEBUG: Mostrar datos que llegan del backend
  console.log('=== DATOS DEL BACKEND ===');
  console.log('Compra:', compra);
  console.log('Moneda:', moneda);
  console.log('Detalles con movimientos:', detalles);
  detalles.forEach((detalle) => {
    console.log(`\n📦 Producto: ${detalle.producto_nombre}`);
    console.log('  Stock registrados:', detalle.stock_registrados);
    console.log('  Movimientos:', detalle.movimientos);
  });

  // Guardar valores originales para detectar cambios
  const valoresOriginales = useCallback(() =>
    detalles.reduce((acc, detalle) => {
      acc[detalle.id] = (detalle.stock_registrados || []).reduce((inner, stock) => {
        inner[stock.id] = {
          cantidad: stock.cantidad,
          nuevo_lote: stock.lote || '',
          nueva_fecha: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
        };
        return inner;
      }, {} as Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>);
      return acc;
    }, {} as Record<number, Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>>)
  , [detalles]);

  // Estado para stock anterior (actualizar)
  const [stockAnteriorActualizar, setStockAnteriorActualizar] = useState<Record<number, Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>>>(
    valoresOriginales()
  );

  // Crear referencia de valores originales para comparación
  const valoresOriginalesRef = useCallback(() => valoresOriginales(), [valoresOriginales]);

  // Estado para stock nuevo (crear)
  const [stockNuevo, setStockNuevo] = useState<Record<number, StockNuevo[]>>(
    detalles.reduce((acc, detalle) => {
      acc[detalle.id] = [
        {
          cantidad: 0,
          lote: '',
          fecha_vencimiento: '',
        },
      ];
      return acc;
    }, {} as Record<number, StockNuevo[]>)
  );

  // Estado para controlar el historial desplegable por detalle
  const [movimientosExpandidos, setMovimientosExpandidos] = useState<Record<number, boolean>>(
    detalles.reduce((acc, detalle) => {
      acc[detalle.id] = false;
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Estado para controlar si la información del lote está expandida
  const [lotesExpandidos, setLotesExpandidos] = useState<Record<string, boolean>>(
    detalles.reduce((acc, detalle) => {
      const loteKeys = detalle.stock_registrados.map(s => `${detalle.id}-${s.id}`);
      loteKeys.forEach(key => {
        acc[key] = false;
      });
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Estado para mostrar modal de confirmación
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [resumenCambios, setResumenCambios] = useState<any>(null);

  // Estado para transferencias entre lotes
  const [transferencias, setTransferencias] = useState<Record<number, Transferencia[]>>(
    detalles.reduce((acc, detalle) => {
      acc[detalle.id] = [];
      return acc;
    }, {} as Record<number, Transferencia[]>)
  );

  // Estado para controlar dropdown de transferencia abierto
  const [dropdownTransferencia, setDropdownTransferencia] = useState<string | null>(null);

  const { post, processing } = useForm();

  // Agregar un nuevo stock a crear
  const agregarStockNuevo = useCallback(
    (detalleId: number) => {
      setStockNuevo((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        nuevas.push({
          cantidad: 0,
          lote: '',
          fecha_vencimiento: '',
        });
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Eliminar un stock nuevo
  const eliminarStockNuevo = useCallback(
    (detalleId: number, index: number) => {
      setStockNuevo((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        if (nuevas.length > 1) {
          nuevas.splice(index, 1);
        }
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Actualizar stock nuevo
  const actualizarStockNuevo = useCallback(
    (detalleId: number, index: number, field: keyof StockNuevo, value: string | number) => {
      setStockNuevo((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        nuevas[index] = { ...nuevas[index], [field]: value };
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Actualizar stock anterior
  const actualizarStockAnterior = useCallback(
    (detalleId: number, stockId: number, field: 'nuevo_lote' | 'nueva_fecha', value: string) => {
      setStockAnteriorActualizar((prev) => {
        const updated = { ...prev };
        if (!updated[detalleId]) updated[detalleId] = {};
        updated[detalleId][stockId] = {
          ...updated[detalleId][stockId],
          [field]: value,
        };
        return updated;
      });
    },
    []
  );

  // Agregar una transferencia entre lotes
  const agregarTransferencia = useCallback(
    (detalleId: number, origenStockId: number) => {
      setTransferencias((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        nuevas.push({
          origen_stock_id: origenStockId,
          destino_stock_id: 0, // El usuario deberá seleccionar
          cantidad: 0,
        });
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Eliminar una transferencia
  const eliminarTransferencia = useCallback(
    (detalleId: number, index: number) => {
      setTransferencias((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        nuevas.splice(index, 1);
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Actualizar transferencia
  const actualizarTransferencia = useCallback(
    (detalleId: number, index: number, field: keyof Transferencia, value: number) => {
      setTransferencias((prev) => {
        const nuevas = [...(prev[detalleId] || [])];
        nuevas[index] = { ...nuevas[index], [field]: value };
        return { ...prev, [detalleId]: nuevas };
      });
    },
    []
  );

  // Validar que haya al menos un lote/fecha asignado
  const validarAsignaciones = (): boolean => {
    let tieneAlgunCambio = false;

    for (const detalle of detalles) {
      const anteriores = stockAnteriorActualizar[detalle.id] || {};
      const nuevos = stockNuevo[detalle.id] || [];

      // Verificar si este detalle tiene cambios
      const tieneAlgoParaActualizar = Object.values(anteriores).some(stock => stock.nuevo_lote || stock.nueva_fecha);
      const tieneAlgoParaCrear = nuevos.some(stock => stock.cantidad > 0 || stock.lote || stock.fecha_vencimiento);

      if (tieneAlgoParaActualizar || tieneAlgoParaCrear) {
        tieneAlgunCambio = true;

        // Validar que los nuevos stocks tengan al menos lote o fecha (incluso si cantidad=0)
        for (const nuevoStock of nuevos) {
          if ((nuevoStock.cantidad > 0 || nuevoStock.lote || nuevoStock.fecha_vencimiento) && !nuevoStock.lote && !nuevoStock.fecha_vencimiento) {
            NotificationService.error(
              `Todo nuevo stock debe tener al menos lote o fecha de vencimiento`
            );
            return false;
          }
        }
      }
    }

    // Verificar que al menos haya UN cambio
    if (!tieneAlgunCambio) {
      NotificationService.error(
        'Debe hacer al menos un cambio a algún lote'
      );
      return false;
    }

    return true;
  };

  // Mostrar resumen de cambios
  const mostrarResumenCambios = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarAsignaciones()) {
      return;
    }

    // Construir resumen
    const originales = valoresOriginalesRef();
    const resumen = detalles
      .map((detalle) => {
        const anteriores = stockAnteriorActualizar[detalle.id] || {};
        const nuevos = stockNuevo[detalle.id] || [];
        const trans = transferencias[detalle.id] || [];
        const originalesDetalle = originales[detalle.id] || {};

        const actualizacionesConCambios = Object.entries(anteriores)
          .filter(([stockId, data]) => {
            const original = originalesDetalle[parseInt(stockId)];
            // Solo mostrar si cambió respecto al original
            if (!original) return false;
            return data.nuevo_lote !== original.nuevo_lote || data.nueva_fecha !== original.nueva_fecha;
          })
          .map(([stockId, data]) => ({
            stockId: parseInt(stockId),
            cantidad: data.cantidad,
            lote: data.nuevo_lote,
            fecha: data.nueva_fecha,
          }));

        const creaciones = nuevos.filter(s => s.cantidad > 0 || s.lote || s.fecha_vencimiento);
        const transferenciasValidas = trans.filter(t => t.cantidad > 0 && t.destino_stock_id > 0);

        if (actualizacionesConCambios.length === 0 && creaciones.length === 0 && transferenciasValidas.length === 0) return null;

        return {
          detalleId: detalle.id,
          productoNombre: detalle.producto_nombre,
          actualizaciones: actualizacionesConCambios,
          creaciones: creaciones.map((s, idx) => ({
            index: idx,
            cantidad: s.cantidad,
            lote: s.lote,
            fecha: s.fecha_vencimiento,
          })),
          transferencias: transferenciasValidas.map((t) => {
            const origenStock = detalle.stock_registrados.find(s => s.id === t.origen_stock_id);
            const destinoStock = detalle.stock_registrados.find(s => s.id === t.destino_stock_id);
            return {
              origen_stock_id: t.origen_stock_id,
              origen_lote: origenStock?.lote || 'Sin lote',
              destino_stock_id: t.destino_stock_id,
              destino_lote: destinoStock?.lote || 'Sin lote',
              cantidad: t.cantidad,
            };
          }),
        };
      })
      .filter(Boolean);

    setResumenCambios(resumen);
    setMostrarResumen(true);
  };

  // Enviar datos después de confirmación
  const confirmarEnvio = () => {
    const detallesPayload: DetalleDistribuido[] = detalles
      .map((detalle) => {
        const anteriores = stockAnteriorActualizar[detalle.id] || {};
        const nuevos = stockNuevo[detalle.id] || [];
        const trans = transferencias[detalle.id] || [];
        const stocksNuevosFiltrados = nuevos.filter(s => s.cantidad > 0 || s.lote || s.fecha_vencimiento);
        const transferenciasValidas = trans.filter(t => t.cantidad > 0 && t.destino_stock_id > 0);

        // Si hay nuevos stocks, buscar el stock sin lote/sin fecha y restar automáticamente
        let stocksActualizarFiltrados = Object.entries(anteriores)
          .filter(([, data]) => data.nuevo_lote || data.nueva_fecha)
          .map(([stockId, data]) => ({
            stock_id: parseInt(stockId),
            nuevo_lote: data.nuevo_lote,
            nueva_fecha_vencimiento: data.nueva_fecha,
          }));

        // Si hay nuevos stocks creados, buscar el stock sin lote y restarle esas unidades
        if (stocksNuevosFiltrados.length > 0) {
          const totalNuevasUnidades = stocksNuevosFiltrados.reduce((sum, s) => sum + s.cantidad, 0);

          // Buscar el stock sin lote/sin fecha
          const stockSinLoteEntry = Object.entries(anteriores).find(
            ([_, data]) => !data.nuevo_lote && !data.nueva_fecha
          );

          if (stockSinLoteEntry) {
            const [stockIdStr, stockData] = stockSinLoteEntry;
            const stockSinLoteIdNum = parseInt(stockIdStr);

            // Buscar si ya está en la lista de actualización
            const yaExiste = stocksActualizarFiltrados.find(s => s.stock_id === stockSinLoteIdNum);

            if (!yaExiste) {
              // Calcular nueva cantidad (restando las unidades del nuevo stock)
              const nuevaCantidad = Math.max(0, stockData.cantidad - totalNuevasUnidades);

              // Agregar el stock sin lote con cantidad reducida
              stocksActualizarFiltrados.push({
                stock_id: stockSinLoteIdNum,
                cantidad: nuevaCantidad,
                nuevo_lote: '',
                nueva_fecha_vencimiento: '',
              });
            }
          }
        }

        // Solo incluir detalles que tengan cambios
        if (stocksActualizarFiltrados.length === 0 && stocksNuevosFiltrados.length === 0 && transferenciasValidas.length === 0) {
          return null;
        }

        const payload: DetalleDistribuido = {
          detalle_id: detalle.id,
          stock_anterior_actualizar: stocksActualizarFiltrados,
          stock_nuevo: stocksNuevosFiltrados,
        };

        // Agregar transferencias si las hay
        if (transferenciasValidas.length > 0) {
          payload.transferencias = transferenciasValidas;
        }

        return payload;
      })
      .filter((detalle): detalle is DetalleDistribuido => detalle !== null);

    const payloadToSend = { detalles: detallesPayload };

    console.log('%c📤 PAYLOAD QUE SE ENVÍA AL BACKEND', 'font-size: 16px; font-weight: bold; color: #2563eb;');
    console.log('%cCompra ID: ' + compra.id, 'font-size: 12px;');
    console.log('%cTotal detalles: ' + detallesPayload.length, 'font-size: 12px;');
    console.log('');

    detallesPayload.forEach((detalle, idx) => {
      const productoInfo = detalles.find(d => d.id === detalle.detalle_id);
      console.log(`%c[DETALLE ${idx + 1}] Producto: ${productoInfo?.producto_nombre} (ID: ${productoInfo?.producto_id}, SKU: ${productoInfo?.producto_sku})`, 'font-size: 12px; font-weight: bold; color: #7c3aed;');

      if (detalle.stock_anterior_actualizar.length > 0) {
        console.log('%c  ✏️ STOCKS ANTERIORES A ACTUALIZAR:', 'color: #0891b2; font-weight: bold;');
        detalle.stock_anterior_actualizar.forEach(stock => {
          console.log(`    - Stock ID: ${stock.stock_id} → Nuevo Lote: "${stock.nuevo_lote || 'sin cambio'}" | Nueva Fecha: "${stock.nueva_fecha_vencimiento || 'sin cambio'}"`);
        });
      }

      if (detalle.stock_nuevo.length > 0) {
        console.log('%c  ✨ STOCKS NUEVOS A CREAR:', 'color: #059669; font-weight: bold;');
        detalle.stock_nuevo.forEach((stock, sIdx) => {
          console.log(`    - Stock Nuevo ${sIdx + 1}: Cantidad=${stock.cantidad} | Lote="${stock.lote || 'sin lote'}" | Fecha="${stock.fecha_vencimiento || 'sin fecha'}"`);
        });
      }
      console.log('');
    });

    console.log('%cJSON COMPLETO:', 'font-size: 12px; font-weight: bold; color: #dc2626;');
    console.log(JSON.stringify(payloadToSend, null, 2));

    setMostrarResumen(false);

    const url = route('compras.guardar-lotes', compra.id);
    console.log('⏳ Iniciando fetch a:', url);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
      },
      body: JSON.stringify(payloadToSend),
    })
      .then(response => {
        console.log('📡 Status de respuesta:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('✅ RESPUESTA DEL BACKEND (ÉXITO):', data);
        // Limpiar loading y mostrar éxito
        NotificationService.success('Lotes asignados exitosamente');
        // Redirigir inmediatamente
        router.visit(route('compras.show', compra.id));
      })
      .catch(error => {
        console.error('❌ ERROR EN LA SOLICITUD:', error);
        // Limpiar loading antes de mostrar error
        NotificationService.error('Error al asignar lotes: ' + error.message);
      });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Compras', href: '/compras' },
        { title: compra.numero, href: `/compras/${compra.id}` },
        { title: 'Asignar Lotes', href: '#' },
      ]}
    >
      <Head title="Asignar Lotes y Fechas de Vencimiento" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Asignar Lotes y Fechas de Vencimiento
          </h1>
          <div className="flex gap-3">
            <Link
              href={`/compras/${compra.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancelar
            </Link>
            <button
              onClick={(e) => mostrarResumenCambios(e as any)}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Guardando...' : 'Guardar Asignaciones'}
            </button>
          </div>
        </div>

        {/* Información de la Compra */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Compra</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">#{compra.numero} | ID: #{compra.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(compra.fecha).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proveedor</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.proveedor_nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Almacén</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.almacen_nombre}</p>
            </div>
          </div>
        </div>

        {/* Alert de Información */}
        {/* <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Asignación de Lotes</AlertTitle>
          <AlertDescription>
            Asigna los lotes y fechas de vencimiento a los productos de esta compra. Puedes distribuir una cantidad
            en múltiples lotes si es necesario. La suma de cantidades debe ser igual a la cantidad original.
          </AlertDescription>
        </Alert> */}

        {/* Modal de Resumen */}
        {mostrarResumen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Resumen de Cambios</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Revisa los cambios antes de confirmar</p>
              </div>

              <div className="p-6 space-y-6">
                {resumenCambios?.map((item: any) => (
                  <div key={item.detalleId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                      📦 {item.productoNombre} | {item.productoCodigo}
                    </h3>

                    {/* Actualizaciones */}
                    {item.actualizaciones.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                          ✏️ Stock Anterior - Actualizar ({item.actualizaciones.length})
                        </p>
                        <div className="space-y-2 bg-green-50 dark:bg-green-900/20 p-3 rounded">
                          {item.actualizaciones.map((act: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-mono">Stock #{act.stockId}</span>
                              {act.cantidad !== undefined && <span> → Cantidad: {act.cantidad}</span>}
                              {act.lote && <span> → Lote: {act.lote}</span>}
                              {act.fecha && <span> → Fecha: {act.fecha}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Creaciones */}
                    {item.creaciones.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                          ✨ Stock Nuevo - Crear ({item.creaciones.length})
                        </p>
                        <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                          {item.creaciones.map((nuevo: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">Nuevo Stock #{idx + 1}</span>
                              <span> → Cantidad: {nuevo.cantidad}</span>
                              {nuevo.lote && <span> → Lote: {nuevo.lote}</span>}
                              {nuevo.fecha && <span> → Fecha: {nuevo.fecha}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transferencias */}
                    {item.transferencias && item.transferencias.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          🔄 Transferencias entre Lotes ({item.transferencias.length})
                        </p>
                        <div className="space-y-2 bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                          {item.transferencias.map((trans: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">Transferencia #{idx + 1}</span>
                              <span> → De: {trans.origen_lote}</span>
                              <span> → A: {trans.destino_lote}</span>
                              <span> → Cantidad: {trans.cantidad}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarResumen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={confirmarEnvio}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Guardando...' : 'Confirmar y Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mostrarResumenCambios} className="space-y-6">
          {detalles.map((detalle) => (
            <div key={detalle.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              {/* Header del Producto */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {detalle.producto_nombre} | SKU: {detalle.producto_sku} | ID: {detalle.producto_id}
                </h3>
                {/* <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><span className="font-medium">ID:</span> {detalle.producto_id}</p>
                  <p><span className="font-medium">SKU:</span> {detalle.producto_sku}</p>
                </div> */}

                {/* Información de la Compra */}
                {/* <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Cantidad en Compra</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{detalle.cantidad_original}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Precio Unitario</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {moneda.simbolo} {detalle.precio_unitario.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{moneda.simbolo} {detalle.subtotal.toFixed(2)}</p>
                  </div>
                </div> */}

                {/* ✅ NUEVO 2026-05-19: Historial de Movimientos Desplegable */}
                {detalle.movimientos && detalle.movimientos.length > 0 && (() => {
                  const entradas = detalle.movimientos.filter(m => m.tipo.includes('ENTRADA')).reduce((sum, m) => sum + m.cantidad, 0);
                  const salidas = detalle.movimientos.filter(m => m.tipo.includes('SALIDA')).reduce((sum, m) => sum + Math.abs(m.cantidad), 0);
                  const isExpanded = movimientosExpandidos[detalle.id] || false;

                  return (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      {/* Header Desplegable */}
                      <button
                        type="button"
                        onClick={() => setMovimientosExpandidos(prev => ({ ...prev, [detalle.id]: !prev[detalle.id] }))}
                        className="w-full flex items-center justify-between p-3 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition rounded-t-lg"
                      >
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">📋 HISTORIAL DE MOVIMIENTOS</p>
                          <span className="text-xs text-amber-700 dark:text-amber-300">({detalle.movimientos.length} registros)</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                        )}
                      </button>

                      {/* Resumen */}
                      <div className="px-3 pb-3 border-t border-amber-200 dark:border-amber-800">
                        <div className="grid grid-cols-4 gap-6 pt-3">
                          <div className="text-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <p className="text-xs text-green-700 dark:text-green-300">Cantidad Comprada</p>
                            <p className="text-sm font-bold text-green-900 dark:text-green-100">{detalle.cantidad_original}</p>
                          </div>
                          {/* <div className="text-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <p className="text-xs text-green-700 dark:text-green-300">Entradas</p>
                            <p className="text-sm font-bold text-green-900 dark:text-green-100">+{entradas.toFixed(2)}</p>
                          </div>
                          <div className="text-center p-2 bg-red-100 dark:bg-red-900/20 rounded">
                            <p className="text-xs text-red-700 dark:text-red-300">Salidas</p>
                            <p className="text-sm font-bold text-red-900 dark:text-red-100">-{salidas.toFixed(2)}</p>
                          </div> */}
                          <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                            <span className="text-xs text-blue-700 dark:text-blue-300">Stock Total:</span>
                            <p className="font-bold text-blue-900 dark:text-blue-100">{detalle.stock_total.toFixed(2)}</p>
                          </div>
                          <div className="text-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
                              <span className="text-xs text-green-700 dark:text-green-300">Disponible:</span>
                              <p className="font-bold text-green-900 dark:text-green-100">
                                {detalle.stock_disponible.toFixed(2)}
                              </p>
                            </div>
                          <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
                              <span className="text-xs text-orange-700 dark:text-orange-300">Reservado:</span>
                              <p className="font-bold text-orange-900 dark:text-orange-100">
                                {detalle.stock_reservado.toFixed(2)}
                              </p>
                            </div>
                        </div>
                      </div>

                      {/* Tabla Desplegable */}
                      {isExpanded && (
                        <div className="border-t border-amber-200 dark:border-amber-800 overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-amber-100 dark:bg-amber-900/40">
                              <tr>
                                <th className="px-2 py-1 text-left text-amber-900 dark:text-amber-100 font-semibold">Fecha</th>
                                <th className="px-2 py-1 text-left text-amber-900 dark:text-amber-100 font-semibold">Tipo</th>
                                <th className="px-2 py-1 text-left text-amber-900 dark:text-amber-100 font-semibold">Lote</th>
                                <th className="px-2 py-1 text-right text-amber-900 dark:text-amber-100 font-semibold">Cant. Anterior</th>
                                <th className="px-2 py-1 text-right text-amber-900 dark:text-amber-100 font-semibold">Cantidad</th>
                                <th className="px-2 py-1 text-right text-amber-900 dark:text-amber-100 font-semibold">Cant. Posterior</th>
                                <th className="px-2 py-1 text-left text-amber-900 dark:text-amber-100 font-semibold">Referencia</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-200 dark:divide-amber-800">
                              {detalle.movimientos.map((mov, idx) => (
                                <tr key={idx} className="hover:bg-amber-100/50 dark:hover:bg-amber-900/20">
                                  <td className="px-2 py-1 text-amber-900 dark:text-amber-100">
                                    {new Date(mov.fecha).toLocaleDateString()}
                                  </td>
                                  <td className="px-2 py-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${mov.tipo.includes('ENTRADA')
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                        : mov.tipo.includes('SALIDA')
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                      }`}>
                                      {mov.tipo}
                                    </span>
                                  </td>
                                  <td className="px-2 py-1 text-amber-700 dark:text-amber-300 font-mono font-semibold">
                                    {mov.lote}
                                  </td>
                                  <td className="px-2 py-1 text-right text-gray-600 dark:text-gray-400">
                                    {mov.cantidad_anterior.toFixed(2)}
                                  </td>
                                  <td className="px-2 py-1 text-right font-semibold text-amber-900 dark:text-amber-100">
                                    {mov.cantidad > 0 ? '+' : ''}{mov.cantidad.toFixed(2)}
                                  </td>
                                  <td className="px-2 py-1 text-right font-semibold text-blue-600 dark:text-blue-400">
                                    {mov.cantidad_posterior.toFixed(2)}
                                  </td>
                                  <td className="px-2 py-1 text-amber-600 dark:text-amber-400 text-xs font-mono">
                                    {mov.referencia}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Stock Anterior - Actualizar */}
              {detalle.stock_registrados && detalle.stock_registrados.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📦 STOCK ANTERIOR (ACTUALIZAR)</h4>
                  <div className="space-y-3">
                    {detalle.stock_registrados.map((stock) => (
                      <div key={stock.id} className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                        {/* Información del Lote - Collapsible */}
                        <div className="mb-3 pb-3 border-b border-green-200 dark:border-green-700">
                          <button
                            type="button"
                            onClick={() => {
                              const key = `${detalle.id}-${stock.id}`;
                              setLotesExpandidos(prev => ({
                                ...prev,
                                [key]: !prev[key]
                              }));
                            }}
                            className="w-full flex items-center justify-between hover:bg-green-100/50 dark:hover:bg-green-900/20 p-2 -mx-2 -my-2 rounded transition"
                          >
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              🏷️ Lote: <span className="text-green-700 dark:text-green-300 font-mono">{stock.lote || 'Sin lote'}</span>
                            </p>
                            {lotesExpandidos[`${detalle.id}-${stock.id}`] ? (
                              <ChevronUp className="w-4 h-4 text-green-700 dark:text-green-300" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-green-700 dark:text-green-300" />
                            )}
                          </button>

                          {lotesExpandidos[`${detalle.id}-${stock.id}`] && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <div className="bg-blue-100 dark:bg-blue-900/30 rounded px-2 py-1">
                                <p className="text-xs text-blue-700 dark:text-blue-300">Total</p>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{stock.cantidad}</p>
                              </div>
                              <div className="bg-green-100 dark:bg-green-900/30 rounded px-2 py-1">
                                <p className="text-xs text-green-700 dark:text-green-300">Disponible</p>
                                <p className="text-sm font-bold text-green-900 dark:text-green-100">{stock.cantidad_disponible}</p>
                              </div>
                              <div className="bg-orange-100 dark:bg-orange-900/30 rounded px-2 py-1">
                                <p className="text-xs text-orange-700 dark:text-orange-300">Reservado</p>
                                <p className="text-sm font-bold text-orange-900 dark:text-orange-100">{stock.cantidad_reservada}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {/* Cantidad - EDITABLE */}
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cantidad
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={stockAnteriorActualizar[detalle.id]?.[stock.id]?.cantidad ?? stock.cantidad}
                                onChange={(e) =>
                                  setStockAnteriorActualizar(prev => {
                                    const updated = { ...prev };
                                    if (!updated[detalle.id]) updated[detalle.id] = {};
                                    updated[detalle.id][stock.id] = {
                                      ...updated[detalle.id][stock.id],
                                      cantidad: parseFloat(e.target.value) || 0,
                                    };
                                    return updated;
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                              />
                            </div>
                            {/* Dropdown Transferir */}
                            <div className="relative">
                              <button
                                type="button"
                                title="Transferir cantidad a otro lote"
                                onClick={() => {
                                  const key = `${detalle.id}-${stock.id}`;
                                  setDropdownTransferencia(dropdownTransferencia === key ? null : key);
                                }}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-md transition flex items-center gap-1"
                              >
                                ⇄ <span className="text-xs">▼</span>
                              </button>
                              {dropdownTransferencia === `${detalle.id}-${stock.id}` && (
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                                {/* Opción: Crear nuevo lote */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cantidadATransferir = stockAnteriorActualizar[detalle.id]?.[stock.id]?.cantidad ?? stock.cantidad;
                                    if (cantidadATransferir > 0) {
                                      setStockNuevo(prev => {
                                        const nuevos = [...(prev[detalle.id] || [])];
                                        if (nuevos.length === 0 || (nuevos.length === 1 && nuevos[0].cantidad === 0)) {
                                          nuevos[0] = {
                                            cantidad: cantidadATransferir,
                                            lote: stock.lote || '',
                                            fecha_vencimiento: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
                                          };
                                        } else {
                                          nuevos.push({
                                            cantidad: cantidadATransferir,
                                            lote: stock.lote || '',
                                            fecha_vencimiento: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
                                          });
                                        }
                                        return { ...prev, [detalle.id]: nuevos };
                                      });
                                      setStockAnteriorActualizar(prev => {
                                        const updated = { ...prev };
                                        if (!updated[detalle.id]) updated[detalle.id] = {};
                                        updated[detalle.id][stock.id] = {
                                          ...updated[detalle.id][stock.id],
                                          cantidad: 0,
                                        };
                                        return updated;
                                      });
                                      setDropdownTransferencia(null);
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-b border-gray-200 dark:border-gray-600"
                                >
                                  ✨ Crear nuevo lote
                                </button>
                                {/* Opciones: Transferir a lotes existentes */}
                                {detalle.stock_registrados.filter(s => s.id !== stock.id).map(otroStock => (
                                  <button
                                    key={otroStock.id}
                                    type="button"
                                    onClick={() => {
                                      const cantidadATransferir = stockAnteriorActualizar[detalle.id]?.[stock.id]?.cantidad ?? stock.cantidad;
                                      if (cantidadATransferir > 0) {
                                        agregarTransferencia(detalle.id, stock.id);
                                        // Pre-establecer el destino
                                        setTransferencias(prev => {
                                          const nuevas = [...(prev[detalle.id] || [])];
                                          const ultima = nuevas[nuevas.length - 1];
                                          if (ultima) {
                                            ultima.destino_stock_id = otroStock.id;
                                            ultima.cantidad = cantidadATransferir;
                                          }
                                          return { ...prev, [detalle.id]: nuevas };
                                        });
                                        setDropdownTransferencia(null);
                                      }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                  >
                                    🔄 A: {otroStock.lote || 'Sin lote'} ({otroStock.cantidad} unidades)
                                  </button>
                                ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Lote */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Lote
                            </label>
                            <input
                              type="text"
                              value={stockAnteriorActualizar[detalle.id]?.[stock.id]?.nuevo_lote || stock.lote || ''}
                              onChange={(e) =>
                                actualizarStockAnterior(detalle.id, stock.id, 'nuevo_lote', e.target.value)
                              }
                              placeholder="Ej: LOTE-001"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                          </div>

                          {/* Fecha Vencimiento */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Fecha Vencimiento
                            </label>
                            <input
                              type="date"
                              value={
                                stockAnteriorActualizar[detalle.id]?.[stock.id]?.nueva_fecha ||
                                (stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '')
                              }
                              onChange={(e) =>
                                actualizarStockAnterior(detalle.id, stock.id, 'nueva_fecha', e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transferencias entre Lotes */}
              {(transferencias[detalle.id] || []).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">🔄 TRANSFERENCIAS ENTRE LOTES</h4>
                  <div className="space-y-3">
                    {(transferencias[detalle.id] || []).map((trans, index) => {
                      const origenStock = detalle.stock_registrados.find(s => s.id === trans.origen_stock_id);
                      const destinoStock = trans.destino_stock_id > 0 ? detalle.stock_registrados.find(s => s.id === trans.destino_stock_id) : null;
                      return (
                        <div key={index} className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                          <div className="grid grid-cols-4 gap-3 items-end">
                            {/* Stock Origen */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                De (Origen)
                              </label>
                              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md text-sm text-gray-900 dark:text-white font-medium">
                                {origenStock?.lote || 'Sin lote'} ({origenStock?.cantidad} unidades)
                              </div>
                            </div>

                            {/* Cantidad a Transferir */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cantidad
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max={origenStock?.cantidad || 0}
                                value={trans.cantidad}
                                onChange={(e) =>
                                  actualizarTransferencia(detalle.id, index, 'cantidad', parseFloat(e.target.value) || 0)
                                }
                                placeholder="0.00"
                                className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                              />
                            </div>

                            {/* Stock Destino */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                A (Destino)
                              </label>
                              <select
                                value={trans.destino_stock_id}
                                onChange={(e) =>
                                  actualizarTransferencia(detalle.id, index, 'destino_stock_id', parseInt(e.target.value))
                                }
                                className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              >
                                <option value={0}>-- Selecciona destino --</option>
                                {detalle.stock_registrados
                                  .filter(s => s.id !== trans.origen_stock_id)
                                  .map(stock => (
                                    <option key={stock.id} value={stock.id}>
                                      {stock.lote || 'Sin lote'} ({stock.cantidad} unidades)
                                    </option>
                                  ))}
                              </select>
                            </div>

                            {/* Eliminar */}
                            <button
                              type="button"
                              onClick={() => eliminarTransferencia(detalle.id, index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition h-10"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Nuevo - Crear */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">✨ STOCK NUEVO (CREAR)</h4>
                <div className="space-y-3">
                  {(stockNuevo[detalle.id] || []).map((nuevoStock, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                      <div className="flex gap-4 items-end">
                        {/* Cantidad */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cantidad
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={nuevoStock.cantidad}
                            onChange={(e) =>
                              actualizarStockNuevo(detalle.id, index, 'cantidad', parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>

                        {/* Lote */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Lote {index > 0 && `(${index + 1})`}
                          </label>
                          <input
                            type="text"
                            value={nuevoStock.lote}
                            onChange={(e) =>
                              actualizarStockNuevo(detalle.id, index, 'lote', e.target.value)
                            }
                            placeholder="Ej: LOTE-001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>

                        {/* Fecha de Vencimiento */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha Vencimiento
                          </label>
                          <input
                            type="date"
                            value={nuevoStock.fecha_vencimiento}
                            onChange={(e) =>
                              actualizarStockNuevo(detalle.id, index, 'fecha_vencimiento', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>

                        {/* Eliminar */}
                        {(stockNuevo[detalle.id] || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarStockNuevo(detalle.id, index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Botón Agregar Stock Nuevo */}
                  <button
                    type="button"
                    onClick={() => agregarStockNuevo(detalle.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar otro stock
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <Link
              href={`/compras/${compra.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Guardando...' : 'Guardar Asignaciones'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
