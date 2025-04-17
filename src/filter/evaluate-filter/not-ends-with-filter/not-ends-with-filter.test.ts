import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringNotEndsWithFilter', () => {
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
      filter.findMany({ where: { name: { notEndsWith: 'ice' } } }).length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'Cerati' } } }).length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'David' } } }).length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { notEndsWith: 'smi' } } }).length
    ).toBe(12)
    expect(
      filter.findMany({ where: { name: { notEndsWith: ' ' } } }).length
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
})
