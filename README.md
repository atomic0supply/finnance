# 💰 Finnance - Gestión Financiera Personal

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Sistema completo de gestión financiera personal con autenticación JWT, control de gastos, seguimiento de propiedades y vehículos, reportes detallados y calendario de pagos.

## 🌟 Características Principales

### 🔐 **Autenticación y Seguridad**
- **JWT Authentication** con tokens seguros y renovación automática
- **Sistema de roles** (Admin, Usuario, Viewer) con permisos granulares
- **Contraseñas encriptadas** con bcrypt
- **Middleware de protección** para rutas privadas
- **Validación de entrada** en todos los endpoints

### 📊 **Gestión Financiera**
- **Transacciones completas** con categorías, etiquetas y filtros
- **Propiedades** - Gestión de bienes raíces y gastos asociados
- **Vehículos** - Seguimiento de impuestos, servicios y mantenimiento
- **Servicios recurrentes** - Suscripciones, utilidades y membresías
- **Calendario de pagos** - Vista interactiva de fechas de vencimiento

### 📈 **Reportes y Análisis**
- **Dashboard interactivo** con gráficos y estadísticas
- **Reportes detallados** por categoría, período y usuario
- **Exportación** a CSV/Excel con filtros personalizados
- **Adjuntar recibos** a transacciones

### 🎨 **Interfaz de Usuario**
- **Diseño moderno** con shadcn/ui y Tailwind CSS
- **Totalmente responsive** para desktop y móvil
- **Tema claro/oscuro** (configurable)
- **Navegación intuitiva** con sidebar y breadcrumbs

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15.3.4** - Framework React con App Router
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de estilos utilitarios
- **shadcn/ui** - Componentes UI reutilizables y accesibles
- **Zustand** - Gestión de estado global reactiva

### **Backend**
- **Next.js API Routes** - Endpoints RESTful
- **JWT** - Autenticación con tokens seguros
- **bcrypt** - Encriptación de contraseñas
- **Middleware personalizado** - Protección de rutas

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **OpenAPI 3.0** - Documentación de API
- **Git** - Control de versiones

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticación (login, register, profile)
│   │   └── transactions/  # Gestión de transacciones
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── ...                # Otras rutas
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base de shadcn/ui
│   ├── AppSidebar.tsx    # Sidebar de navegación
│   ├── ConditionalLayout.tsx # Layout condicional
│   └── ...
├── lib/                   # Utilidades y configuración
│   ├── auth.ts           # Lógica de autenticación
│   ├── jwt.ts            # Manejo de tokens JWT
│   └── utils.ts          # Utilidades generales
├── stores/               # Gestión de estado con Zustand
│   ├── useAuthStore.ts   # Estado de autenticación
│   └── useFinanceStore.ts # Estado financiero
├── types/                # Definiciones de tipos TypeScript
└── data/                 # Datos de ejemplo y mock
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/atomic0supply/finnance.git
cd finnance

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### **Cuentas de Demostración**
- **Administrador**: `admin@finnance.com` / `admin123`
- **Usuario**: `user@finnance.com` / `user123`

## 📋 Comandos Disponibles

| Comando              | Descripción                         |
|---------------------|-------------------------------------|
| `npm run dev`       | Inicia el servidor de desarrollo    |
| `npm run build`     | Genera build de producción         |
| `npm run start`     | Sirve la aplicación compilada      |
| `npm run lint`      | Ejecuta ESLint                     |
| `npm run type-check`| Valida tipos TypeScript            |
| `npm test`          | Ejecuta pruebas                    |

## 🔐 Seguridad

### **Características de Seguridad**
- **JWT Authentication** con tokens de acceso y refresh
- **Contraseñas hasheadas** con bcrypt (salt rounds: 12)
- **Middleware de protección** para rutas API
- **Validación de entrada** en todos los endpoints
- **Control de acceso basado en roles** (RBAC)
- **Tokens con expiración** (15 min acceso, 7 días refresh)

### **Roles y Permisos**
- **Admin**: Acceso completo a todas las funcionalidades
- **User**: Puede gestionar sus propias transacciones y datos
- **Viewer**: Solo lectura de datos propios

Ver [SECURITY.md](docs/SECURITY.md) para más detalles sobre seguridad.

## 📊 API Documentation

La API está documentada usando OpenAPI 3.0. Puedes explorar los endpoints en:

- **Documentación**: [docs/openapi.yaml](docs/openapi.yaml)
- **Swagger UI**: Próximamente en `/api/docs`

### **Endpoints Principales**
- `POST /api/auth/login` - Autenticación
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Perfil del usuario
- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar dominio personalizado
vercel domains add yourdomain.com
```

### **Docker**
```bash
# Construir imagen
docker build -t finnance .

# Ejecutar contenedor
docker run -p 3000:3000 finnance
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Zustand](https://github.com/pmndrs/zustand) por la gestión de estado

---

**Mantén tus finanzas bajo control y nunca pierdas un pago!** 💰✨
