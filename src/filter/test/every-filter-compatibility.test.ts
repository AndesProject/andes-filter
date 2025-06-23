import { describe, expect, it } from 'vitest'
import { EveryFilter } from '../evaluate-filter/every-filter/every-filter'
import { createFilterEngine } from '../filter-from'

describe('EveryFilter Prisma/TypeORM Compatibility', () => {
  describe('Basic behavior', () => {
    it('should return true for empty arrays (vacuous truth)', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate([])).toBe(true)
    })

    it('should return false for non-array inputs', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate({})).toBe(false)
    })

    it('should return true when all elements match primitive filter', () => {
      const filter = new EveryFilter(5)
      expect(filter.evaluate([5, 5, 5])).toBe(true)
      expect(filter.evaluate([5, 5, 4])).toBe(false)
    })

    it('should return true when all elements match operator filter', () => {
      const filter = new EveryFilter({ equals: 2 })
      expect(filter.evaluate([2, 2, 2])).toBe(true)
      expect(filter.evaluate([2, 2, 3])).toBe(false)
    })
  })

  describe('Empty filter behavior', () => {
    it('should return true for empty filter on array of objects', () => {
      const filter = new EveryFilter({})
      expect(filter.evaluate([{ a: 1 }, { b: 2 }])).toBe(true)
      expect(filter.evaluate([{ x: 1 }, { y: 2 }, { z: 3 }])).toBe(true)
    })

    it('should return true for empty filter on array of primitives', () => {
      const filter = new EveryFilter({})
      expect(filter.evaluate([1, 2, 3])).toBe(true)
      expect(filter.evaluate(['a', 'b', 'c'])).toBe(true)
    })

    it('should return true for empty filter on mixed array', () => {
      const filter = new EveryFilter({})
      expect(filter.evaluate([1, 'a', { x: 1 }])).toBe(true)
    })
  })

  describe('Null and undefined handling', () => {
    it('should return false if any element is null', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate([1, 1, null])).toBe(false)
    })

    it('should return false if any element is undefined', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate([1, undefined, 1])).toBe(false)
    })

    it('should handle null/undefined in object arrays', () => {
      const filter = new EveryFilter({ a: 1 })
      expect(filter.evaluate([{ a: 1 }, null, { a: 1 }])).toBe(false)
      expect(filter.evaluate([{ a: 1 }, undefined, { a: 1 }])).toBe(false)
    })
  })

  describe('Object filtering', () => {
    it('should match objects with exact properties', () => {
      const filter = new EveryFilter({ a: 1, b: 2 })
      expect(
        filter.evaluate([
          { a: 1, b: 2 },
          { a: 1, b: 2 },
        ])
      ).toBe(true)
      expect(
        filter.evaluate([
          { a: 1, b: 2 },
          { a: 1, b: 3 }, // Different value for 'b'
        ])
      ).toBe(false)
    })

    it('should handle nested object filters', () => {
      const filter = new EveryFilter({ a: { equals: 1 } })
      expect(filter.evaluate([{ a: 1 }, { a: 1 }])).toBe(true)
      expect(filter.evaluate([{ a: 1 }, { a: 2 }])).toBe(false)
    })
  })

  describe('Operator filters', () => {
    it('should handle comparison operators', () => {
      const filter = new EveryFilter({ gt: 0 })
      expect(filter.evaluate([1, 2, 3])).toBe(true)
      expect(filter.evaluate([1, 0, 3])).toBe(false)
    })

    it('should handle string operators', () => {
      const filter = new EveryFilter({ contains: 'test' })
      expect(filter.evaluate(['test', 'testing', 'contest'])).toBe(true)
      expect(filter.evaluate(['test', 'hello', 'contest'])).toBe(false)
    })

    it('should handle regex operators', () => {
      const filter = new EveryFilter({ regex: '^test' })
      expect(filter.evaluate(['test', 'testing', 'test123'])).toBe(true)
      expect(filter.evaluate(['test', 'hello', 'test123'])).toBe(false)
    })
  })

  describe('Integration tests with createFilterEngine', () => {
    it('should work with primitive arrays', () => {
      const filter = createFilterEngine<{ arr: number[] }>([
        { arr: [1, 1, 1] },
        { arr: [1, 2, 1] },
        { arr: [2, 2, 2] },
        { arr: [] },
      ])

      // Empty array should pass (vacuous truth)
      expect(
        filter.findMany({ where: { arr: { every: { equals: 1 } } } }).data
          .length
      ).toBe(2) // [1,1,1] and []

      expect(
        filter.findMany({ where: { arr: { every: { equals: 2 } } } }).data
          .length
      ).toBe(2) // [2,2,2] and []
    })

    it('should work with object arrays', () => {
      const filter = createFilterEngine<{ arr: { a: number }[] }>([
        { arr: [{ a: 1 }, { a: 1 }] },
        { arr: [{ a: 1 }, { a: 2 }] },
        { arr: [{ a: 2 }, { a: 2 }] },
        { arr: [] },
      ])

      expect(
        filter.findMany({
          where: { arr: { every: { a: { equals: 1 } } } } as any,
        }).data.length
      ).toBe(2) // [{a:1}, {a:1}] and []

      expect(
        filter.findMany({
          where: { arr: { every: { a: { equals: 2 } } } } as any,
        }).data.length
      ).toBe(2) // [{a:2}, {a:2}] and []
    })

    it('should handle empty filters correctly', () => {
      const filter = createFilterEngine<{ arr: { x: number }[] }>([
        { arr: [{ x: 1 }, { x: 2 }] },
        { arr: [{ x: 3 }] },
        { arr: [] },
      ])

      // Empty filter should pass for all arrays
      expect(
        filter.findMany({ where: { arr: { every: {} } } }).data.length
      ).toBe(3)
    })

    it('should handle empty filters with primitive arrays', () => {
      const filter = createFilterEngine<{ arr: number[] }>([
        { arr: [1, 2, 3] },
        { arr: [4, 5, 6] },
        { arr: [] },
      ])

      // Empty filter should pass for all arrays
      expect(
        filter.findMany({ where: { arr: { every: {} } } }).data.length
      ).toBe(3)
    })
  })

  describe('Complex scenarios', () => {
    it('should handle mixed data types', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate([1, 1, 1])).toBe(true)
      expect(filter.evaluate([1, '1', 1])).toBe(false) // String '1' !== number 1
    })

    it('should handle arrays with null/undefined elements', () => {
      const filter = new EveryFilter({ equals: 1 })
      expect(filter.evaluate([1, 1, 1])).toBe(true)
      expect(filter.evaluate([1, null, 1])).toBe(false)
      expect(filter.evaluate([1, undefined, 1])).toBe(false)
    })

    it('should handle regex with flags', () => {
      const filter = new EveryFilter({ regex: { pattern: 'test', flags: 'i' } })
      expect(filter.evaluate(['TEST', 'Test', 'test'])).toBe(true)
      expect(filter.evaluate(['TEST', 'hello', 'test'])).toBe(false)
    })
  })
})
