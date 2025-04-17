import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StartsWithFilter', () => {
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
      filter.findMany({ where: { name: { startsWith: 'Cerati' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Bob' } } }).length
    ).toBe(1)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Mariana' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Alice' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { startsWith: 'eva' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: 'ank' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: ' ' } } }).length
    ).toBe(0)
    expect(
      filter.findMany({ where: { name: { startsWith: '' } } }).length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { startsWith: 'A' } } }).length
    ).toBe(2)
    expect(
      filter.findMany({ where: { name: { startsWith: 'Gus' } } }).length
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
})
