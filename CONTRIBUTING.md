# Guía de Contribución

¡Gracias por interesarte en colaborar con Finnance! Sigue estos pasos para contribuir de manera efectiva.

## Requisitos Previos

- Node.js >= 20
- npm

## Flujo de Trabajo

1. **Fork y clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/finnance.git
   cd finnance
   ```
2. **Crea tu rama de trabajo desde `dev`**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/mi-cambio
   ```
3. **Instala dependencias y ejecuta pruebas**
   ```bash
   npm install
   npm test
   ```
4. **Realiza tus cambios** siguiendo las convenciones de [BRANCHING.md](BRANCHING.md).
5. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: describe tu cambio"
   git push origin feature/mi-cambio
   ```
6. **Abre un Pull Request** hacia la rama `dev`.

## Estilo de Código

- Usa `npm run lint` para verificar el estilo.
- Escribe pruebas cuando sea posible.
- Sigue las convenciones de [Conventional Commits](https://www.conventionalcommits.org/).

## Código de Conducta

Al participar, aceptas cumplir el [Código de Conducta](CODE_OF_CONDUCT.md).
