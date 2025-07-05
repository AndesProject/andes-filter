import { describe, expect, it, vi } from 'vitest'
import { createFilterClassMap } from '../evaluate-filter/evaluate-filter.map'
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
