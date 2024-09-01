import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringNotStartsWithFilter', () => {
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

    expect(filter.findMany({ where: { name: { notStartsWith: 'Cerati' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notStartsWith: 'Bob' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notStartsWith: 'Mariana' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notStartsWith: 'Alice' } } }).length).toBe(10)
    expect(filter.findMany({ where: { name: { notStartsWith: 'eva' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notStartsWith: 'ank' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notStartsWith: ' ' } } }).length).toBe(12)
    expect(filter.findMany({ where: { name: { notStartsWith: '' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { notStartsWith: 'A' } } }).length).toBe(10)
    expect(filter.findMany({ where: { name: { notStartsWith: 'Gus' } } }).length).toBe(11)

    expect(filter.findUnique({ where: { name: { notStartsWith: ' ' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notStartsWith: '' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { notStartsWith: 'Mariana' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notStartsWith: 'Bob' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notStartsWith: 'Alice' } } })?.name).toBe('Bob')
  })
})
