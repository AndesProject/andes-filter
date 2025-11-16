import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { LessThanOrEqualFilter } from './less-than-or-equal-filter'

describe('LessThanOrEqualFilter', () => {
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
    expect(filter.findMany({ where: { size: { lte: -2 } } }).data.length).toBe(
      1,
    )
    expect(filter.findMany({ where: { size: { lte: -1 } } }).data.length).toBe(
      2,
    )
    expect(filter.findMany({ where: { size: { lte: 0 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { lte: 3 } } }).data.length).toBe(7)
    expect(filter.findMany({ where: { size: { lte: 100 } } }).data.length).toBe(
      7,
    )
    expect(filter.findUnique({ where: { size: { lte: -3 } } })).toBe(null)
    expect(filter.findUnique({ where: { size: { lte: -2 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: 100 } } })?.size).toBe(-2)
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
    expect(filter.findMany({ where: { date: { lte: d2 } } }).data.length).toBe(
      2,
    )
    expect(filter.findMany({ where: { date: { lte: d3 } } }).data.length).toBe(
      3,
    )
    expect(filter.findMany({ where: { date: { lte: d1 } } }).data.length).toBe(
      1,
    )
    expect(filter.findUnique({ where: { date: { lte: d1 } } })?.date).toEqual(
      d1,
    )
    expect(
      filter.findUnique({ where: { date: { lte: new Date('2019-01-01') } } }),
    ).toBe(null)
  })
  it('should filter string values correctly', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(
      filter.findMany({ where: { value: { lte: 'b' } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { lte: 'c' } } }).data.length,
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { lte: 'a' } } }).data.length,
    ).toBe(1)
    expect(filter.findUnique({ where: { value: { lte: 'a' } } })?.value).toBe(
      'a',
    )
    expect(filter.findUnique({ where: { value: { lte: 'A' } } })).toBe(null)
  })
  it('should handle null and undefined values correctly', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { lte: 1 } } }).data.length).toBe(
      2,
    )
    expect(filter.findMany({ where: { value: { lte: 0 } } }).data.length).toBe(
      1,
    )
    expect(
      filter.findMany({ where: { value: { lte: null } } }).data.length,
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { lte: undefined } } }).data.length,
    ).toBe(0)
  })
})
describe('LessThanOrEqualFilter Unit Tests', () => {
  it('debe retornar true si el valor es menor o igual al umbral', () => {
    const filter = new LessThanOrEqualFilter(10)
    expect(filter.evaluate(5)).toBe(true)
    expect(filter.evaluate(10)).toBe(true)
    expect(filter.evaluate(-1)).toBe(true)
    expect(filter.evaluate(9.99)).toBe(true)
  })
  it('debe retornar false si el valor es mayor al umbral', () => {
    const filter = new LessThanOrEqualFilter(10)
    expect(filter.evaluate(11)).toBe(false)
    expect(filter.evaluate(100)).toBe(false)
  })
  it('should handle strings and dates correctly', () => {
    const filter = new LessThanOrEqualFilter('m')
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('m')).toBe(true)
    expect(filter.evaluate('z')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new LessThanOrEqualFilter(new Date('2023-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2023-01-01'))).toBe(true)
    expect(filterDate.evaluate(new Date('2024-01-01'))).toBe(false)
  })
  it('should handle valid date strings (equal and greater)', () => {
    const filter = new LessThanOrEqualFilter('2021-01-01')
    // Igualdad (debe entrar a rama de fechas string válidas y ser true)
    expect(filter.evaluate('2021-01-01')).toBe(true)
    // Mayor (debe ser false)
    expect(filter.evaluate('2022-01-01')).toBe(false)
    // Menor (debe ser true)
    expect(filter.evaluate('2020-12-31')).toBe(true)
  })
  it('should trigger catch branch when comparing with Symbol', () => {
    const f = new LessThanOrEqualFilter(Symbol('s')) as unknown as {
      evaluate: (v: any) => boolean
    }
    expect(f.evaluate(Symbol('x'))).toBe(false)
  })
  it('should handle null and undefined values', () => {
    const filter = new LessThanOrEqualFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
describe('LessThanOrEqualFilter Edge Cases', () => {
  it('should return false if actualValue is NaN', () => {
    const filter = new LessThanOrEqualFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should return false if thresholdValue is NaN', () => {
    const filter = new LessThanOrEqualFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should compare string that looks like date with string that is not a date', () => {
    const filter = new LessThanOrEqualFilter('not-a-date')
    expect(filter.evaluate('2022-01-01')).toBe(false)
  })
  it('should return false if one string is a valid date and the other is not', () => {
    const filter = new LessThanOrEqualFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new LessThanOrEqualFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should return false if actualValue is object and thresholdValue is number', () => {
    const filter = new LessThanOrEqualFilter(5)
    expect(filter.evaluate({})).toBe(false)
  })
  it('should return false if actualValue is string and thresholdValue is number', () => {
    const filter = new LessThanOrEqualFilter(5)
    expect(filter.evaluate('5')).toBe(false)
  })
  it('should return false if actualValue is number and thresholdValue is string', () => {
    const filter = new LessThanOrEqualFilter('5')
    expect(filter.evaluate(5)).toBe(false)
  })
})
describe('LessThanOrEqualFilter Additional Edge Cases', () => {
  it('should handle NaN in actualValue with number threshold', () => {
    const filter = new LessThanOrEqualFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should handle NaN in thresholdValue with number actualValue', () => {
    const filter = new LessThanOrEqualFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should handle one string as valid date and other as invalid date', () => {
    const filter = new LessThanOrEqualFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new LessThanOrEqualFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should handle try-catch block with incompatible types', () => {
    const filter = new LessThanOrEqualFilter(5)
    expect(filter.evaluate({})).toBe(false) // Object comparison should fail
  })
})
