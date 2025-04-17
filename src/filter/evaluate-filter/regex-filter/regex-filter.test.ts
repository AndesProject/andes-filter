import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('StringRegexFilter', () => {
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
      filter.findMany({ where: { name: { regex: '^Alice$' } } }).length
    ).toBe(2)
    expect(filter.findMany({ where: { name: { regex: '^G' } } }).length).toBe(2)
    expect(filter.findMany({ where: { name: { regex: 'a$' } } }).length).toBe(1)
  })
})
