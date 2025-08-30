import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { NotFilterGroup } from './not-filter-group'

describe('NotFilterGroup', () => {
  it('debe manejar correctamente un grupo vacío de filtros', () => {
    const emptyFilterGroup = new NotFilterGroup<{ value: any }>([])
    expect(emptyFilterGroup.evaluate({ value: 'test' })).toBe(true)
  })
  it('debe manejar correctamente casos donde los filtros no están disponibles', () => {
    const emptyFilterGroup = new NotFilterGroup<{ value: any }>([])
    const result = emptyFilterGroup.evaluate({ value: 'test' })
    expect(result).toBe(true)
  })
  it('should negate a single filter', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } },
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(true)
  })
  it('should negate multiple filters (conjunction)', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } },
      { value: { startsWith: 't' } },
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(true)
    expect(filter.evaluate({ value: 'testing' })).toBe(false)
  })
  it('should handle complex nested filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } },
      { value: { in: ['test', 'other'] } },
      { value: { startsWith: 't' } },
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(false)
    expect(filter.evaluate({ value: 'testing' })).toBe(false)
  })
  it('should handle empty filter array', () => {
    const filter = new NotFilterGroup<{ value: any }>([])
    expect(filter.evaluate({ value: 'anything' })).toBe(true)
  })
  it('should handle null and undefined values', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: null } },
    ])
    expect(filter.evaluate({ value: null })).toBe(false)
    expect(filter.evaluate({ value: undefined })).toBe(true)
    expect(filter.evaluate({ value: 'test' })).toBe(true)
  })
  it('should work with different data types', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 42 } },
      { value: { gt: 10 } },
    ])
    expect(filter.evaluate({ value: 42 })).toBe(false)
    expect(filter.evaluate({ value: 50 })).toBe(false)
    expect(filter.evaluate({ value: 5 })).toBe(true)
    expect(filter.evaluate({ value: '42' })).toBe(true)
  })
  it('should handle array filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { has: 'item1' } },
      { value: { length: 2 } },
    ])
    expect(filter.evaluate({ value: ['item1', 'item2'] })).toBe(false)
    expect(filter.evaluate({ value: ['item1'] })).toBe(false)
    expect(filter.evaluate({ value: ['item2', 'item3'] })).toBe(false)
  })
  it('should handle object filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { some: { name: { equals: 'nested' } } } },
    ])
    expect(filter.evaluate({ value: [{ name: 'nested' }] })).toBe(false)
    expect(filter.evaluate({ value: [{ name: 'other' }] })).toBe(true)
  })
  it('should handle date filters', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-01-02')
    const date3 = new Date('2023-01-03')
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { after: date1 } },
      { value: { before: date3 } },
    ])
    expect(filter.evaluate({ value: date2 })).toBe(false)
    expect(filter.evaluate({ value: date1 })).toBe(false)
    expect(filter.evaluate({ value: date3 })).toBe(false)
  })
  it('should handle string filters with insensitive mode', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { contains: 'TEST', mode: 'insensitive' } },
    ])
    const val1 = { value: 'This is a test' }
    const val2 = { value: 'This is something else' }
    const res1 = filter.evaluate(val1)
    const res2 = filter.evaluate(val2)
    expect(res1).toBe(false)
    expect(res2).toBe(true)
  })
  it('should handle regex filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { regex: '^test.*' } },
    ])
    expect(filter.evaluate({ value: 'test123' })).toBe(false)
    expect(filter.evaluate({ value: 'other123' })).toBe(true)
  })
  it('should handle between filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { between: [10, 20] } },
    ])
    expect(filter.evaluate({ value: 15 })).toBe(false)
    expect(filter.evaluate({ value: 5 })).toBe(true)
    expect(filter.evaluate({ value: 25 })).toBe(true)
  })
  it('should handle isNull filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { isNull: true } },
    ])
    expect(filter.evaluate({ value: null })).toBe(false)
    expect(filter.evaluate({ value: undefined })).toBe(false)
    expect(filter.evaluate({ value: 'test' })).toBe(true)
  })
  it('should handle complex mixed filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } },
      { value: { in: ['test', 'other'] } },
      { value: { startsWith: 't' } },
      { value: { length: 4 } },
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(false)
    expect(filter.evaluate({ value: 'temp' })).toBe(false)
  })
})
describe('NotFilterGroup Integration Tests', () => {
  it('should work with findMany', () => {
    const filter = createFilter<{
      id: number
      name: string
      active: boolean
    }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])
    const result = filter.findMany({
      where: {
        NOT: [{ id: { equals: 1 } }, { name: { contains: 'test' } }],
      },
    })
    expect(result.data.length).toBe(0)
  })
  it('should work with findUnique', () => {
    const filter = createFilter<{
      id: number
      name: string
      active: boolean
    }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
    ])
    const result = filter.findUnique({
      where: {
        NOT: [{ id: { equals: 1 } }, { active: { equals: true } }],
      },
    })
    expect(result).toEqual({ id: 2, name: 'test2', active: false })
  })
  it('should work with nested conditions', () => {
    const filter = createFilter<{
      id: number
      name: string
      category: string
    }>([
      { id: 1, name: 'Product A', category: 'electronics' },
      { id: 2, name: 'Product B', category: 'clothing' },
      { id: 3, name: 'Product C', category: 'electronics' },
    ])
    const result = filter.findMany({
      where: {
        NOT: [
          { category: { equals: 'electronics' } },
          { name: { contains: 'Product' } },
        ],
      },
    })
    expect(result.data.length).toBe(0)
  })
  it('should work with complex nested NOT conditions', () => {
    const filter = createFilter<{
      id: number
      name: string
      price: number
    }>([
      { id: 1, name: 'Laptop', price: 1000 },
      { id: 2, name: 'Phone', price: 500 },
      { id: 3, name: 'Book', price: 20 },
    ])
    const result = filter.findMany({
      where: {
        NOT: [
          { price: { gte: 100 } },
          {
            AND: [{ name: { contains: 'Laptop' } }, { price: { gte: 500 } }],
          },
        ],
      },
    })
    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('Book')
  })
})
