/**
 * Pages: Empresas form page
 *
 * FEATURES:
 * ✓ Crear nueva empresa
 * ✓ Editar empresa existente
 * ✓ Gestión de logos (principal, compacto, footer)
 * ✓ Mensajes customizados
 * ✓ Validación completa
 */

import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { empresasConfig } from '@/config/modules/empresas.config';
import empresasService from '@/infrastructure/services/empresas.service';
import type { Empresa, EmpresaFormData } from '@/domain/entities/empresas';

interface EmpresaFormPageProps {
  empresa?: Empresa | null;
}

const initialEmpresaData: EmpresaFormData = {
  nombre_comercial: '',
  razon_social: '',
  nit: '',
  telefono: '',
  email: '',
  sitio_web: '',
  direccion: '',
  ciudad: '',
  pais: '',
  logo_principal: null,
  logo_compacto: null,
  logo_footer: null,
  mensaje_footer: '',
  mensaje_legal: '',
  activo: true,
  es_principal: false,
  permite_productos_fraccionados: false, // ✨ NUEVO
  es_farmacia: false, // ✨ NUEVO
};

export default function EmpresaForm({ empresa }: EmpresaFormPageProps) {
  const isEditing = !!empresa;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/' },
      { title: 'Empresas', href: empresasService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva empresa', href: '#' }
    ]}>
      <GenericFormContainer<Empresa, EmpresaFormData>
        entity={empresa}
        config={empresasConfig}
        service={empresasService}
        initialData={initialEmpresaData}
      />
    </AppLayout>
  );
}
