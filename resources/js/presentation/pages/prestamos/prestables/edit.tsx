import PrestableForm from './form';
import type { Prestable } from '@/domain/entities/prestamos';

interface EditProps {
    prestable: Prestable;
}

export default function Edit({ prestable }: EditProps) {
    return <PrestableForm prestable={prestable} isEdit={true} />;
}
