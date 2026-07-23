// Application Layer: Generic container - Updated with Modern Filters
import { useGenericEntities } from '@/application/hooks/use-generic-entities';
import type { BaseEntity, BaseFormData, BaseService, ModuleConfig } from '@/domain/entities/generic';
import type { Pagination } from '@/domain/entities/shared';
import GenericPagination from '@/presentation/components/generic/generic-pagination';
import GenericTable from '@/presentation/components/generic/generic-table';
import ModernFilters from '@/presentation/components/generic/modern-filters';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/presentation/components/ui/card';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface GenericContainerProps<T extends BaseEntity, F extends BaseFormData> {
    entities: Pagination<T> | undefined;
    filters: Record<string, string | number | boolean | null | undefined>;
    config: ModuleConfig<T, F>;
    service: BaseService<T, F>;
    extraData?: { categorias?: { id: number; nombre: string }[]; marcas?: { id: number; nombre: string }[]; [key: string]: unknown };
}

export default function GenericContainer<T extends BaseEntity, F extends BaseFormData>({
    entities,
    filters,
    config,
    service,
    extraData,
}: GenericContainerProps<T, F>) {
    const { isLoading, searchEntities, deleteEntity, navigateToEdit, clearFilters } = useGenericEntities<T, F>(service);

    const [viewMode, setViewMode] = useState<'table' | 'cards'>(config.enableCardView ? 'cards' : 'table');

    // Verificación defensiva para entities
    if (!entities) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">Cargando datos...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleDelete = (entity: T) => {
        deleteEntity(entity, config.singularName);
    };

    const renderCards = () => {
        if (!config.cardRenderer) return null;
        if (!entities.data.length) {
            return (
                <div className="rounded-lg border border-dashed border-border py-12 text-center">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">No hay {config.pluralName}</h3>
                    <p className="mb-4 text-muted-foreground">Agrega tu primer {config.singularName} para empezar.</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href={service.createUrl()}>Nuevo {config.singularName}</Link>
                    </Button>
                </div>
            );
        }
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {entities.data.map((entity) => (
                    <div key={entity.id}>{config.cardRenderer!(entity, { onEdit: navigateToEdit, onDelete: handleDelete }, extraData)}</div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title={config.displayName} />
            <div>
                <div className="shadow-sm">
                    <div className="flex flex-col gap-1 p-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
                                <div className="rounded-lg bg-blue-600 p-2">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                </div>
                                {config.displayName}
                            </div>
                            <div className="flex items-center gap-4 p-1 text-sm text-muted-foreground">
                                <span>{config.description}</span>
                                <div className="flex items-center gap-1">
                                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                                        {entities?.total || 0} total
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Acciones adicionales (si las hay) */}
                            {extraData?.headerActions && (
                                <>
                                    {extraData.headerActions}
                                </>
                            )}
                            {config.enableCardView && (
                                <div className="flex divide-x divide-border overflow-hidden rounded-md border border-border bg-card">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('cards')}
                                        className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary ${viewMode === 'cards' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
                                        title="Vista de tarjetas"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h7V4H4a2 2 0 00-2 2v3h2V6zm9 0h7V4h-7v2zm0 0v3h2V8h-2zM4 13h7v-2H4v2zm9 0h7v-2h-7v2zm0 0v3h2v-1h-2zM4 20h7v-2H4v2zm9 0h7v-2h-7v2z"
                                            />
                                        </svg>
                                        Tarjetas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary ${viewMode === 'table' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
                                        title="Vista de tabla"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h18M3 14h18M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
                                            />
                                        </svg>
                                        Tabla
                                    </button>
                                </div>
                            )}
                            <Button asChild className="bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700">
                                <Link href={service.createUrl()}>
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo {config.singularName}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 p-2">
                        {/* Modern Filters */}
                        {config.indexFilters && (
                            <ModernFilters
                                config={config.indexFilters}
                                currentFilters={filters as Record<string, string | number | boolean | undefined>}
                                onApplyFilters={(newFilters) => searchEntities(newFilters)}
                                onResetFilters={clearFilters}
                                extraData={extraData}
                                isLoading={isLoading}
                            />
                        )}

                        {viewMode === 'table' && (
                            <GenericTable<T>
                                entities={entities.data}
                                columns={config.tableColumns}
                                onEdit={navigateToEdit}
                                onDelete={handleDelete}
                                entityName={config.singularName}
                                isLoading={isLoading}
                                puedeEditar={(extraData as any)?.puedeEditar ?? true}
                                puedeEliminar={(extraData as any)?.puedeEliminar ?? true}
                            />
                        )}

                        {viewMode === 'cards' && <div>{renderCards()}</div>}

                        {isLoading && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="space-y-3 rounded-xl border border-border p-3">
                                        <Skeleton className="h-32 w-full rounded-md" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-3 w-12" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {entities.links && entities.total > 0 && (
                        <CardFooter className="border-t border-border bg-secondary py-2">
                            <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <span>
                                        Mostrando <span className="font-semibold text-foreground">{entities.from}</span> a{' '}
                                        <span className="font-semibold text-foreground">{entities.to}</span> de{' '}
                                        <span className="font-semibold text-foreground">{entities.total}</span> resultados
                                    </span>
                                    {entities.total > 10 && <div className="h-4 w-px bg-border"></div>}
                                    {entities.total > 10 && (
                                        <span className="text-xs text-muted-foreground">
                                            Página {entities.current_page} de {entities.last_page}
                                        </span>
                                    )}
                                </div>
                                <GenericPagination links={entities.links} isLoading={isLoading} />
                            </div>
                        </CardFooter>
                    )}
                </div>
            </div>
        </>
    );
}
