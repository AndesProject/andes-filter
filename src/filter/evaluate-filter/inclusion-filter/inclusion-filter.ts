import {
  compareDateValues,
  compareStringsWithCase,
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

  evaluate(actualValue: T): boolean {
    if (!Array.isArray(this.allowedValues) || this.allowedValues.length === 0)
      return false

    for (const allowedValue of this.allowedValues) {
      if (
        typeof actualValue === 'number' &&
        typeof allowedValue === 'number' &&
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
        typeof actualValue === 'object' &&
        actualValue !== null &&
        typeof allowedValue === 'object' &&
        allowedValue !== null
      ) {
        if (actualValue === allowedValue) return true
        continue
      }

      if (typeof actualValue === 'string' && typeof allowedValue === 'string') {
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

      if (actualValue === allowedValue) return true
    }
    return false
  }
}
