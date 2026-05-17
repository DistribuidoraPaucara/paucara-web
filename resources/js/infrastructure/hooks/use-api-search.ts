import { useState, useCallback } from 'react';

interface SearchOption {
    value: string | number;
    label: string;
    description?: string;
    codigos_barras?: string;
    precio_base?: number;
    stock_total?: number;
}

interface ApiItem {
    id: string | number;
    nombre: string;
    [key: string]: unknown;
}

interface ClienteItem extends ApiItem {
    email?: string;
    telefono?: string;
    nit?: string;
    razon_social?: string;
    tipo_cliente?: { nombre: string };
    activo?: boolean;
}

interface ProductoItem extends ApiItem {
    codigo: string;
    codigos_barras?: string;
    precio_base?: number;
    stock_total?: number;
    categoria?: { nombre: string };
    marca?: { nombre: string };
}

interface UseApiSearchOptions {
    endpoint: string;
    mapResults?: (item: ApiItem) => SearchOption;
    minQueryLength?: number;
}

export function useApiSearch({
    endpoint,
    mapResults = (item) => ({ value: item.id, label: item.nombre }),
    minQueryLength = 2
}: UseApiSearchOptions) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (query: string): Promise<SearchOption[]> => {
        if (!query || query.length < minQueryLength) {
            return [];
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}&limite=10`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                return data.data.map(mapResults);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, mapResults, minQueryLength]);

    return {
        search,
        isLoading,
        error,
        clearError: () => setError(null)
    };
}

// Hooks específicos para cada entidad
export function useProveedorSearch() {
    return useApiSearch({
        endpoint: '/api/proveedores/buscar',
        mapResults: (proveedor) => {
            const prov = proveedor as ProveedorItem & {
                razon_social?: string;
                nit?: string;
                telefono?: string;
                email?: string;
                contacto?: string;
                activo?: boolean;
            };

            const descriptionParts = [];

            if (prov.razon_social && prov.razon_social !== prov.nombre) {
                descriptionParts.push(`Razón Social: ${prov.razon_social}`);
            }

            if (prov.nit) {
                descriptionParts.push(`NIT/CI: ${prov.nit}`);
            }

            if (prov.telefono) {
                descriptionParts.push(`Tel: ${prov.telefono}`);
            }

            if (prov.email) {
                descriptionParts.push(`Email: ${prov.email}`);
            }

            if (prov.contacto) {
                descriptionParts.push(`Contacto: ${prov.contacto}`);
            }

            if (prov.activo === false) {
                descriptionParts.push('INACTIVO');
            }

            return {
                value: prov.id,
                label: prov.nombre,
                description: descriptionParts.join(' | '),
            };
        },
    });
}

export function useProductoSearch() {
    return useApiSearch({
        endpoint: '/api/productos/buscar',
        mapResults: (producto) => {
            const prod = producto as ProductoItem;
            const descriptionParts = [];

            if (prod.codigo) {
                descriptionParts.push(`Código: ${prod.codigo}`);
            }

            if (prod.codigos_barras) {
                descriptionParts.push(`CB: ${prod.codigos_barras}`);
            }

            if (prod.stock_total !== undefined) {
                descriptionParts.push(`Stock: ${prod.stock_total}`);
            }

            if (prod.categoria?.nombre) {
                descriptionParts.push(`Cat: ${prod.categoria.nombre}`);
            }

            if (prod.marca?.nombre) {
                descriptionParts.push(`Marca: ${prod.marca.nombre}`);
            }

            return {
                value: prod.id,
                label: prod.nombre,
                description: descriptionParts.join(' | '),
                codigos_barras: prod.codigos_barras,
                precio_base: prod.precio_base,
                stock_total: prod.stock_total,
            };
        },
    });
}

export function useClienteSearch() {
    return useApiSearch({
        endpoint: '/api/clientes/buscar',
        mapResults: (cliente) => {
            const cli = cliente as ClienteItem;

            const descriptionParts = [];

            if (cli.razon_social && cli.razon_social !== cli.nombre) {
                descriptionParts.push(`Razón Social: ${cli.razon_social}`);
            }

            if (cli.nit) {
                descriptionParts.push(`NIT/CI: ${cli.nit}`);
            }

            if (cli.telefono) {
                descriptionParts.push(`Tel: ${cli.telefono}`);
            }

            if (cli.email) {
                descriptionParts.push(`Email: ${cli.email}`);
            }

            if (cli.tipo_cliente?.nombre) {
                descriptionParts.push(`Tipo: ${cli.tipo_cliente.nombre}`);
            }

            if (cli.activo === false) {
                descriptionParts.push('INACTIVO');
            }

            return {
                value: cli.id,
                label: cli.nombre,
                description: descriptionParts.join(' | '),
            };
        },
    });
}
