import { describe, expect, it } from 'vitest'
import {
  ArrayFilter,
  ComparisonFilter,
  DateFilter,
  LogicalFilter,
  NumericFilter,
  StringFilter,
} from '../evaluate-filter/evaluate-filter.interface'
import {
  DefaultFilterRegistry,
  FilterFactory,
  IFilterRegistry,
} from '../evaluate-filter/filter-factory'

describe('Filter Factory Coverage Tests', () => {
  describe('DefaultFilterRegistry', () => {
    it('should create comparison filter with equals criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getComparisonFilter({ equals: 'test' })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid comparison criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getComparisonFilter({})).toThrow(
        'No valid comparison criteria provided'
      )
      expect(() => registry.getComparisonFilter({ gt: 5 })).toThrow(
        'No valid comparison criteria provided'
      )
    })

    it('should create string filter with contains criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getStringFilter({ contains: 'test' })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create string filter with insensitive mode', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getStringFilter({
        contains: 'test',
        mode: 'insensitive',
      })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid string criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getStringFilter({})).toThrow(
        'No valid string criteria provided'
      )
      expect(() => registry.getStringFilter({ startsWith: 'test' })).toThrow(
        'No valid string criteria provided'
      )
    })

    it('should create numeric filter with gt criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getNumericFilter({ gt: 5 })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid numeric criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getNumericFilter({})).toThrow(
        'No valid numeric criteria provided'
      )
      expect(() => registry.getNumericFilter({ equals: 5 })).toThrow(
        'No valid numeric criteria provided'
      )
    })

    it('should create date filter with before criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getDateFilter({ before: new Date() })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid date criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getDateFilter({})).toThrow(
        'No valid date criteria provided'
      )
      expect(() => registry.getDateFilter({ after: new Date() })).toThrow(
        'No valid date criteria provided'
      )
    })

    it('should create array filter with some criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getArrayFilter({ some: { equals: 'test' } })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid array criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getArrayFilter({})).toThrow(
        'No valid array criteria provided'
      )
      expect(() =>
        registry.getArrayFilter({ every: { equals: 'test' } })
      ).toThrow('No valid array criteria provided')
    })

    it('should create logical filter with AND criteria', () => {
      const registry = new DefaultFilterRegistry()
      const filter = registry.getLogicalFilter({ AND: [{ equals: 'test' }] })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should throw error for invalid logical criteria', () => {
      const registry = new DefaultFilterRegistry()

      expect(() => registry.getLogicalFilter({})).toThrow(
        'No valid logical criteria provided'
      )
      expect(() =>
        registry.getLogicalFilter({ OR: [{ equals: 'test' }] })
      ).toThrow('No valid logical criteria provided')
    })
  })

  describe('FilterFactory', () => {
    it('should create factory with default registry', () => {
      const factory = new FilterFactory()
      expect(factory).toBeDefined()
    })

    it('should create factory with custom registry', () => {
      const mockRegistry: IFilterRegistry = {
        getComparisonFilter: () =>
          ({ evaluate: () => true }) as ComparisonFilter,
        getStringFilter: () => ({ evaluate: () => true }) as StringFilter,
        getNumericFilter: () => ({ evaluate: () => true }) as NumericFilter,
        getDateFilter: () => ({ evaluate: () => true }) as DateFilter,
        getArrayFilter: () => ({ evaluate: () => true }) as ArrayFilter,
        getLogicalFilter: () => ({ evaluate: () => true }) as LogicalFilter,
      }

      const factory = new FilterFactory(mockRegistry)
      expect(factory).toBeDefined()
    })

    it('should create factory with static method', () => {
      const mockRegistry: IFilterRegistry = {
        getComparisonFilter: () =>
          ({ evaluate: () => true }) as ComparisonFilter,
        getStringFilter: () => ({ evaluate: () => true }) as StringFilter,
        getNumericFilter: () => ({ evaluate: () => true }) as NumericFilter,
        getDateFilter: () => ({ evaluate: () => true }) as DateFilter,
        getArrayFilter: () => ({ evaluate: () => true }) as ArrayFilter,
        getLogicalFilter: () => ({ evaluate: () => true }) as LogicalFilter,
      }

      const factory = FilterFactory.withRegistry(mockRegistry)
      expect(factory).toBeDefined()
    })

    it('should create comparison filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createComparisonFilter({ equals: 'test' })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create string filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createStringFilter({ contains: 'test' })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create numeric filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createNumericFilter({ gt: 5 })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create date filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createDateFilter({ before: new Date() })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create array filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createArrayFilter({ some: { equals: 'test' } })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should create logical filter', () => {
      const factory = new FilterFactory()
      const filter = factory.createLogicalFilter({ AND: [{ equals: 'test' }] })

      expect(filter).toBeDefined()
      expect(typeof filter.evaluate).toBe('function')
    })
  })
})
