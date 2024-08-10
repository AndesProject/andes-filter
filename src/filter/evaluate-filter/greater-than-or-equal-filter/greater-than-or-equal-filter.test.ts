import { describe, expect, it } from 'vitest'
import { GreaterThanOrEqualFilter } from './greater-than-or-equal-filter'

describe('GreaterThanOrEqualFilter', () => {
  it('debe retornar true cuando el valor es mayor que el valor umbral', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(15)).toBe(true)
  })

  it('debe retornar true cuando el valor es igual al valor umbral', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(10)).toBe(true)
  })

  it('debe retornar false cuando el valor es menor que el valor umbral', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(5)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new GreaterThanOrEqualFilter('mango')
    expect(filter.evaluate('orange')).toBe(true) // 'orange' > 'mango' en orden lexicográfico
    expect(filter.evaluate('mango')).toBe(true) // 'mango' == 'mango'
    expect(filter.evaluate('apple')).toBe(false) // 'apple' < 'mango'
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new GreaterThanOrEqualFilter(false)
    expect(filter.evaluate(true)).toBe(true)
    expect(filter.evaluate(false)).toBe(true)
  })

  it('debe manejar comparaciones de tipo Date correctamente', () => {
    const earlierDate = new Date('2024-01-01')
    const laterDate = new Date('2024-12-31')
    const filter = new GreaterThanOrEqualFilter(earlierDate)
    expect(filter.evaluate(laterDate)).toBe(true)
    expect(filter.evaluate(earlierDate)).toBe(true)
    expect(filter.evaluate(new Date('2023-01-01'))).toBe(false)
  })

  it('debe retornar false cuando el tipo del valor no es comparable', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate({})).toBe(false) // Comparando un objeto con un número no es válido
  })

  it('debe manejar valores nulos y undefined', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar comparaciones de arrays correctamente (referencia)', () => {
    const filter = new GreaterThanOrEqualFilter([1, 2, 3])
    expect(filter.evaluate([4, 5])).toBe(false) // Arrays no son directamente comparables con >=
  })
})
