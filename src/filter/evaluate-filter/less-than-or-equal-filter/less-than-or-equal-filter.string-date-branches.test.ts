import { describe, expect, it } from 'vitest'
import { LessThanOrEqualFilter } from './less-than-or-equal-filter'

describe('LessThanOrEqualFilter - string date branches', () => {
  it('retorna true cuando ambas fechas string son válidas y la primera es menor o igual', () => {
    const filter = new LessThanOrEqualFilter('2024-02-01')
    expect(filter.evaluate('2024-02-01')).toBe(true)
    expect(filter.evaluate('2024-01-01')).toBe(true)
  })

  it('retorna false cuando una fecha string es válida y la otra no', () => {
    const filter = new LessThanOrEqualFilter('invalid-date')
    expect(filter.evaluate('2024-02-01')).toBe(false)
  })

  it('compara como string cuando ambas no son fechas válidas', () => {
    const filter = new LessThanOrEqualFilter('bbb')
    expect(filter.evaluate('bbb')).toBe(true) // igualdad de strings
    expect(filter.evaluate('aaa')).toBe(true) // 'aaa' <= 'bbb'
    expect(new LessThanOrEqualFilter('bbb').evaluate('ccc')).toBe(false)
  })
})
