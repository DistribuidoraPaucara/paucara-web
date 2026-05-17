import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Printer, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

type ReportType = 'movimientos' | 'productos-vendidos' | 'ventas';

interface ReportConfig {
  id: ReportType;
  label: string;
  description: string;
  prepareEndpoint: string;
  getEndpoint: string;
}

const REPORTS: ReportConfig[] = [
  {
    id: 'movimientos',
    label: 'Reporte de Movimientos',
    description: 'Movimientos de inventario',
    prepareEndpoint: '/api/stock/preparar-impresion-movimientos',
    getEndpoint: '/api/stock/imprimir-movimientos'
  },
  {
    id: 'productos-vendidos',
    label: 'Reporte de Productos Vendidos',
    description: 'Productos vendidos en el período',
    prepareEndpoint: '/api/stock/preparar-impresion-productos-vendidos',
    getEndpoint: '/api/stock/imprimir-productos-vendidos'
  },
  {
    id: 'ventas',
    label: 'Reporte de Ventas',
    description: 'Detalles de todas las ventas',
    prepareEndpoint: '/api/stock/preparar-impresion-ventas',
    getEndpoint: '/api/stock/imprimir-ventas'
  }
];

type DateFilterMode = 'single' | 'range';

export default function ImpresionReportes() {
  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const todayDate = getTodayDate();

  const [selectedReport, setSelectedReport] = useState<ReportType | ''>('');
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('single');
  const [singleDate, setSingleDate] = useState(todayDate);
  const [startDate, setStartDate] = useState(todayDate);
  const [endDate, setEndDate] = useState(todayDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast.error('❌ Selecciona un reporte');
      return;
    }

    const dateValidation = dateFilterMode === 'single'
      ? singleDate
      : startDate && endDate;

    if (!dateValidation) {
      toast.error('❌ Completa los filtros de fecha');
      return;
    }

    try {
      setIsLoading(true);

      const reportConfig = REPORTS.find(r => r.id === selectedReport);
      if (!reportConfig) return;

      // Build payload based on report type
      const payload: any = {};

      if (selectedReport === 'ventas' || selectedReport === 'movimientos') {
        // For ventas and movimientos, use filtros with date range
        payload.filtros = dateFilterMode === 'single'
          ? { fecha_desde: singleDate, fecha_hasta: singleDate }
          : { fecha_desde: startDate, fecha_hasta: endDate };
      } else if (selectedReport === 'productos-vendidos') {
        // For productos-vendidos, use fecha parameter
        payload.fecha = dateFilterMode === 'single' ? singleDate : startDate;
      }

      // Step 1: Prepare data (POST)
      console.log('📋 Preparando datos del reporte...', {
        endpoint: reportConfig.prepareEndpoint,
        payload
      });
      const prepareResponse = await fetch(reportConfig.prepareEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });

      if (!prepareResponse.ok) {
        throw new Error(`Error al preparar: ${prepareResponse.status}`);
      }

      const prepareData = await prepareResponse.json();
      console.log('✅ Datos preparados:', prepareData);

      if (!prepareData.success) {
        toast.error(prepareData.message || '❌ Error al preparar datos');
        return;
      }

      // Step 2: Retrieve HTML (GET)
      console.log('📥 Obteniendo HTML del reporte...', { endpoint: reportConfig.getEndpoint });
      const htmlResponse = await fetch(reportConfig.getEndpoint, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!htmlResponse.ok) {
        throw new Error(`Error al obtener HTML: ${htmlResponse.status}`);
      }

      const htmlData = await htmlResponse.json();
      console.log('✅ HTML obtenido:', { success: htmlData.success, cantidad: htmlData.cantidad });

      if (htmlData.success && htmlData.html) {
        // Abrir en ventana de impresión
        const printWindow = window.open('', '', 'width=1200,height=800');
        if (printWindow) {
          printWindow.document.write(htmlData.html);
          printWindow.document.close();
          printWindow.print();
          toast.success('✅ Reporte listo para imprimir');
        }
      } else {
        toast.error(htmlData.message || '❌ Error al generar el reporte');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Error al generar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedReport('');
    setDateFilterMode('single');
    setSingleDate(todayDate);
    setStartDate(todayDate);
    setEndDate(todayDate);
  };

  const selectedReportConfig = REPORTS.find(r => r.id === selectedReport);
  const isFormValid = selectedReport && (
    dateFilterMode === 'single' ? singleDate : (startDate && endDate)
  );

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Reportes', href: '/reportes' },
      { title: 'Impresión de Reportes', href: '#' }
    ]}>
      <Head title="Impresión de Reportes" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impresión de Reportes</h1>
          <p className="text-muted-foreground">
            Genera reportes filtrados por fecha para imprimir
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selección de Reporte */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Seleccionar Reporte</CardTitle>
              <CardDescription>Elige el tipo de reporte a generar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {REPORTS.map(report => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-border hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{report.label}</div>
                  <div className="text-xs text-muted-foreground">{report.description}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Filtros de Fecha */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Filtros de Fecha</CardTitle>
              <CardDescription>
                {selectedReportConfig
                  ? `Filtra ${selectedReportConfig.label.toLowerCase()}`
                  : 'Selecciona un reporte primero'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Filtro */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Tipo de Filtro</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="single"
                      checked={dateFilterMode === 'single'}
                      onChange={(e) => setDateFilterMode(e.target.value as DateFilterMode)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Una fecha específica</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="range"
                      checked={dateFilterMode === 'range'}
                      onChange={(e) => setDateFilterMode(e.target.value as DateFilterMode)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Rango de fechas</span>
                  </label>
                </div>
              </div>

              {/* Fecha Única */}
              {dateFilterMode === 'single' && (
                <div>
                  <Label htmlFor="single-date" className="text-sm font-semibold mb-2 block">
                    Fecha *
                  </Label>
                  <Input
                    id="single-date"
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Rango de Fechas */}
              {dateFilterMode === 'range' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-sm font-semibold mb-2 block">
                      Fecha Inicio *
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-sm font-semibold mb-2 block">
                      Fecha Fin *
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleGenerateReport}
                  disabled={!isFormValid || isLoading}
                  className="gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Printer className="w-4 h-4" />
                  {isLoading ? 'Generando...' : 'Generar e Imprimir'}
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={isLoading}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpiar
                </Button>
              </div>

              {/* Información */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>💡 Tip:</strong> El reporte se abrirá en una ventana emergente listo para imprimir. Asegúrate de tener habilitadas las ventanas emergentes en tu navegador.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
