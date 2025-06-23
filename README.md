# Andes Filter

[![codecov](https://codecov.io/github/AndesProject/andes-filter/branch/master/graph/badge.svg?token=KT8REBY8K1)](https://codecov.io/github/AndesProject/andes-filter)
[![codecov](https://codecov.io/github/AndesProject/andes-filter/branch/master/graphs/sunburst.svg?token=KT8REBY8K1)](https://codecov.io/github/AndesProject/andes-filter)

## ¿Qué es Andes Filter?

**Andes Filter** es una librería de filtrado avanzada desarrollada en TypeScript que permite aplicar filtros complejos y condiciones a colecciones de datos de manera intuitiva y programática. Utiliza objetos para definir condiciones, permitiendo combinar operadores lógicos y relacionales para construir consultas eficientes y escalables.

### Características Principales

- 🎯 **Filtrado Intuitivo**: Define filtros complejos usando objetos
- 🔗 **Operadores Lógicos**: Combina múltiples condiciones con AND, OR, NOT
- 📊 **Escalabilidad**: Diseñado para manejar grandes volúmenes de datos
- 🚀 **Alto Rendimiento**: Optimizado para consultas eficientes
- 🛡️ **Type Safety**: Desarrollado en TypeScript para máxima seguridad de tipos
- 🔧 **Fácil de Usar**: Sintaxis clara y consistente

## Instalación

```bash
npm install @andes/filter
```

## Uso Básico

```typescript
import { createFilterEngine } from '@andes/filter'

// Datos de ejemplo
const users = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@example.com', active: true },
  { id: 2, name: 'Bob', age: 30, email: 'bob@example.com', active: false },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com', active: true },
]

// Crear el motor de filtros
const filter = createFilterEngine(users)

// Buscar usuarios activos mayores de 25 años
const result = filter.findMany({
  where: {
    active: { equals: true },
    age: { gt: 25 }
  }
})

console.log(result.data) // [Charlie]
```

## API Principal

### `createFilterEngine<T>(dataSource: T[])`

Crea un motor de filtros para una colección de datos.

**Parámetros:**
- `dataSource`: Array de objetos a filtrar

**Retorna:**
- Objeto con métodos `findMany` y `findUnique`

### `findMany(query: FilterQuery<T>)`

Busca múltiples elementos que coincidan con los criterios.

### `findUnique(query: FilterQuery<T>)`

Busca un único elemento que coincida con los criterios.

## Operadores de Filtrado

### Operadores de Comparación Básica

#### `equals`
Igual a un valor específico.

```typescript
// Buscar usuarios con nombre "Alice"
filter.findMany({
  where: { name: { equals: 'Alice' } }
})
```

#### `not`
No igual a un valor específico.

```typescript
// Buscar usuarios que NO se llamen "Alice"
filter.findMany({
  where: { name: { not: 'Alice' } }
})
```

#### `in` / `notIn`
Dentro o fuera de un conjunto de valores.

```typescript
// Buscar usuarios con nombres específicos
filter.findMany({
  where: { name: { in: ['Alice', 'Bob', 'Charlie'] } }
})

// Buscar usuarios que NO tengan estos nombres
filter.findMany({
  where: { name: { notIn: ['Alice', 'Bob'] } }
})
```

### Operadores Numéricos

#### `lt` / `lte` / `gt` / `gte`
Comparaciones numéricas.

```typescript
// Usuarios menores de 30 años
filter.findMany({
  where: { age: { lt: 30 } }
})

// Usuarios de 25 años o más
filter.findMany({
  where: { age: { gte: 25 } }
})
```

### Operadores de String

#### `contains` / `notContains`
Contiene o no contiene una subcadena.

```typescript
// Emails que contengan "example"
filter.findMany({
  where: { email: { contains: 'example' } }
})

// Emails que NO contengan "test"
filter.findMany({
  where: { email: { notContains: 'test' } }
})
```

#### `startsWith` / `notStartsWith`
Comienza o no comienza con una subcadena.

```typescript
// Nombres que empiecen con "A"
filter.findMany({
  where: { name: { startsWith: 'A' } }
})
```

#### `endsWith` / `notEndsWith`
Termina o no termina con una subcadena.

```typescript
// Emails que terminen en ".com"
filter.findMany({
  where: { email: { endsWith: '.com' } }
})
```

#### `mode: 'insensitive'`
Comparación insensible a mayúsculas/minúsculas.

```typescript
// Buscar "alice" sin importar mayúsculas
filter.findMany({
  where: { name: { equals: 'alice', mode: 'insensitive' } }
})
```

#### `regex`
Filtrado con expresiones regulares.

```typescript
// Emails que coincidan con un patrón
filter.findMany({
  where: { email: { regex: /^[a-z]+@example\.com$/ } }
})

// Con flags personalizados
filter.findMany({
  where: { email: { regex: { pattern: 'example', flags: 'i' } } }
})
```

### Operadores de Fecha y Número

#### `before` / `after`
Para fechas y números.

```typescript
// Usuarios creados antes de una fecha
filter.findMany({
  where: { createdAt: { before: new Date('2023-01-01') } }
})

// Usuarios con edad mayor a 25
filter.findMany({
  where: { age: { after: 25 } }
})
```

#### `between`
Rango entre dos valores.

```typescript
// Usuarios entre 25 y 35 años
filter.findMany({
  where: { age: { between: [25, 35] } }
})
```

### Operadores de Array

#### `has` / `hasEvery` / `hasSome`
Para arrays de valores.

```typescript
const users = [
  { id: 1, tags: ['admin', 'user'] },
  { id: 2, tags: ['user'] },
  { id: 3, tags: ['admin', 'moderator'] }
]

// Usuarios con tag "admin"
filter.findMany({
  where: { tags: { has: 'admin' } }
})

// Usuarios con TODOS los tags especificados
filter.findMany({
  where: { tags: { hasEvery: ['admin', 'user'] } }
})

// Usuarios con AL MENOS UNO de los tags especificados
filter.findMany({
  where: { tags: { hasSome: ['admin', 'moderator'] } }
})
```

#### `length`
Filtrado por longitud del array.

```typescript
// Usuarios con más de 2 tags
filter.findMany({
  where: { tags: { length: { gt: 2 } } }
})
```

### Operadores de Relación

#### `some` / `every` / `none`
Para relaciones y arrays de objetos.

```typescript
const users = [
  {
    id: 1,
    posts: [
      { title: 'Post 1', published: true },
      { title: 'Post 2', published: false }
    ]
  },
  {
    id: 2,
    posts: [
      { title: 'Post 3', published: true }
    ]
  }
]

// Usuarios con AL MENOS UN post publicado
filter.findMany({
  where: {
    posts: {
      some: { published: { equals: true } }
    }
  } as any
})

// Usuarios con TODOS los posts publicados
filter.findMany({
  where: {
    posts: {
      every: { published: { equals: true } }
    }
  } as any
})

// Usuarios con NINGÚN post publicado
filter.findMany({
  where: {
    posts: {
      none: { published: { equals: true } }
    }
  } as any
})
```

### Operadores Lógicos

#### `AND` / `OR` / `NOT`
Combinación de múltiples condiciones.

```typescript
// Usuarios activos Y mayores de 25 años
filter.findMany({
  where: {
    AND: [
      { active: { equals: true } },
      { age: { gt: 25 } }
    ]
  }
})

// Usuarios activos O mayores de 30 años
filter.findMany({
  where: {
    OR: [
      { active: { equals: true } },
      { age: { gt: 30 } }
    ]
  }
})

// Usuarios que NO sean "Alice"
filter.findMany({
  where: {
    NOT: { name: { equals: 'Alice' } }
  }
})
```

### Operadores Especiales

#### `isNull`
Verificar si un campo es null.

```typescript
// Usuarios sin email
filter.findMany({
  where: { email: { isNull: true } }
})
```

## Paginación y Ordenamiento

### Paginación

```typescript
// Obtener primera página con 10 elementos
const result = filter.findMany({
  where: { active: { equals: true } },
  pagination: {
    page: 1,
    size: 10
  }
})

console.log(result.pagination)
// {
//   page: 1,
//   size: 10,
//   totalItems: 25,
//   totalPages: 3,
//   hasNext: true,
//   hasPrev: false
// }
```

### Ordenamiento

```typescript
// Ordenar por edad ascendente
filter.findMany({
  where: { active: { equals: true } },
  orderBy: { age: 'asc' }
})

// Ordenar por nombre descendente
filter.findMany({
  where: { active: { equals: true } },
  orderBy: { name: 'desc' }
})
```

## Ejemplos Avanzados

### Filtros Complejos

```typescript
const result = filter.findMany({
  where: {
    OR: [
      {
        AND: [
          { age: { gte: 25 } },
          { email: { contains: 'example' } }
        ]
      },
      {
        AND: [
          { active: { equals: true } },
          { name: { startsWith: 'A' } }
        ]
      }
    ]
  },
  pagination: { page: 1, size: 20 },
  orderBy: { name: 'asc' }
})
```

### Filtros con Relaciones Anidadas

```typescript
const result = filter.findMany({
  where: {
    posts: {
      some: {
        AND: [
          { published: { equals: true } },
          { category: { in: ['tech', 'news'] } }
        ]
      }
    },
    profile: {
      every: {
        verified: { equals: true }
      }
    }
  } as any
})
```

## Casos de Uso Comunes

### Búsqueda de Usuarios

```typescript
// Búsqueda avanzada de usuarios
const searchUsers = (searchTerm: string, filters: any) => {
  return filter.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ],
      ...filters
    },
    pagination: { page: 1, size: 50 },
    orderBy: { name: 'asc' }
  })
}
```

### Filtrado de Productos

```typescript
// Filtrado de productos con múltiples criterios
const filterProducts = (category: string, priceRange: [number, number], tags: string[]) => {
  return filter.findMany({
    where: {
      category: { equals: category },
      price: { between: priceRange },
      tags: { hasSome: tags }
    },
    pagination: { page: 1, size: 20 },
    orderBy: { price: 'asc' }
  })
}
```

## Rendimiento y Optimización

- La librería está optimizada para manejar grandes volúmenes de datos
- Utiliza algoritmos eficientes para evaluar filtros
- Soporta paginación para evitar cargar datos innecesarios
- TypeScript proporciona verificación de tipos en tiempo de compilación

## Compatibilidad

- **Node.js**: >= 22.0.0
- **TypeScript**: >= 5.4.5
- **Navegadores**: Compatible con ES6+

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.
