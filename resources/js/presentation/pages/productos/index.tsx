// Pages: Productos index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { productosConfig } from '@/config/modules/productos.config';
import productosService from '@/infrastructure/services/productos.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Producto, ProductoFormData } from '@/domain/entities/productos';
import { Link } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Package, Lock } from 'lucide-react';
import { useAuth } from '@/application/hooks/use-auth'; // ✅ NUEVO: Verificar permisos

interface ProductosIndexProps {
  productos: Pagination<Producto>;
  filters: { q?: string; categoria_id?: number | string | null; marca_id?: number | string | null; proveedor_id?: number | string | null; order_by?: string | null; order_dir?: string | null };
  categorias?: { id: number; nombre: string }[];
  marcas?: { id: number; nombre: string }[];
  proveedores?: { id: number; nombre: string; razon_social?: string }[];
  unidades?: { id: number; codigo: string; nombre: string }[];
}

export default function ProductosIndex({ productos, filters, categorias, marcas, proveedores }: ProductosIndexProps) {
  const { can } = useAuth(); // ✅ Obtener permisos del usuario

  // ✅ Permisos separados por acción (NO bloquear listado)
  const puedeEditar = can('productos.edit');
  const puedeEliminar = can('productos.delete');

  // 📊 LOG: Ver datos que llegan del backend
  console.log('📦 [ProductosIndex] Datos del Backend:', {
    productosTotal: productos?.total,
    productosData: productos?.data?.map(p => ({ id: p.id, nombre: p.nombre, sku: p.sku })),
    filters,
    categorias: categorias?.map(c => ({ id: c.id, nombre: c.nombre })),
    marcas: marcas?.map(m => ({ id: m.id, nombre: m.nombre })),
    proveedores: proveedores?.map(p => ({ id: p.id, nombre: p.nombre, razon_social: p.razon_social })),
  });

  // 🔐 LOG: Ver permisos del usuario
  console.log('🔐 [ProductosIndex] Permisos del Usuario:', {
    puedeEditar,
    puedeEliminar,
    verPrecioCosto: can('ver_precio_costo'),
  });

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: productosService.indexUrl() },
      { title: 'Productos', href: productosService.indexUrl() }
    ]}>
      {/* <div className="mb-4 flex justify-end">
        <Link href="/combos">
          <Button variant="outline" className="gap-2">
            <Package size={18} />
            Ir a Combos
          </Button>
        </Link>
      </div> */}
      <GenericContainer<Producto, ProductoFormData>
        entities={productos}
        filters={filters}
        config={productosConfig}
        service={productosService}
        extraData={{ categorias, marcas, proveedores, puedeEditar, puedeEliminar }}
      />
    </AppLayout>
  );
}
