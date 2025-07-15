# Finnance - Estructura de Ramas

## 🌳 Estructura de Ramas

Este proyecto utiliza un flujo de trabajo de Git con dos ramas principales:

### 📋 Ramas Principales

- **`main`**: Rama de producción estable
  - Contiene código listo para producción
  - Solo acepta Pull Requests desde `dev`
  - Protegida contra push directo
  - Despliega automáticamente a producción

- **`dev`**: Rama de desarrollo
  - Rama principal para desarrollo activo
  - Integra todas las nuevas funcionalidades
  - Base para crear nuevas ramas de features
  - Despliega automáticamente a entorno de staging

### 🔄 Flujo de Trabajo

1. **Desarrollo de Features**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nombre-feature
   # Desarrollar la funcionalidad
   git add .
   git commit -m "feat: descripción del feature"
   git push origin feature/nombre-feature
   ```

2. **Pull Request a Dev**:
   - Crear PR desde `feature/nombre-feature` hacia `dev`
   - Revisar y aprobar código
   - Mergear a `dev`

3. **Release a Main**:
   - Crear PR desde `dev` hacia `main`
   - Revisar código final
   - Mergear a `main` para release

### 🛡️ Protección de Ramas

#### Rama `main`:
- Requiere Pull Request para cambios
- Requiere revisión de código
- Requiere que los checks de CI pasen
- No permite push directo

#### Rama `dev`:
- Requiere Pull Request para cambios
- Requiere que los checks de CI pasen
- Permite push directo para maintainers

### 📝 Convenciones de Commit

Utiliza [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin cambios de código)
- `refactor:` Refactorización de código
- `test:` Añadir o corregir tests
- `chore:` Tareas de mantenimiento

### 🚀 Comandos Útiles

```bash
# Sincronizar con remoto
git fetch origin
git checkout dev
git pull origin dev

# Crear nueva rama de feature
git checkout -b feature/mi-feature

# Actualizar rama con cambios de dev
git checkout feature/mi-feature
git rebase dev

# Limpiar ramas locales
git branch -d nombre-rama
git branch -D nombre-rama  # Forzar eliminación
```

### 📊 CI/CD

El proyecto incluye workflows de GitHub Actions que se ejecutan en:
- Push a `main` o `dev`
- Pull Requests hacia `main`

Los workflows incluyen:
- Tests automatizados
- Linting
- Build del proyecto
- Deploy automático (solo en `main`)
