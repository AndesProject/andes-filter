import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { ExclusionFilter } from './exclusion-filter'
describe('ExclusionFilter', () => {
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
      filter.findMany({ where: { name: { notIn: [''] } } }).data.length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notIn: ['Alice'] } } }).data.length
    ).toBe(9)
    expect(
      filter.findMany({ where: { name: { notIn: ['Alice', 'Bob'] } } }).data
        .length
    ).toBe(8)
    expect(
      filter.findMany({ where: { name: { notIn: ['David'] } } }).data.length
    ).toBe(10)
    expect(filter.findUnique({ where: { name: { notIn: [''] } } })?.name).toBe(
      'Alice'
    )
    expect(
      filter.findUnique({ where: { name: { notIn: ['David'] } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notIn: ['David', 'Alice'] } } })
        ?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { notIn: ['Alice', 'David'] } } })
        ?.name
    ).toBe('Bob')
  })
  it('number', () => {
    const filter = createFilterEngine<{ size: number }>([
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])
    expect(
      filter.findMany({ where: { size: { notIn: [0] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { size: { notIn: [1] } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { size: { notIn: [0, 1] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { size: { notIn: [2] } } }).data.length
    ).toBe(4)
    expect(filter.findUnique({ where: { size: { notIn: [0] } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { notIn: [1] } } })?.size).toBe(0)
    expect(
      filter.findUnique({ where: { size: { notIn: [0, 1] } } })?.size
    ).toBe(2)
  })
  it('boolean', () => {
    const filter = createFilterEngine<{ isValid: boolean }>([
      { isValid: true },
      { isValid: true },
      { isValid: false },
      { isValid: true },
      { isValid: false },
    ])
    expect(
      filter.findMany({ where: { isValid: { notIn: [true] } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { isValid: { notIn: [false] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { isValid: { notIn: [false, true] } } }).data
        .length
    ).toBe(0)
    expect(
      filter.findUnique({ where: { isValid: { notIn: [true] } } })?.isValid
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { notIn: [false] } } })?.isValid
    ).toBe(true)
    expect(
      filter.findUnique({ where: { isValid: { notIn: [true, false] } } })
        ?.isValid
    ).toBe(undefined)
  })
  it('casos de borde', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: '' },
      { value: 0 },
      { value: false },
      { value: 'test' },
    ])
    expect(
      filter.findMany({ where: { value: { notIn: [] } } }).data.length
    ).toBe(6)
    expect(
      filter.findMany({ where: { value: { notIn: [null] } } }).data.length
    ).toBe(5)
    expect(
      filter.findMany({ where: { value: { notIn: [undefined] } } }).data.length
    ).toBe(5)
    expect(
      filter.findMany({ where: { value: { notIn: [''] } } }).data.length
    ).toBe(5)
    expect(
      filter.findMany({ where: { value: { notIn: [0, false] } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { notIn: [null, 'test'] } } }).data
        .length
    ).toBe(4)
  })
  it('objetos y arrays', () => {
    const obj1 = { id: 1, name: 'test' }
    const obj2 = { id: 2, name: 'test2' }
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    const filter = createFilterEngine<{ value: any }>([
      { value: obj1 },
      { value: obj2 },
      { value: arr1 },
      { value: arr2 },
      { value: 'string' },
    ])
    expect(
      filter.findMany({ where: { value: { notIn: [obj1] } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { notIn: [obj1, obj2] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { notIn: [arr1] } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { notIn: [arr1, arr2] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { notIn: [obj1, arr1, 'string'] } } })
        .data.length
    ).toBe(2)
  })
})
describe('ExclusionFilter Unit Tests', () => {
  it('debe retornar false cuando el valor está en el array', () => {
    const filter = new ExclusionFilter(['a', 'b', 'c'])
    expect(filter.evaluate('a')).toBe(false)
    expect(filter.evaluate('b')).toBe(false)
    expect(filter.evaluate('c')).toBe(false)
  })
  it('debe retornar true cuando el valor no está en el array', () => {
    const filter = new ExclusionFilter(['a', 'b', 'c'])
    expect(filter.evaluate('d')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(true)
  })
  it('debe manejar arrays vacíos', () => {
    const filter = new ExclusionFilter([])
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate(null)).toBe(true)
  })
  it('debe manejar arrays con valores mixtos', () => {
    const filter = new ExclusionFilter(['a', 1, true, null, undefined])
    expect(filter.evaluate('a')).toBe(false)
    expect(filter.evaluate(1)).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate('b')).toBe(true)
    expect(filter.evaluate(2)).toBe(true)
    expect(filter.evaluate(false)).toBe(true)
  })
  it('debe manejar objetos y arrays', () => {
    const obj = { id: 1 }
    const arr = [1, 2, 3]
    const filter = new ExclusionFilter([obj, arr])
    expect(filter.evaluate(obj)).toBe(false)
    expect(filter.evaluate(arr)).toBe(false)
    expect(filter.evaluate({ id: 1 })).toBe(true)
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('debe manejar fechas por valor', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-01-01')
    const date3 = new Date('2024-01-01')
    const filter = new ExclusionFilter([date1])
    expect(filter.evaluate(date1)).toBe(false)
    expect(filter.evaluate(date2)).toBe(false)
    expect(filter.evaluate(date3)).toBe(true)
  })
  it('debe manejar NaN correctamente', () => {
    const filter = new ExclusionFilter([NaN, 1])
    expect(filter.evaluate(NaN)).toBe(false)
    expect(filter.evaluate(1)).toBe(false)
    expect(filter.evaluate(2)).toBe(true)
  })
})
