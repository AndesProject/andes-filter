import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('GreaterThanFilter', () => {
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

    expect(filter.findMany({ where: { size: { gt: -2 } } }).length).toBe(6)
    expect(filter.findMany({ where: { size: { gt: -1 } } }).length).toBe(5)
    expect(filter.findMany({ where: { size: { gt: 0 } } }).length).toBe(3)
    expect(filter.findMany({ where: { size: { gt: 3 } } }).length).toBe(0)
    expect(filter.findMany({ where: { size: { gt: 100 } } }).length).toBe(0)

    expect(filter.findUnique({ where: { size: { gt: -3 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gt: -2 } } })?.size).toBe(-1)
    expect(filter.findUnique({ where: { size: { gt: -1 } } })?.size).toBe(0)
    expect(filter.findUnique({ where: { size: { gt: 100 } } })?.size).toBe(undefined)
  })
})
