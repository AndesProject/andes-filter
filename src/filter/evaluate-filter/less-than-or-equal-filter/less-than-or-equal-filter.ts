import {
  isNil,
  isNumber,
  isString,
  isValidDate,
} from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class LessThanOrEqualFilter implements EvaluateFilter {
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
      return actualValue <= this.thresholdValue
    }
    if (isValidDate(actualValue) && isValidDate(this.thresholdValue)) {
      return (
        new Date(actualValue).getTime() <=
        new Date(this.thresholdValue).getTime()
      )
    }
    if (isString(actualValue) && isString(this.thresholdValue)) {
      const firstDate = new Date(actualValue)
      const secondDate = new Date(this.thresholdValue)
      const isFirstDateValid = !isNaN(firstDate.getTime())
      const isSecondDateValid = !isNaN(secondDate.getTime())
      if (isFirstDateValid && isSecondDateValid) {
        return firstDate.getTime() <= secondDate.getTime()
      }
      if (isFirstDateValid !== isSecondDateValid) return false
      return actualValue <= this.thresholdValue
    }
    try {
      return actualValue <= this.thresholdValue
    } catch {
      return false
    }
  }
}
