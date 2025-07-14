# FinnanceApp

FinnanceApp es una aplicación de finanzas personales desarrollada con **Next.js** y **Tailwind CSS**. Permite registrar gastos e ingresos, gestionar propiedades y vehículos y visualizar las fechas de pago de manera sencilla.

## Características principales

- **Seguimiento de servicios**: registra pagos recurrentes mensuales o anuales.
- **Gestión de propiedades**: asocia facturas o servicios a una vivienda o inmueble.
- **Gestión de vehículos**: controla impuestos, mantenimientos y gastos del vehículo.
- **Calendario de pagos**: consulta todas las obligaciones próximas en un calendario interactivo.
- **Administración de transacciones**: importa y exporta movimientos en CSV o Excel, adjuntando comprobantes si es necesario.

## Tecnologías utilizadas

- **Next.js 15**
- **React 19**
- **Tailwind CSS** (componentes shadcn/ui)
- **TypeScript**

## Puesta en marcha

1. Clona el repositorio
   ```bash
   git clone https://github.com/your-username/finnance.git
   cd finnance
   ```
2. Instala las dependencias
   ```bash
   npm install
   ```
3. Arranca el servidor de desarrollo
   ```bash
   npm run dev
   ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts útiles

El archivo `script.sh` permite iniciar o detener el servidor rápidamente:

```bash
./script.sh start   # inicia el servidor
./script.sh stop    # detiene el servidor
```

## Contribución

1. Haz un _fork_ del proyecto.
2. Crea una rama para tu funcionalidad `git checkout -b feature/TuFuncionalidad`.
3. Envía tus cambios mediante un *pull request*.

## Licencia

Este proyecto se distribuye bajo licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

