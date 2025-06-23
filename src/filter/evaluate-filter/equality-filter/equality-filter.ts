import { isObject, isString } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class EqualityFilter implements EvaluateFilter {
  constructor(
    private expectedValue: any,
    private isCaseInsensitive: boolean = false
  ) {}

  evaluate(actualValue: any): boolean {
    if (this.expectedValue === null && actualValue === null) return true
    if (this.expectedValue === undefined && actualValue === undefined)
      return true

    if (this.expectedValue === null || this.expectedValue === undefined)
      return false
    if (actualValue === null || actualValue === undefined) return false

    if (isString(this.expectedValue) && isString(actualValue)) {
      if (this.isCaseInsensitive) {
        return this.expectedValue.toLowerCase() === actualValue.toLowerCase()
      }
      return this.expectedValue === actualValue
    }

    if (this.expectedValue instanceof Date && actualValue instanceof Date) {
      return this.expectedValue.getTime() === actualValue.getTime()
    }

    if (this.expectedValue instanceof Date || actualValue instanceof Date) {
      const firstDate =
        this.expectedValue instanceof Date
          ? this.expectedValue
          : new Date(this.expectedValue)
      const secondDate =
        actualValue instanceof Date ? actualValue : new Date(actualValue)
      return firstDate.getTime() === secondDate.getTime()
    }

    if (Number.isNaN(this.expectedValue) || Number.isNaN(actualValue))
      return false

    if (
      isObject(this.expectedValue) &&
      this.expectedValue !== null &&
      isObject(actualValue) &&
      actualValue !== null
    ) {
      return this.expectedValue === actualValue
    }

    return actualValue === this.expectedValue
  }
}
