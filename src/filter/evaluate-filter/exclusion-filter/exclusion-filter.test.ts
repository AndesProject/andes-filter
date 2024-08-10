import { describe, expect, it } from 'vitest'
import { ExclusionFilter } from './exclusion-filter'

describe('ExclusionFilter', () => {
  it('debe retornar true cuando el valor no está incluido en los valores objetivo', () => {
    const filter = new ExclusionFilter([1, 2, 3])
    expect(filter.evaluate(4)).toBe(true)
  })

  it('debe retornar false cuando el valor está incluido en los valores objetivo', () => {
    const filter = new ExclusionFilter([1, 2, 3])
    expect(filter.evaluate(2)).toBe(false)
  })

  it('debe manejar comparaciones de tipo string correctamente', () => {
    const filter = new ExclusionFilter(['apple', 'banana', 'cherry'])
    expect(filter.evaluate('orange')).toBe(true)
    expect(filter.evaluate('banana')).toBe(false)
  })

  it('debe manejar comparaciones de tipo boolean correctamente', () => {
    const filter = new ExclusionFilter([true, false])
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate(false)).toBe(false)
    expect(filter.evaluate(null)).toBe(true)
  })

  it('debe manejar comparaciones de objetos correctamente (referencia)', () => {
    const obj1 = { key: 'value1' }
    const obj2 = { key: 'value2' }
    const filter = new ExclusionFilter([obj1, obj2])

    const differentObj = { key: 'value1' }
    expect(filter.evaluate(differentObj)).toBe(true)

    expect(filter.evaluate(obj1)).toBe(false)
  })

  it('debe manejar comparaciones de números correctamente', () => {
    const filter = new ExclusionFilter([10, 20, 30])
    expect(filter.evaluate(40)).toBe(true)
    expect(filter.evaluate(20)).toBe(false)
  })

  it('debe manejar comparaciones de arrays correctamente (referencia)', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    const filter = new ExclusionFilter([arr1, arr2])

    const differentArr = [1, 2, 3]
    expect(filter.evaluate(differentArr)).toBe(true)

    expect(filter.evaluate(arr1)).toBe(false)
  })

  it('debe manejar valores nulos y undefined', () => {
    const filter = new ExclusionFilter([null, undefined, 'test'])
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate('test')).toBe(false)
    expect(filter.evaluate('not_included')).toBe(true)
  })

  it('debe manejar valores de tipo diferente correctamente', () => {
    const filter = new ExclusionFilter([10, '10', true])
    expect(filter.evaluate(20)).toBe(true)
    expect(filter.evaluate('10')).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate([10])).toBe(true)
  })
})
