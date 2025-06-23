import { isObject } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'

export class SomeFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isEmptyFilter: boolean = false
  private isNegation: boolean = false
  constructor(private filter: any) {
    if (
      isObject(this.filter) &&
      !Array.isArray(this.filter) &&
      this.filter !== null &&
      Object.keys(this.filter).length === 0
    ) {
      this.isEmptyFilter = true
      return
    }
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
    const keys = Object.keys(this.filter)
    if (keys.length === 1) {
      const key = keys[0]
      const value = (this.filter as Record<string, any>)[key]
      if (key === 'not') {
        this.isNegation = true
        if (isObject(value) && !Array.isArray(value) && value !== null) {
          const innerKeys = Object.keys(value)
          if (innerKeys.length === 1) {
            const innerKey = innerKeys[0]
            const innerValue = (value as Record<string, any>)[innerKey]
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
        this.evaluator = new FilterEvaluator(this.filter)
      }
    } else if (keys.length > 1) {
      this.evaluator = new FilterEvaluator(this.filter)
    }
  }
  public evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false
    if (this.isEmptyFilter) {
      return data.some(
        (item) => item !== null && item !== undefined && isObject(item)
      )
    }
    if (this.isNegation) {
      return data.some((item) => {
        if (item == null) return false
        return !this.evaluator!.evaluate(item)
      })
    }
    if (this.evaluator) {
      return data.some((item) => {
        if (item == null) return false
        return this.evaluator!.evaluate(item)
      })
    }
    return data.some((item) => item === this.filter)
  }
}
