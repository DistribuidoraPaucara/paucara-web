// Modern Table Component with Enhanced UX
import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/presentation/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import {
    Edit,
    Trash2,
    MoreHorizontal,
    Eye,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import type { BaseEntity, TableColumn } from '@/domain/entities/generic';

interface ModernTableProps<T extends BaseEntity> {
    entities: T[];
    columns: TableColumn<T>[];
    onEdit: (entity: T) => void;
    onDelete: (entity: T) => void;
    onView?: (entity: T) => void;
    entityName: string;
    isLoading?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    showActions?: boolean;
    actionsLabel?: string;
    className?: string;
}

export default function ModernTable<T extends BaseEntity>({
    entities,
    columns,
    onEdit,
    onDelete,
    onView,
    entityName,
    isLoading = false,
    sortBy,
    sortDirection = 'asc',
    onSort,
    showActions = true,
    actionsLabel = 'Acciones',
    className = ''
}: ModernTableProps<T>) {

    const renderCellValue = (column: TableColumn<T>, entity: T) => {
        const value = entity[column.key];

        if (column.render) {
            return column.render(value, entity);
        }

        switch (column.type) {
            case 'boolean':
                return (
                    <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
                        {value ? 'Activo' : 'Inactivo'}
                    </Badge>
                );

            case 'number':
                return (
                    <span className="font-mono text-sm">
                        {typeof value === 'number' ? value.toLocaleString() : value || '-'}
                    </span>
                );

            case 'date':
                return value ? new Date(value as string).toLocaleDateString('es-BO') : '-';

            case 'text':
            default: {
                if (value === null || value === undefined) return '-';
                const stringValue = String(value);
                return stringValue.length > 50
                    ? `${stringValue.substring(0, 50)}...`
                    : stringValue;
            }
        }
    };

    const getSortIcon = (columnKey: string) => {
        if (!onSort || !columns.find(c => c.key === columnKey)?.sortable) return null;

        if (sortBy === columnKey) {
            return sortDirection === 'asc'
                ? <ArrowUp className="h-3 w-3 ml-1" />
                : <ArrowDown className="h-3 w-3 ml-1" />;
        }

        return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    };

    const handleHeaderClick = (columnKey: string) => {
        const column = columns.find(c => c.key === columnKey);
        if (column?.sortable && onSort) {
            onSort(String(columnKey));
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {columns.map((column) => (
                                <TableHead key={String(column.key)} className="font-semibold">
                                    {column.label}
                                </TableHead>
                            ))}
                            {showActions && <TableHead className="w-32">{actionsLabel}</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)}>
                                        <div className="h-4 bg-muted animate-pulse rounded"></div>
                                    </TableCell>
                                ))}
                                {showActions && (
                                    <TableCell>
                                        <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (!entities.length) {
        return (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay {entityName}s registrados
                </h3>
                <p className="text-muted-foreground text-sm">
                    Los datos aparecerán aquí cuando agregues tu primer {entityName}.
                </p>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border border-border overflow-hidden bg-card ${className}`}>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border">
                        {columns.map((column) => (
                            <TableHead
                                key={String(column.key)}
                                className={`font-semibold text-foreground ${column.sortable && onSort
                                        ? 'cursor-pointer hover:bg-muted/70 transition-colors select-none'
                                        : ''
                                    }`}
                                onClick={() => handleHeaderClick(String(column.key))}
                            >
                                <div className="flex items-center">
                                    {column.label}
                                    {getSortIcon(String(column.key))}
                                </div>
                            </TableHead>
                        ))}
                        {showActions && (
                            <TableHead className="w-32 font-semibold text-foreground">
                                {actionsLabel}
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entities.map((entity, index) => (
                        <TableRow
                            key={entity.id}
                            className={`
                hover:bg-muted/30 transition-colors border-b border-border/50
                ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
              `}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    className="py-3 text-sm text-foreground"
                                >
                                    {renderCellValue(column, entity)}
                                </TableCell>
                            ))}
                            {showActions && (
                                <TableCell className="py-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-muted"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Abrir menú</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            {onView && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => onView(entity)}
                                                        className="text-sm cursor-pointer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver detalles
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            )}
                                            <DropdownMenuItem
                                                onClick={() => onEdit(entity)}
                                                className="text-sm cursor-pointer"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onDelete(entity)}
                                                className="text-sm cursor-pointer text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
