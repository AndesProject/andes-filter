import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { InequalityFilter } from './inequality-filter'
describe('InequalityFilter', () => {
  it('string', () => {
    const filter = createFilterEngine<{ name: string }>([
      { name: 'Alice' },
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eva' },
      { name: 'Frank' },
      { name: 'Grace' },
      { name: 'Hannah' },
      { name: 'Isaac' },
      { name: 'Jasmine' },
    ])
    expect(
      filter.findMany({ where: { name: { not: 'Alice' } } }).data.length
    ).toBe(9)
    expect(
      filter.findMany({ where: { name: { not: 'Bob' } } }).data.length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { not: 'Andrea' } } }).data.length
    ).toBe(11)
    expect(filter.findMany({ where: { name: { not: '' } } }).data.length).toBe(
      11
    )
    expect(
      filter.findMany({ where: { name: { not: null } } }).data.length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { not: undefined } } }).data.length
    ).toBe(11)
    expect(
      filter.findUnique({ where: { name: { not: undefined } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Alice' } } })?.name).toBe(
      'Bob'
    )
    expect(
      filter.findUnique({ where: { name: { not: 'Jasmine' } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Isaac' } } })?.name).toBe(
      'Alice'
    )
  })
  it('number', () => {
    const filter = createFilterEngine<{ size: number }>([
      { size: 1 },
      { size: 2 },
      { size: 3 },
      { size: 4 },
      { size: 5 },
    ])
    expect(filter.findMany({ where: { size: { not: 1 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 2 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 3 } } }).data.length).toBe(4)
    expect(
      filter.findMany({ where: { size: { not: null } } }).data.length
    ).toBe(5)
    expect(
      filter.findMany({ where: { size: { not: undefined } } }).data.length
    ).toBe(5)
    expect(
      filter.findUnique({ where: { size: { not: undefined } } })?.size
    ).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 1 } } })?.size).toBe(2)
    expect(filter.findUnique({ where: { size: { not: 2 } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 3 } } })?.size).toBe(1)
  })
  it('boolean', () => {
    const filter = createFilterEngine<{ isValid: boolean }>([
      { isValid: true },
      { isValid: true },
      { isValid: false },
    ])
    expect(
      filter.findMany({ where: { isValid: { not: true } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { isValid: { not: false } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { isValid: { not: null } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { isValid: { not: undefined } } }).data.length
    ).toBe(3)
    expect(
      filter.findUnique({ where: { isValid: { not: undefined } } })?.isValid
    ).toBe(true)
    expect(
      filter.findUnique({ where: { isValid: { not: true } } })?.isValid
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { not: false } } })?.isValid
    ).toBe(true)
  })
  it('not con objeto FilterCriteria (condición anidada)', () => {
    const filter = createFilterEngine<{ name: string }>([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
    ])
    expect(
      filter
        .findMany({ where: { name: { not: { contains: 'a' } } } })
        .data.map((x) => x.name)
    ).toEqual(['Alice', 'Bob'])
    expect(
      filter
        .findMany({ where: { name: { not: { startsWith: 'A' } } } })
        .data.map((x) => x.name)
    ).toEqual(['Bob', 'Charlie', 'David'])
    expect(
      filter
        .findMany({ where: { name: { not: { equals: 'Bob' } } } })
        .data.map((x) => x.name)
    ).toEqual(['Alice', 'Charlie', 'David'])
    expect(
      filter
        .findMany({ where: { name: { not: { endsWith: 'e' } } } })
        .data.map((x) => x.name)
    ).toEqual(['Bob', 'David'])
  })
  it('not anidado (doble negación)', () => {
    const filter = createFilterEngine<{ name: string }>([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
    ])
    expect(
      filter
        .findMany({ where: { name: { not: { not: { equals: 'Bob' } } } } })
        .data.map((x) => x.name)
    ).toEqual(['Bob'])
  })
})
describe('InequalityFilter Unit', () => {
  it('debe manejar valores primitivos', () => {
    const filter = new InequalityFilter<string>('test')
    expect(filter.evaluate('test')).toBe(false)
    expect(filter.evaluate('other')).toBe(true)
  })
  it('debe manejar números', () => {
    const filter = new InequalityFilter<number>(42)
    expect(filter.evaluate(42)).toBe(false)
    expect(filter.evaluate(43)).toBe(true)
  })
  it('debe manejar booleanos', () => {
    const filter = new InequalityFilter<boolean>(true)
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate(false)).toBe(true)
  })
  it('debe manejar null', () => {
    const filter = new InequalityFilter<any>(null)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate('test')).toBe(true)
  })
  it('debe manejar undefined', () => {
    const filter = new InequalityFilter<any>(undefined)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate('test')).toBe(true)
  })
  it('debe manejar objetos con un operador', () => {
    const filter = new InequalityFilter<any>({ equals: 'test' })
    expect(filter.evaluate('test')).toBe(false)
    expect(filter.evaluate('other')).toBe(true)
  })
  it('debe manejar objetos con múltiples operadores', () => {
    const filter = new InequalityFilter<any>({
      equals: 'test',
      contains: 'es',
    })
    expect(filter.evaluate('test')).toBe(false)
    expect(filter.evaluate('other')).toBe(true)
  })
  it('debe manejar objetos con operadores de comparación', () => {
    const filter = new InequalityFilter<any>({ gt: 10 })
    expect(filter.evaluate(15)).toBe(false)
    expect(filter.evaluate(5)).toBe(true)
  })
  it('debe manejar objetos con operadores de string', () => {
    const filter = new InequalityFilter<any>({ contains: 'test' })
    expect(filter.evaluate('hello test world')).toBe(false)
    expect(filter.evaluate('hello world')).toBe(true)
  })
  it('debe manejar objetos con operadores de fecha', () => {
    const filter = new InequalityFilter<any>({ after: new Date('2023-01-01') })
    expect(filter.evaluate(new Date('2023-06-01'))).toBe(false)
    expect(filter.evaluate(new Date('2022-12-01'))).toBe(true)
  })
  it('debe manejar objetos con operadores de array', () => {
    const filter = new InequalityFilter<any>({ has: 2 })
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
  })
  it('debe manejar objetos con operadores de longitud', () => {
    const filter = new InequalityFilter<any>({ length: { equals: 3 } })
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 2])).toBe(true)
  })
  it('debe manejar objetos con operadores lógicos', () => {
    const filter = new InequalityFilter<any>({
      AND: [{ equals: 2 }, { gt: 1 }],
    })
    expect(filter.evaluate(2)).toBe(false)
    expect(filter.evaluate(1)).toBe(true)
  })
  it('debe manejar objetos con operadores de regex', () => {
    const filter = new InequalityFilter<any>({
      regex: { pattern: 'test', flags: 'i' },
    })
    expect(filter.evaluate('TEST')).toBe(false)
    expect(filter.evaluate('other')).toBe(true)
  })
  it('debe manejar objetos con operadores de inclusión', () => {
    const filter = new InequalityFilter<any>({ in: [2, 4, 6] })
    expect(filter.evaluate(2)).toBe(false)
    expect(filter.evaluate(1)).toBe(true)
  })
  it('debe manejar objetos con operadores de exclusión', () => {
    const filter = new InequalityFilter<any>({ notIn: [1, 3, 5] })
    expect(filter.evaluate(2)).toBe(false)
    expect(filter.evaluate(1)).toBe(true)
  })
  it('debe manejar objetos con operadores de null', () => {
    const filter = new InequalityFilter<any>({ isNull: true })
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate('test')).toBe(true)
  })
  it('debe manejar objetos con operadores de negación', () => {
    const filter = new InequalityFilter<any>({ not: { equals: 2 } })
    expect(filter.evaluate(1)).toBe(false)
    expect(filter.evaluate(2)).toBe(true)
  })
  it('debe manejar objetos con operadores de modo insensible', () => {
    const filter = new InequalityFilter<any>({
      contains: 'TEST',
      mode: 'insensitive',
    })
    expect(filter.evaluate('hello test world')).toBe(false)
    expect(filter.evaluate('hello world')).toBe(true)
  })
  it('debe manejar objetos con operadores de rango', () => {
    const filter = new InequalityFilter<any>({ between: [2, 4] })
    expect(filter.evaluate(3)).toBe(false)
    expect(filter.evaluate(1)).toBe(true)
  })
  it('debe manejar objetos con operadores de hasEvery', () => {
    const filter = new InequalityFilter<any>({ hasEvery: [2, 4] })
    expect(filter.evaluate([2, 4, 6])).toBe(false)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
  })
  it('debe manejar objetos con operadores de hasSome', () => {
    const filter = new InequalityFilter<any>({ hasSome: [2, 4] })
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 3, 5])).toBe(true)
  })
  it('debe manejar objetos con operadores de distinct', () => {
    const filter = new InequalityFilter<any>({ distinct: true })
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 1, 2])).toBe(false)
  })
  it('debe manejar objetos con operadores de OR', () => {
    const filter = new InequalityFilter<any>({
      OR: [{ equals: 2 }, { equals: 4 }],
    })
    expect(filter.evaluate(2)).toBe(false)
    expect(filter.evaluate(1)).toBe(true)
  })
  it('debe manejar objetos con operadores de startsWith', () => {
    const filter = new InequalityFilter<any>({ startsWith: 'test' })
    expect(filter.evaluate('test123')).toBe(false)
    expect(filter.evaluate('hello')).toBe(true)
  })
  it('debe manejar objetos con operadores de endsWith', () => {
    const filter = new InequalityFilter<any>({ endsWith: 'test' })
    expect(filter.evaluate('123test')).toBe(false)
    expect(filter.evaluate('hello')).toBe(true)
  })
  it('debe manejar objetos con operadores de notContains', () => {
    const filter = new InequalityFilter<any>({ notContains: 'test' })
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('hello test world')).toBe(true)
  })
  it('debe manejar objetos con operadores de notStartsWith', () => {
    const filter = new InequalityFilter<any>({ notStartsWith: 'test' })
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('test123')).toBe(true)
  })
  it('debe manejar objetos con operadores de notEndsWith', () => {
    const filter = new InequalityFilter<any>({ notEndsWith: 'test' })
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('123test')).toBe(true)
  })
  it('debe manejar objetos con operadores de before', () => {
    const filter = new InequalityFilter<any>({ before: new Date('2023-06-01') })
    expect(filter.evaluate(new Date('2023-01-01'))).toBe(false)
    expect(filter.evaluate(new Date('2023-12-01'))).toBe(true)
  })
  it('debe manejar objetos con operadores de some', () => {
    const filter = new InequalityFilter<any>({ some: { equals: 2 } })
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
  })
  it('debe manejar objetos con operadores de none', () => {
    const filter = new InequalityFilter<any>({ none: { equals: 2 } })
    expect(filter.evaluate([1, 3, 4])).toBe(false)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('debe manejar objetos con operadores de every', () => {
    const filter = new InequalityFilter<any>({ every: { equals: 2 } })
    expect(filter.evaluate([2, 2, 2])).toBe(false)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 3, 4])).toBe(true)
  })
  it('debe manejar objetos planos por referencia', () => {
    const obj = { name: 'John', age: 30 }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ name: 'John', age: 30 })).toBe(true)
  })
  it('debe manejar objetos anidados por referencia', () => {
    const user = { name: 'John', age: 30 }
    const obj1 = { user }
    const obj2 = { user }
    const obj3 = { user: { name: 'John', age: 30 } }
    const filter = new InequalityFilter<any>(obj1)
    expect(filter.evaluate(obj1)).toBe(false)
    expect(filter.evaluate(obj2)).toBe(true)
    expect(filter.evaluate(obj3)).toBe(true)
  })
  it('debe manejar objetos con valores null por referencia', () => {
    const obj = { name: null }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ name: null })).toBe(true)
  })
  it('debe manejar objetos con valores undefined por referencia', () => {
    const obj = { name: undefined }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ name: undefined })).toBe(true)
  })
  it('debe manejar objetos con valores booleanos por referencia', () => {
    const obj = { active: true }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ active: true })).toBe(true)
  })
  it('debe manejar objetos con valores numéricos por referencia', () => {
    const obj = { count: 42 }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ count: 42 })).toBe(true)
  })
  it('debe manejar objetos con valores de string por referencia', () => {
    const obj = { message: 'hello' }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ message: 'hello' })).toBe(true)
  })
  it('debe manejar objetos con valores de array por referencia', () => {
    const obj = { tags: ['a', 'b'] }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ tags: ['a', 'b'] })).toBe(true)
  })
  it('debe manejar objetos con valores de fecha por referencia', () => {
    const date = new Date('2023-01-01')
    const obj = { createdAt: date }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate({ createdAt: new Date('2023-01-01') })).toBe(true)
  })
  it('debe manejar objetos con valores mixtos por referencia', () => {
    const obj = {
      name: 'John',
      age: 30,
      active: true,
      tags: ['a', 'b'],
    }
    const filter = new InequalityFilter<any>(obj)
    expect(filter.evaluate(obj)).toBe(false)
    expect(
      filter.evaluate({
        name: 'John',
        age: 30,
        active: true,
        tags: ['a', 'b'],
      })
    ).toBe(true)
  })
})
