import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { StartsWithFilter } from './starts-with-filter'
describe('StartsWithFilter', () => {
  it('string', () => {
    const filter = createFilterEngine<{ name: string }>([
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
      filter.findMany({ where: { name: { startsWith: 'Cerati' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Bob' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Mariana' } } }).data
        .length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Alice' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { startsWith: 'eva' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'ank' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: ' ' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: '' } } }).data.length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { startsWith: 'A' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Gus' } } }).data.length
    ).toBe(1)
    expect(filter.findUnique({ where: { name: { startsWith: ' ' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { startsWith: '' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { startsWith: 'Mariana' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { startsWith: 'Bob' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { startsWith: 'Alice' } } })?.name
    ).toBe('Alice')
  })
  it('case insensitive', () => {
    const filter = createFilterEngine<{ name: string }>([
      { name: 'Alice' },
      { name: 'BOB' },
      { name: 'Charlie' },
      { name: 'david' },
      { name: 'EVA' },
    ])
    expect(
      filter.findMany({
        where: { name: { startsWith: 'alice', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { startsWith: 'bob', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { startsWith: 'eva', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { startsWith: 'char', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { startsWith: 'xyz', mode: 'insensitive' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findUnique({
        where: { name: { startsWith: 'alice', mode: 'insensitive' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { startsWith: 'xyz', mode: 'insensitive' } },
      })
    ).toBe(null)
  })
  it('null y undefined', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { startsWith: 'hello' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { startsWith: 'world' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { startsWith: 'xyz' } } }).data.length
    ).toBe(0)
  })
  it('strings vacíos y casos especiales', () => {
    const filter = createFilterEngine<{ value: string }>([
      { value: '' },
      { value: 'hello' },
      { value: 'world' },
      { value: 'hello world' },
    ])
    expect(
      filter.findMany({ where: { value: { startsWith: '' } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { startsWith: 'hello' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { startsWith: 'world' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { startsWith: 'hello world' } } }).data
        .length
    ).toBe(1)
  })
})
describe('StartsWithFilter Unit Tests', () => {
  it('debe retornar true si el string empieza con la subcadena', () => {
    const filter = new StartsWithFilter('hello')
    expect(filter.evaluate('hello world')).toBe(true)
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(false)
  })
  it('debe retornar false si el string no empieza con la subcadena', () => {
    const filter = new StartsWithFilter('hello')
    expect(filter.evaluate('world hello')).toBe(false)
    expect(filter.evaluate('world')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })
  it('debe manejar modo case-insensitive', () => {
    const filter = new StartsWithFilter('hello', true)
    expect(filter.evaluate('HELLO WORLD')).toBe(true)
    expect(filter.evaluate('Hello World')).toBe(true)
    expect(filter.evaluate('hello world')).toBe(true)
    expect(filter.evaluate('WORLD')).toBe(false)
  })
  it('debe manejar null y undefined', () => {
    const filter = new StartsWithFilter('hello')
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
  it('debe manejar tipos no string', () => {
    const filter = new StartsWithFilter('hello')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
  })
  it('debe manejar strings vacíos', () => {
    const filter = new StartsWithFilter('')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('world')).toBe(true)
  })
})
