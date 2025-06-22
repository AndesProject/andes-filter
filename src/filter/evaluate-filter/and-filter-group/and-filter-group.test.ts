import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { matchesFilter } from '../matches-filter'
import { AndFilterGroup } from './and-filter-group'

describe('AndFilterGroup', () => {
  it('should evaluate all conditions as true when all filters pass', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findMany({
      where: {
        AND: [
          { id: { gte: 1 } },
          { name: { contains: 'test' } },
          { active: { equals: true } },
        ],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data).toEqual([
      { id: 1, name: 'test1', active: true },
      { id: 3, name: 'test3', active: true },
    ])
  })

  it('should return empty array when any condition fails', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findMany({
      where: {
        AND: [
          { id: { gte: 2 } },
          { name: { contains: 'test' } },
          { active: { equals: true } },
          { id: { equals: 1 } }, // Esta condición nunca se cumplirá con las anteriores
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
        AND: [
          { age: { gte: 25 } },
          { email: { contains: '@test.com' } },
          { tags: { has: 'dev' } },
          { name: { not: 'Bob' } },
        ],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data.map((x) => x.name)).toEqual(['John', 'Jane'])
  })

  it('should work with nested AND conditions', () => {
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
        AND: [
          { category: { equals: 'electronics' } },
          {
            AND: [
              { active: { equals: true } },
              { name: { contains: 'Product' } },
            ],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('Product A')
  })

  it('should work with OR conditions inside AND', () => {
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
        AND: [
          { category: { equals: 'electronics' } },
          {
            OR: [{ price: { lt: 150 } }, { name: { contains: 'C' } }],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data.map((x) => x.name)).toEqual(['Product A', 'Product C'])
  })

  it('should handle empty AND array', () => {
    const filter = filterFrom<{ id: number; name: string }>([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ])

    const result = filter.findMany({
      where: {
        AND: [],
      } as any,
    })

    expect(result.data.length).toBe(2)
  })

  it('should work with findUnique', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findUnique({
      where: {
        AND: [{ id: { gte: 2 } }, { active: { equals: true } }],
      } as any,
    })

    expect(result).toEqual({ id: 3, name: 'test3', active: true })
  })

  it('should return null when findUnique has no matches', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
    ])

    const result = filter.findUnique({
      where: {
        AND: [{ id: { equals: 999 } }, { active: { equals: true } }],
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
        AND: [
          { category: { equals: 'electronics' } },
          { price: { gte: 100 } },
          {
            OR: [
              { tags: { has: 'premium' } },
              { name: { contains: 'Laptop' } },
            ],
          } as any,
        ],
      } as any,
    })

    expect(result.data.length).toBe(2)
    expect(result.data.map((x) => x.name)).toEqual(['Laptop', 'Phone'])
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
        AND: [{ name: { isNull: false } }, { email: { isNull: false } }],
      } as any,
    })

    expect(result.data.length).toBe(1)
    expect(result.data[0].id).toBe(3)
  })

  it('debug: simple AND test', () => {
    const filter = filterFrom<{ id: number; name: string }>([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ])

    // Test simple sin AND
    const simpleResult = filter.findMany({
      where: { id: { equals: 1 } } as any,
    })

    // Test con AND
    const andResult = filter.findMany({
      where: {
        AND: [{ id: { equals: 1 } }, { name: { contains: 'test' } }],
      } as any,
    })

    expect(simpleResult.data.length).toBe(1)
    expect(andResult.data.length).toBe(1)
    expect(andResult.data[0]).toEqual({ id: 1, name: 'test1' })
  })

  it('debug: test AndFilterGroup directly', () => {
    const filter = new AndFilterGroup<any>([{ id: { equals: 1 } } as any])

    const result1 = filter.evaluate({ id: 1, name: 'test1' })
    const result2 = filter.evaluate({ id: 2, name: 'test2' })

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  it('debug: test matchesFilter with AND', () => {
    const filter = {
      AND: [{ id: { equals: 1 } }, { name: { contains: 'test' } }],
    } as any

    const result1 = matchesFilter(filter, { id: 1, name: 'test1' })
    const result2 = matchesFilter(filter, { id: 2, name: 'test2' })

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})

describe('AndFilterGroup class', () => {
  it('should return true for empty filter array', () => {
    const filter = new AndFilterGroup<any>([])
    expect(filter.evaluate({ id: 1, name: 'test' })).toBe(true)
  })

  it('should return true when all conditions are met', () => {
    const filter = new AndFilterGroup<any>([
      { id: { equals: 1 } } as any,
      { name: { contains: 'test' } } as any,
    ])
    expect(filter.evaluate({ id: 1, name: 'test' })).toBe(true)
  })

  it('should return false when any condition fails', () => {
    const filter = new AndFilterGroup<any>([
      { id: { equals: 1 } } as any,
      { name: { contains: 'test' } } as any,
    ])
    expect(filter.evaluate({ id: 1, name: 'other' })).toBe(false)
    expect(filter.evaluate({ id: 2, name: 'test' })).toBe(false)
  })

  it('should handle complex nested conditions', () => {
    const filter = new AndFilterGroup<any>([
      { id: { gte: 1 } } as any,
      {
        AND: [
          { name: { contains: 'test' } } as any,
          { active: { equals: true } } as any,
        ],
      } as any,
    ])
    expect(filter.evaluate({ id: 1, name: 'test', active: true })).toBe(true)
    expect(filter.evaluate({ id: 1, name: 'test', active: false })).toBe(false)
  })
})
