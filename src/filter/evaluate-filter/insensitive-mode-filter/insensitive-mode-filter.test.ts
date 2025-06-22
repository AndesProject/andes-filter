import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { ContainsFilter } from '../contains-filter/contains-filter'
import { StartsWithFilter } from '../starts-with-filter/starts-with-filter'
import { InsensitiveModeFilter } from './insensitive-mode-filter'

describe('InsensitiveModeFilter', () => {
  it('contains string', () => {
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
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'CERATI' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'BOB' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'MARIANA' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'ALICE' } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'EVA' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'ANK' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: ' ' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: '' } },
      }).data.length
    ).toBe(12)

    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', contains: ' ' } },
      })?.name
    ).toBe('Gustavo Cerati')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', contains: '' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', contains: 'MARIANA' } },
      })
    ).toBe(null)
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', contains: 'BOB' } },
      })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', contains: 'ALICE' } },
      })?.name
    ).toBe('Alice')
  })

  it('startsWith string', () => {
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
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'CERATI' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'BOB' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'MARIANA' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'ALICE' } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'EVA' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'ANK' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: ' ' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: '' } },
      }).data.length
    ).toBe(12)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'A' } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', startsWith: 'GUS' } },
      }).data.length
    ).toBe(1)

    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', startsWith: ' ' } },
      })
    ).toBe(null)
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', startsWith: '' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', startsWith: 'MARIANA' } },
      })
    ).toBe(null)
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', startsWith: 'BOB' } },
      })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', startsWith: 'ALICE' } },
      })?.name
    ).toBe('Alice')
  })

  it('endsWith string', () => {
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
      filter.findMany({
        where: { name: { mode: 'insensitive', endsWith: 'ICE' } },
      }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', endsWith: 'CERATI' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', endsWith: 'DAVID' } },
      }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', endsWith: 'SMI' } },
      }).data.length
    ).toBe(0)
    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', endsWith: ' ' } },
      }).data.length
    ).toBe(0)

    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', endsWith: ' ' } },
      })
    ).toBe(null)
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', endsWith: '' } },
      })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', endsWith: 'MARIANA' } },
      })
    ).toBe(null)
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', endsWith: 'BOB' } },
      })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({
        where: { name: { mode: 'insensitive', endsWith: 'ALICE' } },
      })?.name
    ).toBe('Alice')
  })

  it('multi string', () => {
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
      filter.findMany({
        where: {
          name: { mode: 'insensitive', contains: 'ra', startsWith: 'f' },
        },
      }).data.length
    ).toBe(1)

    expect(
      filter.findMany({
        where: { name: { mode: 'insensitive', contains: 'ra', not: 'Frank' } },
      }).data.length
    ).toBe(2)

    expect(
      filter.findMany({
        where: {
          name: {
            mode: 'insensitive',
            contains: 'ra',
            not: 'Frank',
            notIn: ['Gustavo Cerati'],
          },
        },
      }).data.length
    ).toBe(1)
  })
})

describe('InsensitiveModeFilter Unit Tests', () => {
  it('debe retornar true si todos los filtros retornan true', () => {
    const containsFilter = new ContainsFilter('hello', true)
    const startsWithFilter = new StartsWithFilter('hello', true)
    const modeFilter = new InsensitiveModeFilter([
      containsFilter,
      startsWithFilter,
    ])

    expect(modeFilter.evaluate('hello world')).toBe(true) // contiene y empieza con 'hello'
    expect(modeFilter.evaluate('hello')).toBe(true) // contiene y empieza con 'hello'
  })

  it('debe retornar false si algún filtro retorna false', () => {
    const containsFilter = new ContainsFilter('hello', true)
    const startsWithFilter = new StartsWithFilter('hello', true)
    const modeFilter = new InsensitiveModeFilter([
      containsFilter,
      startsWithFilter,
    ])

    expect(modeFilter.evaluate('world hello')).toBe(false) // contiene pero no empieza con 'hello'
    expect(modeFilter.evaluate('bye')).toBe(false) // no contiene ni empieza con 'hello'
  })

  it('debe manejar arrays vacíos de filtros', () => {
    const modeFilter = new InsensitiveModeFilter([])
    expect(modeFilter.evaluate('hello')).toBe(true)
    expect(modeFilter.evaluate('world')).toBe(true)
    expect(modeFilter.evaluate('')).toBe(true)
  })

  it('debe manejar null y undefined', () => {
    const containsFilter = new ContainsFilter('hello', true)
    const modeFilter = new InsensitiveModeFilter([containsFilter])

    expect(modeFilter.evaluate(null)).toBe(false)
    expect(modeFilter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar tipos no string', () => {
    const containsFilter = new ContainsFilter('hello', true)
    const modeFilter = new InsensitiveModeFilter([containsFilter])

    expect(modeFilter.evaluate(123)).toBe(false)
    expect(modeFilter.evaluate({})).toBe(false)
    expect(modeFilter.evaluate([])).toBe(false)
    expect(modeFilter.evaluate(true)).toBe(false)
  })
})
