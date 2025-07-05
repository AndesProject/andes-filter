import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { GreaterThanFilter } from './greater-than-filter'

describe('GreaterThanFilter Integration Tests', () => {
  describe('Numeric comparison filtering', () => {
    const testData = [
      { size: -2 },
      { size: -1 },
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ]

    it('should find items greater than negative thresholds', () => {
      const filter = createFilterEngine<{ size: number }>(testData)
      const minusTwoResult = filter.findMany({ where: { size: { gt: -2 } } })
      const minusOneResult = filter.findMany({ where: { size: { gt: -1 } } })

      expect(minusTwoResult.data.length).toBe(6)
      expect(minusOneResult.data.length).toBe(5)
    })

    it('should find items greater than zero', () => {
      const filter = createFilterEngine<{ size: number }>(testData)
      const result = filter.findMany({ where: { size: { gt: 0 } } })
      expect(result.data.length).toBe(3)
    })

    it('should return empty results for values greater than maximum', () => {
      const filter = createFilterEngine<{ size: number }>(testData)
      const maxResult = filter.findMany({ where: { size: { gt: 3 } } })
      const largeResult = filter.findMany({ where: { size: { gt: 100 } } })

      expect(maxResult.data.length).toBe(0)
      expect(largeResult.data.length).toBe(0)
    })

    it('should return correct item for findUnique with various thresholds', () => {
      const filter = createFilterEngine<{ size: number }>(testData)
      const minusThreeResult = filter.findUnique({
        where: { size: { gt: -3 } },
      })
      const minusTwoResult = filter.findUnique({ where: { size: { gt: -2 } } })
      const minusOneResult = filter.findUnique({ where: { size: { gt: -1 } } })
      const largeResult = filter.findUnique({ where: { size: { gt: 100 } } })

      expect(minusThreeResult?.size).toBe(-2)
      expect(minusTwoResult?.size).toBe(-1)
      expect(minusOneResult?.size).toBe(0)
      expect(largeResult).toBe(null)
    })
  })

  describe('Date comparison filtering', () => {
    const d1 = new Date('2020-01-01')
    const d2 = new Date('2021-01-01')
    const d3 = new Date('2022-01-01')
    const testData = [{ date: d1 }, { date: d2 }, { date: d3 }]

    it('should find items with dates greater than specified date', () => {
      const filter = createFilterEngine<{ date: Date }>(testData)
      const afterD1Result = filter.findMany({ where: { date: { gt: d1 } } })
      const afterD2Result = filter.findMany({ where: { date: { gt: d2 } } })
      const afterD3Result = filter.findMany({ where: { date: { gt: d3 } } })

      expect(afterD1Result.data.length).toBe(2)
      expect(afterD2Result.data.length).toBe(1)
      expect(afterD3Result.data.length).toBe(0)
    })

    it('should return correct item for findUnique with date comparisons', () => {
      const filter = createFilterEngine<{ date: Date }>(testData)
      const afterD1Result = filter.findUnique({ where: { date: { gt: d1 } } })
      const afterD3Result = filter.findUnique({ where: { date: { gt: d3 } } })

      expect(afterD1Result?.date).toEqual(d2)
      expect(afterD3Result).toBe(null)
    })
  })

  describe('String comparison filtering', () => {
    const testData = [{ value: 'a' }, { value: 'b' }, { value: 'c' }]

    it('should find items with string values greater than specified string', () => {
      const filter = createFilterEngine<{ value: string }>(testData)
      const afterAResult = filter.findMany({ where: { value: { gt: 'a' } } })
      const afterBResult = filter.findMany({ where: { value: { gt: 'b' } } })
      const afterCResult = filter.findMany({ where: { value: { gt: 'c' } } })

      expect(afterAResult.data.length).toBe(2)
      expect(afterBResult.data.length).toBe(1)
      expect(afterCResult.data.length).toBe(0)
    })

    it('should return correct item for findUnique with string comparisons', () => {
      const filter = createFilterEngine<{ value: string }>(testData)
      const afterAResult = filter.findUnique({ where: { value: { gt: 'a' } } })
      const afterCResult = filter.findUnique({ where: { value: { gt: 'c' } } })

      expect(afterAResult?.value).toBe('b')
      expect(afterCResult).toBe(null)
    })
  })

  describe('Null and undefined value handling', () => {
    const testData = [
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ]

    it('should find numeric values greater than specified threshold', () => {
      const filter = createFilterEngine<{ value: any }>(testData)
      const greaterThanZeroResult = filter.findMany({
        where: { value: { gt: 0 } },
      })
      const greaterThanOneResult = filter.findMany({
        where: { value: { gt: 1 } },
      })

      expect(greaterThanZeroResult.data.length).toBe(1)
      expect(greaterThanOneResult.data.length).toBe(0)
    })

    it('should return empty results for null and undefined comparisons', () => {
      const filter = createFilterEngine<{ value: any }>(testData)
      const nullResult = filter.findMany({ where: { value: { gt: null } } })
      const undefinedResult = filter.findMany({
        where: { value: { gt: undefined } },
      })

      expect(nullResult.data.length).toBe(0)
      expect(undefinedResult.data.length).toBe(0)
    })
  })
})

describe('GreaterThanFilter Unit Tests', () => {
  describe('Numeric value comparison', () => {
    it('should return true when value is greater than threshold', () => {
      const filter = new GreaterThanFilter(10)
      expect(filter.evaluate(11)).toBe(true)
      expect(filter.evaluate(100)).toBe(true)
      expect(filter.evaluate(10.01)).toBe(true)
    })

    it('should return false when value is equal or less than threshold', () => {
      const filter = new GreaterThanFilter(10)
      expect(filter.evaluate(10)).toBe(false)
      expect(filter.evaluate(9)).toBe(false)
      expect(filter.evaluate(-1)).toBe(false)
    })
  })

  describe('String value comparison', () => {
    it('should handle string comparisons correctly', () => {
      const filter = new GreaterThanFilter('m')
      expect(filter.evaluate('z')).toBe(true)
      expect(filter.evaluate('a')).toBe(false)
      expect(filter.evaluate('m')).toBe(false)
    })
  })

  describe('Date value comparison', () => {
    it('should handle date comparisons correctly', () => {
      const thresholdDate = new Date('2021-01-01')
      const filter = new GreaterThanFilter(thresholdDate)

      expect(filter.evaluate(new Date('2022-01-01'))).toBe(true)
      expect(filter.evaluate(new Date('2020-01-01'))).toBe(false)
    })
  })

  describe('Null and undefined handling', () => {
    it('should handle null and undefined values', () => {
      const filter = new GreaterThanFilter(1)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
    })

    it('should handle filter threshold being null or undefined', () => {
      const filter1 = new GreaterThanFilter(null)
      const filter2 = new GreaterThanFilter(undefined)

      expect(filter1.evaluate(1)).toBe(false)
      expect(filter2.evaluate(1)).toBe(false)
    })
  })

  describe('NaN handling', () => {
    it('should handle NaN values in filter and data', () => {
      const filter = new GreaterThanFilter(NaN)
      expect(filter.evaluate(1)).toBe(false)
      expect(filter.evaluate(NaN)).toBe(false)
    })

    it('should handle data being NaN when filter is not NaN', () => {
      const filter = new GreaterThanFilter(10)
      expect(filter.evaluate(NaN)).toBe(false)
    })
  })

  describe('Mixed type comparisons', () => {
    it('should handle string vs number comparisons', () => {
      const filter = new GreaterThanFilter(10)
      expect(filter.evaluate('15')).toBe(false)
      expect(filter.evaluate('5')).toBe(false)
      expect(filter.evaluate('abc')).toBe(false)
    })

    it('should handle number vs string comparisons', () => {
      const filter = new GreaterThanFilter('10')
      expect(filter.evaluate(15)).toBe(false)
      expect(filter.evaluate(5)).toBe(false)
    })

    it('should handle string vs string date comparisons', () => {
      const filter = new GreaterThanFilter('2021-01-01')
      expect(filter.evaluate('2022-01-01')).toBe(true)
      expect(filter.evaluate('2020-01-01')).toBe(false)
    })

    it('should handle invalid date strings', () => {
      const filter = new GreaterThanFilter('2021-01-01')
      expect(filter.evaluate('invalid-date')).toBe(false)
    })

    it('should handle one valid and one invalid date', () => {
      const filter = new GreaterThanFilter('invalid-date')
      expect(filter.evaluate('2021-01-01')).toBe(false)
    })
  })

  describe('Exception handling', () => {
    it('should handle comparison exceptions gracefully', () => {
      const filter = new GreaterThanFilter({})
      expect(filter.evaluate({})).toBe(false)
    })
  })
})

describe('GreaterThanFilter Edge Cases', () => {
  it('should return false if actualValue is NaN', () => {
    const filter = new GreaterThanFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should return false if thresholdValue is NaN', () => {
    const filter = new GreaterThanFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should return false if one string is a valid date and the other is not', () => {
    const filter = new GreaterThanFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new GreaterThanFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should return false if actualValue is object and thresholdValue is number', () => {
    const filter = new GreaterThanFilter(5)
    expect(filter.evaluate({})).toBe(false)
  })
  it('should return false if actualValue is string and thresholdValue is number', () => {
    const filter = new GreaterThanFilter(5)
    expect(filter.evaluate('5')).toBe(false)
  })
  it('should return false if actualValue is number and thresholdValue is string', () => {
    const filter = new GreaterThanFilter('5')
    expect(filter.evaluate(5)).toBe(false)
  })
})

describe('GreaterThanFilter Additional Edge Cases', () => {
  it('should handle NaN in actualValue with number threshold', () => {
    const filter = new GreaterThanFilter(5)
    expect(filter.evaluate(NaN)).toBe(false)
  })
  it('should handle NaN in thresholdValue with number actualValue', () => {
    const filter = new GreaterThanFilter(NaN)
    expect(filter.evaluate(5)).toBe(false)
  })
  it('should handle one string as valid date and other as invalid date', () => {
    const filter = new GreaterThanFilter('2022-01-01')
    expect(filter.evaluate('not-a-date')).toBe(false)
    const filter2 = new GreaterThanFilter('not-a-date')
    expect(filter2.evaluate('2022-01-01')).toBe(false)
  })
  it('should handle try-catch block with incompatible types', () => {
    const filter = new GreaterThanFilter(5)
    expect(filter.evaluate({})).toBe(false) // Object comparison should fail
  })
})
