import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
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
    const filter = createFilter(nestedData)
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
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.profile[0].name).sort()).toEqual([
      'Alice',
      'Bob',
    ])
  })
  it('debug every filter', () => {
    const result = createFilter(nestedData).findMany({
      where: {
        profile: {
          every: {
            age: { gte: 25 },
          } as any,
        },
      },
    })
    expect(result.data).toHaveLength(3)
  })
  it('debug none filter', () => {
    const result = createFilter(nestedData).findMany({
      where: {
        profile: {
          none: {
            age: { lt: 25 },
          } as any,
        },
      },
    })
    expect(result.data).toHaveLength(3)
  })
})
