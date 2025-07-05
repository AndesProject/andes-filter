import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { SomeFilter } from './some-filter'

describe('SomeFilter', () => {
  it('should filter string values correctly', () => {
    interface Post {
      title: string
    }
    interface User {
      name: string
      posts: Post[]
    }
    const filter = createFilterEngine<User>([
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
    const filter = createFilterEngine<{ items: any }>([
      { items: [1, 2, 3] },
      { items: [] },
      { items: null },
      { items: undefined },
      { items: 'not-an-array' },
    ])
    expect(
      filter.findMany({ where: { items: { some: { equals: 2 } } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { some: { equals: 999 } } } }).data
        .length
    ).toBe(0)
  })
  it('findUnique', () => {
    const filter = createFilterEngine<{ items: number[] }>([
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
  it('debe manejar filtros NOT con valores primitivos', () => {
    const filter = new SomeFilter({ not: 'test' } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['test', 'hello'])).toBe(true)
    expect(filter.evaluate(['test'])).toBe(false)
  })
  it('debe manejar filtros NOT con objetos múltiples', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
        age: { gte: 25 },
      },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane', age: 20 },
        { name: 'Bob', age: 30 },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 20 },
      ])
    ).toBe(true)
  })
  it('debe manejar comparación directa cuando no hay evaluador y el filtro es un objeto no reconocido', () => {
    // Crear un filtro que no tenga evaluador (caso específico para línea 111)
    const filter = new SomeFilter({ unknownOperator: 'value' } as any)
    // Como no hay evaluador, debería hacer comparación directa
    expect(filter.evaluate([{ unknownOperator: 'value' }])).toBe(true)
    expect(filter.evaluate([{ otherProp: 'value' }])).toBe(false)
  })
  it('debe manejar comparación directa con filtros que tienen múltiples claves no reconocidas', () => {
    const filter = new SomeFilter({
      unknown1: 'value1',
      unknown2: 'value2',
    } as any)
    expect(
      filter.evaluate([
        {
          unknown1: 'value1',
          unknown2: 'value2',
        },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        {
          unknown1: 'value1',
          unknown2: 'different',
        },
      ])
    ).toBe(false)
  })
  it('debe manejar filtros NOT con objetos anidados que tienen múltiples claves', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
        age: { gte: 25 },
        city: { contains: 'New York' },
      },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane', age: 20, city: 'Boston' },
        { name: 'Bob', age: 30, city: 'Chicago' },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 20, city: 'Boston' },
      ])
    ).toBe(true)
  })
  it('debe manejar filtros NOT con valores primitivos (no objetos)', () => {
    const filter = new SomeFilter({ not: 42 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([42, 1, 2])).toBe(true)
    expect(filter.evaluate([42])).toBe(false)
  })
  it('debe manejar filtros NOT con arrays', () => {
    const filter = new SomeFilter({ not: [1, 2, 3] } as any)
    expect(filter.evaluate([4, 5, 6])).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(true) // El array [1,2,3] no es igual al filtro [1,2,3] por referencia
  })
  it('debe manejar filtros NOT con null', () => {
    const filter = new SomeFilter({ not: null } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([null, 1, 2])).toBe(true)
    expect(filter.evaluate([null])).toBe(false)
  })
  it('debe manejar filtros NOT con undefined', () => {
    const filter = new SomeFilter({ not: undefined } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([undefined, 1, 2])).toBe(true)
    expect(filter.evaluate([undefined])).toBe(false)
  })
  it('debe manejar filtros NOT con strings', () => {
    const filter = new SomeFilter({ not: 'test' } as any)
    expect(filter.evaluate(['hello', 'world'])).toBe(true)
    expect(filter.evaluate(['test', 'hello'])).toBe(true)
    expect(filter.evaluate(['test'])).toBe(false)
  })
  it('debe manejar filtros NOT con booleanos', () => {
    const filter = new SomeFilter({ not: true } as any)
    expect(filter.evaluate([false, false, false])).toBe(true)
    expect(filter.evaluate([true, false, false])).toBe(true)
    expect(filter.evaluate([true])).toBe(false)
  })
  it('debe manejar filtros NOT con números', () => {
    const filter = new SomeFilter({ not: 42 } as any)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([42, 1, 2])).toBe(true)
    expect(filter.evaluate([42])).toBe(false)
  })
  it('debe manejar filtros NOT con objetos que tienen múltiples claves internas', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
        age: { gte: 25 },
      },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane', age: 20 },
        { name: 'Bob', age: 30 },
      ])
    ).toBe(true)
  })
  it('debe manejar filtros NOT con objetos que tienen una sola clave interna', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
      },
    } as any)
    expect(filter.evaluate([{ name: 'Jane' }, { name: 'Bob' }])).toBe(true)
  })
  it('debe manejar filtros NOT con objetos que tienen múltiples claves pero solo una interna', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
        age: 25,
      },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane', age: 20 },
        { name: 'Bob', age: 30 },
      ])
    ).toBe(true)
  })
  it('debe manejar filtros NOT con objetos que tienen múltiples claves internas anidadas', () => {
    const filter = new SomeFilter({
      not: {
        name: { equals: 'John' },
        address: { city: { contains: 'New York' } },
      },
    } as any)
    expect(
      filter.evaluate([
        { name: 'Jane', address: { city: 'Boston' } },
        { name: 'Bob', address: { city: 'Chicago' } },
      ])
    ).toBe(true)
  })
  it('debe manejar filtros NOT con objetos que tienen claves no reconocidas', () => {
    const filter = new SomeFilter({
      not: {
        unknownKey: 'value',
      },
    } as any)
    expect(
      filter.evaluate([{ otherKey: 'value' }, { differentKey: 'value' }])
    ).toBe(true)
  })
  it('debe manejar filtros con una sola clave no reconocida (sin operadores)', () => {
    const filter = new SomeFilter({
      unknownKey: 'value',
    } as any)
    expect(
      filter.evaluate([{ unknownKey: 'value' }, { otherKey: 'value' }])
    ).toBe(true)
    expect(
      filter.evaluate([{ differentKey: 'value' }, { anotherKey: 'value' }])
    ).toBe(false)
  })
  it('debe manejar filtros con múltiples claves no reconocidas (sin operadores)', () => {
    const filter = new SomeFilter({
      key1: 'value1',
      key2: 'value2',
    } as any)
    expect(
      filter.evaluate([
        { key1: 'value1', key2: 'value2' },
        { otherKey: 'value' },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { key1: 'value1', key2: 'different' },
        { otherKey: 'value' },
      ])
    ).toBe(false)
  })
})
