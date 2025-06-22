import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { GreaterThanOrEqualFilter } from './greater-than-or-equal-filter'

describe('GreaterThanOrEqualFilter', () => {
  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: -2 },
      { size: -1 },
      { size: 0 },
      { size: 0 },
      { size: 1 },
      { size: 2 },
      { size: 3 },
    ])

    expect(filter.findMany({ where: { size: { gte: -2 } } }).data.length).toBe(
      7
    )
    expect(filter.findMany({ where: { size: { gte: -1 } } }).data.length).toBe(
      6
    )
    expect(filter.findMany({ where: { size: { gte: 0 } } }).data.length).toBe(5)
    expect(filter.findMany({ where: { size: { gte: 3 } } }).data.length).toBe(1)
    expect(filter.findMany({ where: { size: { gte: 100 } } }).data.length).toBe(
      0
    )

    expect(filter.findUnique({ where: { size: { gte: -3 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gte: -2 } } })?.size).toBe(-2)
    expect(filter.findUnique({ where: { size: { gte: -1 } } })?.size).toBe(-1)
    expect(filter.findUnique({ where: { size: { gte: 100 } } })).toBe(null)
  })

  it('date', () => {
    const d1 = new Date('2020-01-01')
    const d2 = new Date('2021-01-01')
    const d3 = new Date('2022-01-01')
    const filter = filterFrom<{ date: Date }>([
      { date: d1 },
      { date: d2 },
      { date: d3 },
    ])
    expect(filter.findMany({ where: { date: { gte: d1 } } }).data.length).toBe(
      3
    )
    expect(filter.findMany({ where: { date: { gte: d2 } } }).data.length).toBe(
      2
    )
    expect(filter.findMany({ where: { date: { gte: d3 } } }).data.length).toBe(
      1
    )
    expect(filter.findUnique({ where: { date: { gte: d1 } } })?.date).toEqual(
      d1
    )
    expect(
      filter.findUnique({ where: { date: { gte: new Date('2023-01-01') } } })
    ).toBe(null)
  })

  it('string', () => {
    const filter = filterFrom<{ value: string }>([
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
    ])
    expect(
      filter.findMany({ where: { value: { gte: 'a' } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { value: { gte: 'b' } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { value: { gte: 'c' } } }).data.length
    ).toBe(1)
    expect(filter.findUnique({ where: { value: { gte: 'a' } } })?.value).toBe(
      'a'
    )
    expect(filter.findUnique({ where: { value: { gte: 'z' } } })).toBe(null)
  })

  it('null y undefined', () => {
    const filter = filterFrom<{ value: any }>([
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: 1 },
    ])
    expect(filter.findMany({ where: { value: { gte: 0 } } }).data.length).toBe(
      2
    ) // 0 >= 0, 1 >= 0
    expect(filter.findMany({ where: { value: { gte: 1 } } }).data.length).toBe(
      1
    ) // 1 >= 1
    expect(
      filter.findMany({ where: { value: { gte: null } } }).data.length
    ).toBe(0)
    expect(
      filter.findMany({ where: { value: { gte: undefined } } }).data.length
    ).toBe(0)
  })
})

describe('GreaterThanOrEqualFilter Unit Tests', () => {
  it('debe retornar true si el valor es mayor o igual al umbral', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(11)).toBe(true)
    expect(filter.evaluate(10)).toBe(true)
    expect(filter.evaluate(100)).toBe(true)
    expect(filter.evaluate(10.01)).toBe(true)
  })
  it('debe retornar false si el valor es menor al umbral', () => {
    const filter = new GreaterThanOrEqualFilter(10)
    expect(filter.evaluate(9)).toBe(false)
    expect(filter.evaluate(-1)).toBe(false)
    expect(filter.evaluate(9.99)).toBe(false)
  })
  it('debe manejar strings y fechas', () => {
    const filter = new GreaterThanOrEqualFilter('m')
    expect(filter.evaluate('z')).toBe(true)
    expect(filter.evaluate('m')).toBe(true)
    expect(filter.evaluate('a')).toBe(false)
    const d = new Date('2022-01-01')
    const filterDate = new GreaterThanOrEqualFilter(new Date('2021-01-01'))
    expect(filterDate.evaluate(d)).toBe(true)
    expect(filterDate.evaluate(new Date('2021-01-01'))).toBe(true)
    expect(filterDate.evaluate(new Date('2020-01-01'))).toBe(false)
  })
  it('debe manejar null y undefined', () => {
    const filter = new GreaterThanOrEqualFilter(1)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })
})
