import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug Mode Insensitive', () => {
  const testData = [
    { id: 1, name: 'Alice', email: 'alice@test.com' },
    { id: 2, name: 'alice', email: 'ALICE@TEST.COM' },
    { id: 3, name: 'ALICE', email: 'Alice@Test.Com' },
    { id: 4, name: 'Bob', email: 'bob@test.com' },
    { id: 5, name: 'BOB', email: 'BOB@TEST.COM' },
    { id: 6, name: 'Charlie', email: 'charlie@test.com' },
  ]
  it('should debug mode insensitive behavior', () => {
    const filter = createFilter(testData)
    const nameResult = filter.findMany({
      where: {
        name: {
          contains: 'ALICE',
          mode: 'insensitive',
        },
      },
    })
    const emailResult = filter.findMany({
      where: {
        email: {
          contains: 'ALICE',
        },
      },
    })
    const combinedResult = filter.findMany({
      where: {
        name: {
          contains: 'ALICE',
          mode: 'insensitive',
        },
        email: {
          contains: 'ALICE',
        },
      },
    })
    expect(combinedResult.data).toHaveLength(1)
    expect(combinedResult.data[0].id).toBe(2)
  })
})
