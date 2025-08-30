import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug NOT Every Filter', () => {
  it('should debug NOT every behavior', () => {
    const data = [
      { id: 1, arr: [1, 1, 1] },
      { id: 2, arr: [1, 2, 1] },
      { id: 3, arr: [2, 2, 2] },
      { id: 4, arr: [] },
    ]
    const filter = createFilter(data)
    data.forEach((item) => {
      const result = filter.findMany({
        where: { arr: { every: { equals: 2 } } },
      }).data
    })
    data.forEach((item) => {
      const result = filter.findMany({
        where: { arr: { not: { every: { equals: 2 } } } },
      }).data
    })
    data.forEach((item) => {
      const every = item.arr.length > 0 && item.arr.every((x) => x === 2)
      const notEvery = !every
    })
    const result = filter.findMany({
      where: { arr: { not: { every: { equals: 2 } } } },
    }).data
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.arr)).toEqual([
      [1, 1, 1],
      [1, 2, 1],
    ])
  })
})
