import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('Debug EndsWith Filter', () => {
  it('should debug endsWith behavior', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = createFilterEngine(data)
    console.log('=== Debug endsWith: e ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { endsWith: 'e' } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })
    console.log('=== Debug NOT endsWith: e ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { not: { endsWith: 'e' } } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })
    console.log('=== Individual evaluation ===')
    data.forEach((item) => {
      const endsWith = item.name.endsWith('e')
      const notEndsWith = !endsWith
      console.log(
        `${item.name}: endsWith('e') = ${endsWith}, NOT endsWith('e') = ${notEndsWith}`
      )
    })
    const result = filter.findMany({
      where: { name: { not: { endsWith: 'e' } } },
    }).data
    console.log(
      'Result:',
      result.map((r) => r.name)
    )
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.name)).toEqual(['Bob', 'ALICE'])
  })
})
