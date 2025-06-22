import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { BeforeFilter } from './before-filter'

describe('BeforeFilter', () => {
  it('Date', () => {
    const now = new Date()

    const filter = filterFrom<{ date: Date }>([
      { date: new Date() },
      { date: new Date() },
      { date: new Date(now.getTime() - 1000) },
      { date: new Date(now.getTime() - 2000) },
      { date: new Date(now.getTime() + 1000) },
    ])

    expect(
      filter.findMany({ where: { date: { before: new Date() } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { date: { before: new Date(now.getTime() + 1000) } },
      }).data.length
    ).toBe(4)
    expect(
      filter.findMany({ where: { date: { before: 0 } } }).data.length
    ).toBe(0)
  })

  it('number', () => {
    const now: number = Date.parse('2024-01-01T00:00:00.000Z')

    const filter = filterFrom<{ date: number }>([
      { date: now },
      { date: now },
      { date: now - 1000 },
      { date: now - 2000 },
      { date: now + 1000 },
    ])

    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { date: { before: now + 1000 } } }).data.length
    ).toBe(4)
  })

  it('string', () => {
    const now: number = new Date().getTime()

    const filter = filterFrom<{ date: string }>([
      { date: '2023-08-31' },
      { date: '2023-08-31' },
      { date: '2024-08-31' },
      { date: '2025-08-31' },
      { date: '2025-08-31' },
    ])

    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length
    ).toBe(3)
  })

  it('null, undefined y fechas inválidas', () => {
    const filter = filterFrom<{ date: any }>([
      { date: 'invalid-date' },
      { date: new Date() },
      { date: 0 },
    ])
    // Solo 0 es antes de now
    const now = new Date()
    expect(
      filter.findMany({ where: { date: { before: now } } }).data.length
    ).toBe(1)
    // Si la referencia es inválida, no debe filtrar nada
    expect(
      filter.findMany({ where: { date: { before: 'invalid-date' } } }).data
        .length
    ).toBe(0)
  })

  it('findUnique', () => {
    const now = new Date('2024-01-01T00:00:00.000Z')
    const filter = filterFrom<{ date: Date }>([
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
