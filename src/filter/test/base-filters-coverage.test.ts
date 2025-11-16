import { describe, expect, it } from 'vitest'
import { BaseArrayFilter } from '../evaluate-filter/base-filters/base-array-filter'
import { BaseComparisonFilter } from '../evaluate-filter/base-filters/base-comparison-filter'
import { BaseCompositeFilter } from '../evaluate-filter/base-filters/base-composite-filter'
import { BaseStringFilter } from '../evaluate-filter/base-filters/base-string-filter'
import { EvaluateFilter } from '../evaluate-filter/evaluate-filter.interface'

// Concrete implementations for testing abstract classes
class TestArrayFilter extends BaseArrayFilter {
  constructor(filterCriteria: any) {
    super(filterCriteria)
  }

  evaluate(data: any): boolean {
    return this.validateArrayInput(data)
  }

  testIsArrayEmpty(data: any[]): boolean {
    return this.isArrayEmpty(data)
  }

  testHasNestedFilters(obj: any): boolean {
    return this.hasNestedFilters(obj)
  }

  testIsObject(value: any): boolean {
    return this.isObject(value)
  }

  testIsKnownOperator(key: string): boolean {
    return this.isKnownOperator(key)
  }
}

class TestComparisonFilter extends BaseComparisonFilter {
  constructor(expectedValue: any, isCaseInsensitive: boolean = false) {
    super(expectedValue, isCaseInsensitive)
  }

  evaluate(actualValue: any): boolean {
    return this.validateInputs(actualValue)
  }

  testCompareStrings(a: string, b: string): boolean {
    return this.compareStrings(a, b)
  }

  testCompareDates(date1: Date, date2: Date): boolean {
    return this.compareDates(date1, date2)
  }

  testCompareObjects(a: any, b: any): boolean {
    return this.compareObjects(a, b)
  }

  testHandleDateComparison(actualValue: any): boolean | null {
    return this.handleDateComparison(actualValue)
  }

  testHandleNaNComparison(actualValue: any): boolean | null {
    return this.handleNaNComparison(actualValue)
  }
}

class TestStringFilter extends BaseStringFilter {
  constructor(searchValue: string, isCaseInsensitive: boolean = false) {
    super(searchValue, isCaseInsensitive)
  }

  evaluate(targetString: any): boolean {
    return this.validateStringInput(targetString)
  }

  testNormalizeString(str: string): string {
    return this.normalizeString(str)
  }

  testPerformStringOperation(
    operation: 'includes' | 'startsWith' | 'endsWith',
    targetString: string,
    searchValue: string,
  ): boolean {
    return this.performStringOperation(operation, targetString, searchValue)
  }
}

class TestCompositeFilter extends BaseCompositeFilter {
  constructor(filters: EvaluateFilter[]) {
    super(filters)
  }

  evaluate(): boolean {
    return this.validateFilters()
  }
}

describe('Base Filters Coverage Tests', () => {
  describe('BaseArrayFilter', () => {
    it('should handle array validation correctly', () => {
      const filter = new TestArrayFilter({})

      expect(filter.evaluate([1, 2, 3])).toBe(true)
      expect(filter.evaluate('not an array')).toBe(false)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
    })

    it('should check if array is empty', () => {
      const filter = new TestArrayFilter({})

      expect(filter.testIsArrayEmpty([])).toBe(true)
      expect(filter.testIsArrayEmpty([1, 2, 3])).toBe(false)
    })

    it('should detect nested filters in objects', () => {
      const filter = new TestArrayFilter({})

      // Object with known operators
      const objWithFilters = {
        name: { equals: 'test' },
        age: { gt: 18 },
      }
      expect(filter.testHasNestedFilters(objWithFilters)).toBe(true)

      // Object without filters
      const objWithoutFilters = {
        name: 'test',
        age: 18,
      }
      expect(filter.testHasNestedFilters(objWithoutFilters)).toBe(false)

      // Nested object with filters
      const nestedObj = {
        user: {
          profile: {
            name: { equals: 'test' },
          },
        },
      }
      expect(filter.testHasNestedFilters(nestedObj)).toBe(true)

      // Invalid input
      expect(filter.testHasNestedFilters(null)).toBe(false)
      expect(filter.testHasNestedFilters('string')).toBe(false)
      expect(filter.testHasNestedFilters(123)).toBe(false)
    })

    it('should validate objects correctly', () => {
      const filter = new TestArrayFilter({})

      expect(filter.testIsObject({})).toBe(true)
      expect(filter.testIsObject({ key: 'value' })).toBe(true)
      expect(filter.testIsObject(null)).toBe(false)
      expect(filter.testIsObject(undefined)).toBe(false)
      expect(filter.testIsObject('string')).toBe(false)
      expect(filter.testIsObject(123)).toBe(false)
      expect(filter.testIsObject([])).toBe(false)
    })

    it('should check known operators', () => {
      const filter = new TestArrayFilter({})

      expect(filter.testIsKnownOperator('equals')).toBe(true)
      expect(filter.testIsKnownOperator('gt')).toBe(true)
      expect(filter.testIsKnownOperator('contains')).toBe(true)
      expect(filter.testIsKnownOperator('unknown')).toBe(false)
    })
  })

  describe('BaseComparisonFilter', () => {
    it('should validate inputs correctly', () => {
      // Both null
      const filter1 = new TestComparisonFilter(null)
      expect(filter1.evaluate(null)).toBe(true)

      // Both undefined
      const filter2 = new TestComparisonFilter(undefined)
      expect(filter2.evaluate(undefined)).toBe(true)

      // Expected null, actual not null
      const filter3 = new TestComparisonFilter(null)
      expect(filter3.evaluate('test')).toBe(false)

      // Expected not null, actual null
      const filter4 = new TestComparisonFilter('test')
      expect(filter4.evaluate(null)).toBe(false)

      // Expected undefined, actual not undefined
      const filter5 = new TestComparisonFilter(undefined)
      expect(filter5.evaluate('test')).toBe(false)

      // Expected not undefined, actual undefined
      const filter6 = new TestComparisonFilter('test')
      expect(filter6.evaluate(undefined)).toBe(false)

      // Mixed string/number comparison
      const filter7 = new TestComparisonFilter('123')
      expect(filter7.evaluate(123)).toBe(false)

      const filter8 = new TestComparisonFilter(123)
      expect(filter8.evaluate('123')).toBe(false)

      // Valid comparison
      const filter9 = new TestComparisonFilter('test')
      expect(filter9.evaluate('test')).toBe(true)
    })

    it('should compare strings correctly', () => {
      const filter = new TestComparisonFilter('test', false)

      expect(filter.testCompareStrings('test', 'test')).toBe(true)
      expect(filter.testCompareStrings('Test', 'test')).toBe(false)

      const insensitiveFilter = new TestComparisonFilter('test', true)
      expect(insensitiveFilter.testCompareStrings('Test', 'test')).toBe(true)
      expect(insensitiveFilter.testCompareStrings('TEST', 'test')).toBe(true)
    })

    it('should compare dates correctly', () => {
      const filter = new TestComparisonFilter(new Date('2023-01-01'))
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')

      expect(filter.testCompareDates(date1, date1)).toBe(true)
      expect(filter.testCompareDates(date1, date2)).toBe(false)
    })

    it('should compare objects correctly', () => {
      const filter = new TestComparisonFilter({})

      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 2 }
      const obj3 = { a: 1, b: 3 }
      const obj4 = { a: 1 }

      expect(filter.testCompareObjects(obj1, obj1)).toBe(true)
      expect(filter.testCompareObjects(obj1, obj2)).toBe(false)
      expect(filter.testCompareObjects(obj1, obj3)).toBe(false)
      expect(filter.testCompareObjects(obj1, obj4)).toBe(false)
      expect(filter.testCompareObjects(obj1, 'string')).toBe(false)
      expect(filter.testCompareObjects('string', obj1)).toBe(false)
    })

    it('should handle date comparison edge cases', () => {
      const filter = new TestComparisonFilter('2023-01-01')

      // Valid date comparison
      expect(filter.testHandleDateComparison('2023-01-01')).toBe(true)
      expect(filter.testHandleDateComparison(new Date('2023-01-01'))).toBe(true)

      // Invalid dates
      expect(filter.testHandleDateComparison('invalid-date')).toBe(null)
      expect(filter.testHandleDateComparison('not-a-date')).toBe(null)

      // Non-date values
      expect(filter.testHandleDateComparison(123)).toBe(null)
      expect(filter.testHandleDateComparison({})).toBe(null)
    })

    it('should handle NaN comparison', () => {
      const filter = new TestComparisonFilter(NaN)

      expect(filter.testHandleNaNComparison(NaN)).toBe(true)
      expect(filter.testHandleNaNComparison(123)).toBe(false)

      const filter2 = new TestComparisonFilter(123)
      expect(filter2.testHandleNaNComparison(NaN)).toBe(false)
      expect(filter2.testHandleNaNComparison(123)).toBe(null)
    })
  })

  describe('BaseStringFilter', () => {
    it('should validate string inputs correctly', () => {
      const filter = new TestStringFilter('test')

      expect(filter.evaluate('valid string')).toBe(true)
      expect(filter.evaluate('')).toBe(true)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
      expect(filter.evaluate({})).toBe(false)
      expect(filter.evaluate([])).toBe(false)
    })

    it('should normalize strings correctly', () => {
      const filter = new TestStringFilter('test', false)
      expect(filter.testNormalizeString('Test')).toBe('Test')

      const insensitiveFilter = new TestStringFilter('test', true)
      expect(insensitiveFilter.testNormalizeString('Test')).toBe('test')
    })

    it('should perform string operations correctly', () => {
      const filter = new TestStringFilter('test', false)

      expect(
        filter.testPerformStringOperation('includes', 'test string', 'test'),
      ).toBe(true)
      expect(
        filter.testPerformStringOperation('includes', 'other string', 'test'),
      ).toBe(false)

      expect(
        filter.testPerformStringOperation('startsWith', 'test string', 'test'),
      ).toBe(true)
      expect(
        filter.testPerformStringOperation('startsWith', 'other string', 'test'),
      ).toBe(false)

      expect(
        filter.testPerformStringOperation('endsWith', 'string test', 'test'),
      ).toBe(true)
      expect(
        filter.testPerformStringOperation('endsWith', 'string other', 'test'),
      ).toBe(false)

      // Invalid operation
      expect(
        filter.testPerformStringOperation('invalid' as any, 'test', 'test'),
      ).toBe(false)
    })

    it('should handle case insensitive operations', () => {
      const filter = new TestStringFilter('test', true)

      expect(
        filter.testPerformStringOperation('includes', 'TEST string', 'test'),
      ).toBe(true)
      expect(
        filter.testPerformStringOperation('startsWith', 'TEST string', 'test'),
      ).toBe(true)
      expect(
        filter.testPerformStringOperation('endsWith', 'string TEST', 'test'),
      ).toBe(true)
    })
  })

  describe('BaseCompositeFilter', () => {
    it('should validate filters correctly', () => {
      const mockFilter: EvaluateFilter = {
        evaluate: () => true,
      }

      const filter = new TestCompositeFilter([mockFilter])
      expect(filter.evaluate()).toBe(true)

      const emptyFilter = new TestCompositeFilter([])
      expect(emptyFilter.evaluate()).toBe(false)
    })

    it('should manage filters correctly', () => {
      const mockFilter1: EvaluateFilter = { evaluate: () => true }
      const mockFilter2: EvaluateFilter = { evaluate: () => false }

      const filter = new TestCompositeFilter([mockFilter1])

      expect(filter.getFilterCount()).toBe(1)
      expect(filter.getFilters()).toEqual([mockFilter1])

      filter.addFilter(mockFilter2)
      expect(filter.getFilterCount()).toBe(2)
      expect(filter.getFilters()).toEqual([mockFilter1, mockFilter2])

      filter.removeFilter(mockFilter1)
      expect(filter.getFilterCount()).toBe(1)
      expect(filter.getFilters()).toEqual([mockFilter2])

      filter.clearFilters()
      expect(filter.getFilterCount()).toBe(0)
      expect(filter.getFilters()).toEqual([])
    })

    it('should handle filter removal when filter not found', () => {
      const mockFilter1: EvaluateFilter = { evaluate: () => true }
      const mockFilter2: EvaluateFilter = { evaluate: () => false }

      const filter = new TestCompositeFilter([mockFilter1])
      filter.removeFilter(mockFilter2) // Should not throw error

      expect(filter.getFilterCount()).toBe(1)
    })
  })
})
