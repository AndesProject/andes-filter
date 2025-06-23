import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'

describe('Mode Insensitive Filter - Prisma/TypeORM Compatibility', () => {
  const testData = [
    { id: 1, name: 'Alice', email: 'alice@test.com' },
    { id: 2, name: 'alice', email: 'ALICE@TEST.COM' },
    { id: 3, name: 'ALICE', email: 'Alice@Test.Com' },
    { id: 4, name: 'Bob', email: 'bob@test.com' },
    { id: 5, name: 'BOB', email: 'BOB@TEST.COM' },
    { id: 6, name: 'Charlie', email: 'charlie@test.com' },
  ]

  describe('Basic Mode Insensitive Behavior', () => {
    it('should apply insensitive mode to all string operators in the same object', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: mode: 'insensitive' applies to all string operators in the same object
      const result = filter.findMany({
        where: {
          name: {
            contains: 'ALICE',
            startsWith: 'A',
            endsWith: 'E',
            mode: 'insensitive',
          },
        },
      })

      // Should match all variations of 'Alice' (Alice, alice, ALICE)
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])
    })

    it('should not apply insensitive mode to operators outside the object', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: mode only applies to the object where it's defined
      const result = filter.findMany({
        where: {
          name: {
            contains: 'ALICE',
            mode: 'insensitive',
          },
          email: {
            contains: 'ALICE', // This should be case sensitive
          },
        },
      })

      // Should only match where both name (insensitive) and email (sensitive) match
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('alice')
      expect(result.data[0].email).toBe('ALICE@TEST.COM')
    })

    it('should handle mode: insensitive with equals operator', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: equals with insensitive mode
      const result1 = filter.findMany({
        where: {
          name: {
            equals: 'alice',
            mode: 'insensitive',
          },
        },
      })

      expect(result1.data).toHaveLength(3)
      expect(result1.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])

      // Case sensitive equals (default)
      const result2 = filter.findMany({
        where: {
          name: {
            equals: 'alice',
          },
        },
      })

      expect(result2.data).toHaveLength(1)
      expect(result2.data[0].name).toBe('alice')
    })

    it('should handle mode: insensitive with not operator', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: not with insensitive mode
      const result = filter.findMany({
        where: {
          name: {
            not: 'alice',
            mode: 'insensitive',
          },
        },
      })

      // Should exclude all variations of 'alice' (Alice, alice, ALICE)
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Bob',
        'BOB',
        'Charlie',
      ])
    })

    it('should handle mode: insensitive with in operator', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: in with insensitive mode
      const result = filter.findMany({
        where: {
          name: {
            in: ['alice', 'bob'],
            mode: 'insensitive',
          },
        },
      })

      // Should match all variations of 'alice' and 'bob'
      expect(result.data).toHaveLength(5)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
        'Bob',
        'BOB',
      ])
    })

    it('should handle mode: insensitive with notIn operator', () => {
      const filter = createFilterEngine(testData)

      // Prisma/TypeORM: notIn with insensitive mode
      const result = filter.findMany({
        where: {
          name: {
            notIn: ['alice', 'bob'],
            mode: 'insensitive',
          },
        },
      })

      // Should exclude all variations of 'alice' and 'bob'
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Charlie')
    })
  })

  describe('Mode Insensitive with String Search Operators', () => {
    it('should handle contains with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            contains: 'ALICE',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])
    })

    it('should handle notContains with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            notContains: 'ALICE',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Bob',
        'BOB',
        'Charlie',
      ])
    })

    it('should handle startsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            startsWith: 'AL',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])
    })

    it('should handle notStartsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            notStartsWith: 'AL',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Bob',
        'BOB',
        'Charlie',
      ])
    })

    it('should handle endsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            endsWith: 'ICE',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])
    })

    it('should handle notEndsWith with insensitive mode', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          name: {
            notEndsWith: 'ICE',
            mode: 'insensitive',
          },
        },
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Bob',
        'BOB',
        'Charlie',
      ])
    })
  })

  describe('Mode Insensitive with Nested Filters', () => {
    it('should handle mode: insensitive in nested some filters', () => {
      const nestedData = [
        {
          id: 1,
          name: 'Company A',
          employees: [
            { name: 'Alice', role: 'Developer' },
            { name: 'Bob', role: 'Manager' },
          ],
        },
        {
          id: 2,
          name: 'Company B',
          employees: [
            { name: 'alice', role: 'Designer' },
            { name: 'CHARLIE', role: 'Developer' },
          ],
        },
      ]

      const filter = createFilterEngine(nestedData)

      const result = filter.findMany({
        where: {
          employees: {
            some: {
              name: {
                contains: 'ALICE',
                mode: 'insensitive',
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.name)).toEqual([
        'Company A',
        'Company B',
      ])
    })

    it('should handle mode: insensitive in nested every filters', () => {
      const nestedData = [
        {
          id: 1,
          name: 'Team A',
          members: [
            { name: 'Alice', role: 'Developer' },
            { name: 'alice', role: 'Tester' },
          ],
        },
        {
          id: 2,
          name: 'Team B',
          members: [
            { name: 'Bob', role: 'Developer' },
            { name: 'Charlie', role: 'Tester' },
          ],
        },
      ]

      const filter = createFilterEngine(nestedData)

      const result = filter.findMany({
        where: {
          members: {
            every: {
              name: {
                contains: 'ALICE',
                mode: 'insensitive',
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Team A')
    })
  })

  describe('Mode Insensitive Edge Cases', () => {
    it('should handle empty strings with insensitive mode', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: '' },
        { id: 3, name: 'Bob' },
      ]

      const filter = createFilterEngine(data)

      const result = filter.findMany({
        where: {
          name: {
            contains: '',
            mode: 'insensitive',
          },
        },
      })

      // Empty string should match all strings
      expect(result.data).toHaveLength(3)
    })

    it('should handle null and undefined values with insensitive mode', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: null },
        { id: 3, name: undefined },
        { id: 4, name: 'Bob' },
      ]

      const filter = createFilterEngine(data)

      const result = filter.findMany({
        where: {
          name: {
            contains: 'ALICE',
            mode: 'insensitive',
          },
        },
      })

      // Should only match 'Alice', null/undefined should be excluded
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Alice')
    })

    it('should handle mode: insensitive with non-string fields (should be ignored)', () => {
      const data = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
      ]

      const filter = createFilterEngine(data)

      // TypeScript should prevent this, but runtime should handle gracefully
      const result = filter.findMany({
        where: {
          age: {
            equals: 25,
            mode: 'insensitive', // This should be ignored for numeric fields
          },
        } as any,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].age).toBe(25)
    })
  })

  describe('Mode Insensitive with Logical Groups', () => {
    it('should handle mode: insensitive with AND conditions', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          AND: [
            {
              name: {
                contains: 'ALICE',
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: 'alice',
                mode: 'insensitive',
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
      ])
    })

    it('should handle mode: insensitive with OR conditions', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          OR: [
            {
              name: {
                contains: 'ALICE',
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: 'BOB',
                mode: 'insensitive',
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(5)
      expect(result.data.map((item) => item.name)).toEqual([
        'Alice',
        'alice',
        'ALICE',
        'Bob',
        'BOB',
      ])
    })

    it('should handle mode: insensitive with NOT conditions', () => {
      const filter = createFilterEngine(testData)

      const result = filter.findMany({
        where: {
          NOT: [
            {
              name: {
                contains: 'ALICE',
                mode: 'insensitive',
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'Bob',
        'BOB',
        'Charlie',
      ])
    })
  })
})
