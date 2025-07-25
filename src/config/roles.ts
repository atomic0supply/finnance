import { UserRole, Permission } from '@/types/auth';

export const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    {
      resource: 'transactions',
      actions: ['create', 'read', 'update', 'delete', 'export']
    },
    {
      resource: 'properties',
      actions: ['create', 'read', 'update', 'delete', 'export']
    },
    {
      resource: 'vehicles',
      actions: ['create', 'read', 'update', 'delete', 'export']
    },
    {
      resource: 'services',
      actions: ['create', 'read', 'update', 'delete', 'export']
    },
    {
      resource: 'users',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'reports',
      actions: ['read', 'export']
    }
  ],
  user: [
    {
      resource: 'transactions',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'properties',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'vehicles',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'services',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'reports',
      actions: ['read']
    }
  ],
  viewer: [
    {
      resource: 'transactions',
      actions: ['read']
    },
    {
      resource: 'properties',
      actions: ['read']
    },
    {
      resource: 'vehicles',
      actions: ['read']
    },
    {
      resource: 'services',
      actions: ['read']
    },
    {
      resource: 'reports',
      actions: ['read']
    }
  ]
};

export const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    permissions: DEFAULT_PERMISSIONS.admin,
    isDefault: false
  },
  {
    id: 'user',
    name: 'Usuario',
    description: 'Acceso completo a sus propios datos financieros',
    permissions: DEFAULT_PERMISSIONS.user,
    isDefault: true
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Solo puede ver la información financiera',
    permissions: DEFAULT_PERMISSIONS.viewer,
    isDefault: false
  }
];

export const PROTECTED_ROUTES = {
  admin: [
    '/admin',
    '/users',
    '/system'
  ],
  user: [
    '/dashboard',
    '/transactions',
    '/properties',
    '/vehicles',
    '/services',
    '/reports'
  ],
  viewer: [
    '/dashboard',
    '/reports'
  ]
};

export function hasPermission(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return userPermissions.some(
    permission => 
      permission.resource === resource && 
      permission.actions.includes(action as 'create' | 'read' | 'update' | 'delete' | 'export')
  );
}

export function canAccessRoute(
  userRole: string,
  route: string
): boolean {
  const roleRoutes = PROTECTED_ROUTES[userRole as keyof typeof PROTECTED_ROUTES];
  if (!roleRoutes) return false;
  
  return roleRoutes.some(allowedRoute => 
    route.startsWith(allowedRoute) || route === allowedRoute
  );
}

export function getRolePermissions(roleName: string): Permission[] {
  return DEFAULT_PERMISSIONS[roleName] || [];
}
