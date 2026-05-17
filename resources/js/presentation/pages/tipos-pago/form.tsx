// Pages: Tipos de Pago form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { tiposPagoConfig } from '@/config/modules/tipos-pago.config';
import tiposPagoService from '@/infrastructure/services/tipos-pago.service';
import type { TipoPago, TipoPagoFormData } from '@/domain/entities/tipos-pago';

interface TiposPagoFormProps {
  tipoPago?: TipoPago | null;
}

const initialTipoPagoData: TipoPagoFormData = {
  codigo: '',
  nombre: '',
  activo: true,
};

export default function TiposPagoForm({ tipoPago }: TiposPagoFormProps) {
  const isEditing = !!tipoPago;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: tiposPagoService.indexUrl() },
      { title: 'Tipos de Pago', href: tiposPagoService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nuevo', href: '#' }
    ]}>
      <GenericFormContainer<TipoPago, TipoPagoFormData>
        entity={tipoPago}
        config={tiposPagoConfig}
        service={tiposPagoService}
        initialData={initialTipoPagoData}
      />
    </AppLayout>
  );
}
