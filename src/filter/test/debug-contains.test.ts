import { describe, it } from 'vitest'
import { filterFrom } from '../filter-from'

describe('Debug Contains Filter', () => {
  it('should test contains behavior', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = filterFrom(data)

    console.log('=== Debug contains: lic ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { contains: 'lic' } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })

    console.log('=== Debug contains: lic (insensitive) ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { contains: 'lic', mode: 'insensitive' } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })

    console.log('=== Debug NOT contains: lic ===')
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { not: { contains: 'lic' } } },
      }).data
      console.log(
        `${item.name}: ${result.some((r) => r.id === item.id) ? 'INCLUDED' : 'EXCLUDED'}`
      )
    })
  })
})
