import { describe, expect, it } from 'vitest'
import { filterFrom } from '../filter-from'

describe('Complex Challenge Tests - Advanced Filter Scenarios', () => {
  // Datos complejos con múltiples niveles de anidación
  const complexData = [
    {
      id: 1,
      name: 'TechCorp Inc',
      type: 'enterprise',
      founded: new Date('2010-01-15'),
      revenue: 2500000,
      employees: [
        {
          id: 'emp-001',
          name: 'Alice Johnson',
          role: 'CEO',
          department: 'executive',
          salary: 150000,
          skills: ['leadership', 'strategy', 'management'],
          projects: [
            {
              id: 'proj-001',
              name: 'Digital Transformation',
              status: 'active',
              budget: 500000,
              team: ['emp-001', 'emp-002', 'emp-003'],
              milestones: [
                {
                  id: 'mil-001',
                  name: 'Planning',
                  completed: true,
                  date: new Date('2024-01-15'),
                },
                {
                  id: 'mil-002',
                  name: 'Implementation',
                  completed: false,
                  date: new Date('2024-06-15'),
                },
              ],
            },
          ],
          performance: {
            rating: 4.8,
            reviews: [
              { reviewer: 'board', score: 5.0, date: new Date('2024-01-01') },
              { reviewer: 'peers', score: 4.6, date: new Date('2024-01-15') },
            ],
          },
        },
        {
          id: 'emp-002',
          name: 'Bob Smith',
          role: 'CTO',
          department: 'technology',
          salary: 120000,
          skills: ['programming', 'architecture', 'cloud'],
          projects: [
            {
              id: 'proj-002',
              name: 'Cloud Migration',
              status: 'completed',
              budget: 300000,
              team: ['emp-002', 'emp-004'],
              milestones: [
                {
                  id: 'mil-003',
                  name: 'Assessment',
                  completed: true,
                  date: new Date('2023-10-01'),
                },
                {
                  id: 'mil-004',
                  name: 'Migration',
                  completed: true,
                  date: new Date('2024-02-01'),
                },
              ],
            },
          ],
          performance: {
            rating: 4.5,
            reviews: [
              { reviewer: 'ceo', score: 4.8, date: new Date('2024-01-01') },
              { reviewer: 'team', score: 4.2, date: new Date('2024-01-15') },
            ],
          },
        },
      ],
      departments: [
        {
          id: 'dept-001',
          name: 'Engineering',
          head: 'emp-002',
          budget: 800000,
          projects: ['proj-001', 'proj-002'],
          metrics: {
            productivity: 0.85,
            satisfaction: 4.2,
            turnover: 0.05,
          },
        },
        {
          id: 'dept-002',
          name: 'Sales',
          head: 'emp-003',
          budget: 600000,
          projects: ['proj-003'],
          metrics: {
            productivity: 0.78,
            satisfaction: 3.8,
            turnover: 0.12,
          },
        },
      ],
      locations: [
        {
          id: 'loc-001',
          city: 'San Francisco',
          country: 'USA',
          type: 'headquarters',
          employees: ['emp-001', 'emp-002'],
          facilities: [
            { type: 'office', size: 5000, occupied: true },
            { type: 'lab', size: 2000, occupied: true },
          ],
        },
        {
          id: 'loc-002',
          city: 'New York',
          country: 'USA',
          type: 'branch',
          employees: ['emp-003'],
          facilities: [{ type: 'office', size: 3000, occupied: true }],
        },
      ],
    },
    {
      id: 2,
      name: 'StartupXYZ',
      type: 'startup',
      founded: new Date('2022-03-20'),
      revenue: 500000,
      employees: [
        {
          id: 'emp-101',
          name: 'Charlie Brown',
          role: 'Founder',
          department: 'executive',
          salary: 80000,
          skills: ['entrepreneurship', 'product', 'marketing'],
          projects: [
            {
              id: 'proj-101',
              name: 'MVP Development',
              status: 'active',
              budget: 100000,
              team: ['emp-101', 'emp-102'],
              milestones: [
                {
                  id: 'mil-101',
                  name: 'Prototype',
                  completed: true,
                  date: new Date('2024-02-01'),
                },
                {
                  id: 'mil-102',
                  name: 'Beta Launch',
                  completed: false,
                  date: new Date('2024-05-01'),
                },
              ],
            },
          ],
          performance: {
            rating: 4.9,
            reviews: [
              {
                reviewer: 'investors',
                score: 5.0,
                date: new Date('2024-01-01'),
              },
            ],
          },
        },
        {
          id: 'emp-102',
          name: 'Diana Prince',
          role: 'Lead Developer',
          department: 'engineering',
          salary: 95000,
          skills: ['javascript', 'react', 'nodejs'],
          projects: [
            {
              id: 'proj-101',
              name: 'MVP Development',
              status: 'active',
              budget: 100000,
              team: ['emp-101', 'emp-102'],
              milestones: [
                {
                  id: 'mil-101',
                  name: 'Prototype',
                  completed: true,
                  date: new Date('2024-02-01'),
                },
                {
                  id: 'mil-102',
                  name: 'Beta Launch',
                  completed: false,
                  date: new Date('2024-05-01'),
                },
              ],
            },
          ],
          performance: {
            rating: 4.7,
            reviews: [
              { reviewer: 'founder', score: 4.8, date: new Date('2024-01-01') },
              { reviewer: 'peers', score: 4.6, date: new Date('2024-01-15') },
            ],
          },
        },
      ],
      departments: [
        {
          id: 'dept-101',
          name: 'Engineering',
          head: 'emp-102',
          budget: 200000,
          projects: ['proj-101'],
          metrics: {
            productivity: 0.92,
            satisfaction: 4.8,
            turnover: 0.0,
          },
        },
      ],
      locations: [
        {
          id: 'loc-101',
          city: 'Austin',
          country: 'USA',
          type: 'headquarters',
          employees: ['emp-101', 'emp-102'],
          facilities: [
            { type: 'office', size: 1500, occupied: true },
            { type: 'coworking', size: 500, occupied: false },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'GlobalTech Solutions',
      type: 'enterprise',
      founded: new Date('2005-08-10'),
      revenue: 5000000,
      employees: [
        {
          id: 'emp-201',
          name: 'Eve Wilson',
          role: 'VP Engineering',
          department: 'engineering',
          salary: 180000,
          skills: ['management', 'architecture', 'agile'],
          projects: [
            {
              id: 'proj-201',
              name: 'AI Platform',
              status: 'planning',
              budget: 1000000,
              team: ['emp-201', 'emp-202', 'emp-203'],
              milestones: [
                {
                  id: 'mil-201',
                  name: 'Research',
                  completed: false,
                  date: new Date('2024-08-01'),
                },
              ],
            },
          ],
          performance: {
            rating: 4.6,
            reviews: [
              { reviewer: 'ceo', score: 4.7, date: new Date('2024-01-01') },
              { reviewer: 'team', score: 4.5, date: new Date('2024-01-15') },
            ],
          },
        },
      ],
      departments: [
        {
          id: 'dept-201',
          name: 'Research & Development',
          head: 'emp-201',
          budget: 1500000,
          projects: ['proj-201'],
          metrics: {
            productivity: 0.88,
            satisfaction: 4.5,
            turnover: 0.03,
          },
        },
      ],
      locations: [
        {
          id: 'loc-201',
          city: 'London',
          country: 'UK',
          type: 'headquarters',
          employees: ['emp-201'],
          facilities: [
            { type: 'office', size: 8000, occupied: true },
            { type: 'lab', size: 3000, occupied: true },
            { type: 'conference', size: 1000, occupied: false },
          ],
        },
      ],
    },
  ]

  describe('Multi-Level Nested Object Filters', () => {
    it('should handle deep nested some filters with multiple conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                some: {
                  milestones: {
                    some: {
                      completed: { equals: true },
                      date: { gte: new Date('2024-01-01') },
                    },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ have completed milestones in 2024
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should handle complex every filter with nested conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            every: {
              performance: {
                rating: { gte: 4.5 },
                reviews: {
                  some: {
                    score: { gte: 4.5 },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(1) // Only StartupXYZ has all employees with rating >= 4.5
      expect(result.data[0].name).toBe('StartupXYZ')
    })

    it('should handle none filter with deep nested conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            none: {
              projects: {
                some: {
                  status: { equals: 'completed' },
                  budget: { gte: 200000 },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(1) // Only StartupXYZ has no employees with completed high-budget projects
      expect(result.data[0].name).toBe('StartupXYZ')
    })
  })

  describe('Complex Logical Group Combinations', () => {
    it('should handle deeply nested AND/OR combinations', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          AND: [
            { type: { equals: 'enterprise' } },
            {
              OR: [
                {
                  employees: {
                    some: {
                      salary: { gte: 150000 },
                      role: { contains: 'CEO' },
                    },
                  },
                },
                {
                  revenue: { gte: 4000000 },
                },
              ],
            },
            {
              departments: {
                some: {
                  metrics: {
                    productivity: { gte: 0.8 },
                    turnover: { lte: 0.1 },
                  },
                },
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and GlobalTech
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'GlobalTech Solutions',
      ])
    })

    it('should handle complex NOT with nested conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          NOT: [
            {
              employees: {
                some: {
                  skills: { has: 'management' },
                  performance: {
                    rating: { lt: 4.5 },
                  },
                },
              },
            },
            {
              locations: {
                some: {
                  facilities: {
                    some: {
                      type: { equals: 'lab' },
                      occupied: { equals: false },
                    },
                  },
                },
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(1) // StartupXYZ
      expect(result.data[0].name).toBe('StartupXYZ')
    })

    it('should handle multiple levels of nested logical groups', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          AND: [
            {
              OR: [
                { type: { equals: 'startup' } },
                {
                  employees: {
                    some: {
                      salary: { gte: 100000 },
                    },
                  },
                },
              ],
            },
            {
              AND: [
                {
                  departments: {
                    some: {
                      budget: { gte: 500000 },
                    },
                  },
                },
                {
                  NOT: [
                    {
                      locations: {
                        some: {
                          country: { equals: 'UK' },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(1) // TechCorp Inc
      expect(result.data[0].name).toBe('TechCorp Inc')
    })
  })

  describe('Complex Array and Object Combinations', () => {
    it('should handle hasSome with nested object conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            hasSome: [
              {
                role: { contains: 'CEO' },
                salary: { gte: 100000 },
              },
              {
                role: { contains: 'Founder' },
                skills: { has: 'entrepreneurship' },
              },
            ],
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should handle hasEvery with complex nested conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          departments: {
            hasEvery: [
              {
                metrics: {
                  productivity: { gte: 0.8 },
                },
              },
            ],
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and GlobalTech
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'GlobalTech Solutions',
      ])
    })

    it('should handle length with nested object filtering', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                length: { gte: 1 },
                some: {
                  milestones: { length: { gte: 2 } },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })
  })

  describe('Date and String Complex Filters', () => {
    it('should handle before/after with nested date conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                some: {
                  milestones: {
                    some: {
                      date: {
                        after: new Date('2024-01-01'),
                        before: new Date('2024-12-31'),
                      },
                    },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should handle string filters with insensitive mode in nested objects', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              name: { contains: 'johnson', mode: 'insensitive' },
              role: { startsWith: 'CEO', mode: 'insensitive' },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(1) // TechCorp
      expect(result.data[0].name).toBe('TechCorp Inc')
    })

    it('should handle regex with nested string conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              skills: { has: 'management' },
              name: { regex: '^[A-C]' }, // Names starting with A, B, or C
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp (Alice, Bob) and StartupXYZ (Charlie)
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })
  })

  describe('Performance and Edge Cases', () => {
    it('should handle very deep nested conditions efficiently', () => {
      const filter = filterFrom(complexData)
      const startTime = Date.now()

      const result = filter.findMany({
        where: {
          AND: [
            {
              employees: {
                some: {
                  projects: {
                    some: {
                      milestones: {
                        some: {
                          completed: { equals: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              departments: {
                some: {
                  metrics: {
                    productivity: { gte: 0.8 },
                  },
                },
              },
            },
            {
              locations: {
                some: {
                  facilities: {
                    some: {
                      occupied: { equals: true },
                    },
                  },
                },
              },
            },
          ],
        } as any,
      })

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(100) // Should complete in less than 100ms
      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ
    })

    it('should handle empty arrays and null values gracefully', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                some: {
                  team: { length: { gte: 1 } },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(3) // All companies have projects with teams
    })

    it('should handle complex numeric comparisons with nested conditions', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          AND: [
            { revenue: { gte: 1000000 } },
            {
              employees: {
                some: {
                  salary: { between: [80000, 200000] },
                  performance: {
                    rating: { gte: 4.5 },
                  },
                },
              },
            },
            {
              departments: {
                some: {
                  budget: { gte: 500000 },
                  metrics: {
                    turnover: { lte: 0.1 },
                  },
                },
              },
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and GlobalTech
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'GlobalTech Solutions',
      ])
    })
  })

  describe('Ultra Complex Scenarios', () => {
    it('should handle maximum complexity with all filter types combined', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          AND: [
            {
              OR: [
                { type: { equals: 'enterprise' } },
                {
                  employees: {
                    some: {
                      role: { contains: 'Founder' },
                    },
                  },
                },
              ],
            },
            {
              employees: {
                some: {
                  AND: [
                    { salary: { gte: 80000 } },
                    {
                      projects: {
                        some: {
                          status: { not: 'completed' },
                          milestones: {
                            some: {
                              completed: { equals: false },
                            },
                          },
                        },
                      },
                    },
                    {
                      performance: {
                        rating: { gte: 4.5 },
                        reviews: {
                          some: {
                            score: { gte: 4.5 },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              NOT: [
                {
                  locations: {
                    some: {
                      country: { equals: 'UK' },
                      facilities: {
                        some: {
                          type: { equals: 'conference' },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        } as any,
      })

      expect(result.data).toHaveLength(2) // TechCorp and StartupXYZ
      expect(result.data.map(item => item.name)).toEqual([
        'TechCorp Inc',
        'StartupXYZ',
      ])
    })

    it('should handle recursive nested conditions with multiple levels', () => {
      const filter = filterFrom(complexData)
      const result = filter.findMany({
        where: {
          employees: {
            some: {
              projects: {
                some: {
                  team: {
                    some: {
                      // This would require the system to handle employee references
                      // For now, we'll test with a simpler condition
                      equals: 'emp-001',
                    },
                  },
                  milestones: {
                    some: {
                      completed: { equals: true },
                      date: { after: new Date('2023-12-31') },
                    },
                  },
                },
              },
            },
          },
        } as any,
      })

      expect(result.data).toHaveLength(1) // TechCorp
      expect(result.data[0].name).toBe('TechCorp Inc')
    })
  })
})
