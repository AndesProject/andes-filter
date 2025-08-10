import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('After and GT Filter Equivalence - Prisma/TypeORM Compatibility', () => {
  const testData = [
    {
      id: 1,
      date: new Date('2023-01-01'),
      timestamp: 1672531200000,
      dateString: '2023-01-01',
      number: 100,
    },
    {
      id: 2,
      date: new Date('2023-01-15'),
      timestamp: 1673740800000,
      dateString: '2023-01-15',
      number: 150,
    },
    {
      id: 3,
      date: new Date('2023-02-01'),
      timestamp: 1675209600000,
      dateString: '2023-02-01',
      number: 200,
    },
    {
      id: 4,
      date: new Date('2023-02-15'),
      timestamp: 1676419200000,
      dateString: '2023-02-15',
      number: 250,
    },
    {
      id: 5,
      date: new Date('2023-03-01'),
      timestamp: 1677628800000,
      dateString: '2023-03-01',
      number: 300,
    },
  ]
  describe('Date Objects', () => {
    it('after and gt should be equivalent for Date objects', () => {
      const filter = createFilter(testData)
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
      expect(afterResult.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
    it('after and gt should exclude the reference date', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findMany({
        where: {
          date: { after: new Date('2023-02-01') },
        },
      })
      const gtResult = filter.findMany({
        where: {
          date: { gt: new Date('2023-02-01') },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(2)
      expect(afterResult.data.map((item) => item.id)).toEqual([4, 5])
    })
  })
  describe('Timestamp Numbers', () => {
    it('after and gt should be equivalent for timestamp numbers', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findMany({
        where: {
          timestamp: { after: 1673740800000 },
        },
      })
      const gtResult = filter.findMany({
        where: {
          timestamp: { gt: 1673740800000 },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(3)
      expect(afterResult.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
  })
  describe('Date Strings', () => {
    it('after and gt should be equivalent for date strings', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findMany({
        where: {
          dateString: { after: '2023-01-15' },
        },
      })
      const gtResult = filter.findMany({
        where: {
          dateString: { gt: '2023-01-15' },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(3)
      expect(afterResult.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
  })
  describe('Regular Numbers', () => {
    it('after and gt should be equivalent for regular numbers', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findMany({
        where: {
          number: { after: 150 },
        },
      })
      const gtResult = filter.findMany({
        where: {
          number: { gt: 150 },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(3)
      expect(afterResult.data.map((item) => item.id)).toEqual([3, 4, 5])
    })
  })
  describe('Edge Cases', () => {
    it('should handle null values identically', () => {
      const dataWithNull = [
        { id: 1, date: new Date('2023-01-01') },
        { id: 2, date: null },
        { id: 3, date: new Date('2023-02-01') },
      ]
      const filter = createFilter(dataWithNull)
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
      expect(afterResult.data).toHaveLength(1)
      expect(afterResult.data[0].id).toBe(3)
    })
    it('should handle invalid dates identically', () => {
      const dataWithInvalid = [
        { id: 1, date: '2023-01-01' },
        { id: 2, date: 'invalid-date' },
        { id: 3, date: '2023-02-01' },
      ]
      const filter = createFilter(dataWithInvalid)
      const afterResult = filter.findMany({
        where: {
          date: { after: '2023-01-15' },
        },
      })
      const gtResult = filter.findMany({
        where: {
          date: { gt: '2023-01-15' },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(1)
      expect(afterResult.data[0].id).toBe(3)
    })
    it('should handle invalid reference dates identically', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findMany({
        where: {
          date: { after: 'invalid-date' },
        },
      })
      const gtResult = filter.findMany({
        where: {
          date: { gt: 'invalid-date' },
        },
      })
      expect(afterResult.data).toEqual(gtResult.data)
      expect(afterResult.data).toHaveLength(0)
    })
  })
  describe('findUnique Equivalence', () => {
    it('after and gt should work identically with findUnique', () => {
      const filter = createFilter(testData)
      const afterResult = filter.findUnique({
        where: {
          date: { after: new Date('2023-01-15') },
        },
      })
      const gtResult = filter.findUnique({
        where: {
          date: { gt: new Date('2023-01-15') },
        },
      })
      expect(afterResult).toEqual(gtResult)
      expect(afterResult?.id).toBe(3)
    })
  })
})
