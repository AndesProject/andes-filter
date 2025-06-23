import { describe, expect, it } from 'vitest'
import { SortDirection } from '../../filter.interface'
import { sortObjects } from './sort-objects'
describe('sortObjects', () => {
  it('should return items unchanged when items is null', () => {
    const result = sortObjects(null as any, { id: SortDirection.ASC })
    expect(result).toBeNull()
  })
  it('should return items unchanged when items is undefined', () => {
    const result = sortObjects(undefined as any, {
      id: SortDirection.ASC,
    })
    expect(result).toBeUndefined()
  })
  it('should return items unchanged when items is empty array', () => {
    const items: any[] = []
    const result = sortObjects(items, { id: SortDirection.ASC })
    expect(result).toBe(items)
  })
  it('should return items unchanged when orderBy is undefined', () => {
    const items = [{ id: 1 }, { id: 2 }]
    const result = sortObjects(items, undefined)
    expect(result).toBe(items)
  })
  it('should return items unchanged when orderBy is empty object', () => {
    const items = [{ id: 1 }, { id: 2 }]
    const result = sortObjects(items, {})
    expect(result).toBe(items)
  })
  it('should sort numbers in ascending order', () => {
    const items = [{ id: 3 }, { id: 1 }, { id: 2 }]
    const result = sortObjects(items, { id: SortDirection.ASC })
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
  it('should sort numbers in descending order', () => {
    const items = [{ id: 1 }, { id: 3 }, { id: 2 }]
    const result = sortObjects(items, { id: SortDirection.DESC })
    expect(result).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }])
  })
  it('should sort strings in ascending order', () => {
    const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ])
  })
  it('should sort strings in descending order', () => {
    const items = [{ name: 'Alice' }, { name: 'Charlie' }, { name: 'Bob' }]
    const result = sortObjects(items, { name: SortDirection.DESC })
    expect(result).toEqual([
      { name: 'Charlie' },
      { name: 'Bob' },
      { name: 'Alice' },
    ])
  })
  it('should sort booleans in ascending order', () => {
    const items = [{ active: true }, { active: false }, { active: true }]
    const result = sortObjects(items, { active: SortDirection.ASC })
    expect(result).toEqual([
      { active: false },
      { active: true },
      { active: true },
    ])
  })
  it('should sort booleans in descending order', () => {
    const items = [{ active: false }, { active: true }, { active: false }]
    const result = sortObjects(items, { active: SortDirection.DESC })
    expect(result).toEqual([
      { active: true },
      { active: false },
      { active: false },
    ])
  })
  it('should sort dates in ascending order', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-02-01')
    const date3 = new Date('2023-03-01')
    const items = [{ date: date3 }, { date: date1 }, { date: date2 }]
    const result = sortObjects(items, { date: SortDirection.ASC })
    expect(result).toEqual([{ date: date1 }, { date: date2 }, { date: date3 }])
  })
  it('should sort dates in descending order', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-02-01')
    const date3 = new Date('2023-03-01')
    const items = [{ date: date1 }, { date: date3 }, { date: date2 }]
    const result = sortObjects(items, { date: SortDirection.DESC })
    expect(result).toEqual([{ date: date3 }, { date: date2 }, { date: date1 }])
  })
  it('should handle null values in sorting', () => {
    const items = [
      { name: 'Alice' },
      { name: null },
      { name: 'Bob' },
      { name: null },
    ]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: null },
      { name: null },
    ])
  })
  it('should handle undefined values in sorting', () => {
    const items = [
      { name: 'Alice' },
      { name: undefined },
      { name: 'Bob' },
      { name: undefined },
    ]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: undefined },
      { name: undefined },
    ])
  })
  it('should handle mixed null and undefined values', () => {
    const items = [
      { name: 'Alice' },
      { name: null },
      { name: 'Bob' },
      { name: undefined },
    ]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: undefined },
      { name: null },
    ])
  })
  it('should handle mixed types by converting to string', () => {
    const items = [
      { value: 'string' },
      { value: 5 },
      { value: true },
      { value: null },
    ]
    const result = sortObjects(items, { value: SortDirection.ASC })
    expect(result).toEqual([
      { value: 5 },
      { value: 'string' },
      { value: true },
      { value: null },
    ])
  })
  it('should handle multiple sort criteria', () => {
    const items = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = sortObjects(items, {
      id: SortDirection.ASC,
      name: SortDirection.ASC,
    })
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })
  it('should handle multiple sort criteria with different directions', () => {
    const items = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = sortObjects(items, {
      id: SortDirection.ASC,
      name: SortDirection.DESC,
    })
    expect(result).toEqual([
      { id: 1, name: 'Bob' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ])
  })
  it('should handle equal values correctly', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = sortObjects(items, {
      id: SortDirection.ASC,
      name: SortDirection.ASC,
    })
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })
  it('should handle case-sensitive string comparison', () => {
    const items = [
      { name: 'alice' },
      { name: 'Alice' },
      { name: 'BOB' },
      { name: 'bob' },
    ]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: 'alice' },
      { name: 'Alice' },
      { name: 'bob' },
      { name: 'BOB' },
    ])
  })
  it('should handle empty strings', () => {
    const items = [
      { name: 'Alice' },
      { name: '' },
      { name: 'Bob' },
      { name: null },
    ]
    const result = sortObjects(items, { name: SortDirection.ASC })
    expect(result).toEqual([
      { name: '' },
      { name: 'Alice' },
      { name: 'Bob' },
      { name: null },
    ])
  })
  it('should handle zero values in numbers', () => {
    const items = [{ id: 5 }, { id: 0 }, { id: -1 }, { id: 10 }]
    const result = sortObjects(items, { id: SortDirection.ASC })
    expect(result).toEqual([{ id: -1 }, { id: 0 }, { id: 5 }, { id: 10 }])
  })
  it('should handle false values in booleans', () => {
    const items = [
      { active: true },
      { active: false },
      { active: true },
      { active: false },
    ]
    const result = sortObjects(items, { active: SortDirection.ASC })
    expect(result).toEqual([
      { active: false },
      { active: false },
      { active: true },
      { active: true },
    ])
  })
  it('should handle objects with missing properties', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2 },
      { name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]
    const result = sortObjects(items, { id: SortDirection.ASC })
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2 },
      { id: 3, name: 'Charlie' },
      { name: 'Bob' },
    ])
  })
  it('should handle equal string values in mixed type comparison', () => {
    const items = [{ value: 'test' }, { value: 'TEST' }, { value: 'test' }]
    const result = sortObjects(items, { value: SortDirection.ASC })
    expect(result).toEqual([
      { value: 'test' },
      { value: 'test' },
      { value: 'TEST' },
    ])
  })
})
