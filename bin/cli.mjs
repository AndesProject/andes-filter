#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)

// Cuando npx ejecuta un binario de un scoped package, puede pasar el nombre del binario como argumento
// Ejemplo: npx @alfasync/filter filter mcp -> argv[2] = "filter", argv[3] = "mcp"
// Necesitamos detectar esto y usar el argumento correcto
let command = process.argv[2]

// Si el primer argumento es "filter" (nombre del binario), usar el siguiente argumento
if (command === 'filter' && process.argv[3]) {
  command = process.argv[3]
}

if (command === 'mcp') {
  const serverPath = join(__dirname, '../mcp/server.ts')

  const packageNodeModules = join(__dirname, '../node_modules')

  const packageTsxPath = join(packageNodeModules, 'tsx/dist/cli.mjs')

  // Intentar múltiples estrategias para encontrar tsx
  let tsxCommand

  let tsxArgs

  // Estrategia 1: Intentar usar tsx desde node_modules del paquete
  if (existsSync(packageTsxPath)) {
    tsxCommand = 'node'
    tsxArgs = [packageTsxPath, serverPath]
  } else {
    // Estrategia 2: Intentar resolver tsx usando require.resolve
    try {
      const resolvedTsx = require.resolve('tsx/dist/cli.mjs', {
        paths: [packageNodeModules, __dirname],
      })

      tsxCommand = 'node'
      tsxArgs = [resolvedTsx, serverPath]
    } catch {
      // Estrategia 3: Usar npx tsx como último recurso
      tsxCommand = 'npx'
      tsxArgs = ['-y', 'tsx', serverPath]
    }
  }

  const child = spawn(tsxCommand, tsxArgs, {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      // Asegurar que node_modules del paquete esté en el path
      NODE_PATH: packageNodeModules,
    },
  })

  child.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('[alfasync] Error al ejecutar el servidor MCP:', error)
    process.exit(1)
  })

  child.on('exit', (code) => {
    process.exit(code ?? 0)
  })
} else {
  // eslint-disable-next-line no-console
  console.log('Uso: npx @alfasync/filter <comando>')
  // eslint-disable-next-line no-console
  console.log('')
  // eslint-disable-next-line no-console
  console.log('Comandos disponibles:')
  // eslint-disable-next-line no-console
  console.log('  mcp    Ejecuta el servidor MCP para alfasync')
  process.exit(1)
}
