import type { DatosParaFiltrosVentas, FiltrosVentas } from '@/domain/entities/ventas';
import ventasService from '@/infrastructure/services/ventas.service';
import { ArrowUpDown, Calendar, DollarSign, Filter, Hash, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ToggleGroup from '../ui/toggle-group';
import FloatingInput from './floating-input';
import FloatingSearchSelect from './floating-search-select';
import FloatingSelect from './floating-select';
import DynamicSearchSelect from '../form-sections/DynamicSearchSelect';

interface FiltrosVentasProps {
    filtros: FiltrosVentas;
    datosParaFiltros?: DatosParaFiltrosVentas;
    onFiltrosChange?: (filtros: FiltrosVentas) => void;
}

interface Cliente {
    id: number;
    nombre: string;
    nit: string;
    label?: string;
}

interface Usuario {
    id: number;
    name: string;
    label?: string;
}

export default function FiltrosVentasComponent({ filtros: filtrosIniciales, datosParaFiltros, onFiltrosChange }: FiltrosVentasProps) {
    const [filtros, setFiltros] = useState<FiltrosVentas>(filtrosIniciales);
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [busquedaCombinada, setBusquedaCombinada] = useState<string>('');

    // ✅ NUEVO: Estados para búsqueda dinámica de clientes
    const [clientesBusqueda, setClientesBusqueda] = useState<Cliente[]>([]);
    const [clienteSearching, setClienteSearching] = useState(false);
    const [clienteSearch, setClienteSearch] = useState<string>('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(
        filtrosIniciales.cliente_id
            ? { id: Number(filtrosIniciales.cliente_id), nombre: '', nit: '' }
            : null
    );

    // ✅ NUEVO: Estados para búsqueda dinámica de usuarios
    const [usuariosBusqueda, setUsuariosBusqueda] = useState<Usuario[]>([]);
    const [usuarioSearching, setUsuarioSearching] = useState(false);
    const [usuarioSearch, setUsuarioSearch] = useState<string>('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(
        filtrosIniciales.usuario_id
            ? { id: Number(filtrosIniciales.usuario_id), name: '' }
            : null
    );

    // 🔍 DEBUG: Mostrar filtros iniciales
    React.useEffect(() => {
        console.log('📝 [FiltrosVentas] Filtros iniciales recibidos:', {
            filtrosIniciales,
            tiene_valores: Object.values(filtrosIniciales).some((v) => v !== undefined && v !== null && v !== ''),
            valores_activos: Object.fromEntries(Object.entries(filtrosIniciales).filter(([_, v]) => v !== undefined && v !== null && v !== '')),
        });
    }, []);

    // Valores por defecto para datosParaFiltros
    const datosSeguros = {
        clientes: datosParaFiltros?.clientes || [],
        estados_documento: datosParaFiltros?.estados_documento || [],
        monedas: datosParaFiltros?.monedas || [],
        usuarios: datosParaFiltros?.usuarios || [],
        tipos_pago: datosParaFiltros?.tipos_pago || [], // ✅ NUEVO: Tipos de pago
        preventistas: datosParaFiltros?.preventistas || [], // ✅ NUEVO (2026-03-01): Preventistas
    };

    // Detectar si hay filtros activos
    const hayFiltrosActivos = Object.values(filtros).some((value) => value !== undefined && value !== null && value !== '');

    // Detectar si hay filtros avanzados activos
    const hayFiltrosAvanzadosActivos = Boolean(
        filtros.fecha_desde ||
            filtros.fecha_hasta ||
            filtros.monto_min ||
            filtros.monto_max ||
            filtros.usuario_id ||
            filtros.tipo_pago_id || // ✅ NUEVO: Incluir tipo_pago_id
            filtros.preventista_id || // ✅ NUEVO (2026-03-01): Incluir preventista_id
            filtros.id_desde || // ✅ NUEVO: Incluir id_desde
            filtros.id_hasta, // ✅ NUEVO: Incluir id_hasta
    );

    useEffect(() => {
        if (hayFiltrosAvanzadosActivos) {
            setMostrarFiltrosAvanzados(true);
        }
    }, [hayFiltrosAvanzadosActivos]);

    // 🔍 DEBUG: Mostrar estados_documento en consola
    useEffect(() => {
        console.log('📋 [FiltrosVentas] Datos que llegan del backend:', {
            todos_los_estados: datosSeguros.estados_documento,
            total_estados: datosSeguros.estados_documento.length,
            estados_con_color: datosSeguros.estados_documento.filter((est) => est.color),
            estados_aprobadas_anuladas: datosSeguros.estados_documento.filter((est) => [3, 5].includes(Number(est.id))),
        });
    }, [datosSeguros.estados_documento]);

    // ✅ NUEVO: Buscar clientes en tiempo real
    const handleSearchClientes = async (query: string) => {
        console.log('🔍 [handleSearchClientes] Query:', query);
        setClienteSearch(query);
        if (query.length < 2) {
            console.log('⚠️ [handleSearchClientes] Query muy corta (<2 caracteres)');
            setClientesBusqueda([]);
            return;
        }

        setClienteSearching(true);
        try {
            const url = `/api/ventas/search/clientes?q=${encodeURIComponent(query)}&limit=20`;
            console.log('📡 [handleSearchClientes] Fetching URL:', url);
            const response = await fetch(url);
            console.log('📥 [handleSearchClientes] Response status:', response.status);
            const data = await response.json();
            console.log('✅ [handleSearchClientes] Data recibida:', data);
            if (data.success) {
                console.log('📋 [handleSearchClientes] Clientes encontrados:', data.data);
                setClientesBusqueda(data.data);
            } else {
                console.error('❌ [handleSearchClientes] Error en respuesta:', data.message);
            }
        } catch (error) {
            console.error('💥 [handleSearchClientes] Error buscando clientes:', error);
        } finally {
            setClienteSearching(false);
        }
    };

    // ✅ NUEVO: Buscar usuarios en tiempo real
    const handleSearchUsuarios = async (query: string) => {
        console.log('🔍 [handleSearchUsuarios] Query:', query);
        setUsuarioSearch(query);
        if (query.length < 2) {
            console.log('⚠️ [handleSearchUsuarios] Query muy corta (<2 caracteres)');
            setUsuariosBusqueda([]);
            return;
        }

        setUsuarioSearching(true);
        try {
            const url = `/api/ventas/search/usuarios?q=${encodeURIComponent(query)}&limit=20`;
            console.log('📡 [handleSearchUsuarios] Fetching URL:', url);
            const response = await fetch(url);
            console.log('📥 [handleSearchUsuarios] Response status:', response.status);
            const data = await response.json();
            console.log('✅ [handleSearchUsuarios] Data recibida:', data);
            if (data.success) {
                console.log('📋 [handleSearchUsuarios] Usuarios encontrados:', data.data);
                setUsuariosBusqueda(data.data);
            } else {
                console.error('❌ [handleSearchUsuarios] Error en respuesta:', data.message);
            }
        } catch (error) {
            console.error('💥 [handleSearchUsuarios] Error buscando usuarios:', error);
        } finally {
            setUsuarioSearching(false);
        }
    };

    const handleFiltroChange = (campo: keyof FiltrosVentas, valor: string | number | null | undefined) => {
        const nuevosFiltros = { ...filtros, [campo]: valor };
        console.log('🎯 [filtros-ventas] handleFiltroChange (local):', { campo, valor });
        setFiltros(nuevosFiltros);
        // ⚠️ NO llamamos a onFiltrosChange aquí - esperar a que el usuario presione "Buscar"
    };

    // ✅ Handler para el botón Buscar - aplica los filtros
    const handleBuscar = () => {
        console.log('📤 [filtros-ventas] Botón Buscar presionado. Aplicando filtros:', filtros);
        if (onFiltrosChange) {
            onFiltrosChange(filtros);
        }
    };

    // ✅ Handler para el botón Limpiar - limpia todos los filtros
    const handleLimpiarFiltros = () => {
        const filtrosLimpios = {
            cliente_id: undefined,
            estado_documento_id: undefined,
            usuario_id: undefined,
            fecha_desde: undefined,
            fecha_hasta: undefined,
            monto_min: undefined,
            monto_max: undefined,
            moneda_id: undefined,
            numero: null,
            id: null,
            id_desde: undefined,
            id_hasta: undefined,
            tipo_pago_id: undefined,
            preventista_id: undefined,
        };
        console.log('🗑️ [filtros-ventas] Limpiando filtros');
        setFiltros(filtrosLimpios);
        if (onFiltrosChange) {
            onFiltrosChange(filtrosLimpios);
        }
    };

    // ✅ NUEVO: Cambiar múltiples filtros a la vez
    const handleMultipleFiltros = (cambios: Partial<FiltrosVentas>) => {
        const nuevosFiltros = { ...filtros, ...cambios };
        setFiltros(nuevosFiltros);
        // ⚠️ NO llamamos a onFiltrosChange aquí - esperar a que el usuario presione "Buscar"
    };

    // Detecta si el input es un número puro o contiene letras (para numero de venta)
    const handleBusquedaCombinada = (valor: string) => {
        setBusquedaCombinada(valor);

        const nuevosFiltros = { ...filtros };

        if (!valor) {
            nuevosFiltros.id = null;
            nuevosFiltros.numero = null;
        } else if (/^\d+$/.test(valor)) {
            // Si es un número puro, buscar por ID
            nuevosFiltros.id = Number(valor);
            nuevosFiltros.numero = null;
        } else {
            // Si contiene letras o caracteres especiales, buscar por número de venta
            nuevosFiltros.numero = valor;
            nuevosFiltros.id = null;
        }

        setFiltros(nuevosFiltros);
        // ⚠️ NO llamamos a onFiltrosChange aquí - solo actualizamos estado local
    };

    const aplicarFiltros = (filtrosAplicar?: FiltrosVentas) => {
        const filtrosFinales = filtrosAplicar || filtros;
        console.log('🔍 [FiltrosVentas] Aplicando filtros:', filtrosFinales);
        console.log('🔍 [FiltrosVentas] preventista_id:', filtrosFinales.preventista_id);
        ventasService.searchVentas(filtrosFinales);
    };

    const limpiarFiltros = () => {
        const filtrosVacios: FiltrosVentas = {};
        setFiltros(filtrosVacios);
        setBusquedaCombinada('');
        setMostrarFiltrosAvanzados(false);
        ventasService.clearFilters();
        // Aplicar los filtros vacíos al padre
        handleLimpiarFiltros();
    };

    // ✅ NUEVO: Función para obtener etiquetas de filtros activos
    const obtenerFiltrosActivos = () => {
        const filtrosActivos: Array<{ etiqueta: string; campo: keyof FiltrosVentas }> = [];

        if (filtros.id) {
            filtrosActivos.push({ etiqueta: `ID #${filtros.id}`, campo: 'id' });
        }
        if (filtros.numero) {
            filtrosActivos.push({ etiqueta: `Número: ${filtros.numero}`, campo: 'numero' });
        }
        if (filtros.id_desde) {
            filtrosActivos.push({ etiqueta: `ID desde: ${filtros.id_desde}`, campo: 'id_desde' });
        }
        if (filtros.id_hasta) {
            filtrosActivos.push({ etiqueta: `ID hasta: ${filtros.id_hasta}`, campo: 'id_hasta' });
        }
        if (filtros.cliente_id) {
            filtrosActivos.push({ etiqueta: `Cliente: ${filtros.cliente_id}`, campo: 'cliente_id' });
        }
        if (filtros.estado_documento_id) {
            const estado = datosSeguros.estados_documento.find((e) => e.id === filtros.estado_documento_id);
            if (estado) {
                filtrosActivos.push({ etiqueta: `Estado: ${estado.nombre}`, campo: 'estado_documento_id' });
            }
        }
        if (filtros.tipo_venta) {
            const tipoVentaLabel = filtros.tipo_venta === 'presencial' ? '🏪 Presencial' : '🚚 Delivery';
            filtrosActivos.push({ etiqueta: `Tipo: ${tipoVentaLabel}`, campo: 'tipo_venta' });
        }
        if (filtros.fecha_desde) {
            filtrosActivos.push({ etiqueta: `Desde: ${filtros.fecha_desde}`, campo: 'fecha_desde' });
        }
        if (filtros.fecha_hasta) {
            filtrosActivos.push({ etiqueta: `Hasta: ${filtros.fecha_hasta}`, campo: 'fecha_hasta' });
        }
        if (filtros.usuario_id) {
            const usuario = datosSeguros.usuarios.find((u) => u.id === filtros.usuario_id);
            if (usuario) {
                filtrosActivos.push({ etiqueta: `Usuario: ${usuario.name}`, campo: 'usuario_id' });
            }
        }
        if (filtros.preventista_id) {
            const preventista = datosSeguros.preventistas.find((p) => p.id === filtros.preventista_id);
            if (preventista) {
                filtrosActivos.push({ etiqueta: `Preventista: ${preventista.name}`, campo: 'preventista_id' });
            }
        }
        if (filtros.tipo_pago_id) {
            const tipoPago = datosSeguros.tipos_pago.find((tp) => tp.id === filtros.tipo_pago_id);
            if (tipoPago) {
                filtrosActivos.push({ etiqueta: `Pago: ${tipoPago.nombre}`, campo: 'tipo_pago_id' });
            }
        }
        if (filtros.monto_min) {
            filtrosActivos.push({ etiqueta: `Monto mín: ${filtros.monto_min}`, campo: 'monto_min' });
        }
        if (filtros.monto_max) {
            filtrosActivos.push({ etiqueta: `Monto máx: ${filtros.monto_max}`, campo: 'monto_max' });
        }
        if (filtros.moneda_id) {
            const moneda = datosSeguros.monedas.find((m) => m.id === filtros.moneda_id);
            if (moneda) {
                filtrosActivos.push({ etiqueta: `Moneda: ${moneda.codigo}`, campo: 'moneda_id' });
            }
        }

        return filtrosActivos;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            aplicarFiltros();
        }
    };

    return (
        <div className="mb-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {/* Filtros básicos */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
                {/* ID de venta o Número de venta (búsqueda combinada) */}
                <div>
                    <FloatingInput
                        id="busqueda"
                        label="🔍 Búsqueda Folio"
                        value={busquedaCombinada}
                        onChange={(e) => handleBusquedaCombinada(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                console.log('⌨️ [filtros-ventas] Enter presionado en búsqueda, aplicando filtros');
                                handleBuscar();
                            }
                        }}
                        placeholder="ID o Número"
                        title="Buscar por ID (58, 100) o Número (VEN20260128-0010) - Presiona Enter o Click Buscar"
                        // icon={<Hash className="h-4 w-4" />}
                    />
                </div>

                {/* Rango de IDs - Desde */}
                <div>
                    <FloatingInput
                        id="id_desde"
                        label="Folio Desde"
                        type="number"
                        value={filtros.id_desde || ''}
                        onChange={(e) => handleFiltroChange('id_desde', e.target.value ? Number(e.target.value) : null)}
                        placeholder="ID desde"
                        title="ID mínimo de la venta"
                        icon={<Hash className="h-4 w-4" />}
                    />
                </div>

                {/* Rango de IDs - Hasta */}
                <div>
                    <FloatingInput
                        id="id_hasta"
                        label="Folio Hasta"
                        type="number"
                        value={filtros.id_hasta || ''}
                        onChange={(e) => handleFiltroChange('id_hasta', e.target.value ? Number(e.target.value) : null)}
                        placeholder="ID hasta"
                        title="ID máximo de la venta"
                        icon={<Hash className="h-4 w-4" />}
                    />
                </div>

                {/* Cliente - Búsqueda dinámica en tiempo real */}
                <div>
                    <DynamicSearchSelect<Cliente>
                        label="👥 Cliente"
                        placeholder="Buscar cliente..."
                        selectedItem={clienteSeleccionado}
                        items={clientesBusqueda}
                        isLoading={clienteSearching}
                        searchValue={clienteSearch}
                        onSearch={handleSearchClientes}
                        onSelect={(cliente) => {
                            setClienteSeleccionado(cliente);
                            handleFiltroChange('cliente_id', cliente.id);
                        }}
                        onClear={() => {
                            setClienteSeleccionado(null);
                            setClienteSearch('');
                            handleFiltroChange('cliente_id', null);
                        }}
                        renderItem={(cliente) => `${cliente.nombre} (NIT: ${cliente.nit})`}
                        getItemId={(cliente) => cliente.id}
                        getDisplayValue={(cliente) => `${cliente.nombre} (NIT: ${cliente.nit})`}
                    />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <ToggleGroup
                        options={datosSeguros.estados_documento
                            .filter((est) => [3, 5].includes(Number(est.id))) // Solo Aprobadas (3) y Anuladas (5)
                            .map((est) => ({
                                value: est.id.toString(),
                                label: est.nombre,
                                icon: est.icono,
                                color: est.color,
                            }))}
                        value={filtros.estado_documento_id?.toString() || ''}
                        onChange={(value) => handleFiltroChange('estado_documento_id', value ? parseInt(value) : null)}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            handleMultipleFiltros({ fecha_desde: today, fecha_hasta: today });
                        }}
                        className={`font-small rounded-md p-1 text-sm transition-colors ${
                            filtros.fecha_desde === filtros.fecha_hasta && filtros.fecha_desde
                                ? 'bg-blue-600 text-white'
                                : 'border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                        }`}
                    >
                        📅 Hoy
                    </button>
                </div>
            </div>

            {/* Filtros avanzados */}
            {mostrarFiltrosAvanzados && (
                <div className="mt-4 pt-2">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Rango de fechas */}
                        <div>
                            <FloatingInput
                                id="fecha_desde"
                                label="📅 Fecha desde"
                                type="date"
                                value={filtros.fecha_desde || ''}
                                onChange={(e) => handleFiltroChange('fecha_desde', e.target.value || undefined)}
                                icon={<Calendar className="h-4 w-4" />}
                            />
                        </div>

                        <div>
                            <FloatingInput
                                id="fecha_hasta"
                                label="📅 Fecha hasta"
                                type="date"
                                value={filtros.fecha_hasta || ''}
                                onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value || undefined)}
                                icon={<Calendar className="h-4 w-4" />}
                            />
                        </div>

                        {/* Tipo de Pago */}
                        <div>
                            <FloatingSelect
                                id="tipo_pago_id"
                                label="💳 Tipo de Pago"
                                value={filtros.tipo_pago_id || ''}
                                onChange={(e) => handleFiltroChange('tipo_pago_id', e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Todos los tipos</option>
                                {datosSeguros.tipos_pago.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </FloatingSelect>
                        </div>
                        {/* Estado */}
                        <div>
                            <FloatingSelect
                                id="estado_documento_id"
                                label="📋 Estado"
                                value={filtros.estado_documento_id || ''}
                                onChange={(e) => handleFiltroChange('estado_documento_id', e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Todos los estados</option>
                                {datosSeguros.estados_documento.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                        {estado.nombre}
                                    </option>
                                ))}
                            </FloatingSelect>
                        </div>
                        {/* Rango de montos */}
                        <div>
                            <FloatingInput
                                id="monto_min"
                                label="💰 Monto mínimo"
                                type="number"
                                value={filtros.monto_min || ''}
                                onChange={(e) => handleFiltroChange('monto_min', e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                icon={<DollarSign className="h-4 w-4" />}
                            />
                        </div>
                        <div>
                            <FloatingInput
                                id="monto_max"
                                label="💰 Monto máximo"
                                type="number"
                                value={filtros.monto_max || ''}
                                onChange={(e) => handleFiltroChange('monto_max', e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                icon={<DollarSign className="h-4 w-4" />}
                            />
                        </div>
                        {/* Tipo de Venta */}
                        <div>
                            <FloatingSelect
                                id="tipo_venta"
                                label="🏪 Tipo de Venta"
                                value={filtros.tipo_venta || ''}
                                onChange={(e) => handleFiltroChange('tipo_venta', e.target.value || null)}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="presencial">🏪 Presencial</option>
                                <option value="delivery">🚚 Delivery</option>
                            </FloatingSelect>
                        </div>
                        {/* Usuario - Búsqueda dinámica */}
                        <div className="w-full">
                            <DynamicSearchSelect<Usuario>
                                label="👤 Usuario Creador"
                                placeholder="Buscar usuario..."
                                selectedItem={usuarioSeleccionado}
                                items={usuariosBusqueda}
                                isLoading={usuarioSearching}
                                searchValue={usuarioSearch}
                                onSearch={handleSearchUsuarios}
                                onSelect={(usuario) => {
                                    setUsuarioSeleccionado(usuario);
                                    handleFiltroChange('usuario_id', usuario.id);
                                }}
                                onClear={() => {
                                    setUsuarioSeleccionado(null);
                                    setUsuarioSearch('');
                                    handleFiltroChange('usuario_id', null);
                                }}
                                renderItem={(usuario) => usuario.name}
                                getItemId={(usuario) => usuario.id}
                                getDisplayValue={(usuario) => usuario.name}
                            />
                        </div>
                        {/* ✅ NUEVO (2026-03-01): Preventista */}
                        <div>
                            <FloatingSearchSelect
                                id="preventista_id"
                                label="👤 Preventista"
                                placeholder="Seleccionar preventista..."
                                value={filtros.preventista_id || ''}
                                options={datosSeguros.preventistas.map((preventista) => ({
                                    value: preventista.id,
                                    label: preventista.name,
                                }))}
                                onChange={(value) => handleFiltroChange('preventista_id', value ? Number(value) : null)}
                                allowClear={true}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Botones de acción */}
            <div className="flex flex-wrap items-end justify-between gap-4 p-2">
                {/* Controles de Ordenamiento - Columna 1 */}
                <div className="flex items-center gap-2">
                    <div>
                        <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <ArrowUpDown className="h-3 w-3" />
                            Columna
                        </label>
                        <select
                            value={filtros.sort_by || 'id'}
                            onChange={(e) => handleFiltroChange('sort_by', e.target.value || 'id')}
                            className="rounded-md border border-gray-300 px-1 py-1 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="id">Folio</option>
                            <option value="created_at">Fecha de creación</option>
                            <option value="updated_at">Fecha de actualización</option>
                            <option value="fecha">Fecha de emisión</option>
                            <option value="numero">Número de venta</option>
                            <option value="total">Total</option>
                            <option value="estado">Estado</option>
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <ArrowUpDown className="h-3 w-3" />
                            Ordenar por
                        </label>
                        <select
                            value={filtros.sort_order || 'desc'}
                            onChange={(e) => handleFiltroChange('sort_order', (e.target.value as 'asc' | 'desc') || 'desc')}
                            className="rounded-md border border-gray-300 px-1 py-1 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="desc">↓ Descendente (más reciente)</option>
                            <option value="asc">↑ Ascendente (más antiguo)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        <Filter className="mr-1 h-4 w-4" />
                        {mostrarFiltrosAvanzados ? 'Ocultar filtros' : 'Más filtros'}
                    </button>
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                        >
                            <X className="mr-1 h-4 w-4" />
                            Limpiar
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            console.log('🔘 [filtros-ventas] Botón Buscar clickeado');
                            handleBuscar();
                        }}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <Search className="mr-1 h-4 w-4" />
                        Buscar
                    </button>
                </div>
            </div>
            {/* ✅ NUEVO: Mostrar filtros seleccionados activos */}
            {obtenerFiltrosActivos().length > 0 && (
                <div className="mt-2 border-t border-gray-200 dark:border-zinc-700">
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros activos:</span>
                        {obtenerFiltrosActivos().map((filtroActivo) => (
                            <div
                                key={filtroActivo.campo}
                                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                            >
                                <span>{filtroActivo.etiqueta}</span>
                                <button
                                    type="button"
                                    onClick={() => handleFiltroChange(filtroActivo.campo, null)}
                                    className="ml-1 font-semibold text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                                    title="Remover filtro"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
