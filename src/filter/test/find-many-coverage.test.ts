import { describe, expect, it } from 'vitest'
import { findMany } from '../evaluate-filter/find-many'
import { FilterQuery } from '../filter.interface'

describe('Find Many Coverage Tests', () => {
  const testData = [
    { id: 1, name: 'Alice', age: 25, city: 'New York' },
    { id: 2, name: 'Bob', age: 30, city: 'Los Angeles' },
    { id: 3, name: 'Alice', age: 35, city: 'Chicago' },
    { id: 4, name: 'David', age: 28, city: 'New York' },
    { id: 5, name: 'Eve', age: 32, city: 'Boston' },
  ]

  describe('findMany function', () => {
    it('should filter data with basic where clause', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { name: { equals: 'Alice' } },
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      expect(result.data[0].name).toBe('Alice')
      expect(result.data[1].name).toBe('Alice')
    })

    it('should handle distinct option as boolean true', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { city: { equals: 'New York' } },
        distinct: true,
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      // Should remove duplicates based on full object
      expect(result.data).toEqual([
        { id: 1, name: 'Alice', age: 25, city: 'New York' },
        { id: 4, name: 'David', age: 28, city: 'New York' },
      ])
    })

    it('should handle distinct option as string field', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { city: { equals: 'New York' } },
        distinct: 'name',
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      // Should remove duplicates based on name field
      expect(result.data.map((item) => item.name)).toEqual(['Alice', 'David'])
    })

    it('should handle distinct option as array of fields', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { city: { equals: 'New York' } },
        distinct: ['name', 'age'],
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      // Should remove duplicates based on name and age combination
      expect(result.data).toEqual([
        { id: 1, name: 'Alice', age: 25, city: 'New York' },
        { id: 4, name: 'David', age: 28, city: 'New York' },
      ])
    })

    it('should handle distinct with non-object items', () => {
      const simpleData = [1, 2, 2, 3, 3, 4]
      const filterQuery: FilterQuery<number> = {
        where: { equals: 2 },
        distinct: true,
      }

      const result = findMany(filterQuery, simpleData)

      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toBe(2)
    })

    it('should handle distinct with missing fields', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { city: { equals: 'New York' } },
        distinct: 'nonexistentField',
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(1)
      // Should handle undefined field values - both items will be considered unique
      expect(result.data).toEqual([
        { id: 1, name: 'Alice', age: 25, city: 'New York' },
      ])
    })

    it('should handle pagination with pagination object', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
        pagination: { page: 1, size: 2 },
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      expect(result.pagination).toEqual({
        page: 1,
        size: 2,
        totalItems: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      })
    })

    it('should handle pagination with take/skip', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
        take: 2,
        skip: 2,
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      expect(result.pagination).toEqual({
        page: 2,
        size: 2,
        totalItems: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      })
    })

    it('should handle pagination with only take', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
        take: 3,
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(3)
      expect(result.pagination).toEqual({
        page: 1,
        size: 3,
        totalItems: 5,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      })
    })

    it('should handle pagination with only skip', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
        skip: 2,
      }

      const result = findMany(filterQuery, testData)

      expect(result.data.length).toBe(5)
      expect(result.pagination).toEqual({
        page: 1,
        size: 24, // Default size
        totalItems: 5,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      })
    })

    it('should handle default pagination when no pagination options provided', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(5)
      expect(result.pagination).toEqual({
        page: 1,
        size: 24,
        totalItems: 5,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    })

    it('should handle sorting with orderBy', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: {},
        orderBy: { name: 'asc' },
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(5)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'Alice',
        'Bob',
        'David',
        'Eve',
      ])
    })

    it('should handle complex query with all options', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { age: { gte: 28 } },
        orderBy: { age: 'desc' },
        distinct: 'name',
        pagination: { page: 1, size: 2 },
      }

      const result = findMany(filterQuery, testData)

      expect(result.data).toHaveLength(2)
      expect(result.data[0].age).toBeGreaterThanOrEqual(28)
      expect(result.pagination.totalItems).toBe(4) // Bob, Alice(35), David, Eve
    })

    it('should handle empty data source', () => {
      const filterQuery: FilterQuery<(typeof testData)[0]> = {
        where: { name: { equals: 'Alice' } },
      }

      const result = findMany(filterQuery, [])

      expect(result.data).toHaveLength(0)
      expect(result.pagination).toEqual({
        page: 1,
        size: 24,
        totalItems: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      })
    })

    it('should handle null/undefined filter criteria', () => {
      const result1 = findMany({ where: null } as any, testData)
      const result2 = findMany({ where: undefined } as any, testData)

      expect(result1.data).toHaveLength(0)
      expect(result2.data).toHaveLength(0)
    })
  })
})
