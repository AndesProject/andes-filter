import {
  isNil,
  isNumber,
  isString,
  isValidDate,
} from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter {
  private thresholdValue: any
  constructor(thresholdValue: any) {
    this.thresholdValue = thresholdValue
  }
  public evaluate(actualValue: any): boolean {
    if (isNil(actualValue) || isNil(this.thresholdValue)) return false
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
      const firstDate = new Date(actualValue)
      const secondDate = new Date(this.thresholdValue)
      const isFirstDateValid = !isNaN(firstDate.getTime())
      const isSecondDateValid = !isNaN(secondDate.getTime())
      if (isFirstDateValid && isSecondDateValid) {
        return firstDate.getTime() > secondDate.getTime()
      }
      if (isFirstDateValid !== isSecondDateValid) return false
      return actualValue > this.thresholdValue
    }
    if (isString(actualValue) && isNumber(this.thresholdValue)) {
      const numericValue = parseFloat(actualValue)
      if (!isNaN(numericValue)) return numericValue > this.thresholdValue
      return actualValue > this.thresholdValue.toString()
    }
    if (isNumber(actualValue) && isString(this.thresholdValue)) {
      const numericThreshold = parseFloat(this.thresholdValue)
      if (!isNaN(numericThreshold)) return actualValue > numericThreshold
      return actualValue.toString() > this.thresholdValue
    }
    try {
      return actualValue > this.thresholdValue
    } catch {
      return false
    }
  }
}
