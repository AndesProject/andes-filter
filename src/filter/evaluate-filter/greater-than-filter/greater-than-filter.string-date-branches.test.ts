import { describe, expect, it } from 'vitest'
import { GreaterThanFilter } from './greater-than-filter'

describe('GreaterThanFilter - string date branches', () => {
  it('retorna true cuando ambas fechas string son válidas y la primera es mayor', () => {
    const filter = new GreaterThanFilter('2024-01-01')
    expect(filter.evaluate('2024-02-01')).toBe(true)
  })

  it('retorna false cuando una fecha string es válida y la otra no', () => {
    const filter = new GreaterThanFilter('invalid-date')
    expect(filter.evaluate('2024-02-01')).toBe(false)
  })

  it('compara como string cuando ambas no son fechas válidas', () => {
    const filter = new GreaterThanFilter('bbb')
    expect(filter.evaluate('ccc')).toBe(true) // 'ccc' > 'bbb'
    expect(new GreaterThanFilter('bbb').evaluate('aaa')).toBe(false)
  })
})
