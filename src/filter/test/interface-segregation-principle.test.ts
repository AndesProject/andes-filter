import { describe, expect, it } from 'vitest'
import { StringFilter } from '../evaluate-filter/evaluate-filter.interface'
import { FilterFactory } from '../evaluate-filter/filter-factory'
import {
  ComparisonFilterCriteria,
  FindManyOperations,
  FindUniqueOperations,
  NumericFilterCriteria,
  StringFilterCriteria,
} from '../filter.interface'

describe('Interface Segregation Principle (ISP)', () => {
  describe('Filter Criteria Segregation', () => {
    it('should allow using only comparison operators', () => {
      // Cliente que solo necesita operadores de comparación
      const comparisonCriteria: ComparisonFilterCriteria<{
        name: string
        age: number
      }> = {
        equals: 'Alice',
        in: ['Bob', 'Charlie'],
      }

      // No tiene acceso a operadores de string, numéricos, etc.
      // comparisonCriteria.contains = 'test' // Esto sería un error de TypeScript

      const factory = new FilterFactory()
      const filter = factory.createComparisonFilter(comparisonCriteria)
      expect(filter).toHaveProperty('evaluate')
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should allow using only string operators', () => {
      // Cliente que solo necesita operadores de string
      const stringCriteria: StringFilterCriteria<{ name: string }> = {
        contains: 'test',
        startsWith: 'A',
        mode: 'insensitive',
      }

      // No tiene acceso a operadores numéricos, de fecha, etc.
      // stringCriteria.gt = 10 // Esto sería un error de TypeScript

      const factory = new FilterFactory()
      const filter = factory.createStringFilter(stringCriteria)
      expect(filter).toHaveProperty('evaluate')
      expect(typeof filter.evaluate).toBe('function')
    })

    it('should allow using only numeric operators', () => {
      // Cliente que solo necesita operadores numéricos
      const numericCriteria: NumericFilterCriteria<{ age: number }> = {
        gt: 18,
        lte: 65,
      }

      // No tiene acceso a operadores de string, fecha, etc.
      // numericCriteria.contains = 'test' // Esto sería un error de TypeScript

      const factory = new FilterFactory()
      const filter = factory.createNumericFilter(numericCriteria)
      expect(filter).toHaveProperty('evaluate')
      expect(typeof filter.evaluate).toBe('function')
    })
  })

  describe('Operations Segregation', () => {
    it('should allow using only findMany operations', () => {
      // Cliente que solo necesita búsquedas múltiples
      const findManyOnly: FindManyOperations<{ id: number; name: string }> = {
        findMany: () => ({ data: [], pagination: undefined }),
      }

      // No tiene acceso a findUnique
      // findManyOnly.findUnique = () => null // Esto sería un error de TypeScript

      const result = findManyOnly.findMany({ where: { id: { equals: 1 } } })
      expect(result).toHaveProperty('data')
    })

    it('should allow using only findUnique operations', () => {
      // Cliente que solo necesita búsquedas únicas
      const findUniqueOnly: FindUniqueOperations<{ id: number; name: string }> =
        {
          findUnique: () => null,
        }

      // No tiene acceso a findMany
      // findUniqueOnly.findMany = () => ({ data: [] }) // Esto sería un error de TypeScript

      const result = findUniqueOnly.findUnique({ where: { id: { equals: 1 } } })
      expect(result).toBeNull()
    })
  })

  describe('Filter Factory with ISP', () => {
    it('should create specific filter types', () => {
      const factory = new FilterFactory()
      const comparisonFilter = factory.createComparisonFilter({
        equals: 'test',
      })
      expect(comparisonFilter.evaluate('test')).toBe(true)
      expect(comparisonFilter.evaluate('other')).toBe(false)
    })

    it('should enforce type safety with specific criteria', () => {
      // TypeScript debería prevenir esto si las interfaces están bien segregadas
      const stringCriteria: StringFilterCriteria<{ name: string }> = {
        contains: 'test',
      }

      // Esto debería funcionar
      const factory = new FilterFactory()
      const stringFilter = factory.createStringFilter(stringCriteria)
      expect(stringFilter.evaluate('test string')).toBe(true)
    })

    it('should demonstrate ISP with specific interfaces', () => {
      // Cliente que solo necesita filtros de comparación
      const comparisonCriteria: ComparisonFilterCriteria<any> = {
        equals: 'test',
        not: 'other',
      }

      const factory = new FilterFactory()
      const filter = factory.createComparisonFilter(comparisonCriteria)

      expect(filter).toHaveProperty('evaluate')
      expect(filter.evaluate('test')).toBe(true)
      expect(filter.evaluate('other')).toBe(false)
    })

    it('should demonstrate ISP with string-specific interfaces', () => {
      // Cliente que solo necesita filtros de string
      const stringCriteria: StringFilterCriteria<any> = {
        contains: 'hello',
        mode: 'insensitive',
      }

      const factory = new FilterFactory()
      const filter = factory.createStringFilter(stringCriteria)

      expect(filter).toHaveProperty('evaluate')
      expect(filter.evaluate('Hello World')).toBe(true)
      expect(filter.evaluate('HELLO WORLD')).toBe(true)
      expect(filter.evaluate('Goodbye')).toBe(false)
    })
  })

  describe('Benefits of ISP', () => {
    it('should reduce coupling between components', () => {
      // Un componente que solo necesita comparaciones no depende de operadores de string
      function processComparisonData<T>(
        criteria: ComparisonFilterCriteria<T, keyof T>,
        data: T[]
      ): T[] {
        const factory = new FilterFactory()
        const filter = factory.createComparisonFilter(criteria)
        return data.filter((item) => filter.evaluate(item))
      }

      const result = processComparisonData({ equals: 'test' }, [
        'test',
        'other',
        'test',
      ])
      expect(result).toEqual(['test', 'test'])
    })

    it('should make testing easier with specific interfaces', () => {
      // Mock específico para operaciones de string
      const mockStringFilter: StringFilter = {
        evaluate: (value: any) =>
          typeof value === 'string' && value.includes('test'),
      }

      expect(mockStringFilter.evaluate('test string')).toBe(true)
      expect(mockStringFilter.evaluate('other string')).toBe(false)
    })
  })
})
