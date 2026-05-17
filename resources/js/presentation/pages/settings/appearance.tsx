import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/presentation/components/appearance-tabs';
import HeadingSmall from '@/presentation/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { appearance } from '@/routes/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de apariencia',
        href: appearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de apariencia" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Configuración de apariencia" description="Actualiza los ajustes de apariencia de tu cuenta" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
