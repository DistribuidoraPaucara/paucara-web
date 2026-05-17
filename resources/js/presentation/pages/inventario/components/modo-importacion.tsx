import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import NotificationService from '@/infrastructure/services/notification.service';
import { useState, useRef } from 'react';
import type { Almacen, InventarioItem } from '@/domain/entities/inventario-inicial';

interface RowError {
    row: number;
    errors: string[];
}

interface ModoImportacionProps {
    almacenes: Almacen[];
    onCargarItems: (items: InventarioItem[]) => void;
}

// Función para normalizar texto (quitar tildes)
const normalizarTexto = (texto: string): string => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
};

// Función para convertir fechas a formato YYYY-MM-DD
const convertirFecha = (fecha: string): string => {
    if (!fecha || !fecha.trim()) return '';

    const fechaTrimmed = fecha.trim();

    // Si ya está en formato YYYY-MM-DD, retornar
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTrimmed)) {
        return fechaTrimmed;
    }

    // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fechaTrimmed)) {
        const partes = fechaTrimmed.split('/');
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const ano = partes[2];
        return `${ano}-${mes}-${dia}`;
    }

    // Si está en formato DD-MM-YYYY, convertir a YYYY-MM-DD
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(fechaTrimmed)) {
        const partes = fechaTrimmed.split('-');
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const ano = partes[2];
        return `${ano}-${mes}-${dia}`;
    }

    // Si no se puede convertir, retornar vacío
    return '';
};

const parseCSV = (content: string): string[][] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
        const fields = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current.trim());
        return fields;
    });
};

export default function ModoImportacion({
    almacenes = [],
    onCargarItems,
}: ModoImportacionProps) {
    const [preview, setPreview] = useState<string[][]>([]);
    const [errors, setErrors] = useState<RowError[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [productosCache, setProductosCache] = useState<Map<string, number>>(new Map());

    // Obtener token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token?.content || '';
    };

    const almacenMapNormalizado = new Map((almacenes || []).map(a => [normalizarTexto(a.nombre), a.id]));

    // Buscar producto en el backend
    const buscarProductoEnBackend = async (texto: string): Promise<number | undefined> => {
        const cacheKey = normalizarTexto(texto);

        // Verificar caché
        if (productosCache.has(cacheKey)) {
            return productosCache.get(cacheKey);
        }

        try {
            const response = await fetch('/productos/paginados/listar', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken(),
                },
                body: JSON.stringify({
                    page: 1,
                    per_page: 1,
                    search: texto,
                }),
            });

            if (!response.ok) {
                return undefined;
            }

            const data = await response.json();
            const productos = data.productos || [];

            if (productos.length > 0) {
                const productoId = productos[0].id;
                // Guardar en caché
                setProductosCache(prev => new Map(prev).set(cacheKey, productoId));
                return productoId;
            }

            return undefined;
        } catch (error) {
            console.error('Error buscando producto:', error);
            return undefined;
        }
    };

    const buscarProducto = async (texto: string): Promise<number | undefined> => {
        return buscarProductoEnBackend(texto);
    };

    const buscarAlmacen = (texto: string): number | undefined => {
        const normalizado = normalizarTexto(texto);
        return almacenMapNormalizado.get(normalizado);
    };

    const generarPlantilla = () => {
        const headers = ['Producto (Nombre o SKU)', 'Almacen', 'Cantidad', 'Lote', 'Fecha Vencimiento', 'Observaciones'];
        const ejemplo = [
            'Leche Entera',
            'Almacen Principal',
            '100',
            'LOTE-001',
            '2025-12-31',
            'Carga inicial',
        ];
        const ejemplo2 = [
            'SKU-12345',
            'Almacen Principal',
            '50',
            'LOTE-002',
            '30/11/2025',
            'Stock verificado',
        ];

        const csv = [headers, ejemplo, ejemplo2].map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'plantilla_inventario_inicial.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        NotificationService.success('Plantilla descargada');
    };

    const procesarArchivo = (file: File) => {
        if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
            NotificationService.error('Solo se permiten archivos CSV, XLS o XLSX');
            return;
        }

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const rows = parseCSV(content);

                if (rows.length < 2) {
                    NotificationService.error('El archivo debe contener encabezados y al menos una fila de datos');
                    setLoading(false);
                    return;
                }

                // La primera fila son los encabezados
                const headers = rows[0].map(h => h.toLowerCase());
                const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));

                setPreview(rows);
                await validarDatos(headers, dataRows);
            } catch (error) {
                NotificationService.error('Error al procesar el archivo');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        reader.readAsText(file);
    };

    const validarDatos = async (headers: string[], rows: string[][]) => {
        // Encontrar índices de columnas (búsqueda flexible)
        const indiceProd = headers.findIndex(h => h.includes('producto'));
        const indiceAlm = headers.findIndex(h => h.includes('almacen'));
        const indiceCant = headers.findIndex(h => h.includes('cantidad'));

        // Validar que existan columnas obligatorias
        const estructuraErrors: string[] = [];
        if (indiceProd === -1) {
            estructuraErrors.push('Columna "Producto" no encontrada en el archivo. Debe existir una columna que contenga la palabra "Producto"');
        }
        if (indiceAlm === -1) {
            estructuraErrors.push('Columna "Almacen" no encontrada en el archivo. Debe existir una columna que contenga la palabra "Almacen"');
        }
        if (indiceCant === -1) {
            estructuraErrors.push('Columna "Cantidad" no encontrada en el archivo. Debe existir una columna que contenga la palabra "Cantidad"');
        }

        if (estructuraErrors.length > 0) {
            setErrors([{ row: 1, errors: estructuraErrors }]);
            NotificationService.error('Error en la estructura del archivo: verififica que tiene todas las columnas obligatorias');
            return;
        }

        const rowErrors: RowError[] = [];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const errores: string[] = [];

            // Validar producto
            if (!row[indiceProd]?.trim()) {
                errores.push('❌ Producto: Campo vacío (requerido)');
            } else {
                const productoId = await buscarProducto(row[indiceProd]);
                if (!productoId) {
                    errores.push(`❌ Producto: "${row[indiceProd]}" no encontrado. Verifica que exista el nombre o SKU`);
                }
            }

            // Validar almacén
            if (!row[indiceAlm]?.trim()) {
                errores.push('❌ Almacén: Campo vacío (requerido)');
            } else {
                const almacenId = buscarAlmacen(row[indiceAlm]);
                if (!almacenId) {
                    const almacenesDisponibles = (almacenes || []).map(a => `"${a.nombre}"`).join(', ');
                    errores.push(`❌ Almacén: "${row[indiceAlm]}" no encontrado. Almacenes disponibles: ${almacenesDisponibles}`);
                }
            }

            // Validar cantidad
            if (!row[indiceCant]?.trim()) {
                errores.push('❌ Cantidad: Campo vacío (requerido)');
            } else {
                const cant = Number(row[indiceCant]);
                if (isNaN(cant)) {
                    errores.push(`❌ Cantidad: "${row[indiceCant]}" no es un número válido. Debe ser un número entero mayor a 0`);
                } else if (cant <= 0) {
                    errores.push(`❌ Cantidad: ${cant} es menor o igual a 0. Debe ser mayor a 0`);
                }
            }

            if (errores.length > 0) {
                rowErrors.push({ row: rowIndex + 2, errors: errores });
            }
        }

        setErrors(rowErrors);

        if (rowErrors.length > 0) {
            const totalErrores = rowErrors.reduce((sum, r) => sum + r.errors.length, 0);
            NotificationService.error(`Se encontraron ${totalErrores} error(es) en el archivo. Revisa los detalles abajo.`);
        } else {
            await cargarItemsDelArchivo(headers, rows);
        }
    };

    const cargarItemsDelArchivo = async (headers: string[], rows: string[][]) => {
        // Encontrar índices de columnas (búsqueda flexible)
        const indiceProd = headers.findIndex(h => h.includes('producto'));
        const indiceAlm = headers.findIndex(h => h.includes('almacen'));
        const indiceCant = headers.findIndex(h => h.includes('cantidad'));
        const indiceLote = headers.findIndex(h => h.includes('lote'));
        const indiceFecha = headers.findIndex(h => h.includes('fecha'));
        const indiceObs = headers.findIndex(h => h.includes('observacion'));

        const items: InventarioItem[] = [];

        for (const row of rows.filter(r => r.some(cell => cell.trim()))) {
            const productoId = await buscarProducto(row[indiceProd]);
            if (productoId) {
                items.push({
                    producto_id: productoId,
                    almacen_id: buscarAlmacen(row[indiceAlm]) || '',
                    cantidad: Number(row[indiceCant]) || '',
                    lote: row[indiceLote]?.trim() || '',
                    fecha_vencimiento: convertirFecha(row[indiceFecha] || ''),
                    observaciones: row[indiceObs]?.trim() || '',
                });
            }
        }

        onCargarItems(items);
        NotificationService.success(`Se cargaron ${items.length} items en la tabla`);
        setPreview([]);
        setErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Importar desde Archivo</h3>
                <p className="text-sm text-muted-foreground">
                    Carga múltiples productos desde un archivo CSV o Excel
                </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
                <Button
                    onClick={generarPlantilla}
                    variant="outline"
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    Descargar Plantilla
                </Button>
                <div className="flex-1">
                    <label className="cursor-pointer">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    procesarArchivo(file);
                                }
                            }}
                            disabled={loading}
                            className="hidden"
                        />
                        <Button
                            variant="default"
                            className="w-full gap-2"
                            asChild
                        >
                            <span>
                                <Upload className="h-4 w-4" />
                                {loading ? 'Procesando...' : 'Seleccionar Archivo'}
                            </span>
                        </Button>
                    </label>
                </div>
            </div>

            {/* Errores de validación */}
            {errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="font-semibold text-red-900 dark:text-red-100">
                            Se encontraron {errors.length} error{errors.length !== 1 ? 'es' : ''}
                        </p>
                    </div>
                    <ul className="space-y-1 ml-7">
                        {errors.map((error, idx) => (
                            <li key={idx} className="text-sm text-red-800 dark:text-red-200">
                                <strong>Fila {error.row}:</strong> {error.errors.join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Vista previa */}
            {preview.length > 0 && errors.length === 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="font-semibold text-green-900 dark:text-green-100">
                            Archivo validado correctamente ({preview.length - 1} registros)
                        </p>
                    </div>

                    <div className="overflow-x-auto max-h-64">
                        <table className="w-full text-xs border-collapse">
                            <thead className="bg-green-100 dark:bg-green-900/30">
                                <tr>
                                    {preview[0].map((header, idx) => (
                                        <th
                                            key={idx}
                                            className="border px-2 py-1 text-left font-semibold"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(1, 6).map((row, rowIdx) => (
                                    <tr key={rowIdx} className="border-b hover:bg-green-100/50 dark:hover:bg-green-900/10">
                                        {row.map((cell, cellIdx) => (
                                            <td
                                                key={cellIdx}
                                                className="border px-2 py-1 text-xs"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {preview.length > 6 && (
                        <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                            ... y {preview.length - 6} registros más
                        </p>
                    )}
                </div>
            )}

            {/* Instrucciones */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Instrucciones:</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Descarga la plantilla usando el botón "Descargar Plantilla"</li>
                    <li>Completa los campos:
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li><strong>Producto:</strong> Puedes usar el nombre del producto o su SKU</li>
                            <li><strong>Almacén:</strong> Nombre del almacén (funciona con o sin tildes, ej: "Almacen" o "Almacén")</li>
                            <li><strong>Cantidad:</strong> Número mayor a 0 (requerido)</li>
                            <li><strong>Fecha Vencimiento:</strong> Formato DD/MM/YYYY (ej: 31/12/2025) o YYYY-MM-DD (ej: 2025-12-31). Campo opcional</li>
                            <li>Los otros campos son opcionales</li>
                        </ul>
                    </li>
                    <li>Guarda el archivo en formato CSV o Excel</li>
                    <li>Selecciona el archivo aquí para validar e importar los datos</li>
                    <li>Los datos se cargarán en la tabla editable para revisar antes de guardar</li>
                </ol>
            </div>
        </div>
    );
}
