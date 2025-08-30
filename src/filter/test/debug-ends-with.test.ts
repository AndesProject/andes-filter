import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug EndsWith Filter', () => {
  it('should debug endsWith behavior', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = createFilter(data)
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { endsWith: 'e' } },
      }).data
    })
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { not: { endsWith: 'e' } } },
      }).data
    })
    data.forEach((item) => {
      const endsWith = item.name.endsWith('e')
      const notEndsWith = !endsWith
    })
    const result = filter.findMany({
      where: { name: { not: { endsWith: 'e' } } },
    }).data
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.name)).toEqual(['Bob', 'ALICE'])
  })
})
