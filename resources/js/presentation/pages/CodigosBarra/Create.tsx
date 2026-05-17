import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Barcode, ArrowLeft, Zap, Loader, Trash2, Star, Check } from 'lucide-react';

// Helper para generar rutas
const route = (name: string, params?: Record<string, unknown> | number | string) => {
  const routes: Record<string, string> = {
    'dashboard': '/dashboard',
    'productos.index': '/productos',
    'codigos-barra.index': '/codigos-barra',
    'codigos-barra.store': '/codigos-barra',
  };

  const baseRoute = routes[name] || '/';

  if (params && typeof params === 'object') {
    // Para parámetros de query
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return `${baseRoute}?${queryParams}`;
  }

  return baseRoute;
};

interface Producto {
    id: number;
    nombre: string;
    sku: string;
}

interface TipoCodigoBarraOption {
    label: string;
    value: string;
}

interface CodigoBarraDTO {
    id: number;
    codigo: string;
    tipo: string;
    es_principal: boolean;
    created_at: string;
}

interface PageProps {
    producto: Producto;
    tipos: TipoCodigoBarraOption[];
    codigosExistentes: CodigoBarraDTO[];
    [key: string]: any;
}

export default function CodigosBarraCreate() {
    const { producto, tipos, codigosExistentes: initialCodigos } = usePage<PageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [codigos, setCodigos] = useState<CodigoBarraDTO[]>(initialCodigos || []);

    const { data, setData, post, errors } = useForm({
        producto_id: producto.id,
        codigo: '',
        tipo: tipos[0]?.value || 'ean13',
        es_principal: false,
    });

    const handleGenerateCode = async () => {
        setIsGenerating(true);
        try {
            // Obtener el token CSRF del meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/api/codigos-barra/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al generar el código');
            }

            const result = await response.json();
            setData('codigo', result.codigo);
            toast.success(`Código ${result.codigo} generado correctamente`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(`Error: ${message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleResetForm = () => {
        setData({
            producto_id: producto.id,
            codigo: '',
            tipo: tipos[0]?.value || 'ean13',
            es_principal: false,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Hacer petición fetch en lugar de post() para controlar mejor la respuesta
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch(route('codigos-barra.store'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken || '',
            },
            body: JSON.stringify(data),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al guardar el código');
                }
                return response.json();
            })
            .then((result) => {
                // Agregar el nuevo código a la lista
                if (result.codigo) {
                    setCodigos([...codigos, result.codigo]);
                }
                toast.success('Código de barra guardado exitosamente');
                handleResetForm();
            })
            .catch((error) => {
                const message = error instanceof Error ? error.message : 'Error desconocido';
                toast.error(`Error: ${message}`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: route('dashboard') },
            { title: 'Productos', href: route('productos.index') },
            { title: producto.nombre, href: '#' },
            { title: 'Códigos de Barra', href: route('codigos-barra.index', { producto_id: producto.id }) },
            { title: 'Crear Nuevo', href: '#' },
        ]}>
            <div className="space-y-6 p-6 max-w-4xl bg-white dark:bg-slate-950 rounded-lg">
                {/* Encabezado */}
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">🔲 Gestionar Códigos de Barra</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Gestiona los códigos de barra para <span className="font-semibold text-slate-900 dark:text-white">{producto.nombre}</span>
                    </p>
                </div>

                {/* Información del producto */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                    <CardHeader className="border-b border-gray-200 dark:border-slate-800">
                        <CardTitle className="text-slate-900 dark:text-white">Información del Producto</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{producto.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">SKU</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{producto.sku}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Códigos Existentes */}
                {codigos.length > 0 && (
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                        <CardHeader className="border-b border-gray-200 dark:border-slate-800">
                            <CardTitle className="text-slate-900 dark:text-white">
                                Códigos Existentes ({codigos.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {codigos.map((codigo) => (
                                    <div
                                        key={codigo.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <code className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                                                    {codigo.codigo}
                                                </code>
                                                {codigo.es_principal && (
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" title="Código principal" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                                    {codigo.tipo}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(codigo.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {!codigo.es_principal && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600"
                                                title="Marcar como principal"
                                            >
                                                <Star className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Formulario */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                    <CardHeader className="border-b border-gray-200 dark:border-slate-800">
                        <CardTitle className="text-slate-900 dark:text-white">Datos del Código</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Código de Barra */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                                    Código de Barra *
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Barcode className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-600" />
                                        <Input
                                            type="text"
                                            placeholder="Ej: 1234567890123"
                                            value={data.codigo}
                                            onChange={(e) => setData('codigo', e.target.value)}
                                            className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateCode}
                                        disabled={isGenerating}
                                        className="px-4 border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                                        title="Generar código automáticamente"
                                    >
                                        {isGenerating ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Zap className="w-4 h-4" />
                                        )}
                                        <span className="ml-2">{isGenerating ? 'Generando...' : 'Generar'}</span>
                                    </Button>
                                </div>
                                {errors.codigo && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.codigo}</p>
                                )}
                            </div>

                            {/* Tipo de Código */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                                    Tipo de Código *
                                </label>
                                <select
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                >
                                    {tipos.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value} className="bg-white dark:bg-slate-800">
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.tipo && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.tipo}</p>
                                )}
                            </div>

                            {/* Es Principal */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="esPrincipal"
                                    checked={data.es_principal}
                                    onChange={(e) => setData('es_principal', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:accent-blue-500"
                                />
                                <label htmlFor="esPrincipal" className="ml-3 text-sm text-slate-900 dark:text-white">
                                    Marcar como código principal
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetForm}
                                    className="border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Limpiar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Código'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
