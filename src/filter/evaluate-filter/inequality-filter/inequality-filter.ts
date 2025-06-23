import { FilterCriteria } from '../../filter.interface'
import { isObject, isString } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'
import { NoneFilter } from '../none-filter/none-filter'
import { SomeFilter } from '../some-filter/some-filter'

export class InequalityFilter<T> implements EvaluateFilter {
  private evaluator: EvaluateFilter | null = null
  private shouldNegate: boolean = false
  private insensitive: boolean = false
  private modeInsensitive: boolean = false
  private isDistinct: boolean = false
  private rawTarget: any = null
  private isArrayEquivalence: boolean = false
  constructor(
    private targetValue: T | FilterCriteria<T> | null,
    insensitive?: boolean
  ) {
    this.insensitive = !!insensitive
    this.rawTarget = targetValue
    if (
      isObject(targetValue) &&
      targetValue !== null &&
      'mode' in targetValue &&
      (targetValue as any).mode === 'insensitive'
    ) {
      this.modeInsensitive = true
    }
    if (
      this.targetValue &&
      isObject(this.targetValue) &&
      !Array.isArray(this.targetValue) &&
      this.targetValue !== null
    ) {
      const keys = Object.keys(this.targetValue)
      if (keys.length === 1) {
        const key = keys[0]
        const value = (this.targetValue as any)[key]
        if (key === 'distinct') {
          this.isDistinct = true
          return
        }
        if (key === 'some') {
          this.evaluator = new NoneFilter(value)
          this.isArrayEquivalence = true
          return
        } else if (key === 'none') {
          this.evaluator = new SomeFilter(value)
          this.isArrayEquivalence = true
          return
        } else if (key === 'every') {
          this.evaluator = {
            evaluate: (arr: any) => {
              if (!Array.isArray(arr) || arr.length === 0) return false
              return arr.some(
                (item: any) => !new FilterEvaluator(value).evaluate(item)
              )
            },
          }
          this.isArrayEquivalence = true
          return
        }
        let subInsensitive = this.insensitive || this.modeInsensitive
        if (
          isObject(value) &&
          value !== null &&
          'mode' in value &&
          value.mode === 'insensitive'
        ) {
          subInsensitive = true
        }
        this.evaluator = createFilterClassMap(key as any, value, subInsensitive)
      }
    }
  }
  public evaluate(value: any): boolean {
    if (this.isDistinct) return false
    if (this.evaluator) {
      if (
        this.evaluator instanceof SomeFilter &&
        this.shouldNegate === false &&
        Array.isArray(value) &&
        value.length === 0
      ) {
        return false
      }
      if (this.isArrayEquivalence) {
        return this.evaluator.evaluate(value)
      }
      return !this.evaluator.evaluate(value)
    }
    if (
      this.targetValue &&
      isObject(this.targetValue) &&
      !Array.isArray(this.targetValue) &&
      this.targetValue !== null &&
      Object.keys(this.targetValue).some((k) =>
        [
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
        ].includes(k)
      )
    ) {
      return !new FilterEvaluator(
        this.targetValue as FilterCriteria<T>
      ).evaluate(value)
    }
    if (this.targetValue instanceof Date && value instanceof Date) {
      return this.targetValue.getTime() !== value.getTime()
    }
    if (this.targetValue instanceof Date || value instanceof Date) {
      const date1 =
        this.targetValue instanceof Date
          ? this.targetValue
          : new Date(this.targetValue as any)
      const date2 = value instanceof Date ? value : new Date(value)
      return date1.getTime() !== date2.getTime()
    }
    if (Number.isNaN(this.targetValue) || Number.isNaN(value))
      return !(Number.isNaN(this.targetValue) && Number.isNaN(value))
    if (isString(this.targetValue) && isString(value)) {
      if (this.insensitive || this.modeInsensitive) {
        return this.targetValue.toLowerCase() !== value.toLowerCase()
      }
      return this.targetValue !== value
    }
    if (
      isObject(this.targetValue) &&
      this.targetValue !== null &&
      isObject(value) &&
      value !== null
    ) {
      return this.targetValue !== value
    }
    return value !== this.targetValue
  }
}
