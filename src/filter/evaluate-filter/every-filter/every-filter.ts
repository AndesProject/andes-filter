import { isObject } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

const OPERATORS = [
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
export class EveryFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isPrimitive: boolean = false
  private isSimpleObject: boolean = false
  private isEmptyFilter: boolean = false
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
      isObject(this.filter) &&
      !Array.isArray(this.filter) &&
      this.filter !== null &&
      Object.keys(this.filter).length > 0
    ) {
      const keys = Object.keys(this.filter)
      if (keys.length === 1 && OPERATORS.includes(keys[0])) {
        this.evaluator = new FilterEvaluator(this.filter)
      } else {
        const allKeysAreOperators = keys.every((key) => OPERATORS.includes(key))
        if (allKeysAreOperators) {
          this.evaluator = new FilterEvaluator(this.filter)
        } else {
          const hasOnlyPrimitiveValues = keys.every(
            (key) =>
              typeof this.filter[key] !== 'object' || this.filter[key] === null
          )
          if (hasOnlyPrimitiveValues) {
            this.isSimpleObject = true
          } else {
            this.evaluator = new FilterEvaluator(this.filter)
          }
        }
      }
    } else if (typeof this.filter !== 'object' || this.filter === null) {
      this.isPrimitive = true
    }
  }
  public evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false
    if (data.length === 0) {
      return true
    }
    if (this.isEmptyFilter) {
      return true
    }
    return data.every((item) => {
      if (item == null) return false
      if (this.isSimpleObject) {
        if (typeof item !== 'object' || item === null) return false
        return Object.keys(this.filter).every(
          (key) => item[key] === this.filter[key]
        )
      }
      if (this.evaluator) {
        return this.evaluator.evaluate(item)
      }
      if (this.isPrimitive) {
        return item === this.filter
      }
      return false
    })
  }
}
