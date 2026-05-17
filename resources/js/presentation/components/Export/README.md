# Arquitectura de Exportación - Distribuidora Paucará

Esta documentación describe la arquitectura de 3 capas implementada para la funcionalidad de exportación e impresión en la aplicación.

## Arquitectura de 3 Capas

### 1. Capa de Dominio (`domain/export.ts`)

Define los tipos, interfaces y contratos para la funcionalidad de exportación.

**Tipos principales:**

- `ExportFormat`: Formatos soportados (pdf, excel, csv, print)
- `ExportOptions`: Opciones de configuración para exportación
- `ExportData`: Estructura de datos para exportar
- `ExportTemplate`: Plantillas reutilizables de exportación
- `ExportService`: Interfaz del servicio de exportación

### 2. Capa de Servicios (`services/export.service.ts`)

Implementa la lógica de negocio para exportación e impresión.

**Funcionalidades:**

- Exportación a PDF usando jsPDF
- Exportación a Excel/CSV
- Exportación desde HTML usando html2canvas
- Impresión optimizada usando react-to-print

### 3. Capa de Presentación (`components/Export/`)

Componentes reutilizables para la interfaz de usuario.

**Componentes principales:**

- `ExportButtons`: Botones para diferentes formatos de exportación
- `PrintableContent`: Contenido optimizado para impresión
- `ExportProvider`: Context provider para funcionalidades avanzadas

## Uso Básico

### 1. Importar componentes y hooks

```tsx
import { ExportButtons, useExport } from '@/presentation/components/Export';
import { compraToExportData, getDefaultCompraExportOptions } from '@/lib/export-helpers';
```

### 2. Preparar datos para exportación

```tsx
const exportData = compraToExportData(compra);
const exportOptions = getDefaultCompraExportOptions(compra);
```

### 3. Usar componentes en el JSX

```tsx
<ExportButtons
    data={exportData}
    options={exportOptions}
    showPDF={true}
    showExcel={true}
    showCSV={true}
    showPrint={true}
    onExportStart={() => console.log('Exportación iniciada')}
    onExportEnd={() => console.log('Exportación completada')}
    onExportError={(error) => console.error('Error:', error)}
/>
```

## Uso Avanzado con Hook Personalizado

### 1. Usar el hook useExport

```tsx
const { exportToPDF, exportToExcel, exportToCSV, print, isExporting, error } = useExport();
```

### 2. Implementar manejadores personalizados

```tsx
const handleExportPDF = async () => {
    try {
        await exportToPDF(exportData, {
            filename: `compra_${compra.numero}_${new Date().toISOString().split('T')[0]}`,
            title: `Compra ${compra.numero}`
        });
    } catch (err) {
        console.error('Error exportando PDF:', err);
    }
};
```

## Implementación en Diferentes Módulos

### Para Compras

```tsx
// En pages/compras/show.tsx
import { ExportButtons, PrintableContent } from '@/presentation/components/Export';
import { compraToExportData, getDefaultCompraExportOptions } from '@/lib/export-helpers';

const exportData = compraToExportData(compra);
const exportOptions = getDefaultCompraExportOptions(compra);

// En el JSX
<ExportButtons data={exportData} options={exportOptions} />

// Para impresión
<div className="hidden print:block">
    <PrintableContent compra={compra} title={`Compra ${compra.numero}`} />
</div>
```

### Para Ventas

```tsx
// Crear helpers similares para ventas
export const ventaToExportData = (venta: Venta): ExportData => {
    // Implementación similar a compraToExportData
};

export const getDefaultVentaExportOptions = (venta: Venta): ExportOptions => {
    // Implementación similar a getDefaultCompraExportOptions
};
```

### Para Reportes

```tsx
// Para datos de tabla genéricos
const tableData: ExportData = {
    headers: ['Columna 1', 'Columna 2', 'Columna 3'],
    rows: [
        ['Dato 1', 'Dato 2', 'Dato 3'],
        ['Dato 4', 'Dato 5', 'Dato 6']
    ],
    metadata: {
        title: 'Mi Reporte',
        generatedAt: new Date(),
        generatedBy: 'Usuario'
    }
};
```

## Funcionalidades Soportadas

### Exportación a PDF

- Generación usando jsPDF
- Soporte para múltiples páginas
- Headers y footers personalizables
- Orientación portrait/landscape
- Tamaños de página personalizables

### Exportación a Excel/CSV

- Formato CSV estándar
- Compatible con Excel
- Manejo de caracteres especiales
- Encoding UTF-8

### Impresión

- Contenido optimizado para papel
- Usando react-to-print
- Estilos CSS específicos para impresión
- Soporte para headers/footers

### Exportación desde HTML

- Captura de elementos HTML usando html2canvas
- Conversión a PDF de alta calidad
- Mantiene estilos y layout

## Helpers y Utilidades

### `compraToExportData(compra: Compra): ExportData`

Convierte una compra al formato de exportación.

### `getDefaultCompraExportOptions(compra: Compra): ExportOptions`

Opciones por defecto para exportar compras.

### `tableDataToExportData(headers, rows, metadata): ExportData`

Convierte datos de tabla genéricos al formato de exportación.

### `createExportOptions(format, filename, overrides): ExportOptions`

Crea opciones de exportación personalizadas.

## Manejo de Errores

```tsx
const { error, clearError } = useExport();

// Mostrar errores al usuario
if (error) {
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button onClick={clearError}>Cerrar</button>
    </div>
}
```

## Estados de Carga

```tsx
const { isExporting } = useExport();

// Deshabilitar botones durante exportación
<ExportButtons
    data={exportData}
    disabled={isExporting}
/>
```

## Personalización de Estilos

### Para impresión

```css
@media print {
    .no-print {
        display: none !important;
    }

    .print-break {
        page-break-before: always;
    }
}
```

### Para PDF

```tsx
const customOptions: ExportOptions = {
    customStyles: {
        fontSize: '12px',
        margin: '20px'
    }
};
```

## Extensión a Otros Módulos

Para implementar en otros módulos:

1. **Crear helpers específicos:**

```tsx
// lib/venta-export-helpers.ts
export const ventaToExportData = (venta: Venta): ExportData => { ... };
export const getDefaultVentaExportOptions = (venta: Venta): ExportOptions => { ... };
```

2. **Crear componentes Printable específicos:**

```tsx
// components/Export/PrintableVentaContent.tsx
export const PrintableVentaContent = ({ venta, title }) => { ... };
```

3. **Actualizar tipos en domain:**

```tsx
// domain/venta.ts
export interface Venta {
    // propiedades de venta
}
```

## Dependencias Requeridas

Asegúrate de tener instaladas estas dependencias:

```json
{
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "react-to-print": "^2.14.13"
}
```

## Consideraciones de Rendimiento

- La exportación a PDF puede ser pesada para datasets grandes
- Considera paginación para exports muy grandes
- Usa `React.memo` para componentes de exportación si es necesario
- Implementa lazy loading para datos de exportación

## Compatibilidad del Navegador

- **PDF Export**: Todos los navegadores modernos
- **Excel/CSV Export**: Todos los navegadores
- **Print**: Todos los navegadores con soporte de impresión
- **HTML to PDF**: Navegadores con buen soporte de Canvas

## Solución de Problemas

### Error: "Elemento no encontrado"

- Asegúrate de que el ID del elemento existe en el DOM
- Verifica que el elemento no esté oculto

### Error: "Formato no soportado"

- Verifica que el formato esté en la lista de `ExportFormat`
- Asegúrate de que las dependencias estén instaladas

### PDF no se genera correctamente

- Verifica que jsPDF esté importado correctamente
- Revisa la configuración de opciones de exportación
- Considera el tamaño del contenido

### Impresión no funciona

- Verifica que react-to-print esté configurado correctamente
- Revisa los estilos CSS para impresión
- Considera usar el método nativo `window.print()` como fallback
