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
    const arr = [{ v: 'abc' }, { v: 'ABC' }, { v: 123 }]
    const result = sortObjects([...arr], { v: SortDirection.ASC })
    expect(result[0].v).toBe(123)
    expect(result[1].v).toBe('abc')
    expect(result[2].v).toBe('ABC')
  })
  it('should handle string comparison when firstStringValue > secondStringValue', () => {
    const arr = [{ v: 'zebra' }, { v: 'apple' }, { v: 'banana' }]
    const result = sortObjects([...arr], { v: SortDirection.ASC })
    expect(result).toEqual([{ v: 'apple' }, { v: 'banana' }, { v: 'zebra' }])
  })
  it('should handle string comparison when firstStringValue === secondStringValue', () => {
    const arr = [{ v: 'same' }, { v: 'SAME' }, { v: 'same' }]
    const result = sortObjects([...arr], { v: SortDirection.ASC })
    expect(result).toEqual([{ v: 'same' }, { v: 'same' }, { v: 'SAME' }])
  })
  it('should handle mixed types with equal string conversion', () => {
    const arr = [{ v: 123 }, { v: '123' }, { v: true }]
    const result = sortObjects([...arr], { v: SortDirection.ASC })
    expect(result).toEqual([{ v: 123 }, { v: '123' }, { v: true }])
  })
  it('debe retornar el mismo array si está vacío o sin criterios', () => {
    expect(sortObjects([], { a: SortDirection.ASC })).toEqual([])
    expect(sortObjects([{ a: 1 }], undefined)).toEqual([{ a: 1 }])
    expect(sortObjects([{ a: 1 }], {})).toEqual([{ a: 1 }])
  })
  it('ordena por número ascendente y descendente', () => {
    const arr = [{ n: 2 }, { n: 1 }, { n: 3 }]
    expect(sortObjects([...arr], { n: SortDirection.ASC })).toEqual([
      { n: 1 },
      { n: 2 },
      { n: 3 },
    ])
    expect(sortObjects([...arr], { n: SortDirection.DESC })).toEqual([
      { n: 3 },
      { n: 2 },
      { n: 1 },
    ])
  })
  it('ordena por string ascendente y descendente', () => {
    const arr = [{ s: 'b' }, { s: 'a' }, { s: 'c' }]
    expect(sortObjects([...arr], { s: SortDirection.ASC })).toEqual([
      { s: 'a' },
      { s: 'b' },
      { s: 'c' },
    ])
    expect(sortObjects([...arr], { s: SortDirection.DESC })).toEqual([
      { s: 'c' },
      { s: 'b' },
      { s: 'a' },
    ])
  })
  it('ordena por boolean', () => {
    const arr = [{ b: false }, { b: true }, { b: false }]
    expect(sortObjects([...arr], { b: SortDirection.ASC })).toEqual([
      { b: false },
      { b: false },
      { b: true },
    ])
    expect(sortObjects([...arr], { b: SortDirection.DESC })).toEqual([
      { b: true },
      { b: false },
      { b: false },
    ])
  })
  it('ordena por Date', () => {
    const arr = [
      { d: new Date('2023-01-02') },
      { d: new Date('2023-01-01') },
      { d: new Date('2023-01-03') },
    ]
    expect(sortObjects([...arr], { d: SortDirection.ASC })).toEqual([
      { d: new Date('2023-01-01') },
      { d: new Date('2023-01-02') },
      { d: new Date('2023-01-03') },
    ])
    expect(sortObjects([...arr], { d: SortDirection.DESC })).toEqual([
      { d: new Date('2023-01-03') },
      { d: new Date('2023-01-02') },
      { d: new Date('2023-01-01') },
    ])
  })
  it('ordena con null y undefined', () => {
    const arr = [{ x: 2 }, { x: null }, { x: 1 }, { x: undefined }]
    // Según la función, null > cualquier valor, undefined > null
    expect(sortObjects([...arr], { x: SortDirection.ASC })).toEqual([
      { x: 1 },
      { x: 2 },
      { x: undefined },
      { x: null },
    ])
    expect(sortObjects([...arr], { x: SortDirection.DESC })).toEqual([
      { x: null },
      { x: undefined },
      { x: 2 },
      { x: 1 },
    ])
  })
  it('ordena con tipos mixtos (string y number)', () => {
    const arr = [{ v: '10' }, { v: 2 }, { v: 'abc' }, { v: 1 }]
    // Según la función, se convierte a string y compara lexicográficamente
    expect(sortObjects([...arr], { v: SortDirection.ASC })).toEqual([
      { v: 1 },
      { v: '10' },
      { v: 2 },
      { v: 'abc' },
    ])
  })
  it('ordena por múltiples campos', () => {
    const arr = [
      { a: 1, b: 2 },
      { a: 1, b: 1 },
      { a: 2, b: 1 },
    ]
    expect(
      sortObjects([...arr], { a: SortDirection.ASC, b: SortDirection.DESC }),
    ).toEqual([
      { a: 1, b: 2 },
      { a: 1, b: 1 },
      { a: 2, b: 1 },
    ])
  })
})
