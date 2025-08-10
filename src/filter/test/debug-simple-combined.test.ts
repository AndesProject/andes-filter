import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
describe('Debug Simple Combined Filters', () => {
  const simpleData = [
    {
      id: 1,
      name: 'Company A',
      projects: [
        {
          id: 'proj-1',
          name: 'Project 1',
          milestones: [
            { id: 'mil-1', name: 'Milestone 1' },
            { id: 'mil-2', name: 'Milestone 2' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Company B',
      projects: [
        {
          id: 'proj-2',
          name: 'Project 2',
          milestones: [{ id: 'mil-3', name: 'Milestone 3' }],
        },
      ],
    },
  ]
  it('should debug combined length and some filters', () => {
    const filter = createFilter(simpleData)
    console.log('=== DEBUGGING COMBINED FILTERS ===')
    const lengthResult = filter.findMany({
      where: {
        projects: {
          length: { gte: 1 },
        },
      } as any,
    })
    console.log(
      'Length only result:',
      lengthResult.data.map((item) => item.name)
    )
    const someResult = filter.findMany({
      where: {
        projects: {
          some: {
            milestones: {
              length: { gte: 2 },
            },
          },
        },
      } as any,
    })
    console.log(
      'Some only result:',
      someResult.data.map((item) => item.name)
    )
    const combinedResult = filter.findMany({
      where: {
        projects: {
          length: { gte: 1 },
          some: {
            milestones: {
              length: { gte: 2 },
            },
          },
        },
      } as any,
    })
    console.log(
      'Combined result:',
      combinedResult.data.map((item) => item.name)
    )
    expect(combinedResult.data).toHaveLength(1)
    expect(combinedResult.data[0].name).toBe('Company A')
  })
})
