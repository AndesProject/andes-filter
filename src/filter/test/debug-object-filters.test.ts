import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('Debug Object Filters', () => {
  const nestedData = [
    {
      id: 1,
      profile: [
        {
          name: 'Alice',
          age: 25,
          address: [{ city: 'NYC', country: 'USA' }],
        },
      ],
    },
    {
      id: 2,
      profile: [
        {
          name: 'Bob',
          age: 30,
          address: [{ city: 'LA', country: 'USA' }],
        },
      ],
    },
    {
      id: 3,
      profile: [
        {
          name: 'Charlie',
          age: 35,
          address: [{ city: 'London', country: 'UK' }],
        },
      ],
    },
  ]
  it('debug some filter', () => {
    const filter = createFilterEngine(nestedData)
    const result = filter.findMany({
      where: {
        profile: {
          some: {
            address: {
              some: {
                country: { equals: 'USA' },
              },
            },
          },
        } as any,
      },
    })
    console.log('Result data:', result.data)
    console.log('Expected: Alice, Bob (USA addresses)')
    console.log(
      'Actual:',
      result.data.map((item) => item.profile[0].name)
    )
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.profile[0].name).sort()).toEqual([
      'Alice',
      'Bob',
    ])
  })
  it('debug every filter', () => {
    const result = createFilterEngine(nestedData).findMany({
      where: {
        profile: {
          every: {
            age: { gte: 25 },
          } as any,
        },
      },
    })
    console.log('Result data:', result.data)
    console.log('Expected: All (age >= 25)')
    console.log(
      'Actual:',
      result.data.map(
        (item) => `${item.profile[0].name} (${item.profile[0].age})`
      )
    )
    expect(result.data).toHaveLength(3)
  })
  it('debug none filter', () => {
    const result = createFilterEngine(nestedData).findMany({
      where: {
        profile: {
          none: {
            age: { lt: 25 },
          } as any,
        },
      },
    })
    console.log('Result data:', result.data)
    console.log('Expected: All (none age < 25)')
    console.log(
      'Actual:',
      result.data.map(
        (item) => `${item.profile[0].name} (${item.profile[0].age})`
      )
    )
    expect(result.data).toHaveLength(3)
  })
})
