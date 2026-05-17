import { httpClient } from './http-client';
import type { AdminUsuario, AdminRol, PermisoAudit, PermissionGroup, Permission } from '@/domain/entities/admin-permisos';
import type { Id } from '@/domain/entities/shared';

interface EstadisticasHistorial {
  total_cambios: number;
  cambios_hoy: number;
  cambios_esta_semana: number;
  cambios_este_mes: number;
}

interface ModuloSidebar {
  titulo?: string;
  name?: string;
  [key: string]: unknown;
}

interface PermissionGroupResponse {
  grouped?: PermissionGroup[];
  [key: string]: unknown;
}

interface PermissionWithModule extends Permission {
  module: string;
}

export class PermisosService {
  /**
   * URL para listar todos los permisos
   */
  indexUrl() {
    return '/permisos';
  }

  /**
   * URL para editar los permisos de un usuario
   */
  editarUsuarioUrl(userId: Id) {
    return `/permisos/usuario/${userId}/editar`;
  }

  /**
   * URL para actualizar los permisos de un usuario (PATCH)
   */
  actualizarUsuarioUrl(userId: Id) {
    return `/permisos/usuario/${userId}`;
  }

  /**
   * URL para editar los permisos de un rol
   */
  editarRolUrl(roleId: Id) {
    return `/permisos/rol/${roleId}/editar`;
  }

  /**
   * URL para actualizar los permisos de un rol (PATCH)
   */
  actualizarRolUrl(roleId: Id) {
    return `/permisos/rol/${roleId}`;
  }

  /**
   * Obtiene todos los permisos disponibles agrupados por módulo
   */
  static async getPermisosDisponibles(): Promise<PermissionGroup[]> {
    try {
      const response = await httpClient.get<{ data: PermissionGroup[] }>('/permisos/agrupados');
      return response.data || [];
    } catch (error) {
      console.error('Error al cargar permisos disponibles:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de usuarios con filtro opcional
   */
  static async getUsuarios(search?: string): Promise<AdminUsuario[]> {
    try {
      const response = await httpClient.get<{ data: AdminUsuario[] }>('/usuarios', {
        params: { search: search || undefined },
      });
      return response.data || [];
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de roles con filtro opcional
   */
  static async getRoles(search?: string): Promise<AdminRol[]> {
    try {
      const response = await httpClient.get<{ data: AdminRol[] }>('/roles', {
        params: { search: search || undefined },
      });
      return response.data || [];
    } catch (error) {
      console.error('Error al cargar roles:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de auditoría con filtro opcional
   */
  static async getHistorial(filtro?: string | null): Promise<{
    data: PermisoAudit[];
    estadisticas: EstadisticasHistorial;
  }> {
    try {
      const response = await httpClient.get<{
        data: PermisoAudit[];
        estadisticas: EstadisticasHistorial;
      }>('/permisos/historial', {
        params: { target_type: filtro || undefined },
      });
      return {
        data: response.data || [],
        estadisticas: response.estadisticas,
      };
    } catch (error) {
      console.error('Error al cargar historial:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de módulos disponibles
   */
  static async getModulos(): Promise<string[]> {
    try {
      const response = await httpClient.get<ModuloSidebar[]>('/modulos-sidebar');
      // Mapear los módulos para obtener solo los títulos/nombres
      if (Array.isArray(response)) {
        return response.map((m) => m.titulo || m.name).filter(Boolean) as string[];
      }
      return [];
    } catch (error) {
      console.error('Error al cargar módulos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los permisos disponibles desagrupados, con filtros opcionales
   */
  static async getPermisos(search?: string, modulo?: string): Promise<PermissionWithModule[]> {
    try {
      // Obtener permisos disponibles agrupados
      const response = await httpClient.get<PermissionGroupResponse | PermissionGroup[]>('/permisos/agrupados');

      let permisos: PermissionWithModule[] = [];
      let groupedData: PermissionGroup[] | PermissionGroupResponse = response;

      // Si la respuesta tiene un campo 'grouped', usarlo
      if (response && typeof response === 'object' && 'grouped' in response && Array.isArray(response.grouped)) {
        groupedData = response.grouped;
      }

      // Desagrupar los permisos si vienen agrupados por módulo
      if (Array.isArray(groupedData)) {
        // Si es array de PermissionGroup
        permisos = groupedData.flatMap((group) => {
          if (group.permissions && Array.isArray(group.permissions)) {
            // Agregar el módulo a cada permiso para referencia
            return group.permissions.map((p) => ({
              ...p,
              module: group.module || 'General'
            } as PermissionWithModule));
          }
          return [];
        });
      } else if (groupedData && typeof groupedData === 'object') {
        // Si viene como objeto con módulos como keys
        permisos = Object.entries(groupedData).flatMap(([module, permissions]) => {
          if (Array.isArray(permissions)) {
            return permissions.map((p) => ({
              ...p,
              module
            } as PermissionWithModule));
          }
          return [];
        });
      }

      // Filtrar por búsqueda si se proporciona
      if (search) {
        permisos = permisos.filter((p) =>
          (p.name?.toLowerCase().includes(search.toLowerCase())) ||
          (p.description?.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filtrar por módulo si se proporciona
      if (modulo) {
        permisos = permisos.filter((p) => p.module === modulo);
      }

      return permisos;
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      throw error;
    }
  }

  /**
   * Ejecuta operación de edición en lote
   */
  static async bulkEdit(
    tipo: 'usuarios' | 'roles',
    ids: number[],
    permisos: number[],
    accion: 'reemplazar' | 'agregar' | 'eliminar'
  ): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>('/permisos/bulk-edit', {
        tipo,
        ids,
        permisos,
        accion,
      });
      return response;
    } catch (error) {
      console.error('Error en bulk edit:', error);
      throw error;
    }
  }
}

// Instancia singleton para usar en componentes
export const permisosService = new PermisosService();
