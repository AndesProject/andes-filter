import { DateOrNumber } from '../../filter.interface'
import { isValidDate } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class AfterFilter implements EvaluateFilter {
  private thresholdDate: Date
  constructor(thresholdDate: DateOrNumber) {
    this.thresholdDate = new Date(thresholdDate)
  }
  public evaluate(actualValue: DateOrNumber): boolean {
    if (actualValue === null || actualValue === undefined) return false
    if (this.thresholdDate == null || isNaN(this.thresholdDate.getTime()))
      return false
    if (!isValidDate(actualValue)) return false
    const parsedDate = new Date(actualValue)
    if (isNaN(parsedDate.getTime())) return false
    return parsedDate > this.thresholdDate
  }
}
