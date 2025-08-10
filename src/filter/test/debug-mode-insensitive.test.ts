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
    console.log('=== Debug Mode Insensitive ===')
    console.log('1. Testing name with insensitive mode')
    const nameResult = filter.findMany({
      where: {
        name: {
          contains: 'ALICE',
          mode: 'insensitive',
        },
      },
    })
    console.log(
      'Name result:',
      nameResult.data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      }))
    )
    console.log('2. Testing email with sensitive mode')
    const emailResult = filter.findMany({
      where: {
        email: {
          contains: 'ALICE',
        },
      },
    })
    console.log(
      'Email result:',
      emailResult.data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      }))
    )
    console.log('3. Testing combined filter')
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
    console.log(
      'Combined result:',
      combinedResult.data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      }))
    )
    expect(combinedResult.data).toHaveLength(1)
    expect(combinedResult.data[0].id).toBe(2)
  })
})
