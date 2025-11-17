# Configuración para Publicación Automática en npm

Este documento explica cómo configurar la publicación automática del paquete `@alfasync/filter` en npm usando GitHub Actions.

## Requisitos Previos

1. Tener una cuenta en npm con acceso a la organización `@alfasync`
2. Tener permisos de administrador en el repositorio de GitHub

## Pasos para Configurar

### 1. Crear un Token de Acceso en npm

1. Inicia sesión en [npmjs.com](https://www.npmjs.com/)
2. Ve a tu perfil → **Access Tokens** (o directamente: https://www.npmjs.com/settings/[TU_USUARIO]/tokens)
3. Haz clic en **Generate New Token**
4. Selecciona el tipo de token:
   - **Automation**: Para CI/CD (recomendado)
   - O **Publish**: Si solo necesitas publicar paquetes
5. Selecciona el scope: **Read and Publish** para la organización `@alfasync`
6. Copia el token generado (solo se muestra una vez)

### 2. Agregar el Token como Secret en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/alfasync/filter`
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret**
4. Configura:
   - **Name**: `NPM_TOKEN`
   - **Secret**: Pega el token de npm que copiaste
5. Haz clic en **Add secret**

### 3. Verificar Permisos del Workflow

El workflow ya está configurado con los permisos necesarios:
- `contents: write` - Para crear tags y commits
- `id-token: write` - Para autenticación

## Cómo Usar el Workflow

### Opción 1: Publicar desde un Release de GitHub

1. Ve a **Releases** en tu repositorio
2. Haz clic en **Create a new release**
3. Crea un nuevo tag:
   - **Versión estable**: `v0.1.1` → Se publicará con tag `latest` en npm
   - **Versión beta**: `v1.0.0-beta.1` → Se publicará con tag `beta` en npm
   - **Versión alpha**: `v1.0.0-alpha.1` → Se publicará con tag `alpha` en npm
   - **Release candidate**: `v1.0.0-rc.1` → Se publicará con tag `rc` en npm
4. Completa el título y descripción
5. Marca **"Set as a pre-release"** si es una versión beta/alpha/rc
6. Haz clic en **Publish release**
7. El workflow se ejecutará automáticamente y:
   - Detectará si es una versión pre-release por el formato del tag
   - Publicará en npm con el tag correspondiente
   - Marcará el release de GitHub como pre-release si corresponde

### Opción 2: Publicar Manualmente desde GitHub Actions

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow **Publish to npm**
3. Haz clic en **Run workflow**
4. Configura los parámetros:
   - **Version**: Selecciona el tipo de versión:
     - **patch**: 0.1.0 → 0.1.1
     - **minor**: 0.1.0 → 0.2.0
     - **major**: 0.1.0 → 1.0.0
   - **Is pre-release** (opcional): Marca si es una versión beta/alpha/rc
   - **Pre-release type** (si is pre-release está marcado):
     - **beta**: Para versiones beta (ej: 1.0.0-beta.1)
     - **alpha**: Para versiones alpha (ej: 1.0.0-alpha.1)
     - **rc**: Para release candidates (ej: 1.0.0-rc.1)
   - **Pre-release number** (opcional): Número específico del pre-release
     - Si se deja vacío, auto-incrementa basándose en versiones existentes
     - Ejemplo: Si ya existe 1.0.0-beta.1, creará 1.0.0-beta.2
   - **Branch** (opcional): Especifica la rama desde donde publicar
     - Si se deja vacío, detecta automáticamente la rama principal (`master` o `main`)
     - Recomendado: dejar vacío para usar la detección automática
5. Haz clic en **Run workflow**
6. El workflow:
   - Detectará automáticamente la rama principal si no se especifica
   - Actualizará la versión en `package.json` (con pre-release si corresponde)
   - Ejecutará tests y build
   - Publicará en npm con el tag correspondiente (`latest`, `beta`, `alpha`, `rc`)
   - Creará un tag y release en GitHub (marcado como pre-release si corresponde)
   - Hará push de los cambios a la rama especificada

## Verificación

Después de que el workflow se complete exitosamente:

1. Verifica en npm: https://www.npmjs.com/package/@alfasync/filter
2. Verifica en GitHub: El release debería aparecer en la sección de Releases
3. Verifica el tag: Debería aparecer en la sección de Tags

## Troubleshooting

### Error: "npm ERR! code ENEEDAUTH"
- Verifica que el secret `NPM_TOKEN` esté configurado correctamente
- Asegúrate de que el token tenga permisos de publicación para `@alfasync`

### Error: "npm ERR! code E403"
- Verifica que tengas permisos de publicación en la organización `@alfasync`
- Verifica que el paquete no esté publicado con una versión duplicada

### Error: "Permission denied"
- Verifica que el workflow tenga permisos de escritura en el repositorio
- Ve a Settings → Actions → General → Workflow permissions

## Manejo de Ramas

El workflow está diseñado para trabajar con cualquier rama principal:

- **Detección automática**: Si no especificas una rama, el workflow detecta automáticamente la rama principal (`master` o `main`)
- **Rama personalizada**: Puedes especificar manualmente la rama desde donde publicar
- **Recomendación**: Usa siempre la rama principal para publicar versiones estables

### Flujo Recomendado de Ramas

1. **Desarrollo**: Trabaja en ramas de feature (`feature/nueva-funcionalidad`)
2. **Integración**: Haz merge a la rama principal (`master` o `main`)
3. **Publicación**: Publica desde la rama principal usando el workflow

## Publicación de Versiones Beta/Pre-release

### ¿Qué son las versiones pre-release?

Las versiones pre-release permiten publicar versiones de prueba antes de la versión estable final. Son útiles para:
- Probar nuevas funcionalidades con usuarios beta
- Obtener feedback antes del lanzamiento oficial
- Publicar release candidates antes de la versión final

### Tipos de Pre-release

- **beta**: Versiones beta para testing (ej: `1.0.0-beta.1`, `1.0.0-beta.2`)
- **alpha**: Versiones alpha tempranas (ej: `1.0.0-alpha.1`)
- **rc**: Release candidates (ej: `1.0.0-rc.1`)

### Cómo Publicar una Versión Beta

1. Ve a **Actions** → **Publish to npm** → **Run workflow**
2. Configura:
   - **Version**: Selecciona el tipo base (patch/minor/major)
   - **Is pre-release**: ✅ Marca esta opción
   - **Pre-release type**: Selecciona `beta`
   - **Pre-release number**: Déjalo vacío para auto-incrementar
3. El workflow creará una versión como `1.0.0-beta.1` y la publicará con el tag `beta`

### Instalación de Versiones Beta

Los usuarios pueden instalar versiones beta usando:

```bash
# Instalar la última versión beta
npm install @alfasync/filter@beta

# Instalar una versión beta específica
npm install @alfasync/filter@1.0.0-beta.1
```

### Auto-incremento de Pre-releases

Si publicas múltiples betas de la misma versión base:
- Primera beta: `1.0.0-beta.1`
- Segunda beta: `1.0.0-beta.2` (auto-incrementado)
- Tercera beta: `1.0.0-beta.3` (auto-incrementado)

El workflow detecta automáticamente la última versión beta publicada y incrementa el número.

### Publicar Versión Estable desde Beta

Cuando estés listo para publicar la versión estable:
1. Ejecuta el workflow **sin** marcar "Is pre-release"
2. La versión será `1.0.0` (sin sufijo beta)
3. Se publicará con el tag `latest` en npm

## Notas Importantes

- El workflow ejecuta `prepublishOnly` que incluye build y tests
- Solo se publica si todos los tests pasan
- La versión se actualiza automáticamente según el tipo seleccionado
- Los commits de versión incluyen `[skip ci]` para evitar bucles
- El workflow detecta automáticamente si tu rama principal es `master` o `main`
- Las versiones pre-release se publican con tags específicos (`beta`, `alpha`, `rc`) en npm
- Los releases de GitHub se marcan automáticamente como `prerelease: true` para versiones beta
