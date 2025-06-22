import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { HasFilter } from './has-filter'

describe('HasFilter', () => {
  it('arrays que contienen el elemento', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
      { items: [7, 8, 9] },
    ])

    // Solo el primer array contiene el número 2
    expect(filter.findMany({ where: { items: { has: 2 } } }).data.length).toBe(
      1
    )

    // Ningún array contiene el número 10
    expect(filter.findMany({ where: { items: { has: 10 } } }).data.length).toBe(
      0
    )
  })

  it('arrays con strings', () => {
    const filter = filterFrom<{ tags: string[] }>([
      { tags: ['javascript', 'typescript'] },
      { tags: ['python', 'java'] },
      { tags: ['javascript', 'react'] },
    ])

    // Dos arrays contienen 'javascript'
    expect(
      filter.findMany({ where: { tags: { has: 'javascript' } } }).data.length
    ).toBe(2)

    // Solo el segundo array contiene 'python'
    expect(
      filter.findMany({ where: { tags: { has: 'python' } } }).data.length
    ).toBe(1)
  })

  it('arrays vacíos, null y undefined', () => {
    const filter = filterFrom<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [1, 2, 3] },
    ])

    // Solo el último array contiene elementos
    expect(filter.findMany({ where: { items: { has: 1 } } }).data.length).toBe(
      1
    )
  })

  it('findUnique', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
    ])

    const result = filter.findUnique({ where: { items: { has: 2 } } })
    expect(result).toEqual({ items: [1, 2, 3] })

    const result2 = filter.findUnique({ where: { items: { has: 10 } } })
    expect(result2).toBe(null)
  })

  it('arrays con booleanos', () => {
    const filter = filterFrom<{ flags: boolean[] }>([
      { flags: [true, false] },
      { flags: [false, false] },
    ])

    // Solo el primer array contiene true
    expect(
      filter.findMany({ where: { flags: { has: true } } }).data.length
    ).toBe(1)
  })
})

describe('HasFilter Unit', () => {
  it('debe retornar true si el array contiene el elemento', () => {
    const filter = new HasFilter<number>(2)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([2])).toBe(true)
  })

  it('debe retornar false si el array no contiene el elemento', () => {
    const filter = new HasFilter<number>(10)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([4, 5, 6])).toBe(false)
  })

  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new HasFilter<number>(2)
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })

  it('debe retornar false si el array está vacío', () => {
    const filter = new HasFilter<number>(2)
    expect(filter.evaluate([])).toBe(false)
  })

  it('debe funcionar con strings', () => {
    const filter = new HasFilter<string>('javascript')
    expect(filter.evaluate(['javascript', 'typescript'])).toBe(true)
    expect(filter.evaluate(['python', 'java'])).toBe(false)
  })

  it('debe funcionar con booleanos', () => {
    const filter = new HasFilter<boolean>(true)
    expect(filter.evaluate([true, false])).toBe(true)
    expect(filter.evaluate([false, false])).toBe(false)
  })

  it('debe funcionar con objetos por referencia', () => {
    const targetObject = { id: 1, name: 'Alice' }
    const filter = new HasFilter<{ id: number; name: string }>(targetObject)

    // Solo funciona si el objeto es la misma referencia
    expect(filter.evaluate([targetObject, { id: 2, name: 'Bob' }])).toBe(true)
    expect(
      filter.evaluate([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ])
    ).toBe(false)
  })
})
