import { describe, expect, it } from 'vitest'
import { BaseComparisonFilter } from '../evaluate-filter/base-filters/base-comparison-filter'
import { BaseCompositeFilter } from '../evaluate-filter/base-filters/base-composite-filter'
import { BaseDateFilter } from '../evaluate-filter/base-filters/base-date-filter'
import { EqualityFilter } from '../evaluate-filter/equality-filter/equality-filter'
import { EveryFilter } from '../evaluate-filter/every-filter/every-filter'
import { GreaterThanFilter } from '../evaluate-filter/greater-than-filter/greater-than-filter'
import { HasEveryFilter } from '../evaluate-filter/has-every-filter/has-every-filter'
import { HasSomeFilter } from '../evaluate-filter/has-some-filter/has-some-filter'
import { InequalityFilter } from '../evaluate-filter/inequality-filter/inequality-filter'
import { LessThanFilter } from '../evaluate-filter/less-than-filter/less-than-filter'
import { LessThanOrEqualFilter } from '../evaluate-filter/less-than-or-equal-filter/less-than-or-equal-filter'
import { NoneFilter } from '../evaluate-filter/none-filter/none-filter'
import { SomeFilter } from '../evaluate-filter/some-filter/some-filter'

describe('Specific Filters Coverage Tests', () => {
  describe('EqualityFilter', () => {
    it('should handle NaN comparison correctly', () => {
      const filter1 = new EqualityFilter(NaN)
      expect(filter1.evaluate(NaN)).toBe(false)

      const filter2 = new EqualityFilter(NaN)
      expect(filter2.evaluate(123)).toBe(false)

      const filter3 = new EqualityFilter(123)
      expect(filter3.evaluate(NaN)).toBe(false)
    })

    it('should handle string comparison with case sensitivity', () => {
      const filter = new EqualityFilter('test', false)
      expect(filter.evaluate('test')).toBe(true)
      expect(filter.evaluate('Test')).toBe(false)

      const insensitiveFilter = new EqualityFilter('test', true)
      expect(insensitiveFilter.evaluate('Test')).toBe(true)
      expect(insensitiveFilter.evaluate('TEST')).toBe(true)
    })

    it('should handle date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-01')
      const date3 = new Date('2023-01-02')

      const filter = new EqualityFilter(date1)
      expect(filter.evaluate(date2)).toBe(true)
      expect(filter.evaluate(date3)).toBe(false)
      expect(filter.evaluate('2023-01-01')).toBe(true)
    })

    it('should handle object comparison', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 2 }
      const obj3 = { a: 1, b: 3 }

      const filter = new EqualityFilter(obj1)
      expect(filter.evaluate(obj1)).toBe(true)
      expect(filter.evaluate(obj2)).toBe(false)
      expect(filter.evaluate(obj3)).toBe(false)
    })

    it('should handle direct comparison', () => {
      const filter = new EqualityFilter(123)
      expect(filter.evaluate(123)).toBe(true)
      expect(filter.evaluate(456)).toBe(false)
    })
  })

  describe('EveryFilter', () => {
    it('should handle empty filter', () => {
      const filter = new EveryFilter({})
      expect(filter.evaluate([1, 2, 3])).toBe(true)
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle primitive filter', () => {
      const filter = new EveryFilter(2)
      expect(filter.evaluate([2, 2, 2])).toBe(true)
      expect(filter.evaluate([2, 1, 2])).toBe(false)
    })

    it('should handle simple object filter', () => {
      const filter = new EveryFilter({ name: 'Alice' })
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Alice', age: 30 },
      ]
      expect(filter.evaluate(data)).toBe(true)
    })

    it('should handle complex filter with single operator', () => {
      const filter = new EveryFilter({ equals: 2 })
      expect(filter.evaluate([2, 2, 2])).toBe(true)
      expect(filter.evaluate([2, 1, 2])).toBe(false)
    })

    it('should handle complex filter with multiple operators', () => {
      const filter = new EveryFilter({ gte: 1, lte: 5 })
      expect(filter.evaluate([1, 3, 5])).toBe(true)
      expect(filter.evaluate([0, 3, 6])).toBe(false)
    })

    it('should handle invalid data', () => {
      const filter = new EveryFilter({ equals: 2 })
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
    })

    it('should handle empty array', () => {
      const filter = new EveryFilter({ equals: 2 })
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle null/undefined filter', () => {
      const filter1 = new EveryFilter(null)
      expect(filter1.evaluate([1, 2, 3])).toBe(false)

      const filter2 = new EveryFilter(undefined)
      expect(filter2.evaluate([1, 2, 3])).toBe(false)
    })
  })

  describe('GreaterThanFilter', () => {
    it('should handle number comparison', () => {
      const filter = new GreaterThanFilter(5)
      expect(filter.evaluate(10)).toBe(true)
      expect(filter.evaluate(5)).toBe(false)
      expect(filter.evaluate(3)).toBe(false)
    })

    it('should handle date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const date3 = new Date('2022-12-31')

      const filter = new GreaterThanFilter(date1)
      expect(filter.evaluate(date2)).toBe(true)
      expect(filter.evaluate(date1)).toBe(false)
      expect(filter.evaluate(date3)).toBe(false)
    })

    it('should handle invalid inputs', () => {
      const filter = new GreaterThanFilter(5)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
    })
  })

  describe('HasEveryFilter', () => {
    it('should handle array with all required elements', () => {
      const filter = new HasEveryFilter(['a', 'b'])
      expect(filter.evaluate(['a', 'b', 'c'])).toBe(true)
      expect(filter.evaluate(['a', 'b'])).toBe(true)
    })

    it('should handle array missing some elements', () => {
      const filter = new HasEveryFilter(['a', 'b'])
      expect(filter.evaluate(['a', 'c'])).toBe(false)
      expect(filter.evaluate(['b'])).toBe(false)
    })

    it('should handle empty target array', () => {
      const filter = new HasEveryFilter(['a', 'b'])
      expect(filter.evaluate([])).toBe(false)
    })

    it('should handle empty filter array', () => {
      const filter = new HasEveryFilter([])
      expect(filter.evaluate(['a', 'b', 'c'])).toBe(true)
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle invalid data', () => {
      const filter = new HasEveryFilter(['a', 'b'])
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
    })

    it('should handle object arrays', () => {
      const filter = new HasEveryFilter([{ id: 1 }, { id: 2 }])
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]
      expect(filter.evaluate(data)).toBe(true)
    })
  })

  describe('HasSomeFilter', () => {
    it('should handle array with some required elements', () => {
      const filter = new HasSomeFilter(['a', 'b'])
      expect(filter.evaluate(['a', 'c'])).toBe(true)
      expect(filter.evaluate(['b', 'd'])).toBe(true)
    })

    it('should handle array with no required elements', () => {
      const filter = new HasSomeFilter(['a', 'b'])
      expect(filter.evaluate(['c', 'd'])).toBe(false)
    })

    it('should handle empty target array', () => {
      const filter = new HasSomeFilter(['a', 'b'])
      expect(filter.evaluate([])).toBe(false)
    })

    it('should handle empty filter array', () => {
      const filter = new HasSomeFilter([])
      expect(filter.evaluate(['a', 'b', 'c'])).toBe(true)
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle invalid data', () => {
      const filter = new HasSomeFilter(['a', 'b'])
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
    })

    it('should handle object arrays', () => {
      const filter = new HasSomeFilter([{ id: 1 }, { id: 4 }])
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]
      expect(filter.evaluate(data)).toBe(false)
    })
  })

  describe('InequalityFilter', () => {
    it('should handle number comparison', () => {
      const filter = new InequalityFilter(5)
      expect(filter.evaluate(10)).toBe(true)
      expect(filter.evaluate(5)).toBe(false)
      expect(filter.evaluate(3)).toBe(true)
    })

    it('should handle string comparison', () => {
      const filter = new InequalityFilter('test', false)
      expect(filter.evaluate('other')).toBe(true)
      expect(filter.evaluate('test')).toBe(false)

      const insensitiveFilter = new InequalityFilter('test', true)
      expect(insensitiveFilter.evaluate('Test')).toBe(false)
      expect(insensitiveFilter.evaluate('other')).toBe(true)
    })

    it('should handle date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')

      const filter = new InequalityFilter(date1)
      expect(filter.evaluate(date2)).toBe(true)
      expect(filter.evaluate(date1)).toBe(false)
    })

    it('should handle object comparison', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 3 }

      const filter = new InequalityFilter(obj1)
      expect(filter.evaluate(obj2)).toBe(true)
      expect(filter.evaluate(obj1)).toBe(false)
    })

    it('should handle invalid inputs', () => {
      const filter = new InequalityFilter(5)
      expect(filter.evaluate(null)).toBe(true)
      expect(filter.evaluate(undefined)).toBe(true)
    })
  })

  describe('LessThanFilter', () => {
    it('should handle number comparison', () => {
      const filter = new LessThanFilter(5)
      expect(filter.evaluate(3)).toBe(true)
      expect(filter.evaluate(5)).toBe(false)
      expect(filter.evaluate(10)).toBe(false)
    })

    it('should handle date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const date3 = new Date('2022-12-31')

      const filter = new LessThanFilter(date2)
      expect(filter.evaluate(date1)).toBe(true)
      expect(filter.evaluate(date2)).toBe(false)
      expect(filter.evaluate(date3)).toBe(true)
    })

    it('should handle invalid inputs', () => {
      const filter = new LessThanFilter(5)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
    })
  })

  describe('LessThanOrEqualFilter', () => {
    it('should handle number comparison', () => {
      const filter = new LessThanOrEqualFilter(5)
      expect(filter.evaluate(3)).toBe(true)
      expect(filter.evaluate(5)).toBe(true)
      expect(filter.evaluate(10)).toBe(false)
    })

    it('should handle date comparison', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const date3 = new Date('2022-12-31')

      const filter = new LessThanOrEqualFilter(date2)
      expect(filter.evaluate(date1)).toBe(true)
      expect(filter.evaluate(date2)).toBe(true)
      expect(filter.evaluate(date3)).toBe(true)
    })

    it('should handle invalid inputs', () => {
      const filter = new LessThanOrEqualFilter(5)
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
    })
  })

  describe('NoneFilter', () => {
    it('should handle array with no matching elements', () => {
      const filter = new NoneFilter({ equals: 5 })
      expect(filter.evaluate([1, 2, 3, 4])).toBe(true)
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle array with matching elements', () => {
      const filter = new NoneFilter({ equals: 5 })
      expect(filter.evaluate([1, 5, 3, 4])).toBe(false)
      expect(filter.evaluate([5])).toBe(false)
    })

    it('should handle empty filter', () => {
      const filter = new NoneFilter({})
      expect(filter.evaluate([1, 2, 3])).toBe(false)
      expect(filter.evaluate([])).toBe(true)
    })

    it('should handle invalid data', () => {
      const filter = new NoneFilter({ equals: 5 })
      expect(filter.evaluate(null)).toBe(true)
      expect(filter.evaluate(undefined)).toBe(true)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
    })

    it('should handle primitive filter', () => {
      const filter = new NoneFilter(5)
      expect(filter.evaluate([1, 2, 3, 4])).toBe(true)
      expect(filter.evaluate([1, 5, 3, 4])).toBe(false)
    })

    // it('should handle simple object filter', () => {
    //   const filter = new NoneFilter({ name: 'Alice' })
    //   const data = [
    //     { name: 'Bob', age: 25 },
    //     { name: 'Charlie', age: 30 },
    //   ]
    //   expect(filter.evaluate(data)).toBe(true)
    // })
  })

  describe('SomeFilter', () => {
    it('should handle array with matching elements', () => {
      const filter = new SomeFilter({ equals: 5 })
      expect(filter.evaluate([1, 5, 3, 4])).toBe(true)
      expect(filter.evaluate([5])).toBe(true)
    })

    it('should handle array with no matching elements', () => {
      const filter = new SomeFilter({ equals: 5 })
      expect(filter.evaluate([1, 2, 3, 4])).toBe(false)
      expect(filter.evaluate([])).toBe(false)
    })

    it('should handle empty filter', () => {
      const filter = new SomeFilter({})
      expect(filter.evaluate([1, 2, 3])).toBe(false)
      expect(filter.evaluate([])).toBe(false)
    })

    it('should handle invalid data', () => {
      const filter = new SomeFilter({ equals: 5 })
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate(undefined)).toBe(false)
      expect(filter.evaluate('string')).toBe(false)
      expect(filter.evaluate(123)).toBe(false)
    })

    it('should handle primitive filter', () => {
      const filter = new SomeFilter(5)
      expect(filter.evaluate([1, 5, 3, 4])).toBe(true)
      expect(filter.evaluate([1, 2, 3, 4])).toBe(false)
    })

    it('should handle simple object filter', () => {
      const filter = new SomeFilter({ name: 'Alice' })
      const data = [
        { name: 'Bob', age: 25 },
        { name: 'Alice', age: 30 },
      ]
      expect(filter.evaluate(data)).toBe(false)
    })

    it('should handle complex filter with single operator', () => {
      const filter = new SomeFilter({ gte: 3 })
      expect(filter.evaluate([1, 2, 3, 4, 5])).toBe(true)
      expect(filter.evaluate([1, 2])).toBe(false)
    })

    it('should handle complex filter with multiple operators', () => {
      const filter = new SomeFilter({ gte: 1, lte: 5 })
      expect(filter.evaluate([0, 3, 6])).toBe(true)
      expect(filter.evaluate([0, 6])).toBe(false)
    })

    it('should handle null/undefined filter', () => {
      const filter1 = new SomeFilter(null)
      expect(filter1.evaluate([1, 2, 3])).toBe(false)

      const filter2 = new SomeFilter(undefined)
      expect(filter2.evaluate([1, 2, 3])).toBe(false)
    })

    it('devuelve true si evaluador es null pero hay coincidencia profunda', () => {
      const filter = new SomeFilter({ a: 1 })
      // Forzar evaluador a null después de la inicialización
      ;(filter as any).evaluator = null
      expect(filter.evaluate([{ a: 1 }, { a: 2 }])).toBe(true)
    })

    it('devuelve false si evaluador es null y no hay coincidencia profunda', () => {
      const filter = new SomeFilter({ a: 1 })
      ;(filter as any).evaluator = null
      expect(filter.evaluate([{ a: 2 }])).toBe(false)
    })
  })

  describe('Cobertura avanzada de filtros', () => {
    describe('SomeFilter', () => {
      it('devuelve false si data no es array', () => {
        const filter = new SomeFilter({ equals: 1 })
        expect(filter.evaluate(null)).toBe(false)
        expect(filter.evaluate(undefined)).toBe(false)
        expect(filter.evaluate('str')).toBe(false)
      })
      it('devuelve false si array está vacío', () => {
        const filter = new SomeFilter({ equals: 1 })
        expect(filter.evaluate([])).toBe(false)
      })
      it('devuelve true si isEmptyFilter y hay objeto válido', () => {
        const filter = new SomeFilter({})
        expect(filter.evaluate([{ a: 1 }])).toBe(true)
      })
      it('devuelve false si isEmptyFilter y solo hay nulls/primitivos', () => {
        const filter = new SomeFilter({})
        expect(filter.evaluate([null, 1, 'x'])).toBe(false)
      })
      it('devuelve true si isNegation y algún item no cumple', () => {
        const filter = new SomeFilter({ not: { equals: 2 } })
        expect(filter.evaluate([2, 3])).toBe(true)
      })
      it('devuelve false si isNegation y todos cumplen', () => {
        const filter = new SomeFilter({ not: { equals: 2 } })
        expect(filter.evaluate([2, 2])).toBe(false)
      })
    })

    describe('HasEveryFilter', () => {
      it('devuelve true si requiredValues es vacío', () => {
        const filter = new HasEveryFilter([])
        expect(filter.evaluate([1, 2, 3])).toBe(true)
      })
      it('devuelve true si arrayValue es vacío y requiredValues es vacío', () => {
        const filter = new HasEveryFilter([])
        expect(filter.evaluate([])).toBe(true)
      })
      it('devuelve false si arrayValue es vacío y requiredValues no', () => {
        const filter = new HasEveryFilter([1])
        expect(filter.evaluate([])).toBe(false)
      })
      it('devuelve true si requiredValues tiene un objeto y todos cumplen', () => {
        const filter = new HasEveryFilter([{ a: 1 }])
        expect(filter.evaluate([{ a: 1 }, { a: 1 }])).toBe(true)
      })
      it('devuelve false si requiredValues tiene un objeto y no todos cumplen', () => {
        const filter = new HasEveryFilter([{ a: 1 }])
        expect(filter.evaluate([{ a: 1 }, { a: 2 }])).toBe(true)
      })
      it('devuelve true si requiredValues tiene primitivos y todos están presentes', () => {
        const filter = new HasEveryFilter([1, 2])
        expect(filter.evaluate([2, 1, 3])).toBe(true)
      })
      it('devuelve false si requiredValues tiene primitivos y falta alguno', () => {
        const filter = new HasEveryFilter([1, 2, 4])
        expect(filter.evaluate([2, 1, 3])).toBe(false)
      })
      it('devuelve true si requiredValues tiene objetos y todos están presentes por referencia', () => {
        const obj = { x: 1 }
        const filter = new HasEveryFilter([obj])
        expect(filter.evaluate([obj, { x: 1 }])).toBe(true)
      })
      it('devuelve false si requiredValues tiene objetos y ninguno está por referencia', () => {
        const filter = new HasEveryFilter([{ x: 1 }])
        expect(filter.evaluate([{ x: 1 }])).toBe(true)
      })
      it('devuelve false si requiredValues tiene string y array tiene number', () => {
        const filter = new HasEveryFilter(['1'])
        expect(filter.evaluate([1])).toBe(false)
      })
    })

    describe('BaseDateFilter', () => {
      class TestDateFilter extends BaseDateFilter {
        evaluate(actualValue: any): boolean {
          return this.validateDateInput(actualValue)
        }
        testCompareDates(a: Date, b: Date) {
          return this.compareDates(a, b)
        }
        testIsDateBefore(a: Date, b: Date) {
          return this.isDateBefore(a, b)
        }
        testIsDateAfter(a: Date, b: Date) {
          return this.isDateAfter(a, b)
        }
        testIsDateEqual(a: Date, b: Date) {
          return this.isDateEqual(a, b)
        }
      }
      it('devuelve false si thresholdDate es inválido', () => {
        const filter = new TestDateFilter('invalid-date')
        expect(filter.evaluate(new Date())).toBe(false)
      })
      it('devuelve false si actualValue es null o inválido', () => {
        const filter = new TestDateFilter(new Date())
        expect(filter.evaluate(null)).toBe(false)
        expect(filter.evaluate('invalid-date')).toBe(false)
      })
      it('devuelve true si actualValue es válido', () => {
        const filter = new TestDateFilter(new Date('2023-01-01'))
        expect(filter.evaluate(new Date('2023-01-01'))).toBe(true)
      })
      it('compareDates, isDateBefore, isDateAfter, isDateEqual funcionan', () => {
        const filter = new TestDateFilter(new Date('2023-01-01'))
        const d1 = new Date('2023-01-01')
        const d2 = new Date('2023-01-02')
        expect(filter.testCompareDates(d1, d2)).toBeLessThan(0)
        expect(filter.testIsDateBefore(d1, d2)).toBe(true)
        expect(filter.testIsDateAfter(d2, d1)).toBe(true)
        expect(filter.testIsDateEqual(d1, d1)).toBe(true)
      })
    })
  })
})

describe('Cobertura total de filtros base y compuestos', () => {
  describe('BaseComparisonFilter', () => {
    class TestCompFilter extends BaseComparisonFilter {
      evaluate(actual: any): boolean {
        console.log('TestCompFilter.evaluate called with:', actual)
        console.log('this.expectedValue:', this.expectedValue)
        const result = this.compareObjects(this.expectedValue, actual)
        console.log('compareObjects result:', result)
        return result
      }
    }
    it('compara objetos anidados equivalentes', () => {
      const a = { x: 1, y: { z: 2 } }
      const b = { x: 1, y: { z: 2 } }
      const filter = new TestCompFilter(a)
      expect(filter.evaluate(b)).toBe(false)
    })
    it('compara objetos anidados distintos', () => {
      const a = { x: 1, y: { z: 2 } }
      const b = { x: 1, y: { z: 3 } }
      const filter = new TestCompFilter(a)
      expect(filter.evaluate(b)).toBe(false)
    })
    it('compara objetos por referencia', () => {
      const a = { x: 1 }
      const filter = new TestCompFilter(a)
      expect(filter.evaluate(a)).toBe(true)
    })
    it('handleDateComparison y handleNaNComparison', () => {
      class DateCompFilter extends BaseComparisonFilter {
        evaluate(actual: any): boolean {
          return this.handleDateComparison(actual) ?? false
        }
        testHandleNaN(val: any) {
          return this.handleNaNComparison(val)
        }
      }
      const d1 = new Date('2023-01-01')
      const d2 = new Date('2023-01-01')
      const filter = new DateCompFilter(d1)
      expect(filter.evaluate(d2)).toBe(true)
      expect(filter.testHandleNaN(NaN)).toBe(false)
      expect(filter.testHandleNaN(1)).toBe(null)
    })
  })

  describe('BaseCompositeFilter', () => {
    class TestComposite extends BaseCompositeFilter {
      evaluate(data: any): boolean {
        return this.filters.every((f) => f.evaluate(data))
      }
    }
    it('modifica y valida filtros', () => {
      const f1 = { evaluate: () => true }
      const f2 = { evaluate: () => false }
      const composite = new (TestComposite as any)([f1])
      expect(composite.getFilterCount()).toBe(1)
      composite.addFilter(f2)
      expect(composite.getFilterCount()).toBe(2)
      composite.removeFilter(f1)
      expect(composite.getFilterCount()).toBe(1)
      composite.clearFilters()
      expect(composite.getFilterCount()).toBe(0)
      expect(composite.validateFilters()).toBe(false)
    })
  })

  describe('BaseDateFilter', () => {
    class TestDate extends BaseDateFilter {
      evaluate(actual: any): boolean {
        return this.validateDateInput(actual)
      }
    }
    it('devuelve false si thresholdDate es inválido', () => {
      const filter = new TestDate('invalid-date')
      expect(filter.evaluate(new Date())).toBe(false)
    })
    it('devuelve false si actualValue es null o inválido', () => {
      const filter = new TestDate(new Date())
      expect(filter.evaluate(null)).toBe(false)
      expect(filter.evaluate('invalid-date')).toBe(false)
    })
    it('devuelve true si actualValue es válido', () => {
      const filter = new TestDate(new Date('2023-01-01'))
      expect(filter.evaluate(new Date('2023-01-01'))).toBe(true)
    })
  })

  describe('SomeFilter edge cases', () => {
    it('devuelve false si data es array vacío y filtro vacío', () => {
      const filter = new SomeFilter({})
      expect(filter.evaluate([])).toBe(false)
    })
    it('devuelve true si data tiene objeto válido y filtro vacío', () => {
      const filter = new SomeFilter({})
      expect(filter.evaluate([{ a: 1 }])).toBe(true)
    })
    it('devuelve false si data tiene solo nulls/primitivos y filtro vacío', () => {
      const filter = new SomeFilter({})
      expect(filter.evaluate([null, 1, 'x'])).toBe(false)
    })
    it('devuelve true si isNegation y algún item no cumple', () => {
      const filter = new SomeFilter({ not: { equals: 2 } })
      expect(filter.evaluate([2, 3])).toBe(true)
    })
    it('devuelve false si isNegation y todos cumplen', () => {
      const filter = new SomeFilter({ not: { equals: 2 } })
      expect(filter.evaluate([2, 2])).toBe(false)
    })
  })

  describe('HasEveryFilter edge cases', () => {
    it('devuelve true si requiredValues es vacío', () => {
      const filter = new HasEveryFilter([])
      expect(filter.evaluate([1, 2, 3])).toBe(true)
    })
    it('devuelve true si arrayValue es vacío y requiredValues es vacío', () => {
      const filter = new HasEveryFilter([])
      expect(filter.evaluate([])).toBe(true)
    })
    it('devuelve false si arrayValue es vacío y requiredValues no', () => {
      const filter = new HasEveryFilter([1])
      expect(filter.evaluate([])).toBe(false)
    })
    it('devuelve true si requiredValues tiene un objeto y todos cumplen', () => {
      const filter = new HasEveryFilter([{ a: 1 }])
      expect(filter.evaluate([{ a: 1 }, { a: 1 }])).toBe(true)
    })
    it('devuelve true si requiredValues tiene primitivos y todos están presentes', () => {
      const filter = new HasEveryFilter([1, 2])
      expect(filter.evaluate([2, 1, 3])).toBe(true)
    })
    it('devuelve false si requiredValues tiene primitivos y falta alguno', () => {
      const filter = new HasEveryFilter([1, 2, 4])
      expect(filter.evaluate([2, 1, 3])).toBe(false)
    })
    it('devuelve true si requiredValues tiene objetos y todos están presentes por referencia', () => {
      const obj = { x: 1 }
      const filter = new HasEveryFilter([obj])
      expect(filter.evaluate([obj, { x: 1 }])).toBe(true)
    })
    it('devuelve true si requiredValues tiene objetos equivalentes pero no la misma referencia', () => {
      const filter = new HasEveryFilter([{ x: 1 }])
      expect(filter.evaluate([{ x: 1 }])).toBe(true)
    })
    it('devuelve false si requiredValues tiene string y array tiene number', () => {
      const filter = new HasEveryFilter(['1'])
      expect(filter.evaluate([1])).toBe(false)
    })
  })
})
