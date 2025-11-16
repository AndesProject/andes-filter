import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger } from './logger'

describe('Logger.error - ramas con y sin error', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('llama console.error con mensaje y error provisto', () => {
    const err = new Error('boom')
    Logger.error('falló', err, 'Ctx')
    expect((console.error as any).mock.calls[0][0]).toContain('[Ctx] falló')
    expect((console.error as any).mock.calls[0][1]).toBe(err)
  })

  it('llama console.error con string vacío cuando no hay error', () => {
    Logger.error('mensaje sin error')
    const calls = (console.error as any).mock.calls
    const last = calls[calls.length - 1]
    expect(last[0]).toContain('[Filter] mensaje sin error')
    expect(last[1]).toBe('')
  })
})
