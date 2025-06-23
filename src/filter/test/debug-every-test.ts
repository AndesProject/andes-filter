import { filterFrom } from '../filter-from'
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
]
const filter = filterFrom(testData)
console.log('=== Test 1: Solo rating >= 4.5 ===')
const result1 = filter.findMany({
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
  'Result 1:',
  result1.data.map((item) => item.name)
)
console.log('=== Test 2: Rating >= 4.5 Y reviews con score >= 4.5 ===')
const result2 = filter.findMany({
  where: {
    employees: {
      every: {
        performance: {
          rating: { gte: 4.5 },
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
  'Result 2:',
  result2.data.map((item) => item.name)
)
console.log('=== Test 3: Solo reviews con score >= 4.5 ===')
const result3 = filter.findMany({
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
  'Result 3:',
  result3.data.map((item) => item.name)
)
