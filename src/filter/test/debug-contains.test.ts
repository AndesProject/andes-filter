import { describe, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug Contains Filter', () => {
  it('should test contains behavior', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'ALICE' },
    ]
    const filter = createFilter(data)
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { contains: 'lic' } },
      }).data
    })
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { contains: 'lic', mode: 'insensitive' } },
      }).data
    })
    data.forEach((item) => {
      const result = filter.findMany({
        where: { name: { not: { contains: 'lic' } } },
      }).data
    })
  })
})
