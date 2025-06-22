import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { OrFilterGroup } from './or-filter-group'

describe('OrFilterGroup', () => {
  it('should evaluate as true when any filter passes', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { id: { equals: 1 } },
          { name: { contains: 'test2' } },
          { active: { equals: false } },
        ],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data).toEqual([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
    ])
  })

  it('should return empty array when no conditions match', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { id: { equals: 999 } },
          { name: { contains: 'nonexistent' } },
          { active: { equals: null } },
        ],
      } as any,
    })

    expect(result.data.length).toBe(0)
  })

  it('should work with different filter types', () => {
    const filter = filterFrom<{
      id: number
      name: string
      email: string
      age: number
      tags: string[]
    }>([
      {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        age: 25,
        tags: ['dev', 'admin'],
      },
      { id: 2, name: 'Jane', email: 'jane@test.com', age: 30, tags: ['dev'] },
      { id: 3, name: 'Bob', email: 'bob@test.com', age: 25, tags: ['admin'] },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { age: { gte: 30 } },
          { email: { contains: 'john' } },
          { tags: { has: 'admin' } },
          { name: { equals: 'Bob' } },
        ],
      } as any,
    })

    expect(result.data.length).toBe(3)
    expect(result.data.map((x) => x.name)).toEqual(['John', 'Jane', 'Bob'])
  })

  it('should work with nested OR conditions', () => {
    const filter = filterFrom<{
      id: number
      name: string
      category: string
      active: boolean
    }>([
      { id: 1, name: 'Product A', category: 'electronics', active: true },
      { id: 2, name: 'Product B', category: 'electronics', active: false },
      { id: 3, name: 'Product C', category: 'clothing', active: true },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { category: { equals: 'electronics' } },
          {
            OR: [
              { active: { equals: true } },
              { name: { contains: 'Product' } },
            ],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(3)
    expect(result.data.map((x) => x.name)).toEqual([
      'Product A',
      'Product B',
      'Product C',
    ])
  })

  it('should work with AND conditions inside OR', () => {
    const filter = filterFrom<{
      id: number
      name: string
      category: string
      price: number
    }>([
      { id: 1, name: 'Product A', category: 'electronics', price: 100 },
      { id: 2, name: 'Product B', category: 'clothing', price: 50 },
      { id: 3, name: 'Product C', category: 'electronics', price: 200 },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { category: { equals: 'electronics' } },
          {
            AND: [{ price: { lt: 100 } }, { name: { contains: 'Product' } }],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(3)
    expect(result.data.map((x) => x.name)).toEqual([
      'Product A',
      'Product B',
      'Product C',
    ])
  })

  it('should handle empty OR array', () => {
    const filter = filterFrom<{ id: number; name: string }>([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ])

    const result = filter.findMany({
      where: {
        OR: [],
      } as any,
    })

    expect(result.data.length).toBe(0)
  })

  it('should work with findUnique', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findUnique({
      where: {
        OR: [{ id: { equals: 2 } }, { active: { equals: true } }],
      } as any,
    })

    expect(result).toEqual({ id: 1, name: 'test1', active: true })
  })

  it('should return null when findUnique has no matches', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
    ])

    const result = filter.findUnique({
      where: {
        OR: [{ id: { equals: 999 } }, { active: { equals: null } }],
      } as any,
    })

    expect(result).toBe(null)
  })

  it('should work with complex nested conditions', () => {
    const filter = filterFrom<{
      id: number
      name: string
      category: string
      price: number
      tags: string[]
    }>([
      {
        id: 1,
        name: 'Laptop',
        category: 'electronics',
        price: 1000,
        tags: ['premium', 'new'],
      },
      {
        id: 2,
        name: 'Phone',
        category: 'electronics',
        price: 500,
        tags: ['premium'],
      },
      { id: 3, name: 'Book', category: 'books', price: 20, tags: ['new'] },
    ])

    const result = filter.findMany({
      where: {
        OR: [
          { category: { equals: 'electronics' } },
          { price: { lt: 100 } },
          {
            AND: [
              { tags: { has: 'premium' } },
              { name: { contains: 'Laptop' } },
            ],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(3)
    expect(result.data.map((x) => x.name)).toEqual(['Laptop', 'Phone', 'Book'])
  })

  it('should handle null and undefined values in conditions', () => {
    const filter = filterFrom<{
      id: number
      name: string | null
      email: string | undefined
    }>([
      { id: 1, name: null, email: 'test1@example.com' },
      { id: 2, name: 'test2', email: undefined },
      { id: 3, name: 'test3', email: 'test3@example.com' },
    ])

    const result = filter.findMany({
      where: {
        OR: [{ name: { isNull: true } }, { email: { isNull: true } }],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data.map((x) => x.id)).toEqual([1, 2])
  })

  it('should work with single condition', () => {
    const filter = filterFrom<{ id: number; name: string }>([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ])

    const result = filter.findMany({
      where: {
        OR: [{ id: { equals: 2 } }],
      } as any,
    })

    expect(result.data.length).toBe(1)
    expect(result.data[0].id).toBe(2)
  })
})

describe('OrFilterGroup class', () => {
  it('should return false for empty filter array', () => {
    const filter = new OrFilterGroup([])
    expect(filter.evaluate({ id: 1, name: 'test' })).toBe(false)
  })

  it('should return true when any condition is met', () => {
    const filter = new OrFilterGroup<any>([
      { id: { equals: 1 } } as any,
      { name: { contains: 'test' } } as any,
    ])
    expect(filter.evaluate({ id: 1, name: 'other' })).toBe(true)
    expect(filter.evaluate({ id: 2, name: 'test' })).toBe(true)
  })

  it('should return false when no condition is met', () => {
    const filter = new OrFilterGroup<any>([
      { id: { equals: 1 } } as any,
      { name: { contains: 'test' } } as any,
    ])
    expect(filter.evaluate({ id: 2, name: 'other' })).toBe(false)
  })

  it('should handle complex nested conditions', () => {
    const filter = new OrFilterGroup<any>([
      { id: { gte: 1 } } as any,
      {
        OR: [
          { name: { contains: 'test' } } as any,
          { active: { equals: true } } as any,
        ],
      } as any,
    ])
    expect(filter.evaluate({ id: 1, name: 'test', active: false })).toBe(true)
    expect(filter.evaluate({ id: 0, name: 'other', active: false })).toBe(false)
  })
})
