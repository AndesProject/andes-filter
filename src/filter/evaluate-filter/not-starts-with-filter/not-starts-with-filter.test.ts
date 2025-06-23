import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { NotStartsWithFilter } from './not-starts-with-filter'

describe('NotStartsWithFilter', () => {
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
      filter.findMany({ where: { name: { notStartsWith: 'Cerati' } } }).data
        .length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'Bob' } } }).data.length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'Mariana' } } }).data
        .length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'Alice' } } }).data
        .length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'eva' } } }).data.length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'ank' } } }).data.length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notStartsWith: ' ' } } }).data.length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notStartsWith: '' } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'A' } } }).data.length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { notStartsWith: 'Gus' } } }).data.length
    ).toBe(11)

    expect(
      filter.findUnique({ where: { name: { notStartsWith: ' ' } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notStartsWith: '' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { notStartsWith: 'Mariana' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notStartsWith: 'Bob' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { notStartsWith: 'Alice' } } })?.name
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
        where: { name: { notStartsWith: 'alice', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notStartsWith: 'bob', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notStartsWith: 'eva', mode: 'insensitive' } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: { name: { notStartsWith: 'xyz', mode: 'insensitive' } },
      }).data.length
    ).toBe(5)

    expect(
      filter.findUnique({
        where: { name: { notStartsWith: 'alice', mode: 'insensitive' } },
      })?.name
    ).toBe('BOB')
    expect(
      filter.findUnique({
        where: { name: { notStartsWith: 'xyz', mode: 'insensitive' } },
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
      filter.findMany({ where: { value: { notStartsWith: 'hello' } } }).data
        .length
    ).toBe(3) // null, undefined, 'world'
    expect(
      filter.findMany({ where: { value: { notStartsWith: 'world' } } }).data
        .length
    ).toBe(3) // null, undefined, 'hello'
    expect(
      filter.findMany({ where: { value: { notStartsWith: 'xyz' } } }).data
        .length
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
      filter.findMany({ where: { value: { notStartsWith: '' } } }).data.length
    ).toBe(0) // todos empiezan con string vacío
    expect(
      filter.findMany({ where: { value: { notStartsWith: 'hello' } } }).data
        .length
    ).toBe(2) // solo '' y 'world' no empiezan con 'hello'
    expect(
      filter.findMany({ where: { value: { notStartsWith: 'world' } } }).data
        .length
    ).toBe(3) // todos excepto 'world'
    expect(
      filter.findMany({ where: { value: { notStartsWith: 'hello world' } } })
        .data.length
    ).toBe(3) // todos excepto 'hello world'
  })
})

describe('NotStartsWithFilter Unit Tests', () => {
  it('debe retornar true si el string NO empieza con la subcadena', () => {
    const filter = new NotStartsWithFilter('hello')
    expect(filter.evaluate('world')).toBe(true)
    expect(filter.evaluate('bye')).toBe(true)
    expect(filter.evaluate('')).toBe(true)
    expect(filter.evaluate('HELLO')).toBe(true) // case sensitive por defecto
  })

  it('debe retornar false si el string empieza con la subcadena', () => {
    const filter = new NotStartsWithFilter('hello')
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('hello')).toBe(false)
  })

  it('debe manejar modo case-insensitive', () => {
    const filter = new NotStartsWithFilter('hello', true)
    expect(filter.evaluate('HELLO WORLD')).toBe(false)
    expect(filter.evaluate('Hello World')).toBe(false)
    expect(filter.evaluate('hello world')).toBe(false)
    expect(filter.evaluate('WORLD')).toBe(true)
  })

  it('debe manejar null y undefined', () => {
    const filter = new NotStartsWithFilter('hello')
    expect(filter.evaluate(null)).toBe(true) // null no empieza con nada
    expect(filter.evaluate(undefined)).toBe(true) // undefined no empieza con nada
  })

  it('debe manejar tipos no string', () => {
    const filter = new NotStartsWithFilter('hello')
    expect(filter.evaluate(123)).toBe(true) // números no empiezan con strings
    expect(filter.evaluate({})).toBe(true) // objetos no empiezan con strings
    expect(filter.evaluate([])).toBe(true) // arrays no empiezan con strings
    expect(filter.evaluate(true)).toBe(true) // booleanos no empiezan con strings
  })

  it('debe manejar strings vacíos', () => {
    const filter = new NotStartsWithFilter('')
    expect(filter.evaluate('hello')).toBe(false) // todos los strings empiezan con string vacío
    expect(filter.evaluate('')).toBe(false) // string vacío empieza con string vacío
    expect(filter.evaluate('world')).toBe(false) // todos los strings empiezan con string vacío
  })
})
