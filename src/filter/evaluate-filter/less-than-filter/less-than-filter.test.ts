import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../../filter-from'
import { LessThanFilter } from './less-than-filter'
describe('LessThanFilter', () => {
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
    expect(filter.findMany({ where: { size: { lt: -2 } } }).data.length).toBe(0)
    expect(filter.findMany({ where: { size: { lt: -1 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { size: { lt: 0 } } }).data.length).toBe(2)
    expect(filter.findMany({ where: { size: { lt: 3 } } }).data.length).toBe(6)
    expect(filter.findMany({ where: { size: { lt: 100 } } }).data.length).toBe(
      7
    )
    expect(filter.findUnique({ where: { size: { lt: -2 } } })?.size).toBe(
      undefined
    )
    expect(filter.findUnique({ where: { size: { lt: -1 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { lt: 100 } } })?.size).toBe(-2)
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
    expect(filter.findMany({ where: { date: { lt: d2 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { date: { lt: d3 } } }).data.length).toBe(2)
    expect(filter.findMany({ where: { date: { lt: d1 } } }).data.length).toBe(0)
    expect(filter.findUnique({ where: { date: { lt: d2 } } })?.date).toEqual(d1)
    expect(filter.findUnique({ where: { date: { lt: d1 } } })).toBe(null)
  })
  it('string', () => {
    const filter = createFilterEngine<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(filter.findMany({ where: { value: { lt: 'b' } } }).data.length).toBe(
      1
    )
    expect(filter.findMany({ where: { value: { lt: 'c' } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { value: { lt: 'a' } } }).data.length).toBe(
      0
    )
    expect(filter.findUnique({ where: { value: { lt: 'b' } } })?.value).toBe(
      'a'
    )
    expect(filter.findUnique({ where: { value: { lt: 'a' } } })).toBe(null)
  })
  it('null y undefined', () => {
    const filter = createFilterEngine<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { lt: 1 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { value: { lt: 0 } } }).data.length).toBe(0)
    expect(
      filter.findMany({ where: { value: { lt: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { lt: undefined } } }).data.length
    ).toBe(0)
  })
})
describe('LessThanFilter Unit Tests', () => {
  it('debe retornar true si el valor es menor al umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(5)).toBe(true)
    expect(filter.evaluate(-1)).toBe(true)
    expect(filter.evaluate(9.99)).toBe(true)
  })
  it('debe retornar false si el valor es igual o mayor al umbral', () => {
    const filter = new LessThanFilter(10)
    expect(filter.evaluate(10)).toBe(false)
    expect(filter.evaluate(11)).toBe(false)
    expect(filter.evaluate(100)).toBe(false)
  })
  it('debe manejar strings y fechas', () => {
    const filter = new LessThanFilter('m')
    expect(filter.evaluate('a')).toBe(true)
    expect(filter.evaluate('z')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new LessThanFilter(new Date('2023-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2024-01-01'))).toBe(false)
  })
  it('debe manejar null y undefined', () => {
    const filter = new LessThanFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
