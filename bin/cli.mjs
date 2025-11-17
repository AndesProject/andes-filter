#!/usr/bin/env node

import { spawn } from 'child_process'
import { createRequire } from 'module'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)

// Cuando npx ejecuta un binario de un scoped package, puede pasar el nombre del binario como argumento
// Ejemplo: npx @deltabit/filter filter mcp -> argv[2] = "filter", argv[3] = "mcp"
// Necesitamos detectar esto y usar el argumento correcto
let command = process.argv[2]

// Si el primer argumento es "filter" (nombre del binario), usar el siguiente argumento
if (command === 'filter' && process.argv[3]) {
  command = process.argv[3]
}

if (command === 'mcp') {
  const serverPath = join(__dirname, '../mcp/server.ts')

  // Intentar encontrar tsx en las dependencias del paquete
  let tsxPath

  try {
    // tsx tiene su binario en dist/cli.mjs
    tsxPath = require.resolve('tsx/dist/cli.mjs')
  } catch {
    // Si no se encuentra, intentar con la ruta relativa a node_modules
    tsxPath = resolve(__dirname, '../node_modules/tsx/dist/cli.mjs')
  }

  const child = spawn('node', [tsxPath, serverPath], {
    stdio: 'inherit',
    shell: false,
  })

  child.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('[deltabit] Error al ejecutar el servidor MCP:', error)
    process.exit(1)
  })

  child.on('exit', (code) => {
    process.exit(code ?? 0)
  })
} else {
  // eslint-disable-next-line no-console
  console.log('Uso: npx @deltabit/filter <comando>')
  // eslint-disable-next-line no-console
  console.log('')
  // eslint-disable-next-line no-console
  console.log('Comandos disponibles:')
  // eslint-disable-next-line no-console
  console.log('  mcp    Ejecuta el servidor MCP para deltabit')
  process.exit(1)
}
