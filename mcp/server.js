// Minimal MCP server exposing andes-filter as tools over stdio
// Requires: @modelcontextprotocol/sdk (runtime dependency)
// Uses built artifacts from dist/
/* eslint-disable @typescript-eslint/no-var-requires */

const pkg = require('../package.json')

// Lazy require to avoid cost on startup before first call
function getFilter() {
  // Load compiled build; ensure `npm run build` was executed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createFilter } = require('../dist')

  if (!createFilter) {
    throw new Error(
      'No se encontró createFilter en dist/. Asegúrate de ejecutar "npm run build".',
    )
  }

  return { createFilter }
}

async function main() {
  // Cargar ESM del SDK MCP vía import dinámico (el paquete es ESM-only)
  const { Server } = await import('@modelcontextprotocol/sdk/server/index.js')

  const { StdioServerTransport } = await import(
    '@modelcontextprotocol/sdk/server/stdio.js'
  )

  const server = new Server(
    {
      name: 'andes-filter-mcp',
      version: pkg.version || '0.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  // Definición de herramientas y handlers usando el API de requests tools/list y tools/call
  const tools = [
    {
      name: 'andes-filter.findMany',
      description:
        'Filtra una colección usando la sintaxis de andes-filter y retorna datos y paginación.',
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
              'Objeto de consulta de andes-filter (where, pagination, orderBy, distinct).',
            type: 'object',
          },
        },
        required: ['data', 'query'],
        additionalProperties: false,
      },
    },
    {
      name: 'andes-filter.findUnique',
      description:
        'Encuentra un único elemento que cumpla la consulta de andes-filter o null.',
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
            description: 'Objeto de consulta de andes-filter.',
            type: 'object',
          },
        },
        required: ['data', 'query'],
        additionalProperties: false,
      },
    },
  ]

  const { ListToolsRequestSchema, CallToolRequestSchema } = await import(
    '@modelcontextprotocol/sdk/types.js'
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools,
    }
  })

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name

    const args = request.params.arguments || {}

    if (name === 'andes-filter.findMany') {
      const data = args.data

      const query = args.query

      if (!Array.isArray(data)) {
        throw new Error('El argumento "data" debe ser un arreglo.')
      }

      if (typeof query !== 'object' || query == null) {
        throw new Error('El argumento "query" debe ser un objeto.')
      }

      const { createFilter } = getFilter()

      const ops = createFilter(data)

      const result = ops.findMany(query)

      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      }
    }

    if (name === 'andes-filter.findUnique') {
      const data = args.data

      const query = args.query

      if (!Array.isArray(data)) {
        throw new Error('El argumento "data" debe ser un arreglo.')
      }

      if (typeof query !== 'object' || query == null) {
        throw new Error('El argumento "query" debe ser un objeto.')
      }

      const { createFilter } = getFilter()

      const ops = createFilter(data)

      const result = ops.findUnique(query)

      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Herramienta no encontrada: ${name}`,
        },
      ],
      isError: true,
    }
  })

  const transport = new StdioServerTransport()

  await server.connect(transport)
}

main().catch((err) => {
  // Avoid crashing silently; report error to stdio so MCP client can surface it
  // eslint-disable-next-line no-console
  console.error('[andes-filter-mcp] Error fatal:', err)
  process.exit(1)
})
