import { DateOrNumber } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class BetweenFilter implements EvaluateFilter {
  private startDate: Date
  private endDate: Date

  constructor(dates: [DateOrNumber, DateOrNumber]) {
    this.startDate = new Date(dates[0])
    this.endDate = new Date(dates[1])
  }

  evaluate(value: DateOrNumber): boolean {
    if (value === null || value === undefined) return false
    if (
      this.startDate == null ||
      this.endDate == null ||
      isNaN(this.startDate.getTime()) ||
      isNaN(this.endDate.getTime())
    )
      return false
    const dateValue = new Date(value)
    if (isNaN(dateValue.getTime())) return false
    return dateValue >= this.startDate && dateValue <= this.endDate
  }
}
