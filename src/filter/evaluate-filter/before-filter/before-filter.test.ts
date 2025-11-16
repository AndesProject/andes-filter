import { describe, expect, it } from 'vitest'
import { createFilter } from '../../filter-from'
import { BeforeFilter } from './before-filter'
describe('BeforeFilter', () => {
  it('Date', () => {
    const fixedDate = new Date('2025-01-01')
    const filter = createFilter<{ date: Date }>([
      { date: new Date() },
      { date: new Date() },
      { date: new Date(fixedDate.getTime() - 1000) },
      { date: new Date(fixedDate.getTime() - 2000) },
      { date: new Date(fixedDate.getTime() + 1000) },
    ])
    expect(
      filter.findMany({ where: { date: { before: fixedDate } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { date: { before: new Date('2020-01-01') } } })
        .data.length,
    ).toBe(0)
  })
  it('should filter numeric values correctly', () => {
    const now: number = Date.parse('2024-01-01T00:00:00.000Z')
    const filter = createFilter<{ date: number }>([
      { date: now },
      { date: now },
      { date: now - 1000 },
      { date: now - 2000 },
      { date: now + 1000 },
    ])
    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length,
    ).toBe(2)
    expect(
      filter.findMany({ where: { date: { before: now + 1000 } } }).data.length,
    ).toBe(4)
  })
  it('should filter string values correctly', () => {
    const now: number = Date.parse('2024-01-01T00:00:00.000Z')
    const filter = createFilter<{ date: string }>([
      { date: '2023-08-31' },
      { date: '2023-08-31' },
      { date: '2024-08-31' },
      { date: '2025-08-31' },
      { date: '2025-08-31' },
    ])
    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length,
    ).toBe(2)
  })
  it('null, undefined y fechas inválidas', () => {
    const filter = createFilter<{ date: any }>([
      { date: 'invalid-date' },
      { date: new Date() },
      { date: 0 },
    ])
    const now = new Date()
    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length,
    ).toBe(1)
    expect(
      filter.findMany({ where: { date: { before: 'invalid-date' } } }).data
        .length,
    ).toBe(0)
  })
  it('findUnique', () => {
    const now = new Date('2024-01-01T00:00:00.000Z')
    const filter = createFilter<{ date: Date }>([
      { date: new Date('2023-12-31T23:59:59.000Z') },
      { date: new Date('2024-01-01T00:00:01.000Z') },
    ])
    const result = filter.findUnique({
      where: { date: { before: now } },
    })
    expect(result instanceof Date || typeof result === 'object').toBe(true)
    const result2 = filter.findUnique({ where: { date: { before: 0 } } })
    expect(result2).toBe(null)
  })
  it('should return true if value is before reference date', () => {
    const ref = new Date('2023-01-01')
    const filter = new BeforeFilter(ref)
    expect(filter.evaluate(new Date('2022-12-31'))).toBe(true)
  })
  it('should return false if value is after reference date', () => {
    const ref = new Date('2023-01-01')
    const filter = new BeforeFilter(ref)
    expect(filter.evaluate(new Date('2023-02-01'))).toBe(false)
  })
  it('should return false if value is equal to reference date', () => {
    const ref = new Date('2023-01-01')
    const filter = new BeforeFilter(ref)
    expect(filter.evaluate(new Date('2023-01-01'))).toBe(false)
  })
  it('should handle reference date as number', () => {
    const ref = new Date('2023-01-01').getTime()
    const filter = new BeforeFilter(ref)
    expect(filter.evaluate(new Date('2022-12-31').getTime())).toBe(true)
    expect(filter.evaluate(new Date('2023-02-01').getTime())).toBe(false)
  })
  it('should return false if value is null or undefined', () => {
    const filter = new BeforeFilter(new Date('2023-01-01'))
    expect(filter.evaluate(null as any)).toBe(false)
    expect(filter.evaluate(undefined as any)).toBe(false)
  })
  it('should return false if referenceDate is invalid', () => {
    const filter = new BeforeFilter('invalid-date' as any)
    expect(filter.evaluate(new Date('2022-12-31'))).toBe(false)
  })
  it('should return false if value is invalid date', () => {
    const filter = new BeforeFilter(new Date('2023-01-01'))
    expect(filter.evaluate('invalid-date' as any)).toBe(false)
  })
})
describe('BeforeFilter Unit', () => {
  it('debe retornar true si el valor es antes de la referencia', () => {
    const now = new Date()
    const before = new BeforeFilter(new Date(now.getTime() + 1000))
    expect(before.evaluate(new Date(now.getTime() - 1000))).toBe(true)
    expect(before.evaluate(now)).toBe(true)
    expect(before.evaluate(new Date(now.getTime() + 1000))).toBe(false)
  })
  it('debe retornar false si el valor es null, undefined o inválido', () => {
    const before = new BeforeFilter(new Date())
    expect(before.evaluate(null as any)).toBe(false)
    expect(before.evaluate(undefined as any)).toBe(false)
    expect(before.evaluate('invalid-date')).toBe(false)
  })
  it('debe retornar false si la referencia es inválida', () => {
    const before = new BeforeFilter('invalid-date')
    expect(before.evaluate(new Date())).toBe(false)
    expect(before.evaluate(0)).toBe(false)
  })
})
