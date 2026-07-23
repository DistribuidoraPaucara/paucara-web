import type { DatosParaFiltrosVentas, FiltrosVentas } from '@/domain/entities/ventas';
import ventasService from '@/infrastructure/services/ventas.service';
import { ArrowUpDown, Calendar, DollarSign, Filter, Hash, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ToggleGroup from '../ui/toggle-group';
import FloatingInput from './floating-input';
import FloatingSearchSelect from './floating-search-select';
import FloatingSelect from './floating-select';

interface FiltrosVentasProps {
    filtros: FiltrosVentas;
    datosParaFiltros?: DatosParaFiltrosVentas;
    onFiltrosChange?: (filtros: FiltrosVentas) => void;
}

export default function FiltrosVentasComponent({ filtros: filtrosIniciales, datosParaFiltros, onFiltrosChange }: FiltrosVentasProps) {
    const [filtros, setFiltros] = useState<FiltrosVentas>(filtrosIniciales);
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [busquedaCombinada, setBusquedaCombinada] = useState<string>('');

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

    const handleFiltroChange = (campo: keyof FiltrosVentas, valor: string | number | null | undefined) => {
        const nuevosFiltros = { ...filtros, [campo]: valor };
        setFiltros(nuevosFiltros);

        if (onFiltrosChange) {
            onFiltrosChange(nuevosFiltros);
        }
    };

    // ✅ NUEVO: Cambiar múltiples filtros a la vez
    const handleMultipleFiltros = (cambios: Partial<FiltrosVentas>) => {
        const nuevosFiltros = { ...filtros, ...cambios };
        setFiltros(nuevosFiltros);

        if (onFiltrosChange) {
            onFiltrosChange(nuevosFiltros);
        }
    };

    // Detecta si el input es un número puro o contiene letras (para numero de venta)
    const handleBusquedaCombinada = (valor: string, aplicarAhora: boolean = false) => {
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

        if (onFiltrosChange) {
            onFiltrosChange(nuevosFiltros);
        }

        // Si se llama con aplicarAhora=true, envía al backend inmediatamente
        if (aplicarAhora) {
            aplicarFiltros(nuevosFiltros);
        }
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
                                handleBusquedaCombinada(busquedaCombinada, true);
                            }
                        }}
                        placeholder="ID o Número"
                        title="Buscar por ID (58, 100) o Número (VEN20260128-0010)"
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

                {/* Cliente - Búsqueda por múltiples campos */}
                <div>
                    <FloatingInput
                        id="cliente_id"
                        label="👥Cliente"
                        value={filtros.cliente_id || ''}
                        onChange={(e) => handleFiltroChange('cliente_id', e.target.value || null)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                aplicarFiltros();
                            }
                        }}
                        placeholder="Cliente (ID, código, nombre, NIT, teléfono)"
                        title="Buscar por ID, código cliente, nombre, NIT o teléfono"
                        icon={<Search className="h-4 w-4" />}
                    />
                </div>
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
            </div>

            {/* Filtros avanzados */}
            {mostrarFiltrosAvanzados && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-zinc-700">
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
                        {/* Usuario */}
                        <div className="w-full">
                            <FloatingSearchSelect
                                id="usuario_id"
                                label="👤 Usuario Creador"
                                placeholder="Seleccionar usuario..."
                                value={filtros.usuario_id || ''}
                                options={datosSeguros.usuarios.map((usuario) => ({
                                    value: usuario.id,
                                    label: usuario.name,
                                }))}
                                onChange={(value) => handleFiltroChange('usuario_id', value ? Number(value) : null)}
                                allowClear={true}
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

            {/* ✅ NUEVO: Mostrar filtros seleccionados activos */}
            {obtenerFiltrosActivos().length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-zinc-700">
                    <div className="flex flex-wrap items-center gap-2">
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

            {/* Botones de acción */}
            <div className="flex flex-wrap items-end justify-between gap-4 mt-2 border-t border-gray-200 p-2 dark:border-zinc-700">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        <Filter className="mr-1 h-4 w-4" />
                        {mostrarFiltrosAvanzados ? 'Ocultar filtros' : 'Más filtros'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            handleMultipleFiltros({ fecha_desde: today, fecha_hasta: today });
                        }}
                        className={`rounded-md p-1 text-sm font-small transition-colors ${
                            filtros.fecha_desde === filtros.fecha_hasta && filtros.fecha_desde
                                ? 'bg-blue-600 text-white'
                                : 'border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                        }`}
                    >
                        📅 Hoy
                    </button>
                    {hayFiltrosActivos && <span className="text-sm text-gray-500 dark:text-gray-400">Filtros aplicados</span>}
                </div>

                {/* Controles de Ordenamiento - Columna 1 */}
                <div className="flex items-center gap-2">
                    <div>
                        <label className="flex items-center gap-1 text-xs font-small text-gray-700 dark:text-gray-300">
                            <ArrowUpDown className="h-3 w-3" />
                            Ordenar por
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
                        <label className="flex items-center gap-1 text-xs font-small text-gray-700 dark:text-gray-300">
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
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                        >
                            <X className="mr-1 h-4 w-4" />
                            Limpiar
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => handleBusquedaCombinada(busquedaCombinada, true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <Search className="mr-1 h-4 w-4" />
                        Buscar
                    </button>
                </div>
            </div>
        </div>
    );
}
