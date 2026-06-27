import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/presentation/components/ui/dropdown-menu';
import { useToastNotifications } from '@/application/hooks/use-toast-notifications';
import prestableService from '@/infrastructure/services/prestable.service';
import type { Prestable } from '@/domain/entities/prestamos';
import { Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import PrestableDeleteConfirmModal from './PrestableDeleteConfirmModal';

export default function PrestablesIndex() {
    const { showNotification } = useToastNotifications();
    const [prestables, setPrestables] = useState<Prestable[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [prestableToDelete, setPrestableToDelete] = useState<Prestable | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtros
    const [filters, setFilters] = useState({
        search: '',
        tipo: '', // CANASTILLA, EMBASES o vacio para todos
        activo: '', // true, false o vacio para todos
    });
    const [filteredPrestables, setFilteredPrestables] = useState<Prestable[]>([]);

    useEffect(() => {
        fetchPrestables();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [prestables, filters]);

    const fetchPrestables = async () => {
        try {
            console.log('⏳ Fetching prestables...');
            const data = await prestableService.getAll();
            console.log('✅ Prestables cargados:', data);
            setPrestables(data);
        } catch (error) {
            console.error('❌ Error en fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = prestables;

        // Filtro por búsqueda (nombre, ID, código)
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter((p) =>
                p.nombre.toLowerCase().includes(searchLower) ||
                p.codigo.toLowerCase().includes(searchLower) ||
                p.id.toString().includes(searchLower)
            );
        }

        // Filtro por tipo
        if (filters.tipo) {
            filtered = filtered.filter((p) => p.tipo === filters.tipo);
        }

        // Filtro por estado activo
        if (filters.activo !== '') {
            const isActive = filters.activo === 'true';
            filtered = filtered.filter((p) => p.activo === isActive);
        }

        setFilteredPrestables(filtered);
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            tipo: '',
            activo: '',
        });
    };


    const handleDeleteClick = (prestable: Prestable) => {
        console.log('🗑️ ABRIR DIÁLOGO ELIMINAR:', prestable.nombre);
        setPrestableToDelete(prestable);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!prestableToDelete?.id) return;

        try {
            console.log('⚠️ ELIMINANDO PRESTABLE:', prestableToDelete.id);
            await prestableService.remove(prestableToDelete.id);

            showNotification({
                title: '✅ Eliminado',
                description: `${prestableToDelete.nombre} fue eliminado correctamente`,
                type: 'success',
            });

            setShowDeleteDialog(false);
            setPrestableToDelete(null);
            await fetchPrestables();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar el prestable';
            showNotification({
                title: '❌ Error',
                description: errorMessage,
                type: 'error',
            });
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <AppLayout>
            <Head title="Gestión de Prestables" />
            <div className="p-4 bg-white dark:bg-gray-950 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📦 Gestionar Embases y Canastillas
                    </h1>
                    <Button
                        onClick={() => router.visit('/prestamos/prestables/create')}
                        className="gap-2"
                    >
                        <Plus size={20} />
                        Nuevo Prestable
                    </Button>
                </div>

                <PrestableDeleteConfirmModal
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isSubmitting}
                    prestableName={prestableToDelete?.nombre}
                    prestableCodigo={prestableToDelete?.codigo}
                />

                {/* Panel de Filtros */}
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-2 p-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                🔍 Filtros
                            </h2>
                            {(filters.search || filters.tipo || filters.activo) && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Búsqueda por nombre, ID, código */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Buscar (Nombre, ID, Código)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Paceña, CANT-1, 42"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filtro por tipo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo
                                </label>
                                <select
                                    value={filters.tipo}
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="CANASTILLA">📦 Canastilla</option>
                                    <option value="EMBASES">🔖 Embases</option>
                                </select>
                            </div>

                            {/* Filtro por estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={filters.activo}
                                    onChange={(e) => handleFilterChange('activo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="true">✅ Activos</option>
                                    <option value="false">❌ Inactivos</option>
                                </select>
                            </div>

                            {/* Resultado */}
                            <div className="flex items-end">
                                <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p className="text-sm text-blue-900 dark:text-blue-200">
                                        <span className="font-semibold">{filteredPrestables.length}</span> de {prestables.length} prestables
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabla de Prestables */}
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                            Cargando...
                        </div>
                    ) : filteredPrestables.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {prestables.length === 0 ? 'No existen productos prestables' : 'No hay resultados'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {prestables.length === 0
                                        ? 'Crea tu primer prestable haciendo clic en el botón "Nuevo Prestable"'
                                        : 'Intenta ajustar los filtros para encontrar lo que buscas'}
                                </p>
                                {prestables.length === 0 && (
                                    <Button onClick={() => router.visit('/prestamos/prestables/create')} className="gap-2">
                                        <Plus size={20} />
                                        Crear Prestable
                                    </Button>
                                )}
                                {prestables.length > 0 && filteredPrestables.length === 0 && (
                                    <Button onClick={resetFilters} className="gap-2" variant="outline">
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <TableHead className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                                            ID
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Nombre
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Código
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Tipo
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Capacidad
                                        </TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">
                                            📦 Producto
                                        </TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            💰 Precio Préstamo
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            🛒 Precio Venta
                                        </TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">
                                            🔗 Garantía
                                        </TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Estado
                                        </TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPrestables.map((p) => (
                                        <TableRow
                                            key={p.id}
                                            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                                        >
                                            <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                                                #{p.id}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                                {p.nombre}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                                                {p.codigo}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300">
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {p.tipo === 'CANASTILLA' ? '📦 Canastilla' : '🔖 Embases'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300 text-center">
                                                {p.tipo === 'CANASTILLA' && p.capacidad ? (
                                                    <span className="font-semibold text-green-600 dark:text-green-400">{p.capacidad}</span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">1</span>
                                                )}
                                            </TableCell>
                                            {/* <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                                {p.producto ? (
                                                    <span className="flex items-center gap-1">
                                                        <span>{p.producto.nombre}</span>
                                                        {p.producto.sku && <span className="text-gray-500 dark:text-gray-400 text-xs">({p.producto.sku})</span>}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic">-</span>
                                                )}
                                            </TableCell> */}
                                            <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                                Bs {Number(p.precios?.find((pr) => pr.tipo_precio === 'PRESTAMO')?.valor || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                                Bs {Number(p.precios?.find((pr) => pr.tipo_precio === 'VENTA')?.valor || 0).toFixed(2)}
                                            </TableCell>
                                            {/* <TableCell className="text-gray-900 dark:text-gray-100">
                                                ${Number(p.condiciones?.[0]?.monto_garantia || 0).toFixed(2)}
                                            </TableCell> */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${p.activo
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                        }`}
                                                >
                                                    {p.activo ? '✅ Activo' : '❌ Inactivo'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => router.visit(`/prestamos/prestables/${p.id}`)} className="cursor-pointer flex items-center gap-2">
                                                            <Eye size={16} />
                                                            <span>Ver detalles</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.visit(`/prestamos/prestables/${p.id}/edit`)} className="cursor-pointer flex items-center gap-2">
                                                            <Edit2 size={16} />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(p)} className="cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400">
                                                            <Trash2 size={16} />
                                                            <span>Eliminar</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
