import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { LessThanOrEqualFilter } from './less-than-or-equal-filter'
describe('LessThanOrEqualFilter', () => {
  it('number', () => {
    const filter = createFilterEngine<{ size: number }>([
      { size: -2 },
      { size: -1 },
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])
    expect(filter.findMany({ where: { size: { lte: -2 } } }).data.length).toBe(
      1
    )
    expect(filter.findMany({ where: { size: { lte: -1 } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { size: { lte: 0 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { lte: 3 } } }).data.length).toBe(7)
    expect(filter.findMany({ where: { size: { lte: 100 } } }).data.length).toBe(
      7
    )
    expect(filter.findUnique({ where: { size: { lte: -3 } } })).toBe(null)
    expect(filter.findUnique({ where: { size: { lte: -2 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lte: 100 } } })?.size).toBe(-2)
  })
  it('date', () => {
    const d1 = new Date('2020-01-01')
    const d2 = new Date('2021-01-01')
    const d3 = new Date('2022-01-01')
    const filter = createFilterEngine<{ date: Date }>([
      { date: d1 },
      { date: d2 },
      { date: d3 },
    ])
    expect(filter.findMany({ where: { date: { lte: d2 } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { date: { lte: d3 } } }).data.length).toBe(
      3
    )
    expect(filter.findMany({ where: { date: { lte: d1 } } }).data.length).toBe(
      1
    )
    expect(filter.findUnique({ where: { date: { lte: d1 } } })?.date).toEqual(
      d1
    )
    expect(
      filter.findUnique({ where: { date: { lte: new Date('2019-01-01') } } })
    ).toBe(null)
  })
  it('string', () => {
    const filter = createFilterEngine<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(
      filter.findMany({ where: { value: { lte: 'b' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { lte: 'c' } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { lte: 'a' } } }).data.length
    ).toBe(1)
    expect(filter.findUnique({ where: { value: { lte: 'a' } } })?.value).toBe(
      'a'
    )
    expect(filter.findUnique({ where: { value: { lte: 'A' } } })).toBe(null)
  })
  it('null y undefined', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { lte: 1 } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { value: { lte: 0 } } }).data.length).toBe(
      1
    )
    expect(
      filter.findMany({ where: { value: { lte: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { lte: undefined } } }).data.length
    ).toBe(0)
  })
})
describe('LessThanOrEqualFilter Unit Tests', () => {
  it('debe retornar true si el valor es menor o igual al umbral', () => {
    const filter = new LessThanOrEqualFilter(10)
    expect(filter.evaluate(5)).toBe(true)
    expect(filter.evaluate(10)).toBe(true)
    expect(filter.evaluate(-1)).toBe(true)
    expect(filter.evaluate(9.99)).toBe(true)
  })
  it('debe retornar false si el valor es mayor al umbral', () => {
    const filter = new LessThanOrEqualFilter(10)
    expect(filter.evaluate(11)).toBe(false)
    expect(filter.evaluate(100)).toBe(false)
  })
  it('debe manejar strings y fechas', () => {
    const filter = new LessThanOrEqualFilter('m')
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('m')).toBe(true)
    expect(filter.evaluate('z')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new LessThanOrEqualFilter(new Date('2023-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2023-01-01'))).toBe(true)
    expect(filterDate.evaluate(new Date('2024-01-01'))).toBe(false)
  })
  it('debe manejar null y undefined', () => {
    const filter = new LessThanOrEqualFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
