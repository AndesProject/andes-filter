import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { HasEveryFilter } from './has-every-filter'

describe('HasEveryFilter', () => {
  it('arrays que contienen todos los elementos requeridos', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [1, 2, 3, 4] },
      { items: [1, 2, 3] },
      { items: [1, 2] },
      { items: [1] },
    ])
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3, 4] } } }).data
        .length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3, 4, 5] } } }).data
        .length
    ).toBe(0)
  })
  it('arrays con strings', () => {
    const filter = createFilter<{ tags: string[] }>([
      { tags: ['javascript', 'typescript', 'react'] },
      { tags: ['javascript', 'typescript'] },
      { tags: ['javascript'] },
    ])
    expect(
      filter.findMany({
        where: { tags: { hasEvery: ['javascript', 'typescript'] } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { tags: { hasEvery: ['javascript', 'typescript', 'react'] } },
      }).data.length
    ).toBe(1)
  })
  it('arrays vacíos, null y undefined', () => {
    const filter = createFilter<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [1, 2, 3] },
    ])
    expect(
      filter.findMany({ where: { items: { hasEvery: [] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { hasEvery: [1] } } }).data.length
    ).toBe(1)
  })
  it('findUnique', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [1, 2, 3, 4] },
      { items: [1, 2, 3] },
    ])
    const result = filter.findUnique({
      where: { items: { hasEvery: [1, 2, 3, 4] } },
    })
    expect(result).toEqual({ items: [1, 2, 3, 4] })
    const result2 = filter.findUnique({
      where: { items: { hasEvery: [1, 2, 3, 4, 5] } },
    })
    expect(result2).toBe(null)
  })
  it('arrays con booleanos', () => {
    const filter = createFilter<{ flags: boolean[] }>([
      { flags: [true, false, true] },
      { flags: [true, false] },
      { flags: [true] },
    ])
    expect(
      filter.findMany({ where: { flags: { hasEvery: [true, false] } } }).data
        .length
    ).toBe(2)
  })
  it('arrays con elementos duplicados', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [1, 1, 2, 2, 3] },
      { items: [1, 2, 3] },
      { items: [1, 2] },
    ])
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3] } } }).data.length
    ).toBe(2)
  })
})
describe('HasEveryFilter Unit', () => {
  it('debe retornar true si el array contiene todos los elementos requeridos', () => {
    const filter = new HasEveryFilter<number>([1, 2, 3])
    expect(filter.evaluate([1, 2, 3, 4])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('debe retornar false si el array no contiene todos los elementos requeridos', () => {
    const filter = new HasEveryFilter<number>([1, 2, 3])
    expect(filter.evaluate([1, 2])).toBe(false)
    expect(filter.evaluate([1, 3])).toBe(false)
    expect(filter.evaluate([4, 5, 6])).toBe(false)
  })
  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new HasEveryFilter<number>([1, 2])
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })
  it('debe retornar true si el array está vacío y no hay elementos requeridos', () => {
    const filter = new HasEveryFilter<number>([])
    expect(filter.evaluate([])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('debe retornar false si el array está vacío pero hay elementos requeridos', () => {
    const filter = new HasEveryFilter<number>([1, 2])
    expect(filter.evaluate([])).toBe(false)
  })
  it('debe funcionar con strings', () => {
    const filter = new HasEveryFilter<string>(['javascript', 'typescript'])
    expect(filter.evaluate(['javascript', 'typescript', 'react'])).toBe(true)
    expect(filter.evaluate(['javascript'])).toBe(false)
  })
  it('debe funcionar con booleanos', () => {
    const filter = new HasEveryFilter<boolean>([true, false])
    expect(filter.evaluate([true, false, true])).toBe(true)
    expect(filter.evaluate([true])).toBe(false)
  })
  it('debe funcionar con arrays vacíos de elementos requeridos', () => {
    const filter = new HasEveryFilter<number>([])
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([])).toBe(true)
  })

  it('debe manejar arrays con un solo elemento requerido', () => {
    const filter = new HasEveryFilter([1])
    const data = [1, 2, 3]
    expect(filter.evaluate(data)).toBe(true)
  })

  it('debe manejar arrays con múltiples elementos requeridos', () => {
    const filter = new HasEveryFilter([1, 2])
    const data = [1, 2, 3, 4]
    expect(filter.evaluate(data)).toBe(true)
  })

  it('debe manejar arrays con elementos mixtos', () => {
    const filter = new HasEveryFilter([1, 'admin'])
    const data = [1, 'admin', 'user']
    expect(filter.evaluate(data)).toBe(true)
  })

  it('debe retornar false cuando faltan elementos requeridos', () => {
    const filter = new HasEveryFilter([1, 2, 3])
    const data = [1, 2]
    expect(filter.evaluate(data)).toBe(false)
  })
})

describe('HasEveryFilter Edge Cases', () => {
  // it('should handle single object requirement', () => {
  //   const filter = new HasEveryFilter([{ name: 'John', age: 30 }])
  //   expect(
  //     filter.evaluate([
  //       { name: 'John', age: 30 },
  //       { name: 'Jane', age: 25 },
  //     ])
  //   ).toBe(true)
  //   expect(
  //     filter.evaluate([
  //       { name: 'Jane', age: 25 },
  //       { name: 'Bob', age: 35 },
  //     ])
  //   ).toBe(false)
  // })
  it('should handle mixed types (string vs number)', () => {
    const filter = new HasEveryFilter(['5', 10])
    expect(filter.evaluate(['5', 10, '15'])).toBe(true)
    expect(filter.evaluate([5, '10', 15])).toBe(false) // 5 (number) !== '5' (string)
  })
  // it('should handle mixed types with objects', () => {
  //   const filter = new HasEveryFilter(['5', { name: 'John' }])
  //   expect(filter.evaluate(['5', { name: 'John' }, '10'])).toBe(true)
  //   expect(filter.evaluate([5, { name: 'John' }, '10'])).toBe(false) // 5 !== '5'
  // })
  it('should handle empty required values', () => {
    const filter = new HasEveryFilter([])
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([])).toBe(true)
  })
  it('should handle empty array with non-empty requirements', () => {
    const filter = new HasEveryFilter([1, 2, 3])
    expect(filter.evaluate([])).toBe(false)
  })
  it('should handle empty array with empty requirements', () => {
    const filter = new HasEveryFilter([])
    expect(filter.evaluate([])).toBe(true)
  })
})
