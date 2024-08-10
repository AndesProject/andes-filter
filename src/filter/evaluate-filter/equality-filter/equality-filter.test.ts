import { describe, expect, it } from 'vitest'
import { EqualityFilter } from './equality-filter' // Asegúrate de que la ruta sea correcta

describe('EqualityFilter', () => {
  it('debe retornar true cuando el valor es igual al valor objetivo', () => {
    const filter = new EqualityFilter(5)
    expect(filter.evaluate(5)).toBe(true)
  })

  it('debe retornar false cuando el valor no es igual al valor objetivo', () => {
    const filter = new EqualityFilter(5)
    expect(filter.evaluate(3)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new EqualityFilter('hello')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('world')).toBe(false)
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new EqualityFilter(true)
    expect(filter.evaluate(true)).toBe(true)
    expect(filter.evaluate(false)).toBe(false)
  })

  it('debe manejar comparaciones de objetos correctamente (referencia)', () => {
    const obj = { key: 'value' }
    const filter = new EqualityFilter(obj)
    expect(filter.evaluate(obj)).toBe(true)

    const differentObj = { key: 'value' }
    expect(filter.evaluate(differentObj)).toBe(false)
  })

  it('debe manejar comparaciones de números correctamente', () => {
    const filter = new EqualityFilter(10)
    expect(filter.evaluate(10)).toBe(true)
    expect(filter.evaluate(20)).toBe(false)
  })

  it('debe manejar comparaciones de arrays correctamente (referencia)', () => {
    const arr = [1, 2, 3]
    const filter = new EqualityFilter(arr)
    expect(filter.evaluate(arr)).toBe(true)

    const differentArr = [1, 2, 3]
    expect(filter.evaluate(differentArr)).toBe(false)
  })

  it('debe manejar valores nulos y undefined', () => {
    const filterNull = new EqualityFilter(null)
    expect(filterNull.evaluate(null)).toBe(true)
    expect(filterNull.evaluate(undefined)).toBe(false)

    const filterUndefined = new EqualityFilter(undefined)
    expect(filterUndefined.evaluate(undefined)).toBe(true)
    expect(filterUndefined.evaluate(null)).toBe(false)
  })

  it('debe manejar valores de tipo diferente correctamente', () => {
    const filter = new EqualityFilter(10)
    expect(filter.evaluate('10')).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate([10])).toBe(false)
  })
})
