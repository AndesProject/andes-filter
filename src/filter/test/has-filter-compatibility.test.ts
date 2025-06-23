import { describe, expect, it } from 'vitest'
import { HasFilter } from '../evaluate-filter/has-filter/has-filter'
import { createFilterEngine } from '../filter-from'
describe('HasFilter Prisma/TypeORM Compatibility', () => {
  describe('Basic behavior', () => {
    it('should return true when array contains the element', () => {
      const filter = new HasFilter(2)
      expect(filter.evaluate([1, 2, 3])).toBe(true)
      expect(filter.evaluate([2])).toBe(true)
    })
    it('should return false when array does not contain the element', () => {
      const filter = new HasFilter(10)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
      expect(filter.evaluate([4, 5, 6])).toBe(false)
    })
    it('should return false for empty arrays', () => {
      const filter = new HasFilter(2)
      expect(filter.evaluate([])).toBe(false)
    })
    it('should return false for non-array inputs', () => {
      const filter = new HasFilter(2)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate({})).toBe(false)
    })
  })
  describe('Primitive types', () => {
    it('should work with numbers', () => {
      const filter = new HasFilter(42)
      expect(filter.evaluate([1, 42, 3])).toBe(true)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
    })
    it('should work with strings', () => {
      const filter = new HasFilter('javascript')
      expect(filter.evaluate(['javascript', 'typescript'])).toBe(true)
      expect(filter.evaluate(['python', 'java'])).toBe(false)
    })
    it('should work with booleans', () => {
      const filter = new HasFilter(true)
      expect(filter.evaluate([true, false])).toBe(true)
      expect(filter.evaluate([false, false])).toBe(false)
    })
    it('should work with null values', () => {
      const filter = new HasFilter(null)
      expect(filter.evaluate([1, null, 3])).toBe(true)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
    })
    it('should work with undefined values', () => {
      const filter = new HasFilter(undefined)
      expect(filter.evaluate([1, undefined, 3])).toBe(true)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
    })
  })
  describe('Object references', () => {
    it('should work with object references (strict equality)', () => {
      const targetObject = { id: 1, name: 'Alice' }
      const filter = new HasFilter(targetObject)
      expect(filter.evaluate([targetObject, { id: 2, name: 'Bob' }])).toBe(true)
      expect(
        filter.evaluate([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ])
      ).toBe(false)
    })
    it('should work with nested objects', () => {
      const targetObject = { user: { id: 1, name: 'Alice' } }
      const filter = new HasFilter(targetObject)
      expect(
        filter.evaluate([targetObject, { user: { id: 2, name: 'Bob' } }])
      ).toBe(true)
      expect(
        filter.evaluate([
          { user: { id: 1, name: 'Alice' } },
          { user: { id: 2, name: 'Bob' } },
        ])
      ).toBe(false)
    })
  })
  describe('Edge cases', () => {
    it('should handle arrays with mixed types', () => {
      const filter = new HasFilter(2)
      expect(filter.evaluate([1, '2', 3])).toBe(false)
      expect(filter.evaluate([1, 2, '3'])).toBe(true)
    })
    it('should handle arrays with null/undefined elements', () => {
      const filter = new HasFilter(2)
      expect(filter.evaluate([1, null, 2, 3])).toBe(true)
      expect(filter.evaluate([1, undefined, 2, 3])).toBe(true)
      expect(filter.evaluate([1, null, 3])).toBe(false)
    })
    it('should handle NaN values', () => {
      const filter = new HasFilter(NaN)
      expect(filter.evaluate([1, NaN, 3])).toBe(true)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
    })
    it('should handle zero values', () => {
      const filter = new HasFilter(0)
      expect(filter.evaluate([1, 0, 3])).toBe(true)
      expect(filter.evaluate([1, 2, 3])).toBe(false)
    })
    it('should handle empty strings', () => {
      const filter = new HasFilter('')
      expect(filter.evaluate(['hello', '', 'world'])).toBe(true)
      expect(filter.evaluate(['hello', 'world'])).toBe(false)
    })
  })
  describe('Integration tests with createFilterEngine', () => {
    it('should work with number arrays', () => {
      const filter = createFilterEngine<{ items: number[] }>([
        { items: [1, 2, 3] },
        { items: [4, 5, 6] },
        { items: [7, 8, 9] },
        { items: [] },
      ])
      expect(
        filter.findMany({ where: { items: { has: 2 } } }).data.length
      ).toBe(1)
      expect(
        filter.findMany({ where: { items: { has: 10 } } }).data.length
      ).toBe(0)
      expect(
        filter.findMany({ where: { items: { has: 1 } } }).data.length
      ).toBe(1)
    })
    it('should work with string arrays', () => {
      const filter = createFilterEngine<{ tags: string[] }>([
        { tags: ['javascript', 'typescript'] },
        { tags: ['python', 'java'] },
        { tags: ['javascript', 'react'] },
        { tags: [] },
      ])
      expect(
        filter.findMany({ where: { tags: { has: 'javascript' } } }).data.length
      ).toBe(2)
      expect(
        filter.findMany({ where: { tags: { has: 'python' } } }).data.length
      ).toBe(1)
      expect(
        filter.findMany({ where: { tags: { has: 'c++' } } }).data.length
      ).toBe(0)
    })
    it('should work with boolean arrays', () => {
      const filter = createFilterEngine<{ flags: boolean[] }>([
        { flags: [true, false] },
        { flags: [false, false] },
        { flags: [] },
      ])
      expect(
        filter.findMany({ where: { flags: { has: true } } }).data.length
      ).toBe(1)
      expect(
        filter.findMany({ where: { flags: { has: false } } }).data.length
      ).toBe(2)
    })
    it('should work with object arrays', () => {
      const targetObject = { id: 1, name: 'Alice' }
      const filter = createFilterEngine<{
        users: { id: number; name: string }[]
      }>([
        { users: [targetObject, { id: 2, name: 'Bob' }] },
        {
          users: [
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'David' },
          ],
        },
        { users: [] },
      ])
      expect(
        filter.findMany({ where: { users: { has: targetObject } } }).data.length
      ).toBe(1)
      expect(
        filter.findMany({
          where: { users: { has: { id: 1, name: 'Alice' } } },
        }).data.length
      ).toBe(0)
    })
    it('should handle null and undefined arrays', () => {
      const filter = createFilterEngine<{ items: any }>([
        { items: [1, 2, 3] },
        { items: null },
        { items: undefined },
        { items: [] },
      ])
      expect(
        filter.findMany({ where: { items: { has: 1 } } }).data.length
      ).toBe(1)
      expect(
        filter.findMany({ where: { items: { has: 2 } } }).data.length
      ).toBe(1)
    })
  })
  describe('Complex scenarios', () => {
    it('should handle nested arrays', () => {
      const targetArray = [1, 2]
      const filter = new HasFilter(targetArray)
      expect(filter.evaluate([targetArray, [3, 4]])).toBe(true)
      expect(
        filter.evaluate([
          [1, 2],
          [3, 4],
        ])
      ).toBe(false)
    })
    it('should handle functions', () => {
      const testFunc = () => {}
      const filter = new HasFilter(testFunc)
      expect(filter.evaluate([testFunc, () => {}])).toBe(true)
      expect(filter.evaluate([() => {}, () => {}])).toBe(false)
    })
    it('should handle symbols', () => {
      const testSymbol = Symbol('test')
      const filter = new HasFilter(testSymbol)
      expect(filter.evaluate([testSymbol, Symbol('other')])).toBe(true)
      expect(filter.evaluate([Symbol('other'), Symbol('another')])).toBe(false)
    })
  })
})
