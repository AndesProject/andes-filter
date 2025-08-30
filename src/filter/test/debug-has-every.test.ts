import { describe, expect, it } from 'vitest'
import { createFilter } from '../filter-from'
const complexData = [
  {
    id: 1,
    name: 'TechCorp Inc',
    type: 'enterprise',
    founded: new Date('2010-05-15'),
    revenue: 3000000,
    employees: [
      {
        id: 'emp-001',
        name: 'Alice Johnson',
        role: 'CEO',
        department: 'executive',
        salary: 200000,
        skills: ['management', 'strategy', 'leadership'],
        projects: [
          {
            id: 'proj-001',
            name: 'Digital Transformation',
            status: 'active',
            budget: 500000,
            team: ['emp-001', 'emp-002'],
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
  },
]
describe('Debug HasEvery Filter', () => {
  it('should debug hasEvery filter with productivity >= 0.8', () => {
    const filter = createFilter(complexData)
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
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.name)).toEqual([
      'StartupXYZ',
      'GlobalTech Solutions',
    ])
  })
  it('should test hasEvery with simple data', () => {
    const simpleData = [
      {
        id: 1,
        name: 'Company A',
        departments: [
          { name: 'Engineering', productivity: 0.85 },
          { name: 'Sales', productivity: 0.78 },
        ],
      },
      {
        id: 2,
        name: 'Company B',
        departments: [{ name: 'Engineering', productivity: 0.92 }],
      },
    ]
    const filter = createFilter(simpleData)
    const result = filter.findMany({
      where: {
        departments: {
          hasEvery: [
            {
              productivity: { gte: 0.8 },
            },
          ],
        },
      } as any,
    })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Company B')
  })
})
