import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('LessThanOrEqualFilter', () => {
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

    expect(filter.findMany({ where: { size: { lte: -2 } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { lte: -1 } } }).length).toBe(2)
    expect(filter.findMany({ where: { size: { lte: 0 } } }).length).toBe(4)
    expect(filter.findMany({ where: { size: { lte: 3 } } }).length).toBe(7)
    expect(filter.findMany({ where: { size: { lte: 100 } } }).length).toBe(7)

    expect(filter.findUnique({ where: { size: { lte: -3 } } })?.size).toBe(
      undefined
    )
    expect(filter.findUnique({ where: { size: { lte: -2 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: 100 } } })?.size).toBe(-2)
  })
})
