import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('LessThanFilter', () => {
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

    expect(filter.findMany({ where: { size: { lt: -2 } } }).length).toBe(0)
    expect(filter.findMany({ where: { size: { lt: -1 } } }).length).toBe(1)
    expect(filter.findMany({ where: { size: { lt: 0 } } }).length).toBe(2)
    expect(filter.findMany({ where: { size: { lt: 3 } } }).length).toBe(6)
    expect(filter.findMany({ where: { size: { lt: 100 } } }).length).toBe(7)

    expect(filter.findUnique({ where: { size: { lt: -2 } } })?.size).toBe(undefined)
    expect(filter.findUnique({ where: { size: { lt: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lt: 100 } } })?.size).toBe(-2)
  })
})
