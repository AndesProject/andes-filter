import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { QueryOption } from '../../filter.interface'
import { matchesFilter } from '../matches-filter'
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
      { value: { equals: 'test' } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(true)
  })

  it('should negate multiple filters (conjunction)', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } } as QueryOption<{ value: any }, 'value'>,
      { value: { startsWith: 't' } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(true)
    expect(filter.evaluate({ value: 'testing' })).toBe(false)
  })

  it('should handle complex nested filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } } as QueryOption<{ value: any }, 'value'>,
      { value: { in: ['test', 'other'] } } as QueryOption<
        { value: any },
        'value'
      >,
      { value: { startsWith: 't' } } as QueryOption<{ value: any }, 'value'>,
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
      { value: { equals: null } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: null })).toBe(false)
    expect(filter.evaluate({ value: undefined })).toBe(true)
    expect(filter.evaluate({ value: 'test' })).toBe(true)
  })

  it('should work with different data types', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 42 } } as QueryOption<{ value: any }, 'value'>,
      { value: { gt: 10 } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 42 })).toBe(false)
    expect(filter.evaluate({ value: 50 })).toBe(false)
    expect(filter.evaluate({ value: 5 })).toBe(true)
    expect(filter.evaluate({ value: '42' })).toBe(false)
  })

  it('should handle array filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { has: 'item1' } } as QueryOption<{ value: any }, 'value'>,
      { value: { length: 2 } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: ['item1', 'item2'] })).toBe(false)
    expect(filter.evaluate({ value: ['item1'] })).toBe(false)
    expect(filter.evaluate({ value: ['item2', 'item3'] })).toBe(false)
  })

  it('should handle object filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { some: { name: { equals: 'nested' } } } } as QueryOption<
        { value: any },
        'value'
      >,
    ])
    expect(filter.evaluate({ value: [{ name: 'nested' }] })).toBe(false)
    expect(filter.evaluate({ value: [{ name: 'other' }] })).toBe(true)
  })

  it('should handle date filters', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-01-02')
    const date3 = new Date('2023-01-03')
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { after: date1 } } as QueryOption<{ value: any }, 'value'>,
      { value: { before: date3 } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: date2 })).toBe(false)
    expect(filter.evaluate({ value: date1 })).toBe(false)
    expect(filter.evaluate({ value: date3 })).toBe(false)
  })

  it('should handle string filters with insensitive mode', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { contains: 'TEST', mode: 'insensitive' } } as QueryOption<
        { value: any },
        'value'
      >,
    ])
    const val1 = { value: 'This is a test' }
    const val2 = { value: 'This is something else' }

    // Test the individual filter first
    const individualFilter = {
      value: { contains: 'TEST', mode: 'insensitive' },
    }

    const individualResult1 = matchesFilter(individualFilter as any, val1)
    const individualResult2 = matchesFilter(individualFilter as any, val2)

    const res1 = filter.evaluate(val1)
    const res2 = filter.evaluate(val2)
    expect(res1).toBe(false)
    expect(res2).toBe(true)
  })

  it('should handle regex filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { regex: '^test.*' } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 'test123' })).toBe(false)
    expect(filter.evaluate({ value: 'other123' })).toBe(true)
  })

  it('should handle between filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { between: [10, 20] } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 15 })).toBe(false)
    expect(filter.evaluate({ value: 5 })).toBe(true)
    expect(filter.evaluate({ value: 25 })).toBe(true)
  })

  it('should handle isNull filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { isNull: true } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: null })).toBe(false)
    expect(filter.evaluate({ value: undefined })).toBe(false)
    expect(filter.evaluate({ value: 'test' })).toBe(true)
  })

  it('should handle complex mixed filters', () => {
    const filter = new NotFilterGroup<{ value: any }>([
      { value: { equals: 'test' } } as QueryOption<{ value: any }, 'value'>,
      { value: { in: ['test', 'other'] } } as QueryOption<
        { value: any },
        'value'
      >,
      { value: { startsWith: 't' } } as QueryOption<{ value: any }, 'value'>,
      { value: { length: 4 } } as QueryOption<{ value: any }, 'value'>,
    ])
    expect(filter.evaluate({ value: 'test' })).toBe(false)
    expect(filter.evaluate({ value: 'other' })).toBe(false)
    expect(filter.evaluate({ value: 'temp' })).toBe(false)
  })
})

describe('NotFilterGroup Integration Tests', () => {
  it('should work with findMany', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
      { id: 3, name: 'test3', active: true },
    ])

    const result = filter.findMany({
      where: {
        NOT: [{ id: { equals: 1 } }, { name: { contains: 'test' } }],
      } as any,
    })

    // Should return items that do NOT match both conditions
    expect(result.data.length).toBe(0) // All items match at least one condition
  })

  it('should work with findUnique', () => {
    const filter = filterFrom<{ id: number; name: string; active: boolean }>([
      { id: 1, name: 'test1', active: true },
      { id: 2, name: 'test2', active: false },
    ])

    const result = filter.findUnique({
      where: {
        NOT: [{ id: { equals: 1 } }, { active: { equals: true } }],
      } as any,
    })

    // Should return the first item that does NOT match both conditions
    expect(result).toEqual({ id: 2, name: 'test2', active: false })
  })

  it('should work with nested conditions', () => {
    const filter = filterFrom<{ id: number; name: string; category: string }>([
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
      } as any,
    })

    // Should return items that do NOT match both conditions
    expect(result.data.length).toBe(0) // All items match at least one condition
  })

  it('should work with complex nested NOT conditions', () => {
    const filter = filterFrom<{ id: number; name: string; price: number }>([
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
          } as any,
        ],
      } as any,
    })

    // Should return items that do NOT match the complex condition
    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('Book')
  })
})
