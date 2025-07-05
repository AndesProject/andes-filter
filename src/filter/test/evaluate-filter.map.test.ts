import { describe, expect, it, vi } from 'vitest'
import {
  createFilterClassMap,
  getKnownOperators,
  isKnownOperator,
  registerCustomFilter,
} from '../evaluate-filter/evaluate-filter.map'
import { FilterCriteria } from '../filter.interface'

const typeToClass = {
  equals: 'EqualityFilter',
  not: 'InequalityFilter',
  in: 'InclusionFilter',
  notIn: 'ExclusionFilter',
  lt: 'LessThanFilter',
  lte: 'LessThanOrEqualFilter',
  gt: 'GreaterThanFilter',
  gte: 'GreaterThanOrEqualFilter',
  contains: 'ContainsFilter',
  notContains: 'NotContainsFilter',
  startsWith: 'StartsWithFilter',
  notStartsWith: 'NotStartsWithFilter',
  endsWith: 'EndsWithFilter',
  notEndsWith: 'NotEndsWithFilter',
  regex: 'RegexFilter',
  before: 'BeforeFilter',
  after: 'AfterFilter',
  between: 'BetweenFilter',
  some: 'SomeFilter',
  none: 'NoneFilter',
  every: 'EveryFilter',
  has: 'HasFilter',
  hasEvery: 'HasEveryFilter',
  hasSome: 'HasSomeFilter',
  length: 'LengthFilter',
  AND: 'AndFilterGroup',
  OR: 'OrFilterGroup',
  NOT: 'NotFilterGroup',
  isNull: 'IsNullFilter',
}

describe('createFilterClassMap', () => {
  Object.keys(typeToClass).forEach((type) => {
    it(`should create correct filter for type '${type}'`, () => {
      const filter = createFilterClassMap(type as keyof FilterCriteria<any>, {})
      expect(filter?.constructor?.name).toBe(typeToClass[type])
    })
  })

  it('should create distinct filter correctly', () => {
    const filter = createFilterClassMap('distinct' as any, {})
    expect(filter).toBeDefined()
    expect(typeof filter.evaluate).toBe('function')

    // Test distinct filter functionality
    expect(filter.evaluate([1, 2, 3])).toBe(true) // All unique
    expect(filter.evaluate([1, 2, 2])).toBe(false) // Duplicate
    expect(filter.evaluate('not an array')).toBe(false) // Not array
  })

  it('should return null for mode type', () => {
    const filter = createFilterClassMap('mode' as any, {})
    expect(filter).toBeNull()
  })

  it('should warn and return null for unknown type', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const filter = createFilterClassMap('unknown' as any, {})
    expect(filter).toBeNull()
    expect(spy).toHaveBeenCalledWith(
      '[FilterRegistry] Unknown filter type: unknown'
    )
    spy.mockRestore()
  })
})

describe('Filter Registry API', () => {
  it('should check if operator is known', () => {
    expect(isKnownOperator('equals')).toBe(true)
    expect(isKnownOperator('gt')).toBe(true)
    expect(isKnownOperator('unknown')).toBe(false)
  })

  it('should get all known operators', () => {
    const operators = getKnownOperators()
    expect(Array.isArray(operators)).toBe(true)
    expect(operators.length).toBeGreaterThan(0)
    expect(operators).toContain('equals')
    expect(operators).toContain('gt')
    expect(operators).toContain('contains')
  })

  it('should register custom filter', () => {
    const customFilterFactory = (value: any) => ({
      evaluate: (data: any) => data === value,
    })

    registerCustomFilter('custom', customFilterFactory)

    expect(isKnownOperator('custom')).toBe(true)

    const filter = createFilterClassMap('custom' as any, 'test')
    expect(filter).toBeDefined()
    expect(filter.evaluate('test')).toBe(true)
    expect(filter.evaluate('other')).toBe(false)
  })

  it('should handle case insensitive parameter', () => {
    const filter = createFilterClassMap('equals' as any, 'test', true)
    expect(filter).toBeDefined()
    expect(filter.evaluate('TEST')).toBe(true)
    expect(filter.evaluate('test')).toBe(true)
  })
})
