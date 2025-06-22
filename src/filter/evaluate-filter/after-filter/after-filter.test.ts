import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'
import { AfterFilter } from './after-filter'

describe('AfterFilter', () => {
  it('Date', () => {
    const now = new Date()

    const filter = filterFrom<{ date: Date }>([
      { date: new Date() },
      { date: new Date() },
      { date: new Date(now.getTime() - 1000) },
      { date: new Date(now.getTime() + 2000) },
      { date: new Date(now.getTime() + 1000) },
    ])

    expect(
      filter.findMany({ where: { date: { after: new Date() } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { date: { after: new Date(now.getTime() + 1000) } },
      }).data.length
    ).toBe(1)
    expect(filter.findMany({ where: { date: { after: 0 } } }).data.length).toBe(
      5
    )
  })

  it('number', () => {
    const now: number = new Date().getTime()

    const filter = filterFrom<{ date: number }>([
      { date: now },
      { date: now },
      { date: now - 1000 },
      { date: now - 2000 },
      { date: now + 1000 },
    ])

    expect(
      filter.findMany({ where: { date: { after: now } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { date: { after: now + 1000 } } }).data.length
    ).toBe(0)
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
      filter.findMany({ where: { date: { after: now } } }).data.length
    ).toBe(2)
  })

  it('null, undefined y fechas inválidas', () => {
    const filter = filterFrom<{ date: any }>([
      { date: 'invalid-date' },
      { date: new Date() },
      { date: 0 },
    ])
    // Solo new Date() es después de 0
    expect(filter.findMany({ where: { date: { after: 0 } } }).data.length).toBe(
      1
    )
    // Si la referencia es inválida, no debe filtrar nada
    expect(
      filter.findMany({ where: { date: { after: 'invalid-date' } } }).data
        .length
    ).toBe(0)
  })

  it('findUnique', () => {
    const now = new Date()
    const filter = filterFrom<{ date: Date }>([
      { date: new Date(now.getTime() - 1000) },
      { date: new Date(now.getTime() + 1000) },
    ])
    const result = filter.findUnique({ where: { date: { after: new Date() } } })
    expect(result instanceof Date || typeof result === 'object').toBe(true)
    const result2 = filter.findUnique({
      where: { date: { after: now.getTime() + 2000 } },
    })
    expect(result2).toBe(null)
  })
})

describe('AfterFilter Unit', () => {
  it('debe retornar true si el valor es después de la referencia', () => {
    const now = new Date()
    const after = new AfterFilter(new Date(now.getTime() - 1000))
    expect(after.evaluate(new Date(now.getTime() + 1000))).toBe(true)
    expect(after.evaluate(now)).toBe(true)
    expect(after.evaluate(new Date(now.getTime() - 1000))).toBe(false)
  })

  it('debe retornar false si el valor es null, undefined o inválido', () => {
    const after = new AfterFilter(new Date())
    expect(after.evaluate(null as any)).toBe(false)
    expect(after.evaluate(undefined as any)).toBe(false)
    expect(after.evaluate('invalid-date')).toBe(false)
  })

  it('debe retornar false si la referencia es inválida', () => {
    const after = new AfterFilter('invalid-date')
    expect(after.evaluate(new Date())).toBe(false)
    expect(after.evaluate(0)).toBe(false)
  })
})
