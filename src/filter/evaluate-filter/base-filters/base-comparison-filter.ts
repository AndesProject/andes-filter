import { isNumber, isObject, isString } from '../../utils/filter.helpers'
import { StringNormalizer } from '../../utils/normalization'
import { EvaluateFilter } from '../evaluate-filter.interface'

export abstract class BaseComparisonFilter implements EvaluateFilter {
  public constructor(
    protected expectedValue: any,
    protected isCaseInsensitive: boolean = false
  ) {}

  public abstract evaluate(actualValue: any): boolean

  protected validateInputs(actualValue: any): boolean {
    if (this.expectedValue === null && actualValue === null) return true
    if (this.expectedValue === undefined && actualValue === undefined)
      return true
    if (this.expectedValue === null || this.expectedValue === undefined)
      return false
    if (actualValue === null || actualValue === undefined) return false

    // Evitar comparaciones mixtas string/number
    if (
      (isString(this.expectedValue) && isNumber(actualValue)) ||
      (isNumber(this.expectedValue) && isString(actualValue))
    ) {
      return false
    }

    return true
  }

  protected compareStrings(a: string, b: string): boolean {
    return StringNormalizer.compare(a, b, this.isCaseInsensitive)
  }

  protected compareDates(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime()
  }

  protected compareObjects(a: any, b: any): boolean {
    if (isObject(a) && isObject(b)) {
      const aKeys = Object.keys(a)
      const bKeys = Object.keys(b)
      if (aKeys.length !== bKeys.length) return false
      for (const key of aKeys) {
        if (!bKeys.includes(key)) return false
        if (!this.compareObjects((a as any)[key], (b as any)[key])) return false
      }
      return true
    }
    return false
  }

  protected handleDateComparison(actualValue: any): boolean | null {
    if (
      (this.expectedValue instanceof Date || isString(this.expectedValue)) &&
      (actualValue instanceof Date || isString(actualValue))
    ) {
      const dateA = new Date(this.expectedValue)
      const dateB = new Date(actualValue)
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA.getTime() === dateB.getTime()
      }
    }
    return null
  }

  protected handleNaNComparison(actualValue: any): boolean | null {
    if (Number.isNaN(this.expectedValue) || Number.isNaN(actualValue)) {
      return Number.isNaN(this.expectedValue) && Number.isNaN(actualValue)
    }
    return null
  }
}
