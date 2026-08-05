// Pages: Clientes form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import ClienteFormHeader from '@/presentation/components/clientes/ClienteFormHeader';
import { clientesConfig } from '@/config/modules/clientes.config';
import { clientesService } from '@/infrastructure/services/clientes.service';
import type { Cliente, ClienteFormData, ClientesFormPageProps } from '@/domain/entities/clientes';

const baseInitialData: ClienteFormData = {
  nombre: '',
  razon_social: '',
  nit: '',
  telefono: '',
  email: '',
  foto_perfil: null,
  ci_anverso: null,
  ci_reverso: null,
  localidad_id: null,
  categorias_ids: [],
  activo: true,
  limite_credito: null,
  puede_tener_credito: false,
  // Inicializar direcciones como array vacío
  direcciones: [],
  // Inicializar ventanas de entrega como array vacío
  ventanas_entrega: [],
  // Campos para gestión de usuario
  crear_usuario: false,
  usernick: undefined,
  password: null,
  password_confirmation: null,
};

export default function ClientesForm({ cliente, localidades, categorias }: ClientesFormPageProps) {
  const isEditing = !!cliente;

  // 🔍 Preparar initialData con usernick si existe usuario
  const initialData: ClienteFormData = {
    ...baseInitialData,
    // Si está editando y tiene usuario, agregar el usernick actual
    ...(isEditing && cliente?.user?.usernick && {
      usernick: cliente.user.usernick,
    }),
  };

  // 🔍 DEBUG: Mostrar datos recibidos del backend
  /* console.log('📋 CLIENTES FORM - Props recibidos del backend:', {
    cliente_id: cliente?.id,
    cliente_nombre: cliente?.nombre,
    cliente_categorias_ids: cliente?.categorias_ids,
    cliente_categorias: cliente?.categorias,
    localidades_count: localidades?.length,
    categorias_count: categorias?.length,
    isEditing,
    has_user: !!cliente?.user,
    usernick: cliente?.user?.usernick,
    full_props: { cliente, localidades, categorias }
  }); */

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: clientesService.indexUrl() },
      { title: 'Clientes', href: clientesService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nuevo', href: '#' }
    ]}>
      <div className="space-y-6">
        {/* Header del cliente siendo editado */}
        <ClienteFormHeader cliente={cliente} isEditing={isEditing} />

        {/* Formulario */}
        <GenericFormContainer<Cliente, ClienteFormData>
          entity={cliente}
          config={clientesConfig}
          service={clientesService}
          initialData={initialData}
          extraData={{ localidades, categorias }}
          loadOptions={async (fieldKey: string) => {
            if (fieldKey === 'localidad_id') {
              return await clientesService.loadLocalidadOptions();
            }
            if (fieldKey === 'categorias_ids') {
              // Las categorías se pasan via extraData desde el backend
              return [];
            }
            return [];
          }}
        />
      </div>
    </AppLayout>
  );
}
