import {
  isNil,
  isNumber,
  isString,
  isValidDate,
} from '../../utils/filter.helpers'
import { EvaluateFilter, NumericFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter, NumericFilter {
  private thresholdValue: any
  constructor(thresholdValue: any) {
    this.thresholdValue = thresholdValue
  }
  public evaluate(actualValue: any): boolean {
    if (isNil(actualValue) || isNil(this.thresholdValue)) return false

    // Check for mixed types (string vs number) - return false
    if (
      (isString(actualValue) && isNumber(this.thresholdValue)) ||
      (isNumber(actualValue) && isString(this.thresholdValue))
    ) {
      return false
    }

    if (isNumber(actualValue) && isNumber(this.thresholdValue)) {
      if (Number.isNaN(actualValue) || Number.isNaN(this.thresholdValue))
        return false

      return actualValue > this.thresholdValue
    }

    if (isValidDate(actualValue) && isValidDate(this.thresholdValue)) {
      return (
        new Date(actualValue).getTime() >
        new Date(this.thresholdValue).getTime()
      )
    }

    if (isString(actualValue) && isString(this.thresholdValue)) {
      // Si una cadena representa fecha válida y la otra no, no son comparables
      const isFirstDateValid = !isNaN(new Date(actualValue).getTime())

      const isSecondDateValid = !isNaN(new Date(this.thresholdValue).getTime())

      if (isFirstDateValid !== isSecondDateValid) return false

      return actualValue > this.thresholdValue
    }

    try {
      return actualValue > this.thresholdValue
    } catch {
      return false
    }
  }
}
