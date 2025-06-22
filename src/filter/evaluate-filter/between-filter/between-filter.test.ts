import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { BetweenFilter } from './between-filter'

describe('BetweenFilter', () => {
  it('string (fechas)', () => {
    const filter = filterFrom<{ date: string }>([
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

  it('number', () => {
    const filter = filterFrom<{ value: number }>([
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
    const filter = filterFrom<{ value: Date }>([
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
    const filter = filterFrom<{ value: any }>([
      { value: 'invalid-date' },
      { value: new Date() },
      { value: 0 },
    ])
    // Solo 0 está entre 0 y 1000
    expect(
      filter.findMany({ where: { value: { between: [0, 1000] } } }).data.length
    ).toBe(1)
    // Si los extremos son inválidos, no debe filtrar nada
    expect(
      filter.findMany({
        where: { value: { between: ['invalid-date', 'invalid-date'] } },
      }).data.length
    ).toBe(0)
  })

  it('findUnique', () => {
    const filter = filterFrom<{ value: number }>([
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
