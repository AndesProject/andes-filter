import { DateOrNumber } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class BeforeFilter implements EvaluateFilter {
  private referenceDate: Date

  constructor(referenceDate: DateOrNumber) {
    this.referenceDate = new Date(referenceDate)
  }

  public evaluate(value: DateOrNumber): boolean {
    const dateValue = new Date(value)
    return dateValue < this.referenceDate
  }
}
