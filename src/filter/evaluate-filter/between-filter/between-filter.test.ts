import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { BetweenFilter } from './between-filter'

describe('BetweenFilter', () => {
  it('string (fechas)', () => {
    const filter = createFilterEngine<{ date: string }>([
      { date: '2024-09-01' },
      { date: '2024-09-08' },
      { date: '2024-09-09' },
      { date: '2024-09-10' },
      { date: '2024-09-11' },
    ])
    expect(
      filter.findMany({
        where: {
          date: { between: ['2024-09-01', '2024-09-11'] },
        },
      }).data.length
    ).toBe(5)
    expect(
      filter.findMany({
        where: {
          date: { between: ['2024-09-02', '2024-09-11'] },
        },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({
        where: {
          date: { between: ['2024-09-01', '2024-09-10'] },
        },
      }).data.length
    ).toBe(4)
  })
  it('should filter numeric values correctly', () => {
    const filter = createFilterEngine<{ value: number }>([
      { value: 1 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
    ])
    expect(
      filter.findMany({ where: { value: { between: [5, 15] } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { between: [0, 1] } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { value: { between: [21, 30] } } }).data.length
    ).toBe(0)
  })
  it('Date', () => {
    const now = new Date()
    const filter = createFilterEngine<{ value: Date }>([
      { value: new Date(now.getTime() - 10000) },
      { value: new Date(now.getTime() - 5000) },
      { value: now },
      { value: new Date(now.getTime() + 5000) },
      { value: new Date(now.getTime() + 10000) },
    ])
    expect(
      filter.findMany({
        where: {
          value: {
            between: [
              new Date(now.getTime() - 5000),
              new Date(now.getTime() + 5000),
            ],
          },
        },
      }).data.length
    ).toBe(3)
  })
  it('null, undefined y fechas inválidas', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: 'invalid-date' },
      { value: new Date() },
      { value: 0 },
    ])
    expect(
      filter.findMany({ where: { value: { between: [0, 1000] } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({
        where: { value: { between: ['invalid-date', 'invalid-date'] } },
      }).data.length
    ).toBe(0)
  })
  it('findUnique', () => {
    const filter = createFilterEngine<{ value: number }>([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ])
    const result = filter.findUnique({ where: { value: { between: [2, 3] } } })
    expect(typeof result === 'object' || typeof result === 'number').toBe(true)
    const result2 = filter.findUnique({
      where: { value: { between: [10, 20] } },
    })
    expect(result2).toBe(null)
  })
  it('should return true if value is between start and end date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2023-06-01'))).toBe(true)
  })
  it('should return true if value is equal to start date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2023-01-01'))).toBe(true)
  })
  it('should return true if value is equal to end date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2023-12-31'))).toBe(true)
  })
  it('should return false if value is before start date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2022-12-31'))).toBe(false)
  })
  it('should return false if value is after end date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2024-01-01'))).toBe(false)
  })
  it('should handle start and end as numbers', () => {
    const start = new Date('2023-01-01').getTime()
    const end = new Date('2023-12-31').getTime()
    const filter = new BetweenFilter([start, end])
    expect(filter.evaluate(new Date('2023-06-01').getTime())).toBe(true)
    expect(filter.evaluate(new Date('2022-12-31').getTime())).toBe(false)
  })
  it('should return false if value is null or undefined', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(null as any)).toBe(false)
    expect(filter.evaluate(undefined as any)).toBe(false)
  })
  it('should return false if startDate is invalid', () => {
    const filter = new BetweenFilter([
      'invalid-date' as any,
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate(new Date('2023-06-01'))).toBe(false)
  })
  it('should return false if endDate is invalid', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      'invalid-date' as any,
    ])
    expect(filter.evaluate(new Date('2023-06-01'))).toBe(false)
  })
  it('should return false if value is invalid date', () => {
    const filter = new BetweenFilter([
      new Date('2023-01-01'),
      new Date('2023-12-31'),
    ])
    expect(filter.evaluate('invalid-date' as any)).toBe(false)
  })
})
describe('BetweenFilter Unit', () => {
  it('debe retornar true si el valor está entre los extremos', () => {
    const between = new BetweenFilter([1, 10])
    expect(between.evaluate(5)).toBe(true)
    expect(between.evaluate(1)).toBe(true)
    expect(between.evaluate(10)).toBe(true)
    expect(between.evaluate(0)).toBe(false)
    expect(between.evaluate(11)).toBe(false)
  })
  it('debe retornar false si el valor es null, undefined o inválido', () => {
    const between = new BetweenFilter([1, 10])
    expect(between.evaluate(null as any)).toBe(false)
    expect(between.evaluate(undefined as any)).toBe(false)
    expect(between.evaluate('invalid-date')).toBe(false)
  })
  it('debe retornar false si los extremos son inválidos', () => {
    const between = new BetweenFilter(['invalid-date', 'invalid-date'])
    expect(between.evaluate(5)).toBe(false)
    expect(between.evaluate(0)).toBe(false)
  })
})
describe('BetweenFilter String Edge Cases', () => {
  it('should return false if all are strings but range values are not valid dates', () => {
    const filter = new BetweenFilter(['foo', 'bar'])
    expect(filter.evaluate('baz')).toBe(false)
  })
  it('should return true if all are strings and both range values are valid dates and actualValue is between them', () => {
    const filter = new BetweenFilter(['2023-01-01', '2023-12-31'])
    expect(filter.evaluate('2023-06-01')).toBe(true)
  })
  it('should return false if all are strings and both range values are valid dates and actualValue is outside the range', () => {
    const filter = new BetweenFilter(['2023-01-01', '2023-12-31'])
    expect(filter.evaluate('2024-01-01')).toBe(false)
  })
})
