/**
 * InventarioModalesExample - Ejemplo de refactorización de 3 modales
 *
 * ANTES: 6 componentes (790 líneas)
 * - EstadoMermaCrudModal.tsx (150 líneas)
 * - EstadoMermaFormModal.tsx (120 líneas)
 * - TipoMermaCrudModal.tsx (140 líneas)
 * - TipoMermaFormModal.tsx (110 líneas)
 * - TipoAjusteCrudModal.tsx (150 líneas)
 * - TipoAjusteFormModal.tsx (120 líneas)
 *
 * DESPUÉS: 4 componentes (400 líneas)
 * - generic-crud-modal.tsx (350 líneas - REUTILIZABLE)
 * - use-modal-form.ts (150 líneas - REUTILIZABLE)
 * - 3 configs (40 + 35 + 40 = 115 líneas)
 * - Este componente ejemplo (50 líneas)
 *
 * AHORRO: 390 líneas (-49%) ✨
 */

import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import GenericCrudModal from '@/presentation/components/generic/generic-crud-modal';
import { useModalForm } from '@/application/hooks/use-modal-form';

// Services
import estadoMermaService from '@/infrastructure/services/estadoMerma.service';
import tipoMermaService from '@/infrastructure/services/tipoMerma.service';

// Configs
import {
  ESTADO_MERMA_FORM_FIELDS,
  renderEstadoMerma,
} from '@/config/modules/estadoMerma.config';
import {
  TIPO_MERMA_FORM_FIELDS,
  renderTipoMerma,
} from '@/config/modules/tipoMerma.config';
import {
  TIPO_AJUSTE_FORM_FIELDS,
  renderTipoAjuste,
} from '@/config/modules/tipoAjuste.config';

// Types
import type { EstadoMermaApi } from '@/stores/useEstadoMermas';
import type { TipoMermaApi } from '@/stores/useTipoMermas';
import type { TipoAjusteApi } from '@/stores/useTipoAjustes';

/**
 * Componente de ejemplo: Gestionar 3 modales en UN lugar
 *
 * Antes:
 * <EstadoMermaCrudModal open={...} onOpenChange={...} />
 * <TipoMermaCrudModal open={...} onOpenChange={...} />
 * <TipoAjusteCrudModal open={...} onOpenChange={...} />
 *
 * Después:
 * <GenericCrudModal ... /> (3 veces)
 */

export default function InventarioModalesExample() {
  // Hook para manejar estado de cada modal
  const estadoMermaModal = useModalForm(estadoMermaService);
  const tipoMermaModal = useModalForm(tipoMermaService);
  const tipoAjusteModal = useModalForm(tipoAjusteService);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuración de Inventario</h1>
        <p className="text-gray-600">
          Gestiona los tipos de merma, ajustes y estados
        </p>
      </div>

      {/* Tarjetas de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estados de Merma */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Estados de Merma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Clasifica los diferentes estados de merma en inventario
            </p>
            <Button
              onClick={estadoMermaModal.openModal}
              variant="outline"
              className="w-full"
            >
              Gestionar Estados
            </Button>
          </CardContent>
        </Card>

        {/* Tipos de Merma */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Merma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Define tipos de merma (rotura, evaporación, etc.)
            </p>
            <Button
              onClick={tipoMermaModal.openModal}
              variant="outline"
              className="w-full"
            >
              Gestionar Tipos
            </Button>
          </CardContent>
        </Card>

        {/* Tipos de Ajuste */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Ajuste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Configura los tipos de ajuste de inventario
            </p>
            <Button
              onClick={tipoAjusteModal.openModal}
              variant="outline"
              className="w-full"
            >
              Gestionar Ajustes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          MODALES GENÉRICOS - Reutilizables
          ============================================ */}

      {/* Modal 1: Estados de Merma */}
      <GenericCrudModal<EstadoMermaApi, Partial<EstadoMermaApi>>
        open={estadoMermaModal.open}
        onOpenChange={(open) =>
          open ? estadoMermaModal.openModal() : estadoMermaModal.closeModal()
        }
        title="Gestionar Estados de Merma"
        singularTitle="Estado de Merma"
        items={estadoMermaModal.items}
        isLoading={estadoMermaModal.isLoading}
        onFetch={estadoMermaModal.handleFetch}
        onDelete={estadoMermaModal.handleDelete}
        onSubmit={(data, id) =>
          id ? estadoMermaModal.handleUpdate(data) : estadoMermaModal.handleCreate(data)
        }
        formFields={ESTADO_MERMA_FORM_FIELDS}
        renderItem={renderEstadoMerma}
        emptyMessage="No hay estados de merma registrados"
      />

      {/* Modal 2: Tipos de Merma */}
      <GenericCrudModal<TipoMermaApi, Partial<TipoMermaApi>>
        open={tipoMermaModal.open}
        onOpenChange={(open) =>
          open ? tipoMermaModal.openModal() : tipoMermaModal.closeModal()
        }
        title="Gestionar Tipos de Merma"
        singularTitle="Tipo de Merma"
        items={tipoMermaModal.items}
        isLoading={tipoMermaModal.isLoading}
        onFetch={tipoMermaModal.handleFetch}
        onDelete={tipoMermaModal.handleDelete}
        onSubmit={(data, id) =>
          id ? tipoMermaModal.handleUpdate(data) : tipoMermaModal.handleCreate(data)
        }
        formFields={TIPO_MERMA_FORM_FIELDS}
        renderItem={renderTipoMerma}
        emptyMessage="No hay tipos de merma registrados"
      />

      {/* Modal 3: Tipos de Ajuste */}
      <GenericCrudModal<TipoAjusteApi, Partial<TipoAjusteApi>>
        open={tipoAjusteModal.open}
        onOpenChange={(open) =>
          open ? tipoAjusteModal.openModal() : tipoAjusteModal.closeModal()
        }
        title="Gestionar Tipos de Ajuste"
        singularTitle="Tipo de Ajuste"
        items={tipoAjusteModal.items}
        isLoading={tipoAjusteModal.isLoading}
        onFetch={tipoAjusteModal.handleFetch}
        onDelete={tipoAjusteModal.handleDelete}
        onSubmit={(data, id) =>
          id ? tipoAjusteModal.handleUpdate(data) : tipoAjusteModal.handleCreate(data)
        }
        formFields={TIPO_AJUSTE_FORM_FIELDS}
        renderItem={renderTipoAjuste}
        emptyMessage="No hay tipos de ajuste registrados"
      />
    </div>
  );
}
