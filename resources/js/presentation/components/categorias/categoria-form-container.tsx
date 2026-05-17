// Application Layer: Contenedor del formulario de categorías
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import CategoriaFormFields from '@/presentation/components/categorias/categoria-form-fields';
import { useCategoriaForm } from '@/application/hooks/use-categoria-form';
import categoriasService from '@/infrastructure/services/categorias.service';
import type { Categoria } from '@/domain/entities/categorias';

interface CategoriaFormContainerProps {
  categoria?: Categoria | null;
}

export default function CategoriaFormContainer({ categoria }: CategoriaFormContainerProps) {
  const {
    data,
    errors,
    processing,
    handleSubmit,
    handleFieldChange,
    handleReset,
    isEditing,
  } = useCategoriaForm(categoria);

  const pageTitle = isEditing ? 'Editar Categoría' : 'Nueva Categoría';
  const submitButtonText = isEditing ? 'Actualizar Categoría' : 'Crear Categoría';

  return (
    <>
      <Head title={pageTitle} />

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{pageTitle}</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={categoriasService.indexUrl()}>
                Volver al listado
              </Link>
            </Button>
          </div>
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Editando la categoría: <strong>{categoria?.nombre}</strong>
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CategoriaFormFields
              data={data}
              errors={errors}
              onChange={handleFieldChange}
              disabled={processing}
            />

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={processing}
                className="flex-1"
              >
                {processing ? 'Guardando...' : submitButtonText}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={processing}
              >
                Limpiar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
