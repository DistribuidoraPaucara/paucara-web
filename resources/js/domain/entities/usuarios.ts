// Domain: Usuarios
import type { Id } from './shared';
import type { BaseEntity } from './generic';

export interface Permission extends BaseEntity {
    id: Id;
    name: string;
}

export interface Role extends BaseEntity {
    id: Id;
    name: string;
    permissions: Permission[];
}

export interface Usuario extends BaseEntity {
    id: Id;
    name: string;
    usernick: string;
    email: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
    permissions: Permission[];
}

// =============== PAGE PROPS ===============

export interface UsersIndexPageProps {
    users: {
        data: Usuario[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
    [key: string]: unknown;
}

export interface UsersShowPageProps {
    user: Usuario;
    [key: string]: unknown;
}
