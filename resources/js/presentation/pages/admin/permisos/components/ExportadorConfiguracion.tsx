import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import type { ModuloSidebar } from '@/domain/entities/admin-permisos';
import { Download, FileJson, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportadorConfiguracionProps {
  modulos: ModuloSidebar[];
}

type FormatoExportacion = 'csv' | 'json' | 'excel';

export function ExportadorConfiguracion({ modulos }: ExportadorConfiguracionProps) {
  const [formato, setFormato] = useState<FormatoExportacion>('csv');
  const [descargando, setDescargando] = useState(false);
  const [opcionesExportar, setOpcionesExportar] = useState({
    listaModulos: true,
    incluirPermisos: true,
    incluirEstado: true,
  });

  // Convertir módulos a CSV
  const generarCSV = (): string => {
    const headers = ['ID', 'Título', 'Ruta', 'Tipo', 'Categoría', 'Estado', 'Orden', 'Icono'];
    if (opcionesExportar.incluirPermisos) headers.push('Permisos');

    const rows = modulos.map((m) => {
      const fila = [
        m.id,
        m.titulo,
        m.ruta,
        m.es_submenu ? 'Submódulo' : 'Principal',
        m.categoria || 'Sin categoría',
        opcionesExportar.incluirEstado ? (m.activo ? 'Activo' : 'Inactivo') : '',
        m.orden,
        m.icono || '',
      ];

      if (opcionesExportar.incluirPermisos) {
        fila.push((m.permisos || []).join(';'));
      }

      return fila;
    });

    // Escapetar comillas en datos
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    return csvContent;
  };

  // Convertir módulos a JSON
  const generarJSON = (): string => {
    const datos = modulos.map((m) => ({
      id: m.id,
      titulo: m.titulo,
      ruta: m.ruta,
      tipo: m.es_submenu ? 'submenu' : 'principal',
      categoria: m.categoria,
      ...(opcionesExportar.incluirEstado && { activo: m.activo }),
      orden: m.orden,
      icono: m.icono,
      ...(opcionesExportar.incluirPermisos && { permisos: m.permisos || [] }),
    }));

    return JSON.stringify(
      {
        exportacion: {
          fecha: new Date().toISOString(),
          total_modulos: modulos.length,
          modulos: datos,
        },
      },
      null,
      2
    );
  };

  // Descargar archivo CSV
  const descargarCSV = () => {
    const csv = generarCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `modulos-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar archivo JSON
  const descargarJSON = () => {
    const json = generarJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `config-modulos-${new Date().getTime()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar Excel (requiere xlsx)
  const descargarExcel = async () => {
    try {
      // Importar dinámicamente para no afectar si no está instalado
      const XLSX = await import('xlsx');

      const workbook = XLSX.utils.book_new();

      // Hoja 1: Módulos
      const modulosData = modulos.map((m) => ({
        ID: m.id,
        'Título': m.titulo,
        'Ruta': m.ruta,
        'Tipo': m.es_submenu ? 'Submódulo' : 'Principal',
        'Categoría': m.categoria || 'Sin categoría',
        ...(opcionesExportar.incluirEstado && { 'Estado': m.activo ? 'Activo' : 'Inactivo' }),
        'Orden': m.orden,
        'Icono': m.icono || '',
        ...(opcionesExportar.incluirPermisos && { 'Permisos': (m.permisos || []).join('; ') }),
      }));

      const worksheetModulos = XLSX.utils.json_to_sheet(modulosData);
      XLSX.utils.book_append_sheet(workbook, worksheetModulos, 'Módulos');

      // Hoja 2: Resumen
      const estadisticas = [
        { Métrica: 'Total de Módulos', Valor: modulos.length },
        { Métrica: 'Módulos Activos', Valor: modulos.filter((m) => m.activo).length },
        { Métrica: 'Módulos Inactivos', Valor: modulos.filter((m) => !m.activo).length },
        { Métrica: 'Módulos Principales', Valor: modulos.filter((m) => !m.es_submenu).length },
        { Métrica: 'Submódulos', Valor: modulos.filter((m) => m.es_submenu).length },
        { Métrica: 'Con Permisos Asignados', Valor: modulos.filter((m) => m.permisos && m.permisos.length > 0).length },
      ];

      const worksheetEstadisticas = XLSX.utils.json_to_sheet(estadisticas);
      XLSX.utils.book_append_sheet(workbook, worksheetEstadisticas, 'Resumen');

      // Generar archivo
      XLSX.writeFile(workbook, `config-modulos-${new Date().getTime()}.xlsx`);
      toast.success('Archivo Excel descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar Excel. Asegúrate de tener instalada la librería xlsx');
      console.error(error);
    }
  };

  // Manejar descarga
  const manejarDescarga = async () => {
    setDescargando(true);
    try {
      switch (formato) {
        case 'csv':
          descargarCSV();
          toast.success('Archivo CSV descargado correctamente');
          break;
        case 'json':
          descargarJSON();
          toast.success('Archivo JSON descargado correctamente');
          break;
        case 'excel':
          await descargarExcel();
          break;
      }
    } catch (error) {
      toast.error('Error al descargar el archivo');
      console.error(error);
    } finally {
      setDescargando(false);
    }
  };

  if (modulos.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Configuración de Módulos
        </CardTitle>
        <CardDescription>
          Descarga la configuración de módulos en diferentes formatos para backup, análisis o importación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Opciones de formato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CSV */}
          <div
            onClick={() => setFormato('csv')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              formato === 'csv'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {formato === 'csv' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">CSV</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Formato de valores separados por comas, compatible con Excel y Google Sheets
            </p>
          </div>

          {/* JSON */}
          <div
            onClick={() => setFormato('json')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              formato === 'json'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileJson className="h-5 w-5 text-purple-600" />
              {formato === 'json' && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">JSON</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Formato JSON estructurado, ideal para backup y restauración de configuración
            </p>
          </div>

          {/* Excel */}
          <div
            onClick={() => setFormato('excel')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              formato === 'excel'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              {formato === 'excel' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Excel</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Múltiples hojas con módulos, resumen y estadísticas
            </p>
          </div>
        </div>

        {/* Opciones de exportación */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Opciones de exportación</h4>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={opcionesExportar.listaModulos}
              disabled
              className="cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Incluir lista de módulos (siempre activado)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={opcionesExportar.incluirPermisos}
              onChange={(e) =>
                setOpcionesExportar({ ...opcionesExportar, incluirPermisos: e.target.checked })
              }
              className="cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Incluir permisos asignados</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={opcionesExportar.incluirEstado}
              onChange={(e) =>
                setOpcionesExportar({ ...opcionesExportar, incluirEstado: e.target.checked })
              }
              className="cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Incluir estado (activo/inactivo)</span>
          </label>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100">
          Exportando {modulos.length} módulos en formato{' '}
          <Badge variant="outline" className="ml-1">
            {formato.toUpperCase()}
          </Badge>
        </div>

        {/* Botón de descarga */}
        <Button
          onClick={manejarDescarga}
          disabled={descargando || modulos.length === 0}
          className="w-full"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {descargando ? 'Descargando...' : 'Descargar'}
        </Button>
      </CardContent>
    </Card>
  );
}
