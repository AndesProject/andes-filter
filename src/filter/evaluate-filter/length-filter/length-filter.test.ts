import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { LengthFilter } from './length-filter'

describe('LengthFilter', () => {
  it('should filter arrays by exact length', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: [] },
      { items: [1] },
      { items: [1, 2] },
      { items: [1, 2, 3] },
      { items: [1, 2, 3, 4] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 0 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 3 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 4 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 5 } } }).data.length
    ).toBe(0)

    expect(
      filter.findUnique({ where: { items: { length: 0 } } })?.items
    ).toEqual([])
    expect(
      filter.findUnique({ where: { items: { length: 1 } } })?.items
    ).toEqual([1])
    expect(
      filter.findUnique({ where: { items: { length: 2 } } })?.items
    ).toEqual([1, 2])
    expect(filter.findUnique({ where: { items: { length: 5 } } })).toBe(null)
  })

  it('should handle arrays with different types of elements', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: ['a', 'b'] },
      { items: [1, 2, 3] },
      { items: [true, false] },
      { items: [{ id: 1 }, { id: 2 }] },
      { items: [null, undefined, 0] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { items: { length: 3 } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(0)
  })

  it('should handle null and undefined values', () => {
    const filter = filterFrom<{ items: any }>([
      { items: null },
      { items: undefined },
      { items: [] },
      { items: [1] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 0 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(0)

    expect(
      filter.findUnique({ where: { items: { length: 0 } } })?.items
    ).toEqual([])
    expect(
      filter.findUnique({ where: { items: { length: 1 } } })?.items
    ).toEqual([1])
    expect(filter.findUnique({ where: { items: { length: 2 } } })).toBe(null)
  })

  it('should handle non-array values', () => {
    const filter = filterFrom<{ items: any }>([
      { items: 'string' },
      { items: 123 },
      { items: true },
      { items: { key: 'value' } },
      { items: [] },
      { items: [1, 2] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 0 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(0)
  })

  it('should work with empty arrays', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: [] },
      { items: [1] },
      { items: [1, 2] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 0 } } }).data.length
    ).toBe(1)
    expect(
      filter.findUnique({ where: { items: { length: 0 } } })?.items
    ).toEqual([])
  })

  it('should work with nested arrays', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: [[1], [2]] },
      {
        items: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      },
      { items: [[1, 2, 3]] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 3 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(1)
  })

  it('should work with arrays of objects', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: [{ id: 1 }] },
      { items: [{ id: 1 }, { id: 2 }] },
      { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 1 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 2 } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { items: { length: 3 } } }).data.length
    ).toBe(1)
  })

  it('should work with mixed arrays', () => {
    const filter = filterFrom<{ items: any[] }>([
      { items: [1, 'string', true] },
      { items: [null, undefined, 0, ''] },
      { items: [{ id: 1 }, [1, 2], 'test'] },
    ])

    expect(
      filter.findMany({ where: { items: { length: 3 } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { items: { length: 4 } } }).data.length
    ).toBe(1)
  })

  it('should work in combination with other filters', () => {
    const filter = filterFrom<{ items: any[]; name: string; active: boolean }>([
      { items: [1, 2], name: 'test1', active: true },
      { items: [1, 2, 3], name: 'test2', active: true },
      { items: [1], name: 'test3', active: false },
      { items: [1, 2, 3, 4], name: 'test4', active: true },
    ])

    // Combinación con equals
    expect(
      filter.findMany({
        where: {
          items: { length: 2 },
          name: { equals: 'test1' },
        },
      }).data.length
    ).toBe(1)

    // Combinación con boolean
    expect(
      filter.findMany({
        where: {
          items: { length: 3 },
          active: { equals: true },
        },
      }).data.length
    ).toBe(1)

    // Combinación con múltiples condiciones
    expect(
      filter.findMany({
        where: {
          items: { length: 2 },
          active: { equals: true },
          name: { contains: 'test' },
        },
      }).data.length
    ).toBe(1)
  })

  it('should work with AND/OR conditions', () => {
    const filter = filterFrom<{ items: any[]; category: string }>([
      { items: [1, 2], category: 'A' },
      { items: [1, 2, 3], category: 'B' },
      { items: [1], category: 'A' },
      { items: [1, 2, 3, 4], category: 'B' },
    ])

    // AND condition
    expect(
      filter.findMany({
        where: {
          AND: [{ items: { length: 2 } }, { category: { equals: 'A' } }],
        } as any,
      }).data.length
    ).toBe(1)

    // OR condition
    expect(
      filter.findMany({
        where: {
          OR: [{ items: { length: 1 } }, { items: { length: 4 } }],
        } as any,
      }).data.length
    ).toBe(2)
  })
})

describe('LengthFilter class', () => {
  it('should evaluate arrays correctly', () => {
    const filter = new LengthFilter(2)

    expect(filter.evaluate([1, 2])).toBe(true)
    expect(filter.evaluate([1])).toBe(false)
    expect(filter.evaluate([1, 2, 3])).toBe(false)
    expect(filter.evaluate([])).toBe(false)
  })

  it('should handle null and undefined', () => {
    const filter = new LengthFilter(0)

    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('should handle non-array values', () => {
    const filter = new LengthFilter(1)

    expect(filter.evaluate('string')).toBe(false)
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
    expect(filter.evaluate({ key: 'value' })).toBe(false)
  })

  it('should handle empty arrays', () => {
    const filter = new LengthFilter(0)

    expect(filter.evaluate([])).toBe(true)
    expect(filter.evaluate([1])).toBe(false)
  })

  it('should handle large arrays', () => {
    const filter = new LengthFilter(1000)
    const largeArray = new Array(1000).fill(0)

    expect(filter.evaluate(largeArray)).toBe(true)
    expect(filter.evaluate([...largeArray, 1])).toBe(false)
  })
})
