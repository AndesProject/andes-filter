import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { HasEveryFilter } from './has-every-filter'

describe('HasEveryFilter', () => {
  it('arrays que contienen todos los elementos requeridos', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 2, 3, 4] },
      { items: [1, 2, 3] },
      { items: [1, 2] },
      { items: [1] },
    ])

    // Solo el primer array contiene todos los elementos [1, 2, 3]
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3] } } }).data.length
    ).toBe(2)

    // Solo el primer array contiene todos los elementos [1, 2, 3, 4]
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3, 4] } } }).data
        .length
    ).toBe(1)

    // Ningún array contiene todos los elementos [1, 2, 3, 4, 5]
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2, 3, 4, 5] } } }).data
        .length
    ).toBe(0)
  })

  it('arrays con strings', () => {
    const filter = createFilterEngine<{ tags: string[] }>([
      { tags: ['javascript', 'typescript', 'react'] },
      { tags: ['javascript', 'typescript'] },
      { tags: ['javascript'] },
    ])

    // Solo los primeros dos arrays contienen todos los elementos ['javascript', 'typescript']
    expect(
      filter.findMany({
        where: { tags: { hasEvery: ['javascript', 'typescript'] } },
      }).data.length
    ).toBe(2)

    // Solo el primer array contiene todos los elementos ['javascript', 'typescript', 'react']
    expect(
      filter.findMany({
        where: { tags: { hasEvery: ['javascript', 'typescript', 'react'] } },
      }).data.length
    ).toBe(1)
  })

  it('arrays vacíos, null y undefined', () => {
    const filter = createFilterEngine<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [1, 2, 3] },
    ])

    // Solo el array vacío y el array con elementos pasan cuando no hay elementos requeridos
    expect(
      filter.findMany({ where: { items: { hasEvery: [] } } }).data.length
    ).toBe(2)

    // Solo el último array contiene elementos
    expect(
      filter.findMany({ where: { items: { hasEvery: [1] } } }).data.length
    ).toBe(1)
  })

  it('findUnique', () => {
    const filter = createFilterEngine<{ items: number[] }>([
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
    const filter = createFilterEngine<{ flags: boolean[] }>([
      { flags: [true, false, true] },
      { flags: [true, false] },
      { flags: [true] },
    ])

    // Solo los primeros dos arrays contienen todos los elementos [true, false]
    expect(
      filter.findMany({ where: { flags: { hasEvery: [true, false] } } }).data
        .length
    ).toBe(2)
  })

  it('arrays con elementos duplicados', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 1, 2, 2, 3] },
      { items: [1, 2, 3] },
      { items: [1, 2] },
    ])

    // Todos los arrays contienen al menos un 1 y un 2
    expect(
      filter.findMany({ where: { items: { hasEvery: [1, 2] } } }).data.length
    ).toBe(3)

    // Solo los primeros dos contienen al menos un 1, 2 y 3
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
})
