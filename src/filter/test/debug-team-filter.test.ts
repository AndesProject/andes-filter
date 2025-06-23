import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'

describe('Debug Team Filter', () => {
  const testData = [
    {
      id: 1,
      name: 'Project A',
      team: ['emp-001', 'emp-002', 'emp-003'],
    },
    {
      id: 2,
      name: 'Project B',
      team: ['emp-001'],
    },
  ]

  it('should debug team filter with length and every', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        team: {
          length: { gte: 2 },
        },
      } as any,
    })

    console.log(
      'Result:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Project A')
  })

  it('should debug team filter with just length', () => {
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        team: {
          length: { gte: 2 },
        },
      } as any,
    })

    console.log(
      'Result with just length:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Project A')
  })
})
