import { describe, expect, it } from 'vitest'
import { FilterEvaluator } from '../evaluate-filter/evaluate-filter'
import { LengthFilter } from '../evaluate-filter/length-filter/length-filter'
import { createFilterEngine } from '../filter-from'
const simpleData = [
  {
    id: 1,
    name: 'Company A',
    employees: [
      {
        id: 'emp-001',
        name: 'Alice',
        projects: [
          {
            id: 'proj-001',
            name: 'Project 1',
            team: ['emp-001', 'emp-002'],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Company B',
    employees: [
      {
        id: 'emp-002',
        name: 'Bob',
        projects: [
          {
            id: 'proj-002',
            name: 'Project 2',
            team: ['emp-002'],
          },
        ],
      },
    ],
  },
]
describe('Debug Length Filter', () => {
  it('should test LengthFilter directly', () => {
    const lengthFilter = new LengthFilter({ gte: 1 })
    expect(lengthFilter.evaluate([1, 2])).toBe(true)
    expect(lengthFilter.evaluate([1])).toBe(true)
    expect(lengthFilter.evaluate([])).toBe(false)
    expect(lengthFilter.evaluate(null)).toBe(false)
    expect(lengthFilter.evaluate(undefined)).toBe(false)
  })
  it('should debug length filter with simple data', () => {
    const filter = createFilterEngine(simpleData)
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
    console.log(
      'Result:',
      result.data.map((item) => ({
        name: item.name,
        employees: item.employees.map((emp) => ({
          name: emp.name,
          projects: emp.projects.map((proj) => ({
            name: proj.name,
            team: proj.team,
          })),
        })),
      }))
    )
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.name)).toEqual([
      'Company A',
      'Company B',
    ])
  })
  it('should test length filter directly', () => {
    const filter = createFilterEngine(simpleData)
    const result = filter.findMany({
      where: {
        employees: {
          some: {
            projects: {
              some: {
                team: { length: 2 },
              },
            },
          },
        },
      } as any,
    })
    console.log(
      'Length 2 result:',
      result.data.map((item) => item.name)
    )
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Company A')
  })
  it('should test very simple length filter', () => {
    const simpleArrayData = [
      { id: 1, items: [1, 2] },
      { id: 2, items: [1] },
      { id: 3, items: [] },
    ]
    const filter = createFilterEngine(simpleArrayData)
    const result = filter.findMany({
      where: {
        items: { length: { gte: 1 } },
      } as any,
    })
    console.log(
      'Simple length result:',
      result.data.map((item) => item.id)
    )
    expect(result.data).toHaveLength(2)
    expect(result.data.map((item) => item.id)).toEqual([1, 2])
  })
  it('should debug filter initialization', () => {
    const simpleArrayData = [
      { id: 1, items: [1, 2] },
      { id: 2, items: [1] },
      { id: 3, items: [] },
    ]
    const filterConfig = { items: { length: { gte: 1 } } }
    console.log('Filter config:', JSON.stringify(filterConfig, null, 2))
    simpleArrayData.forEach((item, index) => {
      console.log(`Item ${index}:`, item)
      console.log(`Items array:`, item.items)
      console.log(`Items length:`, item.items.length)
      console.log(`Should pass gte 1:`, item.items.length >= 1)
    })
  })
  it('should debug manual evaluation', () => {
    const simpleArrayData = [
      { id: 1, items: [1, 2] },
      { id: 2, items: [1] },
      { id: 3, items: [] },
    ]
    const filterEvaluator = new FilterEvaluator({
      items: { length: { gte: 1 } },
    } as any)
    console.log('Filter evaluator created')
    console.log('Filters:', filterEvaluator['filters'])
    simpleArrayData.forEach((item, index) => {
      const result = filterEvaluator.evaluate(item)
      console.log(`Item ${index} evaluation:`, result)
    })
  })
})
