'use client';

import React, { useState, useEffect } from 'react';
import { useCajaStatus } from '@/application/hooks/use-caja-status';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';

/**
 * Componente: CajaStatusIndicator
 *
 * Responsabilidades:
 * ✅ Mostrar estado de caja en tiempo real
 * ✅ Indicador visual: Verde (abierta) / Rojo (cerrada)
 * ✅ Mostrar número de caja y monto actual
 * ✅ Botones rápidos: Abrir caja, Ver cajas
 * ✅ Accesible desde cualquier página
 *
 * Ubicación: Header principal de la aplicación
 */
export function CajaStatusIndicator() {
    const { tieneCapaAbierta, cajaActual, abrirCaja, irACajas } = useCajaStatus();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Si no hay caja abierta
    if (!tieneCapaAbierta) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 dark:hover:bg-slate-700">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive" className="dark:bg-red-900 dark:text-red-200">Sin Caja</Badge>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-700">
                    <DropdownMenuLabel className="flex items-center gap-2 dark:text-white">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Sin Caja Abierta
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-slate-700" />
                    <p className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                        Debes abrir una caja antes de realizar operaciones con dinero (ventas, compras, etc)
                    </p>
                    <DropdownMenuSeparator className="dark:bg-slate-700" />
                    <DropdownMenuItem onClick={abrirCaja} className="cursor-pointer dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        <span>Abrir Caja</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={irACajas} className="cursor-pointer dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700">
                        <Clock className="mr-2 h-4 w-4 dark:text-gray-400" />
                        <span>Ver todas las cajas</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Caja abierta
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 dark:hover:bg-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                        Caja Abierta
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-700">
                <DropdownMenuLabel className="flex items-center gap-2 dark:text-white">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Caja Abierta
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-slate-700" />

                <div className="px-2 py-3 space-y-2 text-sm">
                    {cajaActual.numero && (
                        <div className="flex justify-between dark:text-gray-300">
                            <span className="text-muted-foreground dark:text-gray-400">Caja:</span>
                            <span className="font-medium dark:text-white">{cajaActual.numero}</span>
                        </div>
                    )}

                    {cajaActual.monto !== null && (
                        <div className="flex justify-between dark:text-gray-300">
                            <span className="text-muted-foreground dark:text-gray-400">Monto Actual:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                                {new Intl.NumberFormat('es-BO', {
                                    style: 'currency',
                                    currency: 'BOB',
                                }).format(cajaActual.monto)}
                            </span>
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="dark:bg-slate-700" />
                <DropdownMenuItem onClick={irACajas} className="cursor-pointer dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700">
                    <Clock className="mr-2 h-4 w-4 dark:text-gray-400" />
                    <span>Gestionar cajas</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
