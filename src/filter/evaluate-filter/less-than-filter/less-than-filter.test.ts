import { describe, expect, it } from 'vitest'
import { LessThanFilter } from './less-than-filter'

describe('LessThanFilter', () => {
  it('debe retornar true cuando el valor es menor que el valor umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(5)).toBe(true)
  })

  it('debe retornar false cuando el valor es igual al valor umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(10)).toBe(false)
  })

  it('debe retornar false cuando el valor es mayor que el valor umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(15)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new LessThanFilter('mango')
    expect(filter.evaluate('apple')).toBe(true) // 'apple' < 'mango' en orden lexicográfico
    expect(filter.evaluate('orange')).toBe(false) // 'orange' > 'mango'
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new LessThanFilter(true)
    expect(filter.evaluate(false)).toBe(true)
    expect(filter.evaluate(true)).toBe(false)
  })

  it('debe manejar comparaciones de tipo Date correctamente', () => {
    const earlierDate = new Date('2024-01-01')
    const laterDate = new Date('2024-12-31')
    const filter = new LessThanFilter(laterDate)
    expect(filter.evaluate(earlierDate)).toBe(true)
    expect(filter.evaluate(laterDate)).toBe(false)
  })

  it('debe retornar false cuando el tipo del valor no es comparable', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate({})).toBe(false) // Comparando un objeto con un número no es válido
  })
})
