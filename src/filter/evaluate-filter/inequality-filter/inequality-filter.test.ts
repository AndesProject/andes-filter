import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('InequalityFilter', () => {
  it('Filter', () => {
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
    ])

    expect(filter.findMany({ where: { name: { not: 'Alice' } } }).length).toBe(9)
    expect(filter.findMany({ where: { name: { not: 'Bob' } } }).length).toBe(10)
    expect(filter.findMany({ where: { name: { not: 'Andrea' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { not: '' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { not: null } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { not: undefined } } }).length).toBe(11)

    expect(filter.findUnique({ where: { name: { not: undefined } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Alice' } } })?.name).toBe('Bob')
    expect(filter.findUnique({ where: { name: { not: 'Jasmine' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Isaac' } } })?.name).toBe('Alice')
  })
})
