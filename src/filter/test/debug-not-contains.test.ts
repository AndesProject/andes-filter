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
    console.log('=== Step by step debug ===')
    console.log('1. Testing contains: lic directly')
    const containsResult = filter.findMany({
      where: { name: { contains: 'lic' } },
    }).data
    console.log(
      'Contains result:',
      containsResult.map((r) => r.name)
    )
    console.log('2. Testing NOT contains: lic')
    const notContainsResult = filter.findMany({
      where: { name: { not: { contains: 'lic' } } },
    }).data
    console.log(
      'NOT contains result:',
      notContainsResult.map((r) => r.name)
    )
    console.log('3. Individual evaluation')
    data.forEach((item) => {
      const contains = item.name.includes('lic')
      const notContains = !contains
      console.log(
        `${item.name}: contains('lic') = ${contains}, NOT contains('lic') = ${notContains}`
      )
    })
    expect(notContainsResult).toHaveLength(2)
    expect(notContainsResult.map((r) => r.name)).toEqual(['Bob', 'ALICE'])
  })
})
