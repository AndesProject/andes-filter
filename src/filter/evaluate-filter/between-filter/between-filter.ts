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
    const dateValue = new Date(value)
    return dateValue >= this.startDate && dateValue <= this.endDate
  }
}
