import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'

describe('None Filter - Prisma/TypeORM Compatibility', () => {
  type Tag = { name: string }
  type Obj = { id: number; tags: Tag[] | null | undefined }
  const testData: Obj[] = [
    { id: 1, tags: [{ name: 'foo' }, { name: 'bar' }] },
    { id: 2, tags: [{ name: 'baz' }] },
    { id: 3, tags: [] },
    { id: 4, tags: null },
    { id: 5, tags: undefined },
    { id: 6, tags: [{ name: 'qux' }, { name: 'foo' }] },
  ]

  it('should return true if no element matches the filter', () => {
    const filter = createFilterEngine<Obj>(testData)
    const result = filter.findMany({
      where: {
        tags: { none: { name: { equals: 'notfound' } } as any },
      },
    })
    expect(result.data.map((x) => x.id)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('should return false if any element matches the filter', () => {
    const filter = createFilterEngine<Obj>(testData)
    const result = filter.findMany({
      where: {
        tags: { none: { name: { equals: 'foo' } } as any },
      },
    })
    expect(result.data.map((x) => x.id)).toEqual([2, 3, 4, 5])
  })

  it('should return true for empty arrays', () => {
    const filter = createFilterEngine<Obj>(testData)
    const result = filter.findMany({
      where: {
        tags: { none: { name: { equals: 'foo' } } as any },
      },
    })
    expect(result.data.find((x) => x.id === 3)).toBeDefined()
  })

  it('should return true for null or undefined arrays', () => {
    const filter = createFilterEngine<Obj>(testData)
    const result = filter.findMany({
      where: {
        tags: { none: { name: { equals: 'foo' } } as any },
      },
    })
    expect(result.data.find((x) => x.id === 4)).toBeDefined()
    expect(result.data.find((x) => x.id === 5)).toBeDefined()
  })

  it('should return false for empty filter and array of objects (at least one object)', () => {
    const filter = createFilterEngine<Obj>(testData)
    const result = filter.findMany({
      where: {
        tags: { none: {} as any },
      },
    })
    expect(result.data).toHaveLength(3)
    expect(result.data.map((x) => x.id).sort()).toEqual([3, 4, 5])
  })

  it('should return true for empty filter and array of primitives', () => {
    type Data = { id: number; values: number[] | null }
    const data: Data[] = [
      { id: 1, values: [1, 2, 3] },
      { id: 2, values: [] },
      { id: 3, values: null },
    ]
    const filter = createFilterEngine<Data>(data)
    const result = filter.findMany({
      where: {
        values: { none: {} as any },
      },
    })
    expect(result.data.map((x) => x.id).sort()).toEqual([2, 3])
  })

  it('should return true for none with regex filter and no match', () => {
    type Data = { id: number; values: string[] }
    const data: Data[] = [
      { id: 1, values: ['hello', 'TEST', 'world'] },
      { id: 2, values: ['hello', 'world'] },
    ]
    const filter = createFilterEngine<Data>(data)
    const result = filter.findMany({
      where: {
        values: { none: { regex: { pattern: 'test', flags: 'i' } } as any },
      },
    })
    expect(result.data.map((x) => x.id)).toEqual([2])
  })

  it('should return false for none with regex filter and a match', () => {
    type Data = { id: number; values: string[] }
    const data: Data[] = [
      { id: 1, values: ['hello', 'TEST', 'world'] },
      { id: 2, values: ['hello', 'world'] },
    ]
    const filter = createFilterEngine<Data>(data)
    const result = filter.findMany({
      where: {
        values: { none: { regex: { pattern: 'test', flags: 'i' } } as any },
      },
    })
    expect(result.data.map((x) => x.id)).toEqual([2])
  })
})
