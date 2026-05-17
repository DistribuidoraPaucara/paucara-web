// Pages: Monedas form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericForm from '@/presentation/components/generic/generic-form';
import { monedasConfig } from '@/config/modules/monedas.config';
import monedasService from '@/infrastructure/services/monedas.service';
import type { Moneda, MonedaFormData } from '@/domain/entities/monedas';

interface MonedasFormProps {
  moneda?: Moneda;
  isEdit?: boolean;
}

export default function MonedasForm({ moneda, isEdit = false }: MonedasFormProps) {
  const title = isEdit ? 'Editar Moneda' : 'Nueva Moneda';

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Monedas', href: monedasService.indexUrl() },
    { title: title, href: '#' }
  ];

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <GenericForm<Moneda, MonedaFormData>
        entity={moneda}
        config={monedasConfig}
        service={monedasService}
        isEdit={isEdit}
        title={title}
      />
    </AppLayout>
  );
}
