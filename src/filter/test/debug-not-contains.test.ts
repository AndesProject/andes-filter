import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug NOT Contains Step by Step', () => {
  it('should debug NOT contains step by step', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = createFilter(data)
    const containsResult = filter.findMany({
      where: { name: { contains: 'lic' } },
    }).data
    const notContainsResult = filter.findMany({
      where: { name: { not: { contains: 'lic' } } },
    }).data
    data.forEach((item) => {
      const contains = item.name.includes('lic')
      const notContains = !contains
    })
    expect(notContainsResult).toHaveLength(2)
    expect(notContainsResult.map((r) => r.name)).toEqual(['Bob', 'ALICE'])
  })
})
