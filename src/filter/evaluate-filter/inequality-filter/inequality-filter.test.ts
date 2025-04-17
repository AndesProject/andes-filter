import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('InequalityFilter', () => {
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

    expect(filter.findMany({ where: { name: { not: 'Alice' } } }).length).toBe(
      9
    )
    expect(filter.findMany({ where: { name: { not: 'Bob' } } }).length).toBe(10)
    expect(filter.findMany({ where: { name: { not: 'Andrea' } } }).length).toBe(
      11
    )
    expect(filter.findMany({ where: { name: { not: '' } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { not: null } } }).length).toBe(11)
    expect(
      filter.findMany({ where: { name: { not: undefined } } }).length
    ).toBe(11)

    expect(
      filter.findUnique({ where: { name: { not: undefined } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Alice' } } })?.name).toBe(
      'Bob'
    )
    expect(
      filter.findUnique({ where: { name: { not: 'Jasmine' } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Isaac' } } })?.name).toBe(
      'Alice'
    )
  })
  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: 1 },
      { size: 2 },
      { size: 3 },
      { size: 4 },
      { size: 5 },
    ])

    expect(filter.findMany({ where: { size: { not: 1 } } }).length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 2 } } }).length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 3 } } }).length).toBe(4)
    expect(filter.findMany({ where: { size: { not: null } } }).length).toBe(5)
    expect(
      filter.findMany({ where: { size: { not: undefined } } }).length
    ).toBe(5)

    expect(
      filter.findUnique({ where: { size: { not: undefined } } })?.size
    ).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 1 } } })?.size).toBe(2)
    expect(filter.findUnique({ where: { size: { not: 2 } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 3 } } })?.size).toBe(1)
  })
  it('boolean', () => {
    const filter = filterFrom<{ isValid: boolean }>([
      { isValid: true },
      { isValid: true },
      { isValid: false },
    ])

    expect(filter.findMany({ where: { isValid: { not: true } } }).length).toBe(
      1
    )
    expect(filter.findMany({ where: { isValid: { not: false } } }).length).toBe(
      2
    )
    expect(filter.findMany({ where: { isValid: { not: null } } }).length).toBe(
      3
    )
    expect(
      filter.findMany({ where: { isValid: { not: undefined } } }).length
    ).toBe(3)

    expect(
      filter.findUnique({ where: { isValid: { not: undefined } } })?.isValid
    ).toBe(true)
    expect(
      filter.findUnique({ where: { isValid: { not: true } } })?.isValid
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { not: false } } })?.isValid
    ).toBe(true)
  })
})
