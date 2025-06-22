import { DateOrNumber } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class AfterFilter implements EvaluateFilter {
  private referenceDate: Date

  constructor(referenceDate: DateOrNumber) {
    this.referenceDate = new Date(referenceDate)
  }

  public evaluate(value: DateOrNumber): boolean {
    if (value === null || value === undefined) return false
    if (this.referenceDate == null || isNaN(this.referenceDate.getTime()))
      return false
    const dateValue = new Date(value)
    if (isNaN(dateValue.getTime())) return false
    return dateValue > this.referenceDate
  }
}
