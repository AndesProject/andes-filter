import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { EndsWithFilter } from './ends-with-filter'

describe('EndsWithFilter Integration Tests', () => {
  describe('String suffix filtering', () => {
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

    it('should find items ending with the specified suffix', () => {
      const filter = createFilter<{ name: string }>(testData)
      const iceResult = filter.findMany({
        where: { name: { endsWith: 'ice' } },
      })
      const ceratiResult = filter.findMany({
        where: { name: { endsWith: 'Cerati' } },
      })
      const davidResult = filter.findMany({
        where: { name: { endsWith: 'David' } },
      })

      expect(iceResult.data.length).toBe(2)
      expect(ceratiResult.data.length).toBe(1)
      expect(davidResult.data.length).toBe(1)
    })

    it('should return empty results for non-existent suffixes', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { endsWith: 'smi' } } })
      expect(result.data.length).toBe(0)
    })

    it('should not match space-only suffixes', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({ where: { name: { endsWith: ' ' } } })
      expect(result.data.length).toBe(0)
    })

    it('should return null for findUnique with non-existent suffixes', () => {
      const filter = createFilter<{ name: string }>(testData)
      const spaceResult = filter.findUnique({
        where: { name: { endsWith: ' ' } },
      })
      const marianaResult = filter.findUnique({
        where: { name: { endsWith: 'Mariana' } },
      })

      expect(spaceResult).toBe(null)
      expect(marianaResult).toBe(null)
    })

    it('should return first item for findUnique with empty string suffix', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({ where: { name: { endsWith: '' } } })
      expect(result?.name).toBe('Alice')
    })

    it('should return correct item for findUnique with exact suffix matches', () => {
      const filter = createFilter<{ name: string }>(testData)
      const bobResult = filter.findUnique({
        where: { name: { endsWith: 'Bob' } },
      })
      const aliceResult = filter.findUnique({
        where: { name: { endsWith: 'Alice' } },
      })

      expect(bobResult?.name).toBe('Bob')
      expect(aliceResult?.name).toBe('Alice')
    })
  })

  describe('Case insensitive suffix filtering', () => {
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
        where: { name: { endsWith: 'alice', mode: 'insensitive' } },
      })
      const bobResult = filter.findMany({
        where: { name: { endsWith: 'bob', mode: 'insensitive' } },
      })
      const evaResult = filter.findMany({
        where: { name: { endsWith: 'eva', mode: 'insensitive' } },
      })

      expect(aliceResult.data.length).toBe(1)
      expect(bobResult.data.length).toBe(1)
      expect(evaResult.data.length).toBe(1)
    })

    it('should find items with partial case-insensitive suffixes', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { endsWith: 'lie', mode: 'insensitive' } },
      })
      expect(result.data.length).toBe(1)
    })

    it('should return empty results for non-existent case-insensitive suffixes', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findMany({
        where: { name: { endsWith: 'xyz', mode: 'insensitive' } },
      })
      expect(result.data.length).toBe(0)
    })

    it('should return correct item for findUnique with case-insensitive suffix', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({
        where: { name: { endsWith: 'alice', mode: 'insensitive' } },
      })
      expect(result?.name).toBe('Alice')
    })

    it('should return null for findUnique with non-existent case-insensitive suffix', () => {
      const filter = createFilter<{ name: string }>(testData)
      const result = filter.findUnique({
        where: { name: { endsWith: 'xyz', mode: 'insensitive' } },
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

    it('should find string values ending with specified suffixes', () => {
      const filter = createFilter<{ value: any }>(testData)
      const helloResult = filter.findMany({
        where: { value: { endsWith: 'hello' } },
      })
      const worldResult = filter.findMany({
        where: { value: { endsWith: 'world' } },
      })

      expect(helloResult.data.length).toBe(1)
      expect(worldResult.data.length).toBe(1)
    })

    it('should return empty results for non-existent suffixes in mixed data', () => {
      const filter = createFilter<{ value: any }>(testData)
      const result = filter.findMany({ where: { value: { endsWith: 'xyz' } } })
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

    it('should return all items when searching for empty string suffix', () => {
      const filter = createFilter<{ value: string }>(testData)
      const result = filter.findMany({ where: { value: { endsWith: '' } } })
      expect(result.data.length).toBe(4)
    })

    it('should find items ending with the specified suffix', () => {
      const filter = createFilter<{ value: string }>(testData)
      const helloResult = filter.findMany({
        where: { value: { endsWith: 'hello' } },
      })
      const worldResult = filter.findMany({
        where: { value: { endsWith: 'world' } },
      })

      expect(helloResult.data.length).toBe(1)
      expect(worldResult.data.length).toBe(2)
    })

    it('should find items ending with complete phrases', () => {
      const filter = createFilter<{ value: string }>(testData)
      const result = filter.findMany({
        where: { value: { endsWith: 'hello world' } },
      })
      expect(result.data.length).toBe(1)
    })
  })
})

describe('EndsWithFilter Unit Tests', () => {
  describe('String suffix matching', () => {
    it('should return true when string ends with the suffix', () => {
      const filter = new EndsWithFilter('hello')
      expect(filter.evaluate('say hello')).toBe(true)
      expect(filter.evaluate('hello')).toBe(true)
    })

    it('should return false when string does not end with the suffix', () => {
      const filter = new EndsWithFilter('hello')
      expect(filter.evaluate('hello world')).toBe(false)
      expect(filter.evaluate('world')).toBe(false)
      expect(filter.evaluate('')).toBe(false)
    })

    it('should be case sensitive by default', () => {
      const filter = new EndsWithFilter('hello')
      expect(filter.evaluate('HELLO')).toBe(false)
    })
  })

  describe('Case insensitive matching', () => {
    it('should handle case-insensitive mode correctly', () => {
      const filter = new EndsWithFilter('hello', true)
      expect(filter.evaluate('say HELLO')).toBe(true)
      expect(filter.evaluate('say Hello')).toBe(true)
      expect(filter.evaluate('say hello')).toBe(true)
    })

    it('should return false for non-matching strings in case-insensitive mode', () => {
      const filter = new EndsWithFilter('hello', true)
      expect(filter.evaluate('WORLD')).toBe(false)
    })
  })

  describe('Null and undefined handling', () => {
    it('should handle null and undefined values', () => {
      const filter = new EndsWithFilter('hello')
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
    })
  })

  describe('Non-string type handling', () => {
    it('should handle non-string data types', () => {
      const filter = new EndsWithFilter('hello')
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate({})).toBe(false)
      expect(filter.evaluate([])).toBe(false)
      expect(filter.evaluate(true)).toBe(false)
    })
  })

  describe('Empty string handling', () => {
    it('should handle empty string filters', () => {
      const filter = new EndsWithFilter('')
      expect(filter.evaluate('hello')).toBe(true)
      expect(filter.evaluate('')).toBe(true)
      expect(filter.evaluate('world')).toBe(true)
    })
  })
})
