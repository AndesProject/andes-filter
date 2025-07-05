import { describe, expect, it } from 'vitest'
import { createFilterInstance } from '../evaluate-filter/evaluate-filter.service'
import { FilterCriteria } from '../filter.interface'

describe('createFilterInstance', () => {
  it('should create filter instance and evaluate successfully', () => {
    const filterKeys: FilterCriteria<
      { name: string; age: number },
      'name' | 'age'
    > = {
      name: { equals: 'John' },
      age: { gte: 25 },
    }

    const value = { name: 'John', age: 30 }
    const result = createFilterInstance(filterKeys, value)

    expect(result).toBe(true)
  })

  it('should return false when filter evaluation fails', () => {
    const filterKeys: FilterCriteria<
      { name: string; age: number },
      'name' | 'age'
    > = {
      name: { equals: 'John' },
      age: { gte: 25 },
    }

    const value = { name: 'Jane', age: 20 }
    const result = createFilterInstance(filterKeys, value)

    expect(result).toBe(false)
  })

  it('should handle complex nested filters', () => {
    const filterKeys: FilterCriteria<
      { profile: { name: string; age: number } },
      'profile'
    > = {
      profile: {
        some: {
          name: { equals: 'John' },
          age: { gte: 25 },
        },
      },
    }

    const value = {
      profile: [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ],
    }
    const result = createFilterInstance(filterKeys, value)

    expect(result).toBe(true)
  })

  it('should handle empty filter criteria', () => {
    const filterKeys: FilterCriteria<{ name: string }, 'name'> = {}
    const value = { name: 'John' }
    const result = createFilterInstance(filterKeys, value)

    expect(result).toBe(true)
  })

  it('should handle null and undefined values', () => {
    const filterKeys: FilterCriteria<{ name: string | null }, 'name'> = {
      name: { equals: null },
    }

    const value1 = { name: null }
    const value2 = { name: undefined }
    const value3 = { name: 'John' }

    expect(createFilterInstance(filterKeys, value1)).toBe(true)
    expect(createFilterInstance(filterKeys, value2)).toBe(false)
    expect(createFilterInstance(filterKeys, value3)).toBe(false)
  })
})
