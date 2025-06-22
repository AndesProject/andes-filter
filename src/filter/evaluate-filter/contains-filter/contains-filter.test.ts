import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { ContainsFilter } from './contains-filter'

describe('ContainsFilter', () => {
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
      filter.findMany({ where: { name: { contains: 'Cerati' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { contains: 'Bob' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { contains: 'Mariana' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { contains: 'Alice' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { contains: 'eva' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { contains: 'ank' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { contains: ' ' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { contains: '' } } }).data.length
    ).toBe(12)

    expect(
      filter.findUnique({ where: { name: { contains: ' ' } } })?.name
    ).toBe('Gustavo Cerati')
    expect(filter.findUnique({ where: { name: { contains: '' } } })?.name).toBe(
      'Alice'
    )
    expect(
      filter.findUnique({ where: { name: { contains: 'Mariana' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { contains: 'Bob' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { contains: 'Alice' } } })?.name
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
        where: { name: { contains: 'alice', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { contains: 'bob', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { contains: 'EVA', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { contains: 'char', mode: 'insensitive' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { contains: 'xyz', mode: 'insensitive' } },
      }).data.length
    ).toBe(0)

    expect(
      filter.findUnique({
        where: { name: { contains: 'alice', mode: 'insensitive' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { contains: 'xyz', mode: 'insensitive' } },
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
      filter.findMany({ where: { value: { contains: 'hello' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { contains: 'world' } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { contains: 'xyz' } } }).data.length
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
      filter.findMany({ where: { value: { contains: '' } } }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { value: { contains: 'hello' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { contains: 'world' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { contains: 'hello world' } } }).data
        .length
    ).toBe(1)
  })
})

describe('ContainsFilter Unit Tests', () => {
  it('debe retornar true si el string contiene la subcadena', () => {
    const filter = new ContainsFilter('hello')
    expect(filter.evaluate('hello world')).toBe(true)
    expect(filter.evaluate('world hello')).toBe(true)
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(false) // case sensitive por defecto
  })

  it('debe retornar false si el string no contiene la subcadena', () => {
    const filter = new ContainsFilter('hello')
    expect(filter.evaluate('world')).toBe(false)
    expect(filter.evaluate('bye')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })

  it('debe manejar modo case-insensitive', () => {
    const filter = new ContainsFilter('hello', true)
    expect(filter.evaluate('HELLO WORLD')).toBe(true)
    expect(filter.evaluate('Hello World')).toBe(true)
    expect(filter.evaluate('hello world')).toBe(true)
    expect(filter.evaluate('WORLD')).toBe(false)
  })

  it('debe manejar null y undefined', () => {
    const filter = new ContainsFilter('hello')
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar tipos no string', () => {
    const filter = new ContainsFilter('hello')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate(true)).toBe(false)
  })

  it('debe manejar strings vacíos', () => {
    const filter = new ContainsFilter('')
    expect(filter.evaluate('hello')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('world')).toBe(true)
  })
})
