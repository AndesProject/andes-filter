import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { EveryFilter } from './every-filter'
describe('EveryFilter', () => {
  it('arrays con todos los elementos que cumplen el filtro', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 2] },
      { items: [2] },
      { items: [1, 2, 2] },
    ])
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(3)
  })
  it('arrays con algún elemento que no cumple el filtro', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 1, 2] },
      { items: [1, 1, 1] },
    ])
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(1)
  })
  it('arrays vacíos, null y undefined', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 2] },
      { items: [2] },
      { items: [] },
      { items: [1, 2, 2] },
      { items: null as any },
      { items: undefined as any },
    ])
    expect(
      filter.findMany({ where: { items: { every: { equals: 2 } } } }).data
        .length
    ).toBe(4)
  })
  it('findUnique', () => {
    const filter = createFilter<{ items: number[] }>([
      { items: [2, 2, 2] },
      { items: [2, 1, 2] },
    ])
    const result = filter.findUnique({
      where: { items: { every: { equals: 2 } } },
    })
    expect(result).toEqual({ items: [2, 2, 2] })
    const result2 = filter.findUnique({
      where: { items: { every: { equals: 1 } } },
    })
    expect(result2).toBe(null)
  })
  it('filtros complejos', () => {
    const filter = createFilter<{ posts: boolean[] }>([
      { posts: [true, true] },
      { posts: [true, false] },
    ])
    expect(
      filter.findMany({ where: { posts: { every: { equals: true } } } }).data
        .length
    ).toBe(1)
  })
})
describe('EveryFilter Unit', () => {
  it('should return true for empty array (vacuous truth)', () => {
    const filter = new EveryFilter({ equals: 1 })
    expect(filter.evaluate([])).toBe(true)
  })
  it('should return false for non-array input', () => {
    const filter = new EveryFilter({ equals: 1 })
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate('string')).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })
  it('should return true if every item matches the primitive filter', () => {
    const filter = new EveryFilter(5)
    expect(filter.evaluate([5, 5, 5])).toBe(true)
    expect(filter.evaluate([5, 5, 4])).toBe(false)
  })
  it('should return true if every item matches the operator filter', () => {
    const filter = new EveryFilter({ equals: 2 })
    expect(filter.evaluate([2, 2, 2])).toBe(true)
    expect(filter.evaluate([2, 2, 3])).toBe(false)
  })
  it('should return true if every item matches a complex object filter', () => {
    const filter = new EveryFilter({ a: 1, b: 2 })
    expect(
      filter.evaluate([
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ])
    ).toBe(true)
    expect(
      filter.evaluate([
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ])
    ).toBe(false)
  })
  it('should return true for empty filter and array of objects', () => {
    const filter = new EveryFilter({})
    expect(filter.evaluate([{ a: 1 }, { b: 2 }])).toBe(true)
  })
  it('should return true for empty filter and array of primitives', () => {
    const filter = new EveryFilter({})
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('should return false if any item is null or undefined', () => {
    const filter = new EveryFilter({ equals: 1 })
    expect(filter.evaluate([1, 1, null])).toBe(false)
    expect(filter.evaluate([1, undefined, 1])).toBe(false)
  })
  it('should handle nested operator filters', () => {
    const filter = new EveryFilter({ gt: 0 })
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate([1, 0, 3])).toBe(false)
  })
  it('should handle nested complex filters', () => {
    const filter = new EveryFilter({ a: { equals: 1 } })
    expect(filter.evaluate([{ a: 1 }, { a: 1 }])).toBe(true)
    expect(filter.evaluate([{ a: 1 }, { a: 2 }])).toBe(false)
  })
  it('should handle array of objects with empty filter', () => {
    const filter = new EveryFilter({})
    expect(filter.evaluate([{ x: 1 }, { y: 2 }])).toBe(true)
  })
  it('should handle array of primitives with empty filter', () => {
    const filter = new EveryFilter({})
    expect(filter.evaluate([1, 2, 3])).toBe(true)
  })
  it('should handle array of objects with null/undefined', () => {
    const filter = new EveryFilter({ a: 1 })
    expect(filter.evaluate([{ a: 1 }, null, { a: 1 }])).toBe(false)
    expect(filter.evaluate([{ a: 1 }, undefined, { a: 1 }])).toBe(false)
  })
})
describe('EveryFilter Integration', () => {
  it('should work with createFilter for primitive arrays', () => {
    const filter = createFilter<{ arr: number[] }>([
      { arr: [1, 1, 1] },
      { arr: [1, 2, 1] },
      { arr: [2, 2, 2] },
      { arr: [] },
    ])
    expect(
      filter.findMany({ where: { arr: { every: { equals: 1 } } } } as any).data
        .length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 2 } } } } as any).data
        .length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 3 } } } } as any).data
        .length
    ).toBe(1)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 1 } } } } as any)
        .data[0].arr
    ).toEqual([1, 1, 1])
    expect(
      filter.findMany({ where: { arr: { every: { equals: 2 } } } } as any)
        .data[0].arr
    ).toEqual([2, 2, 2])
    expect(
      filter.findMany({ where: { arr: { every: { equals: 1 } } } } as any)
        .data[0].arr
    ).not.toEqual([1, 2, 1])
    expect(
      filter.findMany({ where: { arr: { every: { equals: 1 } } } } as any).data
        .length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 2 } } } } as any).data
        .length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 3 } } } } as any).data
        .length
    ).toBe(1)
    expect(
      filter.findMany({ where: { arr: { every: { equals: 1 } } } } as any)
        .data[0].arr
    ).toEqual([1, 1, 1])
    expect(
      filter.findMany({ where: { arr: { every: { equals: 2 } } } } as any)
        .data[0].arr
    ).toEqual([2, 2, 2])
  })
  it('should work with createFilter for arrays of objects', () => {
    const filter = createFilter<{ arr: { a: number }[] }>([
      { arr: [{ a: 1 }, { a: 1 }] },
      { arr: [{ a: 1 }, { a: 2 }] },
      { arr: [{ a: 2 }, { a: 2 }] },
      { arr: [] },
    ])
    expect(
      filter.findMany({
        where: { arr: { every: { a: { equals: 1 } } } } as any,
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { arr: { every: { a: { equals: 2 } } } } as any,
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { arr: { every: { a: { equals: 3 } } } } as any,
      }).data.length
    ).toBe(1)
  })
  it('should return true for empty array in integration', () => {
    const filter = createFilter<{ arr: number[] }>([{ arr: [] }, { arr: [1] }])
    expect(
      filter.findMany({ where: { arr: { every: 1 } } } as any).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { every: 2 } } } as any).data.length
    ).toBe(1)
  })
  it('should handle empty filter with array of objects', () => {
    const filter = createFilter<{ arr: { x: number }[] }>([
      { arr: [{ x: 1 }, { x: 2 }] },
      { arr: [{ x: 3 }] },
      { arr: [] },
    ])
    expect(filter.findMany({ where: { arr: { every: {} } } }).data.length).toBe(
      3
    )
  })
  it('should handle empty filter with array of primitives', () => {
    const filter = createFilter<{ arr: number[] }>([
      { arr: [1, 2, 3] },
      { arr: [4, 5, 6] },
      { arr: [] },
    ])
    expect(filter.findMany({ where: { arr: { every: {} } } }).data.length).toBe(
      3
    )
  })
})
