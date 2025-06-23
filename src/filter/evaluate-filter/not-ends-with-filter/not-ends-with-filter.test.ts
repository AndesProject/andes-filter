import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { NotEndsWithFilter } from './not-ends-with-filter'

describe('NotEndsWithFilter', () => {
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
      filter.findMany({ where: { name: { notEndsWith: 'ice' } } }).data.length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'Cerati' } } }).data
        .length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'David' } } }).data.length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'smi' } } }).data.length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notEndsWith: ' ' } } }).data.length
    ).toBe(12)

    expect(
      filter.findUnique({ where: { name: { notEndsWith: ' ' } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notEndsWith: '' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { notEndsWith: 'Mariana' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notEndsWith: 'Bob' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notEndsWith: 'Alice' } } })?.name
    ).toBe('Bob')
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
        where: { name: { notEndsWith: 'alice', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notEndsWith: 'bob', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notEndsWith: 'eva', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notEndsWith: 'xyz', mode: 'insensitive' } },
      }).data.length
    ).toBe(5)

    expect(
      filter.findUnique({
        where: { name: { notEndsWith: 'alice', mode: 'insensitive' } },
      })?.name
    ).toBe('BOB')
    expect(
      filter.findUnique({
        where: { name: { notEndsWith: 'xyz', mode: 'insensitive' } },
      })?.name
    ).toBe('Alice')
  })

  it('null y undefined', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 'hello' },
      { value: 'world' },
    ])
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'hello' } } }).data
        .length
    ).toBe(3) // null, undefined, 'world'
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'world' } } }).data
        .length
    ).toBe(3) // null, undefined, 'hello'
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'xyz' } } }).data.length
    ).toBe(4) // todos
  })

  it('strings vacíos y casos especiales', () => {
    const filter = createFilterEngine<{ value: string }>([
      { value: '' },
      { value: 'hello' },
      { value: 'world' },
      { value: 'hello world' },
    ])
    expect(
      filter.findMany({ where: { value: { notEndsWith: '' } } }).data.length
    ).toBe(0) // todos terminan con string vacío
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'hello' } } }).data
        .length
    ).toBe(3) // todos excepto 'hello'
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'world' } } }).data
        .length
    ).toBe(2) // solo '' y 'hello' no terminan con 'world'
    expect(
      filter.findMany({ where: { value: { notEndsWith: 'hello world' } } }).data
        .length
    ).toBe(3) // todos excepto 'hello world'
  })
})

describe('NotEndsWithFilter Unit Tests', () => {
  it('debe retornar true si el string NO termina con la subcadena', () => {
    const filter = new NotEndsWithFilter('hello')
    expect(filter.evaluate('world')).toBe(true)
    expect(filter.evaluate('bye')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(true) // case sensitive por defecto
  })

  it('debe retornar false si el string termina con la subcadena', () => {
    const filter = new NotEndsWithFilter('hello')
    expect(filter.evaluate('say hello')).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
  })

  it('debe manejar modo case-insensitive', () => {
    const filter = new NotEndsWithFilter('hello', true)
    expect(filter.evaluate('say HELLO')).toBe(false)
    expect(filter.evaluate('say Hello')).toBe(false)
    expect(filter.evaluate('say hello')).toBe(false)
    expect(filter.evaluate('WORLD')).toBe(true)
  })

  it('debe manejar null y undefined', () => {
    const filter = new NotEndsWithFilter('hello')
    expect(filter.evaluate(null)).toBe(true) // null no termina con nada
    expect(filter.evaluate(undefined)).toBe(true) // undefined no termina con nada
  })

  it('debe manejar tipos no string', () => {
    const filter = new NotEndsWithFilter('hello')
    expect(filter.evaluate(123)).toBe(true) // números no terminan con strings
    expect(filter.evaluate({})).toBe(true) // objetos no terminan con strings
    expect(filter.evaluate([])).toBe(true) // arrays no terminan con strings
    expect(filter.evaluate(true)).toBe(true) // booleanos no terminan con strings
  })

  it('debe manejar strings vacíos', () => {
    const filter = new NotEndsWithFilter('')
    expect(filter.evaluate('hello')).toBe(false) // todos los strings terminan con string vacío
    expect(filter.evaluate('')).toBe(false) // string vacío termina con string vacío
    expect(filter.evaluate('world')).toBe(false) // todos los strings terminan con string vacío
  })
})
