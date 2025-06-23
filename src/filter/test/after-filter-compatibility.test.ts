import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'
describe('After Filter - Prisma/TypeORM Compatibility', () => {
  const testData = [
    {
      id: 1,
      date: new Date('2023-01-01'),
      timestamp: 1672531200000,
      dateString: '2023-01-01',
    },
    {
      id: 2,
      date: new Date('2023-01-15'),
      timestamp: 1673740800000,
      dateString: '2023-01-15',
    },
    {
      id: 3,
      date: new Date('2023-02-01'),
      timestamp: 1675209600000,
      dateString: '2023-02-01',
    },
    {
      id: 4,
      date: new Date('2023-02-15'),
      timestamp: 1676419200000,
      dateString: '2023-02-15',
    },
    {
      id: 5,
      date: new Date('2023-03-01'),
      timestamp: 1677628800000,
      dateString: '2023-03-01',
    },
  ]
  describe('Date Objects', () => {
    it('should filter dates after a specific date', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
    it('should not include the reference date (strictly after)', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-02-01') },
        },
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.id)).toEqual([4, 5])
    })
    it('should handle edge case with exact date', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
  })
  describe('Timestamp Numbers', () => {
    it('should filter timestamps after a specific timestamp', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          timestamp: { after: 1673740800000 },
        },
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
    it('should handle timestamp edge cases', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          timestamp: { after: 1675209600000 },
        },
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.id)).toEqual([4, 5])
    })
  })
  describe('Date Strings', () => {
    it('should filter date strings after a specific date string', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          dateString: { after: '2023-01-15' },
        },
      })
      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
    it('should handle date string edge cases', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          dateString: { after: '2023-02-01' },
        },
      })
      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.id)).toEqual([4, 5])
    })
  })
  describe('Mixed Date Types', () => {
    it('should handle mixed date types in reference', () => {
      const filter = createFilterEngine(testData)
      const result1 = filter.findMany({
        where: {
          date: { after: '2023-01-15' },
        },
      })
      expect(result1.data).toHaveLength(3)
      const result2 = filter.findMany({
        where: {
          date: { after: 1673740800000 },
        },
      })
      expect(result2.data).toHaveLength(3)
    })
  })
  describe('Null and Invalid Values', () => {
    it('should return false for null values', () => {
      const dataWithNull = [
        { id: 1, date: new Date('2023-01-01') },
        { id: 2, date: null },
        { id: 3, date: new Date('2023-02-01') },
      ]
      const filter = createFilterEngine(dataWithNull)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(3)
    })
    it('should return false for undefined values', () => {
      const dataWithUndefined = [
        { id: 1, date: new Date('2023-01-01') },
        { id: 2, date: undefined },
        { id: 3, date: new Date('2023-02-01') },
      ]
      const filter = createFilterEngine(dataWithUndefined)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(3)
    })
    it('should return false for invalid date strings', () => {
      const dataWithInvalid = [
        { id: 1, date: '2023-01-01' },
        { id: 2, date: 'invalid-date' },
        { id: 3, date: '2023-02-01' },
      ]
      const filter = createFilterEngine(dataWithInvalid)
      const result = filter.findMany({
        where: {
          date: { after: '2023-01-15' },
        },
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe(3)
    })
    it('should return false when reference date is invalid', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: 'invalid-date' },
        },
      })
      expect(result.data).toHaveLength(0)
    })
  })
  describe('Edge Cases', () => {
    it('should handle empty result set', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2023-12-31') },
        },
      })
      expect(result.data).toHaveLength(0)
    })
    it('should handle all data matches', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findMany({
        where: {
          date: { after: new Date('2022-12-31') },
        },
      })
      expect(result.data).toHaveLength(5)
    })
    it('should work with findUnique', () => {
      const filter = createFilterEngine(testData)
      const result = filter.findUnique({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      expect(result).toBeTruthy()
      expect(result?.id).toBe(3)
    })
  })
  describe('Comparison with gt', () => {
    it('should behave identically to gt filter', () => {
      const filter = createFilterEngine(testData)
      const afterResult = filter.findMany({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      const gtResult = filter.findMany({
        where: {
          date: { gt: new Date('2023-01-15') },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(3)
    })
  })
})
