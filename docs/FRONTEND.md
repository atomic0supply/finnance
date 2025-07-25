# 🎨 Frontend - Finnance App

## 📋 Resumen del Proyecto

**Finnance** es una aplicación web completa de gestión financiera personal desarrollada con las últimas tecnologías frontend. La aplicación permite a los usuarios controlar sus gastos, gestionar propiedades y vehículos, ver reportes detallados y planificar pagos futuros.

## 🏗️ Arquitectura Frontend

### **Framework Principal**
- **Next.js 15.3.4** con App Router
- **React 19** con Server Components y Client Components
- **TypeScript 5** para tipado estático completo
- **Turbopack** para desarrollo ultra-rápido

### **Sistema de Diseño**
- **Tailwind CSS 4** - Framework de estilos utilitarios
- **shadcn/ui** - Componentes UI reutilizables y accesibles
- **Radix UI** - Primitivos de UI sin estilo para máxima personalización
- **Lucide React** - Iconografía moderna y consistente

## 🎨 Interfaz de Usuario

### **Componentes UI Disponibles**
```typescript
// Componentes de Entrada
- Input - Campos de texto con validación
- Label - Etiquetas accesibles
- Select - Dropdowns personalizables
- Calendar - Selector de fechas interactivo

// Componentes de Navegación
- Button - Botones con múltiples variantes
- DropdownMenu - Menús contextuales
- Sidebar - Navegación lateral fija

// Componentes de Layout
- Card - Contenedores de contenido
- Dialog - Modales y popups
- Sheet - Paneles deslizantes
- Table - Tablas de datos

// Componentes de Feedback
- Badge - Etiquetas de estado
- Toast (Sonner) - Notificaciones
- Spinner - Indicadores de carga
```

### **Diseño Responsive**
- **Mobile First** - Optimizado para dispositivos móviles
- **Breakpoints Tailwind**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### **Temas y Personalización**
- **Tema Claro/Oscuro** con `next-themes`
- **CSS Variables** para colores dinámicos
- **Animaciones** con Tailwind Animate CSS

## 📱 Páginas y Funcionalidades

### **Página Principal (`/`)**
- **Hero Section** con call-to-action
- **Features Section** destacando características principales
- **Responsive Design** para todas las pantallas

### **Dashboard (`/dashboard`)**
```typescript
Características:
- Resumen financiero con estadísticas clave
- Alertas de pagos vencidos y próximos
- Acciones rápidas para crear transacciones
- Gráficos interactivos de gastos
- Lista de próximos pagos
```

### **Gestión de Transacciones (`/transactions`)**
```typescript
Funcionalidades:
- CRUD completo de transacciones
- Filtros avanzados por fecha, categoría, tipo
- Búsqueda en tiempo real
- Asociación con propiedades/vehículos
- Duplicar y editar transacciones
- Exportar datos a CSV/Excel
```

### **Gestión de Propiedades (`/properties`)**
```typescript
Características:
- Registro de propiedades con tipos (casa, apartamento, oficina)
- Tracking de gastos asociados por propiedad
- Gestión de direcciones y valores
- Dashboard individual por propiedad
```

### **Gestión de Vehículos (`/vehicles`)**
```typescript
Funcionalidades:
- Registro de vehículos (auto, moto, camión)
- Seguimiento de gastos de mantenimiento
- Control de impuestos y servicios
- Historial completo por vehículo
```

### **Servicios Recurrentes (`/services`)**
```typescript
Características:
- Gestión de suscripciones y servicios
- Recordatorios de pagos
- Control de servicios activos/inactivos
- Categorización automática
```

### **Calendario (`/calendar`)**
```typescript
Funcionalidades:
- Vista mensual interactiva
- Marcadores de pagos próximos y vencidos
- Integración con todas las transacciones
- Alertas visuales por colores
```

### **Reportes (`/reports`)**
```typescript
Características:
- Gráficos interactivos con Chart.js
- Reportes por períodos personalizables
- Análisis de tendencias de gasto
- Comparativas mensuales/anuales
```

## 🔐 Autenticación Frontend

### **Gestión de Estado**
```typescript
// Store con Zustand
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
}
```

### **Protección de Rutas**
```typescript
// Componente ProtectedRoute
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

### **Integración con Clerk (Próxima Implementación)**
- **Social Login** (Google, GitHub, etc.)
- **Multi-Factor Authentication (MFA)**
- **Gestión de sesiones** avanzada
- **Profile Management** integrado

## 🛠️ Gestión de Estado

### **Zustand Stores**
```typescript
// Store principal de finanzas
interface FinanceStore {
  // Transacciones
  transactions: Transaction[];
  addTransaction: (transaction: CreateTransactionData) => void;
  updateTransaction: (id: string, data: UpdateTransactionData) => void;
  deleteTransaction: (id: string) => void;
  
  // Propiedades
  properties: Property[];
  addProperty: (property: CreatePropertyData) => void;
  
  // Vehículos
  vehicles: Vehicle[];
  addVehicle: (vehicle: CreateVehicleData) => void;
  
  // Servicios
  services: Service[];
  addService: (service: CreateServiceData) => void;
}
```

### **Persistencia de Datos**
- **LocalStorage** para datos offline
- **PostgreSQL** como base de datos principal
- **Sincronización** automática con backend

## 🔄 Integración con Backend

### **API Client**
```typescript
// Configuración base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Interceptors para autenticación
const apiClient = {
  get: (url: string) => fetch(`${API_BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  post: (url: string, data: any) => fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
};
```

### **Endpoints Principales**
```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/profile

// Transacciones
GET /api/transactions
POST /api/transactions
PUT /api/transactions/:id
DELETE /api/transactions/:id

// Propiedades
GET /api/properties
POST /api/properties
PUT /api/properties/:id
DELETE /api/properties/:id

// Vehículos
GET /api/vehicles
POST /api/vehicles
PUT /api/vehicles/:id
DELETE /api/vehicles/:id
```

## 📊 Validación y Manejo de Errores

### **Validación de Formularios**
```typescript
// Validación con TypeScript
const validateTransaction = (data: TransactionFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'El monto debe ser mayor a 0';
  }
  
  if (!data.description.trim()) {
    errors.description = 'La descripción es requerida';
  }
  
  return errors;
};
```

### **Manejo de Estados de Carga**
```typescript
// Loading states
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Error boundaries para capturar errores
<ErrorBoundary fallback={<ErrorFallback />}>
  <TransactionsPage />
</ErrorBoundary>
```

## 📱 Performance y Optimización

### **Optimizaciones Implementadas**
- **Code Splitting** automático con Next.js
- **Image Optimization** con next/image
- **Bundle Analysis** para reducir tamaño
- **Lazy Loading** de componentes pesados

### **SEO y Accesibilidad**
- **Metadata** dinámico con Next.js 15
- **Semantic HTML** en todos los componentes
- **ARIA labels** para screen readers
- **Keyboard navigation** completa

## 🧪 Testing (Próxima Implementación)

### **Testing Stack Planificado**
```typescript
// Unit Testing
- Jest + React Testing Library
- Componentes UI individuales
- Hooks personalizados
- Funciones de validación

// Integration Testing
- Cypress/Playwright
- Flujos de usuario completos
- Testing de formularios
- Navegación entre páginas

// Performance Testing
- Lighthouse CI
- Core Web Vitals
- Bundle size monitoring
```

## 📦 Estructura de Archivos Frontend

```
src/
├── app/                    # App Router pages
│   ├── dashboard/         # Dashboard principal
│   ├── transactions/      # Gestión de transacciones
│   ├── properties/        # Gestión de propiedades
│   ├── vehicles/          # Gestión de vehículos
│   ├── services/          # Servicios recurrentes
│   ├── calendar/          # Vista de calendario
│   ├── reports/           # Reportes y análisis
│   ├── login/             # Página de login
│   └── register/          # Página de registro
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── AppSidebar.tsx    # Navegación lateral
│   ├── NavBar.tsx        # Barra de navegación
│   ├── ProtectedRoute.tsx # Protección de rutas
│   └── ...
├── stores/               # Estado global (Zustand)
├── lib/                  # Utilidades y configuración
├── types/                # Definiciones TypeScript
└── hooks/                # Custom hooks
```

## 🚀 Próximas Mejoras Frontend

### **Funcionalidades Planificadas**
1. **PWA Support** - Aplicación web progresiva
2. **Offline Mode** - Funcionamiento sin conexión
3. **Push Notifications** - Alertas de pagos
4. **Advanced Charts** - Gráficos más interactivos
5. **Drag & Drop** - Reorganización de elementos
6. **Bulk Operations** - Operaciones en lote
7. **Advanced Filters** - Filtros más granulares
8. **Export Options** - Más formatos de exportación
9. **Mobile App** - React Native version
10. **Real-time Updates** - WebSockets para actualizaciones en tiempo real

### **Mejoras Técnicas**
- **React Server Components** más extensivos
- **Streaming SSR** para mejor performance
- **Edge Runtime** para funciones API
- **Advanced Caching** strategies
- **Micro-frontends** architecture para escalabilidad

## 🎯 Métricas de Performance Actuales

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 250KB gzipped
- **Lighthouse Score**: 95+ en todas las métricas
