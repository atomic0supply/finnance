# Sistema de Autenticación JWT y Roles - Finnance

## 📋 Resumen

Sistema completo de autenticación con JWT y gestión de roles implementado para la aplicación Finnance. Incluye autenticación segura, autorización basada en roles y permisos granulares.

## 🔐 Características de Seguridad

### 1. **Autenticación JWT**
- Tokens JWT seguros con tiempo de expiración
- Refresh tokens para renovación automática
- Passwords hasheados con bcrypt
- Tokens firmados con secretos seguros

### 2. **Sistema de Roles**
- **Admin**: Acceso completo a todas las funcionalidades
- **User**: Acceso completo a sus propios datos
- **Viewer**: Solo lectura de datos

### 3. **Permisos Granulares**
- Control de acceso por recurso y acción
- Verificación de permisos en middleware
- Protección de rutas frontend y backend

## 🚀 Configuración

### Variables de Entorno
```env
JWT_SECRET=tu-secreto-jwt-super-seguro
JWT_REFRESH_SECRET=tu-secreto-refresh-super-seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Usuarios de Prueba
```
Admin:
- Email: admin@finnance.com
- Password: admin123

Usuario:
- Email: user@finnance.com
- Password: user123
```

## 🛠️ Estructura del Sistema

### Archivos Principales

1. **`/src/types/auth.ts`** - Tipos TypeScript
2. **`/src/config/roles.ts`** - Configuración de roles y permisos
3. **`/src/lib/jwt.ts`** - Utilidades JWT
4. **`/src/lib/auth.ts`** - Funciones de autenticación
5. **`/src/stores/useAuthStore.ts`** - Store de autenticación
6. **`/src/middleware.ts`** - Middleware de protección
7. **`/src/components/ProtectedRoute.tsx`** - Componente de protección

### Rutas de API

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

## 📱 Uso del Sistema

### Autenticación
```typescript
import { useAuthStore } from '@/stores/useAuthStore';

const { login, user, isAuthenticated } = useAuthStore();

// Iniciar sesión
await login(email, password);

// Verificar autenticación
if (isAuthenticated) {
  // Usuario autenticado
}
```

### Verificación de Permisos
```typescript
const { hasPermission } = useAuthStore();

// Verificar permiso específico
if (hasPermission('transactions', 'create')) {
  // Puede crear transacciones
}
```

### Protección de Rutas
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

<ProtectedRoute requiredPermission={{
  resource: 'transactions',
  action: 'create'
}}>
  <CreateTransaction />
</ProtectedRoute>
```

## 🔒 Seguridad Backend

### Middleware de Autenticación
```typescript
import { requireAuth, requirePermission } from '@/lib/auth';

// Verificar solo autenticación
const authResult = requireAuth(request);

// Verificar permisos específicos
const authResult = requirePermission(request, 'transactions', 'create');
```

### Filtrado de Datos por Usuario
```typescript
// Las transacciones se filtran automáticamente por usuario
const userTransactions = transactions.filter(t => t.userId === user.id);
```

## 🛡️ Mejores Prácticas

### 1. **Tokens**
- Usa secretos fuertes y únicos
- Configura tiempos de expiración apropiados
- Implementa rotación de tokens

### 2. **Passwords**
- Mínimo 6 caracteres (recomendado: 8+)
- Hashing con bcrypt y salt
- Validación de fortaleza

### 3. **Permisos**
- Principio de menor privilegio
- Verificación en frontend y backend
- Logs de acceso y permisos

### 4. **Datos**
- Filtrado por usuario en todas las consultas
- Validación de entrada
- Sanitización de datos

## 📈 Próximas Mejoras

1. **Autenticación Multi-Factor (MFA)**
2. **OAuth2 / Social Login**
3. **Rate Limiting**
4. **Audit Logs**
5. **Sesiones persistentes**
6. **Recuperación de contraseña**

## 🐛 Solución de Problemas

### Token Expirado
```typescript
// El sistema auto-renueva los tokens
// Si falla, redirige al login
```

### Permisos Insuficientes
```typescript
// Verificar rol del usuario
console.log(user.role);

// Verificar permisos específicos
console.log(hasPermission('resource', 'action'));
```

### Datos No Aparecen
```typescript
// Verificar filtrado por usuario
console.log(user.id);
console.log(getUserTransactions());
```

## 🔧 Configuración de Desarrollo

1. Instalar dependencias:
```bash
npm install jsonwebtoken bcryptjs
npm install @types/jsonwebtoken @types/bcryptjs
```

2. Configurar variables de entorno

3. Ejecutar migraciones de base de datos (si aplica)

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## 📝 Notas Importantes

- Este sistema usa una base de datos mock para desarrollo
- En producción, reemplaza con una base de datos real
- Configura HTTPS en producción
- Usa variables de entorno seguras
- Implementa monitoring y logs

## 🤝 Contribuciones

Para contribuir al sistema de autenticación:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Implementa tests
4. Asegúrate de que la seguridad no se comprometa
5. Envía un Pull Request

## 📄 Licencia

Este sistema está bajo la misma licencia que el proyecto principal.
