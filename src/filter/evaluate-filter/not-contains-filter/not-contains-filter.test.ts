import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { NotContainsFilter } from './not-contains-filter'
describe('NotContainsFilter', () => {
  it('should filter string values correctly', () => {
    const filter = createFilter<{ name: string }>([
      { name: 'Alice' },
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eva' },
      { name: 'Frank' },
      { name: 'Grace' },
      { name: 'Hannah' },
      { name: 'Isaac' },
      { name: 'Jasmine' },
      { name: 'Gustavo Cerati' },
    ])
    expect(
      filter.findMany({ where: { name: { notContains: 'Gustavo Cerati' } } })
        .data.length,
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notContains: 'Bob' } } }).data.length,
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notContains: 'Mariana' } } }).data
        .length,
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notContains: 'Alice' } } }).data
        .length,
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { notContains: 'eva' } } }).data.length,
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notContains: 'ank' } } }).data.length,
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notContains: ' ' } } }).data.length,
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notContains: '' } } }).data.length,
    ).toBe(0)
    expect(
      filter.findUnique({ where: { name: { notContains: ' ' } } })?.name,
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notContains: '' } } })).toBe(
      null,
    )
    expect(
      filter.findUnique({ where: { name: { notContains: 'Mariana' } } })?.name,
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notContains: 'Bob' } } })?.name,
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notContains: 'Alice' } } })?.name,
    ).toBe('Bob')
  })
  it('should handle case insensitive filtering correctly', () => {
    const filter = createFilter<{ name: string }>([
      { name: 'Alice' },
      { name: 'BOB' },
      { name: 'Charlie' },
      { name: 'david' },
      { name: 'EVA' },
    ])
    expect(
      filter.findMany({
        where: { name: { notContains: 'alice', mode: 'insensitive' } },
      }).data.length,
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notContains: 'bob', mode: 'insensitive' } },
      }).data.length,
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notContains: 'EVA', mode: 'insensitive' } },
      }).data.length,
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notContains: 'xyz', mode: 'insensitive' } },
      }).data.length,
    ).toBe(5)
    expect(
      filter.findUnique({
        where: { name: { notContains: 'alice', mode: 'insensitive' } },
      })?.name,
    ).toBe('BOB')
    expect(
      filter.findUnique({
        where: { name: { notContains: 'xyz', mode: 'insensitive' } },
      })?.name,
    ).toBe('Alice')
  })
  it('should handle null and undefined values correctly', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { notContains: 'hello' } } }).data
        .length,
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { notContains: 'world' } } }).data
        .length,
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { notContains: 'xyz' } } }).data.length,
    ).toBe(4)
  })
  it('should handle empty strings and special cases correctly', () => {
    const filter = createFilter<{ value: string }>([
      { value: '' },
      { value: 'hello' },
      { value: 'world' },
      { value: 'hello world' },
    ])
    expect(
      filter.findMany({ where: { value: { notContains: '' } } }).data.length,
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { notContains: 'hello' } } }).data
        .length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { notContains: 'world' } } }).data
        .length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { notContains: 'hello world' } } }).data
        .length,
    ).toBe(3)
  })
})
describe('NotContainsFilter Unit Tests', () => {
  it('debe retornar true si el string NO contiene la subcadena', () => {
    const filter = new NotContainsFilter('hello')
    expect(filter.evaluate('world')).toBe(true)
    expect(filter.evaluate('bye')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(true)
  })
  it('debe retornar false si el string contiene la subcadena', () => {
    const filter = new NotContainsFilter('hello')
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('world hello')).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
  })
  it('should handle case-insensitive mode correctly', () => {
    const filter = new NotContainsFilter('hello', true)
    expect(filter.evaluate('HELLO WORLD')).toBe(false)
    expect(filter.evaluate('Hello World')).toBe(false)
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('WORLD')).toBe(true)
  })
  it('should handle null and undefined values', () => {
    const filter = new NotContainsFilter('hello')
    expect(filter.evaluate(null)).toBe(true)
    expect(filter.evaluate(undefined)).toBe(true)
  })
  it('should handle non-string data types', () => {
    const filter = new NotContainsFilter('hello')
    expect(filter.evaluate(123)).toBe(true)
    expect(filter.evaluate({})).toBe(true)
    expect(filter.evaluate([])).toBe(true)
    expect(filter.evaluate(true)).toBe(true)
  })
  it('should handle empty string filters', () => {
    const filter = new NotContainsFilter('')
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
    expect(filter.evaluate('world')).toBe(false)
  })
})
