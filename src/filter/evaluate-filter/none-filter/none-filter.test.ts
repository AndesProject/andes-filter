import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { NoneFilter } from './none-filter'

// Reemplazar FilterEvaluator globalmente con TestFilterEvaluator en cada prueba
describe('NoneFilter', () => {
  it('arrays con elementos', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
      { items: [7, 8, 9] },
    ])

    // Ningún array contiene el número 10
    expect(
      filter.findMany({ where: { items: { none: { equals: 10 } } } }).data
        .length
    ).toBe(3)

    // Solo el primer array contiene el número 2
    expect(
      filter.findMany({ where: { items: { none: { equals: 2 } } } }).data.length
    ).toBe(2)
  })

  it('arrays vacíos, null y undefined', () => {
    const filter = filterFrom<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [1, 2, 3] },
    ])

    // Solo el array vacío pasa el filtro none
    expect(
      filter.findMany({ where: { items: { none: { equals: 1 } } } }).data.length
    ).toBe(1)
  })

  it('findUnique', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
    ])

    const result = filter.findUnique({
      where: { items: { none: { equals: 10 } } },
    })
    expect(result).toEqual({ items: [1, 2, 3] })

    const result2 = filter.findUnique({
      where: { items: { none: { equals: 1 } } },
    })
    expect(result2).toEqual({ items: [4, 5, 6] })
  })

  it('filtros complejos', () => {
    const filter = filterFrom<{ posts: number[] }>([
      { posts: [1, 2] },
      { posts: [3, 4] },
    ])

    // Solo el primer array no tiene posts con valor 3
    expect(
      filter.findMany({ where: { posts: { none: { equals: 3 } } } }).data.length
    ).toBe(1)
  })
})

describe('NoneFilter Unit', () => {
  it('debe retornar true si ningún elemento cumple el filtro', () => {
    const filter = new NoneFilter<any>({ equals: 10 })
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([10, 20, 30])).toBe(false)
  })

  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new NoneFilter<any>({ equals: 10 })
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })

  it('debe retornar true si el array está vacío', () => {
    const filter = new NoneFilter<any>({ equals: 10 })
    expect(filter.evaluate([])).toBe(true)
  })

  it('debe retornar false si no hay filtros definidos', () => {
    const filter = new NoneFilter<any>({})
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })

  it('debe funcionar con filtros complejos', () => {
    const filter = new NoneFilter<any>({
      equals: 3,
    })

    expect(filter.evaluate([1, 2])).toBe(true)
    expect(filter.evaluate([1, 3])).toBe(false)
  })
})
