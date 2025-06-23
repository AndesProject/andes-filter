import { isObject } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'

export class SomeFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isEmptyFilter: boolean = false
  private isNegation: boolean = false

  constructor(private filter: any) {
    // Check if it's an empty filter
    if (
      isObject(this.filter) &&
      !Array.isArray(this.filter) &&
      this.filter !== null &&
      Object.keys(this.filter).length === 0
    ) {
      this.isEmptyFilter = true
      return
    }

    // If filter is a primitive, create a simple evaluator
    if (
      typeof this.filter !== 'object' ||
      this.filter === null ||
      Array.isArray(this.filter)
    ) {
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
      if (key === 'not') {
        this.isNegation = true
        // Create evaluator with the inner filter (without 'not')
        if (isObject(value) && !Array.isArray(value) && value !== null) {
          const innerKeys = Object.keys(value)
          if (innerKeys.length === 1) {
            const innerKey = innerKeys[0]
            const innerValue = value[innerKey]
            this.evaluator = createFilterClassMap(innerKey as any, innerValue)
          } else {
            this.evaluator = new FilterEvaluator(value)
          }
        } else {
          this.evaluator = {
            evaluate: (data: any) => data === value,
          }
        }
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
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false

    // Prisma: filtro vacío sobre array de objetos retorna true si hay al menos un objeto
    if (this.isEmptyFilter) {
      return data.some(
        (item) => item !== null && item !== undefined && isObject(item)
      )
    }

    // If negation, apply NOT to the evaluation
    if (this.isNegation) {
      return data.some((item) => {
        if (item == null) return false
        return !this.evaluator!.evaluate(item)
      })
    }

    // Regular evaluation
    if (this.evaluator) {
      return data.some((item) => {
        if (item == null) return false
        return this.evaluator!.evaluate(item)
      })
    }

    // If no evaluator, use simple comparison
    return data.some((item) => item === this.filter)
  }
}
