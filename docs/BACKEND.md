# ⚙️ Backend - Finnance App

## 📋 Resumen del Sistema Backend

**Finnance Backend** es una API RESTful robusta construida con Next.js API Routes, diseñada para gestionar todas las operaciones financieras de manera segura y eficiente. El sistema maneja autenticación, transacciones, propiedades, vehículos y reportes con una arquitectura escalable y segura.

## 🏗️ Arquitectura Backend

### **Framework y Runtime**
- **Next.js 15.3.4** API Routes con App Router
- **Node.js** runtime optimizado
- **TypeScript 5** para tipado estático completo
- **Edge Runtime** para funciones optimizadas

### **Base de Datos**
- **PostgreSQL** como base de datos principal
- **Prisma** para ORM y gestión de esquemas
- **Conexión URI**: `postgresql://potg:potg@192.168.1.87:5484/financie`
- **Connection pooling** para optimización de performance

### **Autenticación y Seguridad**
- **JWT (JSON Web Tokens)** para autenticación stateless
- **bcryptjs** para hashing de contraseñas
- **Clerk** (integración próxima) para gestión avanzada de usuarios
- **Middleware de autenticación** en todas las rutas protegidas

## 🗄️ Modelado de Datos

### **Esquemas PostgreSQL**

#### **Usuario (User)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{
    "language": "es",
    "currency": "USD",
    "theme": "light",
    "notifications": {
      "email": true,
      "push": false,
      "upcomingPayments": true,
      "budgetAlerts": true
    }
  }'::jsonb
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### **Transacción (Transaction)**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  date DATE NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer', 'check')),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  
  -- Asociaciones opcionales
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  receipt JSONB,
  
  -- Transacciones recurrentes
  is_recurring BOOLEAN DEFAULT false,
  recurring_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_vehicle_id ON transactions(vehicle_id);
CREATE INDEX idx_transactions_service_id ON transactions(service_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
```

#### **Propiedad (Property)**
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('home', 'villa', 'apartment', 'office', 'other')),
  address JSONB NOT NULL DEFAULT '{
    "street": "",
    "city": "",
    "state": "",
    "zipCode": "",
    "country": ""
  }'::jsonb,
  value DECIMAL(15,2),
  purchase_date DATE,
  purchase_price DECIMAL(15,2),
  
  -- Características
  area DECIMAL(8,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  
  -- Documentos
  documents JSONB DEFAULT '[]'::jsonb,
  
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_properties_user_active ON properties(user_id, is_active);
```

#### **Vehículo (Vehicle)**
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'motorcycle', 'truck', 'other')),
  
  -- Información del vehículo
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(year FROM CURRENT_DATE) + 1),
  plate VARCHAR(20) NOT NULL,
  vin VARCHAR(50),
  color VARCHAR(50),
  
  -- Documentación
  insurance JSONB DEFAULT '{
    "company": null,
    "policyNumber": null,
    "expiryDate": null,
    "cost": null
  }'::jsonb,
  
  registration JSONB DEFAULT '{
    "expiryDate": null,
    "cost": null
  }'::jsonb,
  
  -- Mantenimiento
  last_service DATE,
  next_service DATE,
  mileage INTEGER,
  
  documents JSONB DEFAULT '[]'::jsonb,
  
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para placa única por usuario
  UNIQUE(user_id, plate)
);

-- Índices
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_is_active ON vehicles(is_active);
CREATE INDEX idx_vehicles_user_active ON vehicles(user_id, is_active);
```

#### **Servicio (Service)**
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('subscription', 'utility', 'insurance', 'membership', 'other')),
  provider VARCHAR(255) NOT NULL,
  
  -- Configuración de pago
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'semiannual', 'annual')),
  next_payment_date DATE NOT NULL,
  auto_debit BOOLEAN DEFAULT false,
  
  -- Detalles del servicio
  account_number VARCHAR(100),
  contract_date DATE,
  contract_end_date DATE,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  reminder_days INTEGER DEFAULT 3 CHECK (reminder_days >= 0),
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_next_payment ON services(next_payment_date);
CREATE INDEX idx_services_user_active ON services(user_id, is_active);
CREATE INDEX idx_services_payment_reminders ON services(next_payment_date, is_active) WHERE is_active = true;
```

## 🔐 Sistema de Autenticación

### **JWT Implementation**
```typescript
// JWT Configuration
interface JWTConfig {
  accessToken: {
    secret: string;
    expiresIn: '15m';      // 15 minutos
  };
  refreshToken: {
    secret: string;
    expiresIn: '7d';       // 7 días
  };
}

// Payload Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### **Middleware de Autenticación**
```typescript
// /src/middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas
  const publicPaths = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Verificar token
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  try {
    const payload = verifyToken(token);
    
    // Agregar usuario al header para las rutas API
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

### **Sistema de Roles y Permisos**
```typescript
// /src/config/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer'
} as const;

export const PERMISSIONS = {
  // Transacciones
  'transactions:read': ['admin', 'user', 'viewer'],
  'transactions:create': ['admin', 'user'],
  'transactions:update': ['admin', 'user'],
  'transactions:delete': ['admin', 'user'],
  
  // Propiedades
  'properties:read': ['admin', 'user', 'viewer'],
  'properties:create': ['admin', 'user'],
  'properties:update': ['admin', 'user'],
  'properties:delete': ['admin', 'user'],
  
  // Vehículos
  'vehicles:read': ['admin', 'user', 'viewer'],
  'vehicles:create': ['admin', 'user'],
  'vehicles:update': ['admin', 'user'],
  'vehicles:delete': ['admin', 'user'],
  
  // Administración
  'users:manage': ['admin'],
  'reports:admin': ['admin'],
};

export function hasPermission(userRole: string, permission: string): boolean {
  const allowedRoles = PERMISSIONS[permission as keyof typeof PERMISSIONS];
  return allowedRoles?.includes(userRole) || false;
}
```

## 🛣️ API Routes

### **Autenticación - `/api/auth/`**

#### **POST /api/auth/login**
```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response
interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Implementation
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Buscar usuario
    await connectDB();
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generar tokens
    const tokens = generateTokens(user);
    
    // Actualizar última conexión
    user.lastLogin = new Date();
    await user.save();
    
    return NextResponse.json({
      user: sanitizeUser(user),
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **POST /api/auth/register**
```typescript
// Request
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

// Implementation con validaciones completas
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'user' } = await request.json();
    
    // Validaciones
    const validation = validateRegistration({ name, email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.errors },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Verificar email único
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Crear usuario
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      preferences: {
        language: 'es',
        currency: 'USD',
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          upcomingPayments: true,
          budgetAlerts: true
        }
      }
    });
    
    await user.save();
    
    // Generar tokens
    const tokens = generateTokens(user);
    
    return NextResponse.json({
      user: sanitizeUser(user),
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt.toISOString()
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Transacciones - `/api/transactions/`**

#### **GET /api/transactions**
```typescript
// Query parameters
interface TransactionQuery {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  vehicleId?: string;
  search?: string;
}

// Response
interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    
    // Construir query con Prisma
    const where: any = { userId };
    
    // Filtros
    if (searchParams.get('type')) {
      where.type = searchParams.get('type');
    }
    
    if (searchParams.get('category')) {
      where.category = searchParams.get('category');
    }
    
    // Rango de fechas
    if (searchParams.get('startDate') || searchParams.get('endDate')) {
      where.date = {};
      if (searchParams.get('startDate')) {
        where.date.gte = new Date(searchParams.get('startDate')!);
      }
      if (searchParams.get('endDate')) {
        where.date.lte = new Date(searchParams.get('endDate')!);
      }
    }
    
    // Búsqueda de texto
    if (searchParams.get('search')) {
      where.OR = [
        { description: { contains: searchParams.get('search'), mode: 'insensitive' } },
        { notes: { contains: searchParams.get('search'), mode: 'insensitive' } }
      ];
    }
    
    // Paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    // Ejecutar queries en paralelo con Prisma
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          property: { select: { id: true, name: true, type: true } },
          vehicle: { select: { id: true, name: true, brand: true, model: true } }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where })
    ]);
    
    // Calcular resumen con agregación SQL
    const summary = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true }
    });
    
    const summaryData = {
      totalIncome: summary.find(s => s.type === 'income')?._sum.amount || 0,
      totalExpenses: summary.find(s => s.type === 'expense')?._sum.amount || 0
    };
    summaryData.balance = summaryData.totalIncome - summaryData.totalExpenses;
    
    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: summaryData
    });
    
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **POST /api/transactions**
```typescript
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const data = await request.json();
    
    // Validación
    const validation = validateTransaction(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Crear transacción con Prisma
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId,
      },
      include: {
        property: { select: { id: true, name: true, type: true } },
        vehicle: { select: { id: true, name: true, brand: true, model: true } }
      }
    });
    
    return NextResponse.json(transaction, { status: 201 });
    
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Propiedades - `/api/properties/`**

#### **GET /api/properties**
```typescript
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    const properties = await prisma.property.findMany({
      where: { 
        userId, 
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Agregar estadísticas de transacciones por propiedad
    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const stats = await prisma.transaction.groupBy({
          by: [],
          where: {
            userId,
            propertyId: property.id
          },
          _sum: { amount: true },
          _count: { id: true },
          _max: { date: true }
        });
        
        return {
          ...property,
          stats: {
            totalExpenses: stats[0]?._sum.amount || 0,
            transactionCount: stats[0]?._count.id || 0,
            lastTransaction: stats[0]?._max.date || null
          }
        };
      })
    );
    
    return NextResponse.json(propertiesWithStats);
    
  } catch (error) {
    console.error('Get properties error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 📊 Sistema de Reportes

### **Analytics y Métricas**
```typescript
// /api/reports/summary
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    
    const startDate = new Date(searchParams.get('startDate') || new Date().getFullYear() + '-01-01');
    const endDate = new Date(searchParams.get('endDate') || new Date());
    
    // Resumen general con Prisma
    const summary = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: { gte: startDate, lte: endDate }
      },
      _sum: { amount: true },
      _count: { id: true },
      _avg: { amount: true }
    });
    
    // Gastos por categoría
    const byCategory = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        type: 'expense',
        date: { gte: startDate, lte: endDate }
      },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } }
    });
    
    // Tendencia mensual usando SQL directo para agregaciones complejas
    const monthlyTrend = await prisma.$queryRaw`
      SELECT 
        EXTRACT(year FROM date) as year,
        EXTRACT(month FROM date) as month,
        type,
        SUM(amount) as total
      FROM transactions 
      WHERE user_id = ${userId}::uuid
        AND date >= ${startDate}
        AND date <= ${endDate}
      GROUP BY EXTRACT(year FROM date), EXTRACT(month FROM date), type
      ORDER BY year, month
    `;
    
    return NextResponse.json({
      summary,
      byCategory,
      monthlyTrend,
      period: { startDate, endDate }
    });
    
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🔄 Integración con Clerk

### **Migración Planificada**
```typescript
// clerk.ts - Configuración futura
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  
  // Webhooks para sincronización
  webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  
  // Custom claims
  sessionClaims: {
    finnanceRole: 'user.role',
    finnancePermissions: 'user.permissions'
  }
};

// Middleware híbrido durante migración
export async function hybridAuth(request: NextRequest) {
  // Intentar autenticación Clerk primero
  try {
    const clerkAuth = await getAuth(request);
    if (clerkAuth.userId) {
      return clerkAuth;
    }
  } catch (error) {
    // Fallback a JWT si Clerk falla
    return verifyJWT(request);
  }
}
```

## 🛡️ Seguridad y Validación

### **Validación de Entrada**
```typescript
// /src/lib/validation.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(255),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  paymentMethod: z.enum(['cash', 'card', 'transfer', 'check']),
  propertyId: z.string().optional(),
  vehicleId: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export function validateTransaction(data: any) {
  try {
    const validated = transactionSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    return { 
      isValid: false, 
      data: null, 
      errors: error.errors 
    };
  }
}
```

### **Rate Limiting**
```typescript
// /src/lib/rateLimit.ts
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  ip: string, 
  maxRequests: number = 100, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

## 📈 Performance y Optimización

### **Database Optimization**
```typescript
// Índices MongoDB optimizados
db.transactions.createIndex({ userId: 1, date: -1 });
db.transactions.createIndex({ userId: 1, type: 1, category: 1 });
db.transactions.createIndex({ userId: 1, propertyId: 1 });
db.transactions.createIndex({ userId: 1, vehicleId: 1 });
db.transactions.createIndex({ description: "text", notes: "text" });

// Connection pooling
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};
```

### **Caching Strategy**
```typescript
// /src/lib/cache.ts
const cache = new Map();

export function cacheGet(key: string) {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

export function cacheSet(key: string, data: any, ttl: number = 300000) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  });
}
```

## 🔧 Configuración y Deployment

### **Variables de Entorno**
```env
# Base de datos
MONGODB_URI=mongodb://mongo:mongo@192.168.1.87:27158/finnance

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Clerk (futuro)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# File Upload
UPLOAD_MAX_SIZE=5242880  # 5MB
ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **Healthcheck Endpoint**
```typescript
// /api/health
export async function GET() {
  try {
    await connectDB();
    
    // Test database connection
    const dbStatus = await mongoose.connection.db.admin().ping();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 });
  }
}
```

## 🚀 Próximas Mejoras Backend

### **Funcionalidades Planificadas**
1. **GraphQL API** - Alternativa a REST
2. **WebSocket Support** - Updates en tiempo real
3. **File Upload** - Manejo de recibos y documentos
4. **Background Jobs** - Procesamiento asíncrono
5. **Audit Logs** - Trazabilidad completa
6. **Data Export** - Backups automáticos
7. **Multi-tenancy** - Soporte para organizaciones
8. **API Versioning** - Versionado de endpoints
9. **Monitoring** - Métricas y alertas
10. **Load Balancing** - Escalabilidad horizontal

### **Mejoras Técnicas**
- **Redis Cache** para session storage
- **MongoDB Atlas** para producción
- **Docker containerization**
- **CI/CD pipelines**
- **API Documentation** con OpenAPI/Swagger
- **End-to-end testing** con Jest/Supertest
- **Performance monitoring** con New Relic
- **Error tracking** con Sentry
