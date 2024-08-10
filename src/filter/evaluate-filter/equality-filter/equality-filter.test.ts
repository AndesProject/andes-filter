import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('EqualityFilter', () => {
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
    ])

    expect(filter.findMany({ where: { name: { equals: 'Bob' } } }).length).toBe(1)
    expect(filter.findMany({ where: { name: { equals: 'Mariana' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { equals: 'Alice' } } }).length).toBe(2)
    expect(filter.findMany({ where: { name: { equals: 'eva' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { equals: 'ank' } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { equals: null } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { equals: undefined } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { equals: '' } } }).length).toBe(0)

    expect(filter.findUnique({ where: { name: { equals: '' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: null } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: undefined } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: 'Mariana' } } })).toBe(null)
    expect(filter.findUnique({ where: { name: { equals: 'Bob' } } })?.name).toBe('Bob')
    expect(filter.findUnique({ where: { name: { equals: 'Alice' } } })?.name).toBe('Alice')
  })

  it('boolean', () => {
    const filter = filterFrom<{ isValid: boolean }>([
      { isValid: true },
      { isValid: false },
      { isValid: false },
    ])

    expect(filter.findMany({ where: { isValid: { equals: true } } }).length).toBe(1)
    expect(filter.findMany({ where: { isValid: { equals: false } } }).length).toBe(2)
    expect(filter.findMany({ where: { isValid: { equals: null } } }).length).toBe(0)
    expect(filter.findMany({ where: { isValid: { equals: undefined } } }).length).toBe(0)
  })

  it('numeric', () => {
    const filter = filterFrom<{ size: number }>([
      { size: 10 },
      { size: 11 },
      { size: 12 },
      { size: 12 },
      { size: 0.5 },
    ])

    expect(filter.findMany({ where: { size: { equals: 0.5 } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { equals: 10 } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { equals: 0 } } }).length).toBe(0)
    expect(filter.findMany({ where: { size: { equals: 1 } } }).length).toBe(0)
    expect(filter.findMany({ where: { size: { equals: 12 } } }).length).toBe(2)
    expect(filter.findMany({ where: { size: { equals: null } } }).length).toBe(0)
    expect(filter.findMany({ where: { size: { equals: undefined } } }).length).toBe(0)
  })
})
