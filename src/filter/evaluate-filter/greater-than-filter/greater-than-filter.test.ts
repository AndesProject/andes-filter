import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { GreaterThanFilter } from './greater-than-filter'
describe('GreaterThanFilter', () => {
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
    expect(filter.findMany({ where: { size: { gt: -2 } } }).data.length).toBe(6)
    expect(filter.findMany({ where: { size: { gt: -1 } } }).data.length).toBe(5)
    expect(filter.findMany({ where: { size: { gt: 0 } } }).data.length).toBe(3)
    expect(filter.findMany({ where: { size: { gt: 3 } } }).data.length).toBe(0)
    expect(filter.findMany({ where: { size: { gt: 100 } } }).data.length).toBe(
      0
    )
    expect(filter.findUnique({ where: { size: { gt: -3 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gt: -2 } } })?.size).toBe(-1)
    expect(filter.findUnique({ where: { size: { gt: -1 } } })?.size).toBe(0)
    expect(filter.findUnique({ where: { size: { gt: 100 } } })).toBe(null)
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
    expect(filter.findMany({ where: { date: { gt: d1 } } }).data.length).toBe(2)
    expect(filter.findMany({ where: { date: { gt: d2 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { date: { gt: d3 } } }).data.length).toBe(0)
    expect(filter.findUnique({ where: { date: { gt: d1 } } })?.date).toEqual(d2)
    expect(filter.findUnique({ where: { date: { gt: d3 } } })).toBe(null)
  })
  it('string', () => {
    const filter = createFilterEngine<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(filter.findMany({ where: { value: { gt: 'a' } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { value: { gt: 'b' } } }).data.length).toBe(
      1
    )
    expect(filter.findMany({ where: { value: { gt: 'c' } } }).data.length).toBe(
      0
    )
    expect(filter.findUnique({ where: { value: { gt: 'a' } } })?.value).toBe(
      'b'
    )
    expect(filter.findUnique({ where: { value: { gt: 'c' } } })).toBe(null)
  })
  it('null y undefined', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { gt: 0 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { value: { gt: 1 } } }).data.length).toBe(0)
    expect(
      filter.findMany({ where: { value: { gt: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { gt: undefined } } }).data.length
    ).toBe(0)
  })
})
describe('GreaterThanFilter Unit Tests', () => {
  it('debe retornar true si el valor es mayor al umbral', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(11)).toBe(true)
    expect(filter.evaluate(100)).toBe(true)
    expect(filter.evaluate(10.01)).toBe(true)
  })
  it('debe retornar false si el valor es igual o menor al umbral', () => {
    const filter = new GreaterThanFilter(10)
    expect(filter.evaluate(10)).toBe(false)
    expect(filter.evaluate(9)).toBe(false)
    expect(filter.evaluate(-1)).toBe(false)
  })
  it('debe manejar strings y fechas', () => {
    const filter = new GreaterThanFilter('m')
    expect(filter.evaluate('z')).toBe(true)
    expect(filter.evaluate('a')).toBe(false)
    expect(filter.evaluate('m')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new GreaterThanFilter(new Date('2021-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2020-01-01'))).toBe(false)
  })
  it('debe manejar null y undefined', () => {
    const filter = new GreaterThanFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
