import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringInsensitiveModeFilter', () => {
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
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'CERATI' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'BOB' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'MARIANA' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'ALICE' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'EVA' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: 'ANK' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', contains: ' ' } } }).length
    ).toBe(1)
    expect(filter.findMany({ where: { name: { mode: 'insensitive', contains: '' } } }).length).toBe(
      12
    )

    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', contains: ' ' } } })?.name
    ).toBe('Gustavo Cerati')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', contains: '' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', contains: 'MARIANA' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', contains: 'BOB' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', contains: 'ALICE' } } })?.name
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
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'CERATI' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'BOB' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'MARIANA' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'ALICE' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'EVA' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'ANK' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: ' ' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: '' } } }).length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'A' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', startsWith: 'GUS' } } }).length
    ).toBe(1)

    expect(filter.findUnique({ where: { name: { mode: 'insensitive', startsWith: ' ' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', startsWith: '' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', startsWith: 'MARIANA' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', startsWith: 'BOB' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', startsWith: 'ALICE' } } })?.name
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
      filter.findMany({ where: { name: { mode: 'insensitive', endsWith: 'ICE' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', endsWith: 'CERATI' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', endsWith: 'DAVID' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', endsWith: 'SMI' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { mode: 'insensitive', endsWith: ' ' } } }).length
    ).toBe(0)

    expect(filter.findUnique({ where: { name: { mode: 'insensitive', endsWith: ' ' } } })).toBe(
      null
    )
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', endsWith: '' } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', endsWith: 'MARIANA' } } })
    ).toBe(null)
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', endsWith: 'BOB' } } })?.name
    ).toBe('Bob')
    expect(
      filter.findUnique({ where: { name: { mode: 'insensitive', endsWith: 'ALICE' } } })?.name
    ).toBe('Alice')
  })
})
