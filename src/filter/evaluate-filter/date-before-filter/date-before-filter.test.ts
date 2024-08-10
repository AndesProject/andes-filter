import { describe, expect, it } from 'vitest'
import { DateBeforeFilter } from './date-before-filter'

describe('DateBeforeFilter', () => {
  const referenceDate = new Date('2024-01-01')

  it('debe retornar true cuando el valor es una fecha antes de la fecha de referencia', () => {
    const filter = new DateBeforeFilter(referenceDate)
    expect(filter.evaluate(new Date('2023-12-31'))).toBe(true)
    expect(filter.evaluate(new Date('2023-11-15'))).toBe(true)
  })

  it('debe retornar false cuando el valor es una fecha igual a la fecha de referencia', () => {
    const filter = new DateBeforeFilter(referenceDate)
    expect(filter.evaluate(new Date('2024-01-01'))).toBe(false)
  })

  it('debe retornar false cuando el valor es una fecha después de la fecha de referencia', () => {
    const filter = new DateBeforeFilter(referenceDate)
    expect(filter.evaluate(new Date('2024-01-02'))).toBe(false)
    expect(filter.evaluate(new Date('2024-06-15'))).toBe(false)
  })

  it('debe retornar false cuando el valor no es una fecha', () => {
    const filter = new DateBeforeFilter(referenceDate)
    expect(filter.evaluate('2023-12-31')).toBe(false)
    expect(filter.evaluate(1234567890)).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
