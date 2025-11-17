# Servidor MCP para Alfasync Filter

Este servidor MCP (Model Context Protocol) expone las funcionalidades de Alfasync Filter como herramientas que pueden ser utilizadas por clientes MCP compatibles como Cursor, Claude Desktop, u otros.

## Instalación

El servidor MCP ya está incluido en el paquete `@alfasync/filter`. Solo necesitas tener Node.js >= 22.0.0 instalado.

## Ejecución

Para ejecutar el servidor MCP, puedes usar cualquiera de estos métodos:

### Usando npx (recomendado, similar a shadcn):

```bash
npx @alfasync/filter mcp
```

### Usando npm:

```bash
npm run mcp:server
```

## Herramientas Disponibles

El servidor MCP expone las siguientes herramientas:

### 1. `alfasync.findMany`

Filtra una colección usando la sintaxis de alfasync y retorna datos y paginación.

**Parámetros:**
- `data` (array, requerido): Arreglo de objetos/valores a filtrar
- `query` (object, requerido): Objeto de consulta de alfasync (where, pagination, orderBy, distinct)

**Ejemplo:**
```json
{
  "data": [
    { "id": 1, "name": "Alice", "age": 25, "active": true },
    { "id": 2, "name": "Bob", "age": 30, "active": false }
  ],
  "query": {
    "where": {
      "active": { "equals": true },
      "age": { "gt": 25 }
    },
    "pagination": {
      "page": 1,
      "size": 10
    }
  }
}
```

### 2. `alfasync.findUnique`

Encuentra un único elemento que cumpla la consulta de alfasync o null.

**Parámetros:**
- `data` (array, requerido): Arreglo de objetos/valores a evaluar
- `query` (object, requerido): Objeto de consulta de alfasync

### 3. `alfasync.listOperators`

Lista todos los operadores disponibles en alfasync con su categoría.

**Parámetros:** Ninguno

**Retorna:** Lista de operadores agrupados por categoría (Comparación, Numérico, String, Array, Lógico, Utilidad)

### 4. `alfasync.validateQuery`

Valida una query de alfasync antes de ejecutarla, retornando errores si los hay.

**Parámetros:**
- `query` (object, requerido): Objeto de consulta de alfasync a validar

**Retorna:** Objeto con `valid` (boolean) y `errors` (array de strings)

### 5. `alfasync.getDocumentation`

Obtiene documentación detallada de un operador específico de alfasync.

**Parámetros:**
- `operator` (string, opcional): Nombre del operador del cual obtener documentación. Si no se proporciona, retorna documentación de todos los operadores.

**Ejemplo:**
```json
{
  "operator": "equals"
}
```

## Configuración para Cursor

Para usar este servidor MCP en Cursor, agrega la siguiente configuración en tu archivo de configuración MCP:

```json
{
  "mcpServers": {
    "alfasync": {
      "command": "npx",
      "args": ["-y", "@alfasync/filter", "filter", "mcp"],
      "cwd": "."
    }
  }
}
```

Esta configuración usa `npx` para ejecutar el binario `filter` del paquete `@alfasync/filter` con el comando `mcp`.

**Nota:** Para scoped packages como `@alfasync/filter`, npx requiere especificar el nombre del binario (`filter`) explícitamente. El comando completo es: `npx @alfasync/filter filter mcp`.

### Alternativas

Si prefieres usar npm directamente:

```json
{
  "mcpServers": {
    "alfasync": {
      "command": "npm",
      "args": ["run", "mcp:server"],
      "cwd": "/ruta/a/alfasync"
    }
  }
}
```

O si quieres usar tsx directamente:

```json
{
  "mcpServers": {
    "alfasync": {
      "command": "tsx",
      "args": ["mcp/server.ts"],
      "cwd": "/ruta/a/alfasync"
    }
  }
}
```

## Operadores Disponibles

El servidor soporta todos los operadores de Alfasync Filter:

### Comparación
- `equals`: Igual a un valor específico
- `not`: No igual a un valor específico
- `in`: Dentro de un conjunto de valores
- `notIn`: Fuera de un conjunto de valores

### Numérico
- `lt`, `lte`, `gt`, `gte`: Comparaciones numéricas

### String
- `contains`, `notContains`: Contiene o no contiene una subcadena
- `startsWith`, `notStartsWith`: Comienza o no comienza con una subcadena
- `endsWith`, `notEndsWith`: Termina o no termina con una subcadena
- `regex`: Filtrado con expresiones regulares
- `mode: 'insensitive'`: Comparación insensible a mayúsculas/minúsculas

### Fecha/Numérico
- `before`, `after`: Antes o después de una fecha o número
- `between`: Entre dos valores

### Array
- `some`, `none`, `every`: Para arrays de objetos
- `has`, `hasEvery`, `hasSome`: Para arrays de valores
- `length`: Filtrado por longitud del array

### Lógico
- `AND`, `OR`, `NOT`: Combinación de múltiples condiciones

### Utilidad
- `isNull`: Verificar si un campo es null
- `distinct`: Verificar si los valores son distintos

Para más detalles sobre cada operador, usa la herramienta `alfasync.getDocumentation`.

## Desarrollo

El servidor MCP está escrito en TypeScript y se ejecuta usando `tsx` para permitir ejecución directa sin compilación previa.

Para desarrollo local:
```bash
npm install
npm run mcp:server
```
