import { describe, expect, it } from 'vitest'
import { DateBetweenFilter } from './date-between-filter'

describe('DateBetweenFilter', () => {
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2024-01-31')
  const filter = new DateBetweenFilter(startDate, endDate)

  it('debe retornar true cuando la fecha está dentro del rango', () => {
    expect(filter.evaluate(new Date('2024-01-10'))).toBe(true)
    expect(filter.evaluate(new Date('2024-01-15'))).toBe(true)
  })

  it('debe retornar false cuando la fecha está fuera del rango', () => {
    expect(filter.evaluate(new Date('2023-12-31'))).toBe(false)
    expect(filter.evaluate(new Date('2024-02-01'))).toBe(false)
  })

  it('debe retornar false cuando la fecha es igual al inicio del rango pero está fuera del rango inferior', () => {
    expect(filter.evaluate(startDate)).toBe(true)
  })

  it('debe retornar false cuando la fecha es igual al final del rango pero está fuera del rango superior', () => {
    expect(filter.evaluate(endDate)).toBe(true)
  })

  it('debe retornar false cuando el valor no es una fecha', () => {
    expect(filter.evaluate('2024-01-10')).toBe(false)
    expect(filter.evaluate(1234567890)).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar correctamente el rango con la misma fecha en ambos extremos', () => {
    const singleDateFilter = new DateBetweenFilter(startDate, startDate)
    expect(singleDateFilter.evaluate(startDate)).toBe(true)
    expect(singleDateFilter.evaluate(new Date('2024-01-02'))).toBe(false)
  })
})
