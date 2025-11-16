import { describe, expect, it, vi } from 'vitest'
import { Logger } from './logger'

describe('Logger', () => {
  it('error siempre escribe en consola', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    Logger.error('mensaje de error', new Error('x'))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('debug e info respetan el entorno actual (no development)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    Logger.debug('dbg', { a: 1 }, 'Ctx')
    Logger.info('inf', { a: 1 }, 'Ctx')
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('warn imprime en no producción', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    Logger.warn('debería loguear en no prod')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('warn no imprime en producción', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const anyLogger = Logger as unknown as {
      isDevelopment: boolean
      isProduction: boolean
    }
    const prevDev = anyLogger.isDevelopment
    const prevProd = anyLogger.isProduction
    anyLogger.isDevelopment = false
    anyLogger.isProduction = true

    Logger.warn('no debería loguear en prod')

    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
    anyLogger.isDevelopment = prevDev
    anyLogger.isProduction = prevProd
  })

  it('unknownFilter usa warn con contexto FilterRegistry', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const anyLogger = Logger as unknown as {
      isProduction: boolean
    }
    const prevProd = anyLogger.isProduction
    anyLogger.isProduction = false

    Logger.unknownFilter('XFilter')

    expect(warnSpy).toHaveBeenCalled()
    const [firstCallArg] = warnSpy.mock.calls[0]
    expect(String(firstCallArg)).toContain('[FilterRegistry]')

    warnSpy.mockRestore()
    anyLogger.isProduction = prevProd
  })
  it('debug e info imprimen cuando isDevelopment=true (forzando flags)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const anyLogger = Logger as unknown as {
      isDevelopment: boolean
      isProduction: boolean
    }
    const prevDev = anyLogger.isDevelopment
    const prevProd = anyLogger.isProduction
    anyLogger.isDevelopment = true
    anyLogger.isProduction = false

    Logger.debug('dbg-on')
    Logger.info('info-on')

    expect(logSpy).toHaveBeenCalledTimes(2)
    logSpy.mockRestore()
    anyLogger.isDevelopment = prevDev
    anyLogger.isProduction = prevProd
  })
})
