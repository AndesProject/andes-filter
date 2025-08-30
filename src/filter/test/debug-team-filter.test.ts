import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
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
    const filter = createFilter(testData)
    const result = filter.findMany({
      where: {
        team: {
          length: { gte: 2 },
        },
      } as any,
    })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Project A')
  })
  it('should debug team filter with just length', () => {
    const filter = createFilter(testData)
    const result = filter.findMany({
      where: {
        team: {
          length: { gte: 2 },
        },
      } as any,
    })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Project A')
  })
})
