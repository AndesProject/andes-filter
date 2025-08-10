import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug Nested Filter', () => {
  const testData = [
    {
      id: 1,
      name: 'Project A',
      team: ['emp-001', 'emp-002', 'emp-003'],
      milestones: [
        { id: 'mil-1', name: 'Milestone 1' },
        { id: 'mil-2', name: 'Milestone 2' },
      ],
    },
    {
      id: 2,
      name: 'Project B',
      team: ['emp-001'],
      milestones: [{ id: 'mil-3', name: 'Milestone 3' }],
    },
  ]
  it('should debug nested filter with every and team length', () => {
    const filter = createFilter(testData)
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
  it('should debug nested filter with milestones length', () => {
    const filter = createFilter(testData)
    const result = filter.findMany({
      where: {
        milestones: {
          length: { gte: 2 },
        },
      } as any,
    })
    console.log(
      'Result with milestones:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Project A')
  })
})
