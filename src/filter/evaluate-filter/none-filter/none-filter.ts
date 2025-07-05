import { isObject } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap, isKnownOperator } from '../evaluate-filter.map'

export class NoneFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isEmptyFilter: boolean = false
  private isDistinct: boolean = false
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
      if (key === 'distinct') {
        this.isDistinct = true
        return
      }
      if (key === 'not') {
        this.isNegation = true
        this.evaluator = createFilterClassMap(key as any, value)
        return
      }
      if (isKnownOperator(key)) {
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
    if (this.isDistinct) {
      // Return false when there are duplicates (distinct condition is violated)
      return false
    }
    if (this.isEmptyFilter) {
      return false
    }
    if (this.isNegation) {
      return data.every((item) => {
        if (item == null) return true
        return !this.evaluator!.evaluate(item)
      })
    }
    if (this.evaluator) {
      return data.every((item) => {
        if (item == null) return true
        return !this.evaluator!.evaluate(item)
      })
    }
    return data.every((item) => item !== this.filter)
  }
}
