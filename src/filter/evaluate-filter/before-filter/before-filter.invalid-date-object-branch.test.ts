import { describe, expect, it } from 'vitest'
import { BeforeFilter } from './before-filter'

describe('BaseDateFilter.validateDateInput - rama parsedDate inválida (Date objeto inválido)', () => {
  it('retorna false cuando actual es un objeto Date inválido', () => {
    const bf = new BeforeFilter('2024-01-01')
    const invalidDate = new Date('invalid-date')
    expect(bf.evaluate(invalidDate as any)).toBe(false)
  })
})
