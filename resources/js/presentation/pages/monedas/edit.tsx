// Pages: Edit existing moneda
import MonedasForm from './form';
import type { Moneda } from '@/domain/entities/monedas';

interface EditProps {
  moneda: Moneda;
}

export default function Edit({ moneda }: EditProps) {
  return <MonedasForm moneda={moneda} isEdit={true} />;
}
