import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { EqualityFilter } from './equality-filter'
describe('EqualityFilter', () => {
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
      filter.findMany({ where: { name: { equals: 'Bob' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { equals: 'Mariana' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { equals: 'Alice' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { equals: 'eva' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { equals: 'ank' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { equals: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { equals: undefined } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { equals: '' } } }).data.length
    ).toBe(0)
    expect(filter.findUnique({ where: { name: { equals: '' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: null } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: undefined } } })).toBe(
      null
    )
    expect(filter.findUnique({ where: { name: { equals: 'Mariana' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { equals: 'Bob' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { equals: 'Alice' } } })?.name
    ).toBe('Alice')
  })
  it('boolean', () => {
    const filter = createFilterEngine<{ isValid: boolean }>([
      { isValid: true },
      { isValid: false },
      { isValid: false },
    ])
    expect(
      filter.findMany({ where: { isValid: { equals: true } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { isValid: { equals: false } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { isValid: { equals: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { isValid: { equals: undefined } } }).data.length
    ).toBe(0)
  })
  it('numeric', () => {
    const filter = createFilterEngine<{ size: number }>([
      { size: 10 },
      { size: 11 },
      { size: 12 },
      { size: 12 },
      { size: 0.5 },
    ])
    expect(
      filter.findMany({ where: { size: { equals: 0.5 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { size: { equals: 10 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { size: { equals: 0 } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { size: { equals: 1 } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { size: { equals: 12 } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { size: { equals: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { size: { equals: undefined } } }).data.length
    ).toBe(0)
  })
  it('null and undefined values', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 123 },
    ])
    expect(
      filter.findMany({ where: { value: { equals: null } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { equals: undefined } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { equals: 'hello' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { equals: 123 } } }).data.length
    ).toBe(1)
  })
})
describe('EqualityFilter Unit Tests', () => {
  it('should return true for exact matches', () => {
    const filter = new EqualityFilter('hello')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('world')).toBe(false)
  })
  it('should handle null equality correctly', () => {
    const filter = new EqualityFilter(null)
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate(0)).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('should handle undefined equality correctly', () => {
    const filter = new EqualityFilter(undefined)
    expect(filter.evaluate(undefined)).toBe(true)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate(0)).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('should handle data being null when filter is not null', () => {
    const filter = new EqualityFilter('hello')
    expect(filter.evaluate(null)).toBe(false)
  })
  it('should handle data being undefined when filter is not undefined', () => {
    const filter = new EqualityFilter('hello')
    expect(filter.evaluate(undefined)).toBe(false)
  })
  it('should handle filter being null when data is not null', () => {
    const filter = new EqualityFilter(null)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate(0)).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('should handle filter being undefined when data is not undefined', () => {
    const filter = new EqualityFilter(undefined)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate(0)).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('should handle various data types', () => {
    const stringFilter = new EqualityFilter('hello')
    expect(stringFilter.evaluate('hello')).toBe(true)
    expect(stringFilter.evaluate('world')).toBe(false)
    const numberFilter = new EqualityFilter(123)
    expect(numberFilter.evaluate(123)).toBe(true)
    expect(numberFilter.evaluate(456)).toBe(false)
    const booleanFilter = new EqualityFilter(true)
    expect(booleanFilter.evaluate(true)).toBe(true)
    expect(booleanFilter.evaluate(false)).toBe(false)
    const objectFilter = new EqualityFilter({ key: 'value' })
    expect(objectFilter.evaluate({ key: 'value' })).toBe(false)
  })
  it('should handle edge cases', () => {
    const filter = new EqualityFilter('')
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('hello')).toBe(false)
    const zeroFilter = new EqualityFilter(0)
    expect(zeroFilter.evaluate(0)).toBe(true)
    expect(zeroFilter.evaluate(1)).toBe(false)
    const falseFilter = new EqualityFilter(false)
    expect(falseFilter.evaluate(false)).toBe(true)
    expect(falseFilter.evaluate(true)).toBe(false)
  })
})
