import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('InclusionFilter', () => {
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

    expect(filter.findMany({ where: { name: { in: [''] } } }).length).toBe(0)
    expect(filter.findMany({ where: { name: { in: ['Alice'] } } }).length).toBe(
      2
    )
    expect(
      filter.findMany({ where: { name: { in: ['Alice', 'Bob'] } } }).length
    ).toBe(3)
    expect(filter.findMany({ where: { name: { in: ['David'] } } }).length).toBe(
      1
    )

    expect(filter.findUnique({ where: { name: { in: [''] } } })?.name).toBe(
      undefined
    )
    expect(
      filter.findUnique({ where: { name: { in: ['David'] } } })?.name
    ).toBe('David')
    expect(
      filter.findUnique({ where: { name: { in: ['David', 'Alice'] } } })?.name
    ).toBe('Alice')
    expect(
      filter.findUnique({ where: { name: { in: ['Alice', 'David'] } } })?.name
    ).toBe('Alice')
  })

  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
      { size: 0.5 },
    ])

    expect(filter.findMany({ where: { size: { in: [0] } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { in: [1] } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { in: [1, 2] } } }).length).toBe(2)

    expect(filter.findUnique({ where: { size: { in: [1024] } } })?.size).toBe(
      undefined
    )
    expect(filter.findUnique({ where: { size: { in: [1] } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { in: [0, 1] } } })?.size).toBe(0)
    expect(filter.findUnique({ where: { size: { in: [1, 0] } } })?.size).toBe(0)
  })

  it('boolean', () => {
    const filter = filterFrom<{ isValid: boolean }>([
      { isValid: false },
      { isValid: false },
      { isValid: true },
      { isValid: false },
      { isValid: true },
    ])

    expect(
      filter.findMany({ where: { isValid: { in: [false] } } }).length
    ).toBe(3)
    expect(filter.findMany({ where: { isValid: { in: [true] } } }).length).toBe(
      2
    )
    expect(
      filter.findMany({ where: { isValid: { in: [false, true] } } }).length
    ).toBe(5)

    expect(
      filter.findUnique({ where: { isValid: { in: [false] } } })?.isValid
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { in: [true] } } })?.isValid
    ).toBe(true)
  })
})
