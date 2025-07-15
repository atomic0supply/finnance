# FinnanceApp

[![CI/CD Pipeline](https://github.com/atomic0supply/finnance/actions/workflows/ci.yml/badge.svg)](https://github.com/atomic0supply/finnance/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Aplicación de finanzas personales construida con Next.js y shadcn/ui para gestionar gastos, propiedades, vehículos y calendarios de pago en un solo lugar.

## 🌳 Estructura del Proyecto

- **`main`**: Rama de producción estable
- **`dev`**: Rama de desarrollo activo

Ver [BRANCHING.md](BRANCHING.md) para más detalles sobre el flujo de trabajo.

## 🚀 Features

Service Tracking: Add and monitor recurring services (billed monthly or annually), such as subscriptions, utilities, and memberships.

Properties Management: Create entries for each property (home, villa, etc.) and assign bills or services to specific properties.

Vehicle Management: Track taxes, services, and maintenance costs for each vehicle you own.

Payment Calendar: View all upcoming payments in an interactive calendar to stay on top of due dates.

Responsive UI: Sleek, modern interface powered by shadcn/ui, fully responsive for desktop and mobile.

Transaction Management: Add, edit, delete and duplicate entries. Import or export transactions as CSV or Excel files and attach receipts.

🛠️ Tech Stack

Framework: React

UI Library: shadcn/ui (Tailwind CSS-based components)

State Management: Zustand or Context API

Data Storage: LocalStorage (for MVP) / SQLite or Postgres (for future expansion)

Calendar: FullCalendar or React Calendar integration

## 🏗️ Arquitectura

La aplicación está construida con **Next.js** utilizando el directorio `src`:

- `app/` contiene las rutas de la interfaz y las API (`api/transactions`).
- `components/` agrupa componentes reutilizables de React.
- `services/` incluye la lógica de negocio, como el servicio de transacciones.
- `data/` almacena datos de ejemplo usados durante el desarrollo.

La documentación de la API se encuentra en [`docs/openapi.yaml`](docs/openapi.yaml) y puede explorarse con cualquier visor de Swagger.

## 🔧 Puesta en marcha

```bash
git clone https://github.com/your-username/finnance.git
cd finnance
npm install
cp .env.example .env
npx shadcn-ui init
npm run dev
```

Variables de entorno relevantes:
- `ADMIN_TOKEN` y `USER_TOKEN` para autenticar las peticiones a la API.

Ejecuta `npm run typecheck` para validar TypeScript. La aplicación estará disponible en `http://localhost:3000`.

## 📑 Comandos útiles

| Comando            | Descripción                     |
|--------------------|---------------------------------|
| `npm run dev`      | Inicia el servidor de desarrollo|
| `npm test`         | Ejecuta la suite de pruebas     |
| `npm run lint`     | Revisa el formato del código    |
| `npm run build`    | Genera la versión de producción |
| `npm start`        | Sirve la aplicación compilada   |

## 🧪 Tests

Las pruebas están escritas con el runner de Node. Ejecuta:

```bash
npm test
```

Se generará un reporte de cobertura en la terminal.

## 🚀 Despliegue

Para generar una build de producción ejecuta:

```bash
npm run build
npm start
```

Estos comandos compilan la aplicación y la sirven en modo producción.

⚙️ Usage

Add Services: Navigate to the Services page, click Add Service, fill in name, amount, billing frequency (monthly/annually), and assign to a property or general.

Manage Properties: Go to Properties, click New Property, enter details (name, address), and link bills or services.

Track Vehicles: Under Vehicles, add each vehicle and log taxes, service appointments, maintenance costs.

View Calendar: Open the Calendar view to see payment due dates and filter by category (Services, Properties, Vehicles).

🤝 Contributing

Consulta la guía de contribución en [CONTRIBUTING.md](CONTRIBUTING.md) para conocer el flujo de trabajo y las normas del proyecto.

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

Keep your finances in check and never miss a bill!
