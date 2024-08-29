import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringContainsFilter', () => {
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

    expect(filter.findMany({ where: { name: { contains: 'Cerati' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { contains: 'Bob' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { contains: 'Mariana' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { contains: 'Alice' } } }).length).toBe(2)
    expect(filter.findMany({ where: { name: { contains: 'eva' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { contains: 'ank' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { contains: ' ' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { contains: '' } } }).length).toBe(12)

    expect(filter.findUnique({ where: { name: { contains: ' ' } } })?.name).toBe('Gustavo Cerati')
    expect(filter.findUnique({ where: { name: { contains: '' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { contains: 'Mariana' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { contains: 'Bob' } } })?.name).toBe('Bob')
    expect(filter.findUnique({ where: { name: { contains: 'Alice' } } })?.name).toBe('Alice')
  })
})
