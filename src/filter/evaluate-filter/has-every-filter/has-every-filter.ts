import {
  allItemsMatch,
  anyItemMatches,
  isNumber,
  isObject,
  isString,
} from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class HasEveryFilter<T> implements EvaluateFilter {
  private filterEvaluators: FilterEvaluator<any>[] = []
  constructor(private requiredValues: T[]) {
    if (
      this.requiredValues.length > 0 &&
      isObject(this.requiredValues[0]) &&
      this.requiredValues[0] !== null
    ) {
      this.filterEvaluators = this.requiredValues.map(
        (requiredValue) => new FilterEvaluator(requiredValue as any)
      )
    }
  }
  public evaluate(arrayValue: any): boolean {
    if (!Array.isArray(arrayValue)) return false
    if (arrayValue.length === 0) return this.requiredValues.length === 0
    if (this.requiredValues.length === 0) return true
    if (this.requiredValues.length === 1 && isObject(this.requiredValues[0])) {
      const singleEvaluator = new FilterEvaluator(this.requiredValues[0] as any)
      return allItemsMatch(arrayValue, (item) => singleEvaluator.evaluate(item))
    }
    if (this.filterEvaluators.length > 0) {
      return this.filterEvaluators.every((evaluator) => {
        return anyItemMatches(arrayValue, (item) => evaluator.evaluate(item))
      })
    }
    if (
      this.requiredValues.some(
        (requiredValue) => isObject(requiredValue) && requiredValue !== null
      )
    ) {
      return this.requiredValues.every((requiredValue) => {
        return anyItemMatches(arrayValue, (item) =>
          matchesFilter(requiredValue as any, item)
        )
      })
    }
    for (const required of this.requiredValues) {
      let found = false
      for (const item of arrayValue) {
        if (
          (isString(item) && isNumber(required)) ||
          (isNumber(item) && isString(required))
        ) {
          continue
        }
        if (isObject(item) && isObject(required)) {
          if (item === required) {
            found = true
            break
          }
        } else if (item === required) {
          found = true
          break
        }
      }
      if (!found) return false
    }
    return true
  }
}
