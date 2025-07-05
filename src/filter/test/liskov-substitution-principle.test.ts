import { describe, expect, it } from 'vitest'
import { AfterFilter } from '../evaluate-filter/after-filter/after-filter'
import { AndFilterGroup } from '../evaluate-filter/and-filter-group/and-filter-group'
import { BeforeFilter } from '../evaluate-filter/before-filter/before-filter'
import { ContainsFilter } from '../evaluate-filter/contains-filter/contains-filter'
import { EqualityFilter } from '../evaluate-filter/equality-filter/equality-filter'
import { EvaluateFilter } from '../evaluate-filter/evaluate-filter.interface'
import { OrFilterGroup } from '../evaluate-filter/or-filter-group/or-filter-group'

describe('Liskov Substitution Principle Tests', () => {
  describe('Filter Substitution', () => {
    it('should allow substitution of different comparison filters', () => {
      const filters: EvaluateFilter[] = [
        new EqualityFilter('test', false),
        new EqualityFilter('other', true),
      ]

      filters.forEach((filter) => {
        expect(typeof filter.evaluate).toBe('function')
        expect(filter.evaluate('test')).toBeDefined()
      })
    })

    it('should allow substitution of different string filters', () => {
      const filters: EvaluateFilter[] = [
        new ContainsFilter('test', false),
        new ContainsFilter('other', true),
      ]

      filters.forEach((filter) => {
        expect(typeof filter.evaluate).toBe('function')
        expect(filter.evaluate('test string')).toBeDefined()
      })
    })

    it('should allow substitution of different date filters', () => {
      const date = new Date('2023-01-01')
      const filters: EvaluateFilter[] = [
        new BeforeFilter(date),
        new AfterFilter(date),
      ]

      filters.forEach((filter) => {
        expect(typeof filter.evaluate).toBe('function')
        expect(filter.evaluate(date)).toBeDefined()
      })
    })

    it('should allow substitution of different composite filters', () => {
      const filters: EvaluateFilter[] = [
        new AndFilterGroup<any>([]),
        new OrFilterGroup<any>([]),
      ]

      filters.forEach((filter) => {
        expect(typeof filter.evaluate).toBe('function')
        expect(filter.evaluate({})).toBeDefined()
      })
    })
  })

  describe('Filter Collections', () => {
    it('should work with collections of different filter types', () => {
      const date = new Date('2023-01-01')
      const allFilters: EvaluateFilter[] = [
        new EqualityFilter('test', false),
        new ContainsFilter('test', false),
        new BeforeFilter(date),
        new AndFilterGroup<any>([]),
      ]

      allFilters.forEach((filter) => {
        expect(typeof filter.evaluate).toBe('function')
        expect(() => filter.evaluate({})).not.toThrow()
      })
    })
  })

  describe('Filter Processing', () => {
    it('should process different filter types uniformly', () => {
      const date = new Date('2023-01-01')
      const filters: EvaluateFilter[] = [
        new EqualityFilter('test', false),
        new ContainsFilter('test', false),
        new BeforeFilter(date),
      ]

      const processFilter = (filter: EvaluateFilter, data: any): boolean => {
        return filter.evaluate(data)
      }

      filters.forEach((filter) => {
        const result = processFilter(filter, 'test')
        expect(typeof result).toBe('boolean')
      })
    })

    it('should create filters dynamically', () => {
      const createFilter = (type: string): EvaluateFilter => {
        switch (type) {
          case 'equality':
            return new EqualityFilter('test', false)
          case 'contains':
            return new ContainsFilter('test', false)
          case 'before':
            return new BeforeFilter(new Date())
          default:
            return new EqualityFilter('default', false)
        }
      }

      const filterTypes = ['equality', 'contains', 'before']
      filterTypes.forEach((type) => {
        const filter = createFilter(type)
        expect(typeof filter.evaluate).toBe('function')
        expect(() => filter.evaluate({})).not.toThrow()
      })
    })
  })
})
