import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('Comprehensive Filter Tests', () => {
  const testData = [
    {
      id: 1,
      name: 'Alice',
      age: 25,
      email: 'alice@test.com',
      tags: ['admin', 'user'],
      active: true,
      score: 85.5,
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 2,
      name: 'Bob',
      age: 30,
      email: 'bob@test.com',
      tags: ['user'],
      active: false,
      score: 92.0,
      createdAt: new Date('2023-02-01'),
    },
    {
      id: 3,
      name: 'Charlie',
      age: 35,
      email: 'charlie@test.com',
      tags: ['admin'],
      active: true,
      score: 78.3,
      createdAt: new Date('2023-03-01'),
    },
    {
      id: 4,
      name: 'David',
      age: 28,
      email: 'david@test.com',
      tags: ['user', 'moderator'],
      active: true,
      score: 95.7,
      createdAt: new Date('2023-04-01'),
    },
    {
      id: 5,
      name: 'Eva',
      age: 22,
      email: 'eva@test.com',
      tags: [],
      active: false,
      score: 88.9,
      createdAt: new Date('2023-05-01'),
    },
  ]
  describe('Basic Comparison Filters', () => {
    it('should handle equals filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { id: { equals: 1 } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(1)
    })
    it('should handle not equals filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { id: { not: 1 } } as any,
      })
      expect(result.data).toHaveLength(4)
      expect(result.data.every((item) => item.id !== 1)).toBe(true)
    })
    it('should handle in filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { id: { in: [1, 3, 5] } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.id).sort()).toEqual([1, 3, 5])
    })
    it('should handle notIn filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { id: { notIn: [1, 3, 5] } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.id).sort()).toEqual([2, 4])
    })
  })
  describe('Numeric Comparison Filters', () => {
    it('should handle less than filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { age: { lt: 30 } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.every((item) => item.age < 30)).toBe(true)
    })
    it('should handle less than or equal filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { age: { lte: 30 } } as any,
      })
      expect(result.data).toHaveLength(4)
      expect(result.data.every((item) => item.age <= 30)).toBe(true)
    })
    it('should handle greater than filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { age: { gt: 30 } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data.every((item) => item.age > 30)).toBe(true)
    })
    it('should handle greater than or equal filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { age: { gte: 30 } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.age >= 30)).toBe(true)
    })
  })
  describe('String Filters', () => {
    it('should handle contains filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { contains: 'a' } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(
        result.data.every((item) => item.name.toLowerCase().includes('a'))
      ).toBe(true)
    })
    it('should handle notContains filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { notContains: 'a', mode: 'insensitive' } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(
        result.data.every((item) => !item.name.toLowerCase().includes('a'))
      ).toBe(true)
    })
    it('should handle startsWith filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { startsWith: 'A' } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Alice')
    })
    it('should handle notStartsWith filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { notStartsWith: 'A' } } as any,
      })
      expect(result.data).toHaveLength(4)
      expect(result.data.every((item) => !item.name.startsWith('A'))).toBe(true)
    })
    it('should handle endsWith filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { endsWith: 'e' } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.name.endsWith('e'))).toBe(true)
    })
    it('should handle notEndsWith filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { notEndsWith: 'e' } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.every((item) => !item.name.endsWith('e'))).toBe(true)
    })
    it('should handle regex filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { regex: '^[A-C]' } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.every((item) => /^[A-C]/.test(item.name))).toBe(true)
    })
  })
  describe('String Filters with Insensitive Mode', () => {
    it('should handle contains with insensitive mode', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { contains: 'ALICE', mode: 'insensitive' } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Alice')
    })
    it('should handle startsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { startsWith: 'al', mode: 'insensitive' } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Alice')
    })
    it('should handle endsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { endsWith: 'ICE', mode: 'insensitive' } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Alice')
    })
  })
  describe('Date Filters', () => {
    it('should handle before filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { createdAt: { before: new Date('2023-03-01') } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(
        result.data.every((item) => item.createdAt < new Date('2023-03-01'))
      ).toBe(true)
    })
    it('should handle after filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { createdAt: { after: new Date('2023-03-01') } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(
        result.data.every((item) => item.createdAt > new Date('2023-03-01'))
      ).toBe(true)
    })
    it('should handle between filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          createdAt: {
            between: [new Date('2023-02-01'), new Date('2023-04-01')],
          },
        } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(
        result.data.every(
          (item) =>
            item.createdAt >= new Date('2023-02-01') &&
            item.createdAt <= new Date('2023-04-01')
        )
      ).toBe(true)
    })
  })
  describe('Array Filters', () => {
    it('should handle has filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { tags: { has: 'admin' } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.tags.includes('admin'))).toBe(
        true
      )
    })
    it('should handle hasEvery filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { tags: { hasEvery: ['user', 'moderator'] } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].tags).toContain('user')
      expect(result.data[0].tags).toContain('moderator')
    })
    it('should handle hasSome filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { tags: { hasSome: ['admin', 'moderator'] } } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(
        result.data.every((item) =>
          item.tags.some((tag) => ['admin', 'moderator'].includes(tag))
        )
      ).toBe(true)
    })
    it('should handle length filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { tags: { length: 2 } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.tags.length === 2)).toBe(true)
    })
  })
  describe('Object Filters', () => {
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
    it('should handle some filter', () => {
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
          },
        } as any,
      })
      expect(result.data).toHaveLength(2)
    })
    it('should handle every filter', () => {
      const filter = createFilterEngine(nestedData)
      const result = filter.findMany({
        where: {
          profile: {
            every: {
              age: { gte: 25 },
            },
          },
        } as any,
      })
      expect(result.data).toHaveLength(3)
    })
    it('should handle none filter', () => {
      const filter = createFilterEngine(nestedData)
      const result = filter.findMany({
        where: {
          profile: {
            none: {
              age: { lt: 25 },
            },
          },
        } as any,
      })
      expect(result.data).toHaveLength(3)
    })
  })
  describe('Null/Undefined Filters', () => {
    const nullData = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: null },
      { id: 3, name: 'Charlie', email: undefined },
      { id: 4, name: 'David', email: 'david@test.com' },
    ]
    it('should handle isNull filter', () => {
      const filter = createFilterEngine(nullData)
      const result = filter.findMany({
        where: { email: { isNull: true } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.email == null)).toBe(true)
    })
    it('should handle isNull false filter', () => {
      const filter = createFilterEngine(nullData)
      const result = filter.findMany({
        where: { email: { isNull: false } } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.email != null)).toBe(true)
    })
    it('should handle in filter with null and undefined', () => {
      const data = [
        { id: 1, value: null },
        { id: 2, value: undefined },
        { id: 3, value: 0 },
        { id: 4, value: 1 },
      ] as any
      const filter = createFilterEngine(data)
      const result = filter.findMany({
        where: { value: { in: [null, undefined] } as any },
      })
      expect(result.data.map((d) => (d as any).id).sort()).toEqual([1, 2])
    })
  })
  describe('Logical Group Filters', () => {
    it('should handle AND filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          AND: [{ age: { gte: 25 } }, { active: { equals: true } }],
        } as any,
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.every((item) => item.age >= 25 && item.active)).toBe(
        true
      )
    })
    it('should handle OR filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          OR: [{ age: { lt: 25 } }, { active: { equals: false } }],
        } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.age < 25 || !item.active)).toBe(
        true
      )
    })
    it('should handle NOT filter', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          NOT: [{ age: { gte: 30 } }, { active: { equals: false } }],
        } as any,
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.age < 30 && item.active)).toBe(
        true
      )
    })
  })
  describe('Complex Nested Filters', () => {
    it('should handle nested AND/OR combinations', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          AND: [
            { age: { gte: 25 } },
            {
              OR: [{ tags: { has: 'admin' } }, { score: { gte: 90 } }],
            },
          ],
        } as any,
      })
      expect(result.data).toHaveLength(4)
    })
    it('should handle nested NOT with other operators', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          AND: [
            { age: { gte: 25 } },
            {
              NOT: [{ tags: { has: 'admin' } }, { active: { equals: false } }],
            },
          ],
        } as any,
      })
      expect(result.data).toHaveLength(1)
    })
  })
  describe('Edge Cases', () => {
    it('should handle empty arrays', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { tags: { length: 0 } } as any,
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].tags).toEqual([])
    })
    it('should handle empty string searches', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { contains: '' } } as any,
      })
      expect(result.data).toHaveLength(5)
    })
    it('should handle invalid regex patterns gracefully', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { name: { regex: '[' } } as any,
      })
      expect(result.data).toHaveLength(0)
    })
    it('should handle non-string values in string filters', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: { id: { contains: '1' } } as any,
      })
      expect(result.data).toHaveLength(0)
    })
  })
  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User${i}`,
        age: 20 + (i % 50),
        active: i % 2 === 0,
        score: 50 + (i % 50),
        tags: i % 3 === 0 ? ['admin'] : ['user'],
        createdAt: new Date(2023, 0, 1 + i),
      }))
      const filter = createFilterEngine(largeData)
      const startTime = Date.now()
      const result = filter.findMany({
        where: {
          AND: [
            { age: { gte: 30 } },
            { active: { equals: true } },
            { tags: { has: 'admin' } },
          ],
        } as any,
      })
      const endTime = Date.now()
      const executionTime = endTime - startTime
      expect(executionTime).toBeLessThan(100)
      expect(result.data.length).toBeGreaterThan(0)
    })
  })
  describe('IN Filter - Prisma/TypeORM Compatibility', () => {
    it('should handle in filter with dates (by value)', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const date3 = new Date('2023-01-01')
      const data = [
        { id: 1, date: date1 },
        { id: 2, date: date2 },
        { id: 3, date: date3 },
        { id: 4, date: null },
      ]
      const filter = createFilterEngine(data)
      const result = filter.findMany({ where: { date: { in: [date1] } } })
      expect(result.data.map((d) => (d as any).id).sort()).toEqual([1, 3])
    })
    it('should handle in filter with NaN', () => {
      const data = [
        { id: 1, value: NaN },
        { id: 2, value: 1 },
        { id: 3, value: 0 },
        { id: 4, value: null },
      ]
      const filter = createFilterEngine(data)
      const result = filter.findMany({ where: { value: { in: [NaN, 1] } } })
      expect(result.data.map((d) => (d as any).id).sort()).toEqual([1, 2])
    })
    it('should handle in filter with null and undefined', () => {
      const data = [
        { id: 1, value: null },
        { id: 2, value: undefined },
        { id: 3, value: 0 },
        { id: 4, value: 1 },
      ] as any
      const filter = createFilterEngine(data)
      const result = filter.findMany({
        where: { value: { in: [null, undefined] } as any },
      })
      expect(result.data.map((d) => (d as any).id).sort()).toEqual([1, 2])
    })
    it('should handle in filter with objects (by reference)', () => {
      const obj1 = { key: 'value' }
      const obj2 = { key: 'value' }
      const data = [
        { id: 1, obj: obj1 },
        { id: 2, obj: obj2 },
        { id: 3, obj: { key: 'different' } },
        { id: 4, obj: null },
      ]
      const filter = createFilterEngine(data)
      const result = filter.findMany({ where: { obj: { in: [obj1] } } })
      expect(result.data.map((d) => (d as any).id)).toEqual([1])
    })
    it('should handle in filter with empty array (should never match)', () => {
      const data = [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
      ]
      const filter = createFilterEngine(data)
      const result = filter.findMany({ where: { value: { in: [] } } })
      expect(result.data).toHaveLength(0)
    })
  })
})
