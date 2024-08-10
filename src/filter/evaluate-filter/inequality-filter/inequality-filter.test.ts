import { describe, expect, it } from 'vitest'
import { InequalityFilter } from './inequality-filter'

describe('InequalityFilter', () => {
  it('debe retornar true cuando el valor no es igual al valor objetivo', () => {
    const filter = new InequalityFilter(5)
    expect(filter.evaluate(3)).toBe(true)
  })

  it('debe retornar false cuando el valor es igual al valor objetivo', () => {
    const filter = new InequalityFilter(5)
    expect(filter.evaluate(5)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new InequalityFilter('hello')
    expect(filter.evaluate('world')).toBe(true)
    expect(filter.evaluate('hello')).toBe(false)
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new InequalityFilter(true)
    expect(filter.evaluate(false)).toBe(true)
    expect(filter.evaluate(true)).toBe(false)
  })

  it('debe manejar comparaciones de objetos correctamente (referencia)', () => {
    const obj = { key: 'value' }
    const filter = new InequalityFilter(obj)

    const differentObj = { key: 'value' }
    expect(filter.evaluate(differentObj)).toBe(true)

    expect(filter.evaluate(obj)).toBe(false)
  })

  it('debe manejar comparaciones de números correctamente', () => {
    const filter = new InequalityFilter(10)
    expect(filter.evaluate(20)).toBe(true)
    expect(filter.evaluate(10)).toBe(false)
  })

  it('debe manejar comparaciones de arrays correctamente (referencia)', () => {
    const arr = [1, 2, 3]
    const filter = new InequalityFilter(arr)

    const differentArr = [1, 2, 3]
    expect(filter.evaluate(differentArr)).toBe(true)

    expect(filter.evaluate(arr)).toBe(false)
  })

  it('debe manejar valores nulos y undefined', () => {
    const filterNull = new InequalityFilter(null)
    expect(filterNull.evaluate(undefined)).toBe(true)
    expect(filterNull.evaluate(null)).toBe(false)

    const filterUndefined = new InequalityFilter(undefined)
    expect(filterUndefined.evaluate(null)).toBe(true)
    expect(filterUndefined.evaluate(undefined)).toBe(false)
  })

  it('debe manejar valores de tipo diferente correctamente', () => {
    const filter = new InequalityFilter(10)
    expect(filter.evaluate('10')).toBe(true)
    expect(filter.evaluate(true)).toBe(true)
    expect(filter.evaluate([10])).toBe(true)
  })
})
