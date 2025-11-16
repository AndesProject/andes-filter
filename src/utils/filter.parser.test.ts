import { describe, expect, it } from 'vitest'
import { FilterQuery } from '../filter/filter.interface'
import { queryFilterToUrlParams, urlParamsToQueryFilter } from './filter.parser'

describe('filter.parser', () => {
  describe('queryFilterToUrlParams', () => {
    it('should convert filter query to URL params', () => {
      const filterQuery: FilterQuery<{ name: string; age: number }> = {
        where: {
          name: { equals: 'John' },
          age: { gte: 25 },
        },
      }

      const result = queryFilterToUrlParams(filterQuery)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty filter query', () => {
      const filterQuery: FilterQuery<{ name: string }> = {
        where: {},
      }

      const result = queryFilterToUrlParams(filterQuery)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle complex nested filters', () => {
      const filterQuery: FilterQuery<{
        profile: { name: string; age: number }
      }> = {
        where: {
          profile: {
            some: {
              name: { equals: 'John' },
              age: { gte: 25 },
            },
          },
        },
      }

      const result = queryFilterToUrlParams(filterQuery)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('urlParamsToQueryFilter', () => {
    it('should convert URL params back to filter query', () => {
      const originalFilter: FilterQuery<{ name: string; age: number }> = {
        where: {
          name: { equals: 'John' },
          age: { gte: 25 },
        },
      }

      const encoded = queryFilterToUrlParams(originalFilter)
      const decoded = urlParamsToQueryFilter<{ name: string; age: number }>(
        encoded,
      )

      expect(decoded).toEqual(originalFilter)
    })

    it('should handle empty filter query', () => {
      const originalFilter: FilterQuery<{ name: string }> = {
        where: {},
      }

      const encoded = queryFilterToUrlParams(originalFilter)
      const decoded = urlParamsToQueryFilter<{ name: string }>(encoded)

      expect(decoded).toEqual(originalFilter)
    })

    it('should return default filter when decoding invalid string', () => {
      const result = urlParamsToQueryFilter<{ name: string }>('invalid-base64')

      expect(result).toEqual({ where: {} })
    })

    it('should return default filter when JSON is invalid', () => {
      const invalidJson = btoa('{ invalid json }')
      const result = urlParamsToQueryFilter<{ name: string }>(invalidJson)

      expect(result).toEqual({ where: {} })
    })

    it('should return default filter when missing where property', () => {
      const filterWithoutWhere = { someOtherProperty: 'value' }
      const encoded = btoa(JSON.stringify(filterWithoutWhere))
      const result = urlParamsToQueryFilter<{ name: string }>(encoded)

      expect(result).toEqual({ where: {} })
    })

    it('should handle complex nested filters round trip', () => {
      const originalFilter: FilterQuery<{
        profile: { name: string; age: number }
      }> = {
        where: {
          profile: {
            some: {
              name: { equals: 'John' },
              age: { gte: 25 },
            },
          },
        },
      }

      const encoded = queryFilterToUrlParams(originalFilter)
      const decoded = urlParamsToQueryFilter<{
        profile: { name: string; age: number }
      }>(encoded)

      expect(decoded).toEqual(originalFilter)
    })
  })
})
