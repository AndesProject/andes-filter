import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { ContainsFilter } from './contains-filter'

describe('ContainsFilter Integration Tests', () => {
  describe('String substring filtering', () => {
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
      { name: 'Gustavo Cerati' },
    ]

    it('should find items containing the specified substring', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { contains: 'Cerati' } },
      })
      expect(result.data.length).toBe(1)
    })

    it('should find items containing exact name matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: 'Bob' } } })
      expect(result.data.length).toBe(1)
    })

    it('should return empty results for non-existent substrings', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { contains: 'Mariana' } },
      })
      expect(result.data.length).toBe(0)
    })

    it('should find multiple items containing the same substring', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: 'Alice' } } })
      expect(result.data.length).toBe(2)
    })

    it('should be case sensitive for substring matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: 'eva' } } })
      expect(result.data.length).toBe(0)
    })

    it('should find items containing partial substrings', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: 'ank' } } })
      expect(result.data.length).toBe(1)
    })

    it('should find items containing space characters', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: ' ' } } })
      expect(result.data.length).toBe(1)
    })

    it('should return all items when searching for empty string', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { contains: '' } } })
      expect(result.data.length).toBe(12)
    })

    it('should return correct item for findUnique with space-containing names', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({ where: { name: { contains: ' ' } } })
      expect(result?.name).toBe('Gustavo Cerati')
    })

    it('should return first item for findUnique with empty string search', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({ where: { name: { contains: '' } } })
      expect(result?.name).toBe('Alice')
    })

    it('should return null for findUnique with non-existent substrings', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({
        where: { name: { contains: 'Mariana' } },
      })
      expect(result).toBe(null)
    })

    it('should return correct item for findUnique with exact substring matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const bobResult = filter.findUnique({
        where: { name: { contains: 'Bob' } },
      })
      const aliceResult = filter.findUnique({
        where: { name: { contains: 'Alice' } },
      })

      expect(bobResult?.name).toBe('Bob')
      expect(aliceResult?.name).toBe('Alice')
    })
  })

  describe('Case insensitive substring filtering', () => {
    const testData = [
      { name: 'Alice' },
      { name: 'BOB' },
      { name: 'Charlie' },
      { name: 'david' },
      { name: 'EVA' },
    ]

    it('should find items regardless of case when using insensitive mode', () => {
      const filter = createFilter<{ name: string }>(testData)
      const aliceResult = filter.findMany({
        where: { name: { contains: 'alice', mode: 'insensitive' } },
      })
      const bobResult = filter.findMany({
        where: { name: { contains: 'bob', mode: 'insensitive' } },
      })
      const evaResult = filter.findMany({
        where: { name: { contains: 'EVA', mode: 'insensitive' } },
      })

      expect(aliceResult.data.length).toBe(1)
      expect(bobResult.data.length).toBe(1)
      expect(evaResult.data.length).toBe(1)
    })

    it('should find items with partial case-insensitive matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { contains: 'char', mode: 'insensitive' } },
      })
      expect(result.data.length).toBe(1)
    })

    it('should return empty results for non-existent case-insensitive searches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { contains: 'xyz', mode: 'insensitive' } },
      })
      expect(result.data.length).toBe(0)
    })

    it('should return correct item for findUnique with case-insensitive search', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({
        where: { name: { contains: 'alice', mode: 'insensitive' } },
      })
      expect(result?.name).toBe('Alice')
    })

    it('should return null for findUnique with non-existent case-insensitive search', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({
        where: { name: { contains: 'xyz', mode: 'insensitive' } },
      })
      expect(result).toBe(null)
    })
  })

  describe('Null and undefined value handling', () => {
    const testData = [
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ]

    it('should find string values containing specified substrings', () => {
      const filter = createFilter<{ value: any }>(testData)
      const helloResult = filter.findMany({
        where: { value: { contains: 'hello' } },
      })
      const worldResult = filter.findMany({
        where: { value: { contains: 'world' } },
      })

      expect(helloResult.data.length).toBe(1)
      expect(worldResult.data.length).toBe(1)
    })

    it('should return empty results for non-existent substrings in mixed data', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({ where: { value: { contains: 'xyz' } } })
      expect(result.data.length).toBe(0)
    })
  })

  describe('Empty strings and special cases', () => {
    const testData = [
      { value: '' },
      { value: 'hello' },
      { value: 'world' },
      { value: 'hello world' },
    ]

    it('should return all items when searching for empty string', () => {
      const filter = createFilter<{ value: string }>(testData)
      const result = filter.findMany({ where: { value: { contains: '' } } })
      expect(result.data.length).toBe(4)
    })

    it('should find items containing the specified substring', () => {
      const filter = createFilter<{ value: string }>(testData)
      const helloResult = filter.findMany({
        where: { value: { contains: 'hello' } },
      })
      const worldResult = filter.findMany({
        where: { value: { contains: 'world' } },
      })

      expect(helloResult.data.length).toBe(2)
      expect(worldResult.data.length).toBe(2)
    })

    it('should find items containing complete phrases', () => {
      const filter = createFilter<{ value: string }>(testData)
      const result = filter.findMany({
        where: { value: { contains: 'hello world' } },
      })
      expect(result.data.length).toBe(1)
    })
  })
})

describe('ContainsFilter Unit Tests', () => {
  describe('String substring matching', () => {
    it('should return true when string contains the substring', () => {
      const filter = new ContainsFilter('hello')
      expect(filter.evaluate('hello world')).toBe(true)
      expect(filter.evaluate('world hello')).toBe(true)
      expect(filter.evaluate('hello')).toBe(true)
    })

    it('should return false when string does not contain the substring', () => {
      const filter = new ContainsFilter('hello')
      expect(filter.evaluate('world')).toBe(false)
      expect(filter.evaluate('bye')).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })

    it('should be case sensitive by default', () => {
      const filter = new ContainsFilter('hello')
      expect(filter.evaluate('HELLO')).toBe(false)
    })
  })

  describe('Case insensitive matching', () => {
    it('should handle case-insensitive mode correctly', () => {
      const filter = new ContainsFilter('hello', true)
      expect(filter.evaluate('HELLO WORLD')).toBe(true)
      expect(filter.evaluate('Hello World')).toBe(true)
      expect(filter.evaluate('hello world')).toBe(true)
    })

    it('should return false for non-matching strings in case-insensitive mode', () => {
      const filter = new ContainsFilter('hello', true)
      expect(filter.evaluate('WORLD')).toBe(false)
    })
  })

  describe('Null and undefined handling', () => {
    it('should handle null and undefined values', () => {
      const filter = new ContainsFilter('hello')
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
    })
  })

  describe('Non-string type handling', () => {
    it('should handle non-string data types', () => {
      const filter = new ContainsFilter('hello')
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate({})).toBe(false)
      expect(filter.evaluate([])).toBe(false)
      expect(filter.evaluate(true)).toBe(false)
    })
  })

  describe('Empty string handling', () => {
    it('should handle empty string filters', () => {
      const filter = new ContainsFilter('')
      expect(filter.evaluate('hello')).toBe(true)
      expect(filter.evaluate('')).toBe(true)
      expect(filter.evaluate('world')).toBe(true)
    })
  })
})
