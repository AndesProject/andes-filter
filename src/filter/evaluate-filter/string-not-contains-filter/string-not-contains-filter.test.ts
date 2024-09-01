import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringNotContainsFilter', () => {
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

    expect(filter.findMany({ where: { name: { notContains: 'Gustavo Cerati' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notContains: 'Bob' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notContains: 'Mariana' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notContains: 'Alice' } } }).length).toBe(10)
    expect(filter.findMany({ where: { name: { notContains: 'eva' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notContains: 'ank' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notContains: ' ' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notContains: '' } } }).length).toBe(0)

    expect(filter.findUnique({ where: { name: { notContains: ' ' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notContains: '' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { notContains: 'Mariana' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notContains: 'Bob' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notContains: 'Alice' } } })?.name).toBe('Bob')
  })
})
