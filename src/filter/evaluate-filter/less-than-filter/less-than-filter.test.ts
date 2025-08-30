import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { LessThanFilter } from './less-than-filter'

describe('LessThanFilter', () => {
  it('should filter numeric values correctly', () => {
    const filter = createFilter<{ size: number }>([
      { size: -2 },
      { size: -1 },
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])
    expect(filter.findMany({ where: { size: { lt: -2 } } }).data.length).toBe(0)
    expect(filter.findMany({ where: { size: { lt: -1 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { size: { lt: 0 } } }).data.length).toBe(2)
    expect(filter.findMany({ where: { size: { lt: 3 } } }).data.length).toBe(6)
    expect(filter.findMany({ where: { size: { lt: 100 } } }).data.length).toBe(
      7
    )
    expect(filter.findUnique({ where: { size: { lt: -2 } } })?.size).toBe(
      undefined
    )
    expect(filter.findUnique({ where: { size: { lt: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lt: 100 } } })?.size).toBe(-2)
  })
  it('should filter date values correctly', () => {
    const d1 = new Date('2020-01-01')
    const d2 = new Date('2021-01-01')
    const d3 = new Date('2022-01-01')
    const filter = createFilter<{ date: Date }>([
      { date: d1 },
      { date: d2 },
      { date: d3 },
    ])
    expect(filter.findMany({ where: { date: { lt: d2 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { date: { lt: d3 } } }).data.length).toBe(2)
    expect(filter.findMany({ where: { date: { lt: d1 } } }).data.length).toBe(0)
    expect(filter.findUnique({ where: { date: { lt: d2 } } })?.date).toEqual(d1)
    expect(filter.findUnique({ where: { date: { lt: d1 } } })).toBe(null)
  })
  it('should filter string values correctly', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(filter.findMany({ where: { value: { lt: 'b' } } }).data.length).toBe(
      1
    )
    expect(filter.findMany({ where: { value: { lt: 'c' } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { value: { lt: 'a' } } }).data.length).toBe(
      0
    )
    expect(filter.findUnique({ where: { value: { lt: 'b' } } })?.value).toBe(
      'a'
    )
    expect(filter.findUnique({ where: { value: { lt: 'a' } } })).toBe(null)
  })
  it('should handle null and undefined values correctly', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { lt: 1 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { value: { lt: 0 } } }).data.length).toBe(0)
    expect(
      filter.findMany({ where: { value: { lt: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { lt: undefined } } }).data.length
    ).toBe(0)
  })
})
describe('LessThanFilter Unit Tests', () => {
  it('debe retornar true si el valor es menor al umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(5)).toBe(true)
    expect(filter.evaluate(-1)).toBe(true)
    expect(filter.evaluate(9.99)).toBe(true)
  })
  it('debe retornar false si el valor es igual o mayor al umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(10)).toBe(false)
    expect(filter.evaluate(11)).toBe(false)
    expect(filter.evaluate(100)).toBe(false)
  })
  it('should handle strings and dates correctly', () => {
    const filter = new LessThanFilter('m')
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('z')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new LessThanFilter(new Date('2023-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2024-01-01'))).toBe(false)
  })
  it('should handle null and undefined values', () => {
    const filter = new LessThanFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
describe('LessThanFilter Edge Cases', () => {
  it('should return false if actualValue is NaN', () => {
    const filter = new LessThanFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should return false if thresholdValue is NaN', () => {
    const filter = new LessThanFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should compare string that looks like date with string that is not a date', () => {
    const filter = new LessThanFilter('not-a-date')
    expect(filter.evaluate('2022-01-01')).toBe(false)
  })
  it('should return false if one string is a valid date and the other is not', () => {
    const filter = new LessThanFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new LessThanFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should return false if actualValue is object and thresholdValue is number', () => {
    const filter = new LessThanFilter(5)
    expect(filter.evaluate({})).toBe(false)
  })
  it('should return false if actualValue is string and thresholdValue is number', () => {
    const filter = new LessThanFilter(5)
    expect(filter.evaluate('5')).toBe(false)
  })
  it('should return false if actualValue is number and thresholdValue is string', () => {
    const filter = new LessThanFilter('5')
    expect(filter.evaluate(5)).toBe(false)
  })
})
describe('LessThanFilter Additional Edge Cases', () => {
  it('should handle NaN in actualValue with number threshold', () => {
    const filter = new LessThanFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should handle NaN in thresholdValue with number actualValue', () => {
    const filter = new LessThanFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should handle one string as valid date and other as invalid date', () => {
    const filter = new LessThanFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new LessThanFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should handle try-catch block with incompatible types', () => {
    const filter = new LessThanFilter(5)
    expect(filter.evaluate({})).toBe(false) // Object comparison should fail
  })
})

describe('LessThanFilter - extra coverage for string dates and catch', () => {
  it('should compare valid string dates when both are valid', () => {
    const f = new LessThanFilter('2023-01-02')
    expect(f.evaluate('2023-01-01')).toBe(true)
    expect(f.evaluate('2023-01-03')).toBe(false)
  })
  it('should trigger catch branch when comparing with Symbol', () => {
    const f = new LessThanFilter(Symbol('s')) as unknown as {
      evaluate: (v: any) => boolean
    }
    expect(f.evaluate(Symbol('x'))).toBe(false)
  })
})
