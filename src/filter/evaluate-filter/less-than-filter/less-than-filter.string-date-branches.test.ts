import { describe, expect, it } from 'vitest'
import { LessThanFilter } from './less-than-filter'

describe('LessThanFilter - string date branches', () => {
  it('retorna true cuando ambas fechas string son válidas y la primera es menor', () => {
    const filter = new LessThanFilter('2024-02-01')
    expect(filter.evaluate('2024-01-01')).toBe(true)
  })

  it('retorna false cuando una fecha string es válida y la otra no', () => {
    const filter = new LessThanFilter('invalid-date')
    expect(filter.evaluate('2024-02-01')).toBe(false)
  })

  it('compara como string cuando ambas no son fechas válidas', () => {
    const filter = new LessThanFilter('bbb')
    expect(filter.evaluate('aaa')).toBe(true) // 'aaa' < 'bbb'
    expect(new LessThanFilter('bbb').evaluate('ccc')).toBe(false)
  })
})
