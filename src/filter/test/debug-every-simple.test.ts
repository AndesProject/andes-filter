import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('Debug Every Filter', () => {
  const testData = [
    {
      id: 1,
      name: 'TechCorp Inc',
      employees: [
        {
          id: 'emp-001',
          name: 'Alice Johnson',
          performance: {
            rating: 4.8,
            reviews: [
              { reviewer: 'board', score: 5.0 },
              { reviewer: 'peers', score: 4.6 },
            ],
          },
        },
        {
          id: 'emp-002',
          name: 'Bob Smith',
          performance: {
            rating: 4.5,
            reviews: [
              { reviewer: 'ceo', score: 4.8 },
              { reviewer: 'team', score: 4.2 },
            ],
          },
        },
      ],
    },
    {
      id: 2,
      name: 'StartupXYZ',
      employees: [
        {
          id: 'emp-101',
          name: 'Charlie Brown',
          performance: {
            rating: 4.9,
            reviews: [{ reviewer: 'investors', score: 5.0 }],
          },
        },
        {
          id: 'emp-102',
          name: 'Diana Prince',
          performance: {
            rating: 4.7,
            reviews: [
              { reviewer: 'founder', score: 4.8 },
              { reviewer: 'peers', score: 4.6 },
            ],
          },
        },
      ],
    },
    {
      id: 3,
      name: 'GlobalTech Solutions',
      employees: [
        {
          id: 'emp-201',
          name: 'Eve Wilson',
          performance: {
            rating: 4.6,
            reviews: [
              { reviewer: 'ceo', score: 4.7 },
              { reviewer: 'team', score: 4.5 },
            ],
          },
        },
      ],
    },
  ]
  it('should debug every filter with rating only', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        employees: {
          every: {
            performance: {
              rating: { gte: 4.5 },
            },
          },
        },
      } as any,
    })
    console.log(
      'Result with rating only:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(3)
  })
  it('should debug every filter with rating and reviews (every)', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        employees: {
          every: {
            performance: {
              rating: { gte: 4.5 },
              reviews: {
                every: {
                  score: { gte: 4.5 },
                },
              },
            },
          },
        },
      } as any,
    })
    console.log(
      'Result with rating and reviews (every):',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.name)).toEqual([
      'StartupXYZ',
      'GlobalTech Solutions',
    ])
  })
  it('should debug every filter with reviews only', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        employees: {
          every: {
            performance: {
              reviews: {
                some: {
                  score: { gte: 4.5 },
                },
              },
            },
          },
        },
      } as any,
    })
    console.log(
      'Result with reviews only:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(3)
  })
  it('should debug every filter with rating and reviews (every) - complex data', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        employees: {
          every: {
            performance: {
              rating: { gte: 4.5 },
              reviews: {
                every: {
                  score: { gte: 4.5 },
                },
              },
            },
          },
        },
      } as any,
    })
    console.log(
      'Result with complex data:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.name)).toEqual([
      'StartupXYZ',
      'GlobalTech Solutions',
    ])
  })
})
