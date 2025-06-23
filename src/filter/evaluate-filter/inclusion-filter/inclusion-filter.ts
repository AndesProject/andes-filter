import {
  compareDateValues,
  compareStringsWithCase,
  isNumber,
  isObject,
  isString,
} from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class InclusionFilter<T> implements EvaluateFilter {
  private isCaseInsensitive: boolean = false
  constructor(
    private allowedValues: T[],
    isCaseInsensitive?: boolean
  ) {
    this.isCaseInsensitive = !!isCaseInsensitive
  }
  public evaluate(actualValue: T): boolean {
    if (!Array.isArray(this.allowedValues) || this.allowedValues.length === 0)
      return false
    for (const allowedValue of this.allowedValues) {
      if (
        isNumber(actualValue) &&
        isNumber(allowedValue) &&
        Number.isNaN(actualValue) &&
        Number.isNaN(allowedValue)
      )
        return true
      if (actualValue === null && allowedValue === null) return true
      if (actualValue === undefined && allowedValue === undefined) return true
      if (actualValue instanceof Date && allowedValue instanceof Date) {
        if (compareDateValues(actualValue, allowedValue)) return true
        continue
      }
      if (
        isObject(actualValue) &&
        actualValue !== null &&
        isObject(allowedValue) &&
        allowedValue !== null
      ) {
        if (actualValue === allowedValue) return true
        continue
      }
      if (isString(actualValue) && isString(allowedValue)) {
        if (
          compareStringsWithCase(
            actualValue,
            allowedValue,
            this.isCaseInsensitive
          )
        )
          return true
        continue
      }
      if (
        isNumber(actualValue) &&
        isNumber(allowedValue) &&
        actualValue === allowedValue
      ) {
        return true
      }
      if (actualValue === allowedValue) return true
    }
    return false
  }
}
