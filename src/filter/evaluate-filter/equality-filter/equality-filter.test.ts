import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { EqualityFilter } from './equality-filter'

describe('EqualityFilter Integration Tests', () => {
  describe('String equality filtering', () => {
    const testData = [
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
    ]

    it('should find exact string matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: 'Bob' } } })
      expect(result.data.length).toBe(1)
    })

    it('should return empty results for non-existent strings', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: 'Mariana' } } })
      expect(result.data.length).toBe(0)
    })

    it('should find multiple exact matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: 'Alice' } } })
      expect(result.data.length).toBe(2)
    })

    it('should be case sensitive for string matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: 'eva' } } })
      expect(result.data.length).toBe(0)
    })

    it('should not match partial strings', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: 'ank' } } })
      expect(result.data.length).toBe(0)
    })

    it('should handle null filter values', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: null } } })
      expect(result.data.length).toBe(0)
    })

    it('should handle undefined filter values', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: undefined } } })
      expect(result.data.length).toBe(0)
    })

    it('should handle empty string filter values', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { equals: '' } } })
      expect(result.data.length).toBe(0)
    })

    it('should return null for findUnique with non-existent values', () => {
      const filter = createFilter<{ name: string }>(testData)
      expect(filter.findUnique({ where: { name: { equals: '' } } })).toBe(null)
      expect(filter.findUnique({ where: { name: { equals: null } } })).toBe(
        null
      )
      expect(
        filter.findUnique({ where: { name: { equals: undefined } } })
      ).toBe(null)
      expect(
        filter.findUnique({ where: { name: { equals: 'Mariana' } } })
      ).toBe(null)
    })

    it('should return correct item for findUnique with exact matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      expect(
        filter.findUnique({ where: { name: { equals: 'Bob' } } })?.name
      ).toBe('Bob')
      expect(
        filter.findUnique({ where: { name: { equals: 'Alice' } } })?.name
      ).toBe('Alice')
    })
  })

  describe('Boolean equality filtering', () => {
    const testData = [{ isValid: true }, { isValid: false }, { isValid: false }]

    it('should find exact boolean matches', () => {
      const filter = createFilter<{ isValid: boolean }>(testData)
      const trueResult = filter.findMany({
        where: { isValid: { equals: true } },
      })
      const falseResult = filter.findMany({
        where: { isValid: { equals: false } },
      })

      expect(trueResult.data.length).toBe(1)
      expect(falseResult.data.length).toBe(2)
    })

    it('should handle null and undefined filter values for booleans', () => {
      const filter = createFilter<{ isValid: boolean }>(testData)
      const nullResult = filter.findMany({
        where: { isValid: { equals: null } },
      })
      const undefinedResult = filter.findMany({
        where: { isValid: { equals: undefined } },
      })

      expect(nullResult.data.length).toBe(0)
      expect(undefinedResult.data.length).toBe(0)
    })
  })

  describe('Numeric equality filtering', () => {
    const testData = [
      { size: 10 },
      { size: 11 },
      { size: 12 },
      { size: 12 },
      { size: 0.5 },
    ]

    it('should find exact numeric matches', () => {
      const filter = createFilter<{ size: number }>(testData)
      const decimalResult = filter.findMany({
        where: { size: { equals: 0.5 } },
      })
      const integerResult = filter.findMany({ where: { size: { equals: 10 } } })

      expect(decimalResult.data.length).toBe(1)
      expect(integerResult.data.length).toBe(1)
    })

    it('should return empty results for non-existent numbers', () => {
      const filter = createFilter<{ size: number }>(testData)
      const zeroResult = filter.findMany({ where: { size: { equals: 0 } } })
      const oneResult = filter.findMany({ where: { size: { equals: 1 } } })

      expect(zeroResult.data.length).toBe(0)
      expect(oneResult.data.length).toBe(0)
    })

    it('should find multiple exact numeric matches', () => {
      const filter = createFilter<{ size: number }>(testData)
      const result = filter.findMany({ where: { size: { equals: 12 } } })
      expect(result.data.length).toBe(2)
    })

    it('should handle null and undefined filter values for numbers', () => {
      const filter = createFilter<{ size: number }>(testData)
      const nullResult = filter.findMany({ where: { size: { equals: null } } })
      const undefinedResult = filter.findMany({
        where: { size: { equals: undefined } },
      })

      expect(nullResult.data.length).toBe(0)
      expect(undefinedResult.data.length).toBe(0)
    })
  })

  describe('Null and undefined value filtering', () => {
    const testData = [
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 123 },
    ]

    it('should find exact null matches', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({ where: { value: { equals: null } } })
      expect(result.data.length).toBe(1)
    })

    it('should find exact undefined matches', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({
        where: { value: { equals: undefined } },
      })
      expect(result.data.length).toBe(1)
    })

    it('should find exact string matches', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({ where: { value: { equals: 'hello' } } })
      expect(result.data.length).toBe(1)
    })

    it('should find exact number matches', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({ where: { value: { equals: 123 } } })
      expect(result.data.length).toBe(1)
    })
  })
})

describe('EqualityFilter Unit Tests', () => {
  describe('Exact value matching', () => {
    it('should return true for exact string matches', () => {
      const filter = new EqualityFilter('hello')
      expect(filter.evaluate('hello')).toBe(true)
      expect(filter.evaluate('world')).toBe(false)
    })

    it('should return true for exact number matches', () => {
      const filter = new EqualityFilter(123)
      expect(filter.evaluate(123)).toBe(true)
      expect(filter.evaluate(456)).toBe(false)
    })

    it('should return true for exact boolean matches', () => {
      const filter = new EqualityFilter(true)
      expect(filter.evaluate(true)).toBe(true)
      expect(filter.evaluate(false)).toBe(false)
    })
  })

  describe('Null value handling', () => {
    it('should handle null equality correctly', () => {
      const filter = new EqualityFilter(null)
      expect(filter.evaluate(null)).toBe(true)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('hello')).toBe(false)
      expect(filter.evaluate(0)).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })

    it('should handle data being null when filter is not null', () => {
      const filter = new EqualityFilter('hello')
      expect(filter.evaluate(null)).toBe(false)
    })

    it('should handle filter being null when data is not null', () => {
      const filter = new EqualityFilter(null)
      expect(filter.evaluate('hello')).toBe(false)
      expect(filter.evaluate(0)).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })
  })

  describe('Undefined value handling', () => {
    it('should handle undefined equality correctly', () => {
      const filter = new EqualityFilter(undefined)
      expect(filter.evaluate(undefined)).toBe(true)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate('hello')).toBe(false)
      expect(filter.evaluate(0)).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })

    it('should handle data being undefined when filter is not undefined', () => {
      const filter = new EqualityFilter('hello')
      expect(filter.evaluate(undefined)).toBe(false)
    })

    it('should handle filter being undefined when data is not undefined', () => {
      const filter = new EqualityFilter(undefined)
      expect(filter.evaluate('hello')).toBe(false)
      expect(filter.evaluate(0)).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty string values', () => {
      const filter = new EqualityFilter('')
      expect(filter.evaluate('')).toBe(true)
      expect(filter.evaluate('hello')).toBe(false)
    })

    it('should handle zero values', () => {
      const filter = new EqualityFilter(0)
      expect(filter.evaluate(0)).toBe(true)
      expect(filter.evaluate(1)).toBe(false)
    })

    it('should handle false boolean values', () => {
      const filter = new EqualityFilter(false)
      expect(filter.evaluate(false)).toBe(true)
      expect(filter.evaluate(true)).toBe(false)
    })

    it('should handle object references', () => {
      const testObject = { key: 'value' }
      const filter = new EqualityFilter(testObject)
      expect(filter.evaluate(testObject)).toBe(true)
      expect(filter.evaluate({ key: 'value' })).toBe(false)
    })

    it('should handle NaN values correctly', () => {
      const filter = new EqualityFilter(NaN)
      expect(filter.evaluate(NaN)).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate('hello')).toBe(false)
    })

    it('should handle data being NaN when filter is not NaN', () => {
      const filter = new EqualityFilter(123)
      expect(filter.evaluate(NaN)).toBe(false)
    })

    it('should handle filter being NaN when data is not NaN', () => {
      const filter = new EqualityFilter(NaN)
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate('hello')).toBe(false)
    })

    it('should handle case insensitive string comparison', () => {
      const filter = new EqualityFilter('Hello', true)
      expect(filter.evaluate('hello')).toBe(true)
      expect(filter.evaluate('HELLO')).toBe(true)
      expect(filter.evaluate('Hello')).toBe(true)
      expect(filter.evaluate('world')).toBe(false)
    })

    it('should handle date comparison with Date objects', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-01')
      const date3 = new Date('2023-01-02')

      const filter = new EqualityFilter(date1)
      expect(filter.evaluate(date2)).toBe(true)
      expect(filter.evaluate(date3)).toBe(false)
    })

    it('should handle date comparison with string dates', () => {
      const date1 = new Date('2023-01-01')
      const dateString = '2023-01-01'

      const filter = new EqualityFilter(date1)
      expect(filter.evaluate(dateString)).toBe(true)
    })

    it('should handle date comparison with filter as string and data as Date', () => {
      const dateString = '2023-01-01'
      const date1 = new Date('2023-01-01')

      const filter = new EqualityFilter(dateString)
      expect(filter.evaluate(date1)).toBe(true)
    })
  })
})
