import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { getKnownOperators } from '../src/filter/evaluate-filter/evaluate-filter.map'
import { createFilter } from '../src/filter/filter-from'
import type { FilterQuery } from '../src/filter/filter.interface'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8'),
) as { version: string }

const OPERATORS_DOCUMENTATION: Record<
  string,
  {
    description: string
    category: string
    example: string
  }
> = {
  equals: {
    description: 'Igual a un valor específico',
    category: 'Comparación',
    example: '{ name: { equals: "Alice" } }',
  },
  not: {
    description: 'No igual a un valor específico',
    category: 'Comparación',
    example: '{ name: { not: "Bob" } }',
  },
  in: {
    description: 'Dentro de un conjunto de valores',
    category: 'Comparación',
    example: '{ name: { in: ["Alice", "Bob"] } }',
  },
  notIn: {
    description: 'Fuera de un conjunto de valores',
    category: 'Comparación',
    example: '{ name: { notIn: ["Alice", "Bob"] } }',
  },
  lt: {
    description: 'Menor que un valor',
    category: 'Numérico',
    example: '{ age: { lt: 30 } }',
  },
  lte: {
    description: 'Menor o igual que un valor',
    category: 'Numérico',
    example: '{ age: { lte: 30 } }',
  },
  gt: {
    description: 'Mayor que un valor',
    category: 'Numérico',
    example: '{ age: { gt: 25 } }',
  },
  gte: {
    description: 'Mayor o igual que un valor',
    category: 'Numérico',
    example: '{ age: { gte: 25 } }',
  },
  contains: {
    description: 'Contiene una subcadena',
    category: 'String',
    example: '{ email: { contains: "example" } }',
  },
  notContains: {
    description: 'No contiene una subcadena',
    category: 'String',
    example: '{ email: { notContains: "test" } }',
  },
  startsWith: {
    description: 'Comienza con una subcadena',
    category: 'String',
    example: '{ name: { startsWith: "A" } }',
  },
  notStartsWith: {
    description: 'No comienza con una subcadena',
    category: 'String',
    example: '{ name: { notStartsWith: "B" } }',
  },
  endsWith: {
    description: 'Termina con una subcadena',
    category: 'String',
    example: '{ email: { endsWith: ".com" } }',
  },
  notEndsWith: {
    description: 'No termina con una subcadena',
    category: 'String',
    example: '{ email: { notEndsWith: ".net" } }',
  },
  regex: {
    description: 'Filtrado con expresiones regulares',
    category: 'String',
    example:
      '{ email: { regex: { pattern: "^[a-z]+@example\\.com$", flags: "i" } } }',
  },
  before: {
    description: 'Antes de una fecha o número',
    category: 'Fecha/Numérico',
    example: '{ createdAt: { before: new Date("2023-01-01") } }',
  },
  after: {
    description: 'Después de una fecha o número',
    category: 'Fecha/Numérico',
    example: '{ age: { after: 25 } }',
  },
  between: {
    description: 'Entre dos valores',
    category: 'Fecha/Numérico',
    example: '{ age: { between: [25, 35] } }',
  },
  some: {
    description: 'Al menos un elemento del array cumple la condición',
    category: 'Array',
    example: '{ posts: { some: { published: { equals: true } } } }',
  },
  none: {
    description: 'Ningún elemento del array cumple la condición',
    category: 'Array',
    example: '{ posts: { none: { published: { equals: false } } } }',
  },
  every: {
    description: 'Todos los elementos del array cumplen la condición',
    category: 'Array',
    example: '{ posts: { every: { published: { equals: true } } } }',
  },
  has: {
    description: 'Array contiene un valor específico',
    category: 'Array',
    example: '{ tags: { has: "admin" } }',
  },
  hasEvery: {
    description: 'Array contiene todos los valores especificados',
    category: 'Array',
    example: '{ tags: { hasEvery: ["admin", "user"] } }',
  },
  hasSome: {
    description: 'Array contiene al menos uno de los valores especificados',
    category: 'Array',
    example: '{ tags: { hasSome: ["admin", "moderator"] } }',
  },
  length: {
    description: 'Filtrado por longitud del array',
    category: 'Array',
    example: '{ tags: { length: { gt: 2 } } }',
  },
  AND: {
    description: 'Todas las condiciones deben cumplirse',
    category: 'Lógico',
    example: '{ AND: [{ active: { equals: true } }, { age: { gt: 25 } }] }',
  },
  OR: {
    description: 'Al menos una condición debe cumplirse',
    category: 'Lógico',
    example: '{ OR: [{ active: { equals: true } }, { age: { gt: 30 } }] }',
  },
  NOT: {
    description: 'La condición no debe cumplirse',
    category: 'Lógico',
    example: '{ NOT: { name: { equals: "Alice" } } }',
  },
  isNull: {
    description: 'Verificar si un campo es null',
    category: 'Utilidad',
    example: '{ email: { isNull: true } }',
  },
  distinct: {
    description: 'Verificar si los valores son distintos',
    category: 'Utilidad',
    example: '{ distinct: true }',
  },
  mode: {
    description: 'Modo insensible a mayúsculas/minúsculas para strings',
    category: 'String',
    example: '{ name: { equals: "alice", mode: "insensitive" } }',
  },
}

function validateQuery(query: unknown): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!query || typeof query !== 'object') {
    errors.push('La query debe ser un objeto')

    return { valid: false, errors }
  }

  const queryObj = query as Record<string, unknown>

  if (!queryObj.where) {
    errors.push('La query debe contener una propiedad "where"')
  }

  if (queryObj.pagination) {
    const pagination = queryObj.pagination as Record<string, unknown>

    if (typeof pagination.page !== 'number' || pagination.page < 1) {
      errors.push('pagination.page debe ser un número mayor a 0')
    }

    if (typeof pagination.size !== 'number' || pagination.size < 1) {
      errors.push('pagination.size debe ser un número mayor a 0')
    }
  }

  if (queryObj.orderBy && typeof queryObj.orderBy !== 'object') {
    errors.push('orderBy debe ser un objeto')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

async function main(): Promise<void> {
  const server = new Server(
    {
      name: 'alfasync-mcp',
      version: packageJson.version || '0.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  const tools = [
    {
      name: 'alfasync.findMany',
      description:
        'Filtra una colección usando la sintaxis de alfasync y retorna datos y paginación.',
      inputSchema: {
        type: 'object',
        properties: {
          data: {
            description:
              'Arreglo de objetos/valores a filtrar. Se serializa como JSON.',
            type: 'array',
            items: {},
          },
          query: {
            description:
              'Objeto de consulta de alfasync (where, pagination, orderBy, distinct).',
            type: 'object',
          },
        },
        required: ['data', 'query'],
        additionalProperties: false,
      },
    },
    {
      name: 'alfasync.findUnique',
      description:
        'Encuentra un único elemento que cumpla la consulta de alfasync o null.',
      inputSchema: {
        type: 'object',
        properties: {
          data: {
            description:
              'Arreglo de objetos/valores a evaluar. Se serializa como JSON.',
            type: 'array',
            items: {},
          },
          query: {
            description: 'Objeto de consulta de alfasync.',
            type: 'object',
          },
        },
        required: ['data', 'query'],
        additionalProperties: false,
      },
    },
    {
      name: 'alfasync.listOperators',
      description:
        'Lista todos los operadores disponibles en alfasync con su categoría.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    },
    {
      name: 'alfasync.validateQuery',
      description:
        'Valida una query de alfasync antes de ejecutarla, retornando errores si los hay.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            description: 'Objeto de consulta de alfasync a validar.',
            type: 'object',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
    {
      name: 'alfasync.getDocumentation',
      description:
        'Obtiene documentación detallada de un operador específico de alfasync.',
      inputSchema: {
        type: 'object',
        properties: {
          operator: {
            description:
              'Nombre del operador del cual obtener documentación (opcional, si no se proporciona retorna todos).',
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    },
  ]

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools }
  })

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'alfasync.findMany': {
            if (!args || typeof args !== 'object') {
              throw new Error('Los argumentos deben ser un objeto')
            }

            const { data, query } = args as { data: unknown; query: unknown }

            if (!Array.isArray(data)) {
              throw new Error('El argumento "data" debe ser un arreglo')
            }

            if (!query || typeof query !== 'object' || query === null) {
              throw new Error('El argumento "query" debe ser un objeto')
            }

            const filter = createFilter(data)

            const result = filter.findMany(query as FilterQuery<unknown>)

            return {
              content: [
                { type: 'text', text: JSON.stringify(result, null, 2) },
              ],
            }
          }

          case 'alfasync.findUnique': {
            if (!args || typeof args !== 'object') {
              throw new Error('Los argumentos deben ser un objeto')
            }

            const { data, query } = args as { data: unknown; query: unknown }

            if (!Array.isArray(data)) {
              throw new Error('El argumento "data" debe ser un arreglo')
            }

            if (!query || typeof query !== 'object' || query === null) {
              throw new Error('El argumento "query" debe ser un objeto')
            }

            const filter = createFilter(data)

            const result = filter.findUnique(query as FilterQuery<unknown>)

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            }
          }

          case 'alfasync.listOperators': {
            const operators = getKnownOperators()

            const categorized = operators.reduce(
              (acc, op) => {
                const doc = OPERATORS_DOCUMENTATION[op]

                const category = doc?.category || 'Desconocida'

                if (!acc[category]) {
                  acc[category] = []
                }

                acc[category].push({
                  name: op,
                  description: doc?.description || 'Sin descripción',
                })

                return acc
              },
              {} as Record<
                string,
                Array<{ name: string; description: string }>
              >,
            )

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      total: operators.length,
                      operators: categorized,
                      list: operators,
                    },
                    null,
                    2,
                  ),
                },
              ],
            }
          }

          case 'alfasync.validateQuery': {
            if (!args || typeof args !== 'object') {
              throw new Error('Los argumentos deben ser un objeto')
            }

            const { query } = args as { query: unknown }

            const validation = validateQuery(query)

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(validation, null, 2),
                },
              ],
            }
          }

          case 'alfasync.getDocumentation': {
            if (!args || typeof args !== 'object') {
              throw new Error('Los argumentos deben ser un objeto')
            }

            const { operator } = args as { operator?: string }

            if (operator) {
              const doc = OPERATORS_DOCUMENTATION[operator]

              if (!doc) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(
                        {
                          operator,
                          error: 'Operador no encontrado',
                          availableOperators: Object.keys(
                            OPERATORS_DOCUMENTATION,
                          ),
                        },
                        null,
                        2,
                      ),
                    },
                  ],
                  isError: true,
                }
              }

              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(
                      {
                        operator,
                        ...doc,
                      },
                      null,
                      2,
                    ),
                  },
                ],
              }
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(OPERATORS_DOCUMENTATION, null, 2),
                },
              ],
            }
          }

          default:
            return {
              content: [
                {
                  type: 'text',
                  text: `Herramienta no encontrada: ${name}`,
                },
              ],
              isError: true,
            }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: errorMessage,
                  tool: name,
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        }
      }
    },
  )

  const transport = new StdioServerTransport()

  await server.connect(transport)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[alfasync-mcp] Error fatal:', err)
  process.exit(1)
})
