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
    const filter = new SomeFilter<any>({ equals: 2 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([4, 5, 6])).toBe(false)
  })

  it('debe retornar false si el valor no es un array, es null o undefined', () => {
    const filter = new SomeFilter<any>({ equals: 2 } as any)
    expect(filter.evaluate('not-an-array' as any)).toBe(false)
    expect(filter.evaluate(null as any)).toBe(false)
    expect(filter.evaluate(undefined as any)).toBe(false)
    expect(filter.evaluate({} as any)).toBe(false)
  })

  it('debe retornar false si el array está vacío', () => {
    const filter = new SomeFilter<any>({ equals: 2 } as any)
    expect(filter.evaluate([])).toBe(false)
  })

  it('debe funcionar con filtros complejos', () => {
    const filter = new SomeFilter<any>({
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
})
