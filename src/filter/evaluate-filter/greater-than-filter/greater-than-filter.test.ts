import { describe, expect, it } from 'vitest'
import { GreaterThanFilter } from './greater-than-filter'

describe('GreaterThanFilter', () => {
  it('debe retornar true cuando el valor es mayor que el valor umbral', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(15)).toBe(true)
  })

  it('debe retornar false cuando el valor es igual al valor umbral', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(10)).toBe(false)
  })

  it('debe retornar false cuando el valor es menor que el valor umbral', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(5)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new GreaterThanFilter('mango')
    expect(filter.evaluate('orange')).toBe(true) // 'orange' > 'mango' en orden lexicográfico
    expect(filter.evaluate('mango')).toBe(false) // 'mango' == 'mango'
    expect(filter.evaluate('apple')).toBe(false) // 'apple' < 'mango'
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new GreaterThanFilter(false)
    expect(filter.evaluate(true)).toBe(true)
    expect(filter.evaluate(false)).toBe(false)
  })

  it('debe manejar comparaciones de tipo Date correctamente', () => {
    const earlierDate = new Date('2024-01-01')
    const laterDate = new Date('2024-12-31')
    const filter = new GreaterThanFilter(earlierDate)
    expect(filter.evaluate(laterDate)).toBe(true)
    expect(filter.evaluate(earlierDate)).toBe(false)
    expect(filter.evaluate(new Date('2023-01-01'))).toBe(false)
  })

  it('debe retornar false cuando el tipo del valor no es comparable', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate({})).toBe(false) // Comparando un objeto con un número no es válido
  })

  it('debe manejar valores nulos y undefined', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
