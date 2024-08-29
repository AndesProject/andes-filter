import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringEndsWithFilter', () => {
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

    expect(filter.findMany({ where: { name: { endsWith: 'ice' } } }).length).toBe(2)
    expect(filter.findMany({ where: { name: { endsWith: 'Cerati' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { endsWith: 'David' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { endsWith: 'smi' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { endsWith: ' ' } } }).length).toBe(0)

    expect(filter.findUnique({ where: { name: { endsWith: ' ' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { endsWith: '' } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { endsWith: 'Mariana' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { endsWith: 'Bob' } } })?.name).toBe('Bob')
    expect(filter.findUnique({ where: { name: { endsWith: 'Alice' } } })?.name).toBe('Alice')
  })
})
