import { describe, expect, it } from 'vitest'
import { createFilterEngine } from '../filter-from'

describe('Complex Filter Integration Tests', () => {
  const complexData = [
    {
      id: 1,
      name: 'TechCorp Inc',
      employees: [
        {
          id: 'emp-001',
          name: 'Alice Johnson',
          projects: [
            {
              id: 'proj-001',
              name: 'Digital Transformation',
              team: ['emp-001', 'emp-002', 'emp-003'],
              milestones: [
                { id: 'mil-001', name: 'Planning', completed: true },
                { id: 'mil-002', name: 'Implementation', completed: false },
              ],
            },
          ],
        },
        {
          id: 'emp-002',
          name: 'Bob Smith',
          projects: [
            {
              id: 'proj-002',
              name: 'Cloud Migration',
              team: ['emp-002', 'emp-004'],
              milestones: [
                { id: 'mil-003', name: 'Assessment', completed: true },
                { id: 'mil-004', name: 'Migration', completed: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'StartupXYZ',
      employees: [
        {
          id: 'emp-101',
          name: 'Charlie Brown',
          projects: [
            {
              id: 'proj-101',
              name: 'MVP Development',
              team: ['emp-101', 'emp-102'],
              milestones: [
                { id: 'mil-101', name: 'Prototype', completed: true },
                { id: 'mil-102', name: 'Beta Launch', completed: false },
              ],
            },
          ],
        },
        {
          id: 'emp-102',
          name: 'Diana Prince',
          projects: [
            {
              id: 'proj-101',
              name: 'MVP Development',
              team: ['emp-101', 'emp-102'],
              milestones: [
                { id: 'mil-101', name: 'Prototype', completed: true },
                { id: 'mil-102', name: 'Beta Launch', completed: false },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'GlobalTech Solutions',
      employees: [
        {
          id: 'emp-201',
          name: 'Eve Wilson',
          projects: [
            {
              id: 'proj-201',
              name: 'AI Platform',
              team: ['emp-201'],
              milestones: [
                { id: 'mil-201', name: 'Research', completed: false },
              ],
            },
          ],
        },
      ],
    },
  ]

  describe('Complex nested filtering scenarios', () => {
    it('should filter companies with employees having projects with length >= 1', () => {
      const filter = createFilterEngine(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                length: { gte: 1 },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.map((item) => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
        'GlobalTech Solutions',
      ])
    })

    it('should filter companies with employees having projects with milestones >= 2', () => {
      const filter = createFilterEngine(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                some: {
                  milestones: {
                    length: { gte: 2 },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should filter companies with employees having projects with team size >= 2', () => {
      const filter = createFilterEngine(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                every: {
                  team: {
                    length: { gte: 2 },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should filter companies with employees having projects >= 1 AND milestones >= 2', () => {
      const filter = createFilterEngine(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                length: { gte: 1 },
                some: {
                  milestones: {
                    length: { gte: 2 },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should apply complex filter with multiple conditions', () => {
      const filter = createFilterEngine(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                length: { gte: 1 },
                some: {
                  milestones: {
                    length: { gte: 2 },
                  },
                },
                every: {
                  team: {
                    length: { gte: 2 },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.map((item) => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })
  })
})
