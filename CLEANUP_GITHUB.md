# 🧹 Instrucciones para Limpiar GitHub

## 📋 Acciones Recomendadas en GitHub

### 1. **Mergear dev → main**
```bash
# Desde la interfaz de GitHub:
# 1. Ir a https://github.com/atomic0supply/finnance
# 2. Hacer clic en "New pull request"
# 3. Base: main ← Compare: dev
# 4. Título: "Release: Project structure and CI/CD setup"
# 5. Mergear el PR
```

### 2. **Cerrar Pull Requests Obsoletos**
Los siguientes PRs parecen ser obsoletos y deben cerrarse:
- **PR #1**: Cerrar con comentario "Superseded by new project structure"
- **PR #2**: `codex/mejora-el-readme.md-y-corrige-errores` - Cerrar
- **PR #3**: `hhamxb-codex/mejora-el-readme.md-y-corrige-errores` - Cerrar

### 3. **Eliminar Ramas Remotas Innecesarias**
```bash
# Ejecutar localmente después de cerrar los PRs:
git push origin --delete codex/mejora-el-readme.md-y-corrige-errores
git push origin --delete hhamxb-codex/mejora-el-readme.md-y-corrige-errores
```

### 4. **Configurar Protección de Ramas**
En GitHub → Settings → Branches:

#### Para la rama `main`:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files larger than 100 MB

#### Para la rama `dev`:
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### 5. **Establecer Rama por Defecto**
- Mantener `main` como rama por defecto ✅ (ya configurado)

## 🔄 Flujo de Trabajo Final

Una vez limpio, el flujo será:

1. **Desarrollo**: Crear features desde `dev`
2. **Integration**: Mergear features → `dev`
3. **Release**: Mergear `dev` → `main` (solo para releases)

## ⚡ Comandos de Limpieza Local

```bash
# Actualizar referencias remotas
git fetch origin --prune

# Limpiar ramas locales tracking eliminadas
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -I {} git branch -d {}

# Verificar estado final
git branch -a
```

## 📊 Estado Final Deseado

```
* dev          (tracking origin/dev)
  main         (tracking origin/main)
  remotes/origin/dev
  remotes/origin/main
```

---

**Nota**: Ejecuta estas acciones en orden para mantener la coherencia del repositorio.
