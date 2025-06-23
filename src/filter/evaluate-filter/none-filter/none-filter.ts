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
    if (isObject(this.filter) && Object.keys(this.filter).length === 0) {
      this.isEmptyFilter = true
      return
    }
    if (!isObject(this.filter) || Array.isArray(this.filter)) {
      this.evaluator = {
        evaluate: (data: any) => data === this.filter,
      }
      return
    }
    const keys = Object.keys(this.filter)
    if (keys.length === 1) {
      const key = keys[0]
      const value = this.filter[key]
      if (key === 'distinct') {
        this.isDistinct = true
        return
      }
      if (key === 'not') {
        this.isNegation = true
        this.evaluator = createFilterClassMap(key as any, value)
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
    if (data === null || data === undefined) return true
    if (!Array.isArray(data)) return false
    if (data.length === 0) return true
    if (this.isDistinct) return false
    if (this.isEmptyFilter) {
      return false
    }
    if (this.evaluator) {
      return !data.some((item) => {
        if (item == null) return false
        return this.evaluator!.evaluate(item)
      })
    }
    return true
  }
}
