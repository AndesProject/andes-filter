import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'

describe('Debug NOT Filter', () => {
  it('should debug NOT with contains', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = createFilterEngine(data)

    // Debug individual results
    console.log('=== Debug NOT contains ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { not: { contains: 'lic' } } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })

    const result = filter.findMany({
      where: { name: { not: { contains: 'lic' } } },
    }).data
    console.log(
      'Result:',
      result.map((r) => r.name)
    )
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.name)).toEqual(['Bob', 'ALICE'])
  })

  it('should debug NOT with every', () => {
    const data = [
      { id: 1, arr: [1, 1, 1] },
      { id: 2, arr: [1, 2, 1] },
      { id: 3, arr: [2, 2, 2] },
      { id: 4, arr: [] },
    ]
    const filter = createFilterEngine(data)

    // Debug individual results
    console.log('=== Debug NOT every ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { arr: { not: { every: { equals: 2 } } } },
      }).data
      console.log(
        `${JSON.stringify(item.arr)}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
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
