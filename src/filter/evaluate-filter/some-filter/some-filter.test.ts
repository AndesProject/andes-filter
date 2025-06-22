import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { SomeFilter } from './some-filter'

describe('SomeFilter', () => {
  it('string', () => {
    interface Post {
      title: string
    }

    interface User {
      name: string
      posts: Post[]
    }

    const filter = filterFrom<User>([
      { name: 'Alice', posts: [{ title: 'a' }] },
      { name: 'Alice', posts: [{ title: 'b' }] },
      { name: 'Bob', posts: [{ title: 'c' }] },
      { name: 'Charlie', posts: [{ title: 'd' }] },
      { name: 'David', posts: [{ title: 'e' }] },
      { name: 'Eva', posts: [{ title: 'f' }] },
      { name: 'Frank', posts: [{ title: 'global test' }] },
      { name: 'Grace', posts: [{ title: 'a' }] },
    ])

    expect(
      filter.findMany({
        where: {
          posts: {
            some: {
              title: {
                equals: 'a',
              },
            } as any,
          },
        },
      }).data.length
    ).toBe(2)

    expect(
      filter.findMany({
        where: {
          posts: {
            some: {
              title: {
                contains: 'TEST',
                mode: 'insensitive',
              },
            } as any,
          },
        },
      }).data.length
    ).toBe(1)
  })

  it('no array, array vacío, null y undefined', () => {
    const filter = filterFrom<{ items: any }>([
      { items: [1, 2, 3] },
      { items: [] },
      { items: null },
      { items: undefined },
      { items: 'not-an-array' },
    ])
    // Solo el primero cumple con some: equals 2
    expect(
      filter.findMany({ where: { items: { some: { equals: 2 } } } }).data.length
    ).toBe(1)
    // Ninguno cumple con some: equals 999
    expect(
      filter.findMany({ where: { items: { some: { equals: 999 } } } }).data
        .length
    ).toBe(0)
  })

  it('findUnique', () => {
    const filter = filterFrom<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
    ])
    const result = filter.findUnique({
      where: { items: { some: { equals: 2 } } },
    })
    expect(result).toEqual({ items: [1, 2, 3] })
    const result2 = filter.findUnique({
      where: { items: { some: { equals: 999 } } },
    })
    expect(result2).toBe(null)
  })
})

describe('SomeFilter Unit', () => {
  it('debe retornar true si algún elemento cumple el filtro', () => {
    const filter = new SomeFilter({ equals: 2 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([4, 5, 6])).toBe(false)
  })

  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new SomeFilter({ equals: 2 } as any)
    expect(filter.evaluate('not-an-array' as any)).toBe(false)
    expect(filter.evaluate(null as any)).toBe(false)
    expect(filter.evaluate(undefined as any)).toBe(false)
    expect(filter.evaluate({} as any)).toBe(false)
  })

  it('debe retornar false si el array está vacío', () => {
    const filter = new SomeFilter({ equals: 2 } as any)
    expect(filter.evaluate([])).toBe(false)
  })

  it('debe funcionar con filtros complejos', () => {
    const filter = new SomeFilter({
      name: { contains: 'John' },
      age: { gte: 25 },
    } as any)
    expect(
      filter.evaluate([
        { name: 'John Doe', age: 30 },
        { name: 'Jane Smith', age: 20 },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { name: 'Jane Smith', age: 20 },
        { name: 'Bob Johnson', age: 18 },
      ])
    ).toBe(false)
  })

  it('debe manejar filtros con múltiples operadores', () => {
    const filter = new SomeFilter({
      equals: 2,
      gt: 1,
    } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([0, 1])).toBe(false)
  })

  it('debe manejar filtros vacíos', () => {
    const filter = new SomeFilter({} as any)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([])).toBe(false)
  })

  it('debe manejar filtros primitivos', () => {
    const filter = new SomeFilter(2)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 3, 4])).toBe(false)
  })

  it('debe manejar filtros con operadores individuales', () => {
    const filter = new SomeFilter({ equals: 2 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 3, 4])).toBe(false)
  })

  it('debe manejar filtros con operadores de comparación', () => {
    const filter = new SomeFilter({ gt: 2 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 2])).toBe(false)
  })

  it('debe manejar filtros con operadores de string', () => {
    const filter = new SomeFilter({ contains: 'test' } as any)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de fecha', () => {
    const filter = new SomeFilter({ after: new Date('2023-01-01') } as any)
    expect(
      filter.evaluate([new Date('2023-06-01'), new Date('2022-12-01')])
    ).toBe(true)
    expect(
      filter.evaluate([new Date('2022-12-01'), new Date('2022-11-01')])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de array', () => {
    const filter = new SomeFilter({ has: 2 } as any)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 3, 4],
        [5, 6],
      ])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de longitud', () => {
    const filter = new SomeFilter({ length: { equals: 3 } } as any)
    expect(filter.evaluate(['abc', 'def', 'ghi'])).toBe(true)
    expect(filter.evaluate(['ab', 'def', 'ghij'])).toBe(true)
  })

  it('debe manejar filtros con operadores lógicos', () => {
    const filter = new SomeFilter({
      AND: [{ equals: 2 }, { gt: 1 }],
    } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 1, 3])).toBe(false)
  })

  it('debe manejar filtros con operadores de regex', () => {
    const filter = new SomeFilter({ regex: { pattern: 'test', flags: 'i' } })
    expect(filter.evaluate(['hello', 'TEST', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de inclusión', () => {
    const filter = new SomeFilter({ in: [2, 4, 6] } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 3, 5])).toBe(false)
  })

  it('debe manejar filtros con operadores de exclusión', () => {
    const filter = new SomeFilter({ notIn: [1, 3, 5] } as any)
    expect(filter.evaluate([2, 4, 6])).toBe(true)
    expect(filter.evaluate([1, 3, 5])).toBe(false)
  })

  it('debe manejar filtros con operadores de null', () => {
    const filter = new SomeFilter({ isNull: true } as any)
    expect(filter.evaluate([null, 'test', 'world'])).toBe(false)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de negación', () => {
    const filter = new SomeFilter({ not: { equals: 2 } } as any)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
    expect(filter.evaluate([2, 2, 2])).toBe(false)
  })

  it('debe manejar filtros con operadores de modo insensible', () => {
    const filter = new SomeFilter({
      contains: 'TEST',
      mode: 'insensitive',
    } as any)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de rango', () => {
    const filter = new SomeFilter({ between: [2, 4] } as any)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
    expect(filter.evaluate([1, 5, 6])).toBe(false)
  })

  it('debe manejar filtros con operadores de hasEvery', () => {
    const filter = new SomeFilter({ hasEvery: [2, 4] } as any)
    expect(
      filter.evaluate([
        [2, 4, 6],
        [1, 3],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 3, 5],
        [2, 6],
      ])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de hasSome', () => {
    const filter = new SomeFilter({ hasSome: [2, 4] } as any)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 3, 5],
        [6, 7],
      ])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de distinct', () => {
    const filter = new SomeFilter({ distinct: true } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 1, 2])).toBe(false)
  })

  it('debe manejar filtros con operadores de OR', () => {
    const filter = new SomeFilter({
      OR: [{ equals: 2 }, { equals: 4 }],
    } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 3, 5])).toBe(false)
  })

  it('debe manejar filtros con operadores de startsWith', () => {
    const filter = new SomeFilter({ startsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'test123', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de endsWith', () => {
    const filter = new SomeFilter({ endsWith: 'test' } as any)
    expect(filter.evaluate(['hello', '123test', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar filtros con operadores de notContains', () => {
    const filter = new SomeFilter({ notContains: 'test' } as any)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(true)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(true)
  })

  it('debe manejar filtros con operadores de notStartsWith', () => {
    const filter = new SomeFilter({ notStartsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(true)
    expect(filter.evaluate(['test123', 'hello', 'world'])).toBe(true)
  })

  it('debe manejar filtros con operadores de notEndsWith', () => {
    const filter = new SomeFilter({ notEndsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(true)
    expect(filter.evaluate(['hello', 'world', '123test'])).toBe(true)
  })

  it('debe manejar filtros con operadores de before', () => {
    const filter = new SomeFilter({
      before: new Date('2023-06-01'),
    } as any)
    expect(
      filter.evaluate([new Date('2023-01-01'), new Date('2023-12-01')])
    ).toBe(true)
    expect(
      filter.evaluate([new Date('2023-12-01'), new Date('2024-01-01')])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de some', () => {
    const filter = new SomeFilter({ some: { equals: 2 } } as any)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 3, 4],
        [5, 6],
      ])
    ).toBe(false)
  })

  it('debe manejar filtros con operadores de none', () => {
    const filter = new SomeFilter({ none: { equals: 2 } } as any)
    expect(
      filter.evaluate([
        [1, 3, 4],
        [5, 6],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(true)
  })

  it('debe manejar filtros con operadores de every', () => {
    const filter = new SomeFilter({ every: { equals: 2 } } as any)
    expect(
      filter.evaluate([
        [2, 2, 2],
        [1, 2],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(false)
  })

  it('debe manejar comparación directa cuando no hay evaluador', () => {
    const filter = new SomeFilter('test')
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world'])).toBe(false)
  })

  it('debe manejar comparación directa con números', () => {
    const filter = new SomeFilter(42)
    expect(filter.evaluate([1, 42, 3])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })

  it('debe manejar comparación directa con booleanos', () => {
    const filter = new SomeFilter(true)
    expect(filter.evaluate([false, true, false])).toBe(true)
    expect(filter.evaluate([false, false, false])).toBe(false)
  })
})
