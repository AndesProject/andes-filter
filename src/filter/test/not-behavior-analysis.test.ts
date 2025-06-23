import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('Not Filter Behavior Analysis - Prisma/TypeORM Compatibility', () => {
  describe('Basic NOT Behavior', () => {
    it('should handle primitive negation', () => {
      const data = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: null },
        { id: 4, value: undefined },
        { id: 5, value: 0 },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { value: { not: 10 } } }).data
      ).toHaveLength(4)
      expect(
        filter.findMany({ where: { value: { not: 20 } } }).data
      ).toHaveLength(4)
      expect(
        filter.findMany({ where: { value: { not: null } } }).data
      ).toHaveLength(4)
      expect(
        filter.findMany({ where: { value: { not: undefined } } }).data
      ).toHaveLength(4)
      expect(
        filter.findMany({ where: { value: { not: 0 } } }).data
      ).toHaveLength(4)
    })
    it('should handle NOT with dates', () => {
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
      expect(
        filter.findMany({ where: { date: { not: date1 } } }).data
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { date: { not: date2 } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { date: { not: null } } }).data
      ).toHaveLength(3)
    })
    it('should handle NOT with NaN', () => {
      const data = [
        { id: 1, value: NaN },
        { id: 2, value: 1 },
        { id: 3, value: 0 },
        { id: 4, value: null },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { value: { not: NaN } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { value: { not: 1 } } }).data
      ).toHaveLength(3)
    })
    it('should handle NOT with strings and insensitive mode', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'alice' },
        { id: 3, name: 'Bob' },
        { id: 4, name: 'ALICE' },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { name: { not: 'Alice' } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { name: { not: 'alice' } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { name: { not: 'ALICE' } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({
          where: { name: { not: 'Alice', mode: 'insensitive' } },
        }).data
      ).toHaveLength(1)
    })
  })
  describe('NOT with subfilters', () => {
    it('should handle NOT with in/notIn', () => {
      const data = [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
        { id: 4, value: 4 },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { value: { not: { in: [1, 2] } } } }).data
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { value: { not: { notIn: [3, 4] } } } }).data
      ).toHaveLength(2)
    })
    it('should handle NOT with contains/startsWith/endsWith and insensitive', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'alice' },
        { id: 3, name: 'Bob' },
        { id: 4, name: 'ALICE' },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { name: { not: { contains: 'lic' } } } }).data
      ).toHaveLength(2)
      expect(
        filter.findMany({
          where: { name: { not: { contains: 'lic', mode: 'insensitive' } } },
        }).data
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { not: { startsWith: 'A' } } } }).data
      ).toHaveLength(2)
      expect(
        filter.findMany({
          where: { name: { not: { startsWith: 'A', mode: 'insensitive' } } },
        }).data
      ).toHaveLength(1)
      expect(
        filter.findMany({ where: { name: { not: { endsWith: 'e' } } } }).data
      ).toHaveLength(2)
      expect(
        filter.findMany({
          where: { name: { not: { endsWith: 'E', mode: 'insensitive' } } },
        }).data
      ).toHaveLength(1)
    })
  })
  describe('NOT with arrays (some/none/every)', () => {
    it('should handle NOT with some/none/every', () => {
      const data = [
        { id: 1, arr: [1, 1, 1] },
        { id: 2, arr: [1, 2, 1] },
        { id: 3, arr: [2, 2, 2] },
        { id: 4, arr: [] },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { arr: { not: { some: { equals: 1 } } } } })
          .data
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { arr: { not: { none: { equals: 2 } } } } })
          .data
      ).toHaveLength(2)
      expect(
        filter.findMany({ where: { arr: { not: { every: { equals: 2 } } } } })
          .data
      ).toHaveLength(2)
    })
  })
  describe('NOT with objects', () => {
    it('should handle NOT with object reference', () => {
      const obj1 = { key: 'value' }
      const obj2 = { key: 'value' }
      const data = [
        { id: 1, obj: obj1 },
        { id: 2, obj: obj2 },
        { id: 3, obj: { key: 'different' } },
        { id: 4, obj: null },
      ]
      const filter = createFilterEngine(data)
      expect(
        filter.findMany({ where: { obj: { not: obj1 } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { obj: { not: obj2 } } }).data
      ).toHaveLength(3)
      expect(
        filter.findMany({ where: { obj: { not: { key: 'value' } } } }).data
      ).toHaveLength(4)
    })
  })
})
