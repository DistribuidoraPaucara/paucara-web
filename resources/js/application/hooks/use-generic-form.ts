// Application Layer: Generic hook for form management - Updated with notifications (Fixed)
import { useForm, router } from '@inertiajs/react';
import { useCallback, useEffect } from 'react';
import type { BaseEntity, BaseFormData, BaseService } from '@/domain/entities/generic';
import NotificationService from '@/infrastructure/services/notification.service';

export function useGenericForm<T extends BaseEntity, F extends BaseFormData>(
  entity: T | null | undefined,
  service: BaseService<T, F>,
  initialData: F
) {
  const { data, setData, post, put, processing, errors, reset } = useForm<F>(
    entity ? { ...initialData, ...entity } : initialData
  );

  // Sincronizar cuando cambia la entidad (p. ej., al abrir "editar")
  // Esto asegura que el formulario se hidrate con los valores actuales del servidor.
  // También revierte a initialData cuando no hay entidad (modo crear).
  useEffect(() => {
    if (entity) {
      // Filtrar campos de archivo que son strings (rutas) para no enviarlos en actualizaciones
      const entityData = { ...entity };
      const fileFields = ['foto_perfil', 'ci_anverso', 'ci_reverso', 'imagen', 'foto', 'archivo', 'logo', 'logo_principal', 'logo_compacto', 'logo_footer', 'perfil', 'galeria'];

      Object.keys(entityData).forEach((key) => {
        const value = entityData[key as keyof typeof entityData];
        // Si es un campo de archivo y es un string (ruta), no lo ponemos en el formulario
        // Solo guardamos null para que no se envíe al backend
        if (fileFields.some(field => key.includes(field)) && typeof value === 'string') {
          // Guardamos la ruta en un campo especial para preview pero no en el campo real
          // Asegurar que la ruta tenga el prefijo /storage/ para que sea accesible
          let previewPath = value;
          if (!previewPath.startsWith('/storage/')) {
            previewPath = `/storage/${previewPath}`;
          }
          (entityData as any)[`${key}_preview`] = previewPath;
          (entityData as any)[key] = null;
        }
      });

      setData((prev) => ({ ...prev, ...entityData } as F));
    } else {
      setData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  // Validar datos del formulario con notificaciones
  const validateForm = useCallback(() => {
    const validationErrors = service.validateData(data);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error: string) => {
        NotificationService.error(error);
      });
      return false;
    }

    return true;
  }, [data, service]);

  // Enviar formulario con notificaciones elegantes
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isEditing = !!entity;
    const entityName = entity && 'nombre' in entity ? String(entity.nombre) : 'registro';

    if (isEditing) {
      // Preparar datos usando el método del servicio si existe
      let preparedData = data;
      if ('prepareDataForBackend' in service && typeof service.prepareDataForBackend === 'function') {
        preparedData = service.prepareDataForBackend(data);
      }

      // Filtrar datos: eliminar campos null/undefined y campos _preview
      // ✅ NUEVO: Permitir que ciertos campos sean null usando __allowNullFields
      const allowNullFields = (preparedData as any).__allowNullFields || [];
      const cleanData = Object.entries(preparedData).reduce((acc, [key, value]) => {
        // No enviar campos _preview (solo son para mostrar)
        if (key.endsWith('_preview')) {
          return acc;
        }

        // No enviar campos especiales internos
        if (key === '__allowNullFields') {
          return acc;
        }

        // No enviar campos null o undefined (archivos no cambiados)
        // EXCEPT si están marcados en __allowNullFields
        if (value === null || value === undefined) {
          if (!allowNullFields.includes(key)) {
            return acc;
          }
          // Si está en allowNullFields, permitir que se envíe null
        }

        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

      // Detectar si hay archivos nuevos
      const hasNewFiles = Object.values(cleanData).some(value => value instanceof File);

      // LOG: Ver datos que se están enviando
      console.group('🔍 DATOS ENVIADOS AL BACKEND - UPDATE');
      console.log('URL:', service.updateUrl(entity.id));
      console.log('Método: PUT');
      console.log('Datos limpios (sin nulls ni _preview):', cleanData);
      console.log('¿Tiene archivos nuevos?:', hasNewFiles);
      console.log('Content-Type:', hasNewFiles ? 'multipart/form-data' : 'application/json');
      console.groupEnd();

      // Crear promesa para actualización
      const updatePromise = new Promise<void>((resolve, reject) => {
        if (hasNewFiles) {
          // Si hay archivos, construir FormData manualmente para asegurar que todos los campos se incluyan
          const formData = new FormData();

          Object.entries(cleanData).forEach(([key, value]) => {
            if (value instanceof File) {
              // Agregar archivo
              formData.append(key, value);
            } else if (value === null || value === undefined) {
              // No agregar nulls
            } else if (typeof value === 'object') {
              // Convertir objetos a JSON
              formData.append(key, JSON.stringify(value));
            } else {
              // Agregar valores simples
              formData.append(key, String(value));
            }
          });

          // Agregar _method=PUT para que Laravel lo procese como PUT
          formData.append('_method', 'PUT');

          console.log('📤 FormData enviado (manual):');
          Array.from(formData.entries()).forEach(([key, value]) => {
            if (value instanceof File) {
              console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
            } else {
              console.log(`  ${key}: ${String(value).substring(0, 100)}`);
            }
          });

          router.post(service.updateUrl(entity.id), formData as any, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              console.log('✅ Actualización exitosa');
              resolve();
            },
            onError: (serverErrors) => {
              console.error('❌ Error en actualización:', serverErrors);
              if (serverErrors && typeof serverErrors === 'object') {
                Object.values(serverErrors as unknown as Record<string, string[]>).flat().forEach((error) => {
                  NotificationService.error(String(error));
                });
              }
              reject(new Error('Error al actualizar'));
            },
          });
        } else {
          // Sin archivos, usar PUT normal
          router.put(service.updateUrl(entity.id), cleanData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              console.log('✅ Actualización exitosa');
              resolve();
            },
            onError: (serverErrors) => {
              console.error('❌ Error en actualización:', serverErrors);
              if (serverErrors && typeof serverErrors === 'object') {
                Object.values(serverErrors as unknown as Record<string, string[]>).flat().forEach((error) => {
                  NotificationService.error(String(error));
                });
              }
              reject(new Error('Error al actualizar'));
            },
          });
        }
      });

      NotificationService.promise(updatePromise, {
        loading: `Actualizando ${entityName}...`,
        success: `${entityName} actualizado correctamente`,
        error: 'Error al actualizar el registro'
      });
    } else {
      // Preparar datos usando el método del servicio si existe
      let preparedData = data;
      if ('prepareDataForBackend' in service && typeof service.prepareDataForBackend === 'function') {
        preparedData = service.prepareDataForBackend(data);
      }

      // LOG: Ver datos que se están enviando
      console.group('🔍 DATOS ENVIADOS AL BACKEND - CREATE');
      console.log('URL:', service.storeUrl());
      console.log('Método: POST');
      console.log('ForceFormData: true');
      console.log('Datos completos:', preparedData);
      console.log('Datos serializados:', JSON.stringify(preparedData, null, 2));
      console.groupEnd();

      // Crear promesa para creación
      const createPromise = new Promise<void>((resolve, reject) => {
        router.post(service.storeUrl(), preparedData as any, {
          forceFormData: true,
          onSuccess: () => {
            console.log('✅ Creación exitosa');
            resolve();
          },
          onError: (serverErrors) => {
            console.error('❌ Error en creación:', serverErrors);
            // Mostrar errores específicos del servidor
            if (serverErrors && typeof serverErrors === 'object') {
              Object.values(serverErrors as unknown as Record<string, string[]>).flat().forEach((error) => {
                NotificationService.error(String(error));
              });
            }
            reject(new Error('Error al crear'));
          },
        });
      });

      NotificationService.promise(createPromise, {
        loading: 'Creando registro...',
        success: 'Registro creado correctamente',
        error: 'Error al crear el registro'
      });
    }
  }, [entity, validateForm, post, put, service, data]);

  // Manejar cambios en los campos
  const handleFieldChange = useCallback((field: keyof F, value: unknown) => {
    console.log(`📝 Campo cambiado: ${String(field)} =`, value);
    setData({ ...(data as F), [field]: value } as F);
  }, [setData, data]);

  // Resetear formulario con notificación
  const handleReset = useCallback(() => {
    reset();
    NotificationService.info('Formulario restablecido');
  }, [reset]);

  return {
    // Estado del formulario
    data,
    errors,
    processing,

    // Acciones
    handleSubmit,
    handleFieldChange,
    handleReset,

    // Utilidades
    isEditing: !!entity,
  };
}
