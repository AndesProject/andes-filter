import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { EveryFilter } from './every-filter'

describe('EveryFilter', () => {
  it('arrays con todos los elementos que cumplen el filtro', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 2] },
      { items: [2] },
      { items: [1, 2, 2] },
    ])
    // Solo los primeros tres cumplen que todos los elementos son 2
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(3)
  })

  it('arrays con algún elemento que no cumple el filtro', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 1, 2] },
      { items: [1, 1, 1] },
    ])
    // Solo el primero cumple
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(1)
  })

  it('arrays vacíos, null y undefined', () => {
    const filter = filterFrom<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [2, 2, 2] },
    ])
    // El array vacío y el array [2,2,2] pasan el filtro every
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(2)
  })

  it('findUnique', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 1, 2] },
    ])
    const result = filter.findUnique({
      where: { items: { every: { equals: 2 } } },
    })
    expect(result).toEqual({ items: [2, 2, 2] })
    const result2 = filter.findUnique({
      where: { items: { every: { equals: 1 } } },
    })
    expect(result2).toBe(null)
  })

  it('filtros complejos', () => {
    const filter = filterFrom<{ posts: boolean[] }>([
      { posts: [true, true] },
      { posts: [true, false] },
    ])
    // Solo el primero cumple que todos los posts son true
    expect(
      filter.findMany({ where: { posts: { every: { equals: true } } } }).data
        .length
    ).toBe(1)
  })
})

describe('EveryFilter Unit', () => {
  it('debe retornar true si todos los elementos cumplen el filtro', () => {
    const filter = new EveryFilter<any>({ equals: 2 })
    expect(filter.evaluate([2, 2, 2])).toBe(true)
    expect(filter.evaluate([2])).toBe(true)
  })

  it('debe retornar false si algún elemento no cumple el filtro', () => {
    const filter = new EveryFilter<any>({ equals: 2 })
    expect(filter.evaluate([2, 1, 2])).toBe(false)
    expect(filter.evaluate([1, 1, 1])).toBe(false)
  })

  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new EveryFilter<any>({ equals: 2 })
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })

  it('debe retornar true si el array está vacío', () => {
    const filter = new EveryFilter<any>({ equals: 2 })
    expect(filter.evaluate([])).toBe(true)
  })

  it('debe retornar false si no hay filtros definidos', () => {
    const filter = new EveryFilter<any>({})
    expect(filter.evaluate([2, 2, 2])).toBe(false)
  })

  it('debe funcionar con filtros complejos', () => {
    const filter = new EveryFilter<any>({ equals: true })
    expect(filter.evaluate([true, true])).toBe(true)
    expect(filter.evaluate([true, false])).toBe(false)
  })
})
