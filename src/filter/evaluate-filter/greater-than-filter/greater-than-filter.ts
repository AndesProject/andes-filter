import { isNil, isValidDate } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter {
  private thresholdValue: any

  constructor(thresholdValue: any) {
    this.thresholdValue = thresholdValue
  }

  evaluate(actualValue: any): boolean {
    if (isNil(actualValue) || isNil(this.thresholdValue)) return false

    if (
      typeof actualValue === 'number' &&
      typeof this.thresholdValue === 'number'
    ) {
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

    if (
      typeof actualValue === 'string' &&
      typeof this.thresholdValue === 'string'
    ) {
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

    if (
      typeof actualValue === 'string' &&
      typeof this.thresholdValue === 'number'
    ) {
      const numericValue = parseFloat(actualValue)
      if (!isNaN(numericValue)) return numericValue > this.thresholdValue
      return actualValue > this.thresholdValue.toString()
    }

    if (
      typeof actualValue === 'number' &&
      typeof this.thresholdValue === 'string'
    ) {
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
