import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

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
      filter.findMany({ where: { date: { after: new Date() } } }).length
    ).toBe(2)
    expect(
      filter.findMany({
        where: { date: { after: new Date(now.getTime() + 1000) } },
      }).length
    ).toBe(1)
    expect(filter.findMany({ where: { date: { after: 0 } } }).length).toBe(5)
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

    expect(filter.findMany({ where: { date: { after: now } } }).length).toBe(1)
    expect(
      filter.findMany({ where: { date: { after: now + 1000 } } }).length
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

    expect(filter.findMany({ where: { date: { after: now } } }).length).toBe(2)
  })
})
