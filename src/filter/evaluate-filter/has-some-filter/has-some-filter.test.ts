import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { HasSomeFilter } from './has-some-filter'

describe('HasSomeFilter', () => {
  it('arrays que contienen al menos uno de los elementos requeridos', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 2, 3, 4] },
      { items: [5, 6, 7] },
      { items: [8, 9, 10] },
      { items: [11, 12] },
    ])
    expect(
      filter.findMany({ where: { items: { hasSome: [1, 5] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { hasSome: [1, 2, 3] } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { hasSome: [99, 100] } } }).data.length
    ).toBe(0)
  })
  it('arrays con strings', () => {
    const filter = createFilterEngine<{ tags: string[] }>([
      { tags: ['javascript', 'typescript', 'react'] },
      { tags: ['python', 'java'] },
      { tags: ['c++', 'c#'] },
    ])
    expect(
      filter.findMany({
        where: { tags: { hasSome: ['javascript', 'python'] } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { tags: { hasSome: ['javascript', 'typescript'] } },
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
    expect(
      filter.findMany({ where: { items: { hasSome: [] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { hasSome: [1] } } }).data.length
    ).toBe(1)
  })
  it('findUnique', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 2, 3, 4] },
      { items: [5, 6, 7] },
    ])
    const result = filter.findUnique({ where: { items: { hasSome: [1, 5] } } })
    expect(result).toEqual({ items: [1, 2, 3, 4] })
    const result2 = filter.findUnique({
      where: { items: { hasSome: [99, 100] } },
    })
    expect(result2).toBe(null)
  })
  it('arrays con booleanos', () => {
    const filter = createFilterEngine<{ flags: boolean[] }>([
      { flags: [true, false, true] },
      { flags: [false, false] },
      { flags: [true] },
    ])
    expect(
      filter.findMany({ where: { flags: { hasSome: [true, false] } } }).data
        .length
    ).toBe(3)
  })
  it('arrays con elementos duplicados', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 1, 2, 2, 3] },
      { items: [4, 5, 6] },
      { items: [7, 8] },
    ])
    expect(
      filter.findMany({ where: { items: { hasSome: [1, 4] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { hasSome: [1, 2, 3] } } }).data.length
    ).toBe(1)
  })
  it('arrays con un solo elemento requerido', () => {
    const filter = createFilterEngine<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
      { items: [7, 8, 9] },
    ])
    expect(
      filter.findMany({ where: { items: { hasSome: [1] } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { hasSome: [4] } } }).data.length
    ).toBe(1)
  })
})
describe('HasSomeFilter Unit', () => {
  it('debe retornar true si el array contiene al menos uno de los elementos requeridos', () => {
    const filter = new HasSomeFilter<number>([1, 2, 3])
    expect(filter.evaluate([1, 4, 5])).toBe(true)
    expect(filter.evaluate([4, 2, 6])).toBe(true)
    expect(filter.evaluate([7, 8, 3])).toBe(true)
  })
  it('debe retornar false si el array no contiene ninguno de los elementos requeridos', () => {
    const filter = new HasSomeFilter<number>([1, 2, 3])
    expect(filter.evaluate([4, 5, 6])).toBe(false)
    expect(filter.evaluate([7, 8, 9])).toBe(false)
  })
  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new HasSomeFilter<number>([1, 2])
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })
  it('debe retornar true si el array está vacío y no hay elementos requeridos', () => {
    const filter = new HasSomeFilter<number>([])
    expect(filter.evaluate([])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('debe retornar false si el array está vacío pero hay elementos requeridos', () => {
    const filter = new HasSomeFilter<number>([1, 2])
    expect(filter.evaluate([])).toBe(false)
  })
  it('debe funcionar con strings', () => {
    const filter = new HasSomeFilter<string>(['javascript', 'typescript'])
    expect(filter.evaluate(['javascript', 'react'])).toBe(true)
    expect(filter.evaluate(['python', 'typescript'])).toBe(true)
    expect(filter.evaluate(['python', 'java'])).toBe(false)
  })
  it('debe funcionar con booleanos', () => {
    const filter = new HasSomeFilter<boolean>([true, false])
    expect(filter.evaluate([true, true])).toBe(true)
    expect(filter.evaluate([false, false])).toBe(true)
    expect(filter.evaluate([true, false])).toBe(true)
  })
  it('debe funcionar con arrays vacíos de elementos requeridos', () => {
    const filter = new HasSomeFilter<number>([])
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([])).toBe(true)
  })
  it('debe funcionar con un solo elemento requerido', () => {
    const filter = new HasSomeFilter<number>([1])
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([4, 5, 6])).toBe(false)
  })
})
describe('HasSomeFilter Edge Cases', () => {
  it('should handle nested filters recursively', () => {
    const filter = new HasSomeFilter([
      {
        user: {
          profile: {
            name: { equals: 'John' },
            settings: { theme: { contains: 'dark' } },
          },
        },
      },
    ])

    expect(
      filter.evaluate([
        {
          user: {
            profile: {
              name: 'John',
              settings: { theme: 'dark mode' },
            },
          },
        },
      ])
    ).toBe(true)
  })

  it('should handle object comparison with JSON.stringify', () => {
    const filter = new HasSomeFilter([{ name: 'John', age: 30, city: 'NYC' }])

    expect(filter.evaluate([{ name: 'John', age: 30, city: 'NYC' }])).toBe(true)

    expect(filter.evaluate([{ name: 'John', age: 30, city: 'Boston' }])).toBe(
      false
    )
  })

  it('should handle mixed object and primitive requirements', () => {
    const filter = new HasSomeFilter(['test', { name: 'John', age: 30 }])

    expect(filter.evaluate(['test', { name: 'John', age: 30 }])).toBe(true)

    expect(filter.evaluate(['other', { name: 'Jane', age: 25 }])).toBe(false)
  })

  it('should handle empty required elements', () => {
    const filter = new HasSomeFilter([])
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([])).toBe(true)
  })

  it('should handle non-array data', () => {
    const filter = new HasSomeFilter([1, 2, 3])
    expect(filter.evaluate('not an array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
