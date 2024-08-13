import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('ExclusionFilter', () => {
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

    expect(filter.findMany({ where: { name: { notIn: [''] } } }).length).toBe(11)
    expect(filter.findMany({ where: { name: { notIn: ['Alice'] } } }).length).toBe(9)
    expect(filter.findMany({ where: { name: { notIn: ['Alice', 'Bob'] } } }).length).toBe(8)
    expect(filter.findMany({ where: { name: { notIn: ['David'] } } }).length).toBe(10)

    expect(filter.findUnique({ where: { name: { notIn: [''] } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notIn: ['David'] } } })?.name).toBe('Alice')
    expect(filter.findUnique({ where: { name: { notIn: ['David', 'Alice'] } } })?.name).toBe('Bob')
    expect(filter.findUnique({ where: { name: { notIn: ['Alice', 'David'] } } })?.name).toBe('Bob')
  })

  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])

    expect(filter.findMany({ where: { size: { notIn: [0] } } }).length).toBe(3)
    expect(filter.findMany({ where: { size: { notIn: [1] } } }).length).toBe(4)
    expect(filter.findMany({ where: { size: { notIn: [0, 1] } } }).length).toBe(2)
    expect(filter.findMany({ where: { size: { notIn: [2] } } }).length).toBe(4)

    expect(filter.findUnique({ where: { size: { notIn: [0] } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { notIn: [1] } } })?.size).toBe(0)
    expect(filter.findUnique({ where: { size: { notIn: [0, 1] } } })?.size).toBe(2)
  })

  it('boolean', () => {
    const filter = filterFrom<{ isValid: boolean }>([
      { isValid: true },
      { isValid: true },
      { isValid: false },
      { isValid: true },
      { isValid: false },
    ])

    expect(filter.findMany({ where: { isValid: { notIn: [true] } } }).length).toBe(2)
    expect(filter.findMany({ where: { isValid: { notIn: [false] } } }).length).toBe(3)
    expect(filter.findMany({ where: { isValid: { notIn: [false, true] } } }).length).toBe(0)

    expect(filter.findUnique({ where: { isValid: { notIn: [true] } } })?.isValid).toBe(false)
    expect(filter.findUnique({ where: { isValid: { notIn: [false] } } })?.isValid).toBe(true)
    expect(filter.findUnique({ where: { isValid: { notIn: [true, false] } } })?.isValid).toBe(
      undefined
    )
  })
})
