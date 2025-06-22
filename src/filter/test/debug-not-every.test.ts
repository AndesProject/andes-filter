import { describe, expect, it } from 'vitest'
import { filterFrom } from '../filter-from'

describe('Debug NOT Every Filter', () => {
  it('should debug NOT every behavior', () => {
    const data = [
      { id: 1, arr: [1, 1, 1] },
      { id: 2, arr: [1, 2, 1] },
      { id: 3, arr: [2, 2, 2] },
      { id: 4, arr: [] },
    ]
    const filter = filterFrom(data)

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

    // Individual evaluation
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

    // Según Prisma/TypeORM:
    // [1,1,1]: every({ equals: 2 }) = false, NOT = true ✅
    // [1,2,1]: every({ equals: 2 }) = false, NOT = true ✅
    // [2,2,2]: every({ equals: 2 }) = true, NOT = false ❌
    // []: every({ equals: 2 }) = true, NOT = false ❌
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.arr)).toEqual([
      [1, 1, 1],
      [1, 2, 1],
    ])
  })
})
