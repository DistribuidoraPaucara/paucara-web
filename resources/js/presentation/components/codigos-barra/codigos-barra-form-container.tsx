// Application Layer: Contenedor del formulario de códigos de barra
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import CodigosBarraFormFields from '@/presentation/components/codigos-barra/codigos-barra-form-fields';
import { useCodigosBarra } from '@/application/hooks/use-codigos-barra';
import codigosBarraService from '@/infrastructure/services/codigos-barra.service';
import { TipoCodigoEnum, type CodigoBarra, type CodigoBarraFormData, type TipoCodigoOption } from '@/domain/entities/codigos-barra';

interface CodigosBarraFormContainerProps {
  codigo?: CodigoBarra | null;
  productoId?: number;
  tiposDisponibles?: TipoCodigoOption[];
}

export default function CodigosBarraFormContainer({
  codigo,
  productoId,
  tiposDisponibles = [],
}: CodigosBarraFormContainerProps) {
  const isEditing = !!codigo;
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  const { generarCodigoAutomatico } = useCodigosBarra(productoId || 0);

  // Form data y manejo
  const { data, setData, post, put, processing, errors, reset } = useForm<CodigoBarraFormData>({
    producto_id: codigo?.producto_id || productoId || 0,
    codigo: codigo?.codigo || '',
    tipo: codigo?.tipo || TipoCodigoEnum.EAN,
    es_principal: codigo?.es_principal || false,
    activo: codigo?.activo !== false,
    auto_generar: false,
  });

  const pageTitle = isEditing ? 'Editar Código de Barra' : 'Nuevo Código de Barra';
  const submitButtonText = isEditing ? 'Actualizar Código' : 'Crear Código';

  // Manejar cambios en campos
  const handleFieldChange = (field: keyof CodigoBarraFormData, value: string | boolean | number) => {
    setData(field, value);
  };

  // Manejar generación de código
  const handleGenerarCodigo = async () => {
    try {
      const nuevoCodigoId = await generarCodigoAutomatico();
      if (nuevoCodigoId) {
        setCodigoGenerado(nuevoCodigoId);
        setData('codigo', nuevoCodigoId);
      }
    } catch (error) {
      console.error('Error al generar código:', error);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing && codigo) {
      put(codigosBarraService.updateUrl(codigo.id), {
        onSuccess: () => {
          console.log('Código actualizado exitosamente');
        },
        onError: (errors) => {
          console.error('Errores al actualizar:', errors);
        },
      });
    } else {
      post(codigosBarraService.storeUrl(), {
        onSuccess: () => {
          console.log('Código creado exitosamente');
          reset();
          setCodigoGenerado(null);
        },
        onError: (errors) => {
          console.error('Errores al crear:', errors);
        },
      });
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    reset();
    setCodigoGenerado(null);
  };

  return (
    <>
      <Head title={pageTitle} />

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{pageTitle}</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={codigosBarraService.indexUrl(productoId || 0)}>
                Volver al listado
              </Link>
            </Button>
          </div>
          {isEditing && codigo && (
            <p className="text-sm text-muted-foreground">
              Editando el código: <strong className="font-mono">{codigo.codigo}</strong>
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CodigosBarraFormFields
              data={data}
              errors={errors}
              tiposDisponibles={tiposDisponibles}
              onChange={handleFieldChange}
              onGenerarCodigo={handleGenerarCodigo}
              codigoGenerado={codigoGenerado}
              isLoading={processing}
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
