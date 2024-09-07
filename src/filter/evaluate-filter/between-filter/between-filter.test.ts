import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('DateBetweenFilter', () => {
  it('Date', () => {
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
      }).length
    ).toBe(5)

    expect(
      filter.findMany({
        where: {
          date: { between: ['2024-09-02', '2024-09-11'] },
        },
      }).length
    ).toBe(4)

    expect(
      filter.findMany({
        where: {
          date: { between: ['2024-09-01', '2024-09-10'] },
        },
      }).length
    ).toBe(4)
  })
})
