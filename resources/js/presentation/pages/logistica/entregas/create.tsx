import { Head, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import CreateEntregasUnificado from './components/CreateEntregasUnificado';

interface Entrega {
    id: number;
    numero_entrega: string;
    estado: string;
    fecha_programada: string;
    vehiculo_id?: number;
    chofer_id?: number;
    peso_kg?: number;
    volumen_m3?: number;
}

interface Props extends PageProps {
    modo?: 'crear' | 'editar';
    entrega?: Entrega;
    ventas: VentaConDetalles[];
    ventasAsignadas?: VentaConDetalles[];
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    ventaPreseleccionada?: number;
    paginacion?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        has_more: boolean;
    };
}

/**
 * Página Unificada de Creación/Edición de Entregas
 *
 * FASE UNIFICADA: Una sola página para crear entregas simples o en lote
 * FASE EDICIÓN: Reutiliza la misma página para editar entregas existentes
 *
 * Features:
 * ✅ Interfaz dinámica que se adapta según selección
 * ✅ 1 venta → Form Wizard inteligente (3 pasos)
 * ✅ 2+ ventas → Batch UI con optimización Phase 3
 * ✅ Auto-carga de pesos desde detalles de venta
 * ✅ Sugerencias de vehículos y choferes
 * ✅ Preview de optimización (clustering + ML + rebalanceo)
 * ✅ Dark mode completo
 * ✅ Cambio dinámico entre modos sin perder datos
 * ✅ Modo edición: precarga datos de entrega existente
 * ✅ Modo edición: permite agregar más ventas
 */
export default function Create({
    modo = 'crear',
    entrega,
    ventas,
    ventasAsignadas = [],
    vehiculos,
    choferes,
    ventaPreseleccionada,
    paginacion,
}: Props) {
    console.log('Renderizando Create Entregas Unificado con props:');
    console.log('Modo:', modo);
    console.log('Venta:', ventas);
    console.log('Ventas Asignada', ventasAsignadas);
    console.log('ventaPreseleccionada', ventaPreseleccionada);
    if (modo === 'editar') {
        console.log('Entrega:', entrega);
        console.log('Ventas Asignadas:', ventasAsignadas.length);
    }

    const handleCancel = () => {
        router.visit('/logistica/entregas');
    };

    const isEditMode = modo === 'editar';
    const pageTitle = isEditMode ? `Editar Entrega: ${entrega?.numero_entrega}` : 'Crear Entrega';
    const breadcrumbTitle = isEditMode ? 'Editar' : 'Crear';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Logística', href: '/logistica/dashboard' },
                { title: 'Entregas', href: '/logistica/entregas' },
                { title: breadcrumbTitle, href: '#' },
            ]}
        >
            <Head title={pageTitle} />

            <CreateEntregasUnificado
                modo={modo}
                entrega={entrega}
                ventas={ventas}
                ventasAsignadas={ventasAsignadas}
                vehiculos={vehiculos}
                choferes={choferes}
                ventaPreseleccionada={ventaPreseleccionada}
                paginacion={paginacion}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
}
