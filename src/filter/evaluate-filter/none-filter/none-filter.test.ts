import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { NoneFilter } from './none-filter'
describe('NoneFilter', () => {
  it('arrays con elementos', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [1, 2, 3] },
      { items: [4, 5, 6] },
      { items: [7, 8, 9] },
    ])
    expect(
      filter.findMany({ where: { items: { none: { equals: 10 } } } }).data
        .length
    ).toBe(3)
    expect(
      filter.findMany({ where: { items: { none: { equals: 2 } } } }).data.length
    ).toBe(2)
  })
  it('arrays vacíos, null y undefined', () => {
    const filter = createFilter<{ items: any }>([
      { items: [] },
      { items: null },
      { items: undefined },
      { items: [1, 2, 3] },
    ])
    expect(
      filter.findMany({ where: { items: { none: { equals: 1 } } } }).data.length
    ).toBe(3)
  })
  it('findUnique', () => {
    const filter = createFilter<{ items: number[] }>([
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
    const filter = createFilter<{ posts: number[] }>([
      { posts: [1, 2] },
      { posts: [3, 4] },
    ])
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
  it('debe retornar true si el valor es null o undefined (no hay elementos que cumplan)', () => {
    const filter = new NoneFilter({ equals: 10 })
    expect(filter.evaluate('not-an-array')).toBe(false)
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(true)
    expect(filter.evaluate({})).toBe(false)
  })
  it('debe retornar true si el array está vacío', () => {
    const filter = new NoneFilter({ equals: 10 })
    expect(filter.evaluate([])).toBe(true)
  })
  it('debe retornar false si no hay filtros definidos y el array tiene elementos', () => {
    const filter = new NoneFilter({})
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe funcionar con filtros complejos', () => {
    const filter = new NoneFilter({
      equals: 3,
    })
    expect(filter.evaluate([1, 2])).toBe(true)
    expect(filter.evaluate([1, 3])).toBe(false)
  })
  it('debe manejar filtros con múltiples operadores', () => {
    const filter = new NoneFilter({
      equals: 2,
      gt: 1,
    } as any)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores individuales', () => {
    const filter = new NoneFilter({ equals: 2 } as any)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de comparación', () => {
    const filter = new NoneFilter({ gt: 2 } as any)
    expect(filter.evaluate([1, 2])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de string', () => {
    const filter = new NoneFilter({ contains: 'test' } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(false)
  })
  it('debe manejar filtros con operadores de fecha', () => {
    const filter = new NoneFilter({ after: new Date('2023-01-01') } as any)
    expect(
      filter.evaluate([new Date('2022-12-01'), new Date('2022-11-01')])
    ).toBe(true)
    expect(
      filter.evaluate([new Date('2023-06-01'), new Date('2022-12-01')])
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de array', () => {
    const filter = new NoneFilter({ has: 2 } as any)
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
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de longitud', () => {
    const filter = new NoneFilter({ length: { equals: 3 } } as any)
    expect(filter.evaluate(['ab', 'def', 'ghij'])).toBe(false)
    expect(filter.evaluate(['abc', 'def', 'ghi'])).toBe(false)
  })
  it('debe manejar filtros con operadores lógicos', () => {
    const filter = new NoneFilter({
      AND: [{ equals: 2 }, { gt: 1 }],
    } as any)
    expect(filter.evaluate([1, 1, 3])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de regex', () => {
    const filter = new NoneFilter({
      regex: { pattern: 'test', flags: 'i' },
    } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'TEST', 'world'])).toBe(false)
  })
  it('debe manejar filtros con operadores de inclusión', () => {
    const filter = new NoneFilter({ in: [2, 4, 6] } as any)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de exclusión', () => {
    const filter = new NoneFilter({ notIn: [1, 3, 5] } as any)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
    expect(filter.evaluate([2, 4, 6])).toBe(false)
  })
  it('debe manejar filtros con operadores de null', () => {
    const filter = new NoneFilter({ isNull: true } as any)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(true)
    expect(filter.evaluate([null, 'test', 'world'])).toBe(true)
  })
  it('debe manejar filtros con operadores de negación', () => {
    const filter = new NoneFilter({ not: { equals: 2 } } as any)
    expect(filter.evaluate([2, 2, 2])).toBe(true)
    expect(filter.evaluate([1, 3, 4])).toBe(false)
  })
  it('debe manejar filtros con operadores de modo insensible', () => {
    const filter = new NoneFilter({
      contains: 'TEST',
      mode: 'insensitive',
    } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(false)
  })
  it('debe manejar filtros con operadores de rango', () => {
    const filter = new NoneFilter({ between: [2, 4] } as any)
    expect(filter.evaluate([1, 5, 6])).toBe(true)
    expect(filter.evaluate([1, 3, 5])).toBe(false)
  })
  it('debe manejar filtros con operadores de hasEvery', () => {
    const filter = new NoneFilter({ hasEvery: [2, 4] } as any)
    expect(
      filter.evaluate([
        [1, 3, 5],
        [2, 6],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [2, 4, 6],
        [1, 3],
      ])
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de hasSome', () => {
    const filter = new NoneFilter({ hasSome: [2, 4] } as any)
    expect(
      filter.evaluate([
        [1, 3, 5],
        [6, 7],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de distinct', () => {
    const filter = new NoneFilter({ distinct: true } as any)
    expect(filter.evaluate([1, 1, 2])).toBe(false)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de OR', () => {
    const filter = new NoneFilter({
      OR: [{ equals: 2 }, { equals: 4 }],
    } as any)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros con operadores de startsWith', () => {
    const filter = new NoneFilter({ startsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['test123', 'hello', 'world'])).toBe(false)
  })
  it('debe manejar filtros con operadores de endsWith', () => {
    const filter = new NoneFilter({ endsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['hello', 'world', '123test'])).toBe(false)
  })
  it('debe manejar filtros con operadores de notContains', () => {
    const filter = new NoneFilter<any>({ notContains: 'test' } as any)
    expect(filter.evaluate(['hello', 'test', 'world'])).toBe(false)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(false)
  })
  it('debe manejar filtros con operadores de notStartsWith', () => {
    const filter = new NoneFilter<any>({ notStartsWith: 'test' } as any)
    expect(filter.evaluate(['test123', 'hello', 'world'])).toBe(false)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(false)
  })
  it('debe manejar filtros con operadores de notEndsWith', () => {
    const filter = new NoneFilter<any>({ notEndsWith: 'test' } as any)
    expect(filter.evaluate(['hello', 'world', '123test'])).toBe(false)
    expect(filter.evaluate(['hello', 'world', 'example'])).toBe(false)
  })
  it('debe manejar filtros con operadores de before', () => {
    const filter = new NoneFilter<any>({
      before: new Date('2023-06-01'),
    } as any)
    expect(
      filter.evaluate([new Date('2023-12-01'), new Date('2024-01-01')])
    ).toBe(true)
    expect(
      filter.evaluate([new Date('2023-01-01'), new Date('2023-12-01')])
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de some', () => {
    const filter = new NoneFilter<any>({ some: { equals: 2 } } as any)
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
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de none', () => {
    const filter = new NoneFilter<any>({ none: { equals: 2 } } as any)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(false)
    expect(
      filter.evaluate([
        [1, 3, 4],
        [5, 6],
      ])
    ).toBe(false)
  })
  it('debe manejar filtros con operadores de every', () => {
    const filter = new NoneFilter<any>({ every: { equals: 2 } } as any)
    expect(
      filter.evaluate([
        [1, 2, 3],
        [4, 5],
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        [2, 2, 2],
        [1, 2],
      ])
    ).toBe(false)
  })
  it('debe manejar filtros primitivos', () => {
    const filter = new NoneFilter<any>(2)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe manejar filtros complejos sin evaluador específico', () => {
    const filter = new NoneFilter<any>({
      name: { contains: 'John' },
      age: { gte: 25 },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane Smith', age: 20 },
        { name: 'Bob Johnson', age: 18 },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { name: 'John Doe', age: 30 },
        { name: 'Jane Smith', age: 20 },
      ])
    ).toBe(false)
  })
  it('debe manejar elementos null en el array', () => {
    const filter = new NoneFilter<any>({ equals: 2 } as any)
    expect(filter.evaluate([1, null, 3])).toBe(true)
    expect(filter.evaluate([1, 2, null])).toBe(false)
  })
  it('debe manejar elementos undefined en el array', () => {
    const filter = new NoneFilter<any>({ equals: 2 } as any)
    expect(filter.evaluate([1, undefined, 3])).toBe(true)
    expect(filter.evaluate([1, 2, undefined])).toBe(false)
  })
  it('debe manejar filtros con múltiples keys', () => {
    const filter = new NoneFilter<any>({
      equals: 2,
      gt: 1,
    } as any)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
})
