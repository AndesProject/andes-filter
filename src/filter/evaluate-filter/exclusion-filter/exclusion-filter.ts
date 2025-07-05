import {
  compareDates,
  compareStrings,
  isNumber,
  isObject,
  isString,
} from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class ExclusionFilter<T> implements EvaluateFilter {
  private insensitive: boolean = false
  constructor(
    private targetValues: T[],
    insensitive?: boolean
  ) {
    this.insensitive = !!insensitive
  }
  public evaluate(value: any): boolean {
    if (!Array.isArray(this.targetValues) || this.targetValues.length === 0)
      return true
    for (const v of this.targetValues) {
      if (
        (isString(value) && isNumber(v)) ||
        (isNumber(value) && isString(v))
      ) {
        continue
      }
      if (
        isNumber(value) &&
        isNumber(v) &&
        Number.isNaN(value) &&
        Number.isNaN(v)
      )
        return false
      if (value === null && v === null) return false
      if (value === undefined && v === undefined) return false
      if (value instanceof Date && v instanceof Date) {
        if (compareDates(value, v)) return false
        continue
      }
      if (isObject(value) && value !== null && isObject(v) && v !== null) {
        if (value === v) return false
        continue
      }
      if (isString(value) && isString(v)) {
        if (compareStrings(value, v, this.insensitive)) return false
        continue
      }
      if (value === v) return false
    }
    return true
  }
}
