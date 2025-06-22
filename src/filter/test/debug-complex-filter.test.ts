import { describe, expect, it } from 'vitest'
import { filterFrom } from '../filter-from'

describe('Debug Complex Filter', () => {
  // Simplified version of the complex data for debugging
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

  it('should debug the failing complex filter step by step', () => {
    const filter = filterFrom(complexData)

    // Let's break down the complex filter into parts
    console.log('=== DEBUGGING COMPLEX FILTER ===')

    // Step 1: Test just the length filter on projects
    const step1Result = filter.findMany({
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
    console.log(
      'Step 1 - projects length >= 1:',
      step1Result.data.map((item) => item.name)
    )

    // Step 2: Test length filter on milestones
    const step2Result = filter.findMany({
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
    console.log(
      'Step 2 - milestones length >= 2:',
      step2Result.data.map((item) => item.name)
    )

    // Step 3: Test length filter on team
    const step3Result = filter.findMany({
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
    console.log(
      'Step 3 - team length >= 2:',
      step3Result.data.map((item) => item.name)
    )

    // Step 4: Combine step 1 and step 2
    const step4Result = filter.findMany({
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
    console.log(
      'Step 4 - projects length >= 1 AND milestones length >= 2:',
      step4Result.data.map((item) => item.name)
    )

    // Step 5: The full complex filter
    const fullResult = filter.findMany({
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
    console.log(
      'Step 5 - Full complex filter:',
      fullResult.data.map((item) => item.name)
    )

    // Analyze the data structure
    console.log('\n=== DATA ANALYSIS ===')
    complexData.forEach((company, index) => {
      console.log(`\nCompany ${index + 1}: ${company.name}`)
      company.employees.forEach((emp, empIndex) => {
        console.log(`  Employee ${empIndex + 1}: ${emp.name}`)
        emp.projects.forEach((proj, projIndex) => {
          console.log(`    Project ${projIndex + 1}: ${proj.name}`)
          console.log(
            `      Team length: ${proj.team.length} (${proj.team.join(', ')})`
          )
          console.log(`      Milestones length: ${proj.milestones.length}`)
        })
      })
    })

    // Expected: TechCorp and StartupXYZ should pass
    // TechCorp: Alice has 1 project with 2 milestones and team of 3, Bob has 1 project with 2 milestones and team of 2
    // StartupXYZ: Charlie and Diana both have 1 project with 2 milestones and team of 2
    // GlobalTech: Eve has 1 project with 1 milestone (fails milestones >= 2)

    expect(fullResult.data).toHaveLength(2)
    expect(fullResult.data.map((item) => item.name)).toEqual([
      'TechCorp Inc',
      'StartupXYZ',
    ])
  })
})
