import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { InclusionFilter } from './inclusion-filter'
describe('InclusionFilter', () => {
  it('should filter string values correctly', () => {
    const filter = createFilter<{ name: string }>([
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
    expect(filter.findMany({ where: { name: { in: [''] } } }).data.length).toBe(
      0,
    )
    expect(
      filter.findMany({ where: { name: { in: ['Alice'] } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { in: ['Alice', 'Bob'] } } }).data
        .length,
    ).toBe(3)
    expect(
      filter.findMany({ where: { name: { in: ['David'] } } }).data.length,
    ).toBe(1)
    expect(filter.findUnique({ where: { name: { in: [''] } } })?.name).toBe(
      undefined,
    )
    expect(
      filter.findUnique({ where: { name: { in: ['David'] } } })?.name,
    ).toBe('David')
    expect(
      filter.findUnique({ where: { name: { in: ['David', 'Alice'] } } })?.name,
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { in: ['Alice', 'David'] } } })?.name,
    ).toBe('Alice')
  })
  it('should filter numeric values correctly', () => {
    const filter = createFilter<{ size: number }>([
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
      { size: 0.5 },
    ])
    expect(filter.findMany({ where: { size: { in: [0] } } }).data.length).toBe(
      1,
    )
    expect(filter.findMany({ where: { size: { in: [1] } } }).data.length).toBe(
      1,
    )
    expect(
      filter.findMany({ where: { size: { in: [1, 2] } } }).data.length,
    ).toBe(2)
    expect(filter.findUnique({ where: { size: { in: [1024] } } })?.size).toBe(
      undefined,
    )
    expect(filter.findUnique({ where: { size: { in: [1] } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { in: [0, 1] } } })?.size).toBe(0)
    expect(filter.findUnique({ where: { size: { in: [1, 0] } } })?.size).toBe(0)
  })
  it('should filter boolean values correctly', () => {
    const filter = createFilter<{ isValid: boolean }>([
      { isValid: false },
      { isValid: false },
      { isValid: true },
      { isValid: false },
      { isValid: true },
    ])
    expect(
      filter.findMany({ where: { isValid: { in: [false] } } }).data.length,
    ).toBe(3)
    expect(
      filter.findMany({ where: { isValid: { in: [true] } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { isValid: { in: [false, true] } } }).data
        .length,
    ).toBe(5)
    expect(
      filter.findUnique({ where: { isValid: { in: [false] } } })?.isValid,
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { in: [true] } } })?.isValid,
    ).toBe(true)
  })
  it('casos de borde', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: '' },
      { value: 0 },
      { value: false },
      { value: 'test' },
    ])
    expect(filter.findMany({ where: { value: { in: [] } } }).data.length).toBe(
      0,
    )
    expect(
      filter.findMany({ where: { value: { in: [null] } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { in: [undefined] } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { in: [''] } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { in: [0, false] } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { in: [null, 'test'] } } }).data.length,
    ).toBe(2)
  })
  it('objetos y arrays', () => {
    const obj1 = { id: 1, name: 'test' }
    const obj2 = { id: 2, name: 'test2' }
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    const filter = createFilter<{ value: any }>([
      { value: obj1 },
      { value: obj2 },
      { value: arr1 },
      { value: arr2 },
      { value: 'string' },
    ])
    expect(
      filter.findMany({ where: { value: { in: [obj1] } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { in: [obj1, obj2] } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { in: [arr1] } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { in: [arr1, arr2] } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { in: [obj1, arr1, 'string'] } } }).data
        .length,
    ).toBe(3)
  })
})
describe('InclusionFilter Unit Tests', () => {
  it('debe retornar true cuando el valor está en el array', () => {
    const filter = new InclusionFilter<string>(['a', 'b', 'c'])
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('b')).toBe(true)
    expect(filter.evaluate('c')).toBe(true)
  })
  it('debe retornar false cuando el valor no está en el array', () => {
    const filter = new InclusionFilter<string>(['a', 'b', 'c'])
    expect(filter.evaluate('d')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('debe manejar arrays vacíos', () => {
    const filter = new InclusionFilter<string>([])
    expect(filter.evaluate('a')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('debe manejar arrays con valores mixtos', () => {
    const filter = new InclusionFilter<any>(['a', 1, true, null, undefined])
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate(1)).toBe(true)
    expect(filter.evaluate(true)).toBe(true)
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(true)
    expect(filter.evaluate('b')).toBe(false)
    expect(filter.evaluate(2)).toBe(false)
    expect(filter.evaluate(false)).toBe(false)
  })
  it('debe manejar objetos y arrays', () => {
    const obj = { id: 1 }
    const arr = [1, 2, 3]
    const filter = new InclusionFilter<any>([obj, arr])
    expect(filter.evaluate(obj)).toBe(true)
    expect(filter.evaluate(arr)).toBe(true)
    expect(filter.evaluate({ id: 1 })).toBe(false)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
  })
  it('debe verificar contratos de retorno de findMany y findUnique', () => {
    const filter = createFilter<{ name: string }>([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ])
    const findManyResult = filter.findMany({
      where: { name: { in: ['Alice', 'Bob'] } },
    })
    expect(findManyResult).toHaveProperty('data')
    expect(Array.isArray(findManyResult.data)).toBe(true)
    expect(findManyResult.data.length).toBe(2)
    const findUniqueResult1 = filter.findUnique({
      where: { name: { in: ['Alice'] } },
    })
    expect(findUniqueResult1).toBeDefined()
    expect(findUniqueResult1?.name).toBe('Alice')
    const findUniqueResult2 = filter.findUnique({
      where: { name: { in: ['NonExistent'] } },
    })
    expect(findUniqueResult2).toBe(null)
    const findManyEmpty = filter.findMany({ where: { name: { in: [] } } })
    expect(findManyEmpty).toHaveProperty('data')
    expect(Array.isArray(findManyEmpty.data)).toBe(true)
    expect(findManyEmpty.data.length).toBe(0)
  })
})
