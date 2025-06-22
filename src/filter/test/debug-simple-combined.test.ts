import { describe, expect, it } from 'vitest'
import { filterFrom } from '../filter-from'

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
    const filter = filterFrom(simpleData)

    console.log('=== DEBUGGING COMBINED FILTERS ===')

    // Test just length
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

    // Test just some
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

    // Test combined
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

    // Expected: Company A should pass (has 1 project with 2 milestones)
    // Company B should fail (has 1 project but only 1 milestone)
    expect(combinedResult.data).toHaveLength(1)
    expect(combinedResult.data[0].name).toBe('Company A')
  })
})
