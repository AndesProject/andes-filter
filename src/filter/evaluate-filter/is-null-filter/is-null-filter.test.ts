import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { IsNullFilter } from './is-null-filter'
describe('IsNullFilter', () => {
  it('should match null and undefined when isNull is true', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: false },
      { value: [] },
      { value: {} },
    ])
    const result = filter.findMany({ where: { value: { isNull: true } } })
    expect(result.data.length).toBe(2)
    expect(result.data).toEqual([{ value: null }, { value: undefined }])
    expect(filter.findUnique({ where: { value: { isNull: true } } })).toEqual({
      value: null,
    })
  })
  it('should match non-null and non-undefined when isNull is false', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: false },
      { value: [] },
      { value: {} },
    ])
    const result = filter.findMany({ where: { value: { isNull: false } } })
    expect(result.data.length).toBe(5)
    expect(result.data).toEqual([
      { value: 0 },
      { value: '' },
      { value: false },
      { value: [] },
      { value: {} },
    ])
    expect(filter.findUnique({ where: { value: { isNull: false } } })).toEqual({
      value: 0,
    })
  })
  it('should work with arrays and objects', () => {
    const filter = createFilter<{ arr: any; obj: any }>([
      { arr: null, obj: null },
      { arr: undefined, obj: undefined },
      { arr: [], obj: {} },
      { arr: [1], obj: { a: 1 } },
    ])
    expect(
      filter.findMany({ where: { arr: { isNull: true } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { arr: { isNull: false } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { obj: { isNull: true } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { obj: { isNull: false } } }).data.length
    ).toBe(2)
  })
  it('should work in combination with other filters', () => {
    const filter = createFilter<{ value: any; name: string }>([
      { value: null, name: 'a' },
      { value: 1, name: 'b' },
      { value: undefined, name: 'c' },
      { value: 2, name: 'd' },
    ])
    expect(
      filter.findMany({
        where: { value: { isNull: false }, name: { contains: 'b' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { value: { isNull: false }, name: { contains: 'd' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { value: { isNull: true }, name: { contains: 'a' } },
      }).data.length
    ).toBe(1)
  })
  it('should work with AND/OR conditions', () => {
    const filter = createFilter<{ value: any; flag: boolean }>([
      { value: null, flag: true },
      { value: 1, flag: false },
      { value: undefined, flag: true },
      { value: 2, flag: false },
    ])
    expect(
      filter.findMany({
        where: {
          AND: [{ value: { isNull: true } }, { flag: { equals: true } }],
        } as any,
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: {
          OR: [{ value: { isNull: false } }, { flag: { equals: true } }],
        } as any,
      }).data.length
    ).toBe(4)
  })
})
describe('IsNullFilter class', () => {
  it('should evaluate null and undefined as true when isNull is true', () => {
    const filter = new IsNullFilter(true)
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(true)
    expect(filter.evaluate(0)).toBe(false)
    expect(filter.evaluate('')).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
  })
  it('should evaluate non-null and non-undefined as true when isNull is false', () => {
    const filter = new IsNullFilter(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
    expect(filter.evaluate(0)).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate([])).toBe(true)
    expect(filter.evaluate({})).toBe(true)
  })
})
