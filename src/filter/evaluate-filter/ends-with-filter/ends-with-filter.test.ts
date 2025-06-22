import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { EndsWithFilter } from './ends-with-filter'

describe('EndsWithFilter', () => {
  it('string', () => {
    const filter = filterFrom<{ name: string }>([
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
      filter.findMany({ where: { name: { endsWith: 'ice' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { endsWith: 'Cerati' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { endsWith: 'David' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { endsWith: 'smi' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { endsWith: ' ' } } }).data.length
    ).toBe(0)

    expect(filter.findUnique({ where: { name: { endsWith: ' ' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { endsWith: '' } } })?.name).toBe(
      'Alice'
    )
    expect(
      filter.findUnique({ where: { name: { endsWith: 'Mariana' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { endsWith: 'Bob' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { endsWith: 'Alice' } } })?.name
    ).toBe('Alice')
  })

  it('case insensitive', () => {
    const filter = filterFrom<{ name: string }>([
      { name: 'Alice' },
      { name: 'BOB' },
      { name: 'Charlie' },
      { name: 'david' },
      { name: 'EVA' },
    ])

    expect(
      filter.findMany({
        where: { name: { endsWith: 'alice', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { endsWith: 'bob', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { endsWith: 'eva', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { endsWith: 'lie', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { endsWith: 'xyz', mode: 'insensitive' } },
      }).data.length
    ).toBe(0)

    expect(
      filter.findUnique({
        where: { name: { endsWith: 'alice', mode: 'insensitive' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { endsWith: 'xyz', mode: 'insensitive' } },
      })
    ).toBe(null)
  })

  it('null y undefined', () => {
    const filter = filterFrom<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { endsWith: 'hello' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { endsWith: 'world' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { endsWith: 'xyz' } } }).data.length
    ).toBe(0)
  })

  it('strings vacíos y casos especiales', () => {
    const filter = filterFrom<{ value: string }>([
      { value: '' },
      { value: 'hello' },
      { value: 'world' },
      { value: 'hello world' },
    ])
    expect(
      filter.findMany({ where: { value: { endsWith: '' } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { endsWith: 'hello' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { endsWith: 'world' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { endsWith: 'hello world' } } }).data
        .length
    ).toBe(1)
  })
})

describe('EndsWithFilter Unit Tests', () => {
  it('debe retornar true si el string termina con la subcadena', () => {
    const filter = new EndsWithFilter('hello')
    expect(filter.evaluate('say hello')).toBe(true)
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(false) // case sensitive por defecto
  })

  it('debe retornar false si el string no termina con la subcadena', () => {
    const filter = new EndsWithFilter('hello')
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('world')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })

  it('debe manejar modo case-insensitive', () => {
    const filter = new EndsWithFilter('hello', true)
    expect(filter.evaluate('say HELLO')).toBe(true)
    expect(filter.evaluate('say Hello')).toBe(true)
    expect(filter.evaluate('say hello')).toBe(true)
    expect(filter.evaluate('WORLD')).toBe(false)
  })

  it('debe manejar null y undefined', () => {
    const filter = new EndsWithFilter('hello')
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar tipos no string', () => {
    const filter = new EndsWithFilter('hello')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
  })

  it('debe manejar strings vacíos', () => {
    const filter = new EndsWithFilter('')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('world')).toBe(true)
  })
})
