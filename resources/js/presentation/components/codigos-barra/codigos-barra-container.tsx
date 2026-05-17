// Application Layer: Contenedor principal de códigos de barra
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import CodigosBarraSearchBar from '@/presentation/components/codigos-barra/codigos-barra-search-bar';
import CodigosBarraTable from '@/presentation/components/codigos-barra/codigos-barra-table';
import { useCodigosBarra } from '@/application/hooks/use-codigos-barra';
import codigosBarraService from '@/infrastructure/services/codigos-barra.service';
import type { CodigoBarra, TipoCodigoOption } from '@/domain/entities/codigos-barra';
import { Plus, AlertCircle } from 'lucide-react';

interface CodigosBarraContainerProps {
  codigos: CodigoBarra[];
  producto: {
    id: number;
    nombre: string;
    sku: string;
  };
  tipos?: TipoCodigoOption[];
  total_codigos?: number;
  codigo_principal?: CodigoBarra | null;
}

export default function CodigosBarraContainer({
  codigos,
  producto,
  tipos = [],
  total_codigos = 0,
  codigo_principal = null,
}: CodigosBarraContainerProps) {
  const page = usePage();
  const { props } = page;

  const {
    isLoading,
    searchQuery,
    error,
    deleteCodigoM,
    navigateToCreate,
    navigateToEdit,
    handleSearchChange,
    handleSearch,
    clearFilters,
    marcarPrincipal,
  } = useCodigosBarra(producto.id);

  // Sincronizar estado local con filtros del servidor si es necesario
  useEffect(() => {
    if (props.filters?.q && props.filters.q !== searchQuery) {
      handleSearchChange(props.filters.q);
    }
  }, [props.filters?.q, searchQuery, handleSearchChange]);

  return (
    <>
      <Head title={`Códigos de Barra - ${producto.nombre}`} />

      <div className="space-y-4">
        {/* Header con navegación */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{producto.nombre}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {producto.sku}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/productos">Volver a Productos</Link>
            </Button>
          </CardHeader>
        </Card>

        {/* Información del código principal */}
        {codigo_principal && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                ★ Código Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold text-green-700">
                {codigo_principal.codigo}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Tipo: {codigo_principal.tipo_label || codigo_principal.tipo}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card principal de gestión */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Códigos de Barra</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona los códigos de barra del producto ({total_codigos} total)
              </p>
            </div>
            <Button onClick={() => navigateToCreate()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Código
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Mostrar errores */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}

            {/* Barra de búsqueda */}
            <CodigosBarraSearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearch={handleSearch}
              onClear={clearFilters}
              isLoading={isLoading}
            />

            {/* Tabla de códigos */}
            <CodigosBarraTable
              codigos={codigos}
              onEdit={navigateToEdit}
              onDelete={deleteCodigoM}
              onMarcarPrincipal={marcarPrincipal}
              isLoading={isLoading}
            />
          </CardContent>

          {/* Footer con información */}
          {codigos.length > 0 && (
            <CardFooter className="flex-col items-start space-y-2 border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {codigos.length} de {total_codigos} códigos
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Códigos activos: {codigos.filter((c) => c.activo).length}</li>
                <li>✓ Códigos principales: {codigos.filter((c) => c.es_principal).length}</li>
              </ul>
            </CardFooter>
          )}
        </Card>

        {/* Información de ayuda */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Información útil:</p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Cada producto debe tener al menos un código de barra activo</li>
                <li>• El código principal se usa por defecto en operaciones de POS</li>
                <li>• Los códigos inactivados se conservan en el historial</li>
                <li>• EAN-13 se valida automáticamente incluyendo dígito verificador</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
