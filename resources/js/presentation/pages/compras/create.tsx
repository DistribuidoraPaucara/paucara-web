import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/application/hooks/use-auth';
import { Alert, AlertTitle, AlertDescription } from '@/presentation/components/ui/alert';
import { formatCurrency, formatCurrencyMinimalDecimals } from '@/lib/utils';
import { NotificationService } from '@/infrastructure/services/notification.service';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import InputSearch from '@/presentation/components/ui/input-search';
import ModalCrearProveedor from '@/presentation/components/ui/modal-crear-proveedor';
import ProductosTable from '@/presentation/components/ProductosTable';
import { useProveedorSearch } from '@/infrastructure/hooks/use-api-search';

// Importar tipos del domain
import type { Compra } from '@/domain/entities/compras';
import type { Proveedor } from '@/domain/entities/proveedores';
import type { Moneda } from '@/domain/entities/monedas';
import type { EstadoDocumento } from '@/domain/entities/estados-documento';
import type { Producto } from '@/domain/entities/productos';
import type { TipoPago } from '@/domain/entities/tipos-pago';

// Form types locales (específicos del formulario)
interface DetalleForm {
  id?: number | string;
  producto_id: number | string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  lote: string;
  fecha_vencimiento: string;
  precio_costo?: number; // ✅ NUEVO: Precio de costo registrado
  producto?: { // ✅ NUEVO: Información completa del producto
    id: number | string;
    nombre: string;
    codigo?: string;
    codigo_barras?: string;
    precio_compra?: number;
    precio_venta?: number;
    sku?: string; // ✅ NUEVO 2026-03-06
    marca?: { id?: number; nombre?: string } | null; // ✅ NUEVO 2026-03-06: Mantener como objeto
    unidad?: { id?: number; codigo?: string; nombre?: string } | null; // ✅ NUEVO 2026-03-06: Mantener como objeto
  };
}

interface CompraFormData {
  numero?: string; // Opcional, se genera automáticamente
  fecha: string;
  numero_factura: string;
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
  observaciones: string;
  proveedor_id: number | string;
  usuario_id: number | string;
  estado_documento_id: number | string;
  moneda_id: number | string;
  tipo_pago_id: number | string;
  almacen_id: number | string;
  detalles: DetalleForm[];
}

interface Almacen {
  id: number;
  nombre: string;
  activo: boolean;
}

// ✅ HELPER FUNCTION 2026-03-19: Convertir fechas ISO a formato yyyy-MM-dd para inputs type="date"
const normalizeDateForInput = (date: string | null | undefined): string => {
  if (!date) return '';
  // Si ya está en formato yyyy-MM-dd, devolverlo tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // Si es ISO completo o similar, tomar solo los primeros 10 caracteres
  return date.slice(0, 10);
};

// ✅ HELPER FUNCTION 2026-03-19: Formatear números sin ceros innecesarios
// 14.1000 → "14.1", 15.202 → "15.202", 10 → "10"
const formatearNumero = (valor: number | string | null | undefined): string | number => {
  if (valor === null || valor === undefined) return '';
  const str = String(valor);
  // Si no tiene punto, devolverlo tal cual
  if (!str.includes('.')) return str;
  // Remover ceros finales y el punto si es necesario
  return str.replace(/\.?0+$/, '');
};

// ✅ HELPER FUNCTION: Obtener fecha actual en zona horaria local (yyyy-MM-dd)
const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ✅ HELPER FUNCTION: Extraer mensajes de error de forma legible desde respuesta del backend
const extractErrorMessages = (
  errorsObj: Record<string, string | string[]> | any,
  defaultMessage: string = 'Error en la operación'
): string => {
  if (!errorsObj) return defaultMessage;

  // Si hay un error general
  if (errorsObj.error) {
    return typeof errorsObj.error === 'string'
      ? errorsObj.error
      : Array.isArray(errorsObj.error)
        ? errorsObj.error[0]
        : defaultMessage;
  }

  // Extraer primer error de cada campo de validación
  const errorMessages: string[] = [];

  for (const [field, message] of Object.entries(errorsObj)) {
    if (field === 'error' || field === 'message') continue;

    if (Array.isArray(message)) {
      // Si es array, tomar el primer mensaje
      if (message.length > 0) {
        errorMessages.push(message[0]);
      }
    } else if (typeof message === 'string') {
      // Si es string, agregarlo directo
      errorMessages.push(message);
    }
  }

  // Si hay mensajes, devolverlos separados por saltos de línea
  if (errorMessages.length > 0) {
    return errorMessages.join('\n');
  }

  return defaultMessage;
};

interface PageProps extends InertiaPageProps {
  compra?: Compra;
  proveedores: Proveedor[];
  monedas: Moneda[];
  estados: EstadoDocumento[];
  productos: Producto[];
  tipos_pago: TipoPago[];
  almacenes: Almacen[];
}

export default function CompraForm() {
  const { props } = usePage<PageProps>();
  const { user, can } = useAuth();

  // Función para obtener colores según estado
  const getEstadoColor = (estado: EstadoDocumento) => {
    switch (estado.nombre.toUpperCase()) {
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'APROBADO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'FACTURADO':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'CANCELADO':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ANULADO':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Debug temporal - verificar qué props están llegando
  console.log('Props recibidas:', {
    proveedores: props.proveedores?.length || 0,
    productos: props.productos?.length || 0,
    monedas: props.monedas?.length || 0,
    estados: props.estados?.length || 0,
    tipos_pago: props.tipos_pago?.length || 0,
    tipos_pago_data: props.tipos_pago,
  });

  const isEditing = Boolean(props.compra);
  const title = isEditing ? `Editar Compra: ${props.compra?.numero}` : 'Nueva Compra';

  // Hooks para búsqueda con autocompletado
  const proveedorSearch = useProveedorSearch();

  // Estados según el flujo documentado
  const estadoActual = props.compra?.estadoDocumento?.nombre;
  console.log('🔍 Estado actual:', {
    isEditing,
    estadoActual,
    estadoDocumento: props.compra?.estadoDocumento,
    estadoDocumentoId: props.compra?.estado_documento_id,
  });
  // ✅ FIX 2026-03-19: BORRADOR y APROBADO son editables | FACTURADO+: Solo lectura
  const editableBorrador = !estadoActual || estadoActual === 'BORRADOR' || estadoActual === 'APROBADO'; // BORRADOR y APROBADO pueden editar todo
  const editableAprobado = false; // Ya no se usa para deshabilitar campos
  const soloLectura = ['FACTURADO', 'CANCELADO', 'ANULADO'].includes(estadoActual || '');

  const { data, setData, post, put, processing, errors } = useForm<CompraFormData>({
    numero: props.compra?.numero || undefined, // Solo para edición
    // ✅ FIX 2026-04-16: Usar zona horaria local en lugar de UTC para obtener fecha actual
    fecha: props.compra?.fecha ? normalizeDateForInput(props.compra.fecha) : getTodayDateString(),
    numero_factura: props.compra?.numero_factura ?? '',
    subtotal: props.compra?.subtotal ?? 0,
    descuento: props.compra?.descuento ?? 0,
    impuesto: props.compra?.impuesto ?? 0,
    total: props.compra?.total ?? 0,
    observaciones: props.compra?.observaciones ?? '',
    proveedor_id: props.compra?.proveedor_id ?? '',
    usuario_id: props.compra?.usuario_id ?? user?.id ?? '',
    estado_documento_id: props.compra?.estado_documento_id ??
      props.estados?.find(e => e.nombre === 'Borrador')?.id ??
      props.estados?.[0]?.id ?? '',
    moneda_id: props.compra?.moneda_id ?? 1, // Por defecto moneda ID=1
    tipo_pago_id: props.compra?.tipo_pago_id ??
      props.tipos_pago?.find(t => t.codigo === 'EFECTIVO')?.id ??
      props.tipos_pago?.[0]?.id ?? '',
    almacen_id: props.compra?.almacen_id ??
      props.almacenes?.find(a => a.nombre === 'Almacen Principal')?.id ??  // ✅ NUEVO 2026-03-24: Buscar Almacen Principal por defecto
      props.almacenes?.find(a => a.activo)?.id ??
      props.almacenes?.[0]?.id ?? '',
    detalles: props.compra?.detalles?.map(d => ({
      id: d.id,
      producto_id: d.producto?.id ?? '',
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      descuento: 0,
      subtotal: d.subtotal,
      lote: d.lote ?? '',
      // ✅ FIX 2026-03-19: Normalizar fecha ISO a formato yyyy-MM-dd para inputs type="date"
      fecha_vencimiento: normalizeDateForInput(d.fecha_vencimiento),
      // ✅ NUEVO 2026-03-06: Incluir información del producto para que ProductosTable lo reconozca
      producto: d.producto ? {
        id: d.producto.id,
        nombre: d.producto.nombre,
        codigo: d.producto.codigo ?? undefined,
        codigo_barras: d.producto.codigo_barras ?? undefined,
        precio_venta: d.producto.precio_venta,
        precio_compra: d.producto.precio_compra,
        // ✅ NUEVO 2026-03-06: Agregar SKU, marca y unidad (como objetos si existen)
        sku: d.producto.sku ?? undefined,
        marca: d.producto.marca, // ← Mantener como objeto {id, nombre}
        unidad: d.producto.unidad, // ← Mantener como objeto {id, codigo, nombre}
        // ✅ NUEVO 2026-03-19: Incluir stock disponible desde backend
        stock_total: d.producto.stock_total ?? 0,
        stock_disponible: d.producto.stock_disponible ?? 0,
      } : undefined,
    })) ?? [],
  });

  // ✅ NUEVO 2026-03-06: Log para verificar estructura de detalles mapeados
  useEffect(() => {
    if (data.detalles && data.detalles.length > 0) {
      console.log('📋 Detalles mapeados en create.tsx:', JSON.stringify(data.detalles, null, 2));
      console.log('📦 Primer detalle - Objeto Producto:', data.detalles[0].producto);
    }
  }, [data.detalles]);

  const canCreate = can('compras.create');
  const canUpdate = can('compras.update');

  // Estados para autoguardado
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>('');
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para manejar el valor y display del InputSearch de proveedor
  const [proveedorValue, setProveedorValue] = useState<string | number | null>(data.proveedor_id);
  const [proveedorDisplay, setProveedorDisplay] = useState<string>('');

  // Estado para el modal de crear proveedor
  const [showCreateProveedorModal, setShowCreateProveedorModal] = useState(false);
  const [proveedorSearchQuery, setProveedorSearchQuery] = useState('');

  // Sincronizar el estado del InputSearch con los datos del formulario
  useEffect(() => {
    if (data.proveedor_id !== proveedorValue) {
      setProveedorValue(data.proveedor_id);
    }
  }, [data.proveedor_id]); // ✅ Solo depende de data.proveedor_id, no de proveedorValue

  // Cargar el nombre del proveedor cuando se edita una compra
  useEffect(() => {
    if (isEditing && data.proveedor_id) {
      const proveedor = props.proveedores?.find(p => p.id === Number(data.proveedor_id));
      if (proveedor) {
        setProveedorDisplay(proveedor.nombre);
        console.log('✅ Proveedor cargado:', proveedor.nombre);
      }
    }
  }, [isEditing, data.proveedor_id, props.proveedores]);

  // Función para manejar la creación de proveedor
  const handleCreateProveedor = (searchQuery: string) => {
    setProveedorSearchQuery(searchQuery);
    setShowCreateProveedorModal(true);
  };

  // Función para manejar cuando se crea un proveedor exitosamente
  const handleProveedorCreated = (proveedor: Proveedor) => {
    // Actualizar el valor del proveedor en el formulario
    setData('proveedor_id', proveedor.id);

    // Actualizar el estado del InputSearch
    setProveedorValue(proveedor.id);
    setProveedorDisplay(proveedor.nombre);

    // Crear una descripción completa del proveedor para mostrar en la notificación
    const descripcionProveedor = [
      proveedor.nombre,
      proveedor.razon_social && proveedor.razon_social !== proveedor.nombre ? `(${proveedor.razon_social})` : '',
      proveedor.nit ? `NIT: ${proveedor.nit}` : '',
      proveedor.telefono ? `Tel: ${proveedor.telefono}` : '',
      proveedor.email ? `Email: ${proveedor.email}` : ''
    ].filter(Boolean).join(' • ');

    // Mostrar notificación detallada del proveedor creado y seleccionado
    try {
      NotificationService.success(
        `✅ Proveedor creado y seleccionado: ${descripcionProveedor}`
      );
    } catch (error) {
      console.error('Error en NotificationService:', error);
      // Fallback: mostrar mensaje básico
      console.log(`✅ Proveedor creado y seleccionado: ${descripcionProveedor}`);
    }

    // Limpiar la query de búsqueda ya que ahora tenemos el proveedor seleccionado
    setProveedorSearchQuery('');
  };

  // Función para validar si la compra tiene contenido mínimo para autoguardar
  const hasMinimumContent = useCallback(() => {
    return (
      data.proveedor_id !== '' &&
      data.detalles.some(d => d.producto_id !== '' && d.cantidad > 0 && d.precio_unitario > 0)
    );
  }, [data.proveedor_id, data.detalles]);

  // Función de autoguardado
  const autoSave = useCallback(async () => {
    if (!hasMinimumContent() || !hasUnsavedChanges) {
      return;
    }

    try {
      const estadoPendienteId = props.estados?.find(e => e.nombre === 'Pendiente')?.id;

      // Preparar datos con tipos correctos para autoguardado
      const dataToSave = {
        numero: data.numero || undefined,
        fecha: data.fecha,
        numero_factura: data.numero_factura || '',
        subtotal: parseFloat(String(data.subtotal)),
        descuento: parseFloat(String(data.descuento || 0)),
        impuesto: parseFloat(String(data.impuesto || 0)),
        total: parseFloat(String(data.total)),
        observaciones: data.observaciones || '',
        proveedor_id: parseInt(String(data.proveedor_id)),
        usuario_id: parseInt(String(data.usuario_id)),
        estado_documento_id: !isEditing && estadoPendienteId
          ? parseInt(String(estadoPendienteId))
          : parseInt(String(data.estado_documento_id)),
        moneda_id: parseInt(String(data.moneda_id)),
        tipo_pago_id: data.tipo_pago_id ? parseInt(String(data.tipo_pago_id)) : null,
        almacen_id: data.almacen_id ? parseInt(String(data.almacen_id)) : null,
        // Filtrar detalles válidos y convertir tipos
        detalles: data.detalles
          .filter(d => d.producto_id !== '')
          .map(detalle => ({
            id: detalle.id || undefined,
            producto_id: parseInt(String(detalle.producto_id)),
            cantidad: parseInt(String(detalle.cantidad)),
            precio_unitario: parseFloat(String(detalle.precio_unitario)),
            descuento: parseFloat(String(detalle.descuento || 0)),
            subtotal: parseFloat(String(detalle.subtotal)),
            lote: detalle.lote || '',
            fecha_vencimiento: detalle.fecha_vencimiento || null,
          })),
        _autoguardado: true, // Flag para indicar que es autoguardado
      };

      const response = await fetch(isEditing ? `/compras/${props.compra?.id}` : '/compras', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();

        // Si era una nueva compra, mostrar notificación específica
        if (!isEditing && result.compra?.id) {
          NotificationService.info(`📄 Compra #${result.compra.numero} guardada automáticamente como pendiente`);
        } else {
          NotificationService.info('💾 Cambios guardados automáticamente');
        }

        setHasUnsavedChanges(false);
        setLastSavedData(JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error en autoguardado:', error);
      // No mostrar error al usuario para no interrumpir su trabajo
    }
  }, [data, hasMinimumContent, hasUnsavedChanges, isEditing, props.compra?.id, props.estados]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const currentData = JSON.stringify(data);
    if (currentData !== lastSavedData && lastSavedData !== '') {
      setHasUnsavedChanges(true);
    }
  }, [data, lastSavedData]);

  // Configurar autoguardado cada 30 segundos
  useEffect(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    autoSaveIntervalRef.current = setInterval(() => {
      autoSave();
    }, 30000); // 30 segundos

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [autoSave]);

  // Guardar antes de cerrar ventana/pestaña
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && hasMinimumContent()) {
        // Intentar guardar síncronamente
        autoSave();

        // Mostrar confirmación al usuario
        event.preventDefault();
        event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, hasMinimumContent, autoSave]);

  // Guardar cuando se pierde el foco de la ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChanges && hasMinimumContent()) {
        autoSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges, hasMinimumContent, autoSave]);

  // ✅ NUEVO: Guardar automáticamente en localStorage con debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isEditing) return; // No guardar si estamos editando una compra existente

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      try {
        const datosAGuardar = {
          data,
          proveedorValue,
          proveedorDisplay,
        };
        localStorage.setItem('compra-create-draft', JSON.stringify(datosAGuardar));
        console.log('✅ Compra guardada en localStorage');
      } catch (error) {
        console.error('❌ Error guardando compra en localStorage:', error);
      }
    }, 1000); // Debounce de 1 segundo

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, proveedorValue, proveedorDisplay, isEditing]);

  // ✅ NUEVO: Restaurar datos del localStorage al cargar
  useEffect(() => {
    if (isEditing) return; // No restaurar si estamos editando una compra existente

    const datosGuardados = localStorage.getItem('compra-create-draft');
    if (datosGuardados) {
      try {
        const parsed = JSON.parse(datosGuardados);
        console.log('📋 Restaurando compra desde localStorage:', parsed);

        // Restaurar datos del formulario
        if (parsed.data) {
          Object.keys(parsed.data).forEach((key: string) => {
            setData(key as any, parsed.data[key]);
          });
        }

        // Restaurar proveedor
        if (parsed.proveedorValue !== null) {
          setProveedorValue(parsed.proveedorValue);
        }
        if (parsed.proveedorDisplay) {
          setProveedorDisplay(parsed.proveedorDisplay);
        }

        NotificationService.success('✅ Compra restaurada desde borrador anterior');
      } catch (error) {
        console.error('❌ Error restaurando compra desde localStorage:', error);
      }
    }
  }, []); // Solo ejecutar al montar el componente

  // ✅ MEMOIZED: Convertir tipos de pago a opciones para SearchSelect
  const tipoPagoOptions: SelectOption[] = useMemo(() =>
    props.tipos_pago?.map(tipo => ({
      value: tipo.id,
      label: tipo.nombre,
      description: `Código: ${tipo.codigo}`,
    })) ?? [],
    [props.tipos_pago]
  );

  // ✅ MEMOIZED: Convertir almacenes a opciones para SearchSelect
  const almacenOptions: SelectOption[] = useMemo(() =>
    props.almacenes?.map(almacen => ({
      value: almacen.id,
      label: almacen.nombre,
      description: almacen.activo ? 'Activo' : 'Inactivo',
    })) ?? [],
    [props.almacenes]
  );

  // ✅ MEMOIZED: Convertir estados a opciones para SearchSelect (FIX 2026-03-19: No permitir aprobación duplicada)
  const estadoOptions: SelectOption[] = useMemo(() => {
    const getEstadosPermitidos = () => {
      if (!isEditing) {
        // Para nuevas compras, permitir BORRADOR o APROBADO
        return props.estados?.filter(estado =>
          ['Borrador', 'Aprobado'].includes(estado.nombre)
        ) ?? [];
      }

      const estadoActual = props.compra?.estadoDocumento?.nombre;
      console.log('🔍 getEstadosPermitidos - estadoActual:', estadoActual, 'all estados:', props.estados);

      // ✅ NUEVO 2026-03-19: Mapeo de transiciones de estado permitidas
      const transicionesPermitidas: Record<string, string[]> = {
        'Borrador': ['Borrador', 'Aprobado', 'Pendiente', 'Anulado'],
        'Pendiente': ['Pendiente', 'Aprobado', 'Anulado'],
        'Aprobado': ['Facturado', 'Anulado'], // ✅ NO permitir seleccionar 'Aprobado' de nuevo
        'Facturado': ['Cancelado', 'Anulado'],
        'Cancelado': [], // Solo lectura
        'Anulado': [], // Solo lectura
      };

      const estadosValidos = transicionesPermitidas[estadoActual] ?? [estadoActual];
      return props.estados?.filter(estado => estadosValidos.includes(estado.nombre)) ?? [];
    };

    const opciones = getEstadosPermitidos().map(estado => ({
      value: estado.id,
      label: estado.nombre,
    }));
    console.log('📦 estadoOptions final (sin duplicados):', opciones);
    return opciones;
  }, [isEditing, props.compra?.estadoDocumento?.nombre, props.estados]);

  // Mostrar mensajes flash del backend
  useEffect(() => {
    const flash = (props as InertiaPageProps & { flash?: { success?: string, error?: string } })?.flash;
    if (flash?.success) {
      NotificationService.success(flash.success);
    }
    if (flash?.error) {
      NotificationService.error(flash.error);
    }
  }, []); // ✅ Solo ejecutar una vez al montar el componente

  // Recalcular totales cuando cambian detalles
  useEffect(() => {
    const subtotal = data.detalles.reduce((acc, d: DetalleForm) => {
      const cantidad = Number(d.cantidad) || 0;
      const precio = Number(d.precio_unitario) || 0;
      const descuento = Number(d.descuento) || 0;
      return acc + (cantidad * precio) - descuento;
    }, 0);

    const impuesto = Number(data.impuesto) || 0;
    // Por ahora no se suma impuesto al total
    const total = subtotal - Number(data.descuento);

    setData(prev => ({ ...prev, subtotal, total }));
  }, [data.detalles, data.impuesto, data.descuento, setData]);

  const removeRow = (idx: number) => {
    setData('detalles', data.detalles.filter((_: DetalleForm, i: number) => i !== idx));
  };

  const updateDetalle = (idx: number, field: keyof DetalleForm, value: string | number) => {
    const newDetalles = [...data.detalles];
    newDetalles[idx] = { ...newDetalles[idx], [field]: value };

    // Recalcular subtotal para este detalle
    if (field === 'cantidad' || field === 'precio_unitario' || field === 'descuento') {
      const cantidad = field === 'cantidad' ? Number(value) : Number(newDetalles[idx].cantidad);
      const precio = field === 'precio_unitario' ? Number(value) : Number(newDetalles[idx].precio_unitario);
      const descuento = field === 'descuento' ? Number(value) : Number(newDetalles[idx].descuento);
      newDetalles[idx].subtotal = (cantidad * precio) - descuento;
    }

    setData('detalles', newDetalles);
  };

  // Detectar si los campos del header han cambiado
  // ✅ FIX 2026-03-19: Normalizar comparación de fechas
  const hasHeaderChanges = (): boolean => {
    if (!isEditing || !props.compra) return false;

    // ✅ Normalizar fecha para comparación (yyyy-MM-dd)
    const dataFechaNormalizada = normalizeDateForInput(data.fecha);
    const compraFechaNormalizada = normalizeDateForInput(props.compra.fecha);

    return (
      data.numero !== String(props.compra.numero) ||
      dataFechaNormalizada !== compraFechaNormalizada ||
      data.numero_factura !== (props.compra.numero_factura || '') ||
      parseFloat(String(data.subtotal)) !== parseFloat(String(props.compra.subtotal)) ||
      parseFloat(String(data.descuento || 0)) !== parseFloat(String(props.compra.descuento || 0)) ||
      parseFloat(String(data.impuesto || 0)) !== parseFloat(String(props.compra.impuesto || 0)) ||
      parseFloat(String(data.total)) !== parseFloat(String(props.compra.total)) ||
      data.observaciones !== (props.compra.observaciones || '') ||
      parseInt(String(data.proveedor_id)) !== props.compra.proveedor_id ||
      parseInt(String(data.usuario_id)) !== props.compra.usuario_id ||
      parseInt(String(data.moneda_id)) !== props.compra.moneda_id ||
      (data.tipo_pago_id ? parseInt(String(data.tipo_pago_id)) : null) !== (props.compra.tipo_pago_id || null) ||
      (data.almacen_id ? parseInt(String(data.almacen_id)) : null) !== (props.compra.almacen_id || null)
    );
  };

  // Detectar si los detalles han cambiado
  // ✅ FIX 2026-03-19: Comparar por ID, no por índice
  const hasDetallesChanges = (): boolean => {
    if (!isEditing || !props.compra || !props.compra.detalles) return false;

    const originalDetalles = props.compra.detalles;
    const currentDetalles = data.detalles.filter(d => d.producto_id !== '');

    // Comparar cantidad de detalles
    if (originalDetalles.length !== currentDetalles.length) {
      console.log('🔍 hasDetallesChanges - Cantidad diferente', {
        original: originalDetalles.length,
        current: currentDetalles.length,
      });
      return true;
    }

    // ✅ Comparar cada detalle por ID (no por índice)
    const originalMap = new Map(originalDetalles.map(d => [d.id, d]));
    const currentMap = new Map(currentDetalles.map(d => [d.id, d]));

    // Verificar si hay detalles nuevos (sin ID) o detalles eliminados
    const hasNewDetalles = currentDetalles.some(d => !d.id);
    const deletedIds = Array.from(originalMap.keys()).filter(id => !currentMap.has(id));

    if (hasNewDetalles || deletedIds.length > 0) {
      console.log('🔍 hasDetallesChanges - Detalles nuevos o eliminados', {
        hasNewDetalles,
        deletedIds,
      });
      return true;
    }

    // Comparar cambios en detalles existentes
    for (const [id, original] of originalMap) {
      const current = currentMap.get(id);

      if (!current ||
        parseInt(String(current.producto_id)) !== original.producto_id ||
        parseInt(String(current.cantidad)) !== original.cantidad ||
        parseFloat(String(current.precio_unitario)) !== parseFloat(String(original.precio_unitario)) ||
        parseFloat(String(current.descuento || 0)) !== parseFloat(String(original.descuento || 0))
      ) {
        console.log('🔍 hasDetallesChanges - Detalle modificado', {
          id,
          original: original,
          current: current,
        });
        return true;
      }
    }

    console.log('🔍 hasDetallesChanges - Sin cambios detectados');
    return false;
  };

  // ✨ NUEVO: Limpiar borrador de localStorage
  const clearDraft = async () => {
    try {
      const confirmed = await NotificationService.confirm(
        '¿Estás seguro de que quieres limpiar el borrador guardado?',
        {
          confirmText: 'Limpiar',
          cancelText: 'Cancelar'
        }
      );

      if (confirmed) {
        localStorage.removeItem('compra-create-draft');
        NotificationService.success('Borrador eliminado correctamente');
        console.log('✅ Borrador de compra eliminado');
      }
    } catch (err) {
      console.error('Error al limpiar el borrador:', err);
      NotificationService.error('Error al limpiar el borrador');
    }
  };

  const submit = (e: React.FormEvent) => {
    console.log('🔵 CompraForm::submit() - INICIADO');
    e.preventDefault();

    if (!canCreate && !isEditing) {
      console.warn('❌ CompraForm::submit() - Permisos insuficientes para crear');
      NotificationService.error('No tiene permisos para crear compras');
      return;
    }

    if (!canUpdate && isEditing) {
      console.warn('❌ CompraForm::submit() - Permisos insuficientes para editar');
      NotificationService.error('No tiene permisos para editar compras');
      return;
    }

    // Filtrar detalles válidos
    const detallesValidos = data.detalles.filter(d => d.producto_id !== '');

    // ✅ DEBUG: Mostrar cantidad en detallesValidos ANTES de transformar
    console.log('📦 CompraForm::submit() - detallesValidos ANTES de transformar', {
      totalDetalles: data.detalles.length,
      detallesValidos_count: detallesValidos.length,
      primero_detalle: detallesValidos[0] ? {
        producto_id: detallesValidos[0].producto_id,
        cantidad: detallesValidos[0].cantidad,
        cantidad_tipo: typeof detallesValidos[0].cantidad,
        precio_unitario: detallesValidos[0].precio_unitario,
        subtotal: detallesValidos[0].subtotal,
      } : null,
    });

    console.log('📦 CompraForm::submit() - Validación de detalles', {
      totalDetalles: data.detalles.length,
      detallesValidos: detallesValidos.length,
    });

    if (detallesValidos.length === 0) {
      console.warn('❌ CompraForm::submit() - Sin detalles válidos');
      NotificationService.error('Debe agregar al menos un producto');
      return;
    }

    console.log('✅ CompraForm::submit() - Todas las validaciones pasaron');

    // Detectar si estamos en Escenario 2: Solo cambio de estado (sin modificaciones en detalles/header)
    const esEscenarioEstadoOnly = isEditing && props.compra &&
      data.estado_documento_id !== String(props.compra.estado_documento_id) &&
      !hasHeaderChanges() &&
      !hasDetallesChanges();

    console.log('🔍 CompraForm::submit() - Detectando escenario', {
      isEditing,
      esEscenarioEstadoOnly,
      estadoAnterior: props.compra?.estado_documento_id,
      estadoNuevo: data.estado_documento_id,
      hasHeaderChanges: hasHeaderChanges(),
      hasDetallesChanges: hasDetallesChanges(),
    });

    // Mostrar modal de loading
    let loadingToast: string;

    // ✅ FIX CRÍTICA 2026-03-19: Transformar datos MANUALMENTE y usar router.put() directamente
    // (useForm().put() con transform no funciona en esta versión de Inertia.js)
    // ✅ NUEVO 2026-03-19: Recalcular subtotal basado en detalles para evitar inconsistencias
    const detallesTransformados = detallesValidos.map(detalle => {
      // ✅ NUEVO 2026-03-19: NO redondear - BD almacena hasta 10 decimales (decimal:18,10)
      const cantidad = parseInt(String(detalle.cantidad));
      const precioUnitario = parseFloat(String(detalle.precio_unitario));
      const descuento = parseFloat(String(detalle.descuento || 0));

      // ✅ RECALCULAR SUBTOTAL: cantidad × precio - descuento
      const subtotalCalculado = (cantidad * precioUnitario) - descuento;

      const detalleTransformado: any = {
        producto_id: parseInt(String(detalle.producto_id)),
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        descuento: descuento,
        subtotal: subtotalCalculado,
        lote: detalle.lote || '',
        fecha_vencimiento: detalle.fecha_vencimiento || null,
      };

      // ✅ Solo incluir id si existe (para detalles existentes)
      if (detalle.id) {
        detalleTransformado.id = detalle.id;
      }

      return detalleTransformado;
    });

    // Recalcular subtotal desde los detalles
    const subtotalCalculado = detallesTransformados.reduce(
      (sum, det) => sum + parseFloat(String(det.subtotal)),
      0
    );

    const transformedData: any = {
      numero: data.numero || undefined,
      fecha: data.fecha,
      numero_factura: data.numero_factura || '',
      subtotal: subtotalCalculado,
      descuento: parseFloat(String(data.descuento || 0)),
      impuesto: parseFloat(String(data.impuesto || 0)),
      total: parseFloat(String(data.total)),
      observaciones: data.observaciones || '',
      proveedor_id: parseInt(String(data.proveedor_id)),
      usuario_id: parseInt(String(data.usuario_id)),
      estado_documento_id: parseInt(String(data.estado_documento_id)),
      moneda_id: parseInt(String(data.moneda_id)),
      tipo_pago_id: data.tipo_pago_id ? parseInt(String(data.tipo_pago_id)) : null,
      almacen_id: data.almacen_id ? parseInt(String(data.almacen_id)) : null,
      detalles: detallesTransformados,
    };

    console.log('🟡 CompraForm::submit() - Datos transformados', {
      endpoint: isEditing ? `/compras/${props.compra?.id}` : '/compras',
      detalles_count: transformedData.detalles.length,
      data_keys: Object.keys(transformedData),
      detalles_enviados: JSON.stringify(transformedData.detalles, null, 2),
    });

    const options = {
      onStart: () => {
        console.log('🚀 CompraForm::submit() - onStart: Iniciando envío');
        loadingToast = NotificationService.loading(
          isEditing
            ? 'Actualizando compra...'
            : 'Guardando compra...'
        );
      },
      onSuccess: () => {
        console.log('✅ CompraForm::submit() - onSuccess: Solicitud exitosa');
        if (loadingToast) {
          NotificationService.dismiss(loadingToast);
        }

        // ✅ NUEVO: Limpiar localStorage después de envío exitoso
        localStorage.removeItem('compra-create-draft');
        console.log('✅ Borrador de compra eliminado del localStorage');

        // El mensaje del backend se manejará via session flash
        NotificationService.success(
          isEditing ? 'Compra actualizada exitosamente' : 'Compra creada exitosamente'
        );
      },
      onError: (errors: Record<string, string | string[]>) => {
        console.error('❌ CompraForm::submit() - onError: Error en respuesta', errors);
        if (loadingToast) {
          NotificationService.dismiss(loadingToast);
        }

        // ✅ Usar función auxiliar para extraer errores de forma legible
        const defaultMsg = isEditing ? 'Error al actualizar la compra' : 'Error al crear la compra';
        const errorMessage = extractErrorMessages(errors, defaultMsg);
        NotificationService.error(errorMessage);
        console.error('Form errors details:', errors);
      },
      onFinish: () => {
        console.log('🏁 CompraForm::submit() - onFinish: Completado');
        if (loadingToast) {
          NotificationService.dismiss(loadingToast);
        }
      },
      // Transformar datos antes de enviar
      // ✅ FIX 2026-03-19: Recalcular esEscenarioEstadoOnly dentro del transform para evitar closure stale
      transform: (data: CompraFormData) => {
        // Recalcular si es escenario estado-only (dentro del transform)
        const esEscenarioEstadoOnly_local = isEditing && props.compra &&
          data.estado_documento_id !== String(props.compra.estado_documento_id) &&
          !hasHeaderChanges() &&
          !hasDetallesChanges();

        console.log('🟡 transform() ejecutándose - esEscenarioEstadoOnly_local:', esEscenarioEstadoOnly_local);

        const transformedData: any = {
          numero: data.numero || undefined,
          fecha: data.fecha,
          numero_factura: data.numero_factura || '',
          subtotal: parseFloat(String(data.subtotal)),
          descuento: parseFloat(String(data.descuento || 0)),
          impuesto: parseFloat(String(data.impuesto || 0)),
          total: parseFloat(String(data.total)),
          observaciones: data.observaciones || '',
          proveedor_id: parseInt(String(data.proveedor_id)),
          usuario_id: parseInt(String(data.usuario_id)),
          estado_documento_id: parseInt(String(data.estado_documento_id)),
          moneda_id: parseInt(String(data.moneda_id)),
          tipo_pago_id: data.tipo_pago_id ? parseInt(String(data.tipo_pago_id)) : null,
          almacen_id: data.almacen_id ? parseInt(String(data.almacen_id)) : null,
        };

        // Escenario 1: Usuario modifica detalles/header → SIEMPRE enviar detalles
        // Escenario 2: Solo cambio de estado → NO enviar detalles
        // ✅ FIX: SIEMPRE enviar detalles en modo edición (no solo en escenario-only)
        if (isEditing) {
          // En modo edición, SIEMPRE incluir detalles
          transformedData.detalles = detallesValidos.map(detalle => ({
            id: detalle.id || undefined,
            producto_id: parseInt(String(detalle.producto_id)),
            cantidad: parseInt(String(detalle.cantidad)),
            precio_unitario: parseFloat(String(detalle.precio_unitario)),
            descuento: parseFloat(String(detalle.descuento || 0)),
            subtotal: parseFloat(String(detalle.subtotal)),
            lote: detalle.lote || '',
            fecha_vencimiento: detalle.fecha_vencimiento || null,
          }));

          console.log('🟢 transform() - Enviando detalles en modo edición', {
            detalles_count: transformedData.detalles.length,
            esEscenarioEstadoOnly: esEscenarioEstadoOnly_local,
          });
        } else {
          console.log('🟢 transform() - Modo creación, enviando detalles');
          transformedData.detalles = detallesValidos.map(detalle => ({
            id: detalle.id || undefined,
            producto_id: parseInt(String(detalle.producto_id)),
            cantidad: parseInt(String(detalle.cantidad)),
            precio_unitario: parseFloat(String(detalle.precio_unitario)),
            descuento: parseFloat(String(detalle.descuento || 0)),
            subtotal: parseFloat(String(detalle.subtotal)),
            lote: detalle.lote || '',
            fecha_vencimiento: detalle.fecha_vencimiento || null,
          }));
        }

        console.log('🟡 transform() - transformedData final:', {
          keys: Object.keys(transformedData),
          detalles_enviados: transformedData.detalles?.length || 0,
        });

        return transformedData;
      },
    };

    console.log('📤 CompraForm::submit() - Preparando envío de datos', {
      endpoint: isEditing ? `/compras/${props.compra?.id}` : '/compras',
      metodo: isEditing ? 'PUT' : 'POST',
      dataKeys: Object.keys(options.transform ? options.transform({} as CompraFormData) : {}),
    });

    if (isEditing && props.compra) {
      console.log(`📤 CompraForm::submit() - Enviando PUT a /compras/${props.compra.id} con detalles`);
      router.put(`/compras/${props.compra.id}`, transformedData, {
        onSuccess: () => {
          console.log('✅ CompraForm::submit() - onSuccess: Solicitud exitosa');
          if (loadingToast) {
            NotificationService.dismiss(loadingToast);
          }
          localStorage.removeItem('compra-create-draft');
          console.log('✅ Borrador de compra eliminado del localStorage');
          NotificationService.success('Compra actualizada exitosamente');
        },
        onError: (errors: Record<string, string | string[]>) => {
          console.error('❌ CompraForm::submit() - onError: Error en respuesta', errors);
          if (loadingToast) {
            NotificationService.dismiss(loadingToast);
          }
          const errorMessage = extractErrorMessages(errors, 'Error al actualizar la compra');
          NotificationService.error(errorMessage);
        },
      });
    } else {
      console.log('📤 CompraForm::submit() - Enviando POST a /compras con detalles');
      router.post('/compras', transformedData, {
        onSuccess: () => {
          console.log('✅ CompraForm::submit() - onSuccess: Solicitud exitosa');
          if (loadingToast) {
            NotificationService.dismiss(loadingToast);
          }
          localStorage.removeItem('compra-create-draft');
          NotificationService.success('Compra creada exitosamente');
        },
        onError: (errors: Record<string, string | string[]>) => {
          console.error('❌ CompraForm::submit() - onError: Error en respuesta', errors);
          if (loadingToast) {
            NotificationService.dismiss(loadingToast);
          }
          const errorMessage = extractErrorMessages(errors, 'Error al crear la compra');
          NotificationService.error(errorMessage);
        },
      });
    }

    console.log('⏳ CompraForm::submit() - Solicitud enviada, esperando respuesta...');
  };

  const selectedMoneda = props.monedas.find(m => m.id === Number(data.moneda_id));

  return (
    <AppLayout breadcrumbs={[
      { title: 'Compras', href: '/compras' },
      { title, href: '#' }
    ]}>
      <Head title={title} />

      <form
        onSubmit={submit}
        onKeyDown={(e) => {
          // ✅ Prevenir envío del formulario con Enter en inputs
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA' && (e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault();
          }
        }}
        className="space-y-6 p-6"
      >
        {/* Campo hidden para moneda_id */}
        <input type="hidden" name="moneda_id" value={data.moneda_id} />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          <div className="flex gap-3">
            {!isEditing && (
              <button
                type="button"
                onClick={clearDraft}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
              >
                Limpiar Borrador
              </button>
            )}
            <Link
              href="/compras"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={(!canCreate && !isEditing) || (!canUpdate && isEditing) || processing}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>

        {((!canCreate && !isEditing) || (!canUpdate && isEditing)) && (
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100">
            <AlertTitle>Permiso requerido</AlertTitle>
            <AlertDescription>
              No tiene permiso para {isEditing ? 'editar' : 'crear'} compras. Puede revisar la información pero no podrá guardar cambios.
            </AlertDescription>
          </Alert>
        )}

        {/* Indicador de estado actual para compras existentes */}
        {isEditing && props.compra?.estadoDocumento ? (() => {
          const estadoDoc = props.compra.estadoDocumento;
          return (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Estado: {estadoDoc.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {estadoActual === 'Borrador' && 'Compra en desarrollo. Puede editar todos los campos.'}
                    {estadoActual === 'Pendiente' && 'Esperando aprobación. Puede cambiar a Aprobado o Anular.'}
                    {estadoActual === 'Aprobado' && '✅ Compra aprobada. Stock registrado. Puede editar todos los campos. Puede cambiar a Facturado o Anular.'}
                    {estadoActual === 'Facturado' && 'Compra facturada. Solo lectura. Puede cambiar a Cancelado o Anular.'}
                    {estadoActual === 'Cancelado' && 'Compra cancelada. Solo lectura.'}
                    {estadoActual === 'Anulado' && 'Compra anulada. Solo lectura.'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(estadoDoc)}`}>
                  {estadoDoc.nombre}
                </div>
              </div>
            </div>
          );
        })() : null}

        {/* Información general */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
          {/* <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información General</h3> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Campo de número solo se muestra en modo edición */}
            {isEditing && (
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número *
                </label>
                <input
                  id="numero"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={data.numero || ''}
                  onChange={e => setData('numero', (e.target as HTMLInputElement).value)}
                  placeholder="Ej: COMP-001"
                />
                {errors.numero && <p className="text-red-600 text-xs mt-1">{errors.numero}</p>}
              </div>
            )}

            <div>
              <div className="relative">
                <label htmlFor="fecha" className={`absolute left-3 transition-all duration-200 pointer-events-none ${data.fecha
                  ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                  }`}>
                  Fecha *
                </label>
                <input
                  id="fecha"
                  type="date"
                  disabled={soloLectura}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-800 dark:disabled:text-gray-400 pt-2"
                  value={data.fecha}
                  onChange={e => setData('fecha', e.target.value)}
                />
              </div>
              {errors.fecha && <p className="text-red-600 text-xs mt-1">{errors.fecha}</p>}
            </div>

            <div>
              <InputSearch
                id="proveedor_search"
                label="Proveedor"
                value={proveedorValue}
                displayValue={proveedorDisplay}
                onSearch={proveedorSearch.search}
                onChange={(value, option) => {
                  setData('proveedor_id', value || '');
                  setProveedorValue(value);
                  if (option) {
                    setProveedorDisplay(option.label);
                  } else {
                    setProveedorDisplay('');
                  }
                }}
                placeholder="Escribir nombre del proveedor..."
                emptyText="No se encontraron proveedores"
                error={errors.proveedor_id}
                disabled={soloLectura}
                isSelected={!!proveedorValue}
                required={true}
                allowScanner={false}
                showCreateButton={true}
                onCreateClick={handleCreateProveedor}
                createButtonText="Crear Proveedor"
                showCreateIconButton={true}
                createIconButtonTitle="Crear nuevo proveedor"
                className="w-full"
              />
              {/* ✅ Indicador de proveedor seleccionado */}
              {/* {proveedorDisplay && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Proveedor: <strong>{proveedorDisplay}</strong>
                  </span>
                </div>
              )} */}
            </div>

            <div>
              <SearchSelect
                id="tipo_pago_id"
                label="Tipo de Pago"
                disabled={soloLectura}
                value={data.tipo_pago_id}
                options={tipoPagoOptions}
                onChange={(value: any) => setData('tipo_pago_id', value || '')}
                placeholder="Seleccionar tipo de pago"
                emptyText="No se encontraron tipos de pago"
                searchPlaceholder="Buscar tipo de pago..."
                error={errors.tipo_pago_id}
              />
            </div>

            <div>
              <SearchSelect
                id="estado_documento_id"
                label="Estado"
                required
                disabled={soloLectura}
                value={data.estado_documento_id}
                options={estadoOptions}
                onChange={(value: any) => setData('estado_documento_id', value || '')}
                placeholder="Seleccionar estado"
                emptyText="No se encontraron estados"
                searchPlaceholder="Buscar estado..."
                error={errors.estado_documento_id}
              />
            </div>

            <div>
              <SearchSelect
                id="almacen_id"
                label="Almacén"
                required
                disabled={soloLectura}
                value={data.almacen_id}
                options={almacenOptions}
                onChange={(value: any) => setData('almacen_id', value || '')}
                placeholder="Seleccionar almacén"
                emptyText="No se encontraron almacenes"
                searchPlaceholder="Buscar almacén..."
                error={errors.almacen_id}
              />
            </div>

            <div>
              <div className="relative">
                <label htmlFor="numero_factura" className={`absolute left-3 transition-all duration-200 pointer-events-none ${data.numero_factura
                  ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                  }`}>
                  Número de Recibo/Factura Proveedor
                </label>
                <input
                  id="numero_factura"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pt-2"
                  value={data.numero_factura}
                  onChange={e => setData('numero_factura', e.target.value)}
                />
              </div>
              {errors.numero_factura && <p className="text-red-600 text-xs mt-1">{errors.numero_factura}</p>}
            </div>

            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <input
                id="observaciones"
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={data.observaciones}
                onChange={e => setData('observaciones', e.target.value)}
                placeholder="Observaciones adicionales"
              />
              {errors.observaciones && <p className="text-red-600 text-xs mt-1">{errors.observaciones}</p>}
            </div>
          </div>
          <br />
          <ProductosTable
            tipo="compra" // ✅ NUEVO: Indicar que es una compra (no filtrar por stock)
            productos={props.productos.map(p => ({
              id: p.id,
              nombre: p.nombre,
              codigo: p.codigo ?? undefined, // ✅ Convertir null a undefined
              codigo_barras: p.codigo_barras ?? undefined,
              precio_venta: p.precio_venta as number | undefined,
              precio_compra: p.precio_compra as number | undefined
            }))}
            detalles={data.detalles}
            // ✅ FIX 2026-03-19: Solo lectura en FACTURADO+, editable en BORRADOR y APROBADO
            readOnly={soloLectura}
            onAddProduct={(producto) => {
              // Adaptar la función para agregar producto
              const precioCompra = Number(producto.precio_compra) || 0; // ✅ Cast a number
              const precioCosto = Number(producto.precio_costo) || 0; // ✅ Cast a number
              const newDetalle: DetalleForm = {
                producto_id: producto.id,
                cantidad: 1,
                precio_unitario: precioCompra,
                descuento: 0,
                subtotal: precioCompra,
                lote: '',
                fecha_vencimiento: '',
                precio_costo: precioCosto, // ✅ NUEVO: Precio de costo desde API
                unidad_medida_id: producto.unidad_medida_id, // ✨ NUEVO: Para mostrar unidad como referencia
                unidad_medida_nombre: producto.unidad_medida_nombre, // ✨ NUEVO: Nombre de unidad para referencia
                es_fraccionado: producto.es_fraccionado || false, // ✨ NUEVO: Indicador de producto fraccionado
                conversiones: producto.conversiones || [], // ✨ NUEVO: Conversiones para calcular precio/unidad como referencia
                producto: { // ✅ NUEVO: Guardar objeto completo del producto con stock
                  id: producto.id,
                  nombre: producto.nombre,
                  codigo: producto.codigo,
                  codigo_barras: producto.codigo_barras,
                  precio_costo: precioCosto,
                  es_fraccionado: producto.es_fraccionado || false,
                  // ✅ CORREGIDO: Incluir stock para mostrar disponibilidad
                  stock: (producto as any).stock || 0,
                  stock_disponible: (producto as any).stock_disponible || 0,
                  stock_disponible_calc: (producto as any).stock_disponible_calc || 0,
                  stock_total: (producto as any).stock_total || 0,
                  stock_total_calc: (producto as any).stock_total_calc || 0,
                  stock_reservado: (producto as any).stock_reservado || 0,
                  // ✅ Otros campos necesarios
                  unidad_medida_id: producto.unidad_medida_id,
                  unidad_medida_nombre: producto.unidad_medida_nombre,
                  es_combo: (producto as any).es_combo || false,
                  capacidad: (producto as any).capacidad || null,
                  // ✅ NUEVO: Agregar marca, unidad y precios para mostrar en tabla
                  marca: (producto as any).marca || null,
                  unidad: (producto as any).unidad || null,
                  precios: (producto as any).precios || []
                }
              };
              // ✅ NUEVO: Agregar producto al PRINCIPIO de la lista (no al final)
              const newDetalles = [newDetalle, ...data.detalles];
              setData('detalles', newDetalles);
            }}
            onUpdateDetail={(index, field, value) => {
              updateDetalle(index, field as keyof DetalleForm, value);
            }}
            onRemoveDetail={(index) => {
              removeRow(index);
            }}
            onTotalsChange={() => {
              // Los totales se recalculan automáticamente por el useEffect
            }}
            errors={errors}
            showLoteFields={true}
          />
        </div>

        {/* Resumen financiero */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
          {/* <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen</h3> */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-mono">{formatCurrencyMinimalDecimals(parseFloat(String(formatearNumero(data.subtotal))), selectedMoneda?.simbolo)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Descuento:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    inputMode="decimal" // ✅ Mostrar teclado decimal en móvil
                    className="w-20 px-2 py-1 text-right text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formatearNumero(data.descuento)}
                    onChange={e => {
                      // ✅ Solo permitir números decimales positivos
                      const valor = e.target.value;
                      if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                        const num = valor === '' ? 0 : parseFloat(valor);
                        if (num >= 0) {
                          setData('descuento', num);
                        }
                      }
                    }}
                  />
                  <span className="font-mono">{formatCurrencyMinimalDecimals(parseFloat(String(formatearNumero(data.descuento))), selectedMoneda?.simbolo)}</span>
                </div>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-20 px-2 py-1 text-right text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={data.impuesto}
                    onChange={e => setData('impuesto', Number(e.target.value))}
                  />
                  <span className="font-mono">{formatCurrency(data.impuesto, selectedMoneda?.simbolo)}</span>
                </div>
              </div> */}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="font-mono text-lg">{formatCurrencyMinimalDecimals(parseFloat(String(formatearNumero(data.total))), selectedMoneda?.simbolo)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal para crear proveedor */}
      <ModalCrearProveedor
        isOpen={showCreateProveedorModal}
        onClose={() => setShowCreateProveedorModal(false)}
        onProveedorCreated={handleProveedorCreated}
        searchQuery={proveedorSearchQuery}
      />
    </AppLayout>
  );
}
