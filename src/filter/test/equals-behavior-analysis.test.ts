import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'

describe('Equals Filter Behavior Analysis - Prisma/TypeORM Compatibility', () => {
  describe('Basic Equality Behavior', () => {
    it('should handle string equality like Prisma/TypeORM', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Alice' },
        { id: 4, name: '' },
        { id: 5, name: null },
        { id: 6, name: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { name: { equals: 'Alice' } } }).data,
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { name: { equals: 'Bob' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { equals: 'Charlie' } } }).data,
      ).toHaveLength(0)
      expect(
        filter.findMany({ where: { name: { equals: '' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
    it('should handle number equality like Prisma/TypeORM', () => {
      const data = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 10 },
        { id: 4, value: 0 },
        { id: 5, value: -5 },
        { id: 6, value: null },
        { id: 7, value: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { value: { equals: 10 } } }).data,
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { value: { equals: 20 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: 0 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: -5 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
    it('should handle boolean equality like Prisma/TypeORM', () => {
      const data = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
        { id: 4, active: null },
        { id: 5, active: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { active: { equals: true } } }).data,
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { active: { equals: false } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { active: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { active: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
    it('should handle date equality like Prisma/TypeORM', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const date3 = new Date('2023-01-01')
      const data = [
        { id: 1, date: date1 },
        { id: 2, date: date2 },
        { id: 3, date: date3 },
        { id: 4, date: null },
        { id: 5, date: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { date: { equals: date1 } } }).data,
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { date: { equals: date2 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { date: { equals: new Date('2023-01-01') } } })
          .data,
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { date: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { date: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
  })
  describe('Edge Cases and Special Values', () => {
    it('should handle falsy values correctly', () => {
      const data = [
        { id: 1, value: 0 },
        { id: 2, value: false },
        { id: 3, value: '' },
        { id: 4, value: null },
        { id: 5, value: undefined },
        { id: 6, value: NaN },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { value: { equals: 0 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: false } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: '' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: undefined } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: NaN } } }).data,
      ).toHaveLength(0)
    })
    it('should handle object equality correctly', () => {
      const obj1 = { key: 'value' }
      const obj2 = { key: 'value' }
      const data = [
        { id: 1, obj: obj1 },
        { id: 2, obj: obj2 },
        { id: 3, obj: { key: 'different' } },
        { id: 4, obj: null },
        { id: 5, obj: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { obj: { equals: obj1 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { obj: { equals: obj2 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { obj: { equals: { key: 'value' } } } }).data,
      ).toHaveLength(0)
      expect(
        filter.findMany({ where: { obj: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { obj: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
    it('should handle array equality correctly', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3]
      const data = [
        { id: 1, arr: arr1 },
        { id: 2, arr: arr2 },
        { id: 3, arr: [4, 5, 6] },
        { id: 4, arr: null },
        { id: 5, arr: undefined },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { arr: { equals: arr1 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { arr: { equals: arr2 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { arr: { equals: [1, 2, 3] } } }).data,
      ).toHaveLength(0)
      expect(
        filter.findMany({ where: { arr: { equals: null } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { arr: { equals: undefined } } }).data,
      ).toHaveLength(1)
    })
  })
  describe('Type Coercion Behavior', () => {
    it('should not perform type coercion (strict equality)', () => {
      const data = [
        { id: 1, value: '123' },
        { id: 2, value: 123 },
        { id: 3, value: true },
        { id: 4, value: 1 },
        { id: 5, value: 'true' },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { value: { equals: '123' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: 123 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: true } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: 1 } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: true } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { value: { equals: 'true' } } }).data,
      ).toHaveLength(1)
    })
  })
  describe('Case Sensitivity', () => {
    it('should be case sensitive by default', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'alice' },
        { id: 3, name: 'ALICE' },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({ where: { name: { equals: 'Alice' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { equals: 'alice' } } }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { equals: 'ALICE' } } }).data,
      ).toHaveLength(1)
    })
    it('should support case insensitive mode', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'alice' },
        { id: 3, name: 'ALICE' },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({
          where: { name: { equals: 'Alice', mode: 'insensitive' } },
        }).data,
      ).toHaveLength(3)
      expect(
        filter.findMany({
          where: { name: { equals: 'alice', mode: 'insensitive' } },
        }).data,
      ).toHaveLength(3)
      expect(
        filter.findMany({
          where: { name: { equals: 'ALICE', mode: 'insensitive' } },
        }).data,
      ).toHaveLength(3)
    })
  })
  describe('Performance and Large Datasets', () => {
    it('should handle large datasets efficiently', () => {
      const data = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: i,
      }))
      const filter = createFilter(data)
      const start = performance.now()
      const result = filter.findMany({ where: { id: { equals: 5000 } } })
      const end = performance.now()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(5000)
      expect(end - start).toBeLessThan(300)
    })
  })
  describe('Integration with Other Filters', () => {
    it('should work correctly with AND conditions', () => {
      const data = [
        { id: 1, name: 'Alice', age: 25, active: true },
        { id: 2, name: 'Alice', age: 30, active: false },
        { id: 3, name: 'Bob', age: 25, active: true },
        { id: 4, name: 'Charlie', age: 35, active: true },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({
          where: {
            name: { equals: 'Alice' },
            age: { equals: 25 },
            active: { equals: true },
          },
        }).data,
      ).toHaveLength(1)
      expect(
        filter.findMany({
          where: {
            AND: [{ name: { equals: 'Alice' } }, { age: { equals: 25 } }],
          } as any,
        }).data,
      ).toHaveLength(1)
    })
    it('should work correctly with OR conditions', () => {
      const data = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 35 },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({
          where: {
            OR: [{ name: { equals: 'Alice' } }, { age: { equals: 30 } }],
          } as any,
        }).data,
      ).toHaveLength(2)
    })
    it('should work correctly with NOT conditions', () => {
      const data = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 35 },
      ]
      const filter = createFilter(data)
      expect(
        filter.findMany({
          where: {
            NOT: [{ name: { equals: 'Alice' } }],
          } as any,
        }).data,
      ).toHaveLength(2)
    })
  })
})
