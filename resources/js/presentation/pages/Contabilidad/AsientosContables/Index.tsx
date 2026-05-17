import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Search, FileText, TrendingUp, Eye } from 'lucide-react';
import { useState } from 'react';

// Tipos para asientos contables
interface DetalleAsientoContable {
    id: number;
    codigo_cuenta: string;
    descripcion: string;
    debe: number;
    haber: number;
    orden: number;
}

interface AsientoContable {
    id: number;
    numero: string;
    fecha: string;
    concepto: string;
    tipo_documento: string;
    total_debe: number;
    total_haber: number;
    usuario?: {
        id: number;
        name: string;
    };
    detalles?: DetalleAsientoContable[];
    asientable_type?: string;
    asientable_id?: number;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    next_page_url?: string;
    prev_page_url?: string;
}

interface FiltrosAsientos {
    [key: string]: string | undefined;
    fecha_desde?: string;
    fecha_hasta?: string;
    tipo_documento?: string;
    numero?: string;
}

interface PageProps extends InertiaPageProps {
    asientos: Pagination<AsientoContable> | undefined;
    filtros: FiltrosAsientos;
    tipos_documento: string[];
}

export default function AsientosContablesIndex() {
    const { props } = usePage<PageProps>();
    const { asientos, filtros, tipos_documento } = props;

    const [filtrosLocal, setFiltrosLocal] = useState<FiltrosAsientos>(filtros);

    // Verificación defensiva para asientos
    if (!asientos) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Contabilidad', href: '/contabilidad/asientos' },
                    { title: 'Asientos Contables', href: '/contabilidad/asientos' }
                ]}
            >
                <Head title="Asientos Contables" />
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">Cargando asientos contables...</p>
                        </div>
                    </CardContent>
                </Card>
            </AppLayout>
        );
    }

    const aplicarFiltros = () => {
        router.get('/contabilidad/asientos', filtrosLocal, {
            preserveState: true,
            replace: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios: FiltrosAsientos = {};
        setFiltrosLocal(filtrosVacios);
        router.get('/contabilidad/asientos', filtrosVacios, {
            preserveState: true,
            replace: true,
        });
    };

    const cambiarPagina = (url: string) => {
        router.get(url, filtrosLocal, {
            preserveState: true,
            replace: true,
        });
    };

    const formatearMoneda = (valor: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(valor);
    };

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-BO');
    };

    const getTipoDocumentoBadgeColor = (tipo: string) => {
        switch (tipo) {
            case 'VENTA':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'COMPRA':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'AJUSTE':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Contabilidad', href: '/contabilidad/asientos' },
            { title: 'Asientos Contables', href: '/contabilidad/asientos' }
        ]}>
            <Head title="Asientos Contables" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Asientos Contables
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {asientos?.total && asientos.total > 0
                                ? `${asientos.from}-${asientos.to} de ${asientos.total} asientos`
                                : 'No se encontraron asientos contables'
                            }
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/contabilidad/reportes/libro-mayor">
                            <Button variant="outline" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Libro Mayor
                            </Button>
                        </Link>
                        <Link href="/contabilidad/reportes/balance-comprobacion">
                            <Button variant="outline" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Balance de Comprobación
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filtros */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha Desde
                            </label>
                            <Input
                                type="date"
                                value={filtrosLocal.fecha_desde || ''}
                                onChange={(e) => setFiltrosLocal({ ...filtrosLocal, fecha_desde: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha Hasta
                            </label>
                            <Input
                                type="date"
                                value={filtrosLocal.fecha_hasta || ''}
                                onChange={(e) => setFiltrosLocal({ ...filtrosLocal, fecha_hasta: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipo Documento
                            </label>
                            <Select
                                value={filtrosLocal.tipo_documento || 'all'}
                                onValueChange={(value) => setFiltrosLocal({ ...filtrosLocal, tipo_documento: value === 'all' ? undefined : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {tipos_documento.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo}>
                                            {tipo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Número
                            </label>
                            <Input
                                placeholder="Buscar por número..."
                                value={filtrosLocal.numero || ''}
                                onChange={(e) => setFiltrosLocal({ ...filtrosLocal, numero: e.target.value })}
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <Button onClick={aplicarFiltros} className="flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Filtrar
                            </Button>
                            <Button variant="outline" onClick={limpiarFiltros}>
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Tabla de asientos */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Número
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Concepto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Debe
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Haber
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {asientos.data.map((asiento) => (
                                    <tr key={asiento.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {asiento.numero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatearFecha(asiento.fecha)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            <div className="max-w-xs truncate" title={asiento.concepto}>
                                                {asiento.concepto}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getTipoDocumentoBadgeColor(asiento.tipo_documento)}>
                                                {asiento.tipo_documento}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                            {formatearMoneda(asiento.total_debe)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                            {formatearMoneda(asiento.total_haber)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {asiento.usuario?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Link
                                                href={`/contabilidad/asientos/${asiento.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {asientos.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Página {asientos.current_page} de {asientos.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => asientos.prev_page_url && cambiarPagina(asientos.prev_page_url)}
                                        disabled={!asientos.prev_page_url}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => asientos.next_page_url && cambiarPagina(asientos.next_page_url)}
                                        disabled={!asientos.next_page_url}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Estado vacío */}
                {asientos.data.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No hay asientos contables
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Los asientos contables se generan automáticamente con las operaciones del sistema.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
