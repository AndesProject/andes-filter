import { isObject } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'

export class NoneFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isEmptyFilter: boolean = false
  private isDistinct: boolean = false
  private isNegation: boolean = false

  constructor(private filter: any) {
    // Check if it's an empty filter
    if (isObject(this.filter) && Object.keys(this.filter).length === 0) {
      this.isEmptyFilter = true
      return
    }

    // If filter is a primitive, create a simple evaluator
    if (!isObject(this.filter) || Array.isArray(this.filter)) {
      this.evaluator = {
        evaluate: (data: any) => data === this.filter,
      }
      return
    }

    // If filter is an object with operators, create a proper evaluator
    const keys = Object.keys(this.filter)
    if (keys.length === 1) {
      const key = keys[0]
      const value = this.filter[key]

      // Handle special operators
      if (key === 'distinct') {
        this.isDistinct = true
        return
      }
      if (key === 'not') {
        this.isNegation = true
        this.evaluator = createFilterClassMap(key as any, value)
        return
      }

      // Check if this is a known filter operator
      const knownOperators = [
        'equals',
        'not',
        'in',
        'notIn',
        'lt',
        'lte',
        'gt',
        'gte',
        'contains',
        'notContains',
        'startsWith',
        'notStartsWith',
        'endsWith',
        'notEndsWith',
        'mode',
        'regex',
        'before',
        'after',
        'between',
        'has',
        'hasEvery',
        'hasSome',
        'length',
        'AND',
        'OR',
        'NOT',
        'isNull',
        'distinct',
      ]

      if (knownOperators.includes(key)) {
        this.evaluator = createFilterClassMap(key as any, value)
      } else {
        // Complex object - use FilterEvaluator
        this.evaluator = new FilterEvaluator(this.filter)
      }
    } else if (keys.length > 1) {
      // Complex filter object - use FilterEvaluator
      this.evaluator = new FilterEvaluator(this.filter)
    }
  }

  evaluate(data: any): boolean {
    // Prisma/TypeORM behavior: null/undefined arrays return true
    if (data === null || data === undefined) return true
    // Prisma/TypeORM behavior: non-arrays return false
    if (!Array.isArray(data)) return false
    // Prisma/TypeORM behavior: empty arrays return true
    if (data.length === 0) return true

    // Special case: none: { distinct: true } should always return false
    if (this.isDistinct) return false

    // Empty filter: solo retorna true si el array está vacío, null o undefined
    if (this.isEmptyFilter) {
      return false // Si el array tiene elementos, no pasa el filtro vacío
    }

    // Regular filter evaluation
    if (this.evaluator) {
      return !data.some((item) => {
        if (item == null) return false
        return this.evaluator!.evaluate(item)
      })
    }

    return true
  }
}
