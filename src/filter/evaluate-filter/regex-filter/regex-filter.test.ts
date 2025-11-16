import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { RegexFilter } from './regex-filter'
describe('RegexFilter', () => {
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
      filter.findMany({ where: { name: { regex: '^Alice$' } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { regex: '^G' } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { regex: 'a$' } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { regex: '^[A-Z]' } } }).data.length,
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { regex: '^[0-9]' } } }).data.length,
    ).toBe(0)
  })
  it('should handle null and undefined values correctly', () => {
    const filter = createFilter<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { regex: 'hello' } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { regex: 'world' } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { regex: 'xyz' } } }).data.length,
    ).toBe(0)
  })
  it('patrones de regex especiales', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'hello123' },
      { value: 'world456' },
      { value: 'test' },
      { value: '123abc' },
    ])
    const result = filter.findMany({ where: { value: { regex: '\\d+' } } })
    expect(result.data.length).toBe(3)
    expect(
      filter.findMany({ where: { value: { regex: '^\\d' } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { regex: '[a-z]+' } } }).data.length,
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { regex: '^[a-z]+$' } } }).data.length,
    ).toBe(1)
  })
  it('patrones de regex inválidos', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { regex: '[' } } }).data.length,
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { regex: '(' } } }).data.length,
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { regex: '\\' } } }).data.length,
    ).toBe(0)
  })
  it('regex con flags como string', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'Hello' },
      { value: 'hello' },
      { value: 'HELLO' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { regex: '^hello$' } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: '^hello$', flags: 'i' } } },
      }).data.length,
    ).toBe(3)
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: 'hello', flags: 'i' } } },
      }).data.length,
    ).toBe(3)
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: 'bye', flags: 'i' } } },
      }).data.length,
    ).toBe(0)
  })
  it('regex como objeto con flags edge cases', () => {
    const filter = createFilter<{ value: string }>([
      { value: 'abc123' },
      { value: 'ABC123' },
      { value: 'def456' },
    ])
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: '\\d+', flags: 'g' } } },
      }).data.length,
    ).toBe(3)
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: 'abc', flags: 'gi' } } },
      }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({
        where: { value: { regex: { pattern: 'abc', flags: 'z' } } },
      }).data.length,
    ).toBe(0)
  })
})
describe('RegexFilter Unit Tests', () => {
  it('debe retornar true si el string coincide con el patrón', () => {
    const filter = new RegexFilter('^hello$')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('world')).toBe(false)
  })
  it('debe manejar patrones de regex complejos', () => {
    const filter = new RegexFilter('^[A-Z][a-z]+$')
    expect(filter.evaluate('Hello')).toBe(true)
    expect(filter.evaluate('WORLD')).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate('123')).toBe(false)
  })
  it('debe manejar patrones con números', () => {
    const filter = new RegexFilter('\\d+')
    expect(filter.evaluate('hello123')).toBe(true)
    expect(filter.evaluate('123world')).toBe(true)
    expect(filter.evaluate('hello')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('debe manejar patrones con caracteres especiales', () => {
    const filter = new RegexFilter('^[a-zA-Z0-9]+$')
    expect(filter.evaluate('hello123')).toBe(true)
    expect(filter.evaluate('HelloWorld')).toBe(true)
    expect(filter.evaluate('hello-world')).toBe(false)
    expect(filter.evaluate('hello world')).toBe(false)
  })
  it('should handle null and undefined values', () => {
    const filter = new RegexFilter('hello')
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
  it('should handle non-string data types', () => {
    const filter = new RegexFilter('hello')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
  })
  it('debe manejar patrones de regex inválidos', () => {
    const filter = new RegexFilter('[')
    expect(filter.evaluate('hello')).toBe(false)
    const filter2 = new RegexFilter('(')
    expect(filter2.evaluate('hello')).toBe(false)
    const filter3 = new RegexFilter('\\')
    expect(filter3.evaluate('hello')).toBe(false)
  })
  it('should handle empty string filters', () => {
    const filter = new RegexFilter('^$')
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('hello')).toBe(false)
    const filter2 = new RegexFilter('.*')
    expect(filter2.evaluate('')).toBe(true)
    expect(filter2.evaluate('hello')).toBe(true)
  })
})
