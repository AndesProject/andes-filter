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
    console.log('=== Debug every: { equals: 2 } ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { arr: { every: { equals: 2 } } },
      }).data
      console.log(
        `${JSON.stringify(item.arr)}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })
    console.log('=== Debug NOT every: { equals: 2 } ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { arr: { not: { every: { equals: 2 } } } },
      }).data
      console.log(
        `${JSON.stringify(item.arr)}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })
    console.log('=== Individual evaluation ===')
    data.forEach((item) => {
      const every = item.arr.length > 0 && item.arr.every((x) => x === 2)
      const notEvery = !every
      console.log(
        `${JSON.stringify(item.arr)}: every({ equals: 2 }) = ${every}, NOT every({ equals: 2 }) = ${notEvery}`
      )
    })
    const result = filter.findMany({
      where: { arr: { not: { every: { equals: 2 } } } },
    }).data
    console.log(
      'Result:',
      result.map((r) => r.arr)
    )
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.arr)).toEqual([
      [1, 1, 1],
      [1, 2, 1],
    ])
  })
})
