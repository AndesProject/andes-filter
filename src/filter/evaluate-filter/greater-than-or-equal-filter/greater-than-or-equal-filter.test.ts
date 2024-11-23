import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('GreaterThanOrEqualFilter', () => {
  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: -2 },
      { size: -1 },
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])

    expect(filter.findMany({ where: { size: { gte: -2 } } }).length).toBe(7)
    expect(filter.findMany({ where: { size: { gte: -1 } } }).length).toBe(6)
    expect(filter.findMany({ where: { size: { gte: 0 } } }).length).toBe(5)
    expect(filter.findMany({ where: { size: { gte: 3 } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { gte: 100 } } }).length).toBe(0)

    expect(filter.findUnique({ where: { size: { gte: -3 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gte: -2 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gte: -1 } } })?.size).toBe(-1)
    expect(filter.findUnique({ where: { size: { gte: 100 } } })?.size).toBe(undefined)
  })
})
