import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Barcode, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

// Helper para generar rutas
const route = (name: string, params?: Record<string, unknown> | number | string) => {
  const routes: Record<string, string> = {
    'dashboard': '/dashboard',
    'productos.index': '/productos',
    'codigos-barra.create': '/codigos-barra/create',
  };

  const baseRoute = routes[name] || '/';

  if (params && typeof params === 'object') {
    // Para parámetros de query
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return `${baseRoute}?${queryParams}`;
  }

  return baseRoute;
};

interface CodigoBarraDTO {
    id: number;
    codigo: string;
    tipo: string;
    es_principal: boolean;
    activo: boolean;
}

interface Producto {
    id: number;
    nombre: string;
    sku: string;
}

interface PageProps {
    producto: Producto;
    codigos: CodigoBarraDTO[];
    tipos: Array<{ label: string; value: string }>;
    total_codigos: number;
    codigo_principal: CodigoBarraDTO | null;
    [key: string]: any;
}

export default function CodigosBarraIndex() {
    const { producto, codigos, codigo_principal, total_codigos } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: route('dashboard') },
            { title: 'Productos', href: route('productos.index') },
            { title: producto.nombre, href: '#' },
            { title: 'Códigos de Barra', href: '#' },
        ]}>
            <div className="space-y-6 p-6 bg-white dark:bg-slate-950 rounded-lg">
                {/* Encabezado */}
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">🔲 Códigos de Barra</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Gestión de códigos de barra para <span className="font-semibold text-slate-900 dark:text-white">{producto.nombre}</span>
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

                {/* Botón para agregar nuevo código */}
                <div className="flex justify-end">
                    <Button
                        asChild
                        className="gap-2"
                    >
                        <a href={route('codigos-barra.create', { producto_id: producto.id })}>
                            <Plus className="w-4 h-4" />
                            Nuevo Código de Barra
                        </a>
                    </Button>
                </div>

                {/* Código principal */}
                {codigo_principal && (
                    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
                        <CardHeader>
                            <CardTitle className="text-blue-900 dark:text-blue-300">Código Principal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Barcode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{codigo_principal.codigo}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tipo: {codigo_principal.tipo}</p>
                                </div>
                                <Badge className="ml-auto bg-blue-600 dark:bg-blue-700">Principal</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de códigos */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                    <CardHeader className="border-b border-gray-200 dark:border-slate-800">
                        <CardTitle className="text-slate-900 dark:text-white">
                            Códigos de Barra ({total_codigos})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {codigos.length > 0 ? (
                            <div className="space-y-3">
                                {codigos.map((codigo) => (
                                    <div
                                        key={codigo.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition bg-white dark:bg-slate-800/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Barcode className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                                            <div>
                                                <p className="font-mono font-semibold text-lg text-slate-900 dark:text-white">{codigo.codigo}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Tipo: {codigo.tipo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {codigo.es_principal && (
                                                <Badge className="bg-green-600 dark:bg-green-700">Principal</Badge>
                                            )}
                                            {!codigo.activo && (
                                                <Badge variant="outline" className="text-gray-600 dark:text-gray-400 dark:border-gray-600">Inactivo</Badge>
                                            )}
                                            {codigo.activo && (
                                                <Badge variant="outline" className="text-green-600 dark:text-green-400 dark:border-green-500">Activo</Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Barcode className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No hay códigos de barra registrados</p>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-4 border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                                >
                                    <a href={route('codigos-barra.create', { producto_id: producto.id })}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear el primer código
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
